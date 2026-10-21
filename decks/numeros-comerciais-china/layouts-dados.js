/* ===========================================================================
   LAYOUTS DE DADOS

   Oito layouts a mais, só para esta apresentação: os de número e gráfico que
   o motor não tem. Eles entram em window.DeckLayouts ao lado dos treze de
   engine/layouts.js — o motor não sabe a diferença e nada do que já existe
   muda. Por isso este arquivo é carregado DEPOIS de engine/layouts.js e
   ANTES de deck.js.

     bignum    um número gigante, com variação e apoio
     barras    barras horizontais ordenadas
     pilha     uma barra 100% empilhada, com legenda
     colunas   colunas verticais, uma ou duas séries
     rosca     rosca com legenda tabulada
     mapa      mapa do Brasil por estado + ranking ao lado
     marquee   tira de fotos atravessando a página
     parallax  foto de página inteira com camadas em velocidades diferentes

   O DESENHO
     Tudo é traço e preenchimento chapado em cima do papel quente. Nenhum
     gráfico tem grade de fundo, moldura ou sombra: o eixo é um filete, a
     referência é o próprio rótulo ao lado da barra. As séries se distinguem
     por opacidade do mesmo grafite, nunca por cor — um deck monocromático
     não tem para onde correr, e é isso que o deixa legível no projetor.

   A ANIMAÇÃO
     Barra, coluna e arco crescem por clip-path e dasharray, animados em CSS
     a partir de .slide.is-current (ver dados.css). Os números contam de zero
     por JS, no fim deste arquivo, com formato (casas, separador) declarado
     no próprio elemento. O motor já faz isso para [data-count], mas só com
     inteiro — aqui precisa de "3.31" e de "11,518".
   ======================================================================== */

