# Apresentações Lesco

Slideshow para lives técnicas e apresentações comerciais. Roda no navegador, com
transições animadas entre os slides, notas de apresentador, grade de navegação e
cronômetro.

Sem build, sem `npm install`, sem dependências.

---

## Como abrir

**Windows, um clique:** duplo clique em `ABRIR APRESENTACOES.cmd`. Ele sobe um
servidor local e já abre o navegador. Deixe a janela preta aberta durante a live.

**Qualquer sistema, pelo terminal:**

```bash
node tools/serve.js
```

E acesse `http://localhost:4321`.

**Sem servidor nenhum:** dá para abrir `index.html` direto com duplo clique. Tudo
funciona igual — nada no projeto usa `fetch` nem módulos, justamente para isso.
Se em algum navegador as fontes da marca não carregarem por `file://`, use o
servidor: é o único caso em que ele faz diferença.

---

## Assistir de outro aparelho

Com o servidor rodando, qualquer pessoa na **mesma rede** abre a apresentação no
próprio celular, tablet ou notebook. Ao subir, o servidor imprime o endereço:

```
Na mesma rede (compartilhe este endereço):
  http://172.16.0.22:4321
```

Esse número muda conforme a rede — use sempre o que aparecer na janela. Mande o
link no grupo e cada um navega no próprio ritmo para depois te dar retorno.

Três coisas a saber:

1. **Firewall.** Na primeira vez o Windows pergunta se libera o Node. Autorize
   para **redes privadas**. Sem isso, só a sua máquina enxerga.
2. **Não é espelhamento.** Cada pessoa navega por conta própria; ninguém segue
   o seu slide. Para revisão assíncrona é exatamente o que se quer.
3. **`_source/` não é publicado.** A pasta com o PDF da proposta comercial, o
   manual da marca e as fotos brutas é bloqueada pelo servidor, junto com os
   arquivos ocultos. Quem abre o link vê a apresentação, e só.

Fora da rede local, nada disso fica exposto: o servidor não atravessa o roteador.

---

## Atalhos durante a apresentação

| Tecla | O que faz |
|---|---|
| `←` `→` · `Espaço` | Navegar entre slides |
| número + `Enter` | Pular direto para um slide (ex.: `27` `Enter`) |
| `M` | Menu de controles |
| `G` | Grade com todos os slides — clique para ir |
| `N` | Notas do apresentador (só na sua tela, junto do próximo slide) |
| `D` | Anotar por cima do slide |
| `Ctrl+Z` | Desfazer o último traço |
| `B` | Tela preta, para puxar a atenção de volta para você |
| `F` | Tela cheia |
| `T` · `Shift+T` | Cronômetro: inicia e pausa · zera |
| `Home` · `End` | Primeiro e último slide |
| `?` | Lista de atalhos |
| `Esc` | Fecha o que estiver aberto |

O endereço guarda o slide atual (`#12`). Se o navegador fechar no meio da live,
reabrir no mesmo endereço volta exatamente para onde você estava.

O cromo e o cursor somem sozinhos depois de alguns segundos parados.

---

## Exportar em PDF

**Pelo menu:** abra os controles (`M`) e clique em **Exportar PDF**. O arquivo
baixa em cerca de um minuto e também fica salvo em `export/`. Um slide por
página, com o número no canto — assim dá para pedir correção citando
"slide 12".

**Pelo terminal**, se preferir:

```bash
node tools/export-pdf.js
```

Para outra apresentação, passe o nome da pasta:

```bash
node tools/export-pdf.js nome-da-pasta
```

Os dois caminhos fazem a mesma coisa: abrem a apresentação em `?export`
(slides empilhados, um por página) num Chrome sem interface e mandam
imprimir. Usam o Chrome que já está instalado — nada é baixado.

**O botão só funciona no computador que apresenta.** O servidor recusa o
pedido de exportação vindo da rede: gerar PDF dispara um Chrome, e isso não
pode ficar ao alcance de quem só recebeu o link para assistir. Quem abrir
pelo celular vê o botão, mas ele cai no diálogo de impressão do próprio
aparelho.

**Sem servidor** (apresentação aberta por duplo clique), o botão abre a
versão paginada numa aba e chama a impressão — aí é você que escolhe
"Salvar como PDF".

Para só conferir na tela, sem gerar arquivo, acrescente `?export` ao endereço.

