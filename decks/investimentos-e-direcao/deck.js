/* ===========================================================================
   INVESTIMENTOS E DIREÇÃO PARA 2027 · Lesco
   Apresentação ao Lucas · 17 de novembro de 2026

   Cinco frentes, cada uma terminando num pedido de aprovação: Arkos (o
   contexto que explica a urgência), INPI e rebrand, embalagens, Mono nos
   marketplaces e Mono Creators. A Arkos abre porque é ela que justifica o
   rebrand e a embalagem.

   NENHUM NÚMERO ESTÁ ESCRITO AQUI DENTRO
     Tudo vem de dados.js e é formatado pelos auxiliares de lá — inclusive os
     números que aparecem no meio de uma frase e os que dão título a um
     slide. Corrigir um valor é mexer em um arquivo só, e não existe chance
     de o slide e a fonte divergirem.

   O TEXTO NA TELA É CURTO
     Uma ideia por tela. O detalhe fica nas `notes`, que só aparecem no painel
     do apresentador (tecla N) e nunca na projeção.

   LAYOUTS NOVOS
     pontos, duas, barras, barraspilha, colunas, colunaspilha, linhas,
     cartoes, fluxo, tabela e decisoes estão em graficos.js, nesta pasta.
     Os treze do motor continuam valendo.
   ======================================================================== */

