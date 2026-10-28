# Como exportar as camadas do revestimento

> **Já resolvido.** Em 28/10/2026 a Lesco mandou os oito PNGs pela 2ª opção
> abaixo, e eles estão em `img/camadas/`. Como vieram recortados cada um no
> próprio conteúdo, o alinhamento foi recuperado medindo o canal alfa — as
> contas e os números estão comentados em `animacoes.js`. **Não é preciso
> exportar de novo.** Falta só o item 1 da lista do fim: o nome comercial de
> cada camada.
>
> O resto deste arquivo fica como referência para a próxima peça que precisar
> sair do 3D.

Para a animação do slide 6 — o perfil aberto em camadas, como no site.

Este arquivo pode ser repassado direto para quem fez o 3D.

---

## A regra que vale para qualquer formato

**Exportar na posição MONTADA, não explodida.** O afastamento entre as camadas
é o que a animação faz; se os arquivos já vierem separados, não dá para fechar
o bloco de novo com precisão.

**Tudo no mesmo sistema de coordenadas.** Uma camada por grupo, todas no mesmo
arquivo (ou, em imagem, todas na mesma moldura). Se cada peça vier com a
própria caixa de recorte, o alinhamento entre elas se perde e cada uma teria
de ser reposicionada no olho.

**Câmera ortográfica**, nunca perspectiva — é o que mantém as camadas
paralelas enquanto se afastam. Se der, a mesma isometria do print.

---

## 1ª opção · vetor (a melhor)

Um único **`.svg`**. Também serve `.ai`, `.pdf` ou `.dxf` — eu converto.

- Um grupo nomeado por camada:
  `capa-superior`, `composito-superior`, `nucleo`,
  `composito-inferior`, `capa-inferior`, `sombra`
- Sem máscara de recorte e sem efeito rasterizado (desfoque, sombra do
  Illustrator). A sombra em grupo separado, porque ela não sobe junto com as
  camadas.
- Sem textura embutida como imagem: o veio da madeira eu faço como padrão
  vetorial, para ele acompanhar a escala e continuar nítido no projetor.
- Texto convertido em curva ou removido. Cota e rótulo eu escrevo no deck,
  para saírem na tipografia da marca.

**Como sair de cada programa**

| Programa | Caminho |
|---|---|
| SketchUp | Câmera → Projeção paralela + Iso · Arquivo → Exportar → Gráfico 2D → `.pdf` |
| Rhino | Vista paralela → `Make2D` → exportar `.ai` ou `.svg` |
| Blender | Câmera *Orthographic* + add-on *Freestyle SVG Export* · uma Collection por camada |
| 3ds Max | Vista ortográfica → *Export to Illustrator (.ai)* |
| Illustrator / Corel | Salvar `.svg` com as camadas nomeadas |

**Por que vetor é a melhor opção aqui:** o deck exporta em PDF para revisão, e
vetor continua vetor no papel. Imagem vira pixel.

---

## 2ª opção · PNG por camada

Funciona bem. Só não é vetorial — no PDF sai como imagem.

- **Mesma câmera e mesmo tamanho de tela em todos os arquivos.** O jeito certo
  é renderizar a cena inteira e só ligar e desligar uma camada por vez. O jeito
  errado é renderizar cada peça sozinha e deixar o programa recortar.
- PNG 24 bits com transparência, lado maior **2400 px** (o palco tem 1920 e a
  peça ocupa cerca de 1100 — o dobro cobre tela retina e a exportação em PDF).
- Fundo transparente de verdade, não branco.

```
00-sombra.png
01-capa-superior.png
02-composito-superior.png
03-nucleo.png
04-composito-inferior.png
05-capa-inferior.png
06-montado.png      ← o bloco fechado, serve de pôster
```

---

## 3ª opção · 3D de verdade

Só se a ideia for **girar a peça ao vivo**, com o apresentador arrastando.

- `.glb` (glTF 2.0), uma malha nomeada por camada, origem no centro da peça,
  1 unidade = 1 metro, texturas **embutidas** (não referenciadas por caminho),
  Draco se passar de ~5 MB.
- Mandar junto um `montado.png` da mesma câmera: na exportação em PDF nada
  roda e o canvas sai vazio, então o slide precisa de um pôster.

Vale saber o que isso custa antes de escolher: a biblioteca 3D tem que entrar
como script clássico e as texturas embutidas no próprio arquivo, senão a
apresentação para de abrir com duplo clique — hoje ela abre sem servidor, e
isso é proposital.

---

## As quatro informações que o desenho não carrega

Mande junto, em texto solto mesmo:

1. **O nome comercial de cada camada** — como a Lesco chama internamente.
2. **A espessura de cada uma, em mm**, e a espessura total do perfil.
3. **Qual perfil é esse** — é o 217x35 das lojas de shopping ou outro?
4. **O que cada camada entrega**, em uma linha. É o que vira o rótulo ao lado
   do desenho no slide.

---

## Se não houver arquivo nenhum

O print do site já basta para eu redesenhar a geometria em SVG. Só que aí as
espessuras saem por proporção da imagem, não por medida — e num slide técnico,
diante das construtoras, isso vira cota errada. Nesse caso mande ao menos o
item 2 da lista acima.