As fotos entram no PDF reduzidas a 1800 px e **reconvertidas para JPEG** —
inclusive as que já eram pequenas e não precisavam encolher. A reconversão é
pelo formato, não pelo tamanho: desde que as fotos do projeto viraram WebP,
pular essa volta fazia o Chrome embutir o WebP cru e o PDF da live saltava de
37 MB para 93 MB sem uma foto ter mudado de resolução.

### Duas armadilhas da paginação

**1. Nada pode ser mais largo que o slide — nem o que está escondido.**
A tira de fotos do deck de números tem 6920 px de trilho, com `overflow:
hidden` por cima. Na tela isso é invisível; ao paginar, o Chrome **conta essa
largura mesmo assim** e encolhe *todas* as páginas do PDF para fazê-la caber.
O sintoma é inconfundível: o slide sai a 66,7% da folha, encostado no canto
superior esquerdo, com o resto preto. Se isso aparecer, procure o elemento
largo — não é o `@page` nem o papel, que continuam corretos.

A tira resolve isso virando estática em `.is-export` (ver `dados.css`): a
segunda cópia some e as fotos dividem a largura da página. No papel nada anda
mesmo, então não se perde nada.

**2. Feche o PDF antes de exportar de novo.**
O Chrome não sobrescreve um arquivo que outro programa está segurando — e
quando isso acontece ele **sai em silêncio, com código 0**. O script
apagava nada e media o arquivo que já estava lá, então anunciava "Pronto"
com o tamanho do PDF velho. Hoje ele apaga o anterior antes de chamar o
Chrome e confere se o novo existe; se não existir, avisa e diz o motivo
provável. Se der esse erro, feche o PDF no leitor e rode de novo.

**3. Um `deck.js` que depende de outro arquivo precisa declarar isso.**
`tools/export-pdf.js` roda o `deck.js` num sandbox para ler título e contagem
de slides. Se ele depender de `dados.js`, a dependência tem que estar em
`antes`, no `decks/decks.js` — senão a exportação morre com "Cannot read
properties of undefined" **antes de abrir o navegador**, e o botão do menu cai
no diálogo de impressão do Chrome, que gera um PDF com o papel errado.

---

## Menu de controles

O botão no canto superior direito (ou a tecla `M`) abre o painel com tudo à mão,
para quando não der para lembrar de atalho no meio da fala:

- **Cronômetro** — iniciar, pausar e zerar, com o tempo em números grandes.
- **Anotar por cima do slide** — ativar, desfazer, limpar e escolher a cor.
- **Exibição** — notas, grade, tela preta, tela cheia e a lista de atalhos.
- **Ir para o slide** — a lista completa, com busca. Digite parte do nome
  (`salt`, `ficha`, `deck`) ou o número e aperte `Enter` para ir ao primeiro
  resultado. É o caminho mais rápido quando alguém pergunta sobre um projeto
  específico no meio da live.

---

## Anotar na tela

`D` liga o modo de anotação e o cursor vira uma caneta: dá para circular um
detalhe, marcar uma medida ou riscar o caminho de montagem enquanto explica.

- Quatro cores: argila, verde da marca, claro e grafite. Escolha pelo menu —
  as duas primeiras funcionam bem sobre foto, as outras sobre fundo liso.
- `Ctrl+Z` desfaz o último traço. **Limpar** apaga tudo do slide atual.
- **Cada slide guarda as próprias anotações.** Anotar, seguir em frente e
  voltar depois devolve o desenho como estava — útil quando a pergunta volta
  para um slide que você já passou.
- `D` de novo (ou `Esc`) desliga a caneta e devolve a navegação normal. O
  desenho continua na tela.

As anotações vivem só naquela sessão do navegador: recarregar a página começa
com a tela limpa.

---

## Editar o conteúdo

Todo o conteúdo de uma apresentação está em um único arquivo (a de números é a
exceção: os valores dela ficam em `dados.js`, ao lado — ver mais abaixo):

```
decks/instalacao-de-estruturas/deck.js
```

Cada item da lista `slides` é um slide. Salve o arquivo e recarregue a página.

Campos que todo slide aceita:

| Campo | Para que serve |
|---|---|
| `layout` | Qual dos 13 modelos usar |
| `label` | Nome do slide na grade (`G`) |
| `notes` | Notas do apresentador — nunca aparecem na projeção |
| `tone` | `'paper'` (claro, padrão) ou `'ink'` (grafite) |
| `transition` | Sobrescreve a transição padrão do layout |
| `drift` | `true` faz a foto respirar devagar durante o slide |

