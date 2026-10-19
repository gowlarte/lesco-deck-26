# Lesco Design System

> **ARQUITETURA FEITA PARA O AMANHÃ** — Architecture made for tomorrow.

Lesco produces high-end architectural cladding (revestimentos de alto padrão) built from
more ecologically sustainable raw materials — without compromising durability or aesthetic
quality. Products are wood-look brise and panel systems specified into real building projects
(resorts, residences, commercial). This design system captures the **2026 Rebrand**.

**Audience:** architects, engineers, cladding installers, and specifiers — plus construction-company
owners and supply buyers. Everything here should read as **inspiring and technical** at once.

---

## Sources used
Provided by the user (stored in `uploads/`, key assets copied to `assets/`):
- `LESCO - Manual da Marca.pdf` — brand manual, 2026 Rebrand (logo, color, gradient, type, graphics, icons).
- `Proposta comercial.pdf` — a real commercial proposal (product lines, specs, tone, contact info).
- Logo & symbol SVGs: `Logo Lesco Dark/Light`, `flat black/white`, `simbolo dark/light`.
- Brand graphics: `icon-1/2/3.svg` (abstract "grafismos").
- `Rebrand lesco 2.pdf` was referenced but **was not present** in the uploads folder — request it if needed.

Company: lesco.com.br · @lesco_br · Offices: Itajaí–SC and São Paulo–SP.

---

## Product lines (the "linhas")
Each line carries its own accent *tonalidade*; the brand base stays sober and only leans on a line's
color when speaking about that line.
- **Panel Shield** — panel cladding (e.g. Tasmania OAK, UV-treated Red Cedar, brushed Ipê finishes).
- **Brise** — slatted brise systems (e.g. "Origens 40", circular profiles).
- **Lesco Green Brise** — the sustainable line, sage-green coded.
Finishes reference real woods and treatments (Tasmania Oak, Red Cedar, Ipê; textured, brushed, UV).

---

## CONTENT FUNDAMENTALS — how Lesco writes
- **Language:** Brazilian Portuguese. Tone is **inspirador e técnico** — poetic openings that resolve
  into precise, verifiable specification.
- **Voice:** speaks *about the brand and the work* ("A Lesco reveste a alma da moradia…"), not chummy
  first-person. Addresses the specifier with respect; confident, never salesy.
