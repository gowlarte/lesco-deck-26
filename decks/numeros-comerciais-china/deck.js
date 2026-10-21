/* ===========================================================================
   COMMERCIAL & MARKETING REVIEW · Lesco
   Apresentação do CEO a parceiros na China · outubro de 2026

   A apresentação é EM INGLÊS: todo texto que vai para a tela está em inglês.
   Os comentários continuam em português, como no resto do projeto.

   Nenhum número está escrito aqui dentro. Tudo vem de dados.js e é formatado
   pelos auxiliares dele — assim corrigir um valor é mexer em um arquivo só, e
   não existe chance de o slide e a fonte divergirem.

   OS VALORES ESTÃO EM DÓLAR
     O CRM e a planilha são em real; a conversão acontece na hora de exibir,
     a R$ 5,05 por dólar (19/10/2026). A cotação está em dados.js, em CAMBIO.
     O rodapé dos slides de dinheiro diz isso, porque um parceiro vai
     perguntar — e porque daqui a seis meses o número já será outro.

   AS FOTOS SÃO DA OUTRA APRESENTAÇÃO
     Apontam para ../instalacao-de-estruturas/img/. São os mesmos arquivos,
     não cópias: 342 MB de original de obra não precisam existir duas vezes
     no disco. Se um dia aquela pasta mudar de nome, estes caminhos quebram
     juntos — é o preço, e é barato perto de duplicar tudo.

   LAYOUTS NOVOS
     bignum, barras, pilha, colunas, rosca, mapa, marquee e parallax estão em
     layouts-dados.js, nesta pasta. Os treze do motor continuam valendo.
   ======================================================================== */

