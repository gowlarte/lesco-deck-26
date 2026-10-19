#!/usr/bin/env node
'use strict';

/* ---------------------------------------------------------------------------
   Define a senha do deck de números.

       node tools/senha.js

   Pergunta a senha com o eco desligado, sorteia um sal novo e grava
   decks/numeros-comerciais-china/trava-senha.js com o hash. A senha em si
   não é escrita em lugar nenhum — nem no arquivo, nem no histórico do
   terminal, nem no repositório.

   Para outra apresentação, passe a pasta:

       node tools/senha.js nome-da-pasta

   O QUE ISTO PROTEGE, E O QUE NÃO PROTEGE
     Protege a TELA de quem abre a apresentação por HTTP de outra máquina —
     o caso de compartilhar o endereço na rede do escritório. Não protege o
     ARQUIVO: quem abre decks/<pasta>/dados.js no navegador, ou lê o
     repositório, vê os números sem passar pela senha. Para fechar isso, o
     repositório precisa ser privado.

   O hash é SHA-256 repetido VOLTAS vezes sobre sal+senha. A repetição é de
   propósito: deixa a conferência em menos de um segundo no navegador e, ao
   mesmo tempo, torna lenta a tentativa de adivinhar a senha por força bruta
   a partir do hash publicado.
   --------------------------------------------------------------------------- */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const VOLTAS = 120000;
const pasta = process.argv[2] || 'numeros-comerciais-china';
const raiz = path.resolve(__dirname, '..');
const destino = path.join(raiz, 'decks', pasta, 'trava-senha.js');

if (!fs.existsSync(path.dirname(destino))) {
  console.error('Não existe a pasta decks/' + pasta);
  process.exit(1);
}

/* Mesma conta que trava.js faz no navegador. Se mudar aqui, mude lá. */
function derivar(senha, sal, voltas) {
  const bSal = Buffer.from(sal, 'utf8');
  let h = crypto.createHash('sha256')
    .update(Buffer.concat([bSal, Buffer.from(senha, 'utf8')])).digest();
  for (let i = 1; i < voltas; i++) {
    h = crypto.createHash('sha256').update(Buffer.concat([bSal, h])).digest();
  }
  return h.toString('hex');
}

/* Pergunta sem ecoar o que é digitado. Em terminal que não aceita isso
   (um pipe, por exemplo), avisa em vez de mostrar a senha na tela. */
function lerTudo() {
  return new Promise(resolve => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', d => { buf += d; });
    process.stdin.on('end', () => resolve(buf));
  });
}

function perguntar(rotulo) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const saida = process.stdout;
    let silenciar = false;

    const escrever = rl._writeToOutput;
    rl._writeToOutput = function (txt) {
      if (!silenciar) return escrever.call(rl, txt);
      if (txt.includes(rotulo)) return escrever.call(rl, rotulo);
      saida.write('');
    };

    rl.question(rotulo, resposta => { rl.close(); saida.write('\n'); resolve(resposta); });
    silenciar = true;
    rl.on('SIGINT', () => { rl.close(); reject(new Error('cancelado')); });
  });
}

(async function () {
  /* Sem terminal — a senha vem por cano, de um script. Aí não dá para
     pedir confirmação: stdin acaba na primeira leitura. */
  const interativo = process.stdin.isTTY;

  const senha = interativo
    ? (await perguntar('Senha para o deck "' + pasta + '": ')).trim()
    : (await lerTudo()).split(/\r?\n/)[0].trim();

  if (senha.length < 6) {
    console.error('\nSenha curta demais — use pelo menos 6 caracteres.');
    process.exit(1);
  }

  if (interativo) {
    const conferir = (await perguntar('Repita: ')).trim();
    if (conferir !== senha) {
      console.error('\nAs duas não bateram. Nada foi gravado.');
      process.exit(1);
    }
  }

  const sal = crypto.randomBytes(16).toString('hex');
  const t0 = Date.now();
  const hash = derivar(senha, sal, VOLTAS);

  fs.writeFileSync(destino,
`/* ---------------------------------------------------------------------------
   Senha do deck — GERADO por tools/senha.js, não edite na mão.

   Só o hash mora aqui. A senha em si não está neste arquivo nem em nenhum
   outro do repositório. Para trocar:

       node tools/senha.js ${pasta}

   O hash é público junto com o repositório, então ele é atacável offline
   por quem baixar o projeto: não reaproveite aqui uma senha usada em
   outro lugar.
   --------------------------------------------------------------------------- */

window.TRAVA_SENHA = {
  sal: '${sal}',
  voltas: ${VOLTAS},
  hash: '${hash}'
};
`);

  console.log('\nGravado em decks/' + pasta + '/trava-senha.js');
  console.log('Sal novo, ' + VOLTAS.toLocaleString('pt-BR') + ' voltas, calculado em ' + (Date.now() - t0) + ' ms.');
  console.log('A senha não foi escrita em lugar nenhum — guarde-a você.');
})().catch(e => {
  console.error('\n' + (e.message === 'cancelado' ? 'Cancelado.' : e.message));
  process.exit(1);
});
