/* ===========================================================================
   LAYOUTS DE GRÁFICO E DECISÃO

   Quinze layouts a mais, só para esta apresentação. Eles entram em
   window.DeckLayouts ao lado dos treze de engine/layouts.js — o motor não
   sabe a diferença e nada do que já existe muda. Por isso este arquivo é
   carregado DEPOIS de engine/layouts.js e ANTES de deck.js.

     pontos        texto em N pontos numerados, com rodapé
     duas          duas colunas de texto, com uma condição em destaque
     barras        barras horizontais simples, valor no fim
     barraspilha   barras horizontais empilhadas, total no fim
     colunas       colunas verticais agrupadas, com a diferença por cima
     colunaspilha  colunas verticais empilhadas, total no topo, tabela ao lado
     linhas        linhas sobre faixas categóricas, rótulo no fim de cada uma
     cartoes       cartões de valor
     fluxo         diagrama de fluxo em etapas, com as contas embaixo
     tabela        tabela agrupada por frente
     decisoes      lista de aprovação com seletor de status, marcável na reunião
     confronto     duas fotos lado a lado, cada uma com a sua etiqueta
     marca         o logo de hoje e o de 2027, um ao lado do outro
     topico        um assunto por tela, com ou sem foto
     matriz        o diagrama de marca × classe do INPI

   O DESENHO
     Tudo é traço e preenchimento chapado sobre o papel quente. Sem grade de
     fundo, sem moldura, sem sombra: o eixo é um filete e a referência é o
     próprio rótulo ao lado da barra. Eixo de barra e de coluna sempre começa
     em zero — nenhum layout daqui aceita outro começo.

     O que separa as séries é a OPACIDADE da mesma tinta, em cinco degraus
     (--f1 a --f5). Em cima disso, e só nos gráficos de comparação, o que é
     proposta leva o verde da marca e o que é atual ou antigo fica cinza, como
     pede o PRD. A diferença de claro para escuro entre os dois é grande o
     bastante para o gráfico continuar legível em projetor desbotado, em preto
     e branco e para quem não distingue as duas cores — a cor reforça a
     leitura, nunca é a única coisa que a carrega. Ver graficos.css.

   NÃO HÁ CONTAGEM ANIMADA
     Os números nascem escritos. Barras e colunas crescem por CSS a partir de
     .slide.is-current; o valor ao lado não conta de zero, porque aqui quase
     todo número é dinheiro com centavos e vê-lo girar atrapalha mais do que
     impressiona numa reunião de aprovação.
   ======================================================================== */

