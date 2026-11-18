# As imagens desta apresentação

Três origens, e nenhuma foto solta: tudo que está aqui aparece em alguma
tela. Se um arquivo deixar de ser usado, ele sai da pasta.

## `arkos/` — como a Arkos se sustenta

Três fotos da visita, cada uma numa tela própria do bloco de abertura.

| Arquivo | Tela | Qual é a foto |
|---|---|---|
| `amostras-estante.webp` | 4 · Imagem impecável | a estante com as amostras em caixas coloridas e etiquetadas, e a publicação aberta no balcão |
| `almanaque.webp` | 6 · Publicações anuais | a capa do almanaque de 2026, preta, com a foto aérea da casa |
| `almanaque-aberto.webp` | 6 · Publicações anuais | o mesmo almanaque aberto numa página de amadeirados, **com o QR code impresso no canto** |

As duas do almanaque vieram deitadas do celular e foram giradas 90° no
`ffmpeg` (`transpose=1`). Todas estão em 900 × 1200, que é 3:4 em pé — e o
layout `topico` tem teto de largura (uma foto) ou de altura (duas) justamente
para não deformar essa proporção. Se alguma aparecer esticada ou cortada, é
nesse teto que se mexe, em `graficos.css`, não na foto.

**As duas telas sem foto são sem foto de propósito.** A ação contra a
concorrência não se fotografa, e o showroom que viaja só teria como ilustração
as mesmas fotos que as telas dos dois showrooms usam logo a seguir.
Repetir foto a essa distância custa mais do que a tela ganha.

## `arkos/` e `lesco/` — os dois showrooms

As cinco vieram do deck `showroom-e-posicionamento`, que já fazia esta
comparação. **A tela 10 é a página 16 de lá**, trazida para cá porque é ela
que explica, sem argumento nenhum, por que o rebrand e a embalagem são
urgentes.

| Arquivo | Tela | Qual é a foto |
|---|---|---|
| `arkos/parede.webp` | 8 · fundo inteiro | a parede de madeira com AMANTES DE BOA ARQUITETURA em letra de metal, e a mesa de reunião sobre o deck |
| `arkos/showroom.webp` | 9 · esquerda | a vista ampla: forro ripado, balcão curvo iluminado e a estante de amostras por cor |
| `lesco/armarios.webp` | 9 · direita | a vista larga do escritório de São Paulo, com os armários e a parede de folhagem |
| `arkos/amostras.webp` | 10 · esquerda | o expositor com os perfis em pé e as letras ARKOS contra a janela |
| `lesco/mesa-amostras.webp` | 10 · direita | a mesa de reunião com os perfis empilhados e as caixas de papelão abertas ao lado |

São cópias, e não atalhos para a pasta do outro deck: cada apresentação
tem que abrir sozinha, inclusive em `file://` e dentro do sandbox do
`tools/export-pdf.js`.

**Sobre a `mesa-amostras.webp`:** existe uma foto da mesma sala arrumada, e
ela não serve. Arrumada, a cena deixa de dizer o que a tela 10 diz — e a
caixa de papelão é justamente a dobradiça para o bloco de embalagens.
Não trocar por uma foto mais limpa.

Todas são verticais (900 × 1600, de celular ou de campanha) e entram em
molduras deitadas, então cada uma tem `focal` no `deck.js` puxando o corte
para a faixa que interessa. Se alguma parecer mal enquadrada na projeção,
é esse número que se ajusta, não a foto.

## `id/` — as peças da identidade de 2027

Saíram do `_source/uploads/LESCO-ID-VISUAL-2027.pdf`, extraídas dos JPEGs
embutidos no próprio arquivo e recortadas com o `ffmpeg`.

| Arquivo | Tela | Qual é a peça |
|---|---|---|
| `id/pasta-tecnica.webp` | 17 · a grande | a pasta de documentação técnica aberta, com a frase da assinatura impressa |
| `id/geo.webp` | 17 · direita, em cima | a pasta da GEO, com a marca nova da Lesco no cartão interno |
| `id/paleta.webp` | 17 · direita, embaixo | a paleta de amostras e a papelaria |

