/* ===========================================================================
   DESENHOS TÉCNICOS EM SVG

   Desenhos redesenhados aqui, em vetor, em vez de recortados de PDF. Ficam
   nítidos em qualquer tamanho, saem vetoriais na exportação e usam a mesma
   paleta e a mesma tipografia do resto da apresentação.

   No deck.js um desenho é chamado assim:

       media: { svg: 'muxarabi-estrutura', alt: 'descrição' }

   Para mexer nas medidas, edite os números em metros lá embaixo — a projeção
   se refaz sozinha. Script clássico de propósito, como o resto do projeto:
   sem módulos e sem fetch, para abrir com duplo clique.
   ======================================================================== */

(function (global) {
  'use strict';

  /* ---------------------------------------------------------------------
     Projeção isométrica

     Três eixos no papel, a partir de medidas em METROS:
       a  largura      — corre para a direita e para cima
       b  altura       — sobe na vertical
       c  profundidade — corre para a direita e para baixo

     1 metro = 100 unidades de desenho; o viewBox cuida da escala final.
     --------------------------------------------------------------------- */

  var M = 100;
  var COS30 = 0.8660254;
  var ANGULO = -30;            /* inclinação do eixo da largura, em graus */

  function pt(a, b, c) {
    return [
      arred(M * COS30 * (a + c)),
      arred(M * (-0.5 * a - b + 0.5 * c))
    ];
  }

  function arred(n) { return Math.round(n * 100) / 100; }

  /* ---------------------------------------------------------------------
     Paleta — os mesmos valores de theme/tokens.css. As faces claras vão do
     mais claro (topo, que pega luz) ao mais escuro (lateral).
     --------------------------------------------------------------------- */

  var COR = {
    paredeTopo:   '#e8e2d5',
    paredeFrente: '#dbd4c5',
    paredeLado:   '#c7bfad',

    lajeTopo:     '#f3efe5',
    lajeFrente:   '#ded7c7',
    lajeLado:     '#d2cab8',

    perfilTopo:   '#544e45',
    perfilFrente: '#38352f',
    perfilLado:   '#22201c',

    fio:          '#c4baa6',   /* arestas das peças claras */
    cota:         '#4a463f'    /* linhas e textos de cota (--ink-600) */
  };

  /* ---------------------------------------------------------------------
     Primitivas
     --------------------------------------------------------------------- */

  function face(pontos, cor) {
    return '<polygon points="' + pontos.map(function (p) { return p.join(','); }).join(' ') +
           '" fill="' + cor + '" stroke="' + COR.fio + '" stroke-width="1" stroke-linejoin="round"/>';
  }

  function linha(p1, p2, cor, largura) {
    return '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] +
           '" stroke="' + cor + '" stroke-width="' + (largura || 1.6) + '" stroke-linecap="round"/>';
  }

  /* Texto deitado sobre o eixo da largura, como nas cotas de obra. */
  function cotaTexto(p, texto, giro, ancora) {
    return '<text transform="translate(' + p[0] + ',' + p[1] + ')' +
           (giro ? ' rotate(' + giro + ')' : '') + '"' +
           ' text-anchor="' + (ancora || 'middle') + '"' +
           ' fill="' + COR.cota + '" font-size="19" letter-spacing="0.3">' + texto + '</text>';
  }

  /* ---------------------------------------------------------------------
     Muxarabi · subestrutura metálica
     Manual de instalação do muxarabi, pág. 6 — passo 1 da sequência.

     Um módulo de 3,00 × 3,00 m com os perfis de alumínio na vertical, um a
     cada 0,75 m. O primeiro vão fecha em 0,74 m: é o arredondamento do
     próprio manual para a soma dar 3,00 m.
     --------------------------------------------------------------------- */

  function muxarabiEstrutura(alt) {
    var L = 3.00;              /* largura do módulo */
    var H = 3.00;              /* altura do módulo */
    var ESP = 0.12;            /* espessura do painel */

    var COTAS = [0, 0.74, 1.49, 2.24, 2.99];   /* eixos dos perfis */

    var W = 0.06;              /* largura do perfil */
    var saliencia = 0.10;      /* o quanto o perfil avança sobre o painel */

    var partes = [];

    /* ---- laje ---------------------------------------------------------- */

    var lajeA0 = -0.08, lajeA1 = L + 0.16, lajeC = 1.15, lajeEsp = 0.14;

    partes.push(face([pt(lajeA0, 0, 0), pt(lajeA1, 0, 0),
                      pt(lajeA1, 0, lajeC), pt(lajeA0, 0, lajeC)], COR.lajeTopo));

    partes.push(face([pt(lajeA0, 0, lajeC), pt(lajeA1, 0, lajeC),
                      pt(lajeA1, -lajeEsp, lajeC), pt(lajeA0, -lajeEsp, lajeC)], COR.lajeFrente));

    partes.push(face([pt(lajeA0, 0, 0), pt(lajeA0, 0, lajeC),
                      pt(lajeA0, -lajeEsp, lajeC), pt(lajeA0, -lajeEsp, 0)], COR.lajeLado));

    /* ---- painel -------------------------------------------------------- */

    partes.push(face([pt(0, 0, 0), pt(0, H, 0),
                      pt(0, H, ESP), pt(0, 0, ESP)], COR.paredeLado));

    partes.push(face([pt(0, H, 0), pt(L, H, 0),
                      pt(L, H, ESP), pt(0, H, ESP)], COR.paredeTopo));

    partes.push(face([pt(0, 0, ESP), pt(L, 0, ESP),
                      pt(L, H, ESP), pt(0, H, ESP)], COR.paredeFrente));

    /* ---- perfis de alumínio -------------------------------------------- */

    /* Um tubo: mostra a lateral, a frente e o topo. */
    function tubo(a0) {
      var a1 = a0 + W;
      var c0 = ESP, c1 = ESP + saliencia;

      return face([pt(a0, 0, c0), pt(a0, 0, c1),
                   pt(a0, H, c1), pt(a0, H, c0)], COR.perfilLado) +
             face([pt(a0, 0, c1), pt(a1, 0, c1),
                   pt(a1, H, c1), pt(a0, H, c1)], COR.perfilFrente) +
             face([pt(a0, H, c0), pt(a1, H, c0),
                   pt(a1, H, c1), pt(a0, H, c1)], COR.perfilTopo);
    }

    /* No começo e no fim do módulo o perfil é DUPLO — dois tubos lado a lado,
       encostados na borda. É o que trava a junta entre dois módulos vizinhos,
       e é a parte do desenho que não pode faltar. Nos vãos, um tubo só,
       centrado na cota.

       O tubo da direita é desenhado antes do da esquerda: assim o de trás
       fica por baixo, como na vista. */
    COTAS.forEach(function (eixo, i) {
      var duplo = i === 0 || i === COTAS.length - 1;
      var a0 = duplo ? (i === 0 ? 0 : L - 2 * W) : eixo - W / 2;

      if (duplo) partes.push(tubo(a0 + W));
      partes.push(tubo(a0));
    });

    /* ---- cotas dos vãos ------------------------------------------------ */

    var cCota = -0.34;         /* a linha de cota recua atrás do painel */
    var cSobra = -0.46;        /* e a linha de chamada passa um pouco dela */
    var cRotulo = -0.52;

    partes.push(linha(pt(COTAS[0], H, cCota), pt(COTAS[COTAS.length - 1], H, cCota), COR.cota));

    COTAS.forEach(function (a) {
      partes.push(linha(pt(a, H, 0), pt(a, H, cSobra), COR.cota, 1));
    });

    for (var i = 0; i < COTAS.length - 1; i++) {
      var meio = (COTAS[i] + COTAS[i + 1]) / 2;
      var vao = Math.round((COTAS[i + 1] - COTAS[i]) * 100) / 100;
      partes.push(cotaTexto(pt(meio, H, cRotulo), vao.toFixed(2).replace('.', ',') + 'm', ANGULO));
    }

    /* ---- cota geral da largura ----------------------------------------- */

    var cGeral = -0.82, cGeralSobra = -0.94, cGeralRotulo = -1.00;

    partes.push(linha(pt(0, H, cGeral), pt(L, H, cGeral), COR.cota));
    partes.push(linha(pt(0, H, cCota), pt(0, H, cGeralSobra), COR.cota, 1));
    partes.push(linha(pt(L, H, 0), pt(L, H, cGeralSobra), COR.cota, 1));
    partes.push(cotaTexto(pt(L / 2, H, cGeralRotulo), '3,00m', ANGULO));

    /* ---- cota da altura ------------------------------------------------ */

    var cAltura = -0.55, cAlturaSobra = -0.67;

    partes.push(linha(pt(0, 0, cAltura), pt(0, H, cAltura), COR.cota));
    partes.push(linha(pt(0, 0, 0), pt(0, 0, cAlturaSobra), COR.cota, 1));
    partes.push(linha(pt(0, H, 0), pt(0, H, cAlturaSobra), COR.cota, 1));

    var meioAltura = pt(0, H / 2, cAltura);
    partes.push(cotaTexto([meioAltura[0] - 14, meioAltura[1] + 7], '3,00m', 0, 'end'));

    /* --------------------------------------------------------------------
       O viewBox é medido a partir da geometria, com uma folga em volta —
       assim mexer nas medidas acima não exige recalcular a moldura na mão.
       -------------------------------------------------------------------- */

    var caixa = {
      x0: pt(0, H / 2, cAltura)[0] - 80,      /* abre espaço para o rótulo da altura */
      x1: pt(lajeA1, 0, lajeC)[0] + 14,
      y0: pt(L, H, cGeralRotulo)[1] - 26,
      y1: pt(lajeA0, -lajeEsp, lajeC)[1] + 14
    };

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
           arred(caixa.x0) + ' ' + arred(caixa.y0) + ' ' +
           arred(caixa.x1 - caixa.x0) + ' ' + arred(caixa.y1 - caixa.y0) + '"' +
           ' role="img" aria-label="' + escapar(alt || '') + '"' +
           ' font-family="var(--font-text)">' +
           partes.join('') +
           '</svg>';
  }

  function escapar(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  global.DRAWINGS = {
    'muxarabi-estrutura': muxarabiEstrutura
  };

})(window);
