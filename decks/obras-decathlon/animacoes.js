/* ===========================================================================
   DESENHOS E ANIMAÇÕES · OBRAS DECATHLON

   COMO UM DESENHO ENTRA
     No deck.js:        media: { svg: 'camadas-revestimento', alt: '…' }
     Aqui:              DESENHOS['camadas-revestimento'] = function (alt) { … }
   A função devolve uma STRING com o <svg> inteiro. O motor injeta esse SVG
   direto no slide (não dentro de um <img>), então ele herda a tipografia do
   tema e dá para animar as peças por CSS, de animacoes.css.

   Enquanto um desenho não existir aqui, o motor mostra no lugar dele a
   moldura "Desenho a inserir" com a descrição escrita no deck.js — o slide
   continua apresentável e nada quebra.

   Script clássico de propósito, como o resto do projeto: sem módulos e sem
   fetch, para a apresentação abrir com duplo clique, direto do disco.

   ---------------------------------------------------------------------------
   ONDE CADA TÉCNICA SE APLICA

     06  camadas-revestimento   PNG em SVG   pronto, com interação
     07  painel-montagem        SVG          a cremalheira recebe os brises
     13  escoamento-inferior    SVG          o caminho da água na face inferior

   Nenhum desses precisa de WebGL. WebGL só se entrar em cena o que isto não
   faz: girar a peça ao vivo, com o apresentador arrastando. Aí são dois
   custos a pagar: canvas não imprime, e o slide precisa de uma imagem-pôster
   só para a exportação; e a biblioteca tem que entrar como script clássico,
   com as texturas embutidas, senão o deck para de abrir em file://.
   ======================================================================== */