**Por que estas três.** A tela 17 parou de defender a identidade e passou a
só mostrá-la, então as peças têm de carregar a tela sozinhas, sem legenda.
A pasta técnica tem a frase da assinatura, a tipografia e as duas cores no
mesmo quadro. A da GEO é a que mais vale apontar: é a mesma GEO que o bloco
está registrando, e prova que a identidade nova desce para as marcas da
casa. A paleta amarra com os showrooms do bloco anterior — é a amostra que
chega no cliente, agora vestida.

**O cuidado que a tela toma na cara:** são estudos do manual, **não** são as
peças que a 46 Indústria Gráfica orçou. A nota de rodapé da tela diz isso,
porque confundir as duas coisas custaria caro numa reunião cujo assunto
seguinte é justamente o preço da embalagem.

**Os recortes.** A peça grande fica numa moldura de ~1,5 e as duas menores
em ~1,85 — é a conta do layout `galeria`, e é a faixa em que os mockups do
manual (todos deitados, com margem sobrando) cortam sem perder a peça. A
`geo.webp` é um recorte da metade de cima do JPEG original, que trazia a
pasta fechada e a aberta no mesmo quadro.

### As que ficaram de fora

- **A caixa azul e as pastas em areia.** Estavam na tela quando ela tinha
  duas fotos e um argumento. Saíram quando virou galeria de três: a caixa
  era a peça mais fácil de confundir com a embalagem orçada, e as pastas
  em areia diziam a mesma coisa que a pasta técnica, com menos no quadro.
- **A fita de embalagem.** Boa foto, e a terceira vaga foi para a paleta,
  que liga com o bloco dos showrooms. Está no PDF para quem quiser.
- **O render de arquitetura.** Bonito, e não sustenta argumento nenhum
  numa reunião de orçamento. Está no PDF para quem quiser.

## `emb/` — as embalagens já orçadas

Três das quatro peças que a 46 Indústria Gráfica orçou, do mesmo manual.
Elas abrem o bloco de embalagens, antes de qualquer número, e são as mesmas
que os dois gráficos seguintes decompõem. A quarta é a carteira, que fica
na tela 17 por ser peça da identidade antes de ser item de orçamento.

| Arquivo | Tela | Qual é a peça |
|---|---|---|
| `emb/caixas-linha.webp` | 20 · a grande; 21 e 22 · faixa | as quatro caixas de linha, uma cor por linha |
| `emb/caixa-grande.webp` | 20 · direita, em cima; 21 a 24 · faixa | a caixa grande, comprida, verde por fora e terracota por dentro |
| `emb/caixa-geo.webp` | 20 · direita, embaixo; 23 e 24 · faixa | a caixa de amostras da GEO |

**As mesmas três voltam nos quatro gráficos**, pequenas, no alto à direita: a
tela 20 mostra o que se compra, e as de 21 a 24 põem a peça ao lado do número
que a mede. Os nomes embaixo das fotos saem de `dados.js`, do mesmo campo que
a legenda usa.

**A das quatro cores é uma montagem**, e é honesta: o manual mostra as quatro
caixas numa página só, mas no PDF elas são quatro imagens separadas — duas
em JPEG e duas em FlateDecode, que a extração antiga nem via. As quatro foram
recortadas na mesma altura e remontadas 2×2, como a página as põe. Os fundos
cinza-claros emendam sem costura visível no tamanho em que a tela as mostra.

**As quatro peças orçadas, pela medida — confirmadas em 18 de novembro de
2026.** A medida é o que identifica cada uma; o nome muda conforme quem
fala.

| Medida | A peça | Onde está a foto |
|---|---|---|
| 500×200×150 mm | a caixa grande, que leva as menores dentro | `emb/caixa-grande.webp` |
| 250×200×60 mm | as caixas menores, uma por linha, dentro da grande | `emb/caixas-linha.webp` |
| 250×60×100 mm | a caixa da GEO | `emb/caixa-geo.webp` |
| 250×150 mm | o envelope, também chamado de **carteira** | `id/geo.webp`, na tela 17 |

**A caixa da GEO e o envelope são peças diferentes, e as duas foram
orçadas.** Vale escrever porque a versão anterior deste arquivo dizia o
contrário: tinha juntado as duas numa linha só de orçamento. A carteira é
plana, 250×150 mm, e vai nela a amostra de pedra flexível — é a peça que a
tela 17 mostra. A caixa da GEO é um volume, 250×60×100 mm, e é a que
aparece na tela 20.