Quebra de linha em título: use `\n`.

### Fotos

Um objeto de foto aceita `{ src, alt, focal, note, draw }`:

- `src` — caminho relativo à pasta da apresentação
- `alt` — descrição da imagem
- `focal` — ponto focal do corte, ex.: `'50% 62%'` para puxar o enquadramento
  para baixo quando o assunto não está no centro
- `note` — texto do **espaço reservado**, usado quando ainda não existe `src`
- `draw` — `true` quando a imagem é **desenho técnico**: aparece inteira e com
  folga, em vez de ser cortada para preencher a moldura como uma fotografia

### Chamada sobre a foto

Aponta um ponto da foto e liga, por um fio em cotovelo, a um quadro branco com
a peça isolada — o recurso das pranchas de detalhe, para mostrar o que está
escondido dentro do conjunto sem precisar de outra fotografia:

```js
{
  layout: 'photo', src: 'img/ekos/e02.webp', alt: '…',
  chamada: {
    src: 'img/tec/tubo-aco.webp', alt: 'Tubo de aço',
    alvo: '19% 8%',       // o ponto apontado
    cotovelo: '55%',      // onde o fio dobra para descer
    caixa: '31% 51%',     // canto superior esquerdo do quadro
    largura: '47%'        // largura do quadro
  }
}
```

O fio sai do ponto na horizontal, dobra no cotovelo e desce até o topo do
quadro, que entra por último e tapa a ponta. Tudo em porcentagem da foto, então
a chamada acompanha o enquadramento em qualquer tela e continua no lugar na
exportação.

Hoje só o layout `photo` repassa a chamada. Se o slide tiver `eyebrow` ou
`title`, a legenda e o véu do layout passam por cima do quadro — para uma
chamada grande, deixe o slide sem legenda.

### Vídeo

No lugar de `src`, um objeto de mídia aceita `{ video, poster, alt }`:

```js
media: { video: 'video/ekos-montagem.mp4', poster: 'img/ekos/e09.webp', alt: 'descrição' }
```

O vídeo entra **mudo e em laço**, começa a tocar sozinho ao chegar no slide e
para — rebobinando — ao sair, então voltar ao slide recomeça do início. Os
controles ficam à mão para pausar num ponto ou ligar o som. Vídeo vertical
aparece inteiro, com tarjas escuras dos lados, em vez de ser cortado.

O `poster` é o que aparece antes de tocar, e é também o que sai na exportação
em PDF, onde nada roda. Vídeo funciona em qualquer layout que aceite foto.

> O servidor responde a *range requests*, que é o que permite arrastar a barra
> do vídeo — e é o que o Safari do iPhone exige para tocar. Abrindo o deck por
> `file://` isso vem do próprio sistema de arquivos e também funciona.

### Desenhos em vetor

Desenhos técnicos desenhados à mão ficam em `drawings.js`, ao lado do `deck.js`,
e entram assim:

```js
media: { svg: 'muxarabi-estrutura', alt: 'descrição' }
```

O SVG é montado a partir de medidas em metros — mudar uma cota refaz a projeção
isométrica sozinha. Ele entra direto no slide, e não dentro de um `<img>`: assim
herda a tipografia e as cores do tema, e continua vetorial na exportação em PDF.

Slides sem foto ainda ficam apresentáveis: a moldura mostra "Foto a inserir"
com a descrição do que vai ali. Quando o material chegar, acrescente `src` ao
lado do `note` — nada mais muda.

### Imagem de fundo

`cover`, `chapter` e `outro` aceitam uma imagem ocupando o slide inteiro:

```js
background: {
  src: 'img/capa-wireframes.webp',
  focal: '50% 62%',
  overlay: 'left'      // 'left' | 'full' | 'bottom' | false
}
```

O `overlay` é o véu que garante contraste para a tipografia. `'left'` escurece
mais o lado do texto e deixa a imagem respirar do outro — é o que a capa usa.
`false` dispensa o véu quando a imagem já é escura o bastante.

A arte da capa foi montada a partir dos desenhos técnicos vetoriais da linha
Shield: o traço preto virou traço claro com transparência, e por isso ele
compõe direto sobre o grafite. Os PDFs de origem e os scripts que geraram a
imagem estão em `_source/shield/`, com um LEIA-ME explicando como refazer.

### Valores pendentes

Em fichas técnicas, escrever `'a confirmar'` no valor deixa a linha visivelmente
pendente no slide. Serve de lembrete do que falta fechar antes da live.

