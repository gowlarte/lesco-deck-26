/* ---------------------------------------------------------------------------
   Servidor local, sem nenhuma dependência.

       node tools/serve.js            → http://localhost:4321
       node tools/serve.js 8080       → outra porta

   A apresentação também abre com duplo clique no index.html. Este servidor
   existe para os casos em que o protocolo file:// atrapalha: alguns
   navegadores bloqueiam fontes locais fora dele, e é por HTTP que dá para
   abrir a apresentação em outro aparelho da mesma rede (celular, tablet,
   um segundo notebook) usando o IP da máquina.
   --------------------------------------------------------------------------- */

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv.find((a) => /^\d+$/.test(a))) || 4321;
const OPEN = process.argv.includes('--open');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4'
};

/* Arquivos que o navegador pede em pedaços, e não de uma vez. Vídeo entra
   aqui; foto e fonte não precisam, são pequenas perto de um filme. */
const STREAMABLE = ['.mp4', '.pdf'];

function isLoopback(req) {
  const addr = req.socket.remoteAddress || '';
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
}

/* Gera o PDF e devolve como download. Demora perto de um minuto: as fotos
   de obra são pesadas e o Chrome precisa carregar todas antes de imprimir. */
function handleExport(id, res) {
  let exportDeck;
  try {
    ({ exportDeck } = require('./export-pdf.js'));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('tools/export-pdf.js não pôde ser carregado: ' + e.message);
    return;
  }

  console.log('  Exportando PDF...');

  exportDeck(id ? decodeURIComponent(id) : undefined)
    .then((r) => {
      console.log('  PDF pronto: export/' + r.fileName + ' (' + (r.bytes / 1048576).toFixed(1) + ' MB)');
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': r.bytes,
        'Content-Disposition': 'attachment; filename="' + r.fileName + '"',
        'X-Export-File': encodeURIComponent(r.fileName)
      });
      fs.createReadStream(r.file).pipe(res);
    })
    .catch((e) => {
      console.log('  Falha na exportação: ' + e.message);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(e.message);
    });
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    /* A base é só para satisfazer o construtor — o host não é usado. */
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Caminho inválido');
    return;
  }

  /* Botão Exportar do menu. Só responde para quem está NESTA máquina: o
     servidor fica aberto na rede e gerar PDF dispara um Chrome, o que não
     pode ficar ao alcance de quem só recebeu o link para assistir. */
  if (pathname.startsWith('/__export')) {
    if (!isLoopback(req)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('A exportação só pode ser disparada do computador que apresenta.');
      return;
    }
    handleExport(pathname.split('/')[2] || '', res);
    return;
  }

  /* O navegador pede /favicon.ico por conta própria. Sem isto, todo
     carregamento deixa um 404 no console atrapalhando a leitura de erros
     de verdade. */
  if (pathname === '/favicon.ico') pathname = '/shared/brand/symbol.png';

  let target = path.join(ROOT, pathname);

  /* Impede sair da pasta do projeto por ../ na URL. */
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end('Fora do projeto');
    return;
  }

  /* O servidor fica aberto na rede local, então o que não é apresentação
     não é servido: _source guarda PDFs comerciais, manual da marca e fotos
     brutas, e nada disso precisa estar ao alcance de quem abre o link. */
  const relative = path.relative(ROOT, target).split(path.sep);
  if (relative[0] === '_source' || relative.some((part) => part.startsWith('.'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Esta pasta não é publicada.');
    return;
  }

  fs.stat(target, (err, stats) => {
    if (!err && stats.isDirectory()) target = path.join(target, 'index.html');

    fs.stat(target, (statErr, info) => {
      if (statErr || !info.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Não encontrado: ' + pathname);
        return;
      }

      const ext = path.extname(target).toLowerCase();

      /* Fotos, vídeos e fontes são pesados: não vale baixar de novo a cada
         slide. Mas também não dá para o navegador guardá-los por tempo fixo:
         trocar uma foto na pasta e continuar vendo a antiga foi exatamente o
         que aconteceu em obra. Então o cache é por VALIDAÇÃO — o navegador
         pergunta antes de usar o que tem, e leva 304 quando nada mudou.

         Código e conteúdo do deck seguem sem cache nenhum: uma correção
         feita minutos antes da live tem de aparecer na hora. */
      const validavel = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
                         '.otf', '.ttf', '.woff', '.woff2', '.mp4', '.pdf'];

      const headers = {
        'Content-Type': TYPES[ext] || 'application/octet-stream',
        'Cache-Control': validavel.includes(ext) ? 'no-cache' : 'no-store'
      };

      if (validavel.includes(ext)) {
        /* A etiqueta muda quando o tamanho ou a data do arquivo mudam. */
        const etag = '"' + info.size.toString(16) + '-' + info.mtimeMs.toString(16) + '"';
        headers.ETag = etag;
        headers['Last-Modified'] = info.mtime.toUTCString();

        const conhecida = req.headers['if-none-match'];
        const desde = req.headers['if-modified-since'];
        const igual = conhecida === etag ||
          (!conhecida && desde && Math.floor(info.mtimeMs / 1000) <= Math.floor(Date.parse(desde) / 1000));

        if (igual) {
          res.writeHead(304, { ETag: etag, 'Cache-Control': 'no-cache' });
          res.end();
          return;
        }
      }

      /* Vídeo o navegador não baixa inteiro: pede pedaço por pedaço. Sem
         resposta a Range o Safari do iPhone nem começa a tocar e ninguém
         consegue arrastar a barra — e é justamente pelo celular que as
         pessoas assistem quando o endereço é compartilhado na rede. */
      if (!STREAMABLE.includes(ext)) {
        fs.readFile(target, (readErr, data) => {
          if (readErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Não encontrado: ' + pathname);
            return;
          }
          res.writeHead(200, headers);
          res.end(data);
        });
        return;
      }

      headers['Accept-Ranges'] = 'bytes';

      const pedido = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || '').trim());

      if (!pedido) {
        headers['Content-Length'] = info.size;
        res.writeHead(200, headers);
        fs.createReadStream(target).pipe(res);
        return;
      }

      let inicio = pedido[1] === '' ? null : parseInt(pedido[1], 10);
      let fim = pedido[2] === '' ? null : parseInt(pedido[2], 10);

      if (inicio === null) {
        /* "bytes=-500" quer dizer os últimos 500 bytes. */
        inicio = fim === null ? null : Math.max(0, info.size - fim);
        fim = info.size - 1;
      } else if (fim === null || fim >= info.size) {
        fim = info.size - 1;
      }

      if (inicio === null || inicio > fim || inicio >= info.size) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + info.size });
        res.end();
        return;
      }

      headers['Content-Range'] = 'bytes ' + inicio + '-' + fim + '/' + info.size;
      headers['Content-Length'] = fim - inicio + 1;
      res.writeHead(206, headers);
      fs.createReadStream(target, { start: inicio, end: fim }).pipe(res);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('');
    console.log('  A porta ' + PORT + ' já está em uso.');
    console.log('  Provavelmente o servidor já está rodando: abra http://localhost:' + PORT);
    console.log('  Se preferir outra porta:  node tools/serve.js 4322');
    console.log('');
    process.exit(1);
  }
  throw err;
});

