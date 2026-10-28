/* ===========================================================================
   APRESENTAÇÃO TÉCNICA · OBRAS DECATHLON
   Sistema de instalação Lesco + ModularKit

   ESQUELETO. O conteúdo veio de "Lesco + ModularKit Decathlon.pptx"
   (13 slides, cópia em _source/originais/decathlon/), redistribuído nos
   layouts do motor. O que o PowerPoint trazia como texto corrido virou
   tabela, ficha ou checklist; o que ele trazia como bloco de imagem virou
   foto ou desenho.

   Este é o único arquivo que você precisa editar para mudar a apresentação.
   Cada objeto da lista `slides` é um slide.

   Campos comuns a todos os slides
     layout      qual dos layouts usar (ver engine/layouts.js)
     label       nome do slide na grade (tecla G)
     notes       notas do apresentador (tecla N) — não aparecem na projeção
     tone        'paper' (claro, padrão) ou 'ink' (grafite)
     transition  opcional: 'curtain' | 'mask' | 'stagger' | 'push' | 'fade'

   Quebra de linha em títulos: use \n.

   ---------------------------------------------------------------------------
   ONDE ENTRA ANIMAÇÃO

   Quatro slides chamam um desenho (`media: { svg: ... }`). Enquanto a função
   correspondente não existir em animacoes.js, o motor mostra "Desenho a
   inserir" com a descrição — o slide continua apresentável. Quando o desenho
   chegar, nada mais muda aqui.

     slide 06  camadas-revestimento   PRONTO — o bloco abre em camadas
     slide 07  painel-montagem        PRONTO — a cremalheira recebe os brises
     slide 13  escoamento-inferior    o espaço livre na face inferior

   ---------------------------------------------------------------------------
   PENDÊNCIAS ANTES DA LIVE

     · Nomes comerciais das três camadas externas (slide 06) — só "miolo
       polímero" veio da Lesco; os rótulos 01, 02 e 03 são descritivos
     · Telefone comercial e domínio do e-mail da Engenharia (slide 15)

   Valor escrito como 'a confirmar' numa tabela aparece marcado no slide,
   de propósito: é o lembrete do que falta fechar.

   ---------------------------------------------------------------------------
   FOTOS

   As de obra saíram do PowerPoint, nos formatos originais (PNG e JPEG,
   17 MB no total). Antes do primeiro commit elas precisam virar WebP de
   2560 px, como as das outras apresentações.

   img/camadas/ é outra coisa: são os oito renders que a Lesco mandou, um
   por camada do perfil, e continuam PNG porque dependem do canal alfa para
   empilhar. Dois megabytes no total — não precisam encolher. Os nomes dos
   arquivos são os da origem (topo 1 a 3, lateral 1 a 3, miolo, sombra); os
   quatro PNGs soltos na pasta de cima do material de origem são de outro
   fabricante e não entram nesta apresentação.
   ======================================================================== */

