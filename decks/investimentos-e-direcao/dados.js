/* ===========================================================================
   OS NÚMEROS · fonte única da apresentação ao Lucas

   Tudo que é número no deck sai daqui. Os slides em deck.js só apontam para
   estes campos, de modo que corrigir um valor é mexer em um lugar só. Os
   títulos e rótulos que citam números também leem daqui — não existe cifra
   digitada dentro de um texto de slide.

   DINHEIRO É INTEIRO, EM CENTAVOS
     R$ 19,99 é 1999. Nenhum valor é ponto flutuante: somar 0,1 com 0,2 em
     JavaScript dá 0,30000000000000004, e um deck de aprovação de orçamento
     não pode ter um centavo aparecendo do nada numa soma. A divisão por 100
     acontece uma vez só, na hora de escrever na tela.

   O QUE É CONTA, E NÃO DADO
     Nada que o código consiga calcular está escrito aqui. Em particular:
       · o total de cada pacote do INPI, pela regra da Registre.se
       · o custo dos kits novos, pela composição de caixas
       · diferenças, percentuais, subtotais e o total geral do pedido
     Mudar a regra de preço ou a composição de um kit refaz tudo isso sozinho.

   DE ONDE VEM CADA COISA
     inpi         proposta da Registre.se, vencida em 31/10/2026 — os valores
                  precisam ser reconfirmados antes de fechar.
     embalagens   46 Indústria Gráfica, propostas 36319 e 36340, com frete até
                  Itajaí e 10% de desconto de primeira compra já incluídos.
                  Kits antigos: orçamento Printi.
     mono         perguntas do Mercado Livre no último mês, tabela de frete do
                  anúncio de referência da concorrência e proposta da Tray.
   ======================================================================== */

