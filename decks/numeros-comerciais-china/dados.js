/* ===========================================================================
   OS NÚMEROS · fonte única da apresentação

   Tudo que é número no deck sai daqui. Os slides em deck.js só apontam para
   estes campos, de modo que corrigir um valor é mexer em um lugar só.

   DE ONDE VEM CADA COISA
     funil, cotacoes, vendas25, perfil
       painéis do CRM (prints enviados em 19/10/2026). São os números
       oficiais da empresa e é por eles que o deck abre.
     fechados25, fechados26, uf, regiao, origem, mensal
       export "Vendas 25 e 26" (abas Resultado 25 e Resultado 26), só os
       negócios com status WON. As duas linhas de totalização do fim de cada
       aba foram descartadas; sete negócios de 2025 estavam sem o campo
       Estado e tiveram a UF recuperada do próprio nome ("2055 - SP - ...").

   POR QUE DOIS TOTAIS DE 2025 NÃO BATEM
     O CRM contabiliza 135 vendas / R$ 16.692.456,53 em 2025; o export traz
     123 negócios / R$ 15.937.487,53. A diferença é de recorte do filtro, não
     de conteúdo. O deck usa o número do CRM nos slides de resultado e o
     export só onde precisa de quebra (mapa, região, mês, origem) — e nesses
     slides fala em participação, nunca em total.

   MOEDA
     Os valores nascem em real e são convertidos na hora de exibir, por
     usd() logo abaixo. Câmbio de 19/10/2026: R$ 5,05 por US$ 1,00.
     Trocar a cotação é trocar CAMBIO — nada mais no deck muda.
   ======================================================================== */

