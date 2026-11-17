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
            texto: 'Forro ripado, balcão curvo iluminado, as amostras organizadas por cor e plintos de exposição.'
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
          'É o mesmo momento da conversa dos dois lados — o cliente pede para ver o material. À esquerda, um plinto ' +
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
            alt: 'Plinto de exposição da Arkos com perfis de fachada em pé e as letras ARKOS recortadas contra a janela',
            focal: '50% 56%',
            texto: 'Um plinto desenhado para isso, com os perfis em pé e a marca recortada contra a cidade.'
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
         Pedido: aprovar o registro de GEO, ZHÜ e ECHO, a ampliação da
         marca Lesco para novas categorias e o rebrand com logo novo.
         =============================================================== */

      {
        layout: 'chapter',
        label: '02 · INPI e rebrand',
        notes:
          'A capa do bloco. Serve para dar o fôlego entre a Arkos e o dinheiro: a conversa muda de assunto aqui.\n\n' +
          'O número 02 é o mesmo da pauta — se ele perguntar onde estamos, é só apontar.\n\n' +
          'Dizer o pedido inteiro de uma vez, antes de abrir os números: registrar GEO, ZHÜ e ECHO, ampliar a ' +
          'marca Lesco para novas classes e trocar o logo em 2027. As três coisas são uma decisão só.',
        num: '02',
        eyebrow: 'Pauta, bloco 02',
        title: 'INPI\ne rebrand',
        footer: 'Registrar GEO, ZHÜ e ECHO, ampliar a marca Lesco para novas classes e trocar o logo em 2027.'
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
         2027 ficou pronto: a marca nova e a marca aplicada. Elas vêm
         ANTES do slide que pede a aprovação do rebrand, de propósito —
         é mais fácil decidir vendo do que lendo a descrição.

         As imagens são do próprio manual (ver img/LEIA-ME.md). As peças
         da segunda tela são estudos da identidade, não são as embalagens
         que a 46 orçou — o rodapé diz isso na tela, porque a confusão
         entre as duas coisas custaria caro no bloco seguinte.
         --------------------------------------------------------------- */

      {
        layout: 'marca',
        label: 'A marca nova',
        notes:
          'Ficar calado um segundo depois de trocar o slide. A comparação é o argumento.\n\n' +
          'O que mudou não é só o desenho: o logo de hoje é uma palavra com um degradê, e o de 2027 é uma marca — ' +
          'tem símbolo, tem cor própria e tem uma frase que diz o que a empresa faz.\n\n' +
          'A cor é terracota, e o fundo verde escuro é o par que o próprio manual usa. Os dois saem da mesma paleta, ' +
          'e é a paleta que está vestindo esta apresentação inteira: se ele reparar que o deck mudou de cor, foi ' +
          'de propósito — é a identidade nova aplicada.\n\n' +
          'Se perguntarem quem fez: o manual é o LESCO-ID-VISUAL-2027. O desenho que está nesta tela saiu direto ' +
          'do arquivo, em vetor — não é foto de tela.',
        eyebrow: 'INPI e rebrand',
        title: 'A marca nova',
        sub: 'O logo de hoje e o de 2027, na mesma largura.',
        antes: {
          src: '../../shared/brand/logo-dark.png',
          alt: 'Logo atual da Lesco: a palavra LESCO com um traço em degradê',
          etiqueta: 'Hoje',
          apoio: 'Uma palavra e um degradê. Sem símbolo, sem cor própria.'
        },
        depois: {
          svg: 'marca-lesco',
          alt: 'Marca nova da Lesco, de 2027',
          etiqueta: '2027',
          assinatura: 'Arquitetura feita para o amanhã.',
          apoio: 'Símbolo, cor própria e uma frase que diz o que a empresa faz.'
        },
        nota: 'Marca, paleta e tipografia do manual LESCO-ID-VISUAL-2027. O desenho vem do vetor do próprio arquivo.'
      },

      {
        layout: 'duo',
        label: 'A identidade aplicada',
        notes:
          'O que a aprovação do rebrand produz, em peça. Dois estudos do manual: a pasta de documentação técnica e ' +
          'a caixa.\n\n' +
          'ATENÇÃO AO MAL-ENTENDIDO, e é melhor dizer antes que ele pergunte: estas peças são estudos da ' +
          'identidade, NÃO são as embalagens que a 46 orçou. A caixa da foto não é a caixa de ' +
          $(N.componente('caixaGrande').centavos) + ' do bloco seguinte. O que esta tela mostra é a linguagem; ' +
          'o que o bloco de embalagens mostra é o custo.\n\n' +
          'A ligação entre as duas coisas é direta: aprovar o rebrand agora é o que permite mandar imprimir a ' +
          'embalagem nova já com a identidade certa, em vez de imprimir duas vezes.',
        eyebrow: 'INPI e rebrand',
        title: 'A identidade aplicada',
        /* Duas fotos, e não três: as peças do manual são todas deitadas, e
           num grid de três colunas o corte vira retrato e desmonta a
           composição — a frase da caixa ficava cortada no meio. */
        sub: 'Estudos do manual — não são as embalagens que a 46 orçou.',
        media: [
          {
            src: 'img/id/pasta.webp',
            alt: 'Pastas de documentação técnica da Lesco em areia e verde escuro, com a marca nova em recorte',
            focal: '50% 50%'
          },
          {
            src: 'img/id/caixa-nova.webp',
            alt: 'Caixa de papelão em azul claro com a marca nova em terracota e a frase arquitetura feita para o amanhã',
            /* Puxado para a esquerda: no centro, o corte come o A de
               ARQUITETURA na lateral da caixa. */
            focal: '34% 50%'
          }
        ]
      },

      {
        layout: 'duas',
        label: 'Logo novo em 2027',
        notes:
          'Três perguntas vão vir. As respostas:\n\n' +
          'POR QUE NÃO SÓ AJUSTAR O LOGO ATUAL? O ajuste já foi desenhado e não muda a percepção — continua lendo ' +
          'como marca de menor valor. Para disputar com a Arkos, a mudança precisa ser visível para quem já conhece ' +
          'a marca. Meio-termo aqui é dinheiro gasto sem resultado.\n\n' +
          'E O REGISTRO DO LOGO ANTIGO? A proteção do nome vem dos pedidos nominativos e não depende do logo. Se o ' +
          'logo antigo tiver registro próprio, ele continua válido — mas pode ser contestado depois de cinco anos ' +
          'sem uso no Brasil.\n\n' +
          'ISSO AFETA A OPERAÇÃO LÁ FORA? Não. Seguimos com o logo antigo fora do Brasil até decidirmos outra coisa.\n\n' +
          'O depósito do logo novo ainda NÃO está no orçamento da Registre.se, e depende de busca de anterioridade. ' +
          'É por isso que o valor dele aparece como "a definir" no resumo.',
        eyebrow: 'INPI e rebrand',
        title: 'Logo novo em 2027',
        sub: 'Pedido: aprovar o registro de GEO, ZHÜ e ECHO, a ampliação da marca Lesco para novas categorias e o rebrand com logo novo.',
        colunas: [
          {
            titulo: 'Proposta',
            texto: 'Logo totalmente novo. O refinamento desenhado antes mantinha a mesma leitura de marca de menor valor. ' +
                   'A meta é começar 2027 com a identidade nova em todos os pontos de contato no Brasil.'
          },
          {
            titulo: 'Ponto jurídico',
            texto: 'Não há barreira jurídica para trocar o logo na comunicação dentro do Brasil. Os pedidos da Lesco são ' +
                   'nominativos e protegem o nome, que continua o mesmo independente do desenho. ' +
                   'Fora do país nada muda: mantemos o logo antigo e os registros como estão.'
          }
        ],
        destaque: {
          label: 'Condição',
          texto: 'Depositar o logo novo no INPI no mesmo pacote de GEO, ZHÜ e ECHO, depois de uma busca de anterioridade. ' +
                 'Esse pedido ainda não está no orçamento da Registre.se.'
        }
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
          'Ponto em aberto que vale registrar: ainda não está definido qual item da proposta da 46 é a caixa de linha ' +
          'de ' + $(N.componente('caixaLinha').centavos) + ' — a flat 250×200×60 mm, cotada só em 6.000 un, ou a flat 250×60×100 mm.',
        eyebrow: 'Embalagens',
        title: 'Composição do kit',
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
          'Duas telas: o resumo de valores e a lista de decisões, que é marcável na hora. A meta é não sair ' +
          'daqui com nenhuma frente em aberto.',
        num: '06',
        eyebrow: 'Pauta, bloco 06',
        title: 'Fechamento',
        footer: 'O resumo de valores e a tela de decisões, para marcar na reunião.'
      },

      {
        layout: 'tabela',
        label: 'Resumo de valores',
        notes:
          'Tudo que depende de aprovação, numa tela só.\n\n' +
          'Se ele quiser o número cheio: INPI nos dois pacotes juntos ' + $c(juntos.total) + ', embalagens ' +
          $(N.totalPedido()) + ' em dois tempos, Tray ' + $c(tray.entrada) + ' mais ' + $c(tray.mensalidade) + ' por mês, ' +
          'e ' + $c(N.mono.creators.verbaTrafego) + ' de tráfego para os creators.\n\n' +
          'O rebrand é o único item sem valor fechado — o depósito do logo depende da busca de anterioridade e ainda ' +
          'não está orçado.\n\n' +
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

      {
        layout: 'decisoes',
        label: 'Decisões',
        notes:
          'A tela de marcar. Clicar no status registra ali mesmo, e fica — dá para voltar no slide depois e a ' +
          'marcação continua. Se exportar o PDF no fim da reunião, ele sai com o que foi decidido.\n\n' +
          'Passar item por item, sem pular. Para cada um: Aprovado, Ajustar ou Adiar.\n\n' +
          'O último não é dinheiro, é agenda: a data da reunião sobre showroom e posicionamento. Não sair da sala ' +
          'sem ela.\n\n' +
          'Se algum item ficar em "Ajustar", anotar na hora o que precisa mudar — senão a semana que vem começa com ' +
          'a dúvida de novo.',
        eyebrow: 'Fechamento',
        title: 'Decisões',
        sub: 'O que precisa ser aprovado hoje. Clique para marcar o status durante a reunião.',
        opcoes: ['Aprovado', 'Ajustar', 'Adiar'],
        items: N.decisoes(),
        nota: 'A marcação feita aqui fica registrada no slide e sai na exportação em PDF.'
      }

    ]
  };
})();