---

## Os 13 layouts

```js
// Capa da apresentação
{ layout: 'cover', eyebrow, title, footer, background }

// Sumário numerado (a numeração é automática)
{ layout: 'index', title, items: [{ name, tag }] }

// Abertura de projeto, com o número gigante
{ layout: 'chapter', num, eyebrow, title, footer, background }

// Texto à esquerda, tabela de dados à direita
{ layout: 'split', eyebrow, title, text, rows: [[label, valor]], note }

// Três números grandes (contam na entrada)
{ layout: 'stats', title, sub, items: [{ eyebrow, caption, value, unit, accent }] }

// Ficha técnica com o desenho do perfil
{ layout: 'specs', eyebrow, title, rows: [[label, valor]], figure, figureAlt }

// Foto de página inteira, com legenda opcional por cima
{ layout: 'photo', src, alt, focal, eyebrow, title }

// Título e duas fotos lado a lado
{ layout: 'duo', title, sub, media: [foto, foto] }

// Foto grande com um bloco de texto ao lado
{ layout: 'detail', media: foto, eyebrow, title, text }

// Texto e foto sangrando pela metade da tela
{ layout: 'half', eyebrow, title, text, media: foto, reverse, align: 'bottom' }

// Lista numerada em duas colunas
{ layout: 'checklist', title, items: ['...', '...'] }

// Três cards com imagem de produto
{ layout: 'cards', title, sub, items: [{ label, src, alt }] }

// Encerramento
{ layout: 'outro', title, left, right, background }
```

Em `stats`, marque **um** card com `accent: true` — nunca mais de um por slide.

---

## A apresentação de números (`numeros-comerciais-china`)

Revisão comercial e de marketing para o CEO apresentar a parceiros na China.
É **em inglês** e tem oito layouts que as outras apresentações não têm — os de
gráfico. Eles vivem só nessa pasta, acrescentados a `window.DeckLayouts` depois
que `engine/layouts.js` carrega, de modo que o motor e a outra apresentação
continuam exatamente como estavam.

```
decks/numeros-comerciais-china/
  dados.js           >>> TODOS os números ficam aqui <<<
  deck.js            os slides, sem um número escrito dentro
  layouts-dados.js   os oito layouts de gráfico
  dados.css          o estilo deles
  mapa-brasil.js     o desenho dos 27 estados
```

**Para corrigir um valor, mexa em `dados.js` e em mais nada.** O `deck.js` só
aponta para os campos e formata com os auxiliares de lá, então não existe
número escrito em dois lugares para divergir.

| Layout | Para que serve |
|---|---|
| `bignum` | Um número gigante, com variação e coluna de apoio |
| `barras` | Barras horizontais ordenadas (até doze) |
| `pilha` | Uma barra 100% repartida, com legenda |
| `colunas` | Colunas verticais, uma ou duas séries |
| `rosca` | Rosca com a legenda fazendo as vezes de tabela |
| `mapa` | O Brasil por estado, com ranking ao lado |
| `marquee` | Tira de fotos atravessando a página |
| `parallax` | Foto inteira com camadas em velocidades diferentes |

**Nenhum gráfico tem cor.** O que separa uma série da outra é a opacidade da
mesma tinta, em cinco degraus (`--f1` a `--f5` em `dados.css`), mais o contorno
puro para "sem dado". Resolve projetor desbotado, impressão em preto e branco e
daltonismo de uma vez só. O verde da marca aparece uma vez por slide, no filete
do eyebrow, e em nenhum gráfico.

### Moeda

Os valores nascem em real, no CRM e na planilha, e são convertidos na hora de
exibir. A cotação é uma linha em `dados.js`:

```js
var CAMBIO = 5.05;   // R$ por US$ 1,00 — 19/10/2026
```

Trocar esse número troca a apresentação inteira, inclusive os rodapés que
declaram a cotação.

### A senha

Esta apresentação pede senha; a live técnica abre direto. Para trocar:

```bash
node tools/senha.js numeros-comerciais-china
```

O comando pergunta a senha sem ecoar na tela, sorteia um sal novo e grava
`trava-senha.js` com o **hash**. A senha em si não fica escrita em arquivo
nenhum — guarde-a você.

**A trava não pede nada em `file://`, `localhost` nem `127.0.0.1`.** Quem está
nesses endereços já tem os arquivos na mão, e pedir senha ali só quebraria a
exportação em PDF, que abre `http://127.0.0.1:4321/…?export` num Chrome sem
interface. Para ver a tela de senha mesmo estando local, acrescente `?trancar`.

