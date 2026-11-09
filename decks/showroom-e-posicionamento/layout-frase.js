/* ===========================================================================
   LAYOUT `frase` · SHOWROOM E POSICIONAMENTO

   Um layout a mais, só para esta apresentação, ao lado dos de
   engine/layouts.js — o motor não sabe a diferença e nada do que já existe
   muda. Por isso este arquivo é carregado DEPOIS de engine/layouts.js e
   ANTES de deck.js.

   PARA QUE ELE EXISTE

   Uma frase sozinha, em preto, centralizada. Nenhum dos treze layouts do
   motor serve: `cover` e `chapter` alinham à esquerda e carregam logo,
   numeral e rodapé; `photo` exige imagem; `split` quer duas colunas. Todos
   acrescentam algo, e aqui o que se quer é exatamente o contrário.

   O slide existe por causa de uma frase só — a que a Arkos usa contra a
   Lesco quando o cliente diz que está cotando com a gente. Ela entra crua,
   sem crédito na tela e sem análise, e o slide seguinte é que a desmonta.
   Quem apresenta diz de quem é; a tela não precisa.

   USO, no deck.js:

     {
       layout: 'frase',
       text: 'Primeira linha\nsegunda linha',   // \n = quebra de linha
       fonte: 'opcional, miúdo, embaixo'        // omitido por padrão
     }

   COMO A FRASE ENTRA

   Cada linha do `text` vira um elemento com [data-anim], e o motor numera
   esses elementos sozinho (indexAnimations, em engine/deck.js), aplicando
   um atraso de --stagger por posição. O local.css alarga esse passo para
   que as linhas cheguem uma de cada vez, em ritmo de fala, em vez de
   aparecerem quase juntas como num slide de conteúdo.

   Script clássico de propósito, como o resto do projeto: sem módulos e sem
   fetch, para a apresentação abrir com duplo clique, direto do disco.
   ======================================================================== */

(function (global) {
  'use strict';

  var L = global.DeckLayouts;
  if (!L) throw new Error('layout-frase.js precisa vir depois de engine/layouts.js');

  function h(tag, props, filhos) {
    var no = document.createElement(tag);
    props = props || {};

    Object.keys(props).forEach(function (chave) {
      var valor = props[chave];
      if (valor === null || valor === undefined || valor === false) return;
      if (chave === 'class') no.className = valor;
      else if (chave === 'text') no.textContent = valor;
      else if (chave === 'anim') no.setAttribute('data-anim', valor === true ? '' : valor);
      else no.setAttribute(chave, valor);
    });

    (filhos || []).forEach(function (filho) { if (filho) no.appendChild(filho); });
    return no;
  }

  L.frase = {
    /* `stagger`: o fundo preto entra em 340 ms e quem carrega a cena são as
       linhas. Entrar com `curtain` ou `mask` traria movimento lateral, que
       numa frase centralizada só atrapalha a leitura. */
    transition: 'stagger',
    tone: 'ink',

    render: function (s) {
      var bloco = h('blockquote', { class: 'l-frase__texto' });

      /* Uma linha por elemento, em vez de um <br> dentro de um parágrafo:
         é o que permite a revelação escalonada. O texto entra por
         textContent, nunca por innerHTML — a frase é citação de terceiro e
         não deve poder trazer marcação junto. */
      String(s.text || '').split('\n').forEach(function (linha) {
        bloco.appendChild(h('span', { class: 'l-frase__linha', text: linha, anim: true }));
      });

      return h('div', { class: 'l-frase' }, [
        bloco,
        s.fonte ? h('div', { class: 'l-frase__fonte', text: s.fonte, anim: true }) : null
      ]);
    }
  };
})(window);