(function () {
  'use strict';

  var D = window.DADOS;
  var IMG = '../instalacao-de-estruturas/img/';

  /* Atalhos de formatação, para o conteúdo abaixo ficar legível. */
  var usd = function (brl, casas) { return D.dinheiro(brl, casas); };
  var mil = function (n) { return D.milhares(n); };

  /* Valor fechado por mês, em milhares de dólar — a unidade que mantém as
     doze colunas legíveis sem notação científica nem casa decimal. */
  function mensal(linhas, comRotulo) {
    return linhas.map(function (m) {
      var k = Math.round(D.usd(m.brl) / 1000);
      return { x: m.mes, v: k, mostra: comRotulo === false ? '' : mil(k) };
    });
  }

  /* Nome por extenso dos estados do ranking — o mapa mostra a sigla, mas
     "SP" não diz nada para quem está do outro lado do mundo. */
  var NOMES = {
    SP: 'São Paulo', PR: 'Paraná', SC: 'Santa Catarina', DF: 'Brasília',
    MS: 'Mato Grosso do Sul', RJ: 'Rio de Janeiro', MG: 'Minas Gerais',
    RS: 'Rio Grande do Sul', PE: 'Pernambuco', AL: 'Alagoas'
  };

  /* Seis estados no ranking, e não oito: o painel da direita tem 904 px de
     altura útil e a sétima linha empurra a escala de cor para fora. */
  var ranking = Object.keys(D.uf)
    .sort(function (a, b) { return D.uf[b].brl - D.uf[a].brl; })
    .slice(0, 6)
    .map(function (uf) {
      return {
        uf: uf,
        nome: NOMES[uf] || uf,
        n: D.uf[uf].n + ' deals',
        mostra: usd(D.uf[uf].brl)
      };
    });

  window.DECK = {
    id: 'numeros-comerciais-china',
    title: 'Commercial & Marketing Review',
    subtitle: 'Lesco · 2025 full year and 2026 year to date',

    slides: [

      /* ===============================================================
         ABERTURA
         =============================================================== */

      {
        layout: 'cover',
        label: 'Cover',
        notes: 'Abertura. A foto é o Ekos, em Florianópolis: brise de lâmina torcida, o produto que melhor resume o que a empresa faz. Dizer em uma frase: dois anos de números comerciais, do primeiro contato ao contrato assinado.',
        eyebrow: 'Lesco · Brazil',
        title: 'Commercial\n& marketing\nreview',
        sub: '2025 in full and 2026 to date — demand, pipeline, conversion and national footprint.',
        footer: 'Itajaí · São Paulo · Brazil',
        background: {
          src: IMG + 'ekos/e01.webp',
          alt: 'Fachada do Ekos com as lâminas verticais de brise instaladas',
          focal: '58% 50%',
          overlay: 'left'
        }
      },

      {
        layout: 'index',
        label: 'Agenda',
        notes: 'Roteiro. Seis blocos. Avisar que os números da operação começam no bloco 02 — o 01 é só para situar quem nunca ouviu falar da empresa.',
        /* Uma linha, e não duas: com seis itens a lista encostava na borda
           de baixo, e a segunda linha do título custava 89 px que a lista
           precisava mais do que ele. */
        title: 'What this covers',
        /* A numeração 01–06 é automática no layout; a tag da direita carrega
           o número que resume cada bloco, para o sumário já adiantar algo. */
        items: [
          { name: 'The company',  apoio: 'What Lesco makes, and for whom',      tag: 'Three materials' },
          { name: 'Demand',       apoio: 'Everything that came in, by channel', tag: mil(D.demanda.total) + ' requests' },
          { name: 'Conversion',   apoio: 'From quotation to signed contract',   tag: usd(D.vendas25.brl) },
          { name: 'The customer', apoio: 'Who buys, and how they found us',     tag: D.perfil.length + ' profiles' },
          { name: 'Footprint',    apoio: 'Where the contracts are',             tag: D.ufsCobertas + ' states' },
          { name: '2026 to date', apoio: 'Nine months, side by side with 2025', tag: D.fechados26.n + ' contracts' }
        ]
      },

      /* ===============================================================
         01 · A EMPRESA — dois slides e a tira de obras
         =============================================================== */

      {
        layout: 'half',
        label: 'The company',
        notes: 'A empresa em um slide. Não inventar número de fundação, fábrica ou funcionários — o que está aqui é o que está documentado. A foto é uma residência com painéis pivotantes: produto acabado, luz de fim de tarde.',
        eyebrow: '01 · The company',
        title: 'Architecture\nmade for\ntomorrow',
        /* Texto curto por necessidade: a coluna do layout half comporta
           seis linhas de lead antes de empurrar a foto para fora do slide. */
        text: 'Architectural cladding in wood-composite, mineral stone and solid bamboo: brises, façade and ceiling panels, decking and lattice. Specified by architects, installed by certified crews.',
        destaques: ['Itajaí · SC', 'São Paulo · SP'],
        media: {
          src: IMG + 'ala/abertura.webp',
          alt: 'Residência com painéis pivotantes de madeira composta ao fim da tarde',
          focal: '52% 50%'
        }
      },

      {
        layout: 'cards',
        label: 'WPC systems',
        notes: 'As cinco linhas em WPC, com as medidas reais do catálogo 2025. Muxarabi fica por último de propósito. Se perguntarem por acabamento: Ipê, Oak, Red Cedar, Teak, Walnut, Weatherwood, Black e Lily White, escovado ou texturizado. Existe ainda a linha Line no catálogo, que ficou fora por caber mal em cinco cards — se virar assunto, está na página 38.',
        eyebrow: '01 · The company',
        title: 'Five systems\nin wood-composite',
        sub: 'WPC is 55% wood flour and 35% HDPE — termite-proof, hydrophobic, mould-resistant, ten-year warranty.',
        items: [
          { label: 'Brise',    text: 'Sun-shading slats, 25 × 25 up to 250 × 50 mm.',   src: IMG + 'tec/brise-200x50.webp', alt: 'Perfil de brise 200 × 50 mm' },
          { label: 'Panel',    text: 'Façade and ceiling cladding, 119 to 260 mm.',      src: IMG + 'tec/panel-119x12.webp', alt: 'Perfil de painel 119 × 12 mm' },
          { label: 'Deck',     text: 'Decking boards on clip fixing, 97 to 150 mm.',     src: IMG + 'tec/deck-150x22.webp',  alt: 'Perfil de régua de deck 150 × 22 mm' },
          { label: 'Shield',   text: 'Cladding boards, 124 × 15.5 up to 219 × 38.5 mm.', src: 'img/shield-perfil.webp',      alt: 'Perfil de revestimento Shield, com o encaixe macho-fêmea e o canal da presilha' },
          { label: 'Muxarabi', text: 'Modular lattice in 50, 100 and 150 mm.',           src: IMG + 'tec/muxarabi-100.webp', alt: 'Módulo de muxarabi 100 mm' }
        ]
      },

      /* A linha que conta a expansão: o portfólio deixou de ser só WPC.
         Geo e Zhú têm catálogo fechado (2026) e entram com material e
         aplicação; Echo entra só pelo nome, porque ainda não tem catálogo
         e não há o que afirmar sobre ela sem inventar. */
      {
        layout: 'cards',
        label: 'Beyond WPC',
        notes: 'O ponto do slide: a Lesco deixou de ser uma empresa de um material só. Geo é pedra flexível mineral, Zhú é bambu maciço — duas matérias-primas que não têm nada a ver com WPC, cada uma com catálogo próprio lançado em 2026. A Echo fica fora do deck por ora, a pedido: se alguém perguntar o que vem depois, a resposta é que há linha em desenvolvimento, sem nome nem data.',
        eyebrow: '01 · The company',
        title: 'And two more\nmaterials',
        sub: 'The portfolio stopped being one material. Two new lines, each with its own catalogue, launched in 2026.',
        items: [
          {
            label: 'Geo',
            text: 'Flexible mineral stone, 2 to 10 mm. Façades, curved surfaces and interiors. Ten-year warranty.',
            src: 'img/geo-pedra.webp',
            alt: 'Textura de pedra da linha Geo'
          },
          {
            label: 'Zhú',
            text: 'Solid bamboo panels, ceilings, baffles and decking. Indoor and outdoor finishes.',
            src: 'img/zhu-bambu.webp',
            alt: 'Painel acústico de bambu maciço da linha Zhú'
          }
        ]
      },

      /* As duas linhas novas em obra. Uma folha para cada, com três
         aplicações que cobrem o que o catálogo promete — dizer "serve para
         fachada, interior e forro" é barato; mostrar é que sustenta.
         As fotos saíram dos catálogos de 2026 de cada linha. */
      {
        layout: 'duo',
        label: 'Geo applied',
        notes: 'Geo em obra. Da esquerda para a direita: parede interna em textura de travertino, fachada residencial e fachada institucional. O argumento forte aqui é a superfície curva — nenhuma pedra natural faz a curva do pilar sem corte especial, e a Geo faz porque é flexível. Medidas até 3000 × 1200 mm, espessura de 2 a 10 mm, 10 anos de garantia, prazo de 90 a 120 dias.',
        eyebrow: '01 · The company',
        title: 'Geo in place',
        sub: 'Façades, walls, pillars, curved surfaces, interiors and ceilings — sheets up to 3000 × 1200 mm, 2 to 10 mm thick.',
        media: [
          { src: 'img/geo-interior.webp',      alt: 'Parede interna revestida em textura de travertino da linha Geo', focal: '50% 50%' },
          { src: 'img/geo-residencia.webp',    alt: 'Fachada residencial revestida em pedra flexível Geo',            focal: '50% 52%' },
          { src: 'img/geo-institucional.webp', alt: 'Fachada institucional em placas de pedra flexível Geo',          focal: '50% 46%' }
        ]
      },

      {
        layout: 'duo',
        label: 'Zhú applied',
        notes: 'Zhú em obra. Da esquerda para a direita: fachada de resort, forro e parede internos com ripado, e sala de jantar residencial. Vale citar que a mesma linha cobre fachada e acústica — o painel acústico leva camada cruzada com base em PET preto ou suporte de alumínio. Acabamento em óleo de madeira para interno e externo, verniz UV só para interno.',
        eyebrow: '01 · The company',
        title: 'Zhú in place',
        sub: 'Walls, façades, ceilings and decking in solid bamboo — wood oil for indoor and outdoor, UV varnish for indoor.',
        media: [
          { src: 'img/zhu-resort.webp',   alt: 'Fachada de resort com ripado de bambu maciço da linha Zhú', focal: '50% 48%' },
          { src: 'img/zhu-forro.webp',    alt: 'Forro e paredes internas em ripado de bambu, com luz natural', focal: '50% 50%' },
          { src: 'img/zhu-interior.webp', alt: 'Sala de jantar com parede em ripado de bambu maciço',        focal: '50% 46%' }
        ]
      },

      {
        layout: 'marquee',
        label: 'Projects — marquee',
        notes: 'A tira anda sozinha, sem clique. Deixar correndo enquanto fala: são obras entregues, de residência a torre de 14 pavimentos. Não é preciso citar uma por uma — a legenda já diz cidade e sistema.',
        eyebrow: '01 · The company',
        title: 'Delivered',
        sub: 'Residential, hospitality and commercial — from a single terrace to 1,228 m² of ceiling.',
        segundos: 52,
        /* Arquivos leves de propósito: a tira mostra sete molduras ao mesmo
           tempo, e os originais de obra de 9 MB travariam a entrada do
           slide. As fotos pesadas ficam para os slides de uma imagem só. */
        fotos: [
          { src: IMG + 'ala/abertura.webp',            label: 'Private residence', apoio: 'Pivoting panels' },
          { src: IMG + 'salt2/t10.webp',                label: 'Salt Praia Brava',  apoio: 'Itajaí · Muxarabi' },
          { src: IMG + 'ita/hub01-deck-concluido.webp', label: 'Casa Ita',          apoio: 'São Paulo · Deck' },
          { src: IMG + 'amira/hub08-forro-pronto.webp', label: 'Amira',             apoio: 'Curitiba · Panel ceiling' },
          { src: IMG + 'ekos/e09-lamina-na-obra.webp', label: 'Ekos',              apoio: 'Florianópolis · Brise' },
          { src: IMG + 'ala/a06.webp',                 label: 'Façade panels',     apoio: 'Campinas · Pivoting brise' }
        ]
      },

      /* ===============================================================
         02 · DEMANDA
         =============================================================== */

      {
        layout: 'chapter',
        label: '02 · Demand — opening',
        notes: 'Abre o bloco de demanda. A pergunta que o slide responde: quanta gente procurou a Lesco em um ano?',
        num: '02',
        eyebrow: 'One year of inbound',
        title: 'Demand',
        footer: 'Every request logged in 2025, across the three pipelines.',
        background: {
          src: IMG + 'amira/predio.webp',
          alt: 'Fachada do Amira em obra, com o forro de madeira sob cada laje',
          focal: '50% 50%'
        }
      },

      {
        layout: 'barras',
        label: 'Demand by channel',
        notes: 'Os 11.518 são a soma dos três funis do CRM, filtrados por data de criação em 2025. O maior deles não pede preço: pede catálogo. Isso é marketing, não vendas — e é o topo do funil do ano seguinte.',
        eyebrow: '02 · Demand',
        title: 'Eleven thousand\nconversations',
        sub: 'Requests registered in 2025, by entry channel.',
        items: D.demanda.canais.map(function (c, i) {
          return { label: c.label, apoio: c.sub, valor: c.n, mostra: mil(c.n), destaque: i === 1 };
        }),
        nota: 'Source: CRM, three pipelines filtered by creation date in 2025. Total ' + mil(D.demanda.total) + ' requests.'
      },

      {
        layout: 'pilha',
        label: 'What happened to the 4,180',
        notes: 'O slide honesto. 94% dos pedidos de orçamento não fecharam — e os perdidos valem dez vezes o que foi ganho. Não é má notícia: é o tamanho do mercado que já nos procurou e ainda está lá. Se perguntarem o motivo: preço e prazo são os dois principais.',
        eyebrow: '02 · Demand',
        title: 'Four thousand\nquote requests',
        sub: 'Status of every quote request opened in 2025, measured today.',
        total: D.funil.total,
        totalLabel: 'requests',
        items: [
          { label: 'Closed · won', n: D.funil.etapas[0].n, mostra: usd(D.funil.etapas[0].brl) + ' contracted', tom: 1 },
          { label: 'Still open',   n: D.funil.etapas[1].n, mostra: usd(D.funil.etapas[1].brl) + ' quoted',     tom: 2 },
          { label: 'Lost',         n: D.funil.etapas[2].n, mostra: usd(D.funil.etapas[2].brl) + ' on the table', tom: 3 }
        ],
        nota: 'Of the ' + D.funil.aberto.cotados + ' open requests at quotation stage, ' + D.funil.aberto.negociando +
              ' are in final negotiation. Values converted at R$ ' + String(D.cambio).replace('.', ',') + ' per US$ 1.00 (19 Oct 2026).'
      },

      {
        layout: 'bignum',
        label: 'Quotations issued',
        notes: 'O número que mede o esforço comercial, não o resultado. Mais de meio bilhão de real em cotações no ano. O crescimento de 57% em quantidade contra 26% em valor significa cotação menor e mais frequente — exatamente o que o canal de catálogo produz.',
        eyebrow: '02 · Demand',
        title: 'Quotations issued in 2025',
        prefixo: 'US$',
        valor: Number(D.milhoes(D.cotacoes.brl)),
        casas: 2,
        sufixo: 'M',
        legenda: 'Across ' + mil(D.cotacoes.n) + ' quotations — an average of ' +
                 usd(D.cotacoes.brl / D.cotacoes.n) + ' per quotation.',
        variacoes: [
          { valor: '+' + D.cotacoes.deltaValor + '%', label: 'value vs 2024' },
          { valor: '+' + D.cotacoes.deltaQtd + '%', label: 'volume vs 2024' }
        ],
        nota: 'Source: CRM, quotations issued between 1 Jan and 31 Dec 2025. R$ ' +
              D.milhares(D.cotacoes.brl) + ' converted at R$ ' + String(D.cambio).replace('.', ',') + ' per US$ 1.00.'
      },

      /* ===============================================================
         03 · CONVERSÃO
         =============================================================== */

      {
        layout: 'chapter',
        label: '03 · Conversion — opening',
        notes: 'Vira a chave: da demanda para o que virou contrato.',
        num: '03',
        eyebrow: 'From quotation to contract',
        title: 'Conversion',
        footer: 'What was signed, month by month.',
        background: {
          src: IMG + 'ita/abertura.webp',
          alt: 'Deck da Casa Ita concluído, com a casa ao fundo',
          focal: '50% 58%'
        }
      },

      {
        layout: 'bignum',
        label: 'Revenue 2025',
        notes: 'O número do ano. O contraste entre +22% em valor e +160% em quantidade é a história: a empresa mais que dobrou o número de obras sem dobrar o faturamento. Ticket menor, base muito mais larga — e base larga é o que sustenta um ano ruim.',
        eyebrow: '03 · Conversion',
        title: 'Closed in 2025',
        prefixo: 'US$',
        valor: Number(D.milhoes(D.vendas25.brl)),
        casas: 2,
        sufixo: 'M',
        legenda: 'Across ' + D.vendas25.n + ' signed contracts, at an average of ' +
                 usd(D.vendas25.brl / D.vendas25.n) + ' each.',
        variacoes: [
          { valor: '+' + D.vendas25.deltaValor + '%', label: 'value vs 2024' },
          { valor: '+' + D.vendas25.deltaQtd + '%', label: 'contracts vs 2024' }
        ],
        lado: [
          ['Quotations issued', usd(D.cotacoes.brl)],
          ['Contracts signed', usd(D.vendas25.brl)],
          ['Conversion, by value', (100 * D.vendas25.brl / D.cotacoes.brl).toFixed(1) + '%'],
          ['Conversion, by volume', (100 * D.vendas25.n / D.cotacoes.n).toFixed(1) + '%']
        ],
        nota: 'Source: CRM, closing date in 2025. R$ ' + D.milhares(D.vendas25.brl) +
              ' converted at R$ ' + String(D.cambio).replace('.', ',') + ' per US$ 1.00.'
      },

      {
        layout: 'colunas',
        label: '2025 month by month',
        notes: 'A curva do ano. Junho a outubro concentram quase dois terços do valor — é o ciclo da obra brasileira, que entrega antes das chuvas de fim de ano. Novembro e dezembro são sempre fracos; não é queda, é calendário.',
        eyebrow: '03 · Conversion',
        title: 'Month by month, 2025',
        sub: 'Contracted value by closing date.',
        unidade: 'US$ thousand',
        series: [{ nome: '2025', pontos: mensal(D.mensal25) }],
        nota: 'Source: CRM export, closed deals only. Five months — June to October — carry ' +
              D.sazonal.junOut + '% of the year.'
      },

      {
        layout: 'parallax',
        label: 'Breather — Salt',
        notes: 'Respiro entre dois blocos de número. Deixar dois ou três segundos em silêncio antes de falar. A torre é o Salt Praia Brava, em Itajaí: muxarabi no embasamento, 14 pavimentos.',
        eyebrow: 'Salt Praia Brava · Itajaí',
        title: 'Specified,\nmanufactured,\ninstalled',
        texto: 'Every number in this deck ends on a building site.',
        src: IMG + 'salt2/t10.webp',
        alt: 'Torre do Salt Praia Brava com o muxarabi no embasamento',
        focal: '50% 42%',
        overlay: 'bottom',
        numeros: [
          { valor: D.fechados25.n + D.fechados26.n, label: 'contracts closed · 2025–26' },
          { valor: D.ufsCobertas, label: 'states reached' },
          { valor: usd(D.fechados25.brl + D.fechados26.brl, 1), label: 'contracted' }
        ]
      },

      /* ===============================================================
         04 · O CLIENTE
         =============================================================== */

      {
        layout: 'chapter',
        label: '04 · The customer — opening',
        notes: 'Bloco do cliente. Duas perguntas: quem compra e por onde chegou.',
        num: '04',
        eyebrow: 'Who signs, and how they arrive',
        title: 'The customer',
        footer: 'Buyer profile and acquisition channel.',
        background: {
          src: IMG + 'ala/a07.webp',
          alt: 'Painéis pivotantes instalados na fachada',
          focal: '50% 50%'
        }
      },

      {
        layout: 'rosca',
        label: 'Who buys',
        notes: 'O ponto do slide: arquiteto é quem mais compra em quantidade, construtora é quem mais compra em valor. São dois negócios diferentes dentro da mesma empresa — e explicam por que o marketing fala com arquiteto e o comercial fala com construtora.',
        eyebrow: '04 · The customer',
        title: 'Who buys',
        sub: 'Share of contracted value in 2025, by client profile.',
        centro: { valor: usd(D.vendas25.brl, 1), label: D.vendas25.n + ' contracts' },
        items: D.perfil.map(function (p) {
          return { label: p.label, pct: p.pct, n: p.n, mostra: usd(p.brl) };
        }),
        nota: 'Source: CRM panel "who bought", closing date in 2025. Architects sign the most contracts; contractors sign the largest ones.'
      },

      {
        layout: 'barras',
        label: 'How they arrive',
        notes: 'Marketing digital é o maior canal isolado em quantidade. Representante e cliente recorrente vêm logo atrás e pesam mais em valor. Os 49 sem origem registrada estão no slide de propósito: não dá para otimizar o que não se mede, e esse é o primeiro ajuste de CRM para 2027.',
        eyebrow: '04 · The customer',
        title: 'How the deals arrive',
        sub: 'Signed contracts in 2025 and 2026, by recorded source.',
        items: D.origem.map(function (o) {
          return {
            label: o.label,
            apoio: usd(o.brl),
            valor: o.n,
            mostra: mil(o.n),
            destaque: o.label === 'Inbound marketing'
          };
        }),
        nota: 'Source: CRM export, 232 closed deals. 49 of them carry no source field — shown here rather than dropped from the count.'
      },

      /* ===============================================================
         05 · GEOGRAFIA
         =============================================================== */

      {
        layout: 'chapter',
        label: '05 · Footprint — opening',
        notes: 'Bloco geográfico. É o que mais interessa a um parceiro estrangeiro: onde a empresa já está e onde ainda não está.',
        num: '05',
        eyebrow: 'Eighteen states',
        title: 'Footprint',
        footer: 'Where the contracts were signed, 2025 and 2026.',
        background: {
          src: IMG + 'amira/forro.webp',
          alt: 'Forro em Lesco Panel correndo sob a laje em balanço',
          focal: '50% 42%'
        }
      },

      {
        layout: 'mapa',
        label: 'Brazil — closed deals by state',
        notes: 'O mapa mostra duas coisas de uma vez: a concentração em São Paulo (45% do valor) e o país inteiro que ainda está em branco. O Norte tem dois negócios em dois anos — não é mercado explorado, é mercado intocado. Usar isso ao falar de expansão.',
        eyebrow: '05 · Footprint',
        title: 'Where the\ncontracts are',
        sub: 'Contracted value by state, 2025 and 2026 combined.',
        valores: D.uf,
        chave: 'brl',
        rotulos: ['SP', 'PR', 'SC'],
        escalaMin: 'no deals',
        escalaMax: 'highest',
        destaques: [
          { valor: String(D.ufsCobertas), label: 'states reached' },
          { valor: String(D.fechados25.n + D.fechados26.n), label: 'contracts' },
          { valor: usd(D.fechados25.brl + D.fechados26.brl, 1), label: 'contracted' }
        ],
        ranking: ranking,
        nota: 'Source: CRM export, closed deals 2025 and 2026. Quotation volume is not broken down by state in the current export.'
      },

      {
        layout: 'barras',
        label: 'By region',
        notes: 'Sudeste e Sul somam 82% do valor — é onde estão as duas sedes e a malha de representantes. Nordeste e Norte são 6% juntos, e moram neles mais de um terço dos brasileiros. Esse é o argumento de expansão, se a conversa for essa.',
        eyebrow: '05 · Footprint',
        title: 'Five regions,\ntwo that matter',
        sub: 'Share of contracted value, 2025 and 2026 combined.',
        items: D.regiao.map(function (r, i) {
          return {
            label: r.label,
            apoio: r.n + ' contracts · ' + r.pct.toFixed(1) + '%',
            valor: r.brl,
            mostra: usd(r.brl),
            destaque: i === 0
          };
        }),
        nota: 'Southeast and South together carry 82% of contracted value. North and Northeast, home to a third of the country, carry 6%.'
      },

      /* ===============================================================
         06 · 2026
         =============================================================== */

      {
        layout: 'chapter',
        label: '06 · 2026 — opening',
        notes: 'Último bloco. Nove meses de 2026, comparados ao mesmo recorte de 2025. Não esconder a queda de valor: ela vem com alta de volume e tem explicação.',
        num: '06',
        eyebrow: 'Nine months in',
        title: '2026\nto date',
        footer: 'January to September, against the same months of 2025.',
        background: {
          src: IMG + 'ekos/e06.webp',
          alt: 'Detalhe do topo da lâmina de brise contra o céu',
          focal: '46% 40%'
        }
      },

      {
        layout: 'bignum',
        label: '2026 year to date',
        notes: 'O slide que não pode ser maquiado. Mais contratos, menos valor: ticket médio caiu de US$ 29 mil para US$ 21 mil. A leitura honesta é base mais larga e obra menor — e outubro a dezembro são os meses que ainda faltam, que em 2025 renderam 18% do ano.',
        eyebrow: '06 · 2026 to date',
        title: 'Nine months of 2026',
        prefixo: 'US$',
        valor: Number(D.milhoes(D.fechados26.brl)),
        casas: 2,
        sufixo: 'M',
        legenda: 'Across ' + D.fechados26.n + ' contracts in ' + D.fechados26.ufs + ' states — ' +
                 'more deals than in the same months of 2025, at a smaller average size.',
        variacoes: [
          { valor: '+' + Math.round(100 * (D.fechados26.n / D.fechados25_9m.n - 1)) + '%', label: 'contracts vs 9M 2025' },
          { valor: Math.round(100 * (D.fechados26.brl / D.fechados25_9m.brl - 1)) + '%', label: 'value vs 9M 2025', baixa: true }
        ],
        lado: [
          ['Contracts · 9M 2026', String(D.fechados26.n)],
          ['Contracts · 9M 2025', String(D.fechados25_9m.n)],
          ['Average size · 2026', usd(D.fechados26.brl / D.fechados26.n)],
          ['Average size · 2025', usd(D.fechados25_9m.brl / D.fechados25_9m.n)]
        ],
        nota: 'Source: CRM export, closing date between January and September. October to December are not in yet — in 2025 they carried ' +
              D.sazonal.outDez + '% of the year.'
      },

      {
        layout: 'colunas',
        label: '2025 vs 2026',
        notes: 'Mês a mês, os dois anos sobrepostos. Agosto de 2026 é o maior mês da série inteira. Setembro cai forte — vale checar se é fechamento atrasado no CRM antes de alguém perguntar.',
        eyebrow: '06 · 2026 to date',
        title: '2026 against 2025',
        sub: 'Contracted value by month, January to September.',
        unidade: 'US$ thousand',
        series: [
          { nome: '2025', fantasma: true, pontos: mensal(D.mensal25.slice(0, 9), false) },
          { nome: '2026', pontos: mensal(D.mensal26) }
        ],
        nota: 'August 2026 is the single largest month of either year. Source: CRM export, closed deals.'
      },

      /* ===============================================================
         FECHAMENTO
         =============================================================== */

      {
        layout: 'checklist',
        label: 'What the numbers say',
        notes: 'O resumo. Cinco leituras, nenhuma delas uma opinião: todas saem de um slide anterior. Se o tempo apertar, este é o slide que substitui os outros vinte.',
        eyebrow: 'In summary',
        title: 'What the\nnumbers say',
        items: [
          { label: 'Demand is not the constraint', text: mil(D.demanda.total) + ' requests arrived in 2025 — 56% of them asking for the catalogue, not a price.' },
          { label: 'The gap is conversion', text: 'Of ' + mil(D.funil.total) + ' quote requests, 114 closed. ' + usd(D.funil.etapas[2].brl) + ' was lost and is still in the market.' },
          { label: 'Two customers, one company', text: 'Architects sign the most contracts; contractors sign 57.6% of the value.' },
          { label: 'The base is widening', text: 'Contracts up 160% in 2025 and another 22% in 2026, at a falling average size.' },
          { label: 'The map is mostly empty', text: D.ufsCobertas + ' states reached, 82% of value in two regions. The North has two contracts in two years.' }
        ]
      },

      /* Fecha com o lugar pronto e em uso, não com o canteiro — é assim que
         as apresentações da casa terminam cada caso. */
      {
        layout: 'photo',
        label: 'Closing image',
        notes: 'Imagem de fecho antes do contato. Terraço entregue, em uso. Deixar na tela enquanto abre para perguntas.',
        src: IMG + 'ita/terraco.webp',
        alt: 'Terraço com o deck concluído, sob a pérgola de estrutura vermelha',
        /* Corte puxado para baixo: a legenda cai sobre as réguas do deck,
           que são escuras e uniformes, e não sobre o sofá branco. */
        focal: '50% 80%',
        eyebrow: 'São Paulo · Lesco Green Deck',
        title: 'Where the\nnumbers land',
        drift: true
      },

      {
        layout: 'outro',
        label: 'Closing',
        notes: 'Encerramento. Deixar o contato na tela e abrir para perguntas.',
        title: 'Architecture made\nfor tomorrow',
        left: 'lesco.com.br\n@lesco_br',
        right: 'Itajaí — SC\nSão Paulo — SP'
      }

    ]
  };
})();