window.NUMEROS = (function () {
  'use strict';

  /* =====================================================================
     FORMATAÇÃO · padrão brasileiro

     Duas formas de escrever dinheiro, porque a apresentação usa as duas:
     `reais` sempre mostra os centavos (R$ 7.130,00), e `reaisCurto` corta
     o ",00" quando ele não carrega informação (R$ 9.380). O INPI é todo em
     valor redondo e fica mais limpo curto; a embalagem tem centavos de
     verdade e não pode escondê-los.
     ===================================================================== */

  var MENOS = '−';   /* sinal de menos de verdade, não hífen */

  function milhar(texto) {
    return texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function reais(centavos) {
    var n = Math.round(Math.abs(centavos));
    var inteiro = Math.floor(n / 100);
    var resto = n % 100;
    return (centavos < 0 ? MENOS : '') +
           'R$ ' + milhar(String(inteiro)) + ',' + (resto < 10 ? '0' + resto : String(resto));
  }

  function reaisCurto(centavos) {
    var n = Math.round(Math.abs(centavos));
    if (n % 100 !== 0) return reais(centavos);
    return (centavos < 0 ? MENOS : '') + 'R$ ' + milhar(String(n / 100));
  }

  /* Percentual sem casa decimal — a regra dos gráficos deste deck. */
  function pct(n) { return Math.round(Math.abs(n)) + '%'; }

  /* Diferença assinada: "+R$ 1,03" e "+42%". O sinal é a informação. */
  function deltaReais(centavos) {
    return (centavos < 0 ? MENOS : '+') + 'R$ ' + reais(Math.abs(centavos)).slice(3);
  }

  function deltaPct(n) {
    return (n < 0 ? MENOS : '+') + pct(n);
  }

  function numero(n) { return milhar(String(Math.round(n))); }

  /* Participação de uma parte no todo, em por cento. */
  function parte(valor, total) { return total ? (valor / total) * 100 : 0; }


  /* =====================================================================
     1 · INPI — registro de marca

     REGRA DE PREÇO DA REGISTRE.SE
       O primeiro pedido de um pacote paga a assessoria cheia; cada pedido
       seguinte sai pelo valor reduzido. A taxa do INPI é por pedido, sempre
       a mesma. É dessa regra que sai a economia de fechar os dois pacotes
       juntos: seis pedidos num pacote só pagam uma assessoria cheia em vez
       de duas.
     ===================================================================== */

  var inpi = {
    regra: {
      assessoriaPrimeiro: 306000,
      assessoriaDemais: 184000,
      taxaPorPedido: 88000
    },

    /* Condições comerciais, para o rodapé da tela. */
    condicoes: {
      parcelasAssessoria: 10,
      descontoAVista: 10,
      reducaoTitular: 50,
      validade: '31/10/2026'
    },

    pacotes: [
      {
        id: 'linhas-mista',
        nome: 'Linhas de produto, mista',
        resumo: 'GEO, ZHÜ e ECHO na classe 19',
        protege: 'Nome e logo de cada linha em revestimentos',
        pedidos: [
          { marca: 'GEO',  classe: 19, formato: 'mista' },
          { marca: 'ZHÜ',  classe: 19, formato: 'mista' },
          { marca: 'ECHO', classe: 19, formato: 'mista' }
        ]
      },
      {
        id: 'linhas-mista-bambu',
        nome: 'Linhas de produto, mista, com bambu',
        resumo: '+ ZHÜ na classe 20',
        protege: 'Também ZHÜ em bambu semitrabalhado',
        pedidos: [
          { marca: 'GEO',  classe: 19, formato: 'mista' },
          { marca: 'ZHÜ',  classe: 19, formato: 'mista' },
          { marca: 'ECHO', classe: 19, formato: 'mista' },
          { marca: 'ZHÜ',  classe: 20, formato: 'mista' }
        ]
      },
      {
        id: 'lesco-nominativa',
        nome: 'Lesco, nominativa',
        resumo: 'Classes 19, 35 e 42',
        protege: 'O nome Lesco em revestimentos, comércio e importação e projetos de arquitetura, com qualquer logo',
        pedidos: [
          { marca: 'Lesco', classe: 19, formato: 'nominativa' },
          { marca: 'Lesco', classe: 35, formato: 'nominativa' },
          { marca: 'Lesco', classe: 42, formato: 'nominativa' }
        ]
      },
      {
        /* Os pacotes compostos não repetem os pedidos: eles juntam os de
           outros pacotes. Acrescentar uma classe lá em cima muda o total
           daqui junto, que é o ponto. */
        id: 'juntos',
        nome: 'Os dois juntos',
        resumo: 'Lesco nominativa + GEO, ZHÜ e ECHO',
        protege: 'Linhas de produto e o nome Lesco',
        junta: ['lesco-nominativa', 'linhas-mista']
      },
      {
        id: 'juntos-bambu',
        nome: 'Os dois juntos, com bambu',
        resumo: 'Lesco nominativa + linhas com bambu semitrabalhado',
        protege: 'Linhas de produto com bambu e o nome Lesco',
        junta: ['lesco-nominativa', 'linhas-mista-bambu']
      }
    ]
  };

  function pacote(id) {
    for (var i = 0; i < inpi.pacotes.length; i++) {
      if (inpi.pacotes[i].id === id) return inpi.pacotes[i];
    }
    throw new Error('Pacote do INPI não encontrado: ' + id);
  }

  /* Os pedidos de um pacote, resolvendo os compostos. */
  function pedidosDe(p) {
    if (p.pedidos) return p.pedidos;
    return p.junta.reduce(function (todos, id) {
      return todos.concat(pedidosDe(pacote(id)));
    }, []);
  }

  /* O custo de um pacote, pela regra da Registre.se. */
  function custoPacote(id) {
    var p = typeof id === 'string' ? pacote(id) : id;
    var n = pedidosDe(p).length;
    var r = inpi.regra;
    var assessoria = n ? r.assessoriaPrimeiro + (n - 1) * r.assessoriaDemais : 0;
    var taxas = n * r.taxaPorPedido;

    return {
      id: p.id,
      nome: p.nome,
      resumo: p.resumo,
      protege: p.protege,
      pedidos: n,
      assessoria: assessoria,
      taxas: taxas,
      total: assessoria + taxas
    };
  }

  /* Quanto se economiza fechando dois pacotes como um só. */
  function economiaJunto(idA, idB, idJunto) {
    return custoPacote(idA).total + custoPacote(idB).total - custoPacote(idJunto).total;
  }

  /* O que o bambu acrescenta ao pacote das linhas. */
  function adicionalBambu() {
    return custoPacote('linhas-mista-bambu').total - custoPacote('linhas-mista').total;
  }


  /* =====================================================================
     2 · EMBALAGENS

     O custo de um kit novo NÃO está escrito: ele é a soma das caixas que o
     compõem. Trocar o preço da caixa grande muda os dois kits, a diferença
     para o kit antigo e o peso dela na composição, de uma vez.
     ===================================================================== */

  var embalagens = {
    componentes: {
      caixaGrande: {
        label: 'Caixa grande',
        medida: 'flat micro-ondulado 500×200×150 mm',
        uso: 'Base dos kits novos',
        centavos: 1999
      },
      caixaLinha: {
        label: 'Caixa de linha',
        medida: '',
        uso: 'Uma por linha dentro do kit',
        centavos: 599
      },
      envelope: {
        label: 'Envelope',
        medida: 'pasta 250×150 mm',
        uso: 'Envio de amostras GEO',
        centavos: 789
      }
    },

    kits: [
      { id: 'antigo-grande',   nome: 'Antigo grande',   porte: 'grande',  fornecedor: 'Printi', centavos: 3094 },
      { id: 'antigo-pequeno',  nome: 'Antigo pequeno',  porte: 'pequeno', fornecedor: 'Printi', centavos: 1171 },
      {
        id: 'novo-duas-linhas', nome: 'Novo duas linhas', porte: 'grande', fornecedor: '46',
        descricao: '1 caixa grande + 2 caixas de linha',
        composicao: [
          { componente: 'caixaGrande', qtd: 1, rotulo: 'Caixa grande' },
          { componente: 'caixaLinha',  qtd: 2, rotulo: 'Caixas de linha' }
        ]
      },
      {
        id: 'novo-completo', nome: 'Novo completo', porte: 'grande', fornecedor: '46',
        descricao: '1 caixa grande + 3 caixas de linha Lesco + 1 caixa de linha GEO',
        composicao: [
          { componente: 'caixaGrande', qtd: 1, rotulo: 'Caixa grande' },
          { componente: 'caixaLinha',  qtd: 3, rotulo: 'Caixas de linha Lesco' },
          { componente: 'caixaLinha',  qtd: 1, rotulo: 'Caixa de linha GEO' }
        ]
      },
      {
        /* O kit pequeno novo custa hoje o mesmo que a caixa grande, e a
           composição dele ainda não foi fechada. Por isso ele entra com o
           valor direto e fica fora do gráfico de composição. */
        id: 'novo-pequeno', nome: 'Novo pequeno', porte: 'pequeno', fornecedor: '46',
        descricao: 'A confirmar', composicaoPendente: true, centavos: 1999
      }
    ],

    /* Preço por unidade em cada faixa de quantidade. As faixas são
       categorias, não uma escala numérica: 1.000, 2.000 e 3.000 estão
       igualmente espaçadas no eixo porque o que interessa é o degrau. */
    faixas: [1000, 2000, 3000],
    faixasVolume: [
      { item: 'Caixa grande',       medida: 'flat micro-ondulado 500×200×150 mm', precos: { 1000: 1999, 2000: 1799, 3000: 1499 } },
      { item: 'Caixa tampa e base', medida: '250×60×100 mm',                      precos: { 1000: 1459, 2000: 959,  3000: 759 } },
      { item: 'Envelope',           medida: 'pasta 250×150 mm',                   precos: { 1000: 789,  2000: 479,  3000: 390 } },
      { item: 'Caixa flat',         medida: '250×60×100 mm',                      precos: { 1000: 599,  2000: 459,  3000: 359 } }
    ],

    /* Itens cotados só em 6.000 un (6 artes × 1.000). */
    lote6000: {
      qtd: 6000,
      nota: '6 artes × 1.000 un',
      itens: [
        { item: 'Caixa tampa e base com luva', medida: '250×200×60 mm', centavos: 759, comRelevo: 799 },
        { item: 'Caixa flat',                  medida: '250×200×60 mm', centavos: 599, comRelevo: 649 }
      ]
    },

    /* Ressalvas que vão para o rodapé das telas 8 a 11. */
    relevo: { medida: '70×30 mm', de: 40, ate: 100 },
    envelope1500: { qtd: 1500, centavos: 579 },
    validades: [
      { proposta: '36319', vence: '20 de nov. de 2026' },
      { proposta: '36340', vence: '23 de nov. de 2026' }
    ],

    /* O pedido recomendado pela Louise. */
    pedido: [
      { momento: 'Imediato (GEO)', item: 'Caixas',            componente: 'caixaLinha',  qtd: 400 },
      { momento: 'Imediato (GEO)', item: 'Envelopes',         componente: 'envelope',    qtd: 600 },
      { momento: 'Janeiro',        item: 'Caixa grande',      componente: 'caixaGrande', qtd: 750 },
      { momento: 'Janeiro',        item: 'Caixas das linhas', componente: 'caixaLinha',  qtd: 2400 }
    ],

    /* O cenário que a Louise descartou: todas as amostras de GEO de uma vez. */
    envelopesTodasAmostras: 1200
  };

  function componente(chave) {
    var c = embalagens.componentes[chave];
    if (!c) throw new Error('Componente de embalagem não encontrado: ' + chave);
    return c;
  }

  function kit(id) {
    for (var i = 0; i < embalagens.kits.length; i++) {
      if (embalagens.kits[i].id === id) return embalagens.kits[i];
    }
    throw new Error('Kit não encontrado: ' + id);
  }

  /* Custo de um kit: o declarado, ou a soma da composição. */
  function custoKit(id) {
    var k = typeof id === 'string' ? kit(id) : id;
    if (k.composicao) {
      return k.composicao.reduce(function (t, p) {
        return t + componente(p.componente).centavos * p.qtd;
      }, 0);
    }
    return k.centavos;
  }

  /* As partes de um kit, já com o preço e o peso de cada uma no total. */
  function partesKit(id) {
    var k = typeof id === 'string' ? kit(id) : id;
    if (!k.composicao) return [];
    var total = custoKit(k);

    return k.composicao.map(function (p) {
      var valor = componente(p.componente).centavos * p.qtd;
      return {
        rotulo: p.rotulo,
        qtd: p.qtd,
        unitario: componente(p.componente).centavos,
        valor: valor,
        pct: parte(valor, total)
      };
    });
  }

  /* O kit antigo do mesmo porte — a referência de comparação. */
  function antigoDoPorte(porte) {
    for (var i = 0; i < embalagens.kits.length; i++) {
      var k = embalagens.kits[i];
      if (k.porte === porte && k.fornecedor === 'Printi') return k;
    }
    return null;
  }

  /* Diferença de um kit novo para o antigo do mesmo porte. */
  function diferencaKit(id) {
    var k = typeof id === 'string' ? kit(id) : id;
    var base = antigoDoPorte(k.porte);
    if (!base || base.id === k.id) return null;

    var meu = custoKit(k);
    var dela = custoKit(base);
    var dif = meu - dela;

    return { base: base, centavos: dif, pct: parte(dif, dela) };
  }

  /* Queda de preço da menor para a maior faixa de volume. */
  function quedaVolume(linha) {
    var faixas = embalagens.faixas;
    var de = linha.precos[faixas[0]];
    var ate = linha.precos[faixas[faixas.length - 1]];
    return { centavos: ate - de, pct: parte(ate - de, de) };
  }

  /* Uma linha do pedido, com o subtotal. */
  function linhaPedido(l) {
    var c = componente(l.componente);
    return {
      momento: l.momento,
      item: l.item,
      qtd: l.qtd,
      unitario: c.centavos,
      total: c.centavos * l.qtd
    };
  }

  /* Os momentos do pedido, cada um com as linhas e o subtotal. */
  function momentosPedido() {
    var ordem = [];
    var porMomento = {};

    embalagens.pedido.forEach(function (l) {
      var linha = linhaPedido(l);
      if (!porMomento[linha.momento]) {
        porMomento[linha.momento] = { momento: linha.momento, linhas: [], total: 0 };
        ordem.push(porMomento[linha.momento]);
      }
      porMomento[linha.momento].linhas.push(linha);
      porMomento[linha.momento].total += linha.total;
    });

    return ordem;
  }

  function totalPedido() {
    return momentosPedido().reduce(function (t, m) { return t + m.total; }, 0);
  }

  /* O cenário descartado: o imediato com todos os envelopes. */
  function imediatoTodasAmostras() {
    return momentosPedido()[0].linhas.reduce(function (t, l) {
      var qtd = l.item === 'Envelopes' ? embalagens.envelopesTodasAmostras : l.qtd;
      return t + l.unitario * qtd;
    }, 0);
  }


  /* =====================================================================
     3 · MONO NOS MARKETPLACES
     ===================================================================== */

  var mono = {
    perguntasML: [
      { anuncio: 'Forro vinílico 10 peças',        frete: 9, outras: 5 },
      { anuncio: 'Forro vinílico ripado 10 peças', frete: 3, outras: 0 }
    ],
    periodoPerguntas: 'último mês',

    /* Tabela de frete do anúncio de referência da concorrência, na ordem
       em que ela aparece lá. */
    freteReferencia: [
      { regiao: 'SC, todo o estado',  centavos: 7000 },
      { regiao: 'RS e PR, capital',   centavos: 9000 },
      { regiao: 'RS e PR, interior',  centavos: 11000 },
      { regiao: 'SP, capital',        centavos: 12000 },
      { regiao: 'RJ, capital',        centavos: 14000 },
      { regiao: 'SP, interior',       centavos: 16000 },
      { regiao: 'RJ, interior',       centavos: 17000 },
      { regiao: 'MT e MS, interior',  centavos: 19000 },
      { regiao: 'Rota alternativa 1', centavos: 24000 },
      { regiao: 'Nordeste',           centavos: 35000, apoio: 'consultar no campo de perguntas' },
      { regiao: 'Rota alternativa 2', centavos: 39000 },
      { regiao: 'Rota alternativa 3', centavos: 45000 }
    ],

    tray: { entrada: 50000, parcelas: 12, mensalidade: 79900, meses: 12 },

    creators: {
      verbaTrafego: 50000,
      metaMes: null,          /* em aberto */
      landingPage: null       /* em aberto: custo ou interno */
    },

    comprimento: '2,90 m'
  };

  /* Perguntas somadas: o "12 de 17" da tela 12 sai daqui, não do texto. */
  function perguntas() {
    return mono.perguntasML.reduce(function (t, a) {
      t.frete += a.frete;
      t.outras += a.outras;
      t.total += a.frete + a.outras;
      return t;
    }, { frete: 0, outras: 0, total: 0 });
  }

  /* Parcela da entrada da Tray. Trunca, e não arredonda: é assim que a
     proposta escreve — 12 × R$ 41,66 fecha oito centavos abaixo da entrada,
     e a diferença mora na última parcela. */
  function parcelaTray() {
    return Math.floor(mono.tray.entrada / mono.tray.parcelas);
  }

  function primeiroAnoTray() {
    return mono.tray.entrada + mono.tray.mensalidade * mono.tray.meses;
  }


  /* =====================================================================
     O QUE VAI PARA APROVAÇÃO · a tela de resumo e a de decisões leem daqui

     Uma lista só, para que resumo e decisões não possam divergir. Cada item
     calcula o próprio valor na hora de ser lido; a tela de decisões é esta
     mesma lista, filtrada pelos itens que têm texto de decisão.
     ===================================================================== */

  function aprovacoes() {
    var linhas = custoPacote('linhas-mista');
    var bambu = custoPacote('linhas-mista-bambu');
    var lesco = custoPacote('lesco-nominativa');
    var juntos = custoPacote('juntos');
    var juntosBambu = custoPacote('juntos-bambu');
    var momentos = momentosPedido();

    /* "Caixas 400 × R$ 5,99 + envelopes 600 × R$ 7,89".

       Compacto de propósito: esta frase é a coluna de condição da tela de
       resumo, e ali ela precisa caber em UMA linha — com dez linhas na
       tabela, cada quebra a mais empurra a última para fora do slide. */
    function composicaoDoMomento(m) {
      return m.linhas.map(function (l, i) {
        var nome = i === 0 ? l.item : l.item.toLowerCase();
        return nome + ' ' + numero(l.qtd) + ' × ' + reais(l.unitario);
      }).join(' + ');
    }

    return [
      {
        frente: 'INPI',
        item: 'GEO, ZHÜ e ECHO, mista, classe 19',
        decisao: 'Registro de GEO, ZHÜ e ECHO',
        mostra: reaisCurto(linhas.total),
        mostraDecisao: reaisCurto(linhas.total) + ' (' + reaisCurto(bambu.total) + ' com bambu)',
        condicao: 'Assessoria ' + reaisCurto(linhas.assessoria) + ' em ' +
                  inpi.condicoes.parcelasAssessoria + 'x; taxas ' +
                  reaisCurto(linhas.taxas) + ' à vista'
      },
      {
        frente: 'INPI',
        item: 'Opcional: ZHÜ em bambu semitrabalhado, classe 20',
        mostra: '+ ' + reaisCurto(adicionalBambu()),
        condicao: 'Total com o opcional: ' + reaisCurto(bambu.total)
      },
      {
        frente: 'INPI',
        item: 'Lesco nominativa, classes 19, 35 e 42',
        decisao: 'Lesco em novas categorias',
        mostra: reaisCurto(lesco.total),
        mostraDecisao: reaisCurto(lesco.total) + ' (' + reaisCurto(juntos.total) + ' junto com o item acima)',
        condicao: 'Assessoria ' + reaisCurto(lesco.assessoria) + '; taxas ' + reaisCurto(lesco.taxas)
      },
      {
        frente: 'INPI',
        item: 'Os dois pacotes juntos',
        mostra: reaisCurto(juntos.total),
        condicao: reaisCurto(juntosBambu.total) + ' com o opcional; economia de ' +
                  reaisCurto(economiaJunto('lesco-nominativa', 'linhas-mista', 'juntos'))
      },
      {
        frente: 'Rebrand',
        item: 'Logo novo e depósito do logo no INPI',
        decisao: 'Rebrand com logo novo + depósito no INPI',
        mostra: 'A definir',
        mostraDecisao: 'A definir',
        condicao: 'Fora do orçamento; depende de busca de anterioridade'
      },
      {
        frente: 'Embalagens',
        item: 'Pedido imediato (GEO)',
        decisao: 'Embalagens: pedido imediato e pedido de janeiro',
        mostra: reais(momentos[0].total),
        mostraDecisao: reais(momentos[0].total) + ' + ' + reais(momentos[1].total),
        condicao: composicaoDoMomento(momentos[0])
      },
      {
        frente: 'Embalagens',
        item: 'Pedido de janeiro',
        mostra: reais(momentos[1].total),
        condicao: composicaoDoMomento(momentos[1])
      },
      {
        frente: 'Mono: Tray',
        item: 'Entrada',
        decisao: 'Tray: integração da Mono com os marketplaces',
        mostra: reaisCurto(mono.tray.entrada),
        mostraDecisao: reaisCurto(mono.tray.entrada) + ' + ' + reaisCurto(mono.tray.mensalidade) + '/mês',
        condicao: 'Até ' + mono.tray.parcelas + 'x de ' + reais(parcelaTray())
      },
      {
        frente: 'Mono: Tray',
        item: 'Mensalidade',
        mostra: reaisCurto(mono.tray.mensalidade) + '/mês',
        condicao: 'Valor promocional de Black Friday'
      },
      {
        frente: 'Mono Creators',
        item: 'Tráfego pago para recrutar creators',
        decisao: 'Contas de anúncios e verba Mono Creators',
        mostra: reaisCurto(mono.creators.verbaTrafego),
        mostraDecisao: reaisCurto(mono.creators.verbaTrafego),
        condicao: 'Inbazz já contratada'
      },
      {
        /* Não tem valor e não entra no resumo: é a única decisão da lista
           que se resolve marcando uma data na agenda. */
        frente: 'Showroom',
        item: 'Reunião sobre showroom e posicionamento',
        decisao: 'Reunião sobre showroom e posicionamento',
        mostra: 'Definir data',
        mostraDecisao: 'Definir data',
        condicao: 'Conceito de galeria, com câmaras sensoriais que servem de sala de reunião',
        foraDoResumo: true
      }
    ];
  }

  function resumo() {
    return aprovacoes().filter(function (a) { return !a.foraDoResumo; });
  }

  function decisoes() {
    return aprovacoes()
      .filter(function (a) { return a.decisao; })
      .map(function (a) { return { item: a.decisao, valor: a.mostraDecisao }; });
  }


  return {
    /* formatação */
    reais: reais,
    reaisCurto: reaisCurto,
    pct: pct,
    deltaReais: deltaReais,
    deltaPct: deltaPct,
    numero: numero,
    parte: parte,

    /* dados crus */
    inpi: inpi,
    embalagens: embalagens,
    mono: mono,

    /* INPI */
    pacote: pacote,
    custoPacote: custoPacote,
    economiaJunto: economiaJunto,
    adicionalBambu: adicionalBambu,

    /* embalagens */
    componente: componente,
    kit: kit,
    custoKit: custoKit,
    partesKit: partesKit,
    diferencaKit: diferencaKit,
    quedaVolume: quedaVolume,
    momentosPedido: momentosPedido,
    totalPedido: totalPedido,
    imediatoTodasAmostras: imediatoTodasAmostras,

    /* mono */
    perguntas: perguntas,
    parcelaTray: parcelaTray,
    primeiroAnoTray: primeiroAnoTray,

    /* fechamento */
    aprovacoes: aprovacoes,
    resumo: resumo,
    decisoes: decisoes
  };
})();
