/* ===========================================================================
   LIVE TÉCNICA · INSTALAÇÃO DE ESTRUTURAS

   Este é o único arquivo que você precisa editar para mudar a apresentação.
   Cada objeto da lista `slides` é um slide.

   Campos comuns a todos os slides
     layout      qual dos 13 modelos usar (ver a lista abaixo)
     label       nome do slide na grade (tecla G)
     notes       notas do apresentador (tecla N) — não aparecem na projeção
     tone        'paper' (claro, padrão) ou 'ink' (grafite)
     transition  opcional: 'curtain' | 'mask' | 'stagger' | 'push' | 'fade'
     drift       true para a foto respirar devagar durante o slide

   Layouts disponíveis
     cover      capa                        index      sumário numerado
     chapter    abertura de projeto         split      texto + tabela
     stats      três números grandes        specs      ficha técnica
     photo      foto de página inteira      duo        título + duas fotos
     detail     foto grande + texto         half       texto + foto sangrando
     checklist  lista numerada              cards      três cards com imagem
     outro      encerramento

   Fotos
     Um objeto de foto aceita { src, alt, focal, note, draw }.
       src    caminho relativo a esta pasta
       alt    descrição da imagem
       focal  ponto focal do corte, ex.: '50% 55%'
       note   texto do espaço reservado quando ainda NÃO existe `src`
       draw   true quando é desenho técnico: aparece inteiro, sem corte
     Para preencher um espaço reservado, acrescente `src` ao lado do `note`.

   Chamada sobre a foto
     Aponta um ponto da foto e liga, por um fio em cotovelo, a um quadro
     branco com a peça isolada — como numa prancha de detalhe:
       chamada: { src, alt, alvo, cotovelo, caixa, largura }
       alvo      o ponto apontado, ex.: '19% 8%'
       cotovelo  onde o fio dobra para descer, ex.: '55%'
       caixa     canto superior esquerdo do quadro, ex.: '31% 51%'
       largura   largura do quadro, ex.: '47%'
     Tudo em porcentagem da foto. Funciona no layout `photo`; se o slide
     tiver eyebrow ou title, a legenda passa por cima do quadro.

   Vídeo
     No lugar de `src`, use { video, poster, alt }. O vídeo entra mudo e em
     laço, toca sozinho ao chegar no slide e para ao sair. `poster` é a foto
     que aparece antes de tocar — e é ela que sai na exportação em PDF.

   Quebra de linha em títulos: use \n.

   Desenhos
     Os desenhos vetoriais ficam em drawings.js, ao lado deste arquivo, e são
     chamados por  media: { svg: 'nome' }.

     Em img/tec, os renders de perfil e os esquemas de montagem vieram
     prontos, já com canal alfa. Os demais são recortes de documentos da
     Lesco, com o fundo branco removido para comporem com a superfície clara
     do slide:
       muxarabi-horizontais   Lesco-Instruções-muxarabi, pág. 7
       muxarabi-verticais     idem, pág. 8
       colagem-encaixe.png    idem, pág. 11
       colagem-montado.png    idem, pág. 11
       colagem-cola-lingueta  idem, pág. 10
       deck-camadas.png       CASA_ITA_DECK_EXECUTIVO_REV05, prancha MONTAGEM
       deck-paginacao.png     idem, planta de paginação
       deck-subestrutura.png  idem, planta da subestrutura
     Dos desenhos do executivo foi tirado o carimbo da prancha, que traz dados
     do cliente.
   ======================================================================== */