- **Register:** two gears in one document. Evocative hero copy ("onde a luz do dia entra com ritmo e
  sem agressão") sitting beside dry technical tables (dimensions in mm, kg/m², spacing, quantities, R$).
- **Casing:** headlines and taglines set in **UPPERCASE** display type, often broken across 2–3 short
  lines ("ARQUITETURA / FEITA PARA / O AMANHÃ"). Labels/eyebrows are uppercase with wide tracking.
  Body is sentence case.
- **Signature phrases:** "Arquitetura feita para o amanhã", "Arquitetura com propósito",
  "Estética que inspira", "Valor da função".
- **Numbers & specs:** always concrete — mm, kg/m², m/l, R$, warranty in years, lead time in days.
  Currency is `R$ 25,00` (comma decimal, dot thousands). This precision is part of the brand's credibility.
- **Emoji:** never. **Icons:** the three abstract brand graphics, used sparingly as value markers.

---

## VISUAL FOUNDATIONS
- **Palette:** sober neutrals lead — near-black ink `#1a1a1a` on warm off-white paper `#f4efe6`.
  Four muted **line tonalities** provide accent, one family at a time:
  Azul (slate blue `#728ea0`), Verde/Green (sage `#c0c9bf`), Argila (clay `#d6aa98`),
  Areia (sand/cream `#efdcc5`). Max 1–2 background colors per layout.
- **Gradients (degradê):** built by chaining the accent tonalities (blue → sage → clay → cream),
  as in the logo symbol. Reserved for **specific moments and details** — hero symbol, repeated-symbol
  backgrounds, thin accent rules — never as a full loud page wash. See `--degrade-brand/soft/warm/cool`.
- **Type:** Neue Machina (display; substituted by Space Grotesk) for titles, headers, quotes;
  Object Sans (text; substituted by Manrope) for body, captions, technical descriptions. High-contrast
  scale — large architectural headlines, calm technical body.
- **Backgrounds:** predominantly flat warm paper. Signature texture = the **Lesco symbol repeated**
  with gradient (a "grafismo" field) used behind hero/section panels. Photography of finished projects
  is warm and natural-light, calm, never over-saturated.
- **Grafismos & illustration:** abstract shapes (eye between vertical bars, sun/rays, brise slats)
  used *pontualmente* as visual-signature details in specific layouts — not decoration everywhere.
- **Layout:** generous margins, architectural whitespace, strong left-aligned type. A minimum clear
  space around the logo (based on its typography, ignoring the symbol's optical overhang).
- **Corners & borders:** near-square. Radii stay small (2–8px; 14px max for large cards). Borders are
  hairline `1px` in warm greys (`--border-hair`).
- **Shadows:** subtle, warm-tinted, low-spread (`--shadow-xs…lg`). Cards read as flat paper with a
  soft lift, not floating glass. No neon glows.
- **Motion:** measured and quiet — short fades and eases (`--ease-standard`, `--ease-out`,
  140–420ms). No bounce, no springy overshoot.
- **Hover:** darken toward ink (links → `--ink-900`), or a gentle surface tint; solid buttons lift
  slightly. **Press:** small settle (translateY 1px), no dramatic scale.
- **Transparency & blur:** rare; used only for scrims over photography, not as a default aesthetic.
- **Card anatomy:** warm paper/white surface, hairline border, `--radius-md`, `--shadow-sm`; a line's
  accent may tint the header or a top rule when the card is about that line.

---

## ICONOGRAPHY
- **Brand graphics ("grafismos"):** three provided abstract PNGs in `assets/`, each tied to a value.
  **Renderizados em degradê** (clay → areia → sage → azul), não em monocromia:
  `grafismo-2.png` (olho entre ripas) — *Estética que inspira*;
  `grafismo-3.png` (sol com ripas e raios) — *Valor da função*;
  `grafismo-1.png` (irradiação com brises em perspectiva) — *Arquitetura com propósito*.
  São delicados e claros: use **grandes, sobre fundo claro** e com parcimônia, como marcadores de
  seção/valor — nunca como ícones de interface.
- **UI icons:** the brand manual defines no UI icon font. For interface work (product/site UI kits)
  we substitute **Lucide** (CDN, 1.5px stroke) — a clean, thin, geometric line set that matches the
  sober aesthetic. **Flagged substitution** — replace with a licensed Lesco UI set if one exists.
- **No emoji, no unicode-glyph icons.**

---

## Assets (`assets/`)
PNG (fornecidos pelo cliente — **fonte de verdade**, transparentes, @4x):
- `logo-dark.png` / `logo-light.png` — wordmark "LESCO" + swoosh. **O wordmark é sólido
  (ink no claro / off-white no escuro) e o swoosh carrega o degradê** clay → areia → sage → azul.
- `logo-slogan-dark.png` / `logo-slogan-light.png` — lockup completo com o slogan
  "ARQUITETURA FEITA PARA O AMANHÃ" à direita.
- `symbol.png` — o símbolo (swoosh) isolado, sempre em degradê.
- `grafismo-1/2/3.png` — grafismos abstratos da marca, **em degradê** (não monocromáticos):
  `grafismo-1` (irradiação com brises em perspectiva) · `grafismo-2` (olho entre ripas) ·
  `grafismo-3` (sol com ripas e raios).
> Os SVGs originais chegaram **sem os estilos de preenchimento** (todos os paths renderizavam
> pretos). O cliente enviou PNGs @4x com transparência — **os PNGs são a referência usada em
> todo o design system**. Peça SVGs corrigidos se precisar de vetor escalável.

---

## Index / manifest
- `styles.css` — global entry (import this). → `tokens/{fonts,colors,typography,spacing,effects,base}.css`
- `assets/` — logos, symbols, brand graphics.
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/` — reusable UI primitives (`core/`, `forms/`).

## Components
Reusable UI primitives (bundled to `window.LescoDesignSystem_<hash>`):
- **core/** — `Button`, `IconButton`, `Badge`, `Card`, `Icon` (Lucide wrapper).
- **forms/** — `Input`, `Select`, `Checkbox`, `Switch`.
- **navigation/** — `Tabs`.
- `ui_kits/website/` — marketing-site recreation.
- `slides/` — sample deck slides (01 title, 02 section, 03 product spec, 04 quote/closing).
- `thumbnail.html` — project tile.
- `SKILL.md` — portable skill wrapper.

## Intentional additions
- **Icon (Lucide) UI icons** — the manual defines no UI icon set, so a CDN line set is used for
  interface work only. Flagged above.

## CAVEATS
- **Fonts are substituted.** Neue Machina → Space Grotesk, Object Sans → Manrope. Supply licensed
  `.woff2` files to make this exact.
- **Exact brand hex values** for neutrals/paper were inferred from the logo/symbol accent stops and the
  manual's overall look; the accent tonalities themselves are taken directly from the logo gradient.
- **Logo SVGs foram substituídos por PNGs** enviados pelo cliente (os SVGs originais vieram sem
  estilos de fill). Para vetor escalável, envie SVGs corrigidos.
- `Rebrand lesco 2.pdf` was not in the uploads — some rebrand nuances may be missing.