Enquanto a senha não confere, `engine/deck.js` nem é carregado: quem carrega é
`trava.js`, depois do acerto. Então não existe slide no documento para ser
inspecionado antes disso.

> **O que a senha protege, e o que não protege.** Ela protege a **tela** de
> quem abre a apresentação de outra máquina — o caso de passar o endereço da
> rede do escritório para alguém dar retorno. Ela **não** protege o
> **arquivo**: `dados.js` é um .js servido ao lado, e quem digitar o endereço
> dele no navegador lê os números sem passar pela trava. O mesmo vale para
> quem abre o repositório, que é público. Isso não é falha de implementação —
> é o limite de qualquer senha em site estático, onde o conteúdo precisa
> chegar ao navegador para ser desenhado. Fechar isso de verdade é tornar o
> repositório privado.
>
> O hash vai para o repositório junto com o resto, então é atacável offline
> por quem clonar: **não reaproveite aqui uma senha usada em outro lugar.**

A conferência é SHA-256 repetido 120 mil vezes sobre sal+senha, escrito à mão
em `trava.js`. Não dá para usar `crypto.subtle`: ele só existe em contexto
seguro, e `http://192.168.x.x:4321` — exatamente o endereço que a trava existe
para proteger — não é contexto seguro. As 120 mil voltas são de propósito:
deixam a conferência em torno de 0,9 s no navegador e, na mesma medida,
encarecem tentar adivinhar a senha a partir do hash publicado.

### O mapa

`mapa-brasil.js` é gerado, não escrito à mão. Sai de um GeoJSON do IBGE,
reprojetado em Albers equal-area cônica e simplificado por Douglas-Peucker até
caber em 37 KB. Para refazer, com outro GeoJSON ou outra tolerância:

```bash
node tools/mapa-brasil.js caminho/do/br_states.geojson decks/<pasta>/mapa-brasil.js
```

O `cx`/`cy` de cada estado é o centróide, usado para ancorar o rótulo. Brasília
é pequena demais para receber rótulo no mapa — quem carrega esse dado é o
ranking ao lado.

---

## Criar uma apresentação nova

1. Copie a pasta `decks/instalacao-de-estruturas/` com outro nome.
2. Apague as fotos que não servem e coloque as novas em `img/` dentro dela.
3. Reescreva o `deck.js`. O `index.html` não precisa de nenhuma alteração.
4. Acrescente o nome da pasta em `decks/decks.js`.

A página inicial se atualiza sozinha: título, subtítulo, contagem de slides e a
foto de capa são lidos do próprio `deck.js`, então não existe informação
duplicada para desencontrar.

Se o `deck.js` depender de outro arquivo da mesma pasta — uma tabela de números,
por exemplo —, troque o nome solto por um objeto no registro e diga o que vem
antes. Sem isso a página inicial quebra ao montar o card, que é a única coisa
que ela faz com o conteúdo:

```js
window.DECKS = [
  'instalacao-de-estruturas',
  { id: 'numeros-comerciais-china', antes: ['dados.js'] }
];
```

Uma apresentação pode usar as fotos de outra sem copiá-las, apontando para
`../<outra-pasta>/img/…`. É o que a de números faz: são 342 MB de original de
obra que não precisam existir duas vezes no disco.

---

## Transições

Cada layout já tem a transição que combina com ele, e qualquer slide pode
sobrescrever com `transition`.

| Nome | Efeito | Usada por padrão em |
|---|---|---|
| `curtain` | Cortina vertical, conteúdo sobe atrás | `cover`, `chapter`, `outro` |
| `mask` | Máscara lateral, foto assenta em parallax | `photo`, `detail`, `half` |
| `stagger` | Elementos revelam em cascata | slides de conteúdo |
| `push` | Deslocamento lateral com profundidade | — |
| `fade` | Dissolve simples | — |

Voltar um slide desfaz o movimento em vez de repeti-lo. Quem pediu menos
movimento no sistema operacional recebe fades curtos no lugar das animações.

---

## Estrutura