window.DECK = {
  id: 'instalacao-de-estruturas',
  title: 'Instalação de Revestimentos e Estruturas',
  subtitle: 'Cinco obras, cinco sistemas de fixação',

  slides: [

    /* ===================================================================
       ABERTURA
       =================================================================== */

    {
      layout: 'cover',
      label: 'Capa',
      notes: 'Abertura. Apresentar o tema e os cinco projetos que serão destrinchados.',
      eyebrow: 'Live técnica',
      sub: 'Da subestrutura ao acabamento final: como cada sistema se comporta em obra.',
      title: 'Instalação de\nrevestimentos\ne estruturas',
      footer: 'Cinco obras, cinco sistemas de fixação',

      /* Composição feita a partir dos desenhos técnicos da linha Shield
         (PDFs vetoriais em _source/shield). O traço preto foi convertido
         em traço claro com transparência, então a arte já compõe sobre o
         grafite. A metade esquerda foi deixada livre para a tipografia. */
      background: {
        src: 'img/capa-shield.webp',
        alt: 'Desenhos isométricos de montagem e detalhe de encaixe',
        focal: '50% 50%',
        overlay: 'left'
      }
    },

    {
      layout: 'index',
      label: 'Os cinco projetos',
      notes: 'Roteiro da live. Cada projeto entra por um sistema diferente de fixação.',
      title: 'Os cinco\nprojetos',
      items: [
        { name: 'Ekos Saúde Integrativa', apoio: 'Brise fixo de fachada',   tag: 'Florianópolis · SC' },
        { name: 'Residencial',            apoio: 'Brise pivotante',         tag: 'Campinas · SP' },
        { name: 'Salt',                   apoio: 'Muxarabi modular',        tag: 'Itajaí · SC' },
        { name: 'Casa Ita',               apoio: 'Deck sobre subestrutura', tag: 'São Paulo · SP' },
        { name: 'Amira',                  apoio: 'Panel aplicado em forro', tag: 'Curitiba · PR' }
      ]
    },

    /* ===================================================================
       01 · EKOS SAÚDE INTEGRATIVA — brises

       As fotos mostram lâminas verticais de seção variável, ancoradas em
       suportes metálicos presos à estrutura da fachada. Os títulos desta
       seção foram escritos a partir do que aparece nas fotos — confira os
       termos técnicos antes da live.
       =================================================================== */

    {
      layout: 'chapter',
      label: '01 · Ekos — abertura',
      notes: 'Abre o primeiro projeto. Clínica no Campeche, brises em fachada.',
      num: '01',
      eyebrow: 'Lesco Green Brise',
      title: 'Ekos Saúde\nIntegrativa',
      footer: 'Florianópolis · SC\nBrise vertical de grande vão aplicado sobre fachada.',
      background: {
        src: 'img/ekos/e04.webp',
        alt: 'Fachada da clínica com os brises verticais em sequência',
        focal: '62% 50%'
      }
    },

    {
      layout: 'specs',
      label: 'Ekos — ficha técnica',
      notes: 'Ficha técnica. Perfil 250 × 50 e acabamento escovado na cor Teak.',
      eyebrow: 'Ekos Saúde Integrativa',
      title: 'Ficha técnica',
      rows: [
        ['Sistema',           'Lesco Green Brise'],
        ['Perfil',            '250 × 50 mm'],
        ['Acabamento',        'Escovado · cor Teak'],
        ['Subestrutura',      'Alma de aço inox interna'],
        ['Área aplicada',     '400,85 m²'],
        ['Prazo de montagem', '40 dias']
      ],
      figure: 'img/tec/brise-250x50.webp',
      figureAlt: 'Perfil brise 250 × 50 mm'
    },

    {
      layout: 'detail',
      label: 'Ekos — ancoragem no concreto',
      notes: 'Primeira etapa. Em cima, a foto da fachada com os tubos e os braços de ancoragem; embaixo, o render do suporte em detalhe — as duas que o documento pede para este slide. O componente de fixação ainda não pode ser nomeado: o documento marca [CONFIRMAR]. A terceira imagem, o render com legendas, segue fora: a legenda dela diz "tubo de aço galvanizado" e o slide seguinte fecha em inox.',
      media: [
        {
          src: 'img/ekos/suportes-fachada.webp',
          alt: 'Fachada envidraçada com os tubos verticais e os braços de ancoragem',
          focal: '50% 50%'
        },
        {
          src: 'img/tec/ekos-suporte.webp',
          alt: 'Render do suporte metálico de ancoragem do brise',
          draw: true
        }
      ],
      eyebrow: 'Primeira etapa',
      title: 'Ancoragem\nno concreto',
      text: 'A instalação começa pela definição e alinhamento dos pontos de ancoragem. É essa estrutura que recebe o conjunto e garante a posição final das lâminas.',
      passos: [
        { label: 'Base / suporte metálico' },
        { label: 'Fixação na estrutura existente' },
        { label: 'Perfil de apoio' },
        { label: 'Brise' }
      ]
    },

    {
      layout: 'detail',
      label: 'Ekos — o tubo por dentro',
      notes: 'O reforço interno da Ekos, em INOX. O tubo saiu de dentro da foto e virou medalhão ao lado dela, ligado por um fio ao ponto de onde sai. A foto é a e02 original, sem a composição; o tubo solto está em img/ekos/tubo.webp. A composição antiga segue em img/ekos/alma-de-aco.webp, fora do deck.',
      media: {
        src: 'img/ekos/e02.webp',
        alt: 'Lâminas da fachada com os suportes de ancoragem',
        focal: '50% 42%'
      },
      medalhao: {
        src: 'img/ekos/tubo.webp',
        alt: 'Tubo de inox que percorre o interior do brise',
        ponto: '51%',
        altura: '22%'
      },
      denso: true,
      eyebrow: 'Reforço interno',
      title: 'O tubo\npor dentro',
      text: 'Em vãos sem fixação intermediária, o perfil recebe um reforço estrutural interno. Na Ekos, esse reforço percorre o interior do brise, que faz com que o perfil não empene ao longo do tempo.',
      passos: [
        { label: 'Perfil externo', text: 'Lesco Green Brise' },
        { label: 'Reforço interno', text: 'Tubo em inox' },
        { label: 'Função', text: 'Estrutural' }
      ]
    },

    {
      layout: 'detail',
      label: 'Ekos — como a lâmina é travada',
      notes: 'Segunda etapa. Em cima, os módulos girando em torno do tubo interno, cada um parafusado nele. Embaixo, o corte do perfil — a versão limpa, sem nenhum número impresso. A Ekos é 250 × 50: a ficha de produto que circulava junto trazia 200 × 50, e não era só a etiqueta, eram as cotas e o peso do perfil errado. Por isso ela está fora do deck e precisa ser refeita na origem. A versão do desenho de rotação com legendas segue parada em img/tec pelo mesmo tipo de conflito: a legenda fala em aço galvanizado e o slide 8 fecha em inox.',
      media: [
        {
          src: 'img/tec/ekos-rotacao.webp',
          alt: 'Módulos do brise girando em torno do tubo interno, cada um parafusado nele',
          draw: true
        },
        {
          src: 'img/tec/ekos-corte-perfil.webp',
          alt: 'Corte do perfil com o tubo interno na câmara central',
          draw: true
        }
      ],
      eyebrow: 'Segunda etapa',
      title: 'Como a lâmina\né travada',
      passos: [
        { label: 'Posicionamento', text: 'Lâmina alinhada com os suportes.' },
        { label: 'Fixação', text: 'Perfil preso aos pontos previamente definidos.' },
        { label: 'Conferência', text: 'Prumo, alinhamento e repetição do módulo.' }
      ]
    },

    {
      layout: 'duo',
      label: 'Ekos — a lâmina sobe',
      notes: 'Entre a primeira e a segunda etapa: com a espera pronta, a lâmina sobe inteira pela fachada, com o balancim ao lado.',
      title: 'A lâmina sobe inteira',
      sub: 'Montagem vertical em peça contínua. Após a preparação das ancoragens, as lâminas são posicionadas verticalmente e conduzidas até seus pontos de fixação.',
      media: [
        { src: 'img/ekos/e08-icamento.webp', alt: 'Lâmina sendo içada rente à fachada, com o balancim ao lado' },
        { src: 'img/ekos/e09-lamina-na-obra.webp', alt: 'Lâmina posicionada na fachada de concreto, prédio em obra' }
      ]
    },

    {
      layout: 'photo',
      label: 'Ekos — a obra em movimento',
      notes: 'Vídeo grande, sem texto. Entra tocando, mudo e em laço; os controles ficam à mão para pausar ou ligar o som.',
      video: 'video/ekos-montagem.mp4',
      poster: 'img/ekos/e09-lamina-na-obra.webp',
      alt: 'Vídeo da fachada em obra, com uma lâmina já instalada',
      eyebrow: 'Em movimento',
      title: 'A obra em movimento'
    },

    {
      layout: 'detail',
      label: 'Ekos — fixação na estrutura',
      notes: 'Zoom da conexão. [CONFIRMAR] especificação do suporte com a Louise antes da live. A segunda foto da fachada continua disponível em img/ekos/e02.webp.',
      media: { src: 'img/ekos/e03.webp', alt: 'Suporte metálico prendendo a lâmina, visto de perto', focal: '50% 35%' },
      eyebrow: 'Conexão',
      title: 'Fixação\nna estrutura',
      text: 'Cada lâmina trabalha conectada à estrutura da edificação por suportes metálicos, mantendo o brise afastado da pele da fachada.',
      passos: [
        { label: 'Suporte metálico' },
        { label: 'Fixação na estrutura' },
        { label: 'Lâmina do brise' },
        { label: 'Afastamento da fachada' }
      ]
    },

    {
      layout: 'duo',
      label: 'Ekos — ritmo na fachada',
      notes: 'O conjunto ao longo da fachada e, ao lado, a peça de perto. É aqui que se vê o sombreamento e, na foto da direita, como a lâmina é empilhada.',
      title: 'O ritmo na fachada',
      sub: 'A repetição das lâminas cria profundidade, controle solar e ritmo visual. A precisão do alinhamento da subestrutura é o que permite que esse efeito se mantenha ao longo de toda a fachada.',
      media: [
        { src: 'img/ekos/e04.webp', alt: 'Sequência de lâminas ao longo da fachada', focal: '50% 45%' },
        { src: 'img/ekos/e07.webp', alt: 'Empilhamento das peças que forma a torção da lâmina', focal: '50% 50%' }
      ]
    },

    {
      layout: 'photo',
      label: 'Ekos — topo da lâmina',
      title: 'Detalhe do perfil',
      notes: 'Contra-plongée no topo. Mostra os cortes que permitem a peça abrir a curva. Bom momento de pausa antes do detalhe.',
      src: 'img/ekos/e06.webp',
      alt: 'Topo da lâmina visto de baixo, com os cortes que formam a curva',
      focal: '50% 45%',
      drift: true
    },

    {
      layout: 'photo',
      label: 'Ekos — fachada pronta',
      title: 'Resultado final',
      notes: 'Terceira e última etapa: o projeto pronto. Todo case fecha no local finalizado. Depois do detalhe, a fachada inteira — o ritmo das lâminas e a seção que vai afinando ao longo da altura.',
      src: 'img/ekos/e01.webp',
      alt: 'Fachada do Ekos com as lâminas verticais instaladas',
      focal: '50% 50%',
      drift: true
    },

    /* ===================================================================
       02 · ALLA — brise pivotante
       =================================================================== */

    {
      layout: 'chapter',
      label: '02 · Alla — abertura',
      notes: 'Segundo projeto: brise pivotante. O único sistema com peça móvel.',
      num: '02',
      eyebrow: 'Brise pivotante',
      title: 'Residencial',
      footer: 'Campinas · SP\nDo reforço interno ao sistema de giro.',
      background: {
        src: 'img/ala/abertura.webp',
        alt: 'Fachada do residencial com as folhas pivotantes em madeira, ao fim da tarde',
        focal: '52% 54%'
      }
    },

    {
      layout: 'specs',
      label: 'Alla — ficha técnica',
      notes: 'Ficha técnica do pivotante, com as mesmas linhas do Ekos. O perfil é o brise 200 × 50 da linha. Para falar de boca: a folha móvel leva alma de aço dentro da câmara central, que é o que dá rigidez ao painel — a linha saiu da ficha para manter o padrão do Ekos, e as fotos de fábrica estão fora do deck por ora.',
      eyebrow: 'Alla',
      title: 'Ficha técnica',
      rows: [
        ['Sistema',           'Brise pivotante'],
        ['Perfil',            '200 × 50 mm'],
        ['Acabamento',        'Escovado · cor Red Cedar'],
        ['Subestrutura',      'Perfis de alumínio interno'],
        ['Área aplicada',     '198,40 m²'],
        ['Prazo de montagem', '40 dias']
      ],
      figure: 'img/tec/brise-200x50.webp',
      figureAlt: 'Perfil brise 200 × 50 mm'
    },

    {
      layout: 'cards',
      label: 'Alla — sequência de montagem',
      notes: 'Sequência da Alla — não é a da Ekos, que vai de ancoragem, tubo interno e travamento. Correção do documento de alterações: NÃO foi usada barra chata; o fechamento é por tampa em inox integrada ao sistema pivotante. Falta anexar o detalhamento da Bruna.',
      eyebrow: 'Como se monta',
      title: 'Três tempos',
      sub: 'Primeiro sobe o metal, depois entram os perfis, e a tampa em inox fecha a unidade.',
      items: [
        {
          label: 'Subestrutura',
          text: 'Estrutura metálica recebe o conjunto.',
          src: 'img/tec/montagem-1-subestrutura.webp',
          alt: 'Tubos metálicos verticais da subestrutura'
        },
        {
          label: 'Encaixe dos perfis',
          text: 'Os perfis Lesco Green Brise são posicionados na estrutura.',
          src: 'img/tec/montagem-2-encaixe.webp',
          alt: 'Perfis entrando sobre os tubos metálicos'
        },
        {
          label: 'Fechamento',
          text: 'Tampas sob medida em inox, integradas ao sistema pivotante, fecham a unidade.',
          src: 'img/tec/alla-tampa-inox.webp',
          alt: 'Tampa em inox com o pino do sistema pivotante'
        }
      ]
    },

    {
      layout: 'detail',
      label: 'Alla — reforço interno',
      notes: 'O reforço pode ser em aço ou em alumínio, perfil U ou quadrado — depende do vão e do sistema. Por isso o título deixou de falar em alma de aço.',
      media: {
        src: 'img/tec/alma-de-aco-esquema.webp',
        alt: 'Corte do perfil com o reforço interno inserido na câmara central',
        draw: true
      },
      eyebrow: 'Reforço',
      title: 'Reforço\ninterno',
      text: 'Quando não existem pontos intermediários de fixação, o perfil pode receber um reforço interno dimensionado de acordo com o vão e com o sistema.'
    },

    {
      layout: 'cards',
      label: 'Alla — processo de colagem',
      notes: 'Passo a passo da colagem, do detalhamento da Bruna. O adesivo é PU de alto desempenho e a cura leva 24 h sob pressão — é o número que vale repetir na fala.',
      eyebrow: 'Fabricação',
      title: 'Processo de colagem',
      items: [
        {
          label: 'Preparação',
          text: 'Peças limpas, lado a lado, seguindo os veios da madeira.',
          src: 'img/tec/alla-colagem-1-perfis.webp',
          alt: 'Perfis alinhados lado a lado antes da colagem'
        },
        {
          label: 'Adesivo',
          text: 'Poliuretano (PU) de alto desempenho, aplicado nas laterais de contato.',
          src: 'img/tec/alla-colagem-2-adesivo.webp',
          alt: 'Aplicação do adesivo PU na lateral de contato'
        },
        {
          label: 'Prensagem',
          text: 'Perfis unidos e travados com grampos.',
          src: 'img/tec/alla-colagem-3-grampos.webp',
          alt: 'Perfis unidos e travados com grampos'
        },
        {
          label: 'Cura',
          text: 'Conjunto mantido sob pressão por 24 h antes da movimentação.',
          src: 'img/tec/alla-colagem-4-cura.webp',
          alt: 'Conjunto em cura, mantido sob pressão'
        }
      ],
      destaques: ['Adesivo PU', 'Tempo de cura: 24 horas']
    },

    {
      layout: 'duo',
      label: 'Alla — abertura e giro',
      notes: 'Planta do giro à esquerda — folha em três posições em torno do eixo, com o arco tracejado. À direita, a tampa retangular em inox com pivô central. Sem cota de ângulo, por decisão do documento de alterações. Faltam anexar as fotos e os detalhes da Bruna sobre o giro.',
      eyebrow: 'Giro',
      title: 'Abertura e giro',
      sub: 'O ângulo de abertura é definido pelo cliente: o sistema pode ser fixo ou móvel. A tampa em inox é feita sob medida, conforme o peso de cada módulo. Depois da instalação, cada folha é testada individualmente: giro, alinhamento, folgas e batentes.',
      media: [
        { src: 'img/tec/alla-giro-planta.webp', alt: 'Planta do giro: a folha em três posições em torno do eixo', draw: true },
        { src: 'img/tec/alla-tampa-pivo.webp', alt: 'Tampa retangular em inox com pivô central', draw: true }
      ]
    },

    {
      layout: 'photo',
      label: 'Alla — conjunto',
      eyebrow: 'Alla',
      title: 'Conjunto montado antes da regulagem final do sistema de giro',
      notes: 'O conjunto instalado, ainda antes da regulagem do giro. Painéis pivotantes fechados na fachada.',
      src: 'img/ala/a07.webp',
      alt: 'Painéis pivotantes instalados na fachada',
      drift: true
    },

    {
      layout: 'photo',
      label: 'Alla — as folhas na fachada',
      notes: 'Uma imagem só, centralizada. A vista interna continua disponível em img/ala/a01.webp.',
      src: 'img/ala/a06.webp',
      alt: 'Painéis vistos de fora, com a sombra projetada na fachada',
      focal: '50% 50%',
      eyebrow: 'Alla',
      title: 'As folhas na fachada',
      drift: true
    },

    {
      layout: 'photo',
      label: 'Alla — resultado',
      notes: 'Resultado. Fechamento do segundo projeto.',
      src: 'img/ala/a03.webp',
      alt: 'Conjunto pivotante finalizado',
      focal: '50% 55%',
      drift: true
    },

    /* ===================================================================
       03 · SALT PRAIA BRAVA — muxarabi
       =================================================================== */

    {
      layout: 'chapter',
      label: '03 · Salt — abertura',
      notes: 'Terceiro projeto: muxarabi em fachada de torre. Trabalho em altura.',
      num: '03',
      eyebrow: 'Lesco Green Muxarabi',
      title: 'Salt\nPraia Brava',
      footer: 'Praia Brava · Itajaí · SC',
      background: {
        src: 'img/salt2/t02.webp',
        alt: 'Vista aérea do embasamento revestido em muxarabi, entre os prédios vizinhos',
        focal: '52% 48%'
      }
    },

    {
      layout: 'specs',
      label: 'Salt — ficha técnica',
      notes: 'Ficha técnica. O muxarabi é montado a partir do brise 50 × 25 da linha Origens. Nesta obra o módulo é o de 100 mm e a subestrutura é de alumínio — os três módulos da linha aparecem no slide seguinte, que fala do produto, não deste projeto.',
      eyebrow: 'Salt Praia Brava',
      title: 'Ficha técnica',
      rows: [
        ['Sistema',           'Lesco Green Muxarabi'],
        ['Perfil base',       'Brise 50 × 25 mm'],
        ['Módulo',            '100 mm'],
        ['Subestrutura',      'Alumínio'],
        ['Área aplicada',     '355 m²'],
        ['Prazo de montagem', '30 dias']
      ],
      figure: 'img/tec/muxarabi-100.webp',
      figureAlt: 'Módulo muxarabi 100 × 100 mm'
    },

    {
      layout: 'cards',
      label: 'Salt — módulos',
      notes: 'Os três módulos disponíveis. Fica logo depois da ficha técnica: é informação de produto, não de obra.',
      title: 'Módulos do muxarabi',
      sub: 'Um mesmo perfil-base permite diferentes níveis de abertura da trama.',
      items: [
        { label: '50 mm',  src: 'img/tec/muxarabi-50.webp',  alt: 'Módulo muxarabi 50 mm' },
        { label: '100 mm', src: 'img/tec/muxarabi-100.webp', alt: 'Módulo muxarabi 100 mm' },
        { label: '150 mm', src: 'img/tec/muxarabi-150.webp', alt: 'Módulo muxarabi 150 mm' }
      ]
    },

    {
      layout: 'half',
      label: 'Salt — a torre',
      notes: 'A peça inteira no edifício: a trama cobre o embasamento e acompanha a curva da empena.',
      eyebrow: 'Salt Praia Brava',
      title: 'A trama na torre',
      text: 'A trama acompanha a fachada curva sobre uma subestrutura metálica independente. A leitura final depende da continuidade dos módulos e da manutenção do alinhamento entre peças.',
      media: { src: 'img/salt2/t10.webp', alt: 'Torre do Salt Praia Brava com o muxarabi no embasamento', focal: '50% 58%' }
    },

    {
      layout: 'photo',
      label: 'Salt — vista aérea',
      eyebrow: 'Aplicação contínua no embasamento',
      title: '355 m² de muxarabi',
      notes: 'Vista aérea. Dá a dimensão real da área revestida.',
      src: 'img/salt2/t02.webp',
      alt: 'Vista aérea do muxarabi aplicado',
      drift: true
    },

    {
      layout: 'duo',
      label: 'Salt — trabalho em altura',
      notes: 'Montagem feita de balancim e plataforma. Logística e segurança são parte do prazo.',
      title: 'Montagem em altura',
      sub: 'A trama é montada a partir de balancim e plataforma elevatória, módulo por módulo.',
      media: [
        { src: 'img/salt2/t01.webp', alt: 'Montagem da trama a partir do balancim' },
        { src: 'img/salt2/t04.webp', alt: 'Plataforma elevatória junto à fachada', focal: '50% 45%' }
      ]
    },

    {
      layout: 'duo',
      label: 'Salt — subestrutura',
      notes: 'Foto e desenho lado a lado. Os montantes recebem pintura escura para sumir atrás da malha — dá para apontar isso na foto. Números conferidos no manual de instalação do muxarabi: sequência na pág. 6, regra dos 0,75 m na pág. 4.',
      title: 'Subestrutura metálica',
      sub: 'A subestrutura de alumínio sobe primeiro, toda na vertical: um perfil a cada 0,75 m, duplo no início e no fim de cada módulo de 3,00 m.',
      media: [
        { src: 'img/salt2/t06.webp', alt: 'Montantes metálicos vistos por dentro' },
        {
          svg: 'muxarabi-estrutura',
          alt: 'Isométrico do módulo de 3,00 m com os perfis de alumínio verticais a cada 0,75 m'
        }
      ]
    },

    {
      layout: 'detail',
      label: 'Salt — passo 1 · perfis horizontais',
      notes: 'Passo 1 do manual. Falta anexar os detalhamentos de fixação da Bruna; o resto do slide fica como está.',
      media: {
        src: 'img/tec/muxarabi-horizontais.webp',
        alt: 'Perfis do muxarabi na horizontal, parafusados sobre os montantes de alumínio',
        focal: '50% 50%'
      },
      eyebrow: 'Passo 1',
      title: 'Perfis\nhorizontais',
      text: 'Com a estrutura vertical de alumínio já montada e devidamente alinhada, fixe os perfis Muxarabi na posição horizontal sobre os montantes. Utilize parafusos brocantes em inox, garantindo firmeza, alinhamento e estabilidade do conjunto.'
    },

    {
      layout: 'detail',
      label: 'Salt — passo 2 · perfis verticais',
      notes: 'Passo 2 do manual. Os verticais fecham o desenho do muxarabi; os encontros levam cola e lingueta. Os dois detalhes no alto do desenho mostram a lingueta de união. Desenho da pág. 8 do manual.',
      media: {
        src: 'img/tec/muxarabi-verticais.webp',
        alt: 'Perfis do muxarabi na vertical formando a malha do muxarabi, com detalhes da lingueta de união',
        focal: '50% 50%'
      },
      eyebrow: 'Passo 2',
      title: 'Perfis\nverticais',
      text: 'Após a fixação de todos os perfis horizontais, instale os perfis na posição vertical, formando o desenho do Muxarabi. Os encontros entre as peças devem ser travados com cola nos encaixes e lingueta de união, assegurando melhor fixação, acabamento uniforme e maior estabilidade do módulo.'
    },

    {
      layout: 'detail',
      label: 'Salt — encaixe',
      notes: 'Corte ampliado da malha. A medida da folga está [CONFIRMAR] — sem ela, não cotar no slide. Falta anexar o detalhamento da Bruna.',
      media: { src: 'img/salt2/t07.webp', alt: 'Detalhe do encaixe da trama no montante' },
      title: 'Encaixe\nda malha',
      text: 'A Lesco faz a paginação da malha, usina as peças e entrega os módulos prontos conforme cada projeto, cuidando dos detalhes de cada encontro.',
      passos: [
        { label: 'Perfil horizontal' },
        { label: 'Perfil vertical' },
        { label: 'Montante metálico' },
        { label: 'Ponto de fixação' },
        { label: 'Folga de movimentação' }
      ]
    },

    {
      layout: 'cards',
      label: 'Salt — travamento e cola',
      notes: 'Manual de instalação do muxarabi, págs. 10 e 11. Insistir na cura: não remover a lingueta antes das 24 horas e não forçar os módulos nesse período. Em dia frio ou úmido a cura demora mais — esperar a cola secar por completo.',
      eyebrow: 'Travamento dos módulos',
      title: 'Onde entra a cola',
      sub: 'A cola é aplicada nas áreas de contato da junta. O encaixe é imediatamente travado com a lingueta e mantido pressionado até a cura completa.',
      items: [
        {
          label: 'Cola nos encaixes',
          src: 'img/tec/colagem-encaixe.webp',
          alt: 'Encaixes dos perfis abertos, com os pontos de aplicação da cola'
        },
        {
          label: 'Encaixe fechado',
          src: 'img/tec/colagem-montado.webp',
          alt: 'Junta montada, com os pontos de cola nas travessas'
        },
        {
          label: 'Cola e lingueta',
          src: 'img/tec/colagem-cola-lingueta.webp',
          alt: 'Cola para madeira de secagem rápida e a lingueta de travamento'
        }
      ],
      destaques: ['Tempo de cura: 24 horas']
    },

    {
      layout: 'half',
      label: 'Salt — o projeto pronto',
      notes: 'A fachada concluída, vista da rua. Último slide do case — todo projeto fecha com o local pronto.',
      reverse: true,
      eyebrow: 'Salt Praia Brava',
      title: 'O projeto\npronto',
      text: 'O resultado final depende da repetição precisa dos módulos, da continuidade da trama e do alinhamento da subestrutura.',
      media: { src: 'img/salt/s3.webp', alt: 'Fachada concluída do Salt Praia Brava vista da rua', focal: '50% 45%' }
    },

    /* ===================================================================
       04 · CASA ITA — deck
       =================================================================== */

    {
      layout: 'chapter',
      label: '04 · Casa Ita — abertura',
      notes: 'Quarto projeto: deck. Barroteamento em steel frame e fixação por presilhas.',
      num: '04',
      eyebrow: 'Lesco Green Deck',
      title: 'Casa Ita',
      footer: 'São Paulo · SP\nDeck sobre laje e área externa.',
      background: {
        src: 'img/ita/abertura.webp',
        alt: 'Terraço concluído, com o deck corrido entre o guarda-corpo de vidro e a casa',
        focal: '55% 50%'
      }
    },

    {
      layout: 'specs',
      label: 'Casa Ita — ficha técnica',
      notes: 'Ficha técnica do deck. O perfil é o 150 × 22 e o 30 cm de barroteamento é o número crítico.',
      eyebrow: 'Casa Ita',
      title: 'Ficha técnica',
      rows: [
        ['Sistema',           'Lesco Green Deck'],
        ['Perfil',            '150 × 22 mm'],
        ['Barroteamento',     'Steel Frame'],
        ['Fixação',           'Presilha em inox'],
        ['Área aplicada',     '106 m²'],
        ['Prazo de montagem', '20 dias']
      ],
      figure: 'img/tec/deck-150x22.webp',
      figureAlt: 'Perfil deck 150 × 22 mm'
    },

    {
      layout: 'half',
      label: 'Casa Ita — o deck',
      notes: 'O deck pronto, para dar o destino antes de voltar ao início da obra.',
      eyebrow: 'Casa Ita',
      title: 'O ponto\nde chegada',
      text: 'O objetivo é um plano contínuo, com fixação oculta, paginação regular e caimento preservado pela estrutura inferior.',
      media: { src: 'img/ita/hub01-deck-concluido.webp', alt: 'Deck da Casa Ita concluído', focal: '50% 55%' }
    },

    {
      layout: 'detail',
      label: 'Casa Ita — camadas',
      notes: 'O sistema aberto em camadas, direto do projeto executivo (última página, prancha MONTAGEM). Confirmar a ordem de montagem antes da live.',
      media: {
        src: 'img/tec/deck-camadas.webp',
        alt: 'Vista explodida do deck: réguas, travessa, perfil barrote, perfil de borda e estrutura metálica',
        draw: true
      },
      eyebrow: 'Projeto executivo',
      title: 'O sistema\nem camadas',
      text: 'O executivo abre o deck camada por camada, de cima para baixo.',
      passos: [
        { label: 'Deck', text: 'Camada de acabamento superior, com as réguas do deck.' },
        { label: 'Travessa', text: 'Estrutura secundária logo abaixo do deck.' },
        { label: 'Perfil barrote', text: 'Perfis de apoio em steel frame, que recebem as travessas e fazem o barroteamento.' },
        { label: 'Perfil de borda', text: 'Elemento de fechamento e acabamento perimetral.' },
        { label: 'Estrutura metálica e minitrade', text: 'Base estrutural inferior que recebe todo o sistema.' }
      ]
    },

    {
      layout: 'duo',
      label: 'Casa Ita — paginação e subestrutura',
      notes: 'As duas plantas do executivo. A paginação define o sentido das réguas; a subestrutura, a malha por baixo. Prancha MONTAGEM, última página.',
      title: 'Primeiro se desenha.\nDepois se instala.',
      sub: 'Paginação, sentido das réguas e posição dos barrotes devem estar definidos antes do início da montagem.',
      media: [
        {
          src: 'img/tec/deck-paginacao.webp',
          alt: 'Planta de paginação do deck, escala 1/100',
          draw: true
        },
        {
          src: 'img/tec/deck-subestrutura.webp',
          alt: 'Planta da subestrutura, com travessas e barrotes, escala 1/100',
          draw: true
        }
      ]
    },

    {
      layout: 'detail',
      label: 'Casa Ita — ponto de partida',
      notes: 'CORREÇÃO DE CONTEÚDO: a laje NÃO foi impermeabilizada. É laje de estrutura metálica, isolada, preparada, medida e marcada antes de subir os perfis. O texto antigo falava em impermeabilização — não repetir na fala. As fotos i04 e i06 seguem em img/ita.',
      media: {
        src: 'img/ita/hub02-laje-preparada.webp',
        alt: 'Laje de estrutura metálica isolada e preparada, antes dos perfis do deck',
        focal: '50% 50%'
      },
      eyebrow: 'Antes de instalar',
      title: 'Ponto\nde partida',
      text: 'A laje precisa estar isolada, preparada, medida e marcada antes de subir os perfis da estrutura do deck.',
      passos: [
        { label: 'Laje isolada e preparada' },
        { label: 'Níveis conferidos' },
        { label: 'Paginação marcada' },
        { label: 'Drenagem e caimento verificados' }
      ]
    },

    {
      layout: 'duo',
      label: 'Casa Ita — barroteamento',
      notes: 'Barroteamento em steel frame a cada 30 cm. Este é o slide para insistir no passo. A estrutura da Casa Ita é toda em steel frame, da base ao barrote.',
      title: 'Barroteamento a cada 30 cm',
      sub: 'Perfis em steel frame no sentido oposto às réguas, nivelados e apoiados sobre calços.',
      media: [
        { src: 'img/ita/i12.webp', alt: 'Barrotes em steel frame posicionados' },
        { src: 'img/ita/i24.webp', alt: 'Barroteamento corrido, com o passo aparente' }
      ]
    },

    {
      layout: 'duo',
      label: 'Casa Ita — a malha',
      notes: 'Onde há dois sentidos de régua ou grandes vãos, a malha é duplicada. Mostrar o travamento.',
      title: 'Travamento e nível',
      sub: 'Seguir a paginação aprovada em projeto é o que garante o nível e o travamento de toda a extensão do deck.',
      media: [
        { src: 'img/ita/i25.webp', alt: 'Malha cruzada em montagem' },
        { src: 'img/ita/i27.webp', alt: 'Detalhe da malha cruzada' }
      ]
    },

    {
      layout: 'detail',
      label: 'Casa Ita — assentamento das réguas',
      notes: 'Foto nova, em alta, das réguas correndo sobre a estrutura. A hub03 que estava aqui segue em img/ita, junto com as antigas i29 e i32.',
      media: {
        src: 'img/ita/assentamento.webp',
        alt: 'Réguas assentadas correndo sobre a estrutura, com o barroteamento ainda aberto ao lado',
        focal: '50% 45%'
      },
      eyebrow: 'Assentamento',
      title: 'Assentamento\ndas réguas',
      text: 'Cada régua é travada por presilha na anterior, mantendo a folga constante ao longo de todo o plano.',
      passos: [
        { label: 'Régua' },
        { label: 'Presilha inox' },
        { label: 'Barrote' },
        { label: 'Junta constante' }
      ]
    },

    {
      layout: 'detail',
      label: 'Casa Ita — junta e fixação oculta',
      notes: 'A folga depende do comprimento das réguas: 3 a 5 mm nas laterais, mínimo de 5 mm nas emendas de topo. A foto é do clip de fixação Lesco, parafusado no barrote entre as peças.',
      media: {
        src: 'img/tec/deck-clip-fixacao.webp',
        alt: 'Clip de fixação Lesco, parafusado no barrote entre as réguas',
        draw: true
      },
      eyebrow: 'Detalhe',
      title: 'Junta e\nfixação oculta',
      passos: [
        { label: 'Junta entre réguas', text: 'Laterais: 3 a 5 mm. Emendas de topo: mínimo de 5 mm. A folga depende do comprimento das réguas.' },
        { label: 'Fixação oculta', text: 'Clip de fixação posicionado entre as peças.' },
        { label: 'Topo / borda', text: 'Arremate definido de acordo com o encontro do deck.' }
      ]
    },

    {
      layout: 'half',
      label: 'Casa Ita — aterramento',
      notes: 'Nota de obra que o documento de alterações pede em destaque. A revisão é responsabilidade da empresa contratada para as instalações.',
      eyebrow: 'Antes de fechar',
      title: 'Aterramento\ne instalações',
      text: 'Antes da finalização e do fechamento, o aterramento e todas as instalações elétricas devem ser revisados pela empresa contratada.',
      media: {
        src: 'img/ita/hub04-aterramento.webp',
        alt: 'Aterramento da estrutura do deck, antes do fechamento',
        focal: '50% 50%'
      }
    },

    {
      layout: 'half',
      label: 'Casa Ita — resultado',
      notes: 'Resultado final: o terraço em uso, com o deck corrido sob a pérgola. Fechamento do quarto projeto.',
      tone: 'ink',
      align: 'bottom',
      eyebrow: 'Casa Ita',
      title: 'Deck\nconcluído',
      media: { src: 'img/ita/terraco.webp', alt: 'Terraço com o deck concluído, sob a pérgola de estrutura vermelha', focal: '50% 55%' },
      destaques: ['Fixação oculta', 'Paginação contínua', 'Subestrutura nivelada']
    },

    /* ===================================================================
       05 · AMIRA — Lesco Panel

       Forro de madeira sob as lajes, do térreo aos pavimentos altos. É o
       maior dos cinco em área: 1.228 m². Os textos marcados como "a ser
       preenchida" são provisórios, entraram para aprovar o layout.
       =================================================================== */

    {
      layout: 'chapter',
      label: '05 · Amira — abertura',
      notes: 'Abre o quinto projeto. Lesco Panel aplicado como forro — o maior dos cinco em área e o único que se olha de baixo.',
      num: '05',
      eyebrow: 'Lesco Panel',
      title: 'Amira',
      footer: 'Curitiba · PR\nLesco Panel aplicado em forro.',
      background: {
        src: 'img/amira/hub05-pilotis.webp',
        alt: 'Forro em Lesco Panel visto de baixo, entre as colunas do pilotis',
        focal: '50% 70%'
      }
    },

    {
      layout: 'specs',
      label: 'Amira — ficha técnica',
      notes: 'Ficha técnica. Painel 119 × 12, fosco na cor Tasmania Oak, sobre alumínio a cada 60 cm. No render dá para ver o macho e a fêmea do encaixe e as nervuras do verso.',
      eyebrow: 'Amira',
      title: 'Ficha técnica',
      rows: [
        ['Sistema',           'Lesco Panel'],
        ['Perfil',            '119 × 12 mm'],
        ['Acabamento',        'Fosco · cor Tasmania Oak'],
        ['Subestrutura',      'Alumínio · 60 cm'],
        ['Área aplicada',     '1.228 m²'],
        ['Prazo de montagem', '60 dias']
      ],
      figure: 'img/tec/panel-119x12.webp',
      figureAlt: 'Perfil Lesco Panel 119 × 12 mm'
    },

    {
      layout: 'photo',
      label: 'Amira — o prédio',
      notes: 'O conjunto ainda em obra: o forro corre sob cada laje, pavimento por pavimento. Serve para dar a escala dos 1.228 m².',
      src: 'img/amira/hub05-pilotis.webp',
      alt: 'Fachada do Amira em obra, com o forro de madeira sob cada laje',
      focal: '50% 45%',
      eyebrow: 'Amira',
      title: 'Pavimento a pavimento',
      drift: true,
      sub: 'A instalação se repete pavimento por pavimento, exigindo continuidade visual entre os diferentes trechos do forro.'
    },

    {
      layout: 'cards',
      label: 'Amira — sequência de montagem',
      notes: 'CORREÇÃO DE CONTEÚDO: a montagem NÃO foi feita toda de balancim — o título e o texto antigos diziam isso. [CONFIRMAR] o tema do slide com a equipe de projetos. A composição com as quatro etapas lado a lado está em img/tec/amira-quatro-etapas.webp, se o design preferir uma imagem só.',
      eyebrow: 'Como se monta',
      title: 'Sequência de montagem',
      items: [
        {
          label: 'Subestrutura',
          text: 'Montagem e alinhamento dos perfis de apoio.',
          src: 'img/tec/amira-etapa-1-subestrutura.webp',
          alt: 'Perfis de apoio da subestrutura, a cada 60 cm'
        },
        {
          label: 'Início da paginação',
          text: 'Definição do sentido de avanço das réguas.',
          src: 'img/tec/amira-etapa-2-paginacao.webp',
          alt: 'Marcação do sentido de avanço das réguas'
        },
        {
          label: 'Instalação',
          text: 'Painéis fixados progressivamente, trecho a trecho.',
          src: 'img/tec/amira-etapa-3-instalacao.webp',
          alt: 'Painéis sendo fixados, com detalhe da fixação'
        },
        {
          label: 'Conferência',
          text: 'Alinhamento das juntas e continuidade do plano.',
          src: 'img/tec/amira-etapa-4-conferencia.webp',
          alt: 'Conferência do alinhamento das juntas'
        }
      ],
      destaques: ['Passo de 60 cm entre perfis']
    },

    {
      layout: 'duo',
      label: 'Amira — da estrutura ao forro pronto',
      notes: 'As três fotos na ordem pedida: subestrutura, instalação das réguas e forro pronto. A foto antiga do forro com as palmeiras segue em img/amira/forro.webp.',
      eyebrow: 'Amira',
      title: 'Da estrutura ao forro pronto',
      media: [
        { src: 'img/amira/hub06-subestrutura.webp', alt: 'Subestrutura do forro, antes das réguas' },
        { src: 'img/amira/hub07-reguas.webp', alt: 'Instalação das réguas do forro' },
        { src: 'img/amira/hub08-forro-pronto.webp', alt: 'Forro de madeira concluído' }
      ]
    },

    {
      layout: 'faixa',
      label: 'Amira — entre as colunas',
      notes: 'O encontro do forro com as colunas curvas. Sem cota de folga no slide, por decisão do documento de alterações. A tira embaixo conta a sequência: molde, recorte, folga, encontro e arremate.',
      media: {
        src: 'img/amira/colunas.webp',
        alt: 'As duas colunas redondas com o forro de madeira entre elas',
        focal: '50% 45%'
      },
      eyebrow: 'Encontro',
      title: 'Entre\nas colunas',
      text: 'Nas colunas curvas, o corte das peças exige cuidado redobrado. Neste projeto foi feito um molde para que o recorte acompanhasse exatamente a geometria prevista em projeto.',
      tira: [
        { label: 'Molde de corte',        src: 'img/tec/amira-coluna-1-molde.webp' },
        { label: 'Recorte do painel',     src: 'img/tec/amira-coluna-2-recorte.webp' },
        { label: 'Folga perimetral',      src: 'img/tec/amira-coluna-3-folga.webp' },
        { label: 'Encontro com a coluna', src: 'img/tec/amira-coluna-4-encontro.webp' },
        { label: 'Arremate',              src: 'img/tec/amira-coluna-5-arremate.webp' }
      ]
    },

    {
      layout: 'photo',
      label: 'Amira — o forro de ponta a ponta',
      notes: 'Vídeo grande, no mesmo padrão do slide da Ekos. Na fala, pedir para observar: continuidade das réguas, alinhamento das juntas e encontro com a estrutura.',
      video: 'video/amira-montagem.mp4',
      poster: 'img/amira/colunas.webp',
      alt: 'Vídeo percorrendo o forro de madeira',
      eyebrow: 'Observe: continuidade das réguas · alinhamento das juntas · encontro com a estrutura',
      title: 'O forro de ponta a ponta'
    },

    {
      layout: 'photo',
      label: 'Amira — continuidade do plano',
      notes: 'Falta a linha desenhada sobre a foto mostrando a paginação atravessando o forro — é direção de arte, ainda não está no slide.',
      src: 'img/amira/hub-forro.webp',
      alt: 'Forro de madeira contínuo, com a paginação atravessando o plano',
      focal: '50% 50%',
      eyebrow: 'Amira',
      title: 'Continuidade do plano',
      drift: true
    },

    /* ===================================================================
       FECHAMENTO
       =================================================================== */

    {
      layout: 'checklist',
      label: 'O que as cinco obras ensinam',
      notes: 'Fechamento que amarra os cinco projetos, em vez de terminar na última foto. Substitui a lista antiga de seis itens soltos.',
      title: 'O que as cinco\nobras ensinam',
      items: [
        { label: 'A subestrutura vem antes do acabamento', text: 'A precisão começa no que não aparece.' },
        { label: 'Cada sistema tem seu próprio passo', text: '80 cm, 60 cm, 30 cm ou outra malha definida no projeto.' },
        { label: 'Grandes vãos podem exigir reforço interno', text: 'A alma estrutural permite vencer situações específicas sem alterar a leitura externa.' },
        { label: 'Fixação e folgas fazem parte do projeto', text: 'Não são decisões para serem resolvidas apenas na instalação.' },
        { label: 'O detalhe define o resultado final', text: 'Alinhamento, paginação, encaixes e arremates fazem a diferença.' }
      ]
    },

    {
      layout: 'half',
      label: 'Chamada — instaladores homologados',
      notes: 'Chamada da live, logo depois da conclusão e antes do encerramento. O link do cadastro vai na descrição — conferir que ele está publicado antes de entrar ao vivo. O que o instalador homologado ganha não está na tela: se houver uma lista de benefícios fechada, ela entra aqui.',
      eyebrow: 'Para quem instala',
      title: 'Seja um\ninstalador\nhomologado',
      text: 'Estamos abrindo o cadastro de instaladores para o nosso sistema de homologação. Se você monta brise, muxarabi, deck ou forro, esta chamada é para você.',
      destaques: ['Link na descrição'],
      media: {
        src: 'img/ita/i29.webp',
        alt: 'Instalador assentando as réguas do deck sobre a estrutura',
        focal: '50% 50%'
      }
    },

    {
      layout: 'outro',
      label: 'Encerramento',
      notes: 'Encerramento. Abrir para perguntas e deixar o contato na tela.',
      title: 'Arquitetura feita\npara o amanhã',
      left: 'lesco.com.br\n@lesco_br',
      right: 'Itajaí — SC\nSão Paulo — SP'
    }

  ]
};