/* Endereços IPv4 desta máquina na rede local, para quem for assistir de
   outro aparelho. */
function lanAddresses() {
  const found = [];
  const interfaces = os.networkInterfaces();

  Object.keys(interfaces).forEach((name) => {
    (interfaces[name] || []).forEach((entry) => {
      if (entry.family === 'IPv4' && !entry.internal) found.push(entry.address);
    });
  });

  return found;
}

/* Sem host explícito, o Node escuta em todas as interfaces — é o que
   permite abrir a apresentação pelo celular na mesma rede. */
server.listen(PORT, () => {
  const address = 'http://localhost:' + PORT;
  const lan = lanAddresses();

  console.log('');
  console.log('  Apresentações Lesco');
  console.log('');
  console.log('  Nesta máquina:   ' + address);

  if (lan.length) {
    console.log('');
    console.log('  Na mesma rede (compartilhe este endereço):');
    lan.forEach((ip) => console.log('    http://' + ip + ':' + PORT));
    console.log('');
    console.log('  Na primeira vez o Windows pode pedir para liberar o Node');
    console.log('  no firewall. Autorize para REDES PRIVADAS.');
  } else {
    console.log('');
    console.log('  Nenhuma rede local detectada - so este computador tera acesso.');
  }

  console.log('');
  console.log('  Deixe esta janela aberta durante a live.');
  console.log('  Ctrl+C para encerrar.');
  console.log('');

  /* O navegador só abre depois que o servidor já está ouvindo — abrir antes
     daria "conexão recusada" e exigiria recarregar a página na mão. */
  if (OPEN) {
    const command = process.platform === 'win32' ? 'start ""' :
                    process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(command + ' "' + address + '"');
  }
});