(function (global) {
  'use strict';

  var L = global.DeckLayouts;
  if (!L) throw new Error('layouts-dados.js precisa vir depois de engine/layouts.js');

  /* ---------------------------------------------------------------------
     Utilidades — as mesmas ideias de engine/layouts.js, em miniatura.
     --------------------------------------------------------------------- */

  function h(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};

    Object.keys(props).forEach(function (key) {
      var value = props[key];
      if (value === null || value === undefined || value === false) return;

      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'html') node.innerHTML = quebras(value);
      else if (key === 'anim') node.setAttribute('data-anim', value === true ? '' : value);
      else if (key === 'style') node.setAttribute('style', value);
      else node.setAttribute(key, value);
    });

    lista(children).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function lista(v) { return !v ? [] : (Array.isArray(v) ? v : [v]); }

  function quebras(v) {
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function olho(texto) {
    return texto ? h('div', { class: 'eyebrow', text: texto, anim: true }) : null;
  }

  function titulo(texto, tam) {
    return texto ? h('h2', { class: 'title title--' + (tam || 'lg'), html: texto, anim: 'mask' }) : null;
  }

  function sub(texto) {
    return texto ? h('p', { class: 'sub', html: texto, anim: true }) : null;
  }

  function nota(texto) {
    return texto ? h('p', { class: 'nota-fonte', html: texto, anim: true }) : null;
  }

  /* Imagem de fundo — mesma anatomia de engine/layouts.js, para que o véu e
     o ponto focal se comportem igual nos dois conjuntos de layouts. */
  function fundo(cfg) {
    if (!cfg || !cfg.src) return null;
    var box = h('div', { class: 'slide-bg' });
    if (cfg.focal) box.style.setProperty('--focal', cfg.focal);
    box.appendChild(h('img', { src: cfg.src, alt: cfg.alt || '' }));
    if (cfg.overlay !== false) {
      box.appendChild(h('div', { class: 'slide-bg__scrim slide-bg__scrim--' + (cfg.overlay || 'left') }));
    }
    return box;
  }

  /* Um número que conta de zero ao entrar no slide. O formato viaja com o
     elemento: casas decimais e separador de milhar. Já nasce com o valor
     final escrito, para que a miniatura da grade (tecla G) mostre o número
     de verdade mesmo sem nunca ter sido exibida. */
  function numero(valor, opcoes) {
    opcoes = opcoes || {};
    var casas = opcoes.casas || 0;
    var sep = opcoes.separador !== false && casas === 0;
    var texto = sep ? global.DADOS.milhares(valor) : Number(valor).toFixed(casas);

    return h('span', {
      class: 'num' + (opcoes.classe ? ' ' + opcoes.classe : ''),
      'data-num': valor,
      'data-dec': casas,
      'data-sep': sep ? 'true' : 'false',
      text: texto
    });
  }

  /* Pastilha de variação: "+26%" com o rótulo do que está sendo comparado.
     Sem verde e sem vermelho — o sinal já diz a direção, e a apresentação
     inteira é monocromática. */
  function variacao(itens) {
    if (!lista(itens).length) return null;
    var faixa = h('div', { class: 'variacoes', anim: true });
    lista(itens).forEach(function (v) {
      faixa.appendChild(h('div', { class: 'variacao' + (v.baixa ? ' variacao--baixa' : '') }, [
        h('span', { class: 'variacao__valor', text: v.valor }),
        h('span', { class: 'variacao__label', text: v.label })
      ]));
    });
    return faixa;
  }

  /* ---------------------------------------------------------------------
     01 · bignum — um número e o que ele significa

       { layout: 'bignum', eyebrow, title, prefixo, valor, casas, sufixo,
         legenda, variacoes: [{ valor, label }], lado: [[rótulo, valor]],
         nota, background }
     --------------------------------------------------------------------- */
  L.bignum = {
    transition: 'stagger',
    render: function (s) {
      var cifra = h('div', { class: 'bignum', anim: true }, [
        s.prefixo ? h('span', { class: 'bignum__pre', text: s.prefixo }) : null,
        numero(s.valor, { casas: s.casas, classe: 'bignum__val' }),
        s.sufixo ? h('span', { class: 'bignum__suf', text: s.sufixo }) : null
      ]);

      var lado = null;
      if (lista(s.lado).length) {
        lado = h('div', { class: 'bignum__lado' });
        lista(s.lado).forEach(function (par) {
          lado.appendChild(h('div', { class: 'bignum__linha', anim: 'slide' }, [
            h('span', { class: 'bignum__linha-label', text: par[0] }),
            h('span', { class: 'bignum__linha-valor', html: par[1] })
          ]));
        });
      }

      return h('div', { class: 'l-bignum pad' + (lado ? ' l-bignum--lado' : '') }, [
        fundo(s.background),
        h('div', { class: 'l-bignum__corpo' }, [
          olho(s.eyebrow),
          titulo(s.title, s.tituloTam || 'md'),
          cifra,
          s.legenda ? h('p', { class: 'bignum__legenda', html: s.legenda, anim: true }) : null,
          variacao(s.variacoes)
        ]),
        lado,
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     02 · barras — barras horizontais ordenadas

       { layout: 'barras', eyebrow, title, sub,
         items: [{ label, apoio, valor, mostra, destaque }], nota }

       `valor` é o que desenha a barra; `mostra` é o que o olho lê. Separar
       os dois é o que permite desenhar por quantidade e escrever em dólar,
       ou vice-versa, sem gambiarra no conteúdo.
     --------------------------------------------------------------------- */
  L.barras = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);
      var max = itens.reduce(function (m, i) { return Math.max(m, i.valor); }, 0) || 1;

      var grade = h('div', { class: 'barras' + (itens.length > 7 ? ' barras--denso' : '') });

      itens.forEach(function (item, k) {
        var pct = (item.valor / max) * 100;

        grade.appendChild(h('div', {
          class: 'barra' + (item.destaque ? ' barra--destaque' : ''),
          style: '--k:' + k,
          anim: 'slide'
        }, [
          h('div', { class: 'barra__rotulo' }, [
            h('span', { class: 'barra__label', text: item.label }),
            item.apoio ? h('span', { class: 'barra__apoio', text: item.apoio }) : null
          ]),
          h('div', { class: 'barra__trilho' }, [
            h('div', { class: 'barra__fill', style: 'width:' + pct.toFixed(2) + '%' })
          ]),
          h('span', { class: 'barra__valor', html: item.mostra })
        ]));
      });

      return h('div', { class: 'l-barras pad' }, [
        olho(s.eyebrow),
        titulo(s.title, s.tituloTam || 'lg'),
        sub(s.sub),
        grade,
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     03 · pilha — uma barra única, 100%, repartida

       { layout: 'pilha', eyebrow, title, sub, total, totalLabel,
         items: [{ label, n, mostra, tom }], nota }

       `tom` vai de 1 (chapado) a 3 (quase só contorno). É como a pilha
       separa as partes sem usar cor.
     --------------------------------------------------------------------- */
  L.pilha = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);
      var soma = itens.reduce(function (t, i) { return t + i.n; }, 0) || 1;

      var barra = h('div', { class: 'pilha__barra', anim: true });
      var legenda = h('div', { class: 'pilha__legenda' });

      itens.forEach(function (item, k) {
        var pct = (item.n / soma) * 100;

        barra.appendChild(h('div', {
          class: 'pilha__parte pilha__parte--t' + (item.tom || 1),
          style: 'width:' + pct.toFixed(3) + '%; --k:' + k,
          title: item.label
        }, [
          /* Fatia estreita não comporta texto dentro; o número dela vive
             na legenda, logo abaixo. */
          pct > 8 ? h('span', { class: 'pilha__dentro', text: pct.toFixed(1) + '%' }) : null
        ]));

        legenda.appendChild(h('div', { class: 'pilha__item', style: '--k:' + k, anim: 'slide' }, [
          h('span', { class: 'pilha__chave pilha__chave--t' + (item.tom || 1) }),
          h('div', { class: 'pilha__texto' }, [
            h('span', { class: 'pilha__item-label', text: item.label }),
            h('span', { class: 'pilha__item-n' }, [
              numero(item.n), h('span', { class: 'pilha__item-un', text: ' · ' + pct.toFixed(1) + '%' })
            ]),
            item.mostra ? h('span', { class: 'pilha__item-valor', html: item.mostra }) : null
          ])
        ]));
      });

      return h('div', { class: 'l-pilha pad' }, [
        olho(s.eyebrow),
        titulo(s.title, s.tituloTam || 'lg'),
        sub(s.sub),
        h('div', { class: 'pilha' }, [
          s.total ? h('div', { class: 'pilha__topo', anim: true }, [
            numero(s.total, { classe: 'pilha__total' }),
            h('span', { class: 'pilha__total-label', text: s.totalLabel || '' })
          ]) : null,
          barra,
          legenda
        ]),
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     04 · colunas — colunas verticais, uma ou duas séries

       { layout: 'colunas', eyebrow, title, sub, unidade,
         series: [{ nome, fantasma, pontos: [{ x, v, mostra }] }],
         marcos: [{ x, texto }], nota }

       Duas séries ficam lado a lado dentro do mesmo passo do eixo. A
       segunda entra como `fantasma` — contorno sem preenchimento — que é
       como o ano anterior aparece sem disputar leitura com o atual.
     --------------------------------------------------------------------- */
  L.colunas = {
    transition: 'stagger',
    render: function (s) {
      var series = lista(s.series);
      var max = 0;
      series.forEach(function (serie) {
        lista(serie.pontos).forEach(function (p) { if (p.v > max) max = p.v; });
      });
      max = max || 1;

      /* O eixo sobe até um número redondo acima do pico, senão a coluna
         mais alta encosta no topo e o gráfico parece cortado. */
      var topo = Math.ceil(max / 100) * 100;
      var passos = lista(series[0] && series[0].pontos);

      var grade = h('div', { class: 'colunas__grade' });

      passos.forEach(function (_, i) {
        var grupo = h('div', { class: 'colunas__passo', style: '--k:' + i });

        series.forEach(function (serie, si) {
          var p = lista(serie.pontos)[i];
          if (!p) return;
          var alt = (p.v / topo) * 100;

          grupo.appendChild(h('div', {
            class: 'coluna' + (serie.fantasma ? ' coluna--fantasma' : ''),
            style: '--alt:' + alt.toFixed(2) + '%; --s:' + si
          }, [
            h('span', { class: 'coluna__valor', html: p.mostra || '' }),
            h('div', { class: 'coluna__corpo' })
          ]));
        });

        grupo.appendChild(h('span', { class: 'colunas__x', text: passos[i].x }));
        grade.appendChild(grupo);
      });

      var legenda = null;
      if (series.length > 1) {
        legenda = h('div', { class: 'colunas__legenda', anim: true });
        series.forEach(function (serie) {
          legenda.appendChild(h('span', { class: 'colunas__chave' + (serie.fantasma ? ' colunas__chave--fantasma' : '') }, [
            h('i', {}), h('span', { text: serie.nome })
          ]));
        });
      }

      return h('div', { class: 'l-colunas pad pad--tight' }, [
        h('div', { class: 'l-colunas__cabeca' }, [
          h('div', {}, [olho(s.eyebrow), titulo(s.title, s.tituloTam || 'md'), sub(s.sub)]),
          legenda
        ]),
        h('div', { class: 'colunas', anim: true }, [
          s.unidade ? h('span', { class: 'colunas__un', text: s.unidade }) : null,
          grade
        ]),
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     05 · rosca — participação, com a legenda fazendo as vezes de tabela

       { layout: 'rosca', eyebrow, title, sub, centro: { valor, label },
         items: [{ label, pct, n, mostra }], nota }
     --------------------------------------------------------------------- */
  L.rosca = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);
      var R = 128, C = 2 * Math.PI * R;
      var acumulado = 0;

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 320 320');
      svg.setAttribute('class', 'rosca__svg');
      svg.setAttribute('aria-hidden', 'true');

      var tracos = '';
      itens.forEach(function (item, k) {
        var len = (item.pct / 100) * C;
        /* 2px de respiro entre fatias, para o contorno da seguinte não
           colar na anterior. Fatia minúscula não tem de onde tirar isso. */
        var vao = len > 6 ? 2 : 0;
        tracos += '<circle class="rosca__arco rosca__arco--t' + Math.min(k + 1, 5) + '"' +
          ' cx="160" cy="160" r="' + R + '"' +
          ' style="--k:' + k + '; --circ:' + C.toFixed(1) +
          '; --len:' + (len - vao).toFixed(1) + '; --resto:' + (C - len + vao).toFixed(1) +
          '; stroke-dashoffset:' + (-acumulado).toFixed(1) + '"/>';
        acumulado += len;
      });
      svg.innerHTML = tracos;

      var legenda = h('div', { class: 'rosca__legenda' });
      itens.forEach(function (item, k) {
        legenda.appendChild(h('div', { class: 'rosca__linha', style: '--k:' + k, anim: 'slide' }, [
          h('span', { class: 'rosca__chave rosca__chave--t' + Math.min(k + 1, 5) }),
          h('span', { class: 'rosca__label', text: item.label }),
          h('span', { class: 'rosca__pct', text: item.pct.toFixed(1) + '%' }),
          h('span', { class: 'rosca__n', text: item.n + (item.n === 1 ? ' sale' : ' sales') }),
          h('span', { class: 'rosca__valor', html: item.mostra })
        ]));
      });

      var disco = h('div', { class: 'rosca__disco', anim: true });
      disco.appendChild(svg);
      if (s.centro) {
        disco.appendChild(h('div', { class: 'rosca__centro' }, [
          h('span', { class: 'rosca__centro-valor', html: s.centro.valor }),
          h('span', { class: 'rosca__centro-label', text: s.centro.label })
        ]));
      }

      return h('div', { class: 'l-rosca pad pad--tight' }, [
        h('div', { class: 'l-rosca__cabeca' }, [olho(s.eyebrow), titulo(s.title, s.tituloTam || 'md'), sub(s.sub)]),
        h('div', { class: 'l-rosca__corpo' }, [disco, legenda]),
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     06 · mapa — o Brasil por estado, com o ranking ao lado

       { layout: 'mapa', eyebrow, title, sub, valores: { UF: { n, brl } },
         chave: 'brl' | 'n', rotulos: ['SP', ...], ranking: [{...}],
         legenda, nota }

       O desenho dos estados vem de mapa-brasil.js. O preenchimento é a
       mesma tinta em cinco opacidades: quanto mais escuro, mais faturado.
       Estado sem negócio fica só com o contorno — e é justamente isso que
       mostra onde ainda não se vendeu.
     --------------------------------------------------------------------- */
  L.mapa = {
    transition: 'stagger',
    render: function (s) {
      var m = global.BR_MAPA;
      var valores = s.valores || {};
      var chave = s.chave || 'brl';

      var max = 0;
      Object.keys(valores).forEach(function (uf) {
        if (m.estados[uf] && valores[uf][chave] > max) max = valores[uf][chave];
      });
      max = max || 1;

      /* Cinco faixas por raiz quadrada: sem isso São Paulo, que sozinho é
         45% do faturamento, joga todo o resto do país para a faixa mais
         clara e o mapa não diz nada. */
      function faixa(v) {
        if (!v) return 0;
        var r = Math.sqrt(v / max);
        if (r >= 0.80) return 5;
        if (r >= 0.52) return 4;
        if (r >= 0.30) return 3;
        if (r >= 0.14) return 2;
        return 1;
      }

      var partes = '';
      var ordem = Object.keys(m.estados).sort(function (a, b) {
        return ((valores[b] || {})[chave] || 0) - ((valores[a] || {})[chave] || 0);
      });

      ordem.forEach(function (uf, k) {
        var dado = valores[uf];
        var f = faixa(dado ? dado[chave] : 0);
        partes += '<path class="mapa__uf mapa__uf--f' + f + '" style="--k:' + k + '"' +
                  ' d="' + m.estados[uf].d + '"><title>' + m.estados[uf].nome + '</title></path>';
      });

      lista(s.rotulos).forEach(function (uf) {
        var e = m.estados[uf];
        if (!e) return;
        partes += '<text class="mapa__rotulo" x="' + e.cx + '" y="' + e.cy + '">' + uf + '</text>';
      });

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', m.viewBox);
      svg.setAttribute('class', 'mapa__svg');
      svg.innerHTML = partes;

      var escala = h('div', { class: 'mapa__escala', anim: true }, [
        h('span', { class: 'mapa__escala-label', text: s.escalaMin || 'less' }),
        h('span', { class: 'mapa__escala-caixas' }, [1, 2, 3, 4, 5].map(function (f) {
          return h('i', { class: 'mapa__escala-caixa mapa__uf--f' + f });
        })),
        h('span', { class: 'mapa__escala-label', text: s.escalaMax || 'more' })
      ]);

      var rank = h('div', { class: 'mapa__rank' });
      lista(s.ranking).forEach(function (linha, k) {
        rank.appendChild(h('div', { class: 'mapa__rank-linha', style: '--k:' + k, anim: 'slide' }, [
          h('span', { class: 'mapa__rank-uf', text: linha.uf }),
          h('span', { class: 'mapa__rank-nome', text: linha.nome }),
          h('span', { class: 'mapa__rank-n', text: linha.n }),
          h('span', { class: 'mapa__rank-valor', html: linha.mostra })
        ]));
      });

      var painel = h('div', { class: 'mapa__painel' });
      painel.appendChild(h('div', {}, [olho(s.eyebrow), titulo(s.title, 'md'), sub(s.sub)]));
      if (lista(s.destaques).length) {
        var faixaD = h('div', { class: 'mapa__destaques', anim: true });
        lista(s.destaques).forEach(function (d) {
          faixaD.appendChild(h('div', { class: 'mapa__destaque' }, [
            h('span', { class: 'mapa__destaque-valor', html: d.valor }),
            h('span', { class: 'mapa__destaque-label', text: d.label })
          ]));
        });
        painel.appendChild(faixaD);
      }
      painel.appendChild(rank);

      /* A escala fica embaixo do mapa, e não no painel: é dele que ela
         fala, e no painel disputava o rodapé com a nota de fonte. */
      var desenho = h('div', { class: 'mapa__desenho', anim: true });
      desenho.appendChild(svg);
      desenho.appendChild(escala);

      return h('div', { class: 'l-mapa pad pad--tight' }, [
        desenho,
        painel,
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     07 · marquee — a tira de fotos atravessando a página

       { layout: 'marquee', eyebrow, title, sub,
         fotos: [{ src, alt, label, apoio }], segundos, nota }

       A tira é a lista duplicada e deslocada metade da largura em laço, que
       é o que faz a emenda passar despercebida. Quem pediu menos movimento
       no sistema recebe a tira parada (ver dados.css).
     --------------------------------------------------------------------- */
  L.marquee = {
    transition: 'fade',
    tone: 'ink',
    render: function (s) {
      var fotos = lista(s.fotos);

      /* A segunda cópia leva uma classe própria. Ela existe só para emendar
         o laço na tela; na exportação em PDF ela some, porque lá nada anda
         e o que fica é uma tira estática — ver dados.css. */
      function tira(copia) {
        var t = document.createDocumentFragment();
        fotos.forEach(function (f) {
          t.appendChild(h('figure', { class: 'marquee__item' + (copia ? ' marquee__item--copia' : '') }, [
            h('div', { class: 'marquee__moldura' }, [
              h('img', { src: f.src, alt: f.alt || f.label || '' })
            ]),
            h('figcaption', { class: 'marquee__legenda' }, [
              h('span', { class: 'marquee__label', text: f.label || '' }),
              f.apoio ? h('span', { class: 'marquee__apoio', text: f.apoio }) : null
            ])
          ]));
        });
        return t;
      }

      var trilho = h('div', {
        class: 'marquee__trilho',
        style: '--seg:' + (s.segundos || 46) + 's'
      });
      trilho.appendChild(tira(false));
      trilho.appendChild(tira(true));   /* a emenda do laço */

      return h('div', { class: 'l-marquee' }, [
        h('div', { class: 'l-marquee__texto pad' }, [
          olho(s.eyebrow),
          titulo(s.title, 'md'),
          sub(s.sub)
        ]),
        h('div', { class: 'marquee' }, [trilho]),
        nota(s.nota)
      ]);
    }
  };

  /* ---------------------------------------------------------------------
     08 · parallax — foto de página inteira, em camadas

       { layout: 'parallax', eyebrow, title, texto, src, alt, focal,
         numeros: [{ valor, label }], overlay }

       A foto entra de uma escala maior e assenta devagar; a tipografia sobe
       por cima, mais rápido. A diferença de velocidade entre as duas é o
       parallax — discreto de propósito, para servir de respiro entre blocos
       de número sem roubar a cena.
     --------------------------------------------------------------------- */
  L.parallax = {
    transition: 'mask',
    tone: 'ink',
    render: function (s) {
      var numeros = null;
      if (lista(s.numeros).length) {
        numeros = h('div', { class: 'parallax__numeros' });
        lista(s.numeros).forEach(function (nn, k) {
          numeros.appendChild(h('div', { class: 'parallax__numero', style: '--k:' + k, anim: 'slide' }, [
            h('span', { class: 'parallax__numero-valor', html: nn.valor }),
            h('span', { class: 'parallax__numero-label', text: nn.label })
          ]));
        });
      }

      return h('div', { class: 'l-parallax' }, [
        h('div', { class: 'parallax__foto' }, [
          h('img', { src: s.src, alt: s.alt || '', style: s.focal ? '--focal:' + s.focal : null })
        ]),
        h('div', { class: 'parallax__veu parallax__veu--' + (s.overlay || 'bottom') }),
        h('div', { class: 'parallax__texto pad' }, [
          olho(s.eyebrow),
          titulo(s.title, s.tituloTam || 'xl'),
          s.texto ? h('p', { class: 'lead', html: s.texto, anim: true }) : null,
          numeros
        ])
      ]);
    }
  };

  /* =====================================================================
     Os números contando de zero

     O motor já faz isso para [data-count], mas só com inteiro: ele arredonda
     a cada quadro. Aqui precisa de "3.31" e de "11,518", então o formato
     viaja no próprio elemento — data-dec (casas) e data-sep (milhar).

     Quem dispara é um observador na mudança de classe do slide, e não um
     gancho no motor: assim engine/deck.js continua intocado e a outra
     apresentação não corre risco nenhum.
     ===================================================================== */

  var DURACAO = 900;
  var sessao = 0;   /* navegação rápida invalida a contagem anterior */

  function formata(valor, casas, sep) {
    if (sep) return global.DADOS.milhares(valor);
    return Number(valor).toFixed(casas);
  }

  function conta(slide) {
    var nos = slide.querySelectorAll('[data-num]');
    if (!nos.length) return;

    var token = ++sessao;
    var parado = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Array.prototype.forEach.call(nos, function (no) {
      var alvo = parseFloat(no.getAttribute('data-num'));
      if (isNaN(alvo)) return;

      var casas = parseInt(no.getAttribute('data-dec') || '0', 10);
      var sep = no.getAttribute('data-sep') === 'true';

      if (parado) { no.textContent = formata(alvo, casas, sep); return; }

      /* O mesmo degrau do motor: a contagem acompanha a cascata de entrada
         em vez de começar toda junta. */
      var pai = no.closest('[data-anim]');
      var i = pai ? parseFloat(getComputedStyle(pai).getPropertyValue('--i')) || 0 : 0;
      var atraso = 300 + i * 55;

      no.textContent = formata(0, casas, sep);

      global.setTimeout(function () {
        if (token !== sessao) return;
        var inicio = null;

        function quadro(agora) {
          if (token !== sessao) return;
          if (inicio === null) inicio = agora;
          var t = Math.min((agora - inicio) / DURACAO, 1);
          var suave = 1 - Math.pow(1 - t, 3);
          no.textContent = formata(alvo * suave, casas, sep);
          if (t < 1) requestAnimationFrame(quadro);
        }
        requestAnimationFrame(quadro);
      }, atraso);
    });
  }

  function observa() {
    var palco = document.querySelector('.stage');
    if (!palco) { return global.setTimeout(observa, 50); }

    new MutationObserver(function (mudancas) {
      mudancas.forEach(function (m) {
        var el = m.target;
        if (el.classList && el.classList.contains('slide') && el.classList.contains('is-current')) conta(el);
      });
    }).observe(palco, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  observa();

})(window);