(function () {
  'use strict';

  var N = window.NUMEROS;

  /* Atalhos de formatação, para o conteúdo abaixo ficar legível. */
  var $ = N.reais;          /* com centavos: R$ 7.130,00 */
  var $c = N.reaisCurto;    /* sem o ",00" inútil: R$ 9.380 */

  /* ---------------------------------------------------------------------
     Pré-cálculos usados em mais de um slide.
     --------------------------------------------------------------------- */

  var linhasMista = N.custoPacote('linhas-mista');
  var comBambu = N.custoPacote('linhas-mista-bambu');
  var lescoNom = N.custoPacote('lesco-nominativa');
  var juntos = N.custoPacote('juntos');
  var economia = N.economiaJunto('lesco-nominativa', 'linhas-mista', 'juntos');

  /* A matriz marca × classe do infográfico. Sai dos pedidos dos pacotes:
     acrescentar uma classe lá muda o desenho e o custo de uma vez. */
  var matriz = N.matrizINPI();

  var momentos = N.momentosPedido();
  var imediato = momentos[0];
  var janeiro = momentos[1];

  var perguntas = N.perguntas();
  var tray = N.mono.tray;

  /* Rodapé repetido nas telas de embalagem (8 a 11). Uma variável, e não
     quatro cópias: a data de validade muda junto nas quatro. */
  var rodapeEmbalagem =
    'Preços da 46 Indústria Gráfica na faixa de 1.000 un, com frete até Itajaí e 10% de desconto de primeira compra. ' +
    'Em quantidades menores o valor deve sair mais alto — a recotação está pendente. ' +
    'As propostas vencem em ' + N.embalagens.validades[0].vence + ' (nº ' + N.embalagens.validades[0].proposta + ') e ' +
    N.embalagens.validades[1].vence + ' (nº ' + N.embalagens.validades[1].proposta + '). Kits antigos: orçamento Printi.';

  /* Os segmentos de um kit, já no formato que o gráfico de composição pede.
     O primeiro componente é a caixa grande e fica chapado; as caixas de
     linha vêm mais claras, em degraus. */
  function segmentosDoKit(id) {
    return N.partesKit(id).map(function (p, i) {
      return {
        rotulo: p.rotulo + ' · ' + $(p.valor),
        valor: p.valor,
        tom: i === 0 ? 4 : (i === 1 ? 2 : 1),
        papel: i === 0 ? 'proposta' : (i === 1 ? 'proposta-clara' : 'proposta-palida')
      };
    });
  }

  /* Uma coluna do gráfico de comparação de kits. */
  function colunaKit(id, papel) {
    var k = N.kit(id);
    var dif = N.diferencaKit(id);

    return {
      label: k.nome.replace(/^(Antigo|Novo) /, function (m) { return m.trim() + '\n'; }),
      valor: N.custoKit(id),
      mostra: $(N.custoKit(id)),
      delta: dif ? N.deltaReais(dif.centavos) + ' (' + N.deltaPct(dif.pct) + ')' : null,
      papel: papel
    };
  }

  /* A tabela do resumo, agrupada por frente na ordem em que as frentes
     aparecem na lista — sem repetir o nome da frente a cada linha. */
  function gruposDoResumo() {
    var ordem = [];
    var porFrente = {};

    N.resumo().forEach(function (a) {
      if (!porFrente[a.frente]) {
        porFrente[a.frente] = { frente: a.frente, linhas: [] };
        ordem.push(porFrente[a.frente]);
      }
      porFrente[a.frente].linhas.push({
        item: a.item,
        valor: a.mostra,
        condicao: a.condicao
      });
    });

    return ordem;
  }


  window.DECK = {
    id: 'investimentos-e-direcao',
    title: 'Investimentos e direção para 2027',
    subtitle: 'Reunião de aprovação com o Lucas · 17 de novembro de 2026',

    slides: [

      /* ===============================================================
         ABERTURA
         =============================================================== */

      {
        layout: 'cover',
        label: 'Capa',
        notes:
          'Abertura. Cinco frentes, e a meta é sair daqui com decisão em todas elas.\n\n' +
          'Dizer logo o formato: cada bloco termina num pedido de aprovação, e no fim tem uma tela só de decisões, ' +
          'que dá para marcar na hora.\n\n' +
          'A Arkos abre a apresentação porque é ela que explica por que o rebrand e a embalagem são urgentes — ' +
          'não é um bloco de contexto solto.',
        eyebrow: 'Lesco · Reunião de aprovação',
        title: 'Investimentos\ne direção\npara 2027',
        sub: 'Arkos, INPI e rebrand, embalagens, Mono nos marketplaces e Mono Creators.',
        footer: '17 de novembro de 2026'
      },

      {
        layout: 'index',
        label: 'Pauta',
        notes:
          'Roteiro. A ordem é que importa: a Arkos abre porque é ela que explica a pressa do rebrand e da ' +
          'embalagem, e o fechamento não traz assunto novo — só junta o que já foi pedido bloco a bloco.\n\n' +
          'A meta é sair da reunião com decisões em todas as frentes.',
        eyebrow: 'Decisões em todas as frentes',
        /* UMA LINHA, e não duas. Com seis blocos a lista já encosta na borda
           de baixo, e a segunda linha do título custa os 89 px que faltam — o
           apoio do último item sai da tela. O limite prático é por volta de
           27 caracteres: 'Cinco frentes e o fechamento' tem 28 e quebrou. */
        title: 'Cinco frentes',
        items: [
          { name: 'Arkos',           apoio: 'A concorrência, os dois showrooms e onde estamos' },
          { name: 'INPI e rebrand',  apoio: 'Registro das marcas e a marca nova de 2027' },
          { name: 'Embalagens',      apoio: 'Kit novo, composição e pedido recomendado' },
          { name: 'Mono: frete',     apoio: 'O gargalo do marketplace e a proposta Tray' },
          { name: 'Mono Creators',   apoio: 'Captação de creators por tráfego pago' },
          { name: 'Fechamento',      apoio: 'Resumo de valores e decisões' }
        ]
      },

      /* ===============================================================
         ARKOS
         O bloco não tem pedido de dinheiro. O que ele pede é uma data.
         =============================================================== */

      /* ---------------------------------------------------------------
         COMO A ARKOS SE SUSTENTA, EM QUATRO TELAS

         Era uma tela só, com os quatro pontos em duas colunas. Virou
         quatro telas de um assunto cada, porque duas delas têm foto e
         fotografia não cabe numa lista.

         Duas continuam sem foto, e é de propósito: a ação contra a
         concorrência não se fotografa, e o showroom que viaja só teria
         como ilustração as mesmas fotos que as telas dos dois showrooms
         usam logo a seguir. Repetir foto a três telas de distância custa
         mais do que a tela ganha.
         --------------------------------------------------------------- */

      {
        layout: 'chapter',
        label: '01 · Arkos',
        notes:
          'A capa do primeiro bloco. Dizer de saída que ele NÃO pede dinheiro: pede contexto e uma data.\n\n' +
          'A Arkos abre a apresentação de propósito. É ela que explica por que o rebrand e a embalagem são ' +
          'urgentes — sem este bloco, os dois viram gasto; com ele, viram resposta.\n\n' +
          'PEDIR UMA DATA, e é o único pedido do bloco: uma reunião só sobre o novo showroom (conceito de ' +
          'galeria, com câmaras sensoriais que também servem de sala de reunião) e sobre a definição de ' +
          'posicionamento. Sair daqui com a data marcada.\n\n' +
          'SE PERGUNTAREM DO FORNECEDOR DE WPC: é o gargalo da estética. Enquanto ele não melhorar, bambu e ' +
          'pedra flexível continuam no portfólio sem chegar na obra.\n\n' +
          'Para fechar o bloco, antes de virar para o INPI: rebrand e embalagem são as respostas que dependem ' +
          'só da gente, e ficam prontas para o começo de 2027.\n\n' +
          'O número 01 é o mesmo da pauta.',
        num: '01',
        eyebrow: 'Pauta, bloco 01',
        title: 'Arkos',
        footer: 'Como a concorrência se sustenta e os dois showrooms lado a lado. Este bloco não pede dinheiro: pede uma data.'
      },

      {
        layout: 'topico',
        label: 'Imagem impecável',
        notes:
          'O ponto da tela: a percepção de luxo nasce de coisas concretas, não de adjetivo. Prédio, recepção, ' +
          'mostruário e a organização das amostras — nada disso é caro de entender, é caro de manter com ' +
          'disciplina.\n\n' +
          'A foto é a estante de amostras deles: cada cor na sua caixa, cada caixa etiquetada, a publicação aberta ' +
          'no balcão ao lado. Comparar de cabeça com a nossa mesa de reunião, que aparece daqui a três telas.\n\n' +
          'Nada no showroom deles diz "somos luxo". O espaço diz sozinho — e uma marca que precisa dizer que é ' +
          'luxo na propaganda já perdeu.',
        num: '01',
        eyebrow: 'Como a Arkos se sustenta',
        title: 'Imagem impecável',
        text: 'Percepção de luxo construída com coisas concretas: prédio, recepção, mostruário e a organização das amostras.',
        media: [
          {
            src: 'img/arkos/amostras-estante.webp',
            alt: 'Estante do showroom da Arkos com as amostras guardadas em caixas coloridas e etiquetadas, e uma publicação aberta no balcão',
            focal: '50% 34%'
          }
        ]
      },

      {
        layout: 'topico',
        label: 'Ação contra a concorrência',
        notes:
          'A tela sem foto, e sem foto porque isto não se fotografa.\n\n' +
          'É trabalho coordenado, não comentário solto: chega em quem especifica (arquiteto e escritório de ' +
          'projeto) e em quem compra. A palavra que ouvimos na visita sobre a Lesco foi "fubanga" — não repetir ' +
          'na reunião se não for necessário, mas é esse o tamanho da leitura que circula.\n\n' +
          'O que dá para fazer contra isso não é responder. É tirar a razão da frase: marca, embalagem e ' +
          'showroom. As três estão nesta pauta.',
        num: '02',
        eyebrow: 'Como a Arkos se sustenta',
        title: 'Ação contra\na concorrência',
        text: 'Trabalho coordenado para desmerecer a concorrência direta junto a quem especifica e quem compra.',
        destaques: ['Quem especifica', 'Quem compra']
      },

      {
        layout: 'topico',
        label: 'Publicações anuais',
        notes:
          'ATENÇÃO: o catálogo NÃO saiu do ar. O que mudou é que não depende mais de formulário — e, além dele, ' +
          'agora existem dois impressos.\n\n' +
          'O material filtra o cliente sozinho. Quem só quer comparar preço recebe o PDF e resolve sozinho; quem ' +
          'tem perfil de compra recebe o almanaque de obras, com preço, e chega na conversa com repertório. A ' +
          'gente hoje trata os dois do mesmo jeito.\n\n' +
          'Reparar no QR code da página aberta: o impresso não compete com o site, ele leva para o site. E ' +
          'reparar no preço publicado — valores não são assunto delicado em canal nenhum deles.\n\n' +
          'Se perguntarem quanto custa fazer igual: não é esta reunião. Mas é a mesma conversa do almanaque que ' +
          'a gente vem adiando.',
        num: '03',
        eyebrow: 'Como a Arkos se sustenta',
        title: 'Publicações anuais',
        text: 'Trocaram o catálogo online por dois impressos: PDF de preços para quem só compara e almanaque de obras, com preços, para quem tem perfil de compra.',
        media: [
          {
            src: 'img/arkos/almanaque.webp',
            alt: 'Capa do almanaque anual da Arkos de 2026, preta, com uma foto aérea de uma casa de madeira na mata',
            focal: '50% 50%'
          },
          {
            src: 'img/arkos/almanaque-aberto.webp',
            alt: 'O almanaque aberto numa página de painéis amadeirados, com o QR code impresso no canto',
            focal: '50% 50%'
          }
        ],
        nota: 'Almanaque Arkos 2026, fotografado na visita ao showroom.'
      },

      {
        layout: 'topico',
        label: 'Showroom que viaja',
        notes:
          'O argumento que volta mais tarde, na decisão sobre modularidade: a estrutura do showroom deles é a ' +
          'mesma que vai para as feiras. O investimento aparece duas vezes.\n\n' +
          'Não é economia de material, é economia de decisão: eles não desenham um estande por evento, eles ' +
          'desmontam o que já existe e levam.\n\n' +
          'Guardar isto para a reunião do showroom novo — é um requisito de projeto, não um detalhe de montagem.',
        num: '04',
        eyebrow: 'Como a Arkos se sustenta',
        title: 'Showroom que viaja',
        text: 'O mesmo showroom é reaproveitado nas feiras, sem montar material novo a cada evento.',
        destaques: ['Um investimento, dois usos']
      },


      /* ---------------------------------------------------------------
         OS DOIS SHOWROOMS

         Três telas dentro do bloco da Arkos. Elas não pedem dinheiro:
         pedem que a diferença seja VISTA antes de a conversa chegar em
         marca e em embalagem — é ela que explica a pressa dos dois.

         As fotos vieram do deck do showroom, que já fazia esta
         comparação na página 16. Ver img/LEIA-ME.md, que diz de onde
         veio cada uma e por que estas cinco e não outras.
         --------------------------------------------------------------- */

      {
        layout: 'photo',
        label: 'A parede da Arkos',
        notes:
          'A frase é deles, em letra de metal na parede do showroom: AMANTES DE BOA ARQUITETURA. Vale ler em voz ' +
          'alta e ficar calado um segundo.\n\n' +
          'Reparar no que ela NÃO diz: nada sobre o produto, nada sobre preço, nada sobre prazo. Ela fala de quem é ' +
          'o cliente. É isso que o showroom inteiro está construindo.\n\n' +
          'E reparar na mesa: é a mesa de reunião deles, dentro do showroom, sobre o deck que é produto da casa, ' +
          'debaixo da frase. O cliente senta ali. Guardar esta imagem para a terceira tela do tópico.',
        eyebrow: 'Os dois showrooms',
        title: 'A posição deles está\nescrita na parede',
        src: 'img/arkos/parede.webp',
        alt: 'Parede de madeira do showroom da Arkos com a frase AMANTES DE BOA ARQUITETURA em letras de metal, e a mesa de reunião sobre o deck',
        focal: '50% 50%'
      },

      {
        layout: 'confronto',
        label: 'Showroom e escritório',
        notes:
          'Cuidado com o tom aqui, porque o mal-entendido é fácil: o escritório não é ruim. É um escritório bom ' +
          'para o que ele é. O ponto é outro — ele não foi desenhado para receber cliente, e é nele que o cliente ' +
          'é recebido.\n\n' +
          'Se vier a pergunta de quanto custa a diferença: não é esta reunião que resolve o showroom. O pedido ' +
          'deste bloco é uma data para a reunião só sobre isso. O que esta tela sustenta são as duas frentes ' +
          'seguintes, que dependem só da gente — a marca e a embalagem.\n\n' +
          'Vale dizer também que o deck de madeira no chão do showroom deles é produto deles, aplicado. O ripado ' +
          'da nossa divisória também é nosso. A diferença não é ter o produto, é tratá-lo como obra.',
        eyebrow: 'Os dois showrooms',
        title: 'Um foi desenhado para receber cliente',
        lados: [
          {
            nome: 'Arkos',
            apoio: 'Showroom, São Paulo',
            src: 'img/arkos/showroom.webp',
            alt: 'Vista ampla do showroom da Arkos, com forro ripado, estante de amostras coloridas e balcão curvo iluminado',
            focal: '50% 56%',
            texto: 'Forro ripado, balcão curvo iluminado, as amostras organizadas por cor e expositores feitos sob medida.'
          },
          {
            nome: 'Lesco',
            apoio: 'Escritório, São Paulo',
            nosso: true,
            src: 'img/lesco/armarios.webp',
            alt: 'Vista larga do escritório da Lesco, com os armários de madeira, as bancadas de trabalho e o arco de folhagem ao fundo',
            focal: '50% 46%',
            texto: 'Um escritório bem resolvido para o que é — e não foi desenhado para receber cliente.'
          }
        ],
        nota: 'Fotos da visita ao showroom da Arkos e do escritório da Lesco em São Paulo, as mesmas do deck do showroom.'
      },

      {
        layout: 'confronto',
        label: 'Onde a amostra encontra o cliente',
        notes:
          'A tela da página 16 do deck do showroom, trazida para cá. Deixar na tela e ficar calado alguns segundos: ' +
          'ela dispensa argumento.\n\n' +
          'É o mesmo momento da conversa dos dois lados — o cliente pede para ver o material. À esquerda, um expositor ' +
          'desenhado para isso. À direita, a nossa mesa de reunião, com os perfis empilhados e as caixas de papelão ' +
          'abertas ao lado.\n\n' +
          'Nenhuma das duas foi escolhida para favorecer ninguém: são o que existe nos dois lugares. Existe uma foto ' +
          'da mesma sala arrumada, e ela não serve aqui — arrumada, a cena deixa de dizer o que esta tela diz.\n\n' +
          'A CAIXA É A DOBRADIÇA DO DECK: é exatamente ela que o kit novo substitui. Se o Lucas perguntar quanto ' +
          'custa trocar, a resposta inteira está no bloco de embalagens, com o preço por kit e o pedido fechado.',
        eyebrow: 'Os dois showrooms',
        title: 'Onde a amostra encontra o cliente',
        lados: [
          {
            nome: 'Arkos',
            apoio: 'Expositor no showroom',
            src: 'img/arkos/amostras.webp',
            alt: 'Expositor da Arkos com perfis de fachada em pé e as letras ARKOS recortadas contra a janela',
            focal: '50% 56%',
            texto: 'Um expositor desenhado para isso, com os perfis em pé e a marca recortada contra a cidade.'
          },
          {
            nome: 'Lesco',
            apoio: 'Mesa de reunião',
            nosso: true,
            src: 'img/lesco/mesa-amostras.webp',
            alt: 'Mesa do escritório da Lesco com perfis de WPC empilhados e caixas de papelão abertas ao lado',
            focal: '50% 58%',
            texto: 'Os perfis empilhados na mesa e as caixas de papelão abertas ao lado.'
          }
        ],
        recado: 'A diferença não está no produto: os dois importam e os dois vendem quase só textura de madeira. Está no que se mostra — e é essa caixa que o kit novo substitui.'
      },


      /* ===============================================================
         INPI E REBRAND
         Pedido: aprovar o registro de GEO, ZHÜ e ECHO e a ampliação da
         marca Lesco para novas categorias. O logo novo de 2027 NÃO é
         pedido: ele entra na comunicação, não vai ao INPI, e as telas
         que o mostram estão aqui como argumento de que isso pode ser
         feito sem registro nenhum.
         =============================================================== */

      {
        layout: 'chapter',
        label: '02 · INPI e rebrand',
        notes:
          'A capa do bloco. Serve para dar o fôlego entre a Arkos e o dinheiro: a conversa muda de assunto aqui.\n\n' +
          'O número 02 é o mesmo da pauta — se ele perguntar onde estamos, é só apontar.\n\n' +
          'Dizer o pedido inteiro de uma vez, antes de abrir os números: registrar GEO, ZHÜ e ECHO e ampliar a ' +
          'marca Lesco para novas classes. São duas coisas, e uma decisão só.\n\n' +
          'O LOGO NOVO NÃO ESTÁ NO PEDIDO. Ele entra na comunicação em 2027 e não vai ao INPI — as telas da marca ' +
          'estão aqui para mostrar o que vem por aí e por que dá para fazer sem registro, não para pedir ' +
          'aprovação. Se ele perguntar quanto custa, a resposta é: nada no orçamento do INPI.',
        num: '02',
        eyebrow: 'Pauta, bloco 02',
        title: 'INPI\ne rebrand',
        footer: 'Registrar GEO, ZHÜ e ECHO e ampliar a marca Lesco para novas classes. O logo novo de 2027 entra na comunicação, fora do INPI.'
      },

      {
        /* A página 23 do manual, refeita no motor. É a única tela do deck
           em coordenadas absolutas, e a única que não argumenta nada: ela
           apresenta o elenco. Os três nomes aparecem como marca antes de
           virarem linha de orçamento duas telas adiante. */
        layout: 'marcas',
        label: 'As três marcas',
        notes:
          'A tela de apresentar o elenco. Deixar respirar — os símbolos se mexem sozinhos, e a tela se explica ' +
          'sem narração. Não ler nada em voz alta aqui.\n\n' +
          'São os três nomes que o bloco vai pedir para registrar: GEO, ZHÜ e ECHO. Os três já estão no ' +
          'mercado, em catálogo e em amostra — é por isso que o pedido é agora.\n\n' +
          'Se perguntarem qual é qual: GEO é o revestimento de pedra flexível e ZHÜ é a linha de bambu, que é ' +
          'a razão da classe 20 aparecer no pacote. Da ECHO, não arriscar material em voz alta.\n\n' +
          'É a página 23 do LESCO-ID-VISUAL-2027, refeita aqui: os logotipos e os símbolos são o vetor do ' +
          'próprio arquivo, nas posições do próprio arquivo.',
        alt: 'As marcas zhú, echo e geo sobre verde escuro, com fotos de um painel entalhado, de lâminas azuis e de uma casa na mata',
        /* x, y, largura e altura saem do operador cm de cada foto na
           página do PDF. A página mede 1920×1080, que é o palco — por
           isso os números entram como estão. */
        media: [
          {
            src: 'img/marcas/parede-entalhada.webp',
            alt: 'Painel de parede entalhado com desenho de pinheiro e garças',
            x: 211.9, y: 368.34, w: 273.85, h: 238.03
          },
          {
            src: 'img/marcas/laminas-azuis.webp',
            alt: 'Parede de lâminas verticais azuis, com uma pessoa passando em movimento',
            x: 888.77, y: 258.94, w: 581.37, h: 338.69
          },
          {
            src: 'img/marcas/casa-na-mata.webp',
            alt: 'Casa de concreto e vidro dentro da mata, ao fim da tarde',
            x: 487.43, y: 606.36, w: 402.21, h: 268.68
          }
        ],
        textos: {
          ano: '2027',
          site: 'LESCO.COM.BR',
          assinatura: 'ARQUITETURA FEITA PARA O AMANHÃ'
        }
      },

      {
        /* Era um dos três pontos de uma tela de lista. Virou tela própria
           porque é o único dos três que é ARGUMENTO — os outros dois eram
           explicação de como o INPI funciona, e explicação virou desenho
           na tela seguinte. */
        layout: 'topico',
        label: 'Quem registra sai na frente',
        notes:
          'O argumento é de corrida, não de risco teórico. No Brasil o direito sobre a marca vem do registro, não ' +
          'do uso: quem deposita primeiro leva.\n\n' +
          'E os três nomes JÁ ESTÃO no mercado — em catálogo, em amostra, em anúncio. Cada mês sem depósito é um ' +
          'mês em que um concorrente pode registrar e depois nos proibir de usar o nome que nós divulgamos.\n\n' +
          'Se perguntarem qual o risco real: não é alguém mal-intencionado. É qualquer um que registre de boa-fé ' +
          'um nome parecido na mesma classe — e aí a discussão vira processo.\n\n' +
          'A tela seguinte explica como o registro funciona. Esta só diz por que é agora.',
        eyebrow: 'INPI e rebrand',
        title: 'Quem registra\nsai na frente',
        text: 'No Brasil o direito sobre a marca vem do registro no INPI. Sem depósito, um concorrente pode registrar esses nomes e nos impedir de usá-los.',
        destaques: ['GEO, ZHÜ e ECHO já estão no mercado']
      },

      {
        /* O infográfico. Ele substitui dois parágrafos da tela antiga: "uma
           taxa por classe" e "misto protege o logo, nominativo protege o
           nome". Nenhuma das duas frases está escrita aqui — as duas estão
           desenhadas, e é por isso que a tela existe. */
        layout: 'matriz',
        label: 'Como o registro funciona',
        notes:
          'A tela de entender, antes da tela de pagar. Conduzir pelo desenho, não pelo texto.\n\n' +
          'PRIMEIRO os dois selos: a barra é o nome, o quadrado é o símbolo. Nominativa tem só a barra. Mista tem ' +
          'o quadrado grudado nela.\n\n' +
          'A CONSEQUÊNCIA, que é o motivo de a tela existir: como o registro da Lesco é NOMINATIVO, ele protege o ' +
          'nome com qualquer logo — inclusive o novo. Trocar o logo não joga fora nada do que já está registrado. ' +
          'Se alguém perguntar "e o registro do logo antigo?", a resposta está nesta tela.\n\n' +
          'DEPOIS as colunas: o registro é por classe de produto ou serviço, e cada cruzamento preenchido é um ' +
          'pedido com taxa própria. Dá para contar os quadrados: ' + matriz.pedidos + ' pedidos a ' +
          $(N.inpi.regra.taxaPorPedido) + '. É assim que a conta da tela seguinte se forma.\n\n' +
          'A classe 20, do bambu, está com o filete tracejado porque é opcional — a decisão sobre ela ainda não ' +
          'foi tomada.',
        eyebrow: 'INPI e rebrand',
        title: 'Como o registro funciona',
        sub: 'Cada cruzamento é um pedido com taxa própria: ' + matriz.pedidos + ' pedidos a ' +
             $(N.inpi.regra.taxaPorPedido) + '.',
        formatos: [
          {
            chave: 'nominativa',
            nome: N.inpi.formatos.nominativa.nome,
            protege: N.inpi.formatos.nominativa.protege
          },
          {
            chave: 'mista',
            nome: N.inpi.formatos.mista.nome,
            protege: N.inpi.formatos.mista.protege
          }
        ],
        dados: matriz,
        nota: 'A classe 20, do bambu semitrabalhado, é opcional e aparece com o filete tracejado. ' +
              'Classes e formatos conforme a proposta da Registre.se.'
      },

      {
        layout: 'barraspilha',
        label: 'Pacotes de registro',
        notes:
          'A tela da conta. Dois pontos só.\n\n' +
          'PRIMEIRO: o pacote das três linhas e o da Lesco nominativa custam exatamente o mesmo, ' + $c(linhasMista.total) + '. ' +
          'Não é coincidência — os dois têm três pedidos, e o preço da Registre.se é por pedido.\n\n' +
          'SEGUNDO: fechar os dois juntos economiza ' + $c(economia) + '. A regra é que o primeiro pedido do pacote paga ' +
          'assessoria cheia (' + $c(N.inpi.regra.assessoriaPrimeiro) + ') e os demais saem por ' + $c(N.inpi.regra.assessoriaDemais) + '. ' +
          'Seis pedidos num pacote só pagam uma assessoria cheia em vez de duas.\n\n' +
          'O bambu (ZHÜ na classe 20) é opcional e soma ' + $c(N.adicionalBambu()) + '. Decidir se entra agora ou depois.\n\n' +
          'ATENÇÃO: a proposta venceu em ' + N.inpi.condicoes.validade + '. Os valores precisam ser reconfirmados antes de fechar — ' +
          'avisar isso antes que ele pergunte.\n\n' +
          'Se perguntar de desconto: as taxas do INPI podem cair ' + N.inpi.condicoes.reducaoTitular + '% se o titular for ' +
          'CPF, MEI, ME ou EPP. Vale checar como está o enquadramento.',
        eyebrow: 'INPI e rebrand',
        title: 'Pacotes de registro',
        sub: 'Mista e nominativa custam o mesmo. Juntos, economizam ' + $c(economia) + '.',
        legenda: [
          { rotulo: 'Assessoria', tom: 4 },
          { rotulo: 'Taxas do INPI', tom: 2 },
          { rotulo: 'O que se recomenda fechar', papel: 'proposta' }
        ],
        items: [linhasMista, comBambu, lescoNom, juntos, N.custoPacote('juntos-bambu')].map(function (p) {
          return {
            label: p.nome,
            apoio: p.resumo + ' · ' + p.pedidos + (p.pedidos === 1 ? ' pedido' : ' pedidos'),
            segmentos: [
              { rotulo: 'Assessoria · ' + $c(p.assessoria), valor: p.assessoria, tom: 4 },
              { rotulo: 'Taxas do INPI · ' + $c(p.taxas), valor: p.taxas, tom: 2 }
            ],
            mostra: $c(p.total),
            destaque: p.id === 'juntos'
          };
        }),
        /* Sem `recado` aqui de propósito: o subtítulo já diz a mesma coisa, e
           o rodapé de condições é obrigatório e longo. A comparação detalhada
           entre os dois pacotes separados e juntos está nas notas. */
        nota:
          'Registre.se. Assessoria em até ' + N.inpi.condicoes.parcelasAssessoria + 'x sem juros, ou à vista com ' +
          N.inpi.condicoes.descontoAVista + '% de desconto; taxas do INPI à vista. As taxas podem cair ' +
          N.inpi.condicoes.reducaoTitular + '% se o titular for CPF, MEI, ME ou EPP. ' +
          'A proposta venceu em ' + N.inpi.condicoes.validade + ' e os valores precisam ser reconfirmados.'
      },

      /* ---------------------------------------------------------------
         A MARCA, ANTES DO PEDIDO

         Duas telas que o PRD não previa, e que entram porque o manual de
         2027 ficou pronto: a marca nova e a marca aplicada. Elas não
         pedem nada — o logo novo já está decidido e vai para a
         comunicação. Estão aqui porque é mais fácil mostrar do que
         descrever, e porque preparam a tela seguinte, que é o argumento
         de por que isso não depende do INPI.

         As imagens são do próprio manual (ver img/LEIA-ME.md). As peças
         da segunda tela são estudos da identidade, não são as embalagens
         que a 46 orçou — o rodapé diz isso na tela, porque a confusão
         entre as duas coisas custaria caro no bloco seguinte.
         --------------------------------------------------------------- */

      {
        layout: 'marca',
        label: 'A marca nova',
        notes:
          'Mostrar e seguir. Esta tela não defende o desenho novo: põe os dois na mesma largura para ninguém sair ' +
          'da reunião sem saber o que muda.\n\n' +
          'Ficar calado um segundo depois de trocar o slide, e deixar ele olhar.\n\n' +
          'Se ele reparar que a apresentação inteira trocou de cor: foi de propósito. É a paleta do manual novo — ' +
          'o deck já está vestido com a identidade que está em cima da mesa.\n\n' +
          'Se perguntarem de onde veio: o manual é o LESCO-ID-VISUAL-2027, e o desenho desta tela saiu do vetor do ' +
          'próprio arquivo — não é foto de tela.\n\n' +
          'O bloco tem um argumento só, e ele vem duas telas adiante: não há barreira jurídica para trocar o logo ' +
          'na comunicação dentro do Brasil.',
        eyebrow: 'INPI e rebrand',
        title: 'A marca nova',
        sub: 'O logo de hoje e o de 2027, na mesma largura.',
        antes: {
          src: '../../shared/brand/logo-dark.png',
          alt: 'Logo atual da Lesco: a palavra LESCO com um traço em degradê',
          etiqueta: 'Hoje'
        },
        depois: {
          svg: 'marca-lesco',
          alt: 'Marca nova da Lesco, de 2027',
          etiqueta: '2027',
          assinatura: 'Arquitetura feita para o amanhã.'
        },
        nota: 'Marca, paleta e tipografia do manual LESCO-ID-VISUAL-2027. O desenho vem do vetor do próprio arquivo.'
      },

      {
        /* Sem legenda em peça nenhuma, e sem subtítulo: a tela é para
           olhar. Cada linha de texto aqui seria uma linha a menos de
           foto, e o que foi pedido é justamente o contrário. */
        layout: 'galeria',
        label: 'A identidade aplicada',
        notes:
          'Três peças do manual, sem legenda na tela de propósito: aqui é para olhar, não para ler. Trocar o ' +
          'slide e deixar correr.\n\n' +
          'Se precisar nomear: a pasta de documentação técnica, a pasta da GEO e a paleta de amostras com a ' +
          'papelaria.\n\n' +
          'A da GEO é a que vale apontar com o dedo: é a mesma GEO que está sendo registrada duas telas atrás. ' +
          'A identidade nova não para no logo da Lesco — já desce para as marcas da casa.\n\n' +
          'CUIDADO AO DIZER QUE NÃO FOI ORÇADO: parte do manual JÁ está orçada pela 46. A pasta da GEO está no ' +
          'mesmo documento de cotação das embalagens do bloco seguinte. A pasta técnica e a paleta são estudos.\n\n' +
          'Se ele perguntar quanto custa: o preço fechado aparece no bloco de embalagens, logo a seguir. Aqui é ' +
          'a linguagem; lá é a conta.',
        eyebrow: 'INPI e rebrand',
        title: 'A identidade aplicada',
        media: [
          {
            src: 'img/id/pasta-tecnica.webp',
            alt: 'Pasta de documentação técnica da Lesco aberta, com a frase arquitetura feita para o amanhã impressa em terracota e verde',
            /* A frase está na parte de cima da folha; o corte da moldura
               come por baixo. */
            focal: '50% 44%'
          },
          {
            src: 'img/id/geo.webp',
            alt: 'Pasta da marca GEO em terracota, com a marca nova da Lesco no cartão interno e uma amostra de pedra flexível',
            focal: '50% 50%'
          },
          {
            src: 'img/id/paleta.webp',
            alt: 'Paleta de amostras de madeira e pedra em suporte terracota, ao lado de uma caixa verde com a marca nova',
            focal: '50% 53%'
          }
        ],
        nota: 'Peças do manual LESCO-ID-VISUAL-2027.'
      },

      {
        layout: 'duas',
        label: 'Logo novo em 2027',
        notes:
          'A tela do argumento, e é um só: juridicamente nada impede trocar o logo na comunicação dentro do Brasil. ' +
          'Não entrar no mérito do desenho aqui — o desenho já foi mostrado duas telas atrás.\n\n' +
          'POR QUE NÃO IMPEDE: os pedidos da Lesco no INPI são NOMINATIVOS, protegem o nome, e o nome não muda. É a ' +
          'mesma diferença que o diagrama do registro desenhou: barra é nome, quadrado é símbolo. Quem registrou ' +
          'só a barra pode trocar o símbolo à vontade.\n\n' +
          'E O REGISTRO DO LOGO ANTIGO? Se ele tiver registro próprio, continua válido — mas pode ser contestado ' +
          'depois de cinco anos sem uso no Brasil.\n\n' +
          'ISSO AFETA A OPERAÇÃO LÁ FORA? Não. Seguimos com o logo antigo fora do Brasil até decidirmos outra coisa.\n\n' +
          'ESTA TELA NÃO PEDE NADA. O logo novo já está decidido e entra na comunicação; o que ela faz é tirar da ' +
          'frente a objeção de que isso dependeria do INPI. Não abrir discussão de orçamento aqui: o logo não ' +
          'custa nada ao pacote de registro, porque não vai ser depositado.',
        eyebrow: 'INPI e rebrand',
        title: 'Logo novo em 2027',
        sub: 'O logo novo entra na comunicação em 2027, e não precisa passar pelo INPI.',
        /* Uma coluna só. A outra defendia o desenho novo, e a defesa saiu:
           o desenho já foi mostrado, e o que sobra para decidir aqui é
           jurídico. */
        colunas: [
          {
            titulo: 'Ponto jurídico',
            texto: 'Não há barreira jurídica para trocar o logo na comunicação dentro do Brasil. Os pedidos da Lesco são ' +
                   'nominativos e protegem o nome, que continua o mesmo independente do desenho. ' +
                   'Fora do país nada muda: mantemos o logo antigo e os registros como estão.'
          }
        ]
      },

      /* ===============================================================
         EMBALAGENS
         Pedido: aprovar o orçamento das embalagens novas, começando com
         um lote menor, no pedido recomendado pela Louise.
         =============================================================== */

      {
        layout: 'chapter',
        label: '03 · Embalagens',
        notes:
          'A capa do bloco do dinheiro mais concreto da reunião: a embalagem é a única frente que já tem ' +
          'orçamento fechado e data de validade.\n\n' +
          'Amarrar com o que veio antes: a caixa de papelão que apareceu na tela da mesa de reunião é ' +
          'exatamente a que o kit novo substitui.\n\n' +
          'Avisar já que as propostas venceram e precisam ser reconfirmadas — melhor dizer na abertura do que ' +
          'ser perguntado no meio da conta.',
        num: '03',
        eyebrow: 'Pauta, bloco 03',
        title: 'Embalagens',
        footer: 'Kit novo contra kit antigo, onde está o custo e o pedido recomendado pela Louise, em dois momentos.'
      },

      {
        /* O bloco do dinheiro mais concreto começava direto no gráfico.
           Esta tela põe as peças na mesa antes dos números: são as três
           que a 46 já orçou, e são as mesmas que os dois gráficos
           seguintes decompõem. Sem legenda — o preço vem a seguir, e
           repetir aqui seria dizer duas vezes. */
        layout: 'galeria',
        label: 'As peças orçadas',
        notes:
          'Antes de abrir qualquer número, mostrar o que está sendo comprado. Trocar o slide e deixar olhar.\n\n' +
          'As três peças: as caixas de linha, uma cor por linha; a caixa grande, que é a base do kit; e a caixa ' +
          'de amostras da GEO.\n\n' +
          'O ponto que amarra com o bloco anterior: elas já estão com a identidade nova. Como o logo novo já está ' +
          'decidido, dá para mandar imprimir uma vez só.\n\n' +
          'A caixa grande é a mais cara do kit, a ' + $(N.componente('caixaGrande').centavos) + ', e é ela que o ' +
          'gráfico de composição mostra pesando duas telas adiante.',
        eyebrow: 'Embalagens',
        title: 'As peças orçadas',
        media: [
          {
            src: 'img/emb/caixas-linha.webp',
            alt: 'As quatro caixas de linha, em verde escuro, verde claro, terracota e azul, com a marca nova',
            focal: '50% 50%'
          },
          {
            src: 'img/emb/caixa-grande.webp',
            alt: 'A caixa grande, comprida, em verde escuro com o interior terracota e a marca nova',
            focal: '50% 50%'
          },
          {
            src: 'img/emb/caixa-geo.webp',
            alt: 'A caixa de amostras da GEO, em terracota, com a marca GEO e a frase kit de amostras',
            focal: '50% 50%'
          }
        ],
        nota: 'Peças do manual LESCO-ID-VISUAL-2027, já orçadas pela 46 Indústria Gráfica.'
      },

      {
        layout: 'colunas',
        label: 'Kit novo × kit antigo',
        notes:
          'Começar pela diferença desfavorável, sem rodeio: o kit pequeno novo é ' +
          N.pct(N.diferencaKit('novo-pequeno').pct) + ' mais caro que o antigo. Dito isso, a conta que importa é a de cima: ' +
          'o kit de duas linhas custa ' + N.deltaReais(N.diferencaKit('novo-duas-linhas').centavos) + ' a mais que o antigo grande. ' +
          'Um real e três centavos por kit.\n\n' +
          'O argumento é de ferramenta comercial, não de custo: a embalagem é o primeiro contato físico do cliente com o ' +
          'produto, e o unboxing pesa na percepção de valor — exatamente o ponto em que a Arkos nos supera. É o bloco ' +
          'da Arkos voltando aqui.\n\n' +
          'A composição do kit pequeno novo ainda não está fechada: hoje ele custa o mesmo que uma caixa grande ' +
          '(' + $(N.custoKit('novo-pequeno')) + '), o que sugere que falta refinar. Está nos pontos em aberto.\n\n' +
          'Orçamentos da 46 Indústria Gráfica, os melhores que encontramos, já com frete até Itajaí e 10% de ' +
          'desconto de primeira compra.',
        eyebrow: 'Embalagens',
        title: 'Kit novo × kit antigo',
        /* As duas peças do kit novo: a base e a caixa que entra por linha.
           O gráfico compara kits inteiros, e estas são as duas coisas de
           que ele é feito. */
        pecas: [
          {
            src: 'img/emb/caixa-grande.webp',
            alt: 'A caixa grande, comprida, verde por fora e terracota por dentro',
            nome: N.componente('caixaGrande').label
          },
          {
            src: 'img/emb/caixas-linha.webp',
            alt: 'As quatro caixas de linha, uma cor por linha, com a marca nova',
            nome: N.componente('caixaLinha').label
          }
        ],
        sub: 'O kit de duas linhas custa ' + N.deltaReais(N.diferencaKit('novo-duas-linhas').centavos) + ' a mais que o antigo grande.',
        unidade: 'Custo por kit',
        legenda: [
          { rotulo: 'Kit antigo · Printi', papel: 'atual' },
          { rotulo: 'Kit novo · 46', papel: 'proposta' }
        ],
        grupos: [
          {
            label: 'Grande',
            colunas: [
              colunaKit('antigo-grande', 'atual'),
              colunaKit('novo-duas-linhas', 'proposta'),
              colunaKit('novo-completo', 'proposta-clara')
            ]
          },
          {
            label: 'Pequeno',
            colunas: [
              colunaKit('antigo-pequeno', 'atual'),
              colunaKit('novo-pequeno', 'proposta')
            ]
          }
        ],
        nota: rodapeEmbalagem
      },

      {
        layout: 'barraspilha',
        label: 'Composição do kit',
        notes:
          'Esta tela existe para mostrar onde está o dinheiro: a caixa grande é ' +
          N.pct(N.partesKit('novo-duas-linhas')[0].pct) + ' do kit de duas linhas e ' +
          N.pct(N.partesKit('novo-completo')[0].pct) + ' do completo. Cada linha a mais soma só ' +
          $(N.componente('caixaLinha').centavos) + '.\n\n' +
          'A consequência prática: ampliar o kit é barato, mudar a caixa grande é caro. Se um dia precisar cortar ' +
          'custo, é na caixa grande que mexe — não no número de linhas.\n\n' +
          'O kit pequeno fica fora deste gráfico porque a composição dele ainda não foi confirmada.\n\n' +
          'Isto estava em aberto e foi fechado: a caixa de linha de ' + $(N.componente('caixaLinha').centavos) + ' é a ' +
          'flat ' + N.componente('caixaLinha').medida + ', a que vai dentro da grande. A flat 250×60×100 mm é a ' +
          'caixa da GEO — outra peça, também orçada.\n\n' +
          'O que sobra disso, e só dizer se ele perguntar de prazo: a de ' + N.componente('caixaLinha').medida + ' a 46 ' +
          'cotou só em ' + N.numero(N.embalagens.lote6000.qtd) + ' un, e o pedido recomendado soma menos que isso. A ' +
          'recotação está pendente, e a tela do pedido já avisa.',
        eyebrow: 'Embalagens',
        title: 'Composição do kit',
        /* As mesmas duas da legenda, na mesma ordem da legenda. */
        pecas: [
          {
            src: 'img/emb/caixa-grande.webp',
            alt: 'A caixa grande, comprida, verde por fora e terracota por dentro',
            nome: N.componente('caixaGrande').label
          },
          {
            src: 'img/emb/caixas-linha.webp',
            alt: 'As quatro caixas de linha, uma cor por linha, com a marca nova',
            nome: N.componente('caixaLinha').label
          }
        ],
        sub: 'A caixa grande é o maior custo do kit.',
        dentro: true,
        legenda: [
          { rotulo: 'Caixa grande · ' + $(N.componente('caixaGrande').centavos), tom: 4, papel: 'proposta' },
          { rotulo: 'Caixa de linha · ' + $(N.componente('caixaLinha').centavos) + ' cada', tom: 2, papel: 'proposta-clara' }
        ],
        items: [
          {
            label: N.kit('novo-duas-linhas').nome,
            apoio: N.kit('novo-duas-linhas').descricao,
            segmentos: segmentosDoKit('novo-duas-linhas'),
            mostra: $(N.custoKit('novo-duas-linhas'))
          },
          {
            label: N.kit('novo-completo').nome,
            apoio: N.kit('novo-completo').descricao,
            segmentos: segmentosDoKit('novo-completo'),
            mostra: $(N.custoKit('novo-completo'))
          }
        ],
        recado: 'A caixa grande é ' + N.pct(N.partesKit('novo-duas-linhas')[0].pct) + ' do kit de duas linhas e ' +
                N.pct(N.partesKit('novo-completo')[0].pct) + ' do completo. Cada linha a mais soma ' +
                $(N.componente('caixaLinha').centavos) + '.',
        nota: 'O kit pequeno fica fora até a composição dele ser confirmada. ' + rodapeEmbalagem
      },

      {
        layout: 'linhas',
        label: 'Preço por volume',
        notes:
          'O recado é um só: volume derruba o preço unitário, e derruba muito — de ' +
          N.pct(N.quedaVolume(N.embalagens.faixasVolume[0]).pct) + ' a ' +
          N.pct(N.quedaVolume(N.embalagens.faixasVolume[2]).pct) + ' entre 1.000 e 3.000 unidades.\n\n' +
          'Isso prepara a próxima tela: é o argumento CONTRA o lote pequeno. Ele é mais caro por unidade, e eu vou ' +
          'defender fazer o lote pequeno mesmo assim. Melhor apresentar a objeção aqui do que deixar ele levantar.\n\n' +
          'As faixas estão como categorias, não como escala: o que interessa é o degrau de uma para a outra.\n\n' +
          'O quadro da direita é o que a 46 cotou só em 6.000 un (6 artes × 1.000) — não dá para comparar com as ' +
          'faixas do gráfico, por isso está separado.\n\n' +
          'Detalhe que pode ser perguntado: o envelope tem ainda uma faixa de ' + N.numero(N.embalagens.envelope1500.qtd) +
          ' un, a ' + $(N.embalagens.envelope1500.centavos) + '.',
        eyebrow: 'Embalagens',
        title: 'Preço por volume',
        /* Os dois extremos da tabela: a peça mais cara e a mais barata.
           As quatro linhas do gráfico são três objetos, porque a tampa e
           base e a flat têm a mesma medida. */
        pecas: [
          {
            src: 'img/emb/caixa-grande.webp',
            alt: 'A caixa grande, comprida, verde por fora e terracota por dentro',
            nome: N.componente('caixaGrande').label
          },
          {
            src: 'img/emb/caixa-geo.webp',
            alt: 'A caixa de amostras da GEO, em terracota',
            nome: N.componente('caixaGeo').label
          }
        ],
        sub: 'A unidade cai de ' + N.pct(N.quedaVolume(N.embalagens.faixasVolume[0]).pct) + ' a ' +
             N.pct(N.quedaVolume(N.embalagens.faixasVolume[2]).pct) + ' em volume.',
        unidadeY: 'R$ por unidade',
        eixoX: N.embalagens.faixas.map(function (f) { return N.numero(f) + ' un'; }),
        marcaY: function (centavos) { return $c(centavos); },
        series: N.embalagens.faixasVolume.map(function (linha, i) {
          return {
            nome: linha.item,
            tom: i + 1,
            /* A caixa grande é a linha que decide o pedido: é ela que pesa
               no kit e é dela que sai a conta da tela seguinte. */
            destaque: linha.item === 'Caixa grande',
            pontos: N.embalagens.faixas.map(function (f) { return linha.precos[f]; }),
            fim: N.deltaPct(N.quedaVolume(linha).pct)
          };
        }),
        quadro: {
          titulo: 'Cotado só em ' + N.numero(N.embalagens.lote6000.qtd) + ' un',
          apoio: N.embalagens.lote6000.nota + '. Não entram no gráfico porque não têm as outras faixas.',
          linhas: N.embalagens.lote6000.itens.map(function (i) {
            return {
              label: i.item,
              apoio: i.medida + ' · com relevo, ' + $(i.comRelevo),
              valor: $(i.centavos)
            };
          })
        },
        nota:
          'Itens sem relevo. O relevo seco ' + N.embalagens.relevo.medida + ' soma de ' +
          $(N.embalagens.relevo.de) + ' a ' + $(N.embalagens.relevo.ate) + ' por unidade. ' +
          'O envelope tem ainda a faixa de ' + N.numero(N.embalagens.envelope1500.qtd) + ' un, a ' +
          $(N.embalagens.envelope1500.centavos) + '. ' + rodapeEmbalagem
      },

      {
        layout: 'colunaspilha',
        label: 'Pedido recomendado',
        notes:
          'O pedido da Louise, em dois tempos: ' + $(imediato.total) + ' agora e ' + $(janeiro.total) + ' em janeiro. ' +
          'Total de ' + $(N.totalPedido()) + '.\n\n' +
          'O IMEDIATO É URGENTE: serve para enviar as amostras de GEO que já existem e estão paradas. Isso precisa ' +
          'ser pedido agora.\n\n' +
          'Por que só ' + N.numero(imediato.linhas[1].qtd) + ' envelopes? Para enviar TODAS as amostras de GEO seriam ' +
          N.numero(N.embalagens.envelopesTodasAmostras) + ', e o imediato iria a ' + $(N.imediatoTodasAmostras()) + '. ' +
          'A Louise recomenda pedir metade, que ela considera suficiente.\n\n' +
          'SE ELE PERGUNTAR POR QUE NÃO ESPERAR E FAZER DIRETO O LOTE GRANDE: enquanto isso, cada entrega sai com a ' +
          'embalagem atual — que é justamente o problema que viemos resolver. O lote inicial custa mais por unidade, ' +
          'mas exige menos caixa e, principalmente, permite ajustar o modelo antes de escalar. Errar em ' +
          N.numero(imediato.linhas[0].qtd) + ' caixas é barato; errar em ' + N.numero(janeiro.linhas[1].qtd) + ' não é.\n\n' +
          'Lembrar: a recotação para estas quantidades está pendente. Os preços aqui são da faixa de 1.000 un.',
        eyebrow: 'Embalagens',
        title: 'Pedido recomendado',
        /* Uma peça por momento: a caixa da GEO é o que se pede agora, a
           caixa grande é o que se pede em janeiro. É a mesma leitura que
           as duas colunas do gráfico fazem. */
        pecas: [
          {
            src: 'img/emb/caixa-geo.webp',
            alt: 'A caixa de amostras da GEO, em terracota',
            nome: N.componente('caixaGeo').label
          },
          {
            src: 'img/emb/caixa-grande.webp',
            alt: 'A caixa grande, comprida, verde por fora e terracota por dentro',
            nome: N.componente('caixaGrande').label
          }
        ],
        sub: 'Pedido: aprovar o orçamento das embalagens novas, começando pelo lote menor.',
        unidade: 'Investimento por momento',
        legenda: [
          { rotulo: 'Caixas', tom: 4, papel: 'proposta' },
          { rotulo: 'Envelopes e caixas de linha', tom: 2, papel: 'proposta-clara' }
        ],
        items: momentos.map(function (m) {
          return {
            label: m.momento,
            apoio: m.momento === imediato.momento ? 'Pedir agora' : 'Programado',
            segmentos: m.linhas.map(function (l, i) {
              return {
                rotulo: l.item + ' · ' + $(l.total), valor: l.total,
                tom: i === 0 ? 4 : 2,
                papel: i === 0 ? 'proposta' : 'proposta-clara'
              };
            }),
            mostra: $(m.total)
          };
        }),
        geral: { label: 'Total geral', valor: $(N.totalPedido()) },
        /* Linha de uma altura só: com o momento numa coluna própria, o item
           não precisa carregar uma segunda linha de apoio — e é isso que faz
           a tabela caber ao lado do gráfico sem espremer nada. */
        tabela: {
          grade: '150px 1fr 90px 140px 160px',
          colunas: ['Momento', 'Item', 'Qtd.', 'Unitário', 'Total'],
          numericas: [2, 3, 4],
          linhas: momentos.reduce(function (todas, m) {
            return todas.concat(m.linhas.map(function (l, i) {
              return [
                i === 0 ? m.momento.replace(' (GEO)', '') : '',
                l.item,
                N.numero(l.qtd),
                $(l.unitario),
                $(l.total)
              ];
            }));
          }, [])
        },
        recado: 'O pedido imediato serve para as amostras de GEO que já existem — e precisa ser feito agora.',
        nota: rodapeEmbalagem
      },

      /* ===============================================================
         MONO: FRETE
         Pedido: aprovar a contratação da Tray para conectar a Mono aos
         marketplaces via API, como a concorrência faz.
         =============================================================== */

      {
        layout: 'chapter',
        label: '04 · Mono: frete',
        notes:
          'Muda de empresa: daqui em diante a conversa é sobre a Mono, não sobre a Lesco.\n\n' +
          'O bloco tem um gargalo só, e ele é medido: a maior parte das perguntas nos anúncios é sobre frete. ' +
          'Cada uma respondida à mão, e o comprador esperando.\n\n' +
          'O pedido ao fim é contratar a Tray para conectar a Mono aos marketplaces via API, que é como a ' +
          'concorrência resolve isso.',
        num: '04',
        eyebrow: 'Pauta, bloco 04',
        title: 'Mono: frete',
        footer: 'O gargalo do marketplace, o que a concorrência mostra no anúncio e a proposta da Tray.'
      },

      {
        layout: 'barraspilha',
        label: 'O frete hoje',
        notes:
          'O número é ' + perguntas.frete + ' de ' + perguntas.total + ' perguntas sobre frete no último mês. Quase todas são a ' +
          'MESMA pergunta: se enviamos para tal CEP, quanto custa e quando chega.\n\n' +
          'Cada uma é respondida manualmente. Enquanto isso o comprador não vê o preço final — e quem não quer ' +
          'esperar compra de quem mostra o frete na hora. A pergunta no anúncio não é interesse, é atrito.\n\n' +
          'Contexto do produto: o perfil da Mono passa de ' + N.mono.comprimento + '. Produto longo encarece o frete e ' +
          'restringe canais — o TikTok Shop, por exemplo, fica fora pelo limite de tamanho.\n\n' +
          'O mercado de forro vinílico tem muita revenda. A disputa é por preço e prazo, e o frete decide as duas ' +
          'coisas. Sem resolver isso, investir em catálogo e anúncio no marketplace esbarra no mesmo gargalo.\n\n' +
          'Se tiver os prints das perguntas, é aqui que eles entram, ao lado do gráfico.',
        eyebrow: 'Mono nos marketplaces',
        title: 'O frete hoje',
        sub: 'Perguntas nos anúncios da Mono no Mercado Livre, no ' + N.mono.periodoPerguntas + '.',
        legenda: [
          { rotulo: 'Perguntas sobre frete', tom: 5, papel: 'problema' },
          { rotulo: 'Outras perguntas', tom: 1 }
        ],
        items: N.mono.perguntasML.map(function (a) {
          return {
            label: a.anuncio,
            apoio: (a.frete + a.outras) + ' perguntas no total',
            segmentos: [
              { rotulo: 'Frete · ' + a.frete, valor: a.frete, tom: 5, papel: 'problema' },
              { rotulo: 'Outras · ' + a.outras, valor: a.outras, tom: 1 }
            ],
            mostra: a.frete + ' de ' + (a.frete + a.outras)
          };
        }),
        lado: {
          valor: perguntas.frete + ' de ' + perguntas.total,
          label: 'perguntas são sobre frete',
          apoio: 'Quase todas são a mesma: se enviamos para tal CEP, quanto custa e quando chega.'
        },
        recado: 'Cada uma é respondida manualmente. Enquanto isso o comprador não vê o preço final — ' +
                'e quem não quer esperar compra de quem mostra o frete na hora.',
        nota: 'Perguntas recebidas nos anúncios da Mono no Mercado Livre no ' + N.mono.periodoPerguntas + '.'
      },

      {
        layout: 'barras',
        label: 'O que a concorrência mostra',
        notes:
          'Esta é a tabela de frete que um concorrente publica DENTRO do anúncio. O comprador vê o preço antes de ' +
          'perguntar, e decide sozinho.\n\n' +
          'Não é sobre o valor do frete — é sobre estar visível. Repare que vai de ' +
          $c(N.mono.freteReferencia[0].centavos) + ' a ' + $c(N.mono.freteReferencia[N.mono.freteReferencia.length - 1].centavos) + ': ' +
          'não é barato, e mesmo assim converte, porque é previsível.\n\n' +
          'Para ter isso no nosso anúncio precisamos de um integrador. É a próxima tela.\n\n' +
          'Se perguntarem por que não fazemos internamente: teríamos que desenvolver a integração e negociar com ' +
          'transportadoras. A integradora entrega isso pronto e já tem a parceria com o marketplace.',
        eyebrow: 'Mono nos marketplaces',
        title: 'O que a concorrência mostra',
        sub: 'Tabela de frete por região, publicada direto no anúncio.',
        items: N.mono.freteReferencia.map(function (f) {
          return {
            label: f.regiao,
            apoio: f.apoio || null,
            valor: f.centavos,
            mostra: $c(f.centavos),
            papel: 'atual'
          };
        }),
        recado: 'O comprador vê o frete antes de perguntar. Para ter isso, precisamos de um integrador.',
        nota: 'Anúncio de referência da concorrência no Mercado Livre, na ordem em que as faixas aparecem lá.'
      },

      {
        layout: 'cartoes',
        label: 'Proposta Tray',
        notes:
          'A Tray é integradora de marketplace: conecta a Mono aos canais via API, que é como a concorrência resolve ' +
          'frete, estoque e prazo.\n\n' +
          'SE PERGUNTAR O CUSTO DO PRIMEIRO ANO: ' + $c(N.primeiroAnoTray()) + ', se a mensalidade promocional valer pelos ' +
          tray.meses + ' meses. Esse "se" é importante — ainda não confirmamos até quando vale a promoção nem quanto ' +
          'fica depois. É a ressalva da tela.\n\n' +
          'A entrada inclui o visual entregue pronto, o que economiza tempo nosso.\n\n' +
          'NÃO DÁ PARA RESOLVER INTERNAMENTE? Teríamos que desenvolver a integração e negociar com transportadoras. ' +
          'A integradora entrega pronto e já tem a parceria com o marketplace. Não é compra de software, é compra de ' +
          'tempo e de acesso.',
        eyebrow: 'Mono nos marketplaces',
        title: 'Proposta Tray',
        sub: 'Pedido: aprovar a contratação da Tray para conectar a Mono aos marketplaces via API.',
        items: [
          {
            eyebrow: 'Entrada',
            valor: $c(tray.entrada),
            label: 'Em até ' + tray.parcelas + 'x de ' + $(N.parcelaTray()),
            apoio: 'Com o visual entregue pronto.'
          },
          {
            eyebrow: 'Mensalidade',
            valor: $c(tray.mensalidade),
            label: 'Por mês',
            apoio: 'Valor promocional de Black Friday.',
            destaque: true
          }
        ],
        recado: 'Primeiro ano: ' + $c(N.primeiroAnoTray()) + ', se a mensalidade promocional valer pelos ' + tray.meses + ' meses.',
        nota: 'Confirmar até quando vale a promoção e quanto fica a mensalidade depois.'
      },

      /* ===============================================================
         MONO CREATORS
         Pedido: aprovar a criação das contas de anúncios da Mono e a
         verba de tráfego pago para a campanha de recrutamento.
         =============================================================== */

      {
        layout: 'chapter',
        label: '05 · Mono Creators',
        notes:
          'O último bloco que pede dinheiro, e o mais aberto dos cinco: a meta de creators por mês e o custo da ' +
          'landing page ainda estão a definir.\n\n' +
          'Dizer isso na capa, antes de mostrar o fluxo. O que se pede aqui é a verba de tráfego e o aval para ' +
          'montar a operação — não um número fechado.',
        num: '05',
        eyebrow: 'Pauta, bloco 05',
        title: 'Mono\nCreators',
        footer: 'Captação de creators por tráfego pago, com orçamento compartilhado entre as marcas.'
      },

      {
        layout: 'fluxo',
        /* O label mudou quando a capa do bloco entrou: dois "Mono Creators"
           seguidos na grade (tecla G) não ajudavam ninguém. */
        label: 'Como a captação funciona',
        notes:
          'O gargalo é a ENTRADA: captar influenciador manualmente é improdutivo. O tráfego pago resolve volume de ' +
          'interessados; a Inbazz, que já está contratada, resolve a gestão depois que eles entram.\n\n' +
          'A INBAZZ NÃO RESOLVE SOZINHA? Ela organiza e acompanha os creators que já chegaram. Ela não traz gente ' +
          'nova. O tráfego pago é o funil de entrada dela.\n\n' +
          'POR QUE DUAS CONTAS DE ANÚNCIO? Separar mantém públicos e métricas limpos: uma mede custo por creator ' +
          'captado, a outra mede custo por venda. Misturar as duas na mesma conta estraga a otimização das duas.\n\n' +
          'A verba pedida é ' + $c(N.mono.creators.verbaTrafego) + ' só para a campanha de recrutamento. É teste, não escala.\n\n' +
          'EM ABERTO: falta definir a meta de creators por mês e se a landing page é custo ou trabalho interno. ' +
          'Se ele perguntar, é honesto dizer que ainda não temos.',
        eyebrow: 'Mono Creators',
        title: 'Como funciona',
        sub: 'Pedido: aprovar a criação das contas de anúncios da Mono e ' + $c(N.mono.creators.verbaTrafego) + ' de tráfego pago para o recrutamento.',
        etapas: [
          { titulo: 'Anúncio pago', texto: 'Campanha direcionada a creators.' },
          { titulo: 'Landing page', texto: 'Onde eles se cadastram para divulgar a Mono.' },
          { titulo: 'Inbazz', texto: 'Os cadastrados entram na plataforma de gestão de influenciadores, já contratada.' },
          { titulo: 'Publicação', texto: 'Os creators anunciam o produto nas redes deles.' }
        ],
        contas: {
          caixas: [
            {
              titulo: 'Conta Mono Creators',
              texto: 'Captação de influenciadores.',
              metrica: 'Medida em custo por creator captado'
            },
            {
              titulo: 'Conta produtos Mono',
              texto: 'Venda dos produtos.',
              metrica: 'Medida em custo por venda'
            }
          ],
          orcamento: {
            label: 'Orçamento compartilhado',
            valor: $c(N.mono.creators.verbaTrafego) + ' na campanha de recrutamento'
          }
        },
        rodape: [
          { label: 'Verba de tráfego', valor: $c(N.mono.creators.verbaTrafego) },
          { label: 'Meta de creators por mês', valor: N.mono.creators.metaMes || 'a definir' },
          { label: 'Landing page', valor: N.mono.creators.landingPage || 'a definir' }
        ],
        nota: 'A Inbazz já está contratada. Separar as contas de anúncio mantém públicos e métricas limpos.'
      },

      /* ===============================================================
         FECHAMENTO
         =============================================================== */

      {
        layout: 'chapter',
        label: '06 · Fechamento',
        notes:
          'Nada de assunto novo daqui para a frente. O fechamento só junta o que já foi pedido bloco a bloco.\n\n' +
          'São seis telas: o resumo de valores e depois CINCO decisões, uma por frente, cada uma com as opções ' +
          'dentro. Escolher uma opção é a decisão, e a marcação sai na exportação em PDF.\n\n' +
          'A meta é não sair daqui com nenhuma frente em aberto. O rebrand não tem tela de decisão porque não ' +
          'há o que decidir: o logo novo entra na comunicação e não vai ao INPI.',
        num: '06',
        eyebrow: 'Pauta, bloco 06',
        title: 'Fechamento',
        footer: 'O resumo de valores e cinco telas de decisão, uma por frente, para marcar na reunião.'
      },

      {
        layout: 'tabela',
        label: 'Resumo de valores',
        notes:
          'Tudo que depende de aprovação, numa tela só.\n\n' +
          'Se ele quiser o número cheio: INPI nos dois pacotes juntos ' + $c(juntos.total) + ', embalagens ' +
          $(N.totalPedido()) + ' em dois tempos, Tray ' + $c(tray.entrada) + ' mais ' + $c(tray.mensalidade) + ' por mês, ' +
          'e ' + $c(N.mono.creators.verbaTrafego) + ' de tráfego para os creators.\n\n' +
          'Não há nenhum item em aberto na tabela: o logo novo saiu do orçamento porque não vai ao INPI, e com ele ' +
          'saiu o único "a definir" que a tela tinha.\n\n' +
          'Os preços unitários de embalagem ficam nas telas 8 a 10, se alguém quiser voltar. Dá para pular direto ' +
          'digitando o número do slide e Enter.',
        eyebrow: 'Fechamento',
        /* Sem subtítulo: com dez linhas na tabela, a linha de apoio é o que
           sobra de espaço. O cabeçalho da tabela já diz o que cada coluna é. */
        title: 'Resumo de valores',
        colunas: ['Frente', 'Item', 'Valor', 'Condição'],
        grupos: gruposDoResumo(),
        nota: 'Preços unitários de embalagem nas telas 9 e 10. Valores do INPI pendentes de ' +
              'reconfirmação; propostas da 46 vencem em novembro.'
      },

      /* ===============================================================
         AS DECISÕES, UMA POR TELA

         Três versões em três dias, e a razão foi sempre a mesma. Primeiro
         era uma lista plana de sete itens com Aprovado / Ajustar / Adiar
         em cada: o status dizia SE, nunca O QUÊ. Depois virou uma tela só
         com os tópicos e as opções dentro, e aí o aperto da lista não
         deixava a opção explicar o que ela compra. Agora é uma tela por
         decisão, e cada opção cabe com a linha de apoio que vem dos
         dados: o que o pacote do INPI protege, o que o pedido leva
         dentro.

         Nenhuma opção é inventada e nenhum valor é digitado. Os cinco
         pacotes são os de inpi.pacotes; os três cenários de embalagem são
         os dois momentos do pedido mais o de todas as amostras de GEO,
         que a Louise descartou mas que continua sendo escolha dele.

         O REBRAND NÃO TEM TELA AQUI. O logo novo entra na comunicação,
         não vai ao INPI e não custa nada ao pacote de registro — não há o
         que decidir. As telas 16 a 18 mostram o logo e explicam por que
         ele não depende do INPI; nenhuma delas pede aprovação.
         =============================================================== */

      {
        layout: 'escolhas',
        label: 'Decisão 1 · INPI',
        notes:
          'PRIMEIRA DECISÃO, e a que tem mais caminhos: cinco pacotes, um a escolher. Clicar marca; clicar de novo ' +
          'desmarca. A marcação fica no slide e sai na exportação em PDF.\n\n' +
          'O ATALHO DA CONVERSA: juntar a Lesco com as linhas economiza ' +
          $c(N.economiaJunto('lesco-nominativa', 'linhas-mista', 'juntos')) + ' em relação a contratar os dois ' +
          'separados. É por isso que "os dois juntos" está marcado como recomendado.\n\n' +
          'O BAMBU é o opcional de ' + $c(N.adicionalBambu()) + ', e é a classe 20. Só vale se a linha ZHÜ for mesmo ' +
          'vender bambu semitrabalhado. Sem resposta hoje, marcar sem bambu e tratar a classe 20 depois — ela pode ' +
          'ser acrescentada num pedido novo, só não sai no mesmo lote.\n\n' +
          'CONDIÇÕES: assessoria em ' + N.inpi.condicoes.parcelasAssessoria + 'x, taxas à vista.',
        eyebrow: 'Fechamento · decisão 1 de 5',
        title: 'Registro no INPI',
        sub: 'Um pacote. Valores da proposta da Registre.se.',
        grupos: [
          {
            adiar: 'Adiar o registro',
            opcoes: [
              {
                rotulo: 'Só as linhas: GEO, ZHÜ e ECHO',
                apoio: N.pacote('linhas-mista').protege,
                valor: $c(N.custoPacote('linhas-mista').total)
              },
              {
                rotulo: 'Só as linhas, com ZHÜ em bambu',
                apoio: N.pacote('linhas-mista-bambu').protege,
                valor: $c(N.custoPacote('linhas-mista-bambu').total)
              },
              {
                rotulo: 'Só a Lesco, classes 19, 35 e 42',
                apoio: N.pacote('lesco-nominativa').protege,
                valor: $c(N.custoPacote('lesco-nominativa').total)
              },
              {
                rotulo: 'Os dois juntos',
                apoio: N.pacote('juntos').protege + ' · economia de ' +
                       $c(N.economiaJunto('lesco-nominativa', 'linhas-mista', 'juntos')),
                valor: $c(N.custoPacote('juntos').total),
                recomendado: true
              },
              {
                rotulo: 'Os dois juntos, com bambu',
                apoio: N.pacote('juntos-bambu').protege,
                valor: $c(N.custoPacote('juntos-bambu').total)
              }
            ]
          }
        ],
        nota: 'Assessoria em ' + N.inpi.condicoes.parcelasAssessoria + 'x e taxas à vista. Valores pendentes de reconfirmação.'
      },

      {
        layout: 'escolhas',
        label: 'Decisão 2 · Embalagens',
        notes:
          'O IMEDIATO É URGENTE: serve para enviar as amostras de GEO que já existem e estão paradas. Isso precisa ' +
          'ser pedido agora, independente do resto.\n\n' +
          'A escolha de verdade é o tamanho do imediato. A Louise recomenda ' +
          N.numero(N.momentosPedido()[0].linhas[1].qtd) + ' envelopes, metade do que seria preciso para todas as ' +
          'amostras — ela considera suficiente. Pedir todas sobe o imediato para ' + $(N.imediatoTodasAmostras()) + '.\n\n' +
          'SE ELE PERGUNTAR POR QUE NÃO ESPERAR E FAZER DIRETO O LOTE GRANDE: enquanto isso, cada entrega sai com a ' +
          'embalagem atual, que é o problema que viemos resolver. O lote inicial custa mais por unidade, mas permite ' +
          'ajustar o modelo antes de escalar.\n\n' +
          'Os preços são da faixa de 1.000 un e a recotação para estas quantidades está pendente.',
        eyebrow: 'Fechamento · decisão 2 de 5',
        title: 'Embalagens',
        sub: 'Quanto pedir agora. Valores da proposta da 46 Indústria Gráfica.',
        grupos: [
          {
            adiar: 'Adiar o pedido',
            opcoes: [
              {
                rotulo: 'Só o pedido imediato',
                apoio: N.numero(N.momentosPedido()[0].linhas[0].qtd) + ' caixas da GEO e ' +
                       N.numero(N.momentosPedido()[0].linhas[1].qtd) + ' envelopes',
                valor: $(N.momentosPedido()[0].total)
              },
              {
                rotulo: 'Imediato com todas as amostras de GEO',
                apoio: 'Os envelopes vão de ' + N.numero(N.momentosPedido()[0].linhas[1].qtd) + ' para ' +
                       N.numero(N.embalagens.envelopesTodasAmostras) + ' · cenário que a Louise descartou',
                valor: $(N.imediatoTodasAmostras())
              },
              {
                rotulo: 'Imediato e janeiro, os dois',
                apoio: 'O imediato mais ' + N.numero(N.momentosPedido()[1].linhas[0].qtd) + ' caixas grandes e ' +
                       N.numero(N.momentosPedido()[1].linhas[1].qtd) + ' caixas de linha',
                valor: $(N.totalPedido()),
                recomendado: true
              }
            ]
          }
        ],
        nota: 'Preços da faixa de 1.000 un; a recotação para estas quantidades está pendente. As propostas vencem em novembro.'
      },

      {
        layout: 'escolhas',
        label: 'Decisão 3 · Tray',
        notes:
          'Aqui não há escolha de escopo, só de caixa: a Tray é uma só, o que muda é como a entrada é paga.\n\n' +
          'A mensalidade é a mesma nos dois caminhos, e é valor promocional de Black Friday — se passar da data, ' +
          'muda.\n\n' +
          'Primeiro ano fechado, se ele pedir o número: ' + $c(N.primeiroAnoTray()) + '.\n\n' +
          'O que a Tray resolve é o gargalo de frete nos marketplaces, que as duas telas do bloco 04 mostraram.',
        eyebrow: 'Fechamento · decisão 3 de 5',
        title: 'Tray para a Mono',
        sub: 'Como pagar a entrada. A mensalidade é a mesma nos dois caminhos.',
        grupos: [
          {
            adiar: 'Adiar a integração',
            opcoes: [
              {
                rotulo: 'Entrada à vista e mensalidade',
                apoio: 'Mensalidade em valor promocional de Black Friday',
                valor: $c(N.mono.tray.entrada) + ' + ' + $c(N.mono.tray.mensalidade) + '/mês'
              },
              {
                rotulo: 'Entrada parcelada e mensalidade',
                apoio: 'A mensalidade não muda; só a entrada se divide',
                valor: N.mono.tray.parcelas + '× ' + $(N.parcelaTray()) + ' + ' + $c(N.mono.tray.mensalidade) + '/mês'
              }
            ]
          }
        ],
        nota: 'Primeiro ano fechado: ' + $c(N.primeiroAnoTray()) + '. Mensalidade em valor promocional.'
      },

      {
        layout: 'escolhas',
        label: 'Decisão 4 · Mono Creators',
        notes:
          'A frente mais aberta das cinco, e vale dizer isso antes de pedir: a meta de creators por mês e o custo da ' +
          'landing page ainda não estão definidos.\n\n' +
          'O que se pede aqui é a verba de tráfego e o aval para montar a operação — não um número fechado de ' +
          'resultado. A Inbazz já está contratada, então a ferramenta existe; falta alimentar ela.\n\n' +
          'Se ele quiser segurar: adiar não quebra nada hoje, mas adia junto a primeira leva de creators.',
        eyebrow: 'Fechamento · decisão 4 de 5',
        title: 'Mono Creators',
        sub: 'Verba de tráfego para recrutar creators.',
        grupos: [
          {
            adiar: 'Adiar a captação',
            opcoes: [
              {
                rotulo: 'Aprovar a verba e montar a operação',
                apoio: 'Inbazz já contratada · meta por mês e landing page ainda a definir',
                valor: $c(N.mono.creators.verbaTrafego),
                recomendado: true
              }
            ]
          }
        ],
        nota: 'A meta de creators por mês e o custo da landing page ficam para depois da primeira leva.'
      },

      {
        layout: 'escolhas',
        label: 'Decisão 5 · Showroom',
        notes:
          'A ÚLTIMA NÃO É DINHEIRO, É AGENDA. Não sair da sala sem a data.\n\n' +
          'É o único pedido do bloco da Arkos, lá no começo, e ficou guardado até aqui de propósito: depois de ver ' +
          'os dois showrooms lado a lado, a conversa sobre o novo showroom se justifica sozinha.\n\n' +
          'O assunto da reunião: conceito de galeria, com câmaras sensoriais que também servem de sala de reunião, ' +
          'e a definição de posicionamento.\n\n' +
          'Se ele desviar para orçamento de obra, segurar: hoje é só a data.',
        eyebrow: 'Fechamento · decisão 5 de 5',
        title: 'Showroom e posicionamento',
        sub: 'Agenda, não dinheiro.',
        grupos: [
          {
            adiar: 'Adiar a conversa',
            opcoes: [
              {
                rotulo: 'Marcar a reunião',
                apoio: 'Conceito de galeria, com câmaras sensoriais que servem de sala de reunião',
                valor: 'Definir data',
                recomendado: true
              }
            ]
          }
        ],
        recado: 'É o único pedido do bloco da Arkos, e o único que não custa nada.',
        nota: 'A escolha feita aqui fica registrada no slide e sai na exportação em PDF.'
      }

    ]
  };
})();