(function (global) {
  'use strict';

  var L = global.DeckLayouts;
  if (!L) throw new Error('graficos.js precisa vir depois de engine/layouts.js');

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

  /* Converte \n em <br> e escapa o resto — o conteúdo do deck é texto. */
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

  /* Rodapé de fonte, validade e ressalva. Fica no pé do slide, miúdo: quem
     está na sala não precisa ler, mas quem perguntar tem a resposta na tela. */
  function nota(texto) {
    return texto ? h('p', { class: 'nota-fonte', html: texto, anim: true }) : null;
  }

  /* Cabeça padrão dos slides de gráfico. */
  function cabeca(s, tam) {
    return h('div', { class: 'g-cabeca' }, [
      olho(s.eyebrow),
      titulo(s.title, s.tituloTam || tam || 'md'),
      sub(s.sub)
    ]);
  }

  function dois(n) { return n < 10 ? '0' + n : String(n); }

  function soma(valores) {
    return valores.reduce(function (t, v) { return t + v; }, 0);
  }

  /* O topo do eixo: o primeiro número redondo acima do pico, para a coluna
     mais alta não encostar na borda e o gráfico não parecer cortado.

     Os degraus são finos (1; 1,2; 1,5; 2; 2,5; 3; 4; 5; 6; 8) porque o
     salto grosso desperdiça altura: com passos de 1-2-5, um pico de 2,94
     milhões sobe o eixo até 5 milhões e a coluna mais alta fica com 59% da
     área. Com 3 milhões ela usa 98%, e o eixo continua um número redondo. */
  function teto(max) {
    if (max <= 0) return 1;
    var potencia = Math.pow(10, Math.floor(Math.log(max) / Math.LN10));
    var passos = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

    for (var i = 0; i < passos.length; i++) {
      var candidato = passos[i] * potencia;
      if (candidato >= max) return candidato;
    }
    return 10 * potencia;
  }

  /* Classe de preenchimento de um segmento. `tom` é o degrau de opacidade
     (1 a 5); `papel` marca o que é proposta e o que é atual. */
  function tinta(tom, papel) {
    return 'g-tom g-tom--' + (tom || 3) + (papel ? ' g-tom--' + papel : '');
  }

  /* O destaque de uma barra não é só o rótulo mais escuro: a barra troca a
     tinta cinza pela terracota da marca, porque é ela a informação que a tela
     existe para apontar. Quem declarou `papel` na mão manda nele. */
  var PAPEL_DESTAQUE = ['proposta', 'proposta-clara', 'proposta-palida'];

  function papelDe(g, destacado, j) {
    if (g.papel) return g.papel;
    if (!destacado) return null;
    return PAPEL_DESTAQUE[Math.min(j || 0, PAPEL_DESTAQUE.length - 1)];
  }


  /* =====================================================================
     01 · pontos — texto em N pontos numerados

       { layout: 'pontos', eyebrow, title, sub,
         items: ['...'] | [{ label, text }],
         rodape, nota }
     ===================================================================== */

  L.pontos = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);
      var grade = h('div', {
        class: 'pontos' + (itens.length >= 4 ? ' pontos--duas' : '')
      });

      itens.forEach(function (item, i) {
        var corpo = typeof item === 'string'
          ? h('p', { class: 'ponto__texto', html: item })
          : h('div', { class: 'ponto__corpo' }, [
              item.label ? h('strong', { class: 'ponto__rotulo', text: item.label }) : null,
              item.text ? h('p', { class: 'ponto__texto', html: item.text }) : null
            ]);

        grade.appendChild(h('div', { class: 'ponto', style: '--k:' + i, anim: 'slide' }, [
          h('span', { class: 'ponto__num', text: dois(i + 1) }),
          corpo
        ]));
      });

      return h('div', { class: 'l-pontos pad' }, [
        olho(s.eyebrow),
        titulo(s.title, s.tituloTam || 'lg'),
        sub(s.sub),
        grade,
        s.rodape ? h('p', { class: 'l-pontos__rodape', html: s.rodape, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     02 · duas — duas colunas de texto, com uma condição em destaque

       { layout: 'duas', eyebrow, title, sub,
         colunas: [{ titulo, texto }],
         destaque: { label, texto }, nota }
     ===================================================================== */

  L.duas = {
    transition: 'stagger',
    render: function (s) {
      var grade = h('div', { class: 'duas' });

      lista(s.colunas).forEach(function (c, i) {
        grade.appendChild(h('div', { class: 'duas__col', style: '--k:' + i, anim: 'slide' }, [
          h('div', { class: 'duas__col-olho', text: c.titulo }),
          h('p', { class: 'duas__col-texto', html: c.texto })
        ]));
      });

      return h('div', { class: 'l-duas pad' }, [
        olho(s.eyebrow),
        titulo(s.title, s.tituloTam || 'lg'),
        sub(s.sub),
        grade,
        s.destaque ? h('div', { class: 'duas__destaque', anim: true }, [
          h('span', { class: 'duas__destaque-label', text: s.destaque.label }),
          h('p', { class: 'duas__destaque-texto', html: s.destaque.texto })
        ]) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     03 · barras — barras horizontais simples

       { layout: 'barras', eyebrow, title, sub,
         items: [{ label, apoio, valor, mostra, destaque }],
         recado, nota }

       `valor` desenha a barra; `mostra` é o que o olho lê no fim dela.
     ===================================================================== */

  L.barras = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);
      var max = itens.reduce(function (m, i) { return Math.max(m, i.valor); }, 0) || 1;

      var grade = h('div', {
        class: 'barras' + (itens.length > 8 ? ' barras--denso' : '')
      });

      itens.forEach(function (item, k) {
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
            h('div', {
              class: 'barra__fill ' + tinta(item.tom || 3, papelDe(item, item.destaque, 0)),
              style: '--alvo:' + ((item.valor / max) * 100).toFixed(2) + '%'
            })
          ]),
          h('span', { class: 'barra__valor', html: item.mostra })
        ]));
      });

      /* Doze faixas de frete não cabem com a margem larga: a lista densa
         usa a margem apertada, que é o que devolve os 32 px que faltam para
         o rodapé não sair da tela. */
      return h('div', { class: 'l-barras pad' + (itens.length > 8 ? ' pad--tight' : '') }, [
        cabeca(s, 'lg'),
        grade,
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     04 · barraspilha — barras horizontais empilhadas, total no fim

       { layout: 'barraspilha', eyebrow, title, sub,
         legenda: [{ rotulo, tom, papel }],
         items: [{ label, apoio, segmentos: [{ rotulo, valor, tom, papel }],
                   mostra, destaque }],
         dentro: true,                      // escreve o % dentro do segmento
         lado: { valor, label, apoio },     // número em destaque à direita
         recado, nota }

       Todas as barras dividem a mesma escala: o maior total vale 100% da
       largura. É isso que deixa comparar o tamanho de um pacote com o do
       outro, e não só a repartição dentro de cada um.
     ===================================================================== */

  L.barraspilha = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);

      function totalDe(item) {
        return soma(lista(item.segmentos).map(function (g) { return g.valor; }));
      }

      var max = itens.reduce(function (m, i) { return Math.max(m, totalDe(i)); }, 0) || 1;

      var grade = h('div', { class: 'pilhas' + (itens.length > 4 ? ' pilhas--denso' : '') });

      itens.forEach(function (item, k) {
        var total = totalDe(item);
        var trilho = h('div', {
          class: 'pilha__trilho',
          style: '--alvo:' + ((total / max) * 100).toFixed(2) + '%'
        });

        lista(item.segmentos).forEach(function (g, j) {
          /* A largura do segmento é relativa ao PRÓPRIO total: o trilho já
             carrega o tamanho da barra na escala comum, então aqui dentro a
             conta é só de repartição. */
          var dentro = total ? (g.valor / total) * 100 : 0;

          trilho.appendChild(h('div', {
            class: 'pilha__parte ' + tinta(g.tom, papelDe(g, item.destaque, j)),
            style: 'width:' + dentro.toFixed(3) + '%; --j:' + j,
            title: g.rotulo
          }, [
            /* Fatia estreita não comporta texto dentro; quem carrega o
               número dela é a legenda ou o rótulo da barra. */
            s.dentro && dentro > 14
              ? h('span', { class: 'pilha__dentro', text: Math.round(dentro) + '%' })
              : null
          ]));
        });

        grade.appendChild(h('div', {
          class: 'pilha' + (item.destaque ? ' pilha--destaque' : ''),
          style: '--k:' + k,
          anim: 'slide'
        }, [
          h('div', { class: 'pilha__rotulo' }, [
            h('span', { class: 'pilha__label', text: item.label }),
            item.apoio ? h('span', { class: 'pilha__apoio', text: item.apoio }) : null
          ]),
          trilho,
          h('span', { class: 'pilha__valor', html: item.mostra })
        ]));
      });

      var legenda = null;
      if (lista(s.legenda).length) {
        legenda = h('div', { class: 'g-legenda', anim: true });
        lista(s.legenda).forEach(function (c) {
          legenda.appendChild(h('span', { class: 'g-legenda__item' }, [
            h('i', { class: tinta(c.tom, c.papel) }),
            h('span', { text: c.rotulo })
          ]));
        });
      }

      var corpo = h('div', { class: 'l-pilhas__corpo' }, [grade]);

      if (s.lado) {
        corpo.appendChild(h('div', { class: 'g-lado', anim: true }, [
          h('div', { class: 'g-lado__valor', html: s.lado.valor }),
          h('div', { class: 'g-lado__label', html: s.lado.label }),
          s.lado.apoio ? h('p', { class: 'g-lado__apoio', html: s.lado.apoio }) : null
        ]));
      }

      return h('div', { class: 'l-pilhas pad' + (s.lado ? ' l-pilhas--lado' : '') }, [
        h('div', { class: 'l-pilhas__cabeca' }, [cabeca(s, 'md'), legenda]),
        corpo,
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     05 · colunas — colunas verticais agrupadas

       { layout: 'colunas', eyebrow, title, sub, unidade,
         grupos: [{ label, colunas: [{ label, valor, mostra, delta, tom, papel }] }],
         legenda, recado, nota }

       O eixo começa em zero e sobe até o primeiro número redondo acima do
       pico. `delta` é a diferença para a referência do grupo e aparece por
       cima da coluna, que é onde a comparação é feita.
     ===================================================================== */

  L.colunas = {
    transition: 'stagger',
    render: function (s) {
      var grupos = lista(s.grupos);
      var max = 0;

      grupos.forEach(function (g) {
        lista(g.colunas).forEach(function (c) { if (c.valor > max) max = c.valor; });
      });

      var topo = teto(max);
      var grade = h('div', { class: 'colunas' });

      grupos.forEach(function (g, i) {
        var grupo = h('div', { class: 'colunas__grupo', style: '--k:' + i, anim: 'slide' });
        var barras = h('div', { class: 'colunas__barras' });

        lista(g.colunas).forEach(function (c, j) {
          barras.appendChild(h('div', { class: 'coluna', style: '--j:' + j }, [
            h('div', { class: 'coluna__topo' }, [
              c.delta ? h('span', { class: 'coluna__delta', html: c.delta }) : null,
              h('span', { class: 'coluna__valor', html: c.mostra })
            ]),
            h('div', {
              class: 'coluna__corpo ' + tinta(c.tom, c.papel),
              style: '--alt:' + ((c.valor / topo) * 100).toFixed(2) + '%'
            }),
            h('span', { class: 'coluna__label', html: c.label })
          ]));
        });

        grupo.appendChild(barras);
        grupo.appendChild(h('span', { class: 'colunas__grupo-label', text: g.label }));
        grade.appendChild(grupo);
      });

      var legenda = null;
      if (lista(s.legenda).length) {
        legenda = h('div', { class: 'g-legenda', anim: true });
        lista(s.legenda).forEach(function (c) {
          legenda.appendChild(h('span', { class: 'g-legenda__item' }, [
            h('i', { class: tinta(c.tom, c.papel) }),
            h('span', { text: c.rotulo })
          ]));
        });
      }

      return h('div', { class: 'l-colunas pad pad--tight' }, [
        h('div', { class: 'l-colunas__cabeca' }, [cabeca(s, 'md'), legenda]),
        h('div', { class: 'l-colunas__caixa' }, [
          s.unidade ? h('span', { class: 'g-unidade', text: s.unidade }) : null,
          grade
        ]),
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     06 · colunaspilha — colunas verticais empilhadas, com tabela ao lado

       { layout: 'colunaspilha', eyebrow, title, sub, unidade,
         items: [{ label, apoio, segmentos: [{ rotulo, valor, tom, papel }], mostra }],
         geral: { label, valor },
         tabela: { colunas: [...], linhas: [[...]] },
         legenda, recado, nota }
     ===================================================================== */

  L.colunaspilha = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);

      function totalDe(item) {
        return soma(lista(item.segmentos).map(function (g) { return g.valor; }));
      }

      var topo = teto(itens.reduce(function (m, i) { return Math.max(m, totalDe(i)); }, 0));
      var grade = h('div', { class: 'cpilhas' });

      itens.forEach(function (item, k) {
        var total = totalDe(item);
        var torre = h('div', {
          class: 'cpilha__torre',
          style: '--alt:' + ((total / topo) * 100).toFixed(2) + '%'
        });

        /* De baixo para cima, na ordem em que os segmentos foram escritos:
           column-reverse no CSS. */
        lista(item.segmentos).forEach(function (g, j) {
          torre.appendChild(h('div', {
            class: 'cpilha__parte ' + tinta(g.tom, g.papel),
            style: 'height:' + (total ? (g.valor / total) * 100 : 0).toFixed(3) + '%; --j:' + j,
            title: g.rotulo
          }));
        });

        /* A caixa segura o total e a torre e carrega a linha do zero; o
           rótulo fica fora dela, no fluxo, abaixo da linha. Assim a altura
           da torre é uma fração só da área de desenho — o texto do rótulo
           não entra na conta da escala. */
        grade.appendChild(h('div', { class: 'cpilha', style: '--k:' + k, anim: 'slide' }, [
          h('div', { class: 'cpilha__caixa' }, [
            h('span', { class: 'cpilha__total', html: item.mostra }),
            torre
          ]),
          h('div', { class: 'cpilha__rotulo' }, [
            h('span', { class: 'cpilha__label', text: item.label }),
            item.apoio ? h('span', { class: 'cpilha__apoio', html: item.apoio }) : null
          ])
        ]));
      });

      var painel = h('div', { class: 'cpilhas__painel' });

      if (s.tabela) {
        /* O grid-template-columns da tabelinha. Sem ele, três colunas:
           rótulo elástico e dois números.

           O nome não pode ser `grade`: `var` é de função, não de bloco, e
           aqui dentro ele sobrescreveria a grade do gráfico lá de cima. */
        var colunasGrade = s.tabela.grade ? '--grade:' + s.tabela.grade : null;
        var t = h('div', { class: 'g-tabelinha', style: colunasGrade, anim: true });

        /* Uma célula é texto simples, { texto, apoio } ou { texto, num } —
           nunca HTML. O motor escapa o conteúdo do deck de propósito, então
           marcação montada na mão em deck.js sairia escrita na tela, com
           tags e tudo. `num` alinha à direita, que é como se lê coluna de
           número. */
        function celula(valor, cabeca) {
          if (valor && typeof valor === 'object') {
            return h('span', { class: 'g-tabelinha__celula' + (valor.num ? ' g-tabelinha__num' : '') }, [
              h('span', { class: 'g-tabelinha__texto', text: valor.texto }),
              valor.apoio ? h('span', { class: 'g-tabelinha__apoio', text: valor.apoio }) : null
            ]);
          }
          return h('span', { class: cabeca ? 'g-tabelinha__num' : '', text: valor });
        }

        if (lista(s.tabela.colunas).length) {
          var cab = h('div', { class: 'g-tabelinha__linha g-tabelinha__linha--cabeca' });
          lista(s.tabela.colunas).forEach(function (c, i) {
            /* O cabeçalho acompanha o alinhamento da coluna, que vem
               declarado em `numericas`. */
            cab.appendChild(h('span', {
              class: lista(s.tabela.numericas).indexOf(i) >= 0 ? 'g-tabelinha__num' : '',
              text: c
            }));
          });
          t.appendChild(cab);
        }

        lista(s.tabela.linhas).forEach(function (linha, i) {
          var l = h('div', { class: 'g-tabelinha__linha', style: '--k:' + i });
          lista(linha).forEach(function (c, j) {
            var marcada = lista(s.tabela.numericas).indexOf(j) >= 0;
            l.appendChild(celula(c, marcada && typeof c !== 'object'));
          });
          t.appendChild(l);
        });

        painel.appendChild(t);
      }

      if (s.geral) {
        painel.appendChild(h('div', { class: 'cpilhas__geral', anim: true }, [
          h('span', { class: 'cpilhas__geral-label', text: s.geral.label }),
          h('span', { class: 'cpilhas__geral-valor', html: s.geral.valor })
        ]));
      }

      var legenda = null;
      if (lista(s.legenda).length) {
        legenda = h('div', { class: 'g-legenda', anim: true });
        lista(s.legenda).forEach(function (c) {
          legenda.appendChild(h('span', { class: 'g-legenda__item' }, [
            h('i', { class: tinta(c.tom, c.papel) }),
            h('span', { text: c.rotulo })
          ]));
        });
      }

      return h('div', { class: 'l-cpilhas pad pad--tight' }, [
        h('div', { class: 'l-cpilhas__cabeca' }, [cabeca(s, 'md'), legenda]),
        h('div', { class: 'l-cpilhas__corpo' }, [
          h('div', { class: 'l-cpilhas__caixa' }, [
            s.unidade ? h('span', { class: 'g-unidade', text: s.unidade }) : null,
            grade
          ]),
          painel
        ]),
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     07 · linhas — linhas sobre faixas categóricas

       { layout: 'linhas', eyebrow, title, sub, unidadeY,
         eixoX: ['1.000 un', '2.000 un', '3.000 un'],
         series: [{ nome, pontos: [v, v, v], fim, tom }],
         quadro: { titulo, apoio, linhas: [{ label, apoio, valor }] },
         recado, nota }

       As faixas são CATEGORIAS, igualmente espaçadas: o que interessa é o
       degrau de preço de uma para a outra, não a distância numérica entre
       1.000 e 3.000. O eixo Y começa em zero.

       Desenhado em SVG com viewBox em pixels do palco, de modo que
       `font-size: 24` no SVG seja 24 px na projeção — e continue vetorial
       na exportação em PDF.
     ===================================================================== */

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
    });
    return node;
  }

  L.linhas = {
    transition: 'stagger',
    render: function (s) {
      var series = lista(s.series);
      var eixoX = lista(s.eixoX);
      var temQuadro = Boolean(s.quadro);

      /* Área de desenho. Com o quadro lateral a tela cede 520 px. */
      var W = temQuadro ? 1120 : 1680;
      var H = 540;
      var mE = 118;                       /* margem esquerda: rótulos do eixo Y */
      var mD = 300;                       /* margem direita: rótulo de fim de linha */
      var mT = 26;
      var mB = 62;                        /* margem de baixo: rótulos do eixo X  */

      var plotL = mE, plotR = W - mD, plotT = mT, plotB = H - mB;
      var larguraPlot = plotR - plotL;
      var alturaPlot = plotB - plotT;

      var max = 0;
      series.forEach(function (serie) {
        lista(serie.pontos).forEach(function (v) { if (v > max) max = v; });
      });
      var topo = teto(max);

      function x(i) {
        return eixoX.length < 2
          ? plotL + larguraPlot / 2
          : plotL + (i / (eixoX.length - 1)) * larguraPlot;
      }
      function y(v) { return plotB - (v / topo) * alturaPlot; }

      var svg = svgEl('svg', {
        viewBox: '0 0 ' + W + ' ' + H,
        width: W, height: H,
        class: 'linhas__svg', 'aria-hidden': 'true'
      });

      /* Eixo Y: três marcas discretas, com o filete só na base. Grade não
         entra — o rótulo no fim de cada linha já dá a referência. */
      [0, topo / 2, topo].forEach(function (v) {
        svg.appendChild(svgEl('text', {
          x: plotL - 22, y: y(v) + 9, class: 'linhas__y', 'text-anchor': 'end'
        })).textContent = s.marcaY ? s.marcaY(v) : String(v);
      });

      svg.appendChild(svgEl('line', {
        x1: plotL, y1: plotB, x2: plotR, y2: plotB, class: 'linhas__eixo'
      }));

      /* Marca vertical em cada faixa, para o olho ancorar a categoria. */
      eixoX.forEach(function (rotulo, i) {
        svg.appendChild(svgEl('line', {
          x1: x(i), y1: plotT, x2: x(i), y2: plotB, class: 'linhas__tique'
        }));
        var t = svgEl('text', { x: x(i), y: plotB + 42, class: 'linhas__x', 'text-anchor': 'middle' });
        t.textContent = rotulo;
        svg.appendChild(t);
      });

      var rotulos = [];

      series.forEach(function (serie, k) {
        var pontos = lista(serie.pontos);
        var d = pontos.map(function (v, i) {
          return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
        }).join(' ');

        svg.appendChild(svgEl('path', {
          d: d,
          class: 'linhas__linha linhas__linha--t' + (serie.tom || Math.min(k + 1, 5)) +
                 (serie.destaque ? ' linhas__linha--destaque' : ''),
          style: '--k:' + k
        }));

        pontos.forEach(function (v, i) {
          svg.appendChild(svgEl('circle', {
            cx: x(i), cy: y(v), r: 7,
            class: 'linhas__ponto linhas__ponto--t' + (serie.tom || Math.min(k + 1, 5)) +
                   (serie.destaque ? ' linhas__ponto--destaque' : ''),
            style: '--k:' + k + '; --i:' + i
          }));
        });

        rotulos.push({ k: k, serie: serie, ancora: y(pontos[pontos.length - 1]), y: 0 });
      });

      /* Os rótulos de fim de linha, afastados uns dos outros.

         Duas linhas que terminam perto — a do envelope e a da caixa flat
         param a três centavos uma da outra — escreveriam um rótulo por cima
         do outro. Aqui eles são empurrados para baixo até respeitarem uma
         distância mínima e, se o último passar do pé do gráfico, o bloco
         inteiro sobe. Um fio ligando o ponto ao rótulo devolve a associação
         que o deslocamento tirou. */
      var ALTURA_ROTULO = 64;

      rotulos.sort(function (a, b) { return a.ancora - b.ancora; });

      rotulos.forEach(function (r, i) {
        r.y = i === 0 ? r.ancora : Math.max(r.ancora, rotulos[i - 1].y + ALTURA_ROTULO);
      });

      var excesso = rotulos[rotulos.length - 1].y - plotB;
      if (excesso > 0) rotulos.forEach(function (r) { r.y -= excesso; });

      rotulos.forEach(function (r) {
        if (Math.abs(r.y - r.ancora) > 2) {
          svg.appendChild(svgEl('path', {
            d: 'M' + plotR + ' ' + r.ancora.toFixed(1) +
               ' L' + (plotR + 12) + ' ' + r.ancora.toFixed(1) +
               ' L' + (plotR + 18) + ' ' + r.y.toFixed(1) +
               ' L' + (plotR + 24) + ' ' + r.y.toFixed(1),
            class: 'linhas__fio', style: '--k:' + r.k
          }));
        }

        var fim = svgEl('text', {
          x: plotR + 32, y: r.y + 2, class: 'linhas__fim', style: '--k:' + r.k
        });

        var nome = svgEl('tspan', { x: plotR + 32, dy: '-0.35em', class: 'linhas__fim-nome' });
        nome.textContent = r.serie.nome;

        var queda = svgEl('tspan', { x: plotR + 32, dy: '1.35em', class: 'linhas__fim-queda' });
        queda.textContent = r.serie.fim || '';

        fim.appendChild(nome);
        fim.appendChild(queda);
        svg.appendChild(fim);
      });

      var caixa = h('div', { class: 'linhas__caixa', anim: true }, [
        s.unidadeY ? h('span', { class: 'g-unidade', text: s.unidadeY }) : null
      ]);
      caixa.appendChild(svg);

      var quadro = null;
      if (temQuadro) {
        quadro = h('div', { class: 'quadro', anim: true }, [
          h('div', { class: 'quadro__titulo', html: s.quadro.titulo }),
          s.quadro.apoio ? h('p', { class: 'quadro__apoio', html: s.quadro.apoio }) : null
        ]);

        lista(s.quadro.linhas).forEach(function (l, i) {
          quadro.appendChild(h('div', { class: 'quadro__linha', style: '--k:' + i }, [
            h('div', { class: 'quadro__linha-texto' }, [
              h('span', { class: 'quadro__linha-label', text: l.label }),
              l.apoio ? h('span', { class: 'quadro__linha-apoio', text: l.apoio }) : null
            ]),
            h('span', { class: 'quadro__linha-valor', html: l.valor })
          ]));
        });
      }

      return h('div', { class: 'l-linhas pad pad--tight' + (temQuadro ? ' l-linhas--quadro' : '') }, [
        cabeca(s, 'md'),
        h('div', { class: 'l-linhas__corpo' }, [caixa, quadro]),
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     08 · cartoes — cartões de valor

       { layout: 'cartoes', eyebrow, title, sub,
         items: [{ eyebrow, valor, label, apoio, destaque }],
         recado, nota }
     ===================================================================== */

  L.cartoes = {
    transition: 'stagger',
    render: function (s) {
      var itens = lista(s.items);
      var grade = h('div', {
        class: 'cartoes' + (itens.length === 2 ? ' cartoes--dois' : '')
      });

      itens.forEach(function (c, i) {
        grade.appendChild(h('div', {
          class: 'cartao' + (c.destaque ? ' cartao--destaque' : ''),
          style: '--k:' + i,
          anim: 'slide'
        }, [
          c.eyebrow ? h('div', { class: 'cartao__olho', text: c.eyebrow }) : null,
          h('div', { class: 'cartao__valor', html: c.valor }),
          c.label ? h('div', { class: 'cartao__label', html: c.label }) : null,
          c.apoio ? h('p', { class: 'cartao__apoio', html: c.apoio }) : null
        ]));
      });

      return h('div', { class: 'l-cartoes pad' }, [
        cabeca(s, 'lg'),
        grade,
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     09 · fluxo — diagrama de etapas, com as contas embaixo

       { layout: 'fluxo', eyebrow, title, sub,
         etapas: [{ titulo, texto }],
         contas: { caixas: [{ titulo, texto, metrica }],
                   orcamento: { label, valor } },
         rodape: [{ label, valor }], nota }

       As etapas correm da esquerda para a direita, ligadas por uma seta. As
       duas contas ficam embaixo, penduradas numa barra de orçamento comum —
       é a barra que mostra que a verba é a mesma para as duas.
     ===================================================================== */

  L.fluxo = {
    transition: 'stagger',
    render: function (s) {
      var etapas = lista(s.etapas);
      var fila = h('div', { class: 'fluxo' });

      etapas.forEach(function (e, i) {
        fila.appendChild(h('div', { class: 'fluxo__etapa', style: '--k:' + i, anim: 'slide' }, [
          h('span', { class: 'fluxo__num', text: dois(i + 1) }),
          h('div', { class: 'fluxo__titulo', html: e.titulo }),
          e.texto ? h('p', { class: 'fluxo__texto', html: e.texto }) : null
        ]));

        if (i < etapas.length - 1) {
          fila.appendChild(h('div', { class: 'fluxo__seta', style: '--k:' + i, anim: true }, [
            h('span', { class: 'fluxo__seta-haste' })
          ]));
        }
      });

      var contas = null;
      if (s.contas) {
        var caixas = h('div', { class: 'contas__caixas' });

        lista(s.contas.caixas).forEach(function (c, i) {
          caixas.appendChild(h('div', { class: 'conta', style: '--k:' + i, anim: 'slide' }, [
            h('div', { class: 'conta__titulo', html: c.titulo }),
            c.texto ? h('p', { class: 'conta__texto', html: c.texto }) : null,
            c.metrica ? h('div', { class: 'conta__metrica', html: c.metrica }) : null
          ]));
        });

        contas = h('div', { class: 'contas' }, [
          caixas,
          s.contas.orcamento ? h('div', { class: 'contas__orcamento', anim: true }, [
            h('span', { class: 'contas__orcamento-label', html: s.contas.orcamento.label }),
            h('span', { class: 'contas__orcamento-valor', html: s.contas.orcamento.valor })
          ]) : null
        ]);
      }

      var rodape = null;
      if (lista(s.rodape).length) {
        rodape = h('div', { class: 'fluxo__rodape', anim: true });
        lista(s.rodape).forEach(function (r) {
          rodape.appendChild(h('span', { class: 'fluxo__rodape-item' }, [
            h('span', { class: 'fluxo__rodape-label', text: r.label }),
            h('span', { class: 'fluxo__rodape-valor', html: r.valor })
          ]));
        });
      }

      return h('div', { class: 'l-fluxo pad pad--tight' }, [
        cabeca(s, 'md'),
        fila,
        contas,
        rodape,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     10 · tabela — tabela agrupada por frente

       { layout: 'tabela', eyebrow, title, sub,
         colunas: ['Frente', 'Item', 'Valor', 'Condição'],
         grupos: [{ frente, linhas: [{ item, valor, condicao }] }],
         nota }

       A frente aparece uma vez por grupo, na primeira linha dele — repetir
       "INPI" quatro vezes só gasta tinta e atrapalha a leitura vertical.
     ===================================================================== */

  L.tabela = {
    transition: 'stagger',
    render: function (s) {
      var corpo = h('div', { class: 'tabela' });
      var k = 0;

      if (lista(s.colunas).length) {
        var cab = h('div', { class: 'tabela__linha tabela__linha--cabeca', anim: true });
        lista(s.colunas).forEach(function (c) { cab.appendChild(h('span', { text: c })); });
        corpo.appendChild(cab);
      }

      lista(s.grupos).forEach(function (g) {
        lista(g.linhas).forEach(function (l, i) {
          corpo.appendChild(h('div', {
            class: 'tabela__linha' + (i === 0 ? ' tabela__linha--abre' : ''),
            style: '--k:' + (k++),
            anim: 'slide'
          }, [
            h('span', { class: 'tabela__frente', text: i === 0 ? g.frente : '' }),
            h('span', { class: 'tabela__item', html: l.item }),
            h('span', { class: 'tabela__valor', html: l.valor }),
            h('span', { class: 'tabela__condicao', html: l.condicao || '' })
          ]));
        });
      });

      return h('div', { class: 'l-tabela pad pad--tight' }, [
        cabeca(s, 'md'),
        corpo,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     11 · decisoes — lista de aprovação, marcável durante a reunião

       { layout: 'decisoes', eyebrow, title, sub,
         items: [{ item, valor }],
         opcoes: ['Aprovado', 'Ajustar', 'Adiar'],
         nota }

       Clicar marca o status. O motor monta todos os slides uma vez só e
       nunca os remonta, então a marcação feita na reunião continua lá ao
       voltar no slide — e sai assim na exportação em PDF, que é o registro
       do que foi decidido.

       Os botões são `tabindex="-1"` e largam o foco assim que clicados: se
       um deles ficasse com o foco, a barra de espaço marcaria o botão em
       vez de passar o slide.
     ===================================================================== */

  L.decisoes = {
    transition: 'stagger',
    render: function (s) {
      var opcoes = lista(s.opcoes).length ? lista(s.opcoes) : ['Aprovado', 'Ajustar', 'Adiar'];
      var corpo = h('div', { class: 'decisoes' });

      lista(s.items).forEach(function (d, i) {
        var seletor = h('div', { class: 'decisao__seletor', role: 'group', 'aria-label': 'Status' });

        opcoes.forEach(function (rotulo) {
          var botao = h('button', {
            class: 'decisao__opcao',
            type: 'button',
            tabindex: '-1',
            'data-status': rotulo.toLowerCase(),
            'aria-pressed': 'false',
            text: rotulo
          });

          botao.addEventListener('click', function () {
            var jaMarcado = botao.getAttribute('aria-pressed') === 'true';

            Array.prototype.forEach.call(
              seletor.querySelectorAll('.decisao__opcao'),
              function (outro) { outro.setAttribute('aria-pressed', 'false'); }
            );

            /* Clicar de novo no mesmo status desmarca — dá para corrigir
               sem ter de escolher outra coisa. */
            botao.setAttribute('aria-pressed', jaMarcado ? 'false' : 'true');
            linha.setAttribute('data-marcado', jaMarcado ? '' : botao.getAttribute('data-status'));
            botao.blur();
          });

          seletor.appendChild(botao);
        });

        var linha = h('div', { class: 'decisao', style: '--k:' + i, anim: 'slide' }, [
          h('span', { class: 'decisao__num', text: dois(i + 1) }),
          h('div', { class: 'decisao__texto' }, [
            h('span', { class: 'decisao__item', html: d.item }),
            d.apoio ? h('span', { class: 'decisao__apoio', html: d.apoio }) : null
          ]),
          h('span', { class: 'decisao__valor', html: d.valor }),
          seletor
        ]);

        corpo.appendChild(linha);
      });

      return h('div', { class: 'l-decisoes pad pad--tight' }, [
        cabeca(s, 'md'),
        corpo,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     12 · confronto — duas fotos lado a lado, cada uma com a sua etiqueta

       { layout: 'confronto', eyebrow, title, sub,
         lados: [{ nome, apoio, src, alt, focal, texto, nosso }],
         recado, nota }

     O `duo` do motor já põe duas fotos lado a lado, e serve bem quando as
     duas são do mesmo assunto. Aqui elas são de assuntos OPOSTOS, e o
     slide só funciona se der para saber qual é qual sem ninguém narrar.
     Por isso cada foto desce para uma etiqueta própria — a marca, onde a
     foto foi feita e a linha que diz o que se está vendo — em vez de um
     subtítulo único no alto dizendo "à esquerda… à direita…".

     `nosso: true` marca o nosso lado: o filete acima da etiqueta fecha e o
     nome escurece. É a mesma ideia da regra de cor dos gráficos — o que é
     da concorrência fica cinza —, e aqui ela também não carrega sozinha a
     leitura, porque o nome está escrito embaixo de cada foto.

     A moldura é a `.frame` do motor, de propósito: corte, cantos e o
     assentamento da imagem continuam iguais aos de toda foto do sistema.
     O que este arquivo acrescenta é só o pé.
     ===================================================================== */

  L.confronto = {
    transition: 'stagger',
    render: function (s) {
      var grade = h('div', { class: 'confronto' });

      lista(s.lados).forEach(function (lado) {
        var moldura = h('div', { class: 'frame' }, [
          h('img', { src: lado.src, alt: lado.alt || '' })
        ]);

        /* O corte da foto. Todas são verticais de celular ou de campanha, e
           entram numa moldura deitada: sem isto o corte pega o meio e perde
           justamente o que interessa. */
        if (lado.focal) moldura.style.setProperty('--focal', lado.focal);

        grade.appendChild(h('div', {
          class: 'confronto__lado' + (lado.nosso ? ' confronto__lado--nosso' : ''),
          anim: 'slide'
        }, [
          moldura,
          h('div', { class: 'confronto__pe' }, [
            h('div', { class: 'confronto__marca' }, [
              h('span', { class: 'confronto__nome', text: lado.nome }),
              lado.apoio ? h('span', { class: 'confronto__onde', text: lado.apoio }) : null
            ]),
            lado.texto ? h('p', { class: 'confronto__texto', html: lado.texto }) : null
          ])
        ]));
      });

      return h('div', { class: 'l-confronto pad pad--tight' }, [
        cabeca(s, 'md'),
        grade,
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };


  /* =====================================================================
     13 · marca — o logo de hoje e o de 2027, um ao lado do outro

       { layout: 'marca', eyebrow, title, sub,
         antes:  { src, alt, etiqueta, apoio },
         depois: { svg, alt, etiqueta, apoio, assinatura },
         recado, nota }

     A tela que pede o rebrand mostrando o rebrand. O lado esquerdo é o
     logo atual, em PNG, porque ele tem degradê e não há o que tingir. O
     direito é o desenho vetorial do manual (ver marca.js), em terracota
     sobre o verde escuro — o mesmo par que o manual usa na página do logo.

     Os dois campos têm a mesma altura e a mesma largura de propósito: o
     que muda entre eles é só o desenho, que é exatamente o que está em
     discussão.
     ===================================================================== */

  L.marca = {
    transition: 'stagger',
    render: function (s) {
      function campo(lado, classe) {
        if (!lado) return null;

        var desenho;
        if (lado.svg) {
          var lib = global.DRAWINGS || {};
          desenho = h('div', { class: 'marca__arte' });
          desenho.innerHTML = typeof lib[lado.svg] === 'function'
            ? lib[lado.svg](lado.alt || 'Lesco')
            : '';
        } else {
          desenho = h('div', { class: 'marca__arte' }, [
            h('img', { src: lado.src, alt: lado.alt || '' })
          ]);
        }

        return h('div', { class: 'marca__campo ' + classe, anim: 'slide' }, [
          h('span', { class: 'marca__etiqueta', text: lado.etiqueta }),
          desenho,
          lado.assinatura ? h('span', { class: 'marca__assinatura', text: lado.assinatura }) : null,
          lado.apoio ? h('p', { class: 'marca__apoio', html: lado.apoio }) : null
        ]);
      }

      return h('div', { class: 'l-marca pad pad--tight' }, [
        cabeca(s, 'md'),
        h('div', { class: 'marca' }, [
          campo(s.antes, 'marca__campo--hoje'),
          campo(s.depois, 'marca__campo--novo')
        ]),
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };

  /* =====================================================================
     14 · topico — um assunto por tela, com ou sem foto

       { layout: 'topico', eyebrow, num, title, text, destaques,
         media: [{ src, alt, focal }],   // zero, uma ou duas
         recado, nota }

     Os quatro pontos de "Como a Arkos se sustenta" viraram quatro telas, e
     este layout é o que as mantém parecendo um conjunto: o mesmo número
     grande, o mesmo título, o mesmo corpo. Duas delas têm foto e duas não
     — e esse é o ponto de ter um layout só. Sem ele, a tela sem foto
     viraria outro layout e o bloco perderia o ritmo.

     Quando não há foto, a coluna de texto abre para a largura inteira em
     vez de deixar metade da tela vazia. Nenhuma moldura vazia entra aqui:
     o `frame--empty` do motor serve para foto que vai chegar, e aqui as
     duas telas sem foto são sem foto de propósito.
     ===================================================================== */

  L.topico = {
    transition: 'stagger',
    render: function (s) {
      var fotos = lista(s.media);

      var texto = h('div', { class: 'topico__texto' }, [
        s.num ? h('span', { class: 'topico__num', text: s.num, anim: true }) : null,
        olho(s.eyebrow),
        titulo(s.title, s.tituloTam || 'lg'),
        s.text ? h('p', { class: 'topico__corpo', html: s.text, anim: true }) : null,
        faixaDestaques(s.destaques)
      ]);

      var corpo = h('div', {
        class: 'topico' + (fotos.length ? ' topico--com-foto' : ' topico--so-texto') +
               (fotos.length === 2 ? ' topico--duas' : '')
      }, [texto]);

      if (fotos.length) {
        var quadro = h('div', { class: 'topico__fotos' });
        fotos.forEach(function (m) {
          var moldura = h('div', { class: 'frame', anim: 'slide' }, [
            h('img', { src: m.src, alt: m.alt || '' })
          ]);
          if (m.focal) moldura.style.setProperty('--focal', m.focal);
          quadro.appendChild(moldura);
        });
        corpo.appendChild(quadro);
      }

      return h('div', { class: 'l-topico pad' }, [
        corpo,
        s.recado ? h('p', { class: 'g-recado', html: s.recado, anim: true }) : null,
        nota(s.nota)
      ]);
    }
  };

  /* A faixa de destaques do motor, refeita aqui porque a função de lá é
     privada do IIFE de engine/layouts.js. A classe é a mesma, então o
     estilo continua vindo de engine/layouts.css — nada de CSS novo. */
  function faixaDestaques(valores) {
    var itens = lista(valores);
    if (!itens.length) return null;

    var faixa = h('div', { class: 'destaques', anim: true });
    itens.forEach(function (d) {
      faixa.appendChild(h('span', { class: 'destaques__item', text: d }));
    });
    return faixa;
  }

  /* =====================================================================
     15 · matriz — o diagrama de marca × classe do INPI

       { layout: 'matriz', eyebrow, title, sub,
         formatos: [{ chave: 'nominativa', nome, protege }],
         dados: N.matrizINPI(),
         nota }

     O infográfico que substitui dois parágrafos. Ele diz três coisas sem
     escrever nenhuma delas:

       o registro é por CLASSE        — são as colunas
       cada cruzamento é um PEDIDO    — e um pedido é uma taxa, então dá
                                        para contar o custo olhando
       há dois FORMATOS               — e a diferença entre eles é o
                                        próprio desenho do selo

     O SELO É O ARGUMENTO
       Uma barra é o nome. Um quadrado é o símbolo. Nominativa tem só a
       barra; mista tem o quadrado grudado nela. Quem olha entende, sem
       legenda, por que trocar o logo envelhece um registro misto e não
       mexe num nominativo — que é exatamente a pergunta que vem na sala.

     A matriz não é digitada: vem de N.matrizINPI(), que a monta a partir
     dos pedidos dos pacotes em dados.js. Acrescentar uma classe lá muda o
     diagrama e o total da tela do custo ao mesmo tempo.
     ===================================================================== */

  /* Uma barra é o nome; um quadrado é o símbolo. É só isso. */
  function selo(formato) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 64 24');
    svg.setAttribute('class', 'selo selo--' + formato);
    svg.setAttribute('aria-hidden', 'true');

    function peca(x, y, largura, altura) {
      var r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', largura); r.setAttribute('height', altura);
      r.setAttribute('rx', '2');
      svg.appendChild(r);
    }

    if (formato === 'mista') {
      peca(0, 0, 24, 24);     /* o símbolo */
      peca(32, 6, 32, 12);    /* o nome    */
    } else {
      peca(0, 6, 64, 12);     /* só o nome */
    }
    return svg;
  }

  L.matriz = {
    transition: 'stagger',
    render: function (s) {
      var d = s.dados || { classes: [], marcas: [] };

      /* ---- a faixa que explica os dois selos ---------------------- */
      var faixa = h('div', { class: 'formatos' });
      lista(s.formatos).forEach(function (f, i) {
        var cartao = h('div', { class: 'formato', style: '--k:' + i, anim: 'slide' }, [
          h('div', { class: 'formato__selo' }),
          h('div', { class: 'formato__corpo' }, [
            h('span', { class: 'formato__nome', text: f.nome }),
            h('p', { class: 'formato__texto', html: f.protege })
          ])
        ]);
        cartao.querySelector('.formato__selo').appendChild(selo(f.chave));
        faixa.appendChild(cartao);
      });

      /* ---- a matriz ------------------------------------------------ */
      var grade = h('div', {
        class: 'matriz',
        style: '--colunas:' + d.classes.length
      });

      grade.appendChild(h('div', { class: 'matriz__canto', text: 'Marca', anim: true }));
      d.classes.forEach(function (c) {
        grade.appendChild(h('div', {
          class: 'matriz__titulo' + (c.opcional ? ' matriz__titulo--opcional' : ''),
          anim: true
        }, [
          h('span', { class: 'matriz__classe', text: String(c.numero) }),
          h('span', { class: 'matriz__nome', text: c.nome }),
          c.apoio ? h('span', { class: 'matriz__apoio', text: c.apoio }) : null
        ]));
      });

      d.marcas.forEach(function (linha, k) {
        grade.appendChild(h('div', { class: 'matriz__marca', style: '--k:' + k, anim: 'slide', text: linha.marca }));
        d.classes.forEach(function (c) {
          var formato = linha.celulas[c.numero];
          var celula = h('div', {
            class: 'matriz__celula' + (formato ? '' : ' matriz__celula--vazia'),
            style: '--k:' + k
          });
          if (formato) celula.appendChild(selo(formato));
          grade.appendChild(celula);
        });
      });

      return h('div', { class: 'l-matriz pad pad--tight' }, [
        cabeca(s, 'md'),
        faixa,
        grade,
        nota(s.nota)
      ]);
    }
  };
})(window);