(function (global) {
  'use strict';

  var DESENHOS = {};

  function escapar(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function pontos(lista) {
    return lista.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
  }

  /* =====================================================================
     CAMADAS DO REVESTIMENTO  ·  slide 06

     Os renders vieram da Lesco, um PNG por camada, em _source/uploads/
     esquema-camadas/camadas/ (originais) e em img/camadas/ (os usados).

     Os nomes dos arquivos são os da origem — topo 1, 2 e 3, lateral 1, 2 e 3,
     miolo polímero —, e só. Os quatro PNGs soltos na pasta de cima
     (Base, Primer, Textura, Topo) são de outro fabricante e NÃO entram aqui:
     nem como imagem, nem como nome de camada.

     ---------------------------------------------------------------------
     O ALINHAMENTO

     Cada PNG veio recortado no próprio conteúdo, não numa tela comum — o
     que significa que empilhá-los em 0,0 não os alinha sozinho. As posições
     abaixo foram MEDIDAS, lendo o canal alfa de cada arquivo e procurando
     os vértices do paralelogramo:

       · as quatro peças empilhadas (topo 1, 2, 3 e o miolo) têm o mesmo
         vértice de fundo em (219, 0) e o mesmo vértice direito em
         (828, 332) — ou seja, a face superior das quatro coincide quando
         todas ficam em x = 0;
       · o que muda é a espessura, que desce: topo 3 tem 26 px, o miolo
         tem 133 px. Por isso o miolo entra 26 px mais baixo, encostando
         no topo 3;
       · a lateral é a face frontal do bloco. Seu lado longo mede
         (596, 354), o mesmo da aresta frontal da face superior, e sua
         altura é 133 px — a espessura exata do miolo. Ela encaixa com
         deslocamento (-2, +77) em relação à face superior.

     ---------------------------------------------------------------------
     POR QUE EXISTEM POLÍGONOS DE ALVO

     O ponteiro NÃO enxerga o alfa de um <image>: o navegador testa pela
     caixa do elemento. Medido nesta mesma página — apontar para a face
     frontal do miolo devolvia `lateral-2.png`, e apontar para o topo do
     miolo devolvia `topo-2.png`. Com oito retângulos empilhados, o filme
     transparente de cima capturaria o desenho inteiro e o miolo seria
     inalcançável.

     Por isso cada peça carrega um <polygon> com a própria silhueta, e é ele
     quem recebe o mouse. A ordem de pintura resolve as sobreposições: quem
     vem depois ganha. As peças sólidas levam a silhueta inteira; os dois
     filmes transparentes (topo 1 e lateral 1) levam só a FAIXA que sobra
     deles, senão roubariam a madeira que se vê através deles.
     ===================================================================== */

  /* A face superior, medida uma vez. Todas as peças empilhadas a repetem. */
  var FUNDO  = [219, 0];
  var ESQ    = [3, 77];
  var DIR    = [828, 332];
  var FRENTE = [600, 430];

  var PASSO = 42;        /* o quanto cada camada sobe por degrau na abertura */

  /* Silhueta de uma peça empilhada de espessura `t`: a face superior, as
     arestas verticais das pontas e a face inferior. */
  function silhueta(t) {
    return [FUNDO, ESQ, [ESQ[0], ESQ[1] + t], [FRENTE[0], FRENTE[1] + t],
            [DIR[0], DIR[1] + t], DIR];
  }

  /* A faixa que sobra de um filme sem espessura: o que ele mostra além da
     peça de baixo, que vem `PASSO` abaixo dele. `fora` estica a faixa para
     o lado vazio, só para engordar o alvo do mouse. */
  function faixaTopo(fora) {
    return [[FUNDO[0], FUNDO[1] - fora], [ESQ[0], ESQ[1] - fora],
            [ESQ[0], ESQ[1] + PASSO], [FUNDO[0], FUNDO[1] + PASSO],
            [DIR[0], DIR[1] + PASSO], [DIR[0], DIR[1] - fora]];
  }

  /* A lateral é a face frontal: um paralelogramo medido nos próprios PNGs. */
  var LAT = [[5, 0], [601, 354], [590, 487], [1, 133]];

  /* A faixa do filme lateral — mesma ideia, mas o degrau aqui é diagonal:
     a peça de baixo vem 42 à direita e 12 acima. */
  function faixaLateral() {
    return [[5, 0], [1, 133], [590, 487], [632, 475], [43, 121], [47, -12]];
  }

  /* ---------------------------------------------------------------------
     Ordem de pintura: SVG não tem z-index, quem vem depois fica por cima.
     De baixo para cima: sombra, miolo, as três laterais e as três do topo.

     A ABERTURA segue a referência que a Lesco mandou: curta. As camadas se
     afastam um degrau de 42 px cada — o suficiente para a separação se ler,
     sem a peça se desmontar. As do topo sobem na vertical; as laterais
     correm na direção da largura (-216, 77 normalizado), que é o que as
     tira da face frontal.

     `camada` é o que amarra a peça do topo à peça lateral do mesmo material:
     as duas respondem juntas ao mouse, como pedido.
     --------------------------------------------------------------------- */

  var CAMADAS = [
    /* chave      arquivo      camada   x    y   larg  alt   dx    dy   i  alvo */
    ['sombra',    'sombra',      null,  -6, 137,  849, 462,    0,   0, 0, null],
    ['miolo',     'miolo',        '4',   0,  26,  830, 567,    0,   0, 0, silhueta(133)],

    ['lat-3',     'lateral-3',    '3', -13, 103,  613, 492,  -42,  15, 1, LAT],
    ['lat-2',     'lateral-2',    '2',  -2, 103,  602, 489,  -85,  30, 2, LAT],
    ['lat-1',     'lateral-1',    '1',  -2, 100,  602, 489, -127,  45, 3, faixaLateral()],

    ['topo-3',    'topo-3',       '3',   0,   0,  826, 457,    0, -42, 1, silhueta(26)],
    ['topo-2',    'topo-2',       '2',   0,   0,  830, 431,    0, -84, 2, silhueta(0)],
    ['topo-1',    'topo-1',       '1',   0,  -3,  830, 431,    0,-126, 3, faixaTopo(30)]
  ];

  /* ---------------------------------------------------------------------
     As bolinhas e os balões.

     Em repouso só as bolinhas aparecem; o balão entra quando o ponteiro
     encosta NA BOLINHA — não na peça. Apontar a peça acende a camada, mas
     não abre texto: se abrisse, varrer o desenho com o mouse ficaria um
     pisca-pisca de quatro quadros.

     Cada balão sai do lado declarado em `lado` e fica centrado na altura da
     bolinha. Nenhum cobre a peça que explica, e como só um aparece por vez
     não existe risco de dois se encavalarem.

     O quarto sai pela ESQUERDA: os outros três já abrem para a direita e
     para cima, e um quarto à direita empilharia peso naquele canto.

     AS CORES são as do print, uma por camada — é o que liga a bolinha ao
     quadro sem precisar de fio ligando os dois. Fora deste slide o deck
     segue monocromático.
     --------------------------------------------------------------------- */

  /* 500 não é número redondo por acaso: a linha mais comprida dos quatro
     balões — "polímero pós-consumo." — mede 376, e com os 50 de respiro de
     cada lado sobram 400 de vão. Ao mexer no texto, meça de novo: SVG não
     quebra linha sozinho e o que não cabe simplesmente vaza da caixa. */
  var LARG_BALAO = 500;
  var PAD_BALAO  = 50;      /* respiro interno, nos quatro lados */
  var ALT_LINHA  = 44;
  var RAIO_NUM   = 39;
  var FOLGA      = 40;      /* entre a borda da bolinha e a do balão */

  /* Onde o balão pode ficar. Centrado na bolinha seria o ideal, mas os
     balões 1, 2 e 4 estourariam o desenho por cima (entrando no eyebrow) ou
     por baixo (entrando na barra de composição). Então ele é centrado e
     depois preso nesta faixa — a bolinha fica onde o blueprint manda e o
     balão se acomoda. */
  var TETO_BALAO = -120;
  var PISO_BALAO =  759;

  /* A bolinha fica logo ACIMA da própria camada, e atravessar outra camada
     no caminho não é problema — é justamente por isso que as quatro estão
     espalhadas em volta da peça, e não enfileiradas de um lado só.

     O que não pode é dois balões se encavalarem na exportação, onde os
     quatro aparecem juntos. Com 430 x 248 cada, dois do mesmo lado exigiriam
     248 de distância vertical, e a peça inteira só tem 155 de altura na
     borda direita — daí um em cada quadrante. */

  /* As quatro posições saíram do blueprint "ESQUEMA BRISE SEGUIR A RISCA",
     lidas do próprio PDF e convertidas: o centro de cada bolinha foi medido
     em pontos de página, normalizado pela caixa da peça lá (1187,9 x 927,9)
     e remapeado na caixa da peça aqui (972 x 763). O raio, 47,637 pt, virou
     39 pela mesma escala.

     A peça do blueprint e a daqui têm a mesma abertura: 933 x 729 contra
     972 x 763, proporção 0,781 contra 0,785. Por isso as posições podiam ser
     transpostas direto, sem reabrir as camadas. */

  var TOPICOS = [
    { id: '1', num: [445, -71], lado: 'dir',
      nome: 'Película externa',
      linhas: ['Transparente,', 'fecha a superfície.'],
      fundo: '#f0e2cb', borda: '#e0ccaa', texto: '#3a352c' },

    { id: '2', num: [-40, -56], lado: 'esq',
      nome: 'Veio de madeira',
      linhas: ['A face que se vê.', 'Red Cedar, no projeto.'],
      fundo: '#dce5da', borda: '#c3d2c2', texto: '#2f3a30' },

    { id: '3', num: [862, 269], lado: 'dir',
      nome: 'Compósito',
      linhas: ['Pó de madeira e', 'polímero pós-consumo.'],
      fundo: '#bd8571', borda: '#a97059', texto: '#fdf6f1' },

    { id: '4', num: [539, 626], lado: 'esq',
      nome: 'Miolo polímero',
      linhas: ['A estrutura, com', 'as câmaras internas.'],
      fundo: '#c3d4de', borda: '#a8c0cf', texto: '#2b353c' }
  ];

  /* O empurrãozinho do destaque: a peça em foco anda mais um tico na mesma
     direção em que se abriu. O miolo não se abre, então desce de leve. */
  function empurrao(dx, dy) {
    var tamanho = Math.sqrt(dx * dx + dy * dy);
    if (!tamanho) return [0, 14];
    return [Math.round(dx / tamanho * 18), Math.round(dy / tamanho * 18)];
  }

  function camadasRevestimento(alt) {
    var partes = [];

    CAMADAS.forEach(function (c) {
      var chave = c[0], arquivo = c[1], camada = c[2];
      var x = c[3], y = c[4], larg = c[5], altura = c[6];
      var dx = c[7], dy = c[8], i = c[9], alvo = c[10];

      var dentro = '<image href="img/camadas/' + arquivo + '.png"' +
                   ' x="' + x + '" y="' + y + '"' +
                   ' width="' + larg + '" height="' + altura + '"/>';

      /* O alvo nasce nas coordenadas da peça e viaja dentro do grupo, então
         continua colado nela depois que a abertura termina. */
      if (alvo) {
        dentro += '<polygon class="cam__alvo" data-camada="' + camada + '" points="' +
                  pontos(alvo.map(function (p) { return [p[0] + x, p[1] + y]; })) + '"/>';
      }

      var puxao = empurrao(dx, dy);

      partes.push('<g class="cam' + (camada ? '' : ' cam--sombra') + '"' +
                  (camada ? ' data-camada="' + camada + '"' : '') +
                  ' style="--dx:' + dx + 'px; --dy:' + dy + 'px; --i:' + i +
                  '; --hx:' + puxao[0] + 'px; --hy:' + puxao[1] + 'px">' +
                  '<g class="cam__peca">' + dentro + '</g></g>');
    });

    /* Bolinhas e balões moram fora dos grupos que se abrem: entram depois,
       já na posição final, sem viajar com as peças. */
    var ui = [];

    TOPICOS.forEach(function (t, idx) {
      var nx = t.num[0], ny = t.num[1];

      /* O respiro é o mesmo nos quatro lados — o que sobra entre eles é o
         texto: o nome, um salto, e as linhas do corpo. */
      var altura = PAD_BALAO * 2 + 34 + 52 + (t.linhas.length - 1) * ALT_LINHA + 18;

      /* O balão encosta na bolinha pelo lado declarado e fica centrado na
         altura dela — é o que mantém o conjunto lendo como uma peça só,
         agora que não existe fio ligando os dois. */
      var bx = t.lado === 'esq'
        ? nx - RAIO_NUM - FOLGA - LARG_BALAO
        : nx + RAIO_NUM + FOLGA;
      var by = Math.max(TETO_BALAO, Math.min(ny - altura / 2, PISO_BALAO - altura));

      var linhas = t.linhas.map(function (linha, k) {
        return '<tspan x="' + (bx + PAD_BALAO) + '"' +
               ' y="' + (by + PAD_BALAO + 86 + k * ALT_LINHA) + '">' +
               escapar(linha) + '</tspan>';
      }).join('');

      ui.push('<g class="cam__topico" data-camada="' + t.id + '" style="--i:' + idx + '">' +
              '<g class="cam__balao" style="transform-origin:' +
              (t.lado === 'esq' ? bx + LARG_BALAO : bx) + 'px ' +
              (by + altura / 2) + 'px">' +
              '<rect x="' + bx + '" y="' + by + '" width="' + LARG_BALAO + '"' +
              ' height="' + altura + '" rx="28" fill="' + t.fundo + '"/>' +
              '<text class="cam__balao-nome" x="' + (bx + PAD_BALAO) + '"' +
              ' y="' + (by + PAD_BALAO + 34) + '" fill="' + t.texto + '">' +
              escapar(t.nome) + '</text>' +
              '<text class="cam__balao-texto" fill="' + t.texto + '">' + linhas + '</text>' +
              '</g>' +
              '<g class="cam__num" data-camada="' + t.id + '">' +
              '<circle cx="' + nx + '" cy="' + ny + '" r="' + RAIO_NUM + '"' +
              ' fill="' + t.borda + '"/>' +
              '<text x="' + nx + '" y="' + (ny + 14) + '" fill="' + t.texto + '">' +
              t.id + '</text>' +
              '</g>' +
              '</g>');
    });

    /* A moldura cobre a PEÇA e as bolinhas — não os balões.

       Se ela cobrisse os balões também, o desenho encolheria quase um quarto
       para guardar um espaço que fica vazio quase o tempo todo: só um balão
       aparece por vez, e em repouso nenhum. Como `overflow` é visível (ver
       animacoes.css), o balão transborda e usa a margem larga que o slide
       já tem dos dois lados.

       Medida no conteúdo: a peça aberta ocupa x[-129, 843] e y[-129, 634],
       e as bolinhas esticam isso até x 901 (a 3) e y 665 (a 4). Nada sai do
       slide, que é o que a exportação em PDF não perdoa (ver README,
       "armadilhas da paginação"). Ao mexer em `num`, `lado` ou LARG_BALAO,
       refaça a conta. */
    /* A altura (900, contra os 818 que o conteúdo pediria) é folga de
       propósito: o palco é bem mais largo que alto, então é a altura que
       manda na escala. Esticá-la encolhe o desenho — e, com ele, o quanto
       o balão 3 avança para fora, que era o que esbarrava na borda. */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-141 -141 1054 900"' +
           ' class="camadas" role="img" aria-label="' + escapar(alt || '') + '"' +
           ' font-family="var(--font-text)">' +
           partes.join('') + ui.join('') +
           '</svg>';
  }

  DESENHOS['camadas-revestimento'] = camadasRevestimento;


  /* =====================================================================
     PAINEL TIPO 02  ·  slide 09

     Redesenho da prancha do executivo, em vetor e SEM UMA PALAVRA dentro do
     desenho: cota, rótulo e quantitativo saem todos para a coluna de texto,
     na tipografia do deck. O original era um recorte de PDF, com letra de
     prancha que no projetor vira borrão.

     AS MEDIDAS FECHAM, e é por isso que dá para confiar nelas:
       · o painel tem 525 x 4180 mm;
       · são 6 brises — 3 de 50 e 3 de 75, que somam 375 —, com 5 vãos de
         30 entre eles: 375 + 150 = 525, a largura exata do painel;
       · são 7 cremalheiras, com os vãos de 670, 700, 700, 700, 700 e 670
         da prancha: 4140, mais os 40 do perfil, dão os 4180 de altura.
     O quantitativo confere: brise 50x25 x3, brise 75x25 x3, cremalheira
     superior A x1, básica B x5 e inferior C x1 — 7 cremalheiras.

     O QUE NÃO ENTROU, e não vai entrar: as três pranchas de detalhe
     (perspectiva e vistas de cada cremalheira). As cotas delas não se leem
     no recorte — 11 mm do furo oblongo, os 350 entre extremos, os 25 de
     espessura — e num slide técnico um número inventado é pior do que
     número nenhum. Decidido com o Matheus em 28/10/2026: fica sem elas.

     Os perfis aparecem aqui em elevação, no comprimento certo e com os
     recortes alinhados aos brises. Se um dia o DWG do executivo aparecer e
     alguém quiser as pranchas completas, é daqui que se parte.
     ===================================================================== */

  var P_LARG = 525;       /* largura do painel, mm */
  var P_ALT  = 4180;      /* altura do painel, mm  */
  var CREM   = [0, 670, 1370, 2070, 2770, 3470, 4140];   /* topo de cada uma */
  var CREM_H = 40;        /* altura do perfil */

  /* ---------------------------------------------------------------------
     O ENCAIXE, MEDIDO NO VETOR

     Isto não é estimativa: saiu do PDF vetorial das cremalheiras que a
     Lesco mandou. A vista superior da cremalheira básica foi convertida em
     caminho, e os vértices do contorno deram as posições dos dentes. Com a
     barra medindo 297,6 unidades de página para 525 mm reais (1,7641 mm por
     unidade), os vãos entre dentes caem em 52,9 e 78,0 mm — os encaixes dos
     brises de 50 e de 75 —, e os dentes em 22,1 mm, com meio-dente de 9,7
     nas duas pontas.

     Arredondado, o perfil é simétrico e fecha na trena:
       11 + 53 + 22 + 78 + 22 + 53 + 22 + 78 + 22 + 53 + 22 + 78 + 11 = 525

     Antes do PDF eu tinha inferido 6 brises de 50 e 75 com vãos iguais de
     30. A soma fechava, mas a distribuição estava errada — é por isso que
     estes números vieram do desenho, e não de conta de chegada.
     --------------------------------------------------------------------- */

  /* [x, largura] de cada encaixe, em mm a partir da ponta da cremalheira */
  var ENCAIXES = [[11, 53], [86, 78], [186, 53], [261, 78], [361, 53], [436, 78]];

  /* [x0, x1] de cada dente — o que separa um brise do outro */
  var DENTES = [[0, 11], [64, 86], [164, 186], [239, 261],
                [339, 361], [414, 436], [514, 525]];

  var COL2   = 765;       /* x da coluna das cremalheiras */
  var COL3   = 1345;      /* x da coluna dos perfis em elevação */
  var ESC3   = 2;         /* os perfis entram ampliados, como na prancha */

  function painelExecutivo(alt) {
    var p = [];

    function rect(x, y, l, a, classe) {
      return '<rect class="' + classe + '" x="' + x + '" y="' + y +
             '" width="' + l + '" height="' + a + '"/>';
    }

    /* ---- coluna 1 · painel ripado ------------------------------------ */
    p.push(rect(0, 0, P_LARG, P_ALT, 'pr__area'));

    ENCAIXES.forEach(function (e) {
      p.push(rect(e[0], 0, e[1], P_ALT, 'pr__brise'));
    });

    /* ---- coluna 2 · as sete cremalheiras ----------------------------- */
    p.push(rect(COL2, 0, P_LARG, P_ALT, 'pr__area'));

    CREM.forEach(function (y) {
      p.push(rect(COL2, y, P_LARG, CREM_H, 'pr__crem'));
    });

    /* ---- coluna 3 · os três perfis, ampliados ------------------------ */
    /* A em cima, B no meio, C embaixo — a mesma ordem em que aparecem no
       painel ao lado, que é o que diz qual é qual sem precisar de rótulo. */
    var perfis = [
      { y: 180,  recortado: false },   /* A · superior */
      { y: 2010, recortado: true  },   /* B · básica   */
      { y: 3840, recortado: false }    /* C · inferior */
    ];

    perfis.forEach(function (perfil) {
      var larg = P_LARG * ESC3, altura = CREM_H * ESC3;
      p.push(rect(COL3, perfil.y, larg, altura, 'pr__perfil'));

      if (perfil.recortado) {
        /* Os recortes caem exatamente onde cai cada brise — é esse
           alinhamento que torna o espaçamento "pré-determinado". */
        ENCAIXES.forEach(function (e) {
          p.push(rect(COL3 + e[0] * ESC3, perfil.y, e[1] * ESC3, altura * 0.45, 'pr__recorte'));
        });
      } else {
        /* Os dois de ponta são barras corridas: furo de fixação e nada mais. */
        for (var f = 1; f <= 4; f++) {
          p.push('<circle class="pr__furo" cx="' + (COL3 + larg * f / 5) +
                 '" cy="' + (perfil.y + altura / 2) + '" r="' + (altura * 0.14) + '"/>');
        }
      }
    });

    /* Medido no desenho: ele vai de (0,0) a (2395, 4180). A moldura é isso
       mais 60 de folga em volta — sobra aqui é desenho menor. */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 2515 4300"' +
           ' class="prancha" role="img" aria-label="' + escapar(alt || '') + '">' +
           p.join('') + '</svg>';
  }

  DESENHOS['painel-executivo'] = painelExecutivo;


  /* =====================================================================
     O ENCAIXE  ·  slide 07

     A cremalheira básica em vista superior, com os seis brises descendo e
     assentando cada um no próprio recorte. É o slide do "sem gabarito, sem
     trena": o espaçamento já está no metal, e a peça só tem um lugar onde
     cai.

     A geometria é a de ENCAIXES e DENTES, lá em cima — medida no PDF
     vetorial, não arbitrada. O desenho é redesenhado a partir dela em vez
     de colar o caminho do PDF: assim cada brise é um elemento próprio, que
     dá para animar, e o traço herda a paleta do tema.

     ESPESSURAS, na mesma vista:
       · a barra da cremalheira tem 16 de chapa, e os dentes descem mais 9
         (os 25 de profundidade do perfil, que a prancha cota);
       · o brise tem 25 de espessura, então ele avança além dos dentes — é
         por isso que, montado, o que se vê da frente é só o brise.
     ===================================================================== */

  var MONT_CHAPA = 16;     /* a barra, vista de cima */
  var MONT_DENTE = 9;      /* o quanto o dente avança */
  var MONT_BRISE = 25;     /* espessura do brise */
  var MONT_QUEDA = 150;    /* de que altura a peça desce */

  function painelMontagem(alt) {
    var p = [];

    function rect(x, y, l, a, classe, estilo) {
      return '<rect class="' + classe + '" x="' + x + '" y="' + y +
             '" width="' + l + '" height="' + a + '"' +
             (estilo ? ' style="' + estilo + '"' : '') + '/>';
    }

    /* A cremalheira: a chapa corrida e os sete dentes que a repartem. */
    var barra = rect(0, 0, P_LARG, MONT_CHAPA, 'mont__chapa');
    DENTES.forEach(function (d) {
      barra += rect(d[0], MONT_CHAPA, d[1] - d[0], MONT_DENTE, 'mont__dente');
    });
    p.push('<g class="mont__barra">' + barra + '</g>');

    /* Os brises, um por encaixe. Cada um desce o mesmo tanto; o que muda é
       a hora — é a cascata que faz ler "um a um", sem precisar de texto. */
    ENCAIXES.forEach(function (e, i) {
      p.push('<g class="mont__brise" style="--i:' + i + '">' +
             rect(e[0], MONT_CHAPA, e[1], MONT_BRISE, 'mont__peca') +
             '</g>');
    });

    /* A moldura não guarda a altura inteira da queda: a peça começa acima
       dela e entra em campo. `overflow` é visível na moldura de desenho do
       motor, então nada é cortado — e, em repouso, o desenho não fica
       nadando num vazio do tamanho do percurso. */
    var y0 = -120;
    var altura = 120 + MONT_CHAPA + MONT_BRISE + 26;

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-25 ' + y0 +
           ' ' + (P_LARG + 50) + ' ' + altura + '"' +
           ' class="montagem" role="img" aria-label="' + escapar(alt || '') + '">' +
           p.join('') + '</svg>';
  }

  DESENHOS['painel-montagem'] = painelMontagem;


  /* =====================================================================
     ESCOAMENTO NA FACE INFERIOR  ·  slide 13

     Um detalhe do pé do painel, não o painel inteiro: em escala real a
     folga de 2 cm contra os 4180 de altura daria um fio de cabelo na tela.
     Aqui a vista cobre 200 mm de largura e 170 de altura, e aí os 20 mm da
     folga valem um oitavo da altura — dá para ver o que se está pedindo.

     Dentro da vista TUDO É MILÍMETRO DE VERDADE: os brises usam as mesmas
     posições de ENCAIXES, medidas no vetor da cremalheira, e a folga tem
     20 de 20. Nada aqui está fora de escala com o vizinho.

     Sem cota escrita, como nos outros desenhos do deck: o 2 cm aparece em
     destaque na coluna de texto, ao lado.
     ===================================================================== */

  var ESC_LARG   = 200;   /* o quanto da largura do painel a vista mostra */
  var ESC_BRISE  = 100;   /* o pedaço de brise que entra em cena */
  var ESC_ARR    = 18;    /* o arremate inferior, que fecha e vira calha */
  var ESC_FOLGA  = 20;    /* OS 2 CM */
  var ESC_FACE   = 32;    /* a face inferior, embaixo */

  function escoamentoInferior(alt) {
    var p = [];

    function rect(x, y, l, a, classe) {
      return '<rect class="' + classe + '" x="' + x + '" y="' + y +
             '" width="' + l + '" height="' + a + '"/>';
    }

    var yArr  = ESC_BRISE;
    var yGap  = yArr + ESC_ARR;
    var yFace = yGap + ESC_FOLGA;

    /* Os brises, nas posições reais, cortados pela largura da vista. */
    var visiveis = [];
    ENCAIXES.forEach(function (e) {
      if (e[0] >= ESC_LARG) return;
      visiveis.push([e[0], Math.min(e[1], ESC_LARG - e[0])]);
    });

    visiveis.forEach(function (e) {
      p.push(rect(e[0], 0, e[1], ESC_BRISE, 'esc__brise'));
    });

    /* O arremate inferior e a face de baixo. */
    p.push(rect(0, yArr, ESC_LARG, ESC_ARR, 'esc__arremate'));
    p.push(rect(0, yFace, ESC_LARG, ESC_FACE, 'esc__face'));

    /* A folga: marcada por dois filetes, sem número — o 2 cm está no
       destaque ao lado, e repetir aqui seria cota em dois lugares. */
    p.push('<line class="esc__filete" x1="0" y1="' + yGap + '" x2="' + ESC_LARG + '" y2="' + yGap + '"/>');
    p.push('<line class="esc__filete" x1="0" y1="' + yFace + '" x2="' + ESC_LARG + '" y2="' + yFace + '"/>');

    /* As gotas descem pelo brise e saem pela folga. Uma por brise visível,
       em tempos diferentes. */
    visiveis.forEach(function (e, i) {
      var cx = e[0] + e[1] / 2;
      p.push('<circle class="esc__gota" cx="' + cx + '" cy="18" r="3.4"' +
             ' style="--i:' + i + '"/>');
    });

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -12 ' +
           (ESC_LARG + 28) + ' ' + (yFace + ESC_FACE + 24) + '"' +
           ' class="escoamento" role="img" aria-label="' + escapar(alt || '') + '">' +
           p.join('') + '</svg>';
  }

  DESENHOS['escoamento-inferior'] = escoamentoInferior;


  /* =====================================================================
     A INTERAÇÃO

     Um ouvinte só, no SVG, em vez de um por peça: o alvo diz a que camada
     pertence e o SVG guarda o foco num atributo. Todo o resto — apagar as
     outras, destacar a de cima, acender o balão — é CSS, em animacoes.css.

     Como a peça do topo e a lateral do mesmo material dividem o mesmo
     `data-camada`, as duas acendem juntas sem nenhuma conta a mais.

     Ponteiro, não mouse: `pointerover` também atende toque e caneta, e numa
     tela sensível o toque na peça acende a camada em vez de não fazer nada.
     ===================================================================== */

  function liga(svg) {
    if (svg.dataset.ligado) return;
    svg.dataset.ligado = '1';

    function limpa() {
      svg.removeAttribute('data-foco');
      svg.removeAttribute('data-balao');
    }

    function foco(evento) {
      var alvo = evento.target.closest('[data-camada]');
      if (!alvo) { limpa(); return; }

      var camada = alvo.getAttribute('data-camada');
      svg.setAttribute('data-foco', camada);

      /* O balão é só da bolinha. Apontar a peça acende a camada e apaga as
         outras, mas não abre texto — varrer o desenho com o mouse viraria
         um pisca-pisca de quatro quadros.

         O próprio balão também segura o estado: sem isso, ir com o mouse da
         bolinha até o texto para ler fecharia o texto no meio do caminho.
         Enquanto está fechado ele é transparente ao ponteiro (ver o
         pointer-events em animacoes.css), então não atrapalha as peças. */
      if (evento.target.closest('.cam__num, .cam__balao')) {
        svg.setAttribute('data-balao', camada);
      } else {
        svg.removeAttribute('data-balao');
      }
    }

    svg.addEventListener('pointerover', foco);
    svg.addEventListener('pointerout', function (evento) {
      /* Sair para dentro de outra peça não é sair do desenho. */
      if (!evento.relatedTarget || !svg.contains(evento.relatedTarget)) limpa();
    });
  }

  /* O motor monta os slides depois deste arquivo, e remonta nada — então
     basta esperar o palco existir e ligar o que já estiver lá. */
  function observa() {
    var palco = document.querySelector('.stage');
    if (!palco) { global.setTimeout(observa, 50); return; }

    function varre() {
      Array.prototype.forEach.call(palco.querySelectorAll('svg.camadas'), liga);
    }

    varre();
    new MutationObserver(varre).observe(palco, { childList: true, subtree: true });
  }

  observa();


  /* =====================================================================
     LAYOUT `camadas`

     Um layout a mais, só para esta apresentação, ao lado dos de
     engine/layouts.js — o motor não sabe a diferença e nada do que já existe
     muda. Por isso este arquivo é carregado DEPOIS de engine/layouts.js e
     ANTES de deck.js.

     Ele existe porque o desenho precisa da largura inteira do slide: com os
     quatro balões em volta, a composição fica em 1,8 : 1, e a moldura do
     layout `detail` é quase quadrada. Lá os balões não caberiam sem
     espremer o desenho — e desenho espremido é alvo de mouse espremido.
     ===================================================================== */

  var L = global.DeckLayouts;
  if (!L) throw new Error('animacoes.js precisa vir depois de engine/layouts.js');

  function h(tag, props, filhos) {
    var no = document.createElement(tag);
    props = props || {};

    Object.keys(props).forEach(function (chave) {
      var valor = props[chave];
      if (valor === null || valor === undefined || valor === false) return;
      if (chave === 'class') no.className = valor;
      else if (chave === 'text') no.textContent = valor;
      else if (chave === 'html') no.innerHTML = String(valor)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/\n/g, '<br>');
      else if (chave === 'anim') no.setAttribute('data-anim', valor === true ? '' : valor);
      else no.setAttribute(chave, valor);
    });

    (filhos || []).forEach(function (filho) { if (filho) no.appendChild(filho); });
    return no;
  }

  L.camadas = {
    transition: 'stagger',
    render: function (s) {
      var palco = h('div', { class: 'l-camadas__palco' });
      var desenho = typeof DESENHOS[s.svg] === 'function' ? DESENHOS[s.svg](s.alt) : '';

      if (desenho) {
        palco.innerHTML = desenho;
      } else {
        palco.appendChild(h('div', { class: 'frame__note' }, [
          h('span', { class: 'frame__note-tag', text: 'Desenho a inserir' }),
          h('span', { class: 'frame__note-text', text: s.note || s.svg || '' })
        ]));
      }

      /* A barra de composição: uma barra 100% repartida, com a legenda
         embaixo. As larguras saem das PORCENTAGENS declaradas no deck.js,
         não de medidas desenhadas — num slide técnico a barra não pode
         desmentir o número que ela mesma carrega.

         O rótulo fica FORA da barra, e não dentro como no blueprint, por
         medida: o pedaço de 10% tem 166 px no palco de 1920 e "10% aditivos"
         precisa de 370 px no menor corpo do deck. Para caber ali dentro a
         tipografia teria de cair para uns 9 px, que não se lê no projetor. */
      var barra = null;

      if (s.composicao) {
        var tira = h('div', { class: 'composicao__barra' });
        var legenda = h('div', { class: 'composicao__legenda' });

        s.composicao.forEach(function (p) {
          tira.appendChild(h('div', {
            class: 'composicao__faixa',
            style: 'flex-grow:' + p.pct + '; background:' + p.cor,
            title: p.pct + '% ' + p.nome
          }));

          legenda.appendChild(h('div', { class: 'composicao__item' }, [
            h('span', { class: 'composicao__cor', style: 'background:' + p.cor }),
            h('span', { class: 'composicao__rotulo', text: p.pct + '% ' + p.nome })
          ]));
        });

        barra = h('div', { class: 'l-camadas__composicao', anim: true }, [tira, legenda]);
      }

      return h('div', { class: 'l-camadas pad pad--tight' }, [
        h('div', { class: 'l-camadas__topo' }, [
          h('div', { class: 'l-camadas__texto' }, [
            s.eyebrow ? h('div', { class: 'eyebrow', text: s.eyebrow, anim: true }) : null,
            s.title ? h('h2', { class: 'title title--md', html: s.title, anim: 'mask' }) : null
          ]),
          s.produto ? h('div', { class: 'l-camadas__produto', text: s.produto, anim: true }) : null
        ]),
        palco,
        barra
      ]);
    }
  };

  /* =====================================================================
     LAYOUT `capa` · slide 01

     A capa veio pronta da Lesco, em PDF vetorial, e foi convertida em SVG
     pelo mesmo conversor das cremalheiras: fundo creme, os logos Lesco +
     ModularKit, o filete e a marca Decathlon. Original em
     _source/originais/decathlon/CAPA.pdf.

     A arte é 2676 x 1608 (1,66) e o palco é 1920 x 1080 (1,78), então ela
     entra por `object-fit: cover` — o corte de 37 px cai em cima e embaixo,
     onde só há creme. O mais baixo dos elementos, a marca Decathlon, para a
     136 unidades da borda de baixo: folga de sobra.

     O único texto da capa não veio no SVG — o conversor descarta texto de
     propósito, porque fonte embutida vira glifo sem letra. Ele é reposto
     aqui, na tipografia do deck, alinhado à esquerda dos logos (84 px, que
     é onde o filete da arte começa, e não os 120 de margem do resto).
     ===================================================================== */

  L.capa = {
    transition: 'curtain',
    tone: 'paper',
    render: function (s) {
      return h('div', { class: 'l-capa' }, [
        h('div', { class: 'l-capa__arte' }, [
          h('img', { src: s.arte, alt: s.alt || '' })
        ]),
        s.eyebrow
          ? h('div', { class: 'l-capa__rotulo', text: s.eyebrow, anim: true })
          : null
      ]);
    }
  };


  /* =====================================================================
     LAYOUT `prancha` · slide 09

     Desenho à esquerda, texto à direita — e, no texto, o quantitativo que
     antes vivia como letra miúda dentro da prancha escaneada.
     ===================================================================== */

  L.prancha = {
    transition: 'stagger',
    render: function (s) {
      var figura = h('div', { class: 'l-prancha__figura', anim: true });
      var desenho = typeof DESENHOS[s.svg] === 'function' ? DESENHOS[s.svg](s.alt) : '';

      if (desenho) {
        figura.innerHTML = desenho;
      } else {
        figura.appendChild(h('div', { class: 'frame__note' }, [
          h('span', { class: 'frame__note-tag', text: 'Desenho a inserir' }),
          h('span', { class: 'frame__note-text', text: s.note || s.svg || '' })
        ]));
      }

      var lista = null;

      if (s.quantitativo) {
        lista = h('div', { class: 'quantitativo', anim: true }, [
          s.quantitativoTitulo
            ? h('div', { class: 'quantitativo__titulo', text: s.quantitativoTitulo })
            : null
        ]);

        s.quantitativo.forEach(function (item) {
          lista.appendChild(h('div', { class: 'quantitativo__linha' }, [
            h('span', { class: 'quantitativo__item', text: item[0] }),
            h('span', { class: 'quantitativo__qtd', text: item[1] })
          ]));
        });
      }

      return h('div', { class: 'l-prancha pad pad--tight' }, [
        figura,
        h('div', { class: 'l-prancha__texto' }, [
          s.eyebrow ? h('div', { class: 'eyebrow', text: s.eyebrow, anim: true }) : null,
          s.title ? h('h2', { class: 'title title--md', html: s.title, anim: 'mask' }) : null,
          s.text ? h('p', { class: 'lead', html: s.text, anim: true }) : null,
          lista,
          s.note2 ? h('p', { class: 'l-prancha__nota', html: s.note2, anim: true }) : null
        ])
      ]);
    }
  };

  global.DRAWINGS = DESENHOS;

})(window);
