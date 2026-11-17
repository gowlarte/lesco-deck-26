# As imagens desta apresentação

Três origens, e nenhuma foto solta: tudo que está aqui aparece em alguma
tela. Se um arquivo deixar de ser usado, ele sai da pasta.

## `arkos/` — como a Arkos se sustenta

Três fotos da visita, cada uma numa tela própria do bloco de abertura.

| Arquivo | Tela | Qual é a foto |
|---|---|---|
| `amostras-estante.webp` | 3 · Imagem impecável | a estante com as amostras em caixas coloridas e etiquetadas, e a publicação aberta no balcão |
| `almanaque.webp` | 5 · Publicações anuais | a capa do almanaque de 2026, preta, com a foto aérea da casa |
| `almanaque-aberto.webp` | 5 · Publicações anuais | o mesmo almanaque aberto numa página de amadeirados, **com o QR code impresso no canto** |

As duas do almanaque vieram deitadas do celular e foram giradas 90° no
`ffmpeg` (`transpose=1`). Todas estão em 900 × 1200, que é 3:4 em pé — e o
layout `topico` tem teto de largura (uma foto) ou de altura (duas) justamente
para não deformar essa proporção. Se alguma aparecer esticada ou cortada, é
nesse teto que se mexe, em `graficos.css`, não na foto.

**As duas telas sem foto são sem foto de propósito.** A ação contra a
concorrência não se fotografa, e o showroom que viaja só teria como ilustração
as mesmas fotos que as telas dos dois showrooms usam três telas adiante.
Repetir foto a essa distância custa mais do que a tela ganha.

## `arkos/` e `lesco/` — os dois showrooms

As cinco vieram do deck `showroom-e-posicionamento`, que já fazia esta
comparação. **A tela 9 é a página 16 de lá**, trazida para cá porque é ela
que explica, sem argumento nenhum, por que o rebrand e a embalagem são
urgentes.

| Arquivo | Tela | Qual é a foto |
|---|---|---|
| `arkos/parede.webp` | 7 · fundo inteiro | a parede de madeira com AMANTES DE BOA ARQUITETURA em letra de metal, e a mesa de reunião sobre o deck |
| `arkos/showroom.webp` | 8 · esquerda | a vista ampla: forro ripado, balcão curvo iluminado e a estante de amostras por cor |
| `lesco/armarios.webp` | 8 · direita | a vista larga do escritório de São Paulo, com os armários e a parede de folhagem |
| `arkos/amostras.webp` | 9 · esquerda | o plinto de exposição com os perfis em pé e as letras ARKOS contra a janela |
| `lesco/mesa-amostras.webp` | 9 · direita | a mesa de reunião com os perfis empilhados e as caixas de papelão abertas ao lado |

São cópias, e não atalhos para a pasta do outro deck: cada apresentação
tem que abrir sozinha, inclusive em `file://` e dentro do sandbox do
`tools/export-pdf.js`.

**Sobre a `mesa-amostras.webp`:** existe uma foto da mesma sala arrumada, e
ela não serve. Arrumada, a cena deixa de dizer o que a tela 9 diz — e a
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
| `id/pasta.webp` | 14 · esquerda | as pastas de documentação técnica, em areia e verde escuro |
| `id/caixa-nova.webp` | 14 · direita | a caixa com a marca nova e a frase da assinatura |

**O cuidado que a tela 14 toma na cara:** estas peças são estudos da
identidade, **não** são as embalagens que a 46 Indústria Gráfica orçou. A
caixa da foto não é a caixa de R$ 19,99 do bloco seguinte. O subtítulo da
tela diz isso, porque confundir as duas coisas custaria caro numa reunião
cujo assunto é justamente o preço da embalagem.

### As que ficaram de fora

- **A fita de embalagem.** Entrou e saiu: com três fotos o grid vira três
  colunas, o corte de uma foto deitada vira retrato e a frase da caixa
  ficava partida no meio. Duas fotos, deitadas como as peças, resolveram.
- **O render de arquitetura.** Bonito, e não sustenta argumento nenhum
  numa reunião de orçamento. Está no PDF para quem quiser.

## `marca-lesco.svg` e `marca-lesco-terracota.svg`

O logo de 2027 **em vetor**, não em print. O manual carrega o desenho em
vetor dentro do PDF; os caminhos foram convertidos de operadores de página
para SVG, então é a mesma curva do arquivo original.

- `marca-lesco.svg` — preenchimento em `currentColor`, para tingir pelo CSS.
  É a versão embutida em `marca.js`, que o motor usa na tela 13.
- `marca-lesco-terracota.svg` — a mesma coisa com a cor da marca embutida.
  Serve à capa, onde a marca entra como `<img>` e um `<img>` não herda cor.

Se a paleta mudar, é a segunda que se regera a partir da primeira.
