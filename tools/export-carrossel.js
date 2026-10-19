#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Exporta o carrossel de divulgação em PNG, um arquivo por quadro.

       node tools/export-carrossel.js

   Sai em export/carrossel-live/, no tamanho que o Instagram pede para o
   formato vertical: 1080 × 1350.

   Funciona igual ao export-pdf: sobe um servidor próprio numa porta
   reservada, abre o Chrome sem janela e fotografa. A diferença é que aqui
   são oito fotos, uma por quadro — o carrossel não é um documento só.
   --------------------------------------------------------------------------- */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn, execFile } = require('child_process');

const { findChrome } = require('./export-pdf.js');

const ROOT = path.resolve(__dirname, '..');
const PORT = 4398;                 /* porta própria, longe da live e do PDF */
const PAGINA = '/divulgacao/carrossel-live/index.html';
const QUADROS = 7;
const LARGURA = 1080;
const ALTURA = 1350;

function passo(texto) { console.log('  ' + texto); }

function esperarServidor(porta, tentativas = 40) {
  return new Promise((resolve, reject) => {
    const tentar = (restam) => {
      const req = http.get({ host: '127.0.0.1', port: porta, path: '/' }, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (restam <= 0) return reject(new Error('o servidor não respondeu'));
        setTimeout(() => tentar(restam - 1), 250);
      });
    };
    tentar(tentativas);
  });
}

async function exportar() {
  const chrome = findChrome();
  if (!chrome) {
    console.log('');
    console.log('  Não achei o Chrome nem o Edge nesta máquina.');
    console.log('  Se estiver instalado em outro lugar, aponte em CHROME_PATH.');
    console.log('');
    process.exit(1);
  }

  const saida = path.join(ROOT, 'export', 'carrossel-live');
  fs.mkdirSync(saida, { recursive: true });

  const servidor = spawn(process.execPath, [path.join(__dirname, 'serve.js'), String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore'
  });

  const perfil = path.join(os.tmpdir(), 'lesco-carrossel-profile');
  fs.rmSync(perfil, { recursive: true, force: true });

  const feitos = [];

  try {
    await esperarServidor(PORT);

    for (let n = 1; n <= QUADROS; n++) {
      const arquivo = path.join(saida, 'quadro-' + String(n).padStart(2, '0') + '.png');
      passo('Quadro ' + n + ' de ' + QUADROS);

      await new Promise((resolve, reject) => {
        execFile(chrome, [
          '--headless=new',
          '--disable-gpu',
          '--no-sandbox',
          '--hide-scrollbars',
          '--user-data-dir=' + perfil,
          '--force-device-scale-factor=1',
          '--window-size=' + LARGURA + ',' + ALTURA,
          /* as fotos de obra são grandes; dá tempo de chegarem antes do clique */
          '--virtual-time-budget=60000',
          '--screenshot=' + arquivo,
          'http://127.0.0.1:' + PORT + PAGINA + '?n=' + n
        ], { maxBuffer: 1 << 24 }, (err) => (err ? reject(err) : resolve()));
      });

      feitos.push({ arquivo, bytes: fs.statSync(arquivo).size });
    }
  } finally {
    servidor.kill();
    fs.rmSync(perfil, { recursive: true, force: true });
  }

  return { saida, feitos };
}

async function main() {
  console.log('');
  console.log('  Carrossel · Instalação de Revestimentos e Estruturas');
  console.log('');

  const { saida, feitos } = await exportar();

  console.log('');
  console.log('  Pronto — ' + feitos.length + ' quadros em ' + LARGURA + ' × ' + ALTURA);
  console.log('  ' + saida);
  console.log('');

  feitos.forEach((f) => {
    console.log('    ' + path.basename(f.arquivo) + '   ' + (f.bytes / 1024).toFixed(0) + ' KB');
  });

  console.log('');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('');
    console.error('  Deu problema na exportação: ' + err.message);
    console.error('');
    process.exit(1);
  });
}

module.exports = { exportar };
