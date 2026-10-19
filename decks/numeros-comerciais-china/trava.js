/* ===========================================================================
   TRAVA DO DECK DE NÚMEROS

   Pede a senha antes de deixar a apresentação montar. Só este deck tem
   trava; a live técnica abre direto, como sempre.

   O QUE ELA PROTEGE
     A TELA, para quem abre a apresentação de OUTRA máquina — o caso de
     compartilhar `http://192.168.x.x:4321` na rede do escritório para
     alguém dar retorno.

   O QUE ELA NÃO PROTEGE
     O ARQUIVO. `dados.js` continua sendo um .js servido ao lado, e quem
     digitar o endereço dele no navegador lê os números sem passar por
     aqui. O mesmo vale para quem abre o repositório. Isso não é falha de
     implementação: é o limite de qualquer senha em site estático, onde o
     conteúdo precisa chegar ao navegador para ser desenhado. Fechar isso
     de verdade é tornar o repositório privado.

   QUANDO ELA NÃO PEDE NADA
     Em `file://`, `localhost` e `127.0.0.1` a trava sai do caminho. Quem
     está nesses endereços já tem os arquivos na mão — pedir senha ali
     seria encenação, e ainda quebraria a exportação em PDF, que abre
     `http://127.0.0.1:4321/...?export` num Chrome sem interface.
     Para ver a tela de senha mesmo estando local, acrescente `?trancar`.

   COMO O MOTOR SÓ ARRANCA DEPOIS
     engine/deck.js NÃO está no index.html. Quem o carrega é este arquivo,
     injetando a tag <script> depois que a senha confere. Enquanto não
     confere, não existe slide nenhum no documento para ser inspecionado.
   ======================================================================== */

(function (global) {
  'use strict';

  var MOTOR = '../../engine/deck.js';
  var CHAVE = 'lesco:trava:' + location.pathname;   /* por apresentação */

  /* ---------------------------------------------------------------------
     SHA-256, em JavaScript puro.

     Não dá para usar crypto.subtle: ele só existe em contexto seguro, e
     `http://192.168.0.10:4321` — exatamente o endereço que esta trava
     existe para proteger — não é contexto seguro. Então vai à mão.
     --------------------------------------------------------------------- */

  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  /* Uint8Array → Uint8Array(32) */
  function sha256(msg) {
    var H = new Int32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);

    var tam = msg.length;
    var bloco = new Uint8Array((((tam + 9) + 63) >> 6) << 6);
    bloco.set(msg);
    bloco[tam] = 0x80;

    var dv = new DataView(bloco.buffer);
    var bits = tam * 8;
    dv.setUint32(bloco.length - 8, Math.floor(bits / 4294967296));
    dv.setUint32(bloco.length - 4, bits >>> 0);

    var w = new Int32Array(64);
    var i, off;

    for (off = 0; off < bloco.length; off += 64) {
      for (i = 0; i < 16; i++) w[i] = dv.getInt32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var x = w[i - 15], y = w[i - 2];
        var s0 = rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
        var s1 = rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0;
        d = c; c = b; b = a; a = (t1 + t2) | 0;
      }

      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

    var saida = new Uint8Array(32);
    var sv = new DataView(saida.buffer);
    for (i = 0; i < 8; i++) sv.setInt32(i * 4, H[i]);
    return saida;
  }

  function utf8(texto) {
    var s = unescape(encodeURIComponent(texto));
    var b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  }

  function juntar(a, b) {
    var r = new Uint8Array(a.length + b.length);
    r.set(a, 0); r.set(b, a.length);
    return r;
  }

  function hex(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return s;
  }

  /* Mesma conta de tools/senha.js. Se mudar aqui, mude lá. */
  function derivar(senha, sal, voltas) {
    var bSal = utf8(sal);
    var h = sha256(juntar(bSal, utf8(senha)));
    for (var i = 1; i < voltas; i++) h = sha256(juntar(bSal, h));
    return hex(h);
  }

  /* Comparação em tempo constante. Numa trava local isto é quase
     simbólico, mas é barato e evita ensinar o padrão errado. */
  function iguais(a, b) {
    if (a.length !== b.length) return false;
    var dif = 0;
    for (var i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return dif === 0;
  }

  /* ---------------------------------------------------------------------
     Decisão e tela
     --------------------------------------------------------------------- */

  function local() {
    var h = location.hostname;
    return location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '';
  }

  function destravado() {
    try { return sessionStorage.getItem(CHAVE) === '1'; } catch (e) { return false; }
  }

  function lembrar() {
    try { sessionStorage.setItem(CHAVE, '1'); } catch (e) { /* aba anônima */ }
  }

  function arrancarMotor() {
    document.body.classList.remove('trancado');
    var s = document.createElement('script');
    s.src = MOTOR;
    document.body.appendChild(s);
  }

  function pedirSenha() {
    var cfg = global.TRAVA_SENHA;
    var tela = document.querySelector('.trava');
    var campo = tela.querySelector('.trava__campo');
    var botao = tela.querySelector('.trava__botao');
    var erro = tela.querySelector('.trava__erro');

    document.body.classList.add('trancado');
    tela.hidden = false;
    campo.focus();

    function errar(msg) {
      erro.textContent = msg;
      tela.classList.add('is-erro');
      botao.disabled = false;
      botao.textContent = botao.getAttribute('data-rotulo');
      campo.select();
      global.setTimeout(function () { tela.classList.remove('is-erro'); }, 600);
    }

    function conferir(e) {
      if (e) e.preventDefault();
      var senha = campo.value;
      if (!senha) return;

      erro.textContent = '';
      botao.disabled = true;
      botao.textContent = 'Checking…';

      /* Dois quadros antes de calcular: sem isso o botão não chega a
         redesenhar e a tela parece travada durante as 120 mil voltas. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var ok;
          try {
            ok = iguais(derivar(senha, cfg.sal, cfg.voltas), cfg.hash);
          } catch (err) {
            return errar('Could not verify on this browser.');
          }

          if (!ok) return errar('Wrong password.');

          lembrar();
          tela.classList.add('is-aberto');
          global.setTimeout(function () {
            tela.hidden = true;
            arrancarMotor();
          }, 420);
        });
      });
    }

    botao.setAttribute('data-rotulo', botao.textContent);
    botao.addEventListener('click', conferir);
    tela.querySelector('.trava__form').addEventListener('submit', conferir);
  }

  function comecar() {
    var temConfig = global.TRAVA_SENHA && global.TRAVA_SENHA.hash;
    var forcar = /[?&]trancar\b/.test(location.search);

    /* Sem trava-senha.js não há senha definida: melhor abrir do que
       deixar a apresentação inacessível na hora de apresentar. */
    if (!temConfig || (local() && !forcar) || destravado()) return arrancarMotor();

    pedirSenha();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', comecar);
  } else {
    comecar();
  }

})(window);
