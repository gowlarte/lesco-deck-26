/* ---------------------------------------------------------------------------
   Renderizadores de layout.

   Cada função recebe o objeto do slide (como escrito em decks/<id>/deck.js)
   e devolve o conteúdo do slide já montado. Script clássico de propósito:
   sem módulos e sem fetch, para que a apresentação abra com duplo clique,
   direto do disco, sem servidor nenhum.

   Para acrescentar um layout novo: crie a função aqui, registre-a em LAYOUTS
   no fim do arquivo e escreva o CSS correspondente em engine/layouts.css.
   --------------------------------------------------------------------------- */

(function (global) {
  'use strict';

  /* Caminho da marca a partir de decks/<id>/index.html. */
  var BRAND_PATH = '../../shared/brand/';

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */

  /* Cria um elemento. `props.anim` vira data-anim; `props.html` aceita
     quebras de linha escritas como \n no conteúdo do deck. */
  function h(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};

    Object.keys(props).forEach(function (key) {
      var value = props[key];
      if (value === null || value === undefined || value === false) return;

      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'html') node.innerHTML = breaks(value);
      else if (key === 'anim') node.setAttribute('data-anim', value === true ? '' : value);
      else if (key === 'style') node.setAttribute('style', value);
      else node.setAttribute(key, value);
    });

    toArray(children).forEach(function (child) {
      if (child) node.appendChild(child);
    });

    return node;
  }

  function toArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  /* Converte \n em <br> e escapa o resto — o conteúdo do deck é texto, não HTML. */
  function breaks(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function logo(tone) {
    return h('img', {
      class: 'brand-mark',
      src: BRAND_PATH + (tone === 'ink' ? 'logo-light.png' : 'logo-dark.png'),
      alt: 'Lesco',
      anim: true
    });
  }

  /* Uma foto dentro da moldura padrão.

     Com `draw: true` a moldura passa a tratar a imagem como desenho técnico:
     aparece inteira, com folga, em vez de ser cortada como uma fotografia.

     Sem `src`, a moldura vira um espaço reservado que mostra a descrição da
     foto que falta. É assim que os slides ainda sem material de obra ficam
     apresentáveis: quando a foto chegar, basta acrescentar `src` ao lado do
     `note` — nada mais muda. */
  function frame(media, extraClass, animate) {
    if (media && media.svg) return vectorFrame(media, extraClass, animate);
    if (!media) return null;

    var wrap = h('div', {
      class: 'frame' +
             (extraClass ? ' ' + extraClass : '') +
             (media.draw ? ' frame--draw' : '') +
             (media.src || media.video || media.youtube ? '' : ' frame--empty'),
      anim: animate ? true : null
    });

    if (media.focal) wrap.style.setProperty('--focal', media.focal);

    /* Vídeo entra mudo e em laço, com os controles à mão para pausar num
       ponto ou ligar o som. Quem dá o play é o deck, ao chegar no slide —
       ver syncVideos em deck.js. O poster é o que aparece antes de tocar,
       e é também o que sai na exportação em PDF, onde nada roda. */
    /* Vídeo hospedado no YouTube. Vai para o domínio sem cookie e sem
       sugestões de outros canais no fim. Não toca sozinho: quem apresenta
       aperta o play, e ao sair do slide o deck recarrega o quadro para
       calar o som — ver syncVideos em deck.js. */
    if (media.youtube) {
      var endereco = 'https://www.youtube-nocookie.com/embed/' + media.youtube +
                     '?rel=0&modestbranding=1&playsinline=1';

      wrap.appendChild(h('iframe', {
        src: endereco,
        'data-tela': endereco,
        title: media.alt || 'Vídeo',
        allow: 'accelerometer; encrypted-media; picture-in-picture; fullscreen',
        allowfullscreen: true,
        frameborder: '0'
      }));
    } else if (media.video) {
      var filme = h('video', {
        src: media.video,
        poster: media.poster || null,
        loop: true,
        playsinline: true,
        controls: true,
        preload: 'metadata',
        'aria-label': media.alt || ''
      });

      /* O atributo muted não basta num elemento criado por script: ele diz
         como o vídeo COMEÇA, e quem manda depois é a propriedade. Sem estas
         duas linhas o filme entra com som no meio da apresentação — e o
         navegador, que só deixa tocar sozinho o que está mudo, provavelmente
         nem deixa começar. */
      filme.defaultMuted = true;
      filme.muted = true;

      wrap.appendChild(filme);
    } else if (media.src) {
      wrap.appendChild(h('img', { src: media.src, alt: media.alt || '' }));
    } else {
      wrap.appendChild(h('div', { class: 'frame__note' }, [
        h('span', { class: 'frame__note-tag', text: 'Foto a inserir' }),
        h('span', { class: 'frame__note-text', text: media.note || media.alt || '' })
      ]));
    }

    if (media.chamada) wrap.appendChild(chamada(media.chamada));

    return wrap;
  }

  /* ---------------------------------------------------------------------
     Chamada sobre a foto

     Um ponto marcado na foto e, ligado a ele por um fio em cotovelo, um
     quadro branco com a peça isolada — o recurso das pranchas de detalhe,
     para mostrar o que está escondido dentro do conjunto sem precisar de
     outra fotografia.

         chamada: {
           src: 'img/tec/tubo-aco.webp',
           alt: 'Tubo de aço',
           alvo: '19% 8%',      o ponto apontado
           cotovelo: '55%',     onde o fio dobra para descer
           caixa: '31% 51%',    canto superior esquerdo do quadro
           largura: '47%'       largura do quadro
         }

     O fio sai do ponto na horizontal, dobra no cotovelo e desce até o topo
     do quadro. Tudo em porcentagem da moldura: a chamada acompanha a foto
     em qualquer tela e continua no lugar na exportação.
     --------------------------------------------------------------------- */

  function porcento(valor, padrao) {
    var p = String(valor == null ? padrao : valor).trim().split(' ').filter(Boolean);
    var x = parseFloat(p[0]);
    var y = parseFloat(p[1] == null ? p[0] : p[1]);
    return [isNaN(x) ? 0 : x, isNaN(y) ? 0 : y];
  }

  function chamada(dados) {
    var alvo = porcento(dados.alvo, '20% 10%');
    var caixa = porcento(dados.caixa, '30% 50%');
    var largura = porcento(dados.largura, '46%')[0];
    var cotovelo = porcento(dados.cotovelo, caixa[0] + largura / 2 + '%')[0];

    var grupo = h('div', { class: 'chamada' });

    /* O fio é SVG esticado sobre a moldura: assim os pontos são a própria
       porcentagem. A moldura não é quadrada, então a escala deforma — o que
       não pode deformar é a espessura do traço, e é para isso que serve o
       non-scaling-stroke. */
    var fio = h('div', { class: 'chamada__fio' });
    fio.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<polyline points="' + alvo[0] + ',' + alvo[1] + ' ' +
                            cotovelo + ',' + alvo[1] + ' ' +
                            cotovelo + ',' + caixa[1] + '"' +
      ' fill="none" vector-effect="non-scaling-stroke"/></svg>';
    grupo.appendChild(fio);

    grupo.appendChild(h('div', {
      class: 'chamada__ponto',
      style: 'left:' + alvo[0] + '%; top:' + alvo[1] + '%'
    }));

    /* O quadro entra por último e tapa a ponta do fio. */
    grupo.appendChild(h('div', {
      class: 'chamada__quadro',
      style: 'left:' + caixa[0] + '%; top:' + caixa[1] + '%; width:' + largura + '%'
    }, [
      h('img', { src: dados.src, alt: dados.alt || '' })
    ]));

    return grupo;
  }

  /* Desenho vetorial, vindo de drawings.js ao lado do deck.

     O SVG entra direto no slide, e não dentro de um <img>: assim herda as
     fontes e as cores do tema, e continua vetorial na exportação em PDF —
     um <img> seria rasterizado antes de imprimir. */
  function vectorFrame(media, extraClass, animate) {
    var lib = global.DRAWINGS || {};
    var desenho = typeof lib[media.svg] === 'function' ? lib[media.svg](media.alt) : '';

    var wrap = h('div', {
      class: 'frame frame--draw' + (extraClass ? ' ' + extraClass : '') +
             (desenho ? '' : ' frame--empty'),
      anim: animate ? true : null
    });

    if (desenho) {
      wrap.innerHTML = desenho;
    } else {
      wrap.appendChild(h('div', { class: 'frame__note' }, [
        h('span', { class: 'frame__note-tag', text: 'Desenho a inserir' }),
        h('span', { class: 'frame__note-text', text: media.note || media.alt || media.svg })
      ]));
    }

    return wrap;
  }

  /* Bloco de linhas label/valor. Um valor ainda não fechado ("a confirmar")
     é marcado sozinho, para ficar evidente no slide o que falta preencher. */
  function rows(list, animate) {
    var box = h('div', { class: 'rows' });

    toArray(list).forEach(function (entry) {
      var label = entry[0];
      var value = entry[1];
      var pending = /^a (confirmar|definir)$/i.test(String(value).trim());

      box.appendChild(h('div', { class: 'row', anim: animate ? 'slide' : null }, [
        h('span', { class: 'row__label', text: label }),
        h('span', { class: 'row__value' + (pending ? ' is-pending' : ''), html: value })
      ]));
    });

    return box;
  }

  /* Imagem de fundo ocupando o slide inteiro, atrás do conteúdo.

     Aceita { src, focal, overlay }. O overlay é o véu que garante contraste
     para a tipografia: 'left' escurece mais do lado do texto e deixa o
     desenho respirar do outro, 'full' escurece por igual, e `false` dispensa
     o véu quando a própria imagem já é escura o bastante. */
  function background(config) {
    if (!config || !config.src) return null;

    var box = h('div', { class: 'slide-bg' });
    if (config.focal) box.style.setProperty('--focal', config.focal);

    box.appendChild(h('img', { src: config.src, alt: config.alt || '' }));

    if (config.overlay !== false) {
      box.appendChild(h('div', {
        class: 'slide-bg__scrim slide-bg__scrim--' + (config.overlay || 'left')
      }));
    }

    return box;
  }

  function eyebrow(text) {
    if (!text) return null;
    return h('div', { class: 'eyebrow', text: text, anim: true });
  }

  function title(text, size, animKind) {
    if (!text) return null;
    return h('h2', { class: 'title title--' + (size || 'lg'), html: text, anim: animKind || 'mask' });
  }

  /* ---------------------------------------------------------------------
     Layouts
     --------------------------------------------------------------------- */

  var LAYOUTS = {};

  /* 01 · Capa ---------------------------------------------------------- */
  LAYOUTS.cover = {
    transition: 'curtain',
    tone: 'ink',
    render: function (s) {
      return h('div', { class: 'l-cover pad' }, [
        background(s.background),
        s.logo === false ? null : logo(s.tone || 'ink'),
        h('div', {}, [
          eyebrow(s.eyebrow),
          h('h1', { class: 'title title--hero', html: s.title, anim: 'mask' }),
          s.sub ? h('p', { class: 'l-cover__sub', html: s.sub, anim: true }) : null
        ]),
        s.footer ? h('div', { class: 'l-cover__footer', html: s.footer, anim: true }) : null
      ]);
    }
  };

  /* 02 · Sumário ------------------------------------------------------- */
  LAYOUTS.index = {
    transition: 'stagger',
    render: function (s) {
      var list = h('div', { class: 'l-index__list' });

      toArray(s.items).forEach(function (item, i) {
        list.appendChild(h('div', { class: 'l-index__item', anim: 'slide' }, [
          h('span', { class: 'l-index__num', text: pad(i + 1) }),
          h('div', { class: 'l-index__bloco' }, [
            h('span', { class: 'l-index__name', text: item.name }),
            item.apoio ? h('span', { class: 'l-index__apoio', text: item.apoio }) : null
          ]),
          item.tag ? h('span', { class: 'l-index__tag', text: item.tag }) : null
        ]));
      });

      /* O índice foi desenhado para quatro obras. Com a quinta a lista não
         cabe mais no slide e o último projeto some por baixo da borda —
         num slide que se chama 'os cinco projetos'. A partir de cinco
         itens o espaçamento fecha. */
      return h('div', {
        class: 'l-index pad' + (toArray(s.items).length >= 5 ? ' l-index--denso' : '')
      }, [
        eyebrow(s.eyebrow),
        title(s.title, 'xl'),
        list
      ]);
    }
  };

  /* 03 · Texto + dados -------------------------------------------------- */
  LAYOUTS.split = {
    transition: 'stagger',
    render: function (s) {
      return h('div', { class: 'l-split pad' }, [
        h('div', { class: 'l-split__text' }, [
          eyebrow(s.eyebrow),
          title(s.title, 'lg'),
          s.text ? h('p', { class: 'lead', html: s.text, anim: true }) : null
        ]),
        h('div', { class: 'l-split__side' }, [
          rows(s.rows, true),
          s.note ? h('p', { class: 'l-split__note', html: s.note, anim: true }) : null
        ])
      ]);
    }
  };

  /* 04 · Números -------------------------------------------------------- */
  LAYOUTS.stats = {
    transition: 'stagger',
    render: function (s) {
      var grid = h('div', { class: 'l-stats__grid' });

      toArray(s.items).forEach(function (item) {
        /* Já nasce com o valor final. Quem zera é a contagem, ao entrar no
           slide — assim a miniatura na grade mostra o número de verdade em
           vez de um zero. */
        var value = h('div', { class: 'stat__value' }, [
          h('span', { 'data-count': item.value, text: item.value }),
          item.unit ? h('span', { class: 'stat__unit', text: item.unit }) : null
        ]);

        grid.appendChild(h('div', { class: 'stat' + (item.accent ? ' stat--accent' : ''), anim: true }, [
          h('div', {}, [
            item.eyebrow ? h('div', { class: 'stat__eyebrow', text: item.eyebrow }) : null,
            item.caption ? h('div', { class: 'stat__caption', text: item.caption }) : null
          ]),
          value
        ]));
      });

      return h('div', { class: 'l-stats pad' + (s.termos ? ' l-stats--termos' : '') }, [
        eyebrow(s.eyebrow),
        title(s.title, 'lg'),
        s.sub ? h('p', { class: 'sub', html: s.sub, anim: true }) : null,
        grid,
        s.note ? h('p', { class: 'l-stats__note', html: s.note, anim: true }) : null
      ]);
    }
  };

  /* 05 · Abertura de projeto -------------------------------------------- */
  LAYOUTS.chapter = {
    transition: 'curtain',
    tone: 'ink',
    render: function (s) {
      return h('div', { class: 'l-chapter pad' }, [
        background(s.background),
        h('div', { class: 'l-chapter__num', text: s.num, anim: 'numeral' }),
        h('div', {}, [
          eyebrow(s.eyebrow),
          h('h2', { class: 'title title--xl', html: s.title, anim: 'mask' })
        ]),
        s.footer ? h('div', { class: 'l-chapter__footer', html: s.footer, anim: true }) : null
      ]);
    }
  };

  /* 06 · Ficha técnica --------------------------------------------------- */
  LAYOUTS.specs = {
    transition: 'stagger',
    render: function (s) {
      return h('div', { class: 'l-specs pad' }, [
        h('div', { class: 'l-specs__text' }, [
          eyebrow(s.eyebrow),
          title(s.title || 'Ficha técnica', 'lg'),
          rows(s.rows, true)
        ]),
        h('div', { class: 'l-specs__figure', anim: true }, [
          s.figure ? h('img', { src: s.figure, alt: s.figureAlt || '' }) : null
        ]),
        destaques(s.destaques)
      ]);
    }
  };

  /* 07 · Foto de página inteira ------------------------------------------ */
  LAYOUTS.photo = {
    transition: 'mask',
    tone: 'ink',
    render: function (s) {
      var hasCaption = Boolean(s.title || s.eyebrow);
      var box = h('div', { class: 'l-photo' }, [
        frame({ src: s.src, alt: s.alt, focal: s.focal, note: s.note,
                video: s.video, poster: s.poster,
                chamada: s.chamada, draw: s.draw }, 'frame--bleed')
      ]);

      if (hasCaption) {
        box.appendChild(h('div', { class: 'l-photo__scrim' }));
        box.appendChild(h('div', { class: 'l-photo__caption' }, [
          eyebrow(s.eyebrow),
          s.title ? h('h2', { class: 'title title--md', html: s.title, anim: 'mask' }) : null
        ]));
      }

      return box;
    }
  };

  /* 08 · Título + duas fotos ---------------------------------------------- */
  LAYOUTS.duo = {
    transition: 'stagger',
    render: function (s) {
      var fotos = toArray(s.media);

      /* Com três fotos a grade vira três colunas. Fotos de obra costumam vir
         em pé, e três em pé lado a lado cabem melhor do que duas em cima e
         uma sobrando embaixo. */
      var grid = h('div', {
        class: 'l-duo__grid' + (fotos.length === 3 ? ' l-duo__grid--tres' : '')
      });

      fotos.forEach(function (media) {
        grid.appendChild(frame(media, null, true));
      });

      return h('div', { class: 'l-duo pad pad--tight' }, [
        eyebrow(s.eyebrow),
        title(s.title, 'md'),
        s.sub ? h('p', { class: 'sub', html: s.sub, anim: true }) : null,
        grid
      ]);
    }
  };

  /* Faixa de destaques: dois ou três números que o público leva embora
     mesmo sem ler a ficha inteira. */
  function destaques(lista) {
    var itens = toArray(lista);
    if (!itens.length) return null;

    var faixa = h('div', { class: 'destaques', anim: true });
    itens.forEach(function (d) {
      faixa.appendChild(h('span', { class: 'destaques__item', text: d }));
    });
    return faixa;
  }

  /* Etapas numeradas: a sequência de montagem contada em passos curtos,
     sem precisar de uma imagem por etapa. */
  function passos(lista) {
    var itens = toArray(lista);
    if (!itens.length) return null;

    /* Com cinco ou mais etapas a coluna de texto não cabe no slide: a
       partir daí a lista fecha o espaçamento. */
    var ol = h('ol', {
      class: 'passos' + (itens.length >= 5 ? ' passos--denso' : ''),
      anim: true
    });
    itens.forEach(function (p, i) {
      ol.appendChild(h('li', { class: 'passos__item' }, [
        h('span', { class: 'passos__num', text: pad(i + 1) }),
        h('span', { class: 'passos__texto' }, [
          h('strong', { class: 'passos__rotulo', text: p.label || '' }),
          p.text ? h('span', { class: 'passos__descricao', text: p.text }) : null
        ])
      ]));
    });
    return ol;
  }

  /* 09 · Foto grande + texto ---------------------------------------------- */
  LAYOUTS.detail = {
    transition: 'mask',
    render: function (s) {
      /* Um slide de detalhe pode trazer mais de uma prancha técnica. Com
         duas, elas empilham na mesma coluna e dividem a altura — desenho
         landscape sobra altura de sobra numa coluna em pé. */
      var pranchas = toArray(s.media);
      var coluna = pranchas.length > 1
        ? h('div', { class: 'l-detail__pranchas' }, pranchas.map(function (m) {
            return frame(m);
          }))
        : frame(s.media);

      /* Medalhão: a peça sai de dentro da foto e vira um disco ao lado
         dela, ligado por um fio ao ponto exato de onde saiu. O disco
         precisa vazar para fora da moldura, que recorta, então quem
         segura os dois é um invólucro sem recorte. O fio, o ponto e o
         disco dividem a mesma altura — por isso o fio é reto. */
      if (s.medalhao) {
        var caixa = h('div', { class: 'l-detail__media' });
        if (s.medalhao.ponto)  caixa.style.setProperty('--ponto-x', s.medalhao.ponto);
        if (s.medalhao.altura) caixa.style.setProperty('--med-y', s.medalhao.altura);

        caixa.appendChild(coluna);
        caixa.appendChild(h('span', { class: 'medalhao__fio medalhao__fio--dentro' }));
        caixa.appendChild(h('span', { class: 'medalhao__fio medalhao__fio--fora' }));
        caixa.appendChild(h('span', { class: 'medalhao__ponto' }));
        caixa.appendChild(h('div', { class: 'medalhao', anim: true }, [
          h('img', { src: s.medalhao.src, alt: s.medalhao.alt || '' })
        ]));

        coluna = caixa;
      }

      return h('div', {
        class: 'l-detail pad pad--tight' +
               (s.denso ? ' l-detail--denso' : '') +
               (s.medalhao ? ' l-detail--medalhao' : '')
      }, [
        coluna,
        h('div', { class: 'l-detail__text' }, [
          eyebrow(s.eyebrow || 'Detalhe'),
          title(s.title, 'md'),
          s.text ? h('p', { class: 'lead', html: s.text, anim: true }) : null,
          passos(s.passos),
          destaques(s.destaques)
        ])
      ]);
    }
  };

  /* 10 · Texto + foto sangrando -------------------------------------------- */
  LAYOUTS.half = {
    transition: 'mask',
    render: function (s) {
      var cls = 'l-half';
      if (s.reverse) cls += ' l-half--reverse';
      if (s.align === 'bottom') cls += ' l-half--bottom';

      return h('div', { class: cls }, [
        h('div', { class: 'l-half__text' }, [
          eyebrow(s.eyebrow),
          title(s.title, 'md'),
          s.text ? h('p', { class: 'lead', html: s.text, anim: true }) : null,
          destaques(s.destaques)
        ]),
        h('div', { class: 'l-half__media' }, [frame(s.media, 'frame--bleed')])
      ]);
    }
  };

  /* 11 · Lista numerada ----------------------------------------------------- */
  /* 13 · faixa — foto grande com texto ao lado e, embaixo, uma tira de
     imagens pequenas legendadas. É o formato de prancha de detalhe: o
     assunto em cima, a sequência que o explica embaixo. */
  LAYOUTS.faixa = {
    transition: 'stagger',
    render: function (s) {
      var tira = h('div', { class: 'l-faixa__tira' });

      toArray(s.tira).forEach(function (item) {
        tira.appendChild(h('div', { class: 'l-faixa__item', anim: true }, [
          frame({ src: item.src, alt: item.alt || item.label || '', draw: item.draw }),
          h('span', { class: 'l-faixa__legenda', text: item.label || '' })
        ]));
      });

      return h('div', { class: 'l-faixa pad pad--tight' }, [
        h('div', { class: 'l-faixa__topo' }, [
          frame(s.media),
          h('div', { class: 'l-faixa__texto' }, [
            eyebrow(s.eyebrow),
            title(s.title, 'md'),
            s.text ? h('p', { class: 'lead', html: s.text, anim: true }) : null,
            destaques(s.destaques)
          ])
        ]),
        tira
      ]);
    }
  };

  LAYOUTS.checklist = {
    transition: 'stagger',
    render: function (s) {
      var grid = h('div', { class: 'l-checklist__grid' });

      toArray(s.items).forEach(function (item, i) {
        grid.appendChild(h('div', { class: 'l-checklist__item', anim: 'slide' }, [
          h('span', { class: 'l-checklist__num', text: pad(i + 1) }),
          typeof item === 'string'
            ? h('span', { class: 'l-checklist__text', html: item })
            : h('span', { class: 'l-checklist__text' }, [
                h('strong', { class: 'l-checklist__rotulo', text: item.label }),
                item.text ? h('span', { class: 'l-checklist__nota', text: item.text }) : null
              ])
        ]));
      });

      return h('div', { class: 'l-checklist pad' }, [
        eyebrow(s.eyebrow),
        title(s.title, 'lg'),
        grid
      ]);
    }
  };

  /* 12 · Cards com imagem --------------------------------------------------- */
  LAYOUTS.cards = {
    transition: 'stagger',
    render: function (s) {
      var itens = toArray(s.items);

      /* Quatro etapas cabem numa linha só; mais que isso não é card, é lista. */
      var grid = h('div', {
        class: 'l-cards__grid' + (itens.length === 4 ? ' l-cards__grid--quatro' : '')
      });

      itens.forEach(function (item) {
        grid.appendChild(h('div', { class: 'card', anim: true }, [
          h('div', { class: 'card__label', text: item.label }),
          item.text ? h('p', { class: 'card__text', html: item.text }) : null,
          h('div', { class: 'card__figure' }, [
            item.src ? h('img', { src: item.src, alt: item.alt || '' }) : null
          ])
        ]));
      });

      return h('div', { class: 'l-cards pad pad--tight' }, [
        eyebrow(s.eyebrow),
        title(s.title, 'md'),
        s.sub ? h('p', { class: 'sub', html: s.sub, anim: true }) : null,
        grid,
        destaques(s.destaques)
      ]);
    }
  };

  /* 13 · Encerramento -------------------------------------------------------- */
  LAYOUTS.outro = {
    transition: 'curtain',
    tone: 'ink',
    render: function (s) {
      return h('div', { class: 'l-outro pad' }, [
        background(s.background),
        s.logo === false ? null : logo(s.tone || 'ink'),
        h('h2', { class: 'title title--hero', html: s.title, anim: 'mask' }),
        h('div', { class: 'l-outro__foot' }, [
          h('div', { class: 'l-outro__contact', html: s.left || '', anim: true }),
          h('div', { class: 'l-outro__contact l-outro__contact--right', html: s.right || '', anim: true })
        ])
      ]);
    }
  };

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  global.DeckLayouts = LAYOUTS;
  global.DeckLayouts._brandPath = BRAND_PATH;
})(window);