**Em `dados.js` cada uma tem o seu componente:** `caixaGrande` (500×200×150),
`caixaLinha` (250×200×60), `caixaGeo` (250×60×100) e `envelope`, a carteira
(250×150). O pedido imediato da GEO aponta para `caixaGeo` desde 18 de nov.
de 2026 — antes ele usava `caixaLinha`, que é outra peça. O total não mudou
com a separação, porque o preço não mudou.

**E o preço é o ponto que continua aberto.** A proposta da 46 traz *dois*
itens em 250×60×100: a flat, a R$ 5,99 na faixa de 1.000 un, e a tampa e
base, a R$ 14,59. O `caixaGeo` ficou com os R$ 5,99 porque era o que o
modelo antigo já usava, e separar a peça não era hora de trocar o número.
Se a caixa da GEO for a tampa e base, as 400 unidades do imediato sobem —
e é uma decisão de quem leu a proposta, não de quem mexe no deck.

**Mesmo com a correspondência fechada, a tela não põe preço na foto.** As
peças aparecem sem legenda e sem valor porque é isso que o bloco pede: esta
tela mostra o que se compra, e o gráfico de composição, duas telas adiante,
diz quanto custa. Rotular aqui seria dizer a mesma coisa duas vezes — e um
preço escrito à mão numa legenda é exatamente o número que diverge de
`dados.js` na primeira vez que alguém mexe no orçamento. Pelo mesmo motivo
a tabela acima dá o nome do componente, e não o valor dele.

## `marcas/` — a página das três marcas

As três fotos da página 23, nas posições que o próprio PDF declara. A da casa
na mata vem **recortada como o PDF a recorta**: lá ela entra maior que a
janela e sobra para fora, então o recorte foi feito no arquivo em vez de ser
resolvido no CSS — assim a moldura não precisa de deslocamento nenhum.

| Arquivo | Posição na página | O que é |
|---|---|---|
| `marcas/parede-entalhada.webp` | 212, 368 · 274×238 | o painel entalhado com pinheiro e garças |
| `marcas/laminas-azuis.webp` | 889, 259 · 581×339 | a parede de lâminas azuis, com alguém passando |
| `marcas/casa-na-mata.webp` | 487, 606 · 402×269 | a casa de concreto e vidro dentro da mata |

Os logotipos e os símbolos **não** são imagem: são vetor, em `marcas.js`.

Seis dos sete desenhos saíram dos operadores de página do PDF. O sétimo, o
símbolo da echo, é o grafismo oficial de
`ASSETS/GRAFISMOS/elemento-echo.svg`, que em 18 de nov. de 2026 substituiu a
estrela que vinha do manual. Ele traz a própria cor (`#c2dad6`) e o próprio
viewBox, e entra encaixado na mesma caixa de 191×193 que a estrela ocupava,
para a composição da página não se mexer.

## `marca-lesco.svg` e `marca-lesco-terracota.svg`

O logo de 2027 **em vetor**, não em print. Os caminhos vêm de
`logo-final.svg`, o arquivo de vetor que a Lesco mantém no Drive, em
`MKT/LESCO/COMUNICAÇÕES/03 - IDV E LOGOTIPO`.

**Em 18 de nov. de 2026 o logo foi reajustado**: o L ficou menos redondo —
a haste desce mais antes de virar e a curva de saída é mais fechada — para
a tipografia aguentar ser usada sem o símbolo. Só o L mudou; o símbolo, as
outras letras e o ® são os mesmos. A primeira versão daqui tinha sido
convertida dos operadores de página do PDF do manual, e o PDF em
`_source/uploads/` ainda é o anterior: **a origem destes arquivos passou a
ser o SVG**, que é exato e não precisa de conversão.

- `marca-lesco.svg` — preenchimento em `currentColor`, para tingir pelo CSS.
  É a versão embutida em `marca.js`, que o motor usa na tela 16.
- `marca-lesco-terracota.svg` — a mesma coisa com a cor da marca embutida.
  Serve à capa, onde a marca entra como `<img>` e um `<img>` não herda cor.

Se a paleta mudar, é a segunda que se regera a partir da primeira.