window.DADOS = (function () {
  'use strict';

  var CAMBIO = 5.05;

  /* Real → dólar. */
  function usd(brl) { return brl / CAMBIO; }

  /* US$ 3.31M · US$ 820K · US$ 54.3M — a escala muda sozinha conforme o
     tamanho, para que a mesma função sirva ao número gigante e à legenda. */
  function dinheiro(brl, casas) {
    var v = usd(brl);
    if (v >= 1e6) return 'US$ ' + (v / 1e6).toFixed(casas == null ? 2 : casas) + 'M';
    if (v >= 1e3) return 'US$ ' + Math.round(v / 1e3) + 'K';
    return 'US$ ' + Math.round(v);
  }

  /* Só o número, para quando o layout já escreve "US$" e "M" por fora. */
  function milhoes(brl, casas) {
    return (usd(brl) / 1e6).toFixed(casas == null ? 2 : casas);
  }

  function milhares(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return {
    cambio: CAMBIO,
    usd: usd,
    dinheiro: dinheiro,
    milhoes: milhoes,
    milhares: milhares,

    /* ---------------------------------------------------------------
       DEMANDA · tudo que chegou em 2025, por canal
       Os três funis do CRM, filtrados por data de criação em 2025.
       --------------------------------------------------------------- */
    demanda: {
      total: 11518,
      canais: [
        { label: 'Quote requests',      sub: 'Commercial pipeline',    n: 4180 },
        { label: 'Catalogue requests',  sub: 'Inbound · target profile', n: 6463 },
        { label: 'Representative network', sub: 'Partner-generated',   n: 875 }
      ]
    },

    /* ---------------------------------------------------------------
       O QUE ACONTECEU COM OS 4.180 PEDIDOS DE ORÇAMENTO
       Soma exata: 114 + 129 + 3.937 = 4.180.
       --------------------------------------------------------------- */
    funil: {
      total: 4180,
      etapas: [
        { label: 'Closed · won', n: 114,  brl: 12763940.36 },
        { label: 'Still open',   n: 129,  brl: 92365709.91 },
        { label: 'Lost',         n: 3937, brl: 174119765.07 }
      ],
      /* Detalhe dos 129 em aberto, para a nota do slide. */
      aberto: { cotados: 124, cotadoBrl: 88524227.31, negociando: 5, negociandoBrl: 3841482.60 }
    },

    /* ---------------------------------------------------------------
       COTAÇÕES EMITIDAS EM 2025 (todos os funis)
       --------------------------------------------------------------- */
    cotacoes: { n: 1415, brl: 274437091.94, deltaValor: 26, deltaQtd: 57 },

    /* ---------------------------------------------------------------
       VENDAS 2025 — número oficial do CRM
       --------------------------------------------------------------- */
    vendas25: { n: 135, brl: 16692456.53, deltaValor: 22, deltaQtd: 160 },

    /* ---------------------------------------------------------------
       QUEM COMPROU · 2025 (painel "Quem comprou", por data de fechamento)
       --------------------------------------------------------------- */
    perfil: [
      { label: 'Construction & engineering', n: 43, brl: 9620000, pct: 57.6 },
      { label: 'Architects & engineers',     n: 55, brl: 4520000, pct: 27.1 },
      { label: 'Installers & metalworkers',  n: 7,  brl: 1670000, pct: 10.0 },
      { label: 'Private clients',            n: 27, brl: 780800,  pct: 4.7 },
      { label: 'Other companies',            n: 3,  brl: 106000,  pct: 0.6 }
    ],

    /* ---------------------------------------------------------------
       NEGÓCIOS FECHADOS NO EXPORT — base das quebras abaixo
       --------------------------------------------------------------- */
    fechados25:  { n: 123, brl: 15937488, ufs: 17 },
    fechados26:  { n: 109, brl: 11346573, ufs: 14 },   /* janeiro a setembro      */
    fechados25_9m: { n: 89, brl: 12887991 },           /* mesmo recorte, em 2025  */

    /* Concentração do calendário de obra, calculada sobre mensal25 e usada
       nas notas de rodapé: junho a outubro concentram o ano; outubro a
       dezembro é o pedaço que ainda falta fechar em 2026. */
    sazonal: { junOut: 67, outDez: 18 },

    /* ---------------------------------------------------------------
       GEOGRAFIA · 2025 + 2026 somados, por estado
       --------------------------------------------------------------- */
    uf: {
      SP: { n: 89, brl: 12344224 },
      PR: { n: 38, brl: 4093599 },
      SC: { n: 24, brl: 3684787 },
      DF: { n: 6,  brl: 1709656 },
      MS: { n: 15, brl: 1225804 },
      RJ: { n: 10, brl: 787406 },
      MG: { n: 13, brl: 687713 },
      RS: { n: 12, brl: 666022 },
      PE: { n: 3,  brl: 538702 },
      AL: { n: 3,  brl: 391906 },
      SE: { n: 2,  brl: 316720 },
      MT: { n: 4,  brl: 296278 },
      BA: { n: 5,  brl: 161013 },
      GO: { n: 1,  brl: 145840 },
      RR: { n: 1,  brl: 96930 },
      PA: { n: 1,  brl: 41426 },
      ES: { n: 3,  brl: 40774 },
      PI: { n: 1,  brl: 32353 }
    },
    ufsCobertas: 18,

    /* Regiões do IBGE, 2025 + 2026 somados. */
    regiao: [
      { sigla: 'SE', label: 'Southeast',    n: 115, brl: 13860117, pct: 50.8 },
      { sigla: 'S',  label: 'South',        n: 74,  brl: 8444408,  pct: 30.9 },
      { sigla: 'CO', label: 'Central-West', n: 26,  brl: 3377576,  pct: 12.4 },
      { sigla: 'NE', label: 'Northeast',    n: 14,  brl: 1440694,  pct: 5.3 },
      { sigla: 'N',  label: 'North',        n: 2,   brl: 138356,   pct: 0.5 }
    ],

    /* ---------------------------------------------------------------
       DE ONDE VIERAM OS NEGÓCIOS FECHADOS · 2025 + 2026
       49 dos 232 negócios não têm origem registrada; aparecem como
       "Not recorded" em vez de sumirem da conta.
       --------------------------------------------------------------- */
    origem: [
      { label: 'Inbound marketing', n: 46, brl: 4725179 },
      { label: 'Representatives',   n: 30, brl: 4083951 },
      { label: 'Repeat customers',  n: 24, brl: 3404158 },
      { label: 'Referral',          n: 23, brl: 3667887 },
      { label: 'Google search',     n: 15, brl: 2383752 },
      { label: 'Website & email',   n: 16, brl: 1160818 },
      { label: 'Social media',      n: 9,  brl: 678682 },
      { label: 'Specification',     n: 7,  brl: 601593 },
      { label: 'Other',             n: 13, brl: 227813 },
      { label: 'Not recorded',      n: 49, brl: 6350228 }
    ],

    /* ---------------------------------------------------------------
       CURVA MENSAL · valor fechado por mês, em real
       --------------------------------------------------------------- */
    mensal25: [
      { mes: 'Jan', n: 8,  brl: 923525 },
      { mes: 'Feb', n: 6,  brl: 372714 },
      { mes: 'Mar', n: 7,  brl: 1257453 },
      { mes: 'Apr', n: 6,  brl: 539861 },
      { mes: 'May', n: 16, brl: 1051143 },
      { mes: 'Jun', n: 8,  brl: 2590591 },
      { mes: 'Jul', n: 15, brl: 2020701 },
      { mes: 'Aug', n: 9,  brl: 2430803 },
      { mes: 'Sep', n: 14, brl: 1701201 },
      { mes: 'Oct', n: 12, brl: 2010771 },
      { mes: 'Nov', n: 7,  brl: 408996 },
      { mes: 'Dec', n: 8,  brl: 436161 }
    ],
    mensal26: [
      { mes: 'Jan', n: 11, brl: 796306 },
      { mes: 'Feb', n: 9,  brl: 551691 },
      { mes: 'Mar', n: 19, brl: 1825480 },
      { mes: 'Apr', n: 9,  brl: 505049 },
      { mes: 'May', n: 5,  brl: 401727 },
      { mes: 'Jun', n: 12, brl: 787409 },
      { mes: 'Jul', n: 12, brl: 2324543 },
      { mes: 'Aug', n: 24, brl: 3808632 },
      { mes: 'Sep', n: 8,  brl: 345737 }
    ]
  };
})();