window.DECK = {
  id: 'obras-decathlon',
  title: 'Obras Decathlon · Sistema de instalação',
  subtitle: 'Lesco + ModularKit com as cinco construtoras executoras',

  slides: [

    /* ===================================================================
       ABERTURA
       =================================================================== */

    {
      /* A capa veio pronta da Lesco, em PDF vetorial (original em
         _source/originais/decathlon/CAPA.pdf), convertida para SVG. Ela já
         traz os logos, o filete e a marca Decathlon — o único texto é o
         rótulo abaixo, reposto na tipografia do deck. */
      layout: 'capa',
      label: 'Capa',
      notes: 'Abertura. O objetivo do encontro é alinhar como funciona o sistema de instalação Lesco + ModularKit, para que todas as obras tenham o mesmo padrão de qualidade.',
      eyebrow: 'Apresentação técnica',
      arte: 'img/capa.svg',
      alt: 'Capa Lesco + ModularKit para as obras Decathlon'
    },

    {
      layout: 'index',
      label: 'Roteiro',
      notes: 'O caminho da conversa. Abrir dizendo que a parte final — dilatação, cortes e escoamento — é a que mais gera dúvida em obra.',
      eyebrow: 'Roteiro',
      title: 'O que vamos\nalinhar',
      items: [
        { name: 'A Lesco e o grupo',      apoio: 'Quem responde pelo produto e pela instalação', tag: 'Abertura' },
        { name: 'O material e o sistema', apoio: 'Camadas, porta-painel e espaçamento',          tag: 'Produto' },
        { name: 'Os projetos executivos', apoio: 'A referência de cada fachada',                 tag: 'Obra' },
        { name: 'O que não pode falhar',  apoio: 'Dilatação, cortes e escoamento',               tag: 'Cuidados' },
        { name: 'Checklist e contato',    apoio: 'O resumo que vai para a obra',                 tag: 'Fechamento' }
      ]
    },

    /* ===================================================================
       01 · QUEM ENTREGA
       =================================================================== */

    {
      layout: 'stats',
      label: 'A Lesco',
      notes: 'A Lesco foi pioneira no segmento de madeira ecológica, surgiu há 16 anos e acompanhou o desenvolvimento do próprio WPC. Produto sem manutenção, com garantia de 10 anos em todas as linhas contra desbotamento, empenamento e trincas.',
      eyebrow: 'A Lesco',
      title: 'Pioneira em\nmadeira ecológica',
      sub: 'Dezesseis anos acompanhando a evolução do próprio WPC.',
      items: [
        { eyebrow: 'Mercado',    caption: 'anos no mercado',          value: 16 },
        { eyebrow: 'Garantia',   caption: 'anos em todas as linhas',  value: 10, unit: '', accent: true },
        { eyebrow: 'Manutenção', caption: 'ao longo da vida útil',    value: 0 }
      ],
      note: 'A garantia cobre desbotamento, empenamento e trincas. Sede em Itajaí-SC, filial em São Paulo, atendimento em todo o Brasil.'
    },

    {
      layout: 'cards',
      label: 'Portfólio',
      notes: 'Cases. JHA, obra premiada no Itaim Bibi. Arena de Handebol do Rio, desmontada oito anos depois e reinstalada em quatro escolas — a prova de durabilidade do sistema. COP 30, Parque da Cidade, todo com revestimento Lesco.',
      eyebrow: 'Portfólio',
      title: 'Obras que viram\nreferência',
      fotos: true,
      items: [
        {
          label: 'JHA',
          text: 'Itaim Bibi, SP. GRI Awards 2024, Gold Winner Architecture Design Awards 2024 e Architecture Hunters.',
          src: 'img/obra/jha.jpg',
          alt: 'Fachada do JHA em brise de madeira ecológica'
        },
        {
          label: 'Arena de Handebol',
          text: 'Rio de Janeiro. Desmontada após 8 anos e reinstalada em 4 novas escolas.',
          src: 'img/obra/arena-handebol.jpg',
          alt: 'Arena de Handebol do Rio de Janeiro'
        },
        {
          label: 'COP 30',
          text: 'Parque da Cidade, Belém. Executado inteiro com revestimento Lesco.',
          src: 'img/obra/cop30.png',
          alt: 'Cobertura do Parque da Cidade em Belém'
        },
        {
          label: 'Decathlon Tietê',
          text: 'Retrofit Mundial Lojas Decathlon.',
          src: 'img/obra/decathlon-tiete.webp',
          alt: 'Fachada da Decathlon Tietê com revestimento de madeira ecológica'
        }
      ]
    },

    {
      layout: 'split',
      label: 'Grupo Lesco',
      notes: 'A ModularKit é o novo braço da Lesco. A intenção é ter um único grupo responsável por produto, fixação e acabamento, para garantir padrão de acabamento, solução técnica e execução — e que o produto desempenhe o melhor ao longo dos 10 anos de garantia.',
      eyebrow: 'Grupo Lesco',
      title: 'Mesma qualidade,\nindependente de\nquem executa',
      text: 'Um único grupo responsável pelo produto, pela fixação e pelo acabamento final do sistema.',
      rows: [
        ['Produto', 'Brises e revestimentos Lesco em madeira ecológica'],
        ['Fixação', 'Porta-painel e arremates ModularKit, novo braço do grupo'],
        ['Suporte', 'Apoio à rede de representantes regionais na instalação']
      ],
      note: 'Solução completa: produto e instalação entregues juntos, não só o material. A promessa de excelência sem manutenção vale também para a instalação.'
    },

    /* ===================================================================
       02 · O MATERIAL E O SISTEMA
       Os dois slides de animação. Ver animacoes.js.
       =================================================================== */

    {
      layout: 'camadas',
      label: 'O material em camadas',
      notes: 'O que o cliente vê como "madeira" é um perfil extrudado em camadas: a face não é pintura, é material. O bloco entra fechado e se abre sozinho ao chegar no slide. COMO USAR AO VIVO: apontar uma camada apaga as outras três — a peça do topo e a lateral do mesmo material acendem juntas. O quadro com o texto só abre na bolinha do número, e fica aberto enquanto o ponteiro estiver nele. No PDF os quatro quadros saem abertos de uma vez. PENDENTE: os nomes comerciais das três camadas externas. Os textos de 1, 2 e 3 são descritivos, escritos por aqui; só "miolo polímero" veio da Lesco.',
      /* Sem título grande, como no blueprint: o eyebrow à esquerda, o produto
         à direita, e o desenho ficando com toda a altura que sobra. */
      eyebrow: 'O material',
      produto: 'Brise 25x50 Red Cedar',

      /* Layout próprio desta apresentação, em animacoes.js: o desenho pede a
         largura inteira do slide para os quatro balões caberem em volta. */
      svg: 'camadas-revestimento',
      alt: 'O perfil de revestimento aberto em quatro camadas, em vista isométrica',
      note: 'Animação interativa das camadas — ver animacoes.js.',

      /* A barra se reparte por estas porcentagens — mexer no número mexe na
         largura. O blueprint escrevia "HPDE"; aqui está HDPE, que é como se
         chama o polietileno de alta densidade. */
      composicao: [
        { pct: 55, nome: 'pó de madeira', cor: '#ba9e7b', texto: '#5d4f3e' },
        { pct: 35, nome: 'HDPE',          cor: '#ba7154', texto: '#efbeaa' },
        { pct: 10, nome: 'aditivos',      cor: '#d9d9d9', texto: '#3a3a3a' }
      ]
    },

    {
      layout: 'detail',
      label: 'O sistema · o painel',
      notes: 'O porta-painel foi desenvolvido pela ModularKit com o espaçamento já pré-determinado. A equipe não mede peça por peça, não faz gabarito e não usa trena. Isso reduz erro e pode triplicar a velocidade de instalação — é o que garante as lojas prontas ainda este ano.',
      eyebrow: 'O sistema',
      title: 'Instalação até\n3x mais rápida',
      text: 'O espaçamento não é marcado em obra: ele já está no porta-painel. Sem gabarito, sem trena.',
      denso: true,

      media: {
        svg: 'painel-montagem',
        alt: 'A cremalheira recebendo os brises, um a um, no espaçamento de fábrica',
        note: 'Animação das camadas — ver painelMontagem em animacoes.js.'
      },

      passos: [
        { label: 'Cremalheiras no prumo', text: 'Superior, básicas e inferior, conforme o executivo.' },
        { label: 'Brises encaixam',       text: 'Cada peça cai no próprio recorte. Nada a medir.' },
        { label: 'Mesmo acabamento',      text: 'Menos erro, e o mesmo resultado em todas as obras.' }
      ]
    },

    /* ===================================================================
       03 · O QUE VAI PARA A OBRA
       =================================================================== */

    {
      layout: 'specs',
      label: 'Produtos do projeto',
      notes: 'Os brises foram projetados junto com a arquitetura da Decathlon. Não é um projeto só do Brasil: é referência estética para as lojas no mundo todo. Nas lojas internas de shopping o revestimento fechado 217x35 é parafusado pelo negativo, e a próxima peça cobre a fixação.',
      eyebrow: 'Produtos do projeto',
      title: 'Padrão mundial\nDecathlon',
      rows: [
        ['Fachadas',          'Brise 25x50 e 25x75'],
        ['Cor',               'Red Cedar'],
        ['Lojas de shopping', 'Revestimento fechado 217x35'],
        ['Fixação do 217x35', 'Parafusado pelo negativo']
      ],
      figure: 'img/obra/brise-cremalheira.png',
      figureAlt: 'Dois brises apoiados sobre as cremalheiras de fixação'
    },

    {
      layout: 'prancha',
      label: 'Projetos executivos',
      notes: 'Os projetos executivos já foram entregues. Estão divididos por quantidade de painéis e por tipo de aplicação — alvenaria ou metálica — e os acabamentos estão descritos onde necessário. Insistir: nada se resolve em obra sem olhar a prancha.',
      eyebrow: 'Projetos executivos',
      title: 'O executivo é a\nreferência da obra',
      text: 'Painel tipo 02 · 525 × 4180 mm · 2,19 m²',

      /* A prancha foi redesenhada em vetor, sem nenhum texto dentro — cota,
         rótulo e quantitativo saíram para esta coluna. Ver animacoes.js. */
      svg: 'painel-executivo',
      alt: 'Alçado do painel tipo 02: os seis brises, as sete cremalheiras e os perfis em elevação',

      quantitativoTitulo: 'Quantitativo do painel',
      quantitativo: [
        ['Brise 50×25',            '3'],
        ['Brise 75×25',            '3'],
        ['Cremalheira superior A', '1'],
        ['Cremalheira básica B',   '5'],
        ['Cremalheira inferior C', '1'],
        ['Parafusos',             '84']
      ],

      note2: 'Cremalheiras a cada 670 · 700 · 700 · 700 · 700 · 670 mm.'
    },

    {
      layout: 'split',
      label: 'Arremates e proteção',
      notes: 'Primeiro e último porta-painel com medida diferenciada, formando uma tampa ou calha de proteção contra bichos, insetos, chuva e água. As tampas superiores e inferiores e as laterais têm arremates específicos, de acordo com cada obra.',
      eyebrow: 'Arremates e proteção',
      title: 'Acabamento previsto\nem cada detalhe',
      text: 'O primeiro e o último porta-painel têm medida diferenciada e formam uma calha de proteção. As peças iniciais superiores e inferiores vêm prontas da ModularKit, pontuadas em planta.',
      rows: [
        ['Tampa superior', 'Arremate específico'],
        ['Tampa inferior', 'Arremate específico'],
        ['Laterais',       'Conforme a particularidade de cada obra']
      ],
      note: 'A calha protege o brise contra insetos, animais, chuva e água.'
    },

    /* ===================================================================
       04 · O QUE MAIS GERA DÚVIDA EM OBRA
       =================================================================== */

    {
      layout: 'detail',
      label: 'Dilatação',
      notes: 'A madeira ecológica não é um material que todo mundo sabe trabalhar: ela tem um percentual de dilatação e dilata ao longo do dia. O sistema já prevê as folgas e trabalha com furos oblongos. Folga e espaçamento fazem parte do sistema — não são defeito.',
      eyebrow: 'Dilatação',
      title: 'Folga é parte\ndo sistema',
      text: 'A peça trabalha ao longo do dia. O sistema já nasce com o espaço para isso.',
      denso: true,

      media: {
        src: 'img/obra/porta-painel-furo.png',
        alt: 'Porta-painel parafusado, com o furo oblongo que deixa a peça trabalhar',
        focal: '55% 45%'
      },

      passos: [
        { label: 'Amplitude térmica', text: 'A madeira ecológica dilata com a variação de temperatura.' },
        { label: 'Folgas previstas',  text: 'O espaço entre perfis já vem projetado no sistema.' },
        { label: 'Furos oblongos',    text: 'Ajuste milimétrico em obra, sem empenar nem desalinhar.' }
      ]
    },

    {
      layout: 'half',
      label: 'Variação entre peças',
      notes: 'Por ser extrudado e depois resfriado, o material pode variar cerca de 1 mm entre peças. Se for necessário um encontro de 45 graus ou outro acabamento não previsto, o corte deve ser feito com a mesma peça — assim a medida é a mesma dos dois lados e o acabamento fecha.',
      eyebrow: 'Variação entre peças',
      title: 'Cortes de encontro\ncom a mesma peça',
      text: 'Extrudado e resfriado, o material varia cerca de 1 mm entre peças. Em encontro a 45°, corte os dois lados da mesma peça.',
      media: {
        src: 'img/obra/encontro-45.png',
        alt: 'Encontro de brises na quina da fachada',
        focal: '50% 50%'
      },
      destaques: ['± 1 mm entre peças'],
      reverse: true
    },

    {
      /* `detail`, e não `split`: o split não renderiza media, então o
         desenho ficaria escrito aqui sem nunca aparecer. O 2 cm sai da
         tabela e vira destaque — uma linha sozinha numa tabela não é
         tabela, é um número. */
      layout: 'detail',
      label: 'Escoamento de água',
      notes: 'Deixar 2 cm entre o brise e a face inferior para a água escoar. A medida vinha marcada como "confirmar" no PowerPoint original e foi fechada em 28/10/2026. O desenho é um detalhe do pé do painel, em escala real: em escala do painel inteiro, 2 cm contra 4180 de altura não se enxergaria.',
      eyebrow: 'Escoamento de água',
      title: 'Espaço livre na\nface inferior',
      text: 'A água precisa de caminho para sair.',
      denso: true,

      media: {
        svg: 'escoamento-inferior',
        alt: 'Detalhe do pé do painel: o brise, o arremate inferior e a folga até a face de baixo'
      },

      passos: [
        { label: 'Pé do painel',  text: 'O arremate inferior fecha o brise e vira calha.' },
        { label: 'Espaço livre',  text: 'A folga entre o arremate e a face de baixo.' },
        { label: 'Sem acúmulo',   text: 'A água escoa em vez de empoçar no pé.' }
      ],

      destaques: ['2 cm mínimo na face inferior']
    },

    /* ===================================================================
       FECHAMENTO
       =================================================================== */

    {
      layout: 'checklist',
      label: 'Checklist de instalação',
      notes: 'Resumo do que não pode faltar em nenhuma obra. Dizer que este slide vai impresso para o canteiro — é o que a equipe consulta sem precisar abrir a apresentação.',
      eyebrow: 'Resumo',
      title: 'Checklist de\ninstalação',
      items: [
        'Conferir a fixação no executivo',
        'Respeitar o espaçamento do porta-painel',
        'Manter as folgas de dilatação',
        'Cortes de encontro com a mesma peça',
        'Porta-painel na cor do fundo',
        'Escoamento livre na face inferior',
        'Arremates conforme a planta'
      ]
    },

    {
      layout: 'outro',
      label: 'Encerramento',
      notes: 'Fechamento: contato do departamento de Engenharia interno, com a Nataly. PENDENTE: preencher o telefone comercial e confirmar o domínio do e-mail.',
      title: 'Dúvida em obra?\nFale com a gente.',
      left: 'Departamento de Engenharia Lesco\nNataly Rempel · 47 99954-3606',
      right: 'engenharia@lesco.com.br\nAntes de improvisar, consulte o time técnico.'
    }

  ]
};
