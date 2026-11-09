/* ===========================================================================
   SCRIPT PRÓPRIO · SHOWROOM E POSICIONAMENTO

   O que esta apresentação acrescenta ao motor, e só ela. engine/layouts.js
   continua como está, e as outras apresentações não sabem que isto existe.
   Por isso este arquivo é carregado DEPOIS de engine/layouts.js e ANTES de
   deck.js.

     1 · o layout `frase`, que o motor não tem
     2 · o realce de um trecho no rodapé do `split`

   (Este arquivo chamava-se layout-frase.js enquanto só fazia a primeira
   coisa, como local.css chamava-se frase.css. Os dois andam juntos: o que
   está declarado aqui é desenhado lá.)

   Script clássico de propósito, como o resto do projeto: sem módulos e sem
   fetch, para a apresentação abrir com duplo clique, direto do disco.
   ======================================================================== */

(function (global) {
  'use strict';

  var L = global.DeckLayouts;
  if (!L) throw new Error('local.js precisa vir depois de engine/layouts.js');

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


  /* =====================================================================
     1 · LAYOUT `frase`

     Uma frase sozinha, em preto, centralizada. Nenhum dos treze layouts do
     motor serve: `cover` e `chapter` alinham à esquerda e carregam logo,
     numeral e rodapé; `photo` exige imagem; `split` quer duas colunas.
     Todos acrescentam algo, e aqui o que se quer é exatamente o contrário.

     O slide existe por causa de uma frase só — a que a Arkos usa contra a
     Lesco quando o cliente diz que está cotando com a gente. Ela entra
     crua, sem crédito na tela e sem análise, e o slide seguinte é que a
     desmonta. Quem apresenta diz de quem é; a tela não precisa.

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
     ===================================================================== */

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


  /* =====================================================================
     2 · REALCE DE UM TRECHO NO RODAPÉ DO `split`

     USO, no deck.js: marque o trecho com dois asteriscos de cada lado.

       note: 'A diferença está na pergunta. **Onde está o pedido** é dado
              que falta.'

     POR QUE ISTO PRECISA EXISTIR

     Porque o motor escapa HTML, e faz muito bem. O `breaks()` de
     engine/layouts.js troca `&`, `<` e `>` por entidades antes de escrever
     no innerHTML — "o conteúdo do deck é texto, não HTML", diz o comentário
     de lá. Um <strong> escrito no deck.js apareceria na tela como
     <strong>, literalmente, e é isso que se quer na esmagadora maioria dos
     casos: o conteúdo é texto digitado por quem monta a apresentação, não
     marcação.

     Então o realce não passa por HTML nenhum. O `split` do motor renderiza
     normalmente, com todo o escape que ele já faz, e só depois este código
     percorre os nós de texto do rodapé já pronto, parte nos asteriscos e
     troca os pedaços ímpares por um <strong> criado com createElement e
     preenchido por textContent. Nada aqui interpreta marcação; os
     asteriscos são apenas onde cortar.

     O MOTOR NÃO MUDA

     Este arquivo envolve `L.split` em vez de alterá-lo: guarda o original,
     chama o render dele e mexe só no que voltou. Como o arquivo é carregado
     apenas aqui, as outras apresentações seguem com o `split` intocado, e
     este deck continua escrevendo `layout: 'split'` como sempre escreveu.

     Sem asteriscos no `note`, nada acontece — e os dez outros slides em
     `split` deste deck passam por aqui sem alteração nenhuma.

     Se um dia isto virar recurso de mais de uma apresentação, o lugar certo
     é o motor, e aí o `breaks()` é que deveria aprender a marca.
     ===================================================================== */

  (function realceNoRodape() {
    var original = L.split;
    var novo = {};

    /* Copia `transition`, `tone` e o que mais o motor tenha posto ali, para
       o motor não notar a troca. Só o render é substituído. */
    Object.keys(original).forEach(function (chave) { novo[chave] = original[chave]; });

    novo.render = function (s) {
      var no = original.render(s);
      var nota = no.querySelector('.l-split__note');
      if (nota) marcar(nota);
      return no;
    };

    L.split = novo;

    function marcar(nota) {
      /* Os nós de texto, e não o textContent do rodapé inteiro: um `\n` no
         `note` já virou <br> nesta altura, e achatar tudo em texto apagaria
         essas quebras. Cada nó é uma linha; um realce que atravessasse uma
         quebra de linha fica de fora, de propósito. */
      var textos = [];

      (function colher(pai) {
        [].forEach.call(pai.childNodes, function (filho) {
          if (filho.nodeType === 3) textos.push(filho);
          else colher(filho);
        });
      })(nota);

      textos.forEach(function (noDeTexto) {
        var partes = noDeTexto.nodeValue.split('**');
        if (partes.length < 3) return;

        var pedaco = document.createDocumentFragment();

        partes.forEach(function (parte, i) {
          if (!parte) return;
          pedaco.appendChild(
            i % 2 === 1
              ? h('strong', { text: parte })
              : document.createTextNode(parte)
          );
        });

        noDeTexto.parentNode.replaceChild(pedaco, noDeTexto);
      });
    }
  })();

})(window);