```
index.html                     página inicial, lista as apresentações
ABRIR APRESENTACOES.cmd        atalho de um clique (Windows)

engine/                        o motor — compartilhado por todas as apresentações
  deck.js                      navegação, transições, pré-carregamento
  layouts.js                   os 13 renderizadores de layout
  stage.css                    palco, cromo, grade, painel de notas
  layouts.css                  os layouts
  transitions.css              as transições

theme/                         identidade visual
  tokens.css                   cores, tipografia, espaçamento, movimento
  fonts.css                    fontes da marca
  hub.css                      estilo da página inicial

shared/
  brand/                       logos e símbolo
  fonts/                       PP Neue Machina e PP Object Sans

decks/
  decks.js                     registro das apresentações
  instalacao-de-estruturas/
    index.html                 só a moldura
    deck.js                    >>> o conteúdo fica aqui <<<
    img/                       as fotos desta apresentação
  numeros-comerciais-china/    revisão comercial, em inglês
    index.html                 a moldura, com os arquivos a mais
    deck.js                    os slides
    dados.js                   >>> os números ficam aqui <<<
    layouts-dados.js           os oito layouts de gráfico
    dados.css                  o estilo deles
    mapa-brasil.js             o desenho dos estados (gerado)

export/                        PDFs de revisão gerados
tools/serve.js                 servidor local, sem dependências
tools/export-pdf.js            gera o PDF de revisão
tools/mapa-brasil.js           regera o mapa a partir de um GeoJSON
_ds/                           design system Lesco, como referência
_source/                       material de origem (PDF, fotos brutas, arquivo original)
```

Para mudar o conteúdo, mexa em `decks/<nome>/deck.js`. Para mudar a aparência de
todas as apresentações de uma vez, mexa em `theme/tokens.css`.

---

## Sobre a paleta

Os neutros quentes conduzem: papel `#f4efe6` e tinta `#1a1a1a`. O verde da marca
entra só como acento — numeração dos capítulos, filete antes dos rótulos, barra
de progresso, um card em destaque. As capas e aberturas de projeto, que antes
eram verdes, agora são grafite, o que deixa as fotos de obra com o protagonismo.

Trocar o acento de toda a apresentação é uma linha em `theme/tokens.css`:

```css
--accent: #94a291;
```

---

## Pré-carregamento das imagens

As fotos são os originais de obra, com vários megabytes cada. O motor mantém uma
fila com prioridade: aquece os três primeiros slides antes de começar, e a cada
navegação joga os quatro slides seguintes para o topo da fila, mais o anterior
(voltar é comum ao responder pergunta). Se mesmo assim uma foto não estiver
pronta na hora da troca, o motor espera no máximo 400 ms e segue — numa live,
atraso é pior do que um quadro imperfeito.

Na prática: dá para começar a apresentar poucos segundos depois de abrir, sem
esperar 342 MB de fotos carregarem.

---

## GitHub e Vercel

O projeto vive em `github.com/gowlarte/lesco-deck-26`, repositório **privado**,
e é publicado pela Vercel a partir da branch `main`. Todo push redeploya.

`_source/` e `export/` ficam de fora do versionamento: o primeiro é material de
origem — PDFs, manual da marca e as fotos de obra em resolução cheia —, o
segundo é saída gerada.

### A barra no fim da URL — leia antes de mexer no `vercel.json`

```json
{ "trailingSlash": true }
```

Essa linha não é enfeite. Sem ela, a Vercel redirecionava
`/decks/<pasta>/index.html` para `/decks/<pasta>`, **sem a barra no fim** — e
sem a barra o navegador resolve todo caminho relativo um nível acima. `deck.js`
virava `/decks/deck.js`, `dados.js` virava `/decks/dados.js`, os dois davam 404,
e o resultado era a live reclamando de `window.DECK` e o deck de números parado
no "Preparando a apresentação".

Local nada disso aparece: `tools/serve.js` não redireciona, e por `file://` o
problema não existe. É falha que só nasce no deploy.

Então: **não troque `trailingSlash` por `cleanUrls`.** `cleanUrls` é
justamente quem tirava a barra. Se um dia o deploy voltar a abrir em branco,
abra o console do navegador e veja se os `.js` da pasta do deck estão vindo 404
— é este bug de volta.

### Proteção

A senha de `trava.js` protege a **tela**, não o **arquivo** (ver *A senha*,
acima). Num site publicado, quem abrir
`.../decks/numeros-comerciais-china/dados.js` lê os números sem passar por ela.
Para fechar isso de verdade, a proteção tem que estar na Vercel, antes do
arquivo sair do servidor: **Password Protection** no plano Pro, com o escopo
**All Deployments** — o escopo padrão deixa o domínio de produção aberto.
