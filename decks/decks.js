/* ---------------------------------------------------------------------------
   Registro das apresentações.

   Uma linha por pasta dentro de decks/. A ordem aqui é a ordem em que elas
   aparecem na página inicial.

   O resto — título, subtítulo, número de slides e a foto de capa — a página
   inicial lê do próprio deck.js de cada apresentação, para não haver duas
   fontes de verdade que possam divergir.

   Uma apresentação cujo deck.js depende de outro arquivo da mesma pasta
   (uma tabela de números, por exemplo) troca o nome solto por um objeto e
   lista em `antes` o que precisa ser carregado primeiro. A página inicial
   carrega esses arquivos na ordem declarada, antes do deck.js — sem isso
   ela quebraria ao montar o card, que é a única coisa que ela faz com o
   conteúdo. O index.html de cada apresentação continua declarando os
   próprios <script> como sempre.
   --------------------------------------------------------------------------- */

window.DECKS = [
  'instalacao-de-estruturas',
  'obras-decathlon',
  { id: 'numeros-comerciais-china', antes: ['dados.js'] }
];
