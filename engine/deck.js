/* ---------------------------------------------------------------------------
   Motor da apresentação.

   Lê window.DECK (definido em decks/<id>/deck.js), monta os slides, cuida da
   navegação, das transições e do pré-carregamento das imagens.

   Script clássico, sem módulos e sem fetch: a apresentação precisa abrir com
   duplo clique no index.html, sem servidor. Qualquer import/fetch quebraria
   isso por causa da política de origem do protocolo file://.
   --------------------------------------------------------------------------- */

(function (global) {
  'use strict';

  /* Precisa acompanhar --dur-scene em theme/tokens.css. */
  var SCENE_MS = 900;

  /* Quantos slides à frente o pré-carregador mantém prontos. */
  var LOOKAHEAD = 4;

  /* Quantas imagens carregam em paralelo. Baixo de propósito: as fotos de
     obra são grandes e vale mais terminar as próximas do que começar todas. */
  var CONCURRENCY = 3;

  /* Teto de espera antes de trocar de slide quando a foto ainda não chegou.
     Passado esse tempo a troca acontece de qualquer jeito — na live, atraso
     é pior do que um quadro imperfeito. */
  var READY_CAP_MS = 400;

  /* Imagens dos três primeiros slides carregam antes de sumir o loader. */
  var WARMUP_SLIDES = 3;

  var deck = null;        /* dados vindos de deck.js            */
  var slides = [];        /* elementos .slide                    */
  var current = 0;
  var target = 0;         /* destino já solicitado, mesmo que ainda não aplicado */
  var sceneTimer = null;
  var outgoing = null;
  var totalImages = 0;

  var els = {};           /* referências do cromo                */
  var jumpBuffer = '';
  var jumpTimer = null;

  var timer = { start: null, elapsed: 0, running: false, tick: null };

  /* =====================================================================
     Inicialização
     ===================================================================== */

  function init() {
    deck = global.DECK;

    if (!deck || !deck.slides || !deck.slides.length) {
      document.body.innerHTML =
        '<p style="color:#f4efe6;font:16px sans-serif;padding:40px">' +
        'Nenhum slide encontrado. Confira se deck.js define window.DECK.</p>';
      return;
    }

    document.title = deck.title ? deck.title + ' · Lesco' : 'Apresentação · Lesco';

    buildChrome();
    buildSlides();

    /* ?export empilha os slides como páginas para conferência e impressão,
       em vez de rodar a apresentação. */
    if (/[?&]export\b/.test(location.search)) {
      exportMode();
      return;
    }

    buildMenu();
    fitStage();
    bindEvents();
    setInkColor(ink.color);

    preloadWarmup().then(function () {
      hideLoader();
      show(startIndex(), 'fwd', true);
      pump();
    });
  }

  /* Modo exportação: tudo visível de uma vez, nada animado e todas as
     imagens carregadas antes de liberar a página. A marca `data-ready` no
     <html> é o sinal de que dá para imprimir — é o que o script de
     exportação espera antes de gerar o PDF. */
  function exportMode() {
    /* A classe vai nos dois: o <body> monta as páginas, e o <html> precisa
       parar de cortar e de ter altura fixa, senão a impressão termina na
       primeira folha. */
    document.documentElement.classList.add('is-export');
    document.body.classList.add('is-export');

    slides.forEach(function (slide, i) {
      slide.setAttribute('data-page', pad(i + 1));
    });

    var all = [];
    slides.forEach(function (_, i) {
      imagesOf(i).forEach(function (img) { all.push(trackedLoad(img)); });
    });

    Promise.all(all)
      .then(shrinkForExport)
      .then(function () {
        /* Uma volta extra para o layout assentar com as imagens já medidas. */
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            document.documentElement.setAttribute('data-ready', 'true');

            /* ?export&print abre já no diálogo de impressão — é o caminho
               de quem abriu a apresentação sem servidor. */
            if (/[?&]print\b/.test(location.search)) global.print();
          });
        });
      });
  }

  /* Maior lado que uma imagem precisa ter no PDF. A página tem 13,33 pol de
     largura, então 1800 px dão cerca de 135 dpi numa foto sangrada — de
     sobra para conferir informação. */
  var EXPORT_MAX_EDGE = 1800;
  var EXPORT_QUALITY = 0.82;

  /* Reduz as imagens antes de imprimir.

     Sem isto o navegador embute cada foto na resolução original: as fotos de
     obra têm até 5760 px e o PDF passa de 190 MB, o que não serve para
     mandar para ninguém revisar.

     TODA imagem passa pelo canvas, mesmo a que já é pequena o bastante e não
     precisa encolher. O motivo é o formato, não o tamanho: desde que as
     fotos viraram WebP, pular essa volta fazia o Chrome embutir o WebP como
     imagem crua no PDF — e o arquivo da live saltou de 37 MB para 93 MB sem
     uma foto sequer ter mudado de resolução. O canvas devolve JPEG, que o
     PDF guarda comprimido. */
  function shrinkForExport() {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('.slide img'));

    return Promise.all(imgs.map(function (img) {
      return new Promise(function (resolve) {
        var w = img.naturalWidth;
        var h = img.naturalHeight;
        if (!w || !h) return resolve();

        /* Nunca aumenta: `ratio` é 1 para quem já cabe, e aí o canvas só
           troca o formato. */
        var ratio = Math.min(1, EXPORT_MAX_EDGE / Math.max(w, h));

        var canvas = document.createElement('canvas');
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);

        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        /* Arte com transparência (a capa) tem de continuar em PNG; foto vira
           JPEG, que é o que derruba o tamanho. */
        var type = hasAlpha(ctx, canvas) ? 'image/png' : 'image/jpeg';

        img.src = canvas.toDataURL(type, EXPORT_QUALITY);
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
  }

  function hasAlpha(ctx, canvas) {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (var i = 3; i < data.length; i += 4) {
      if (data[i] < 250) return true;
    }
    return false;
  }

  /* Slide inicial: aceita #12 na URL para retomar de onde parou. */
  function startIndex() {
    var raw = parseInt(String(location.hash).replace('#', ''), 10);
    if (isNaN(raw)) return 0;
    return clamp(raw - 1, 0, slides.length - 1);
  }

  /* =====================================================================
     Montagem do DOM
     ===================================================================== */

  function buildSlides() {
    var stage = els.stage;

    deck.slides.forEach(function (data, i) {
      var layout = global.DeckLayouts[data.layout];

      if (!layout) {
        console.warn('Layout desconhecido: "' + data.layout + '" no slide ' + (i + 1));
        return;
      }

      var slide = document.createElement('section');
      slide.className = 'slide';
      slide.setAttribute('data-index', i);
      slide.setAttribute('data-layout', data.layout);
      slide.setAttribute('data-tone', data.tone || layout.tone || 'paper');
      slide.setAttribute('data-enter', data.transition || layout.transition || 'stagger');
      if (data.drift) slide.setAttribute('data-drift', 'true');

      var content = layout.render(data);
      content.classList.add('slide__content');
      slide.appendChild(content);

      indexAnimations(slide);
      deferImages(slide);

      stage.appendChild(slide);
      slides.push(slide);
    });
  }

  /* Numera os elementos animados na ordem do documento. É o que produz a
     cascata sem precisar declarar índice nenhum no conteúdo do deck. */
  function indexAnimations(slide) {
    var nodes = slide.querySelectorAll('[data-anim]');
    Array.prototype.forEach.call(nodes, function (node, i) {
      node.style.setProperty('--i', i);
    });
  }

  /* Tira o src das imagens e guarda em data-src. Quem decide a ordem de
     carregamento é o pré-carregador, não o navegador. */
  function deferImages(slide) {
    var imgs = slide.querySelectorAll('img[src]');
    Array.prototype.forEach.call(imgs, function (img) {
      img.setAttribute('data-src', img.getAttribute('src'));
      img.removeAttribute('src');
    });
  }

  function buildChrome() {
    els.stage = document.querySelector('.stage');
    els.viewport = document.querySelector('.deck-viewport');
    els.loader = document.querySelector('.loader');
    els.loaderBar = document.querySelector('.loader__bar');
    els.progress = document.querySelector('.chrome__progress-bar');
    els.counterNow = document.querySelector('[data-counter-now]');
    els.counterTotal = document.querySelector('[data-counter-total]');
    els.timer = document.querySelector('.chrome__timer');
    els.prev = document.querySelector('.chrome__nav--prev');
    els.next = document.querySelector('.chrome__nav--next');
    els.overview = document.querySelector('.overview__grid');
    els.overviewTitle = document.querySelector('.overview__title');
    els.notes = document.querySelector('.presenter__notes');
    els.nextLabel = document.querySelector('.presenter__next-label');
    els.nextNum = document.querySelector('.presenter__next-num');

    els.inkboard = document.querySelector('.inkboard');
    els.menuButton = document.querySelector('.chrome__menu');
    els.menuList = document.querySelector('[data-menu-list]');
    els.menuSearch = document.querySelector('[data-menu-search]');
    els.menuTimer = document.querySelector('[data-menu-timer]');

    if (els.overviewTitle) els.overviewTitle.textContent = deck.title || 'Slides';
    if (els.counterTotal) els.counterTotal.textContent = pad(deck.slides.length);
  }

  /* =====================================================================
     Escala do palco
     ===================================================================== */

  /* Escala o palco para caber na tela e o centraliza com as sobras.
     O deslocamento é calculado aqui, e não deixado para o CSS, porque um
     item maior que o container não é centralizado pelo navegador. */
  function fitStage() {
    var w = global.innerWidth;
    var h = global.innerHeight;
    var scale = Math.min(w / 1920, h / 1080);

    var x = (w - 1920 * scale) / 2;
    var y = (h - 1080 * scale) / 2;

    els.stage.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
    document.documentElement.style.setProperty('--stage-scale', scale);
  }

  /* =====================================================================
     Navegação
     ===================================================================== */

  /* Vídeo toca só no slide em que se está. Ao sair, pausa e rebobina, para
     que voltar ao slide comece do início em vez de pegar o filme pela
     metade. Mudo é o que o navegador deixa tocar sozinho; quem quiser som
     liga nos controles. Na exportação nada disto roda: exportMode() sai
     antes de show(), e fica o poster. */
  function syncVideos(entrando, saindo) {
    if (saindo && saindo !== entrando) {
      var parar = saindo.getElementsByTagName('video');
      for (var i = 0; i < parar.length; i++) {
        parar[i].pause();
        try { parar[i].currentTime = 0; } catch (e) { /* ainda sem metadados */ }
      }

      /* O quadro do YouTube não se pausa de fora sem a API deles. Recarregar
         o endereço é o jeito simples de garantir que o som não siga tocando
         no slide seguinte. */
      var telas = saindo.getElementsByTagName('iframe');
      for (var k = 0; k < telas.length; k++) {
        var origem = telas[k].getAttribute('data-tela');
        if (origem) telas[k].src = origem;
      }
    }

    var tocar = entrando.getElementsByTagName('video');
    for (var j = 0; j < tocar.length; j++) {
      var tentativa = tocar[j].play();
      /* Navegador pode recusar o play; não é erro que valha quebrar a
         navegação, o controle continua ali para o dedo. */
      if (tentativa && tentativa.catch) tentativa.catch(function () {});
    }
  }

  function show(index, dir, immediate) {
    index = clamp(index, 0, slides.length - 1);
    if (index === current && !immediate) return;

    var incoming = slides[index];
    var previous = slides[current];

    /* O destino muda já, antes da espera pela imagem. Sem isso, apertar a
       seta duas vezes rápido calcularia o segundo passo a partir de um
       índice velho e pularia um slide. */
    target = index;

    var commit = function () {
      /* Uma navegação mais nova venceu esta enquanto a foto carregava. */
      if (target !== index) return;

      /* Uma transição anterior ainda rodando é encerrada na hora: em
         navegação rápida, o último comando é o que vale. */
      clearOutgoing();

      if (!immediate && previous && previous !== incoming) {
        previous.classList.remove('is-current');
        previous.classList.add('is-outgoing');
        previous.setAttribute('data-dir', dir);
        previous.setAttribute('data-leave', incoming.getAttribute('data-enter'));
        outgoing = previous;

        sceneTimer = global.setTimeout(clearOutgoing, SCENE_MS);
      }

      incoming.setAttribute('data-dir', dir);
      incoming.classList.add('is-current');

      current = index;

      syncVideos(incoming, previous);
      countUp(incoming);
      redrawInk();
      syncChrome();
      syncHash();
      prioritize();
    };

    /* Espera a foto do próximo slide, mas nunca além do teto. */
    var ready = whenReady(index);
    if (ready) race(ready, READY_CAP_MS).then(commit);
    else commit();
  }

  function clearOutgoing() {
    if (sceneTimer) { global.clearTimeout(sceneTimer); sceneTimer = null; }
    if (outgoing) {
      outgoing.classList.remove('is-outgoing');
      outgoing.removeAttribute('data-leave');
      outgoing = null;
    }
  }

  /* Andam a partir do destino, não do slide visível: em navegação rápida é
     o destino que representa a intenção do apresentador. */
  function next() { if (target < slides.length - 1) show(target + 1, 'fwd'); }
  function prev() { if (target > 0) show(target - 1, 'back'); }

  function syncChrome() {
    var pct = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;
    if (els.progress) els.progress.style.width = pct + '%';
    if (els.counterNow) els.counterNow.textContent = pad(current + 1);
    if (els.prev) els.prev.disabled = current === 0;
    if (els.next) els.next.disabled = current === slides.length - 1;

    var data = deck.slides[current] || {};
    if (els.notes) els.notes.textContent = data.notes || '';

    var upcoming = deck.slides[current + 1];
    if (els.nextLabel) els.nextLabel.textContent = upcoming ? (upcoming.label || upcoming.title || '—') : 'Fim da apresentação';
    if (els.nextNum) els.nextNum.textContent = upcoming ? 'A seguir · ' + pad(current + 2) : '';

    syncOverviewSelection();
    syncMenuSelection();
  }

  function syncHash() {
    var hash = '#' + (current + 1);
    if (location.hash === hash) return;
    try {
      history.replaceState(null, '', hash);
    } catch (e) {
      /* file:// pode recusar replaceState — o fallback resolve. */
      location.hash = hash;
    }
  }

  /* =====================================================================
     Contagem dos números grandes
     ===================================================================== */

  function countUp(slide) {
    var nodes = slide.querySelectorAll('[data-count]');

    Array.prototype.forEach.call(nodes, function (node) {
      var target = parseFloat(node.getAttribute('data-count'));
      if (isNaN(target)) { node.textContent = node.getAttribute('data-count'); return; }

      var duration = 900;
      var delay = 320 + (parseFloat(getComputedStyle(node.closest('[data-anim]') || node).getPropertyValue('--i')) || 0) * 55;
      var started = null;

      node.textContent = '0';

      global.setTimeout(function () {
        function frame(now) {
          if (started === null) started = now;
          var t = Math.min((now - started) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          node.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }, delay);
    });
  }

  /* =====================================================================
     Pré-carregamento

     As fotos são os originais de obra, com vários megabytes cada. Sem uma
     fila com prioridade a transição piscaria enquanto a imagem chega. A
     estratégia: aquecer os primeiros slides antes de começar e, a cada
     navegação, jogar os próximos para o topo da fila.
     ===================================================================== */

  var queue = [];         /* elementos <img> pendentes, em ordem de prioridade */
  var inFlight = 0;
  var pending = {};       /* índice do slide -> promise de conclusão           */

  function imagesOf(index) {
    if (!slides[index]) return [];
    return Array.prototype.slice.call(slides[index].querySelectorAll('img[data-src]'));
  }

  function loadImage(img) {
    return new Promise(function (resolve) {
      var src = img.getAttribute('data-src');
      if (!src) return resolve();

      img.removeAttribute('data-src');

      img.onload = function () { resolve(); };
      img.onerror = function () {
        console.warn('Imagem não encontrada: ' + src);
        resolve();
      };
      img.src = src;
    });
  }

  /* Promessa que resolve quando todas as imagens do slide terminarem, ou
     null se já não há nada pendente. */
  function whenReady(index) {
    var remaining = imagesOf(index);
    if (!remaining.length) return pending[index] || null;

    bump(index);

    pending[index] = Promise.all(remaining.map(function (img) {
      return trackedLoad(img);
    }));

    return pending[index];
  }

  /* A promessa fica guardada no próprio elemento, não numa tabela por URL:
     a mesma foto aparece em mais de um slide (o perfil do muxarabi, por
     exemplo) e indexar por URL deixaria a segunda cópia sem src. */
  function trackedLoad(img) {
    if (!img.__load) img.__load = loadImage(img);
    return img.__load;
  }

  /* Move as imagens do slide para a frente da fila. */
  function bump(index) {
    var urgent = imagesOf(index);
    if (!urgent.length) return;

    queue = urgent.concat(queue.filter(function (img) {
      return urgent.indexOf(img) === -1;
    }));
  }

  function prioritize() {
    for (var i = current; i <= current + LOOKAHEAD && i < slides.length; i++) bump(i);
    /* Um slide para trás também: voltar é comum ao responder pergunta. */
    if (current > 0) bump(current - 1);
    pump();
  }

  /* Consome a fila respeitando o limite de paralelismo. */
  function pump() {
    while (inFlight < CONCURRENCY && queue.length) {
      var img = queue.shift();
      if (!img.getAttribute('data-src')) continue;

      inFlight++;
      trackedLoad(img).then(function () {
        inFlight--;
        reportProgress();
        pump();
      });
    }
  }

  var warmTotal = 0;
  var warmDone = 0;

  function preloadWarmup() {
    /* Tudo entra na fila, em ordem de slide. O restante continua chegando
       em segundo plano enquanto a apresentação já está no ar. */
    slides.forEach(function (_, i) {
      var imgs = imagesOf(i);
      totalImages += imgs.length;
      queue = queue.concat(imgs);
    });

    var warm = [];
    for (var i = 0; i < WARMUP_SLIDES && i < slides.length; i++) {
      imagesOf(i).forEach(function (img) {
        warm.push(trackedLoad(img).then(function () {
          warmDone++;
          reportProgress();
        }));
      });
    }

    warmTotal = warm.length;
    reportProgress();
    pump();

    /* O loader nunca segura a apresentação por mais de 6 s. */
    return race(Promise.all(warm), 6000);
  }

  /* A barra mede só o aquecimento — é o que o apresentador espera de fato. */
  function reportProgress() {
    if (!els.loaderBar || els.loader.classList.contains('is-done')) return;
    els.loaderBar.style.width = (warmTotal ? (warmDone / warmTotal) * 100 : 100) + '%';
  }

  function hideLoader() {
    if (!els.loader) return;
    els.loaderBar.style.width = '100%';
    els.loader.classList.add('is-done');
    global.setTimeout(function () { els.loader.style.display = 'none'; }, 800);
  }

  /* =====================================================================
     Grade de slides
     ===================================================================== */

  function buildOverview() {
    if (!els.overview) return;
    els.overview.innerHTML = '';

    slides.forEach(function (slide, i) {
      var data = deck.slides[i] || {};

      var frame = document.createElement('div');
      frame.className = 'thumb__frame';

      var inner = document.createElement('div');
      inner.className = 'thumb__inner';
      inner.setAttribute('data-tone', slide.getAttribute('data-tone'));
      inner.appendChild(slide.querySelector('.slide__content').cloneNode(true));

      frame.appendChild(inner);

      var button = document.createElement('button');
      button.className = 'thumb' + (i === current ? ' is-current' : '');
      button.setAttribute('data-thumb', i);
      button.appendChild(frame);

      var meta = document.createElement('div');
      meta.className = 'thumb__meta';
      meta.innerHTML = '<span class="thumb__num"></span><span class="thumb__label"></span>';
      meta.querySelector('.thumb__num').textContent = pad(i + 1);
      meta.querySelector('.thumb__label').textContent = data.label || data.title || data.layout;
      button.appendChild(meta);

      button.addEventListener('click', function () {
        closeOverview();
        show(i, i > current ? 'fwd' : 'back');
      });

      els.overview.appendChild(button);
    });

    scaleThumbs();
  }

  /* As miniaturas são clones em 1920×1080 reduzidos por transform, o que
     mantém a fidelidade do layout sem reescrever nada. */
  function scaleThumbs() {
    Array.prototype.forEach.call(els.overview.querySelectorAll('.thumb__frame'), function (frame) {
      var inner = frame.querySelector('.thumb__inner');
      inner.style.transform = 'scale(' + (frame.clientWidth / 1920) + ')';
    });
  }

  function syncOverviewSelection() {
    if (!els.overview) return;
    Array.prototype.forEach.call(els.overview.querySelectorAll('.thumb'), function (thumb) {
      thumb.classList.toggle('is-current', Number(thumb.getAttribute('data-thumb')) === current);
    });
  }

  /* A classe entra antes da montagem: enquanto a grade está em display:none
     as molduras medem zero, e as miniaturas sairiam escaladas para nada. */
  function openOverview() {
    document.body.classList.add('is-overview');
    buildOverview();

    var active = els.overview.querySelector('.thumb.is-current');
    if (active) active.scrollIntoView({ block: 'center' });
  }

  function closeOverview() {
    document.body.classList.remove('is-overview');
  }

  function toggleOverview() {
    if (document.body.classList.contains('is-overview')) closeOverview();
    else openOverview();
  }

  /* =====================================================================
     Cronômetro
     ===================================================================== */

  function toggleTimer() {
    if (timer.running) {
      timer.elapsed += Date.now() - timer.start;
      timer.running = false;
      global.clearInterval(timer.tick);
    } else {
      timer.start = Date.now();
      timer.running = true;
      timer.tick = global.setInterval(renderTimer, 1000);
    }
    renderTimer();
    syncMenu();
  }

  function resetTimer() {
    global.clearInterval(timer.tick);
    timer = { start: null, elapsed: 0, running: false, tick: null };
    renderTimer();
    syncMenu();
  }

  function renderTimer() {
    var ms = timer.elapsed + (timer.running ? Date.now() - timer.start : 0);
    var total = Math.floor(ms / 1000);
    var text = pad(Math.floor(total / 60)) + ':' + pad(total % 60);

    if (els.timer) {
      els.timer.textContent = text;
      els.timer.setAttribute('data-running', String(timer.running));
    }

    if (els.menuTimer) {
      els.menuTimer.textContent = text;
      els.menuTimer.setAttribute('data-running', String(timer.running));
    }
  }

  /* =====================================================================
     Anotação por cima do slide

     A tela de desenho fica dentro do palco, então escala junto com ele e as
     coordenadas são sempre em 1920 × 1080 — o traço cai no mesmo lugar em
     qualquer monitor ou projetor.

     Cada slide guarda os próprios traços: anotar, seguir em frente e voltar
     depois devolve a anotação como estava.
     ===================================================================== */

  var ink = {
    on: false,
    color: '#bd8571',
    width: 6,
    strokes: {},     /* índice do slide -> lista de traços */
    current: null
  };

  function inkContext() {
    return els.inkboard ? els.inkboard.getContext('2d') : null;
  }

  /* Converte a posição do ponteiro na tela para a coordenada do palco. */
  function inkPoint(event) {
    var rect = els.stage.getBoundingClientRect();
    var scale = rect.width / 1920;
    return [(event.clientX - rect.left) / scale, (event.clientY - rect.top) / scale];
  }

  function bindInk() {
    if (!els.inkboard) return;

    els.inkboard.addEventListener('pointerdown', function (event) {
      if (!ink.on) return;
      event.preventDefault();
      els.inkboard.setPointerCapture(event.pointerId);

      ink.current = { color: ink.color, width: ink.width, points: [inkPoint(event)] };
      if (!ink.strokes[current]) ink.strokes[current] = [];
      ink.strokes[current].push(ink.current);
    });

    els.inkboard.addEventListener('pointermove', function (event) {
      if (!ink.on || !ink.current) return;
      ink.current.points.push(inkPoint(event));
      redrawInk();
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (name) {
      els.inkboard.addEventListener(name, function () { ink.current = null; });
    });
  }

  function redrawInk() {
    var ctx = inkContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, 1920, 1080);
    (ink.strokes[current] || []).forEach(function (stroke) { paintStroke(ctx, stroke); });
  }

  /* Traço suavizado: as curvas passam pelos pontos médios, o que tira o
     serrilhado que um polyline puro deixa em movimento rápido do mouse. */
  function paintStroke(ctx, stroke) {
    var pts = stroke.points;
    if (!pts.length) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.width;

    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0][0], pts[0][1], stroke.width / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);

    for (var i = 1; i < pts.length - 1; i++) {
      ctx.quadraticCurveTo(
        pts[i][0], pts[i][1],
        (pts[i][0] + pts[i + 1][0]) / 2,
        (pts[i][1] + pts[i + 1][1]) / 2
      );
    }

    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    ctx.stroke();
  }

  function toggleInk(force) {
    ink.on = force === undefined ? !ink.on : Boolean(force);
    document.body.classList.toggle('is-drawing', ink.on);
    syncMenu();
  }

  function undoStroke() {
    var list = ink.strokes[current];
    if (!list || !list.length) return;
    list.pop();
    redrawInk();
  }

  function clearStrokes() {
    ink.strokes[current] = [];
    redrawInk();
  }

  function setInkColor(color) {
    ink.color = color;
    document.documentElement.style.setProperty('--ink-color', color);
    syncMenu();
  }

  /* =====================================================================
     Menu de controles
     ===================================================================== */

  function buildMenu() {
    if (!els.menuList) return;

    els.menuEmpty = document.createElement('div');
    els.menuEmpty.className = 'menu__empty';
    els.menuEmpty.textContent = 'Nenhum slide com esse nome.';
    els.menuEmpty.style.display = 'none';

    deck.slides.forEach(function (data, i) {
      var item = document.createElement('button');
      item.className = 'menu__item';
      item.setAttribute('data-menu-item', i);
      item.innerHTML = '<span class="menu__item-num"></span><span class="menu__item-label"></span>';
      item.querySelector('.menu__item-num').textContent = pad(i + 1);
      item.querySelector('.menu__item-label').textContent = data.label || data.title || data.layout;

      item.addEventListener('click', function () {
        closeMenu();
        show(i, i > current ? 'fwd' : 'back');
      });

      els.menuList.appendChild(item);
    });

    els.menuList.appendChild(els.menuEmpty);

    /* Busca por nome ou por número. */
    if (els.menuSearch) {
      els.menuSearch.addEventListener('input', function () {
        var term = els.menuSearch.value.trim().toLowerCase();
        var found = 0;

        Array.prototype.forEach.call(els.menuList.querySelectorAll('.menu__item'), function (item, i) {
          var text = item.textContent.toLowerCase();
          var hit = !term || text.indexOf(term) !== -1 || String(i + 1).indexOf(term) === 0;
          item.style.display = hit ? '' : 'none';
          if (hit) found++;
        });

        els.menuEmpty.style.display = found ? 'none' : 'block';
      });

      /* Enter vai para o primeiro resultado visível. */
      els.menuSearch.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter') return;
        var first = Array.prototype.filter.call(
          els.menuList.querySelectorAll('.menu__item'),
          function (item) { return item.style.display !== 'none'; }
        )[0];
        if (first) first.click();
      });
    }

    /* Ações dos botões. */
    document.querySelectorAll('[data-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        runAction(button.getAttribute('data-action'));
      });
    });

    document.querySelectorAll('[data-ink]').forEach(function (button) {
      button.addEventListener('click', function () {
        setInkColor(button.getAttribute('data-ink'));
      });
    });

    document.querySelectorAll('[data-menu-close]').forEach(function (button) {
      button.addEventListener('click', closeMenu);
    });

    if (els.menuButton) els.menuButton.addEventListener('click', toggleMenu);
  }

  function runAction(name) {
    switch (name) {
      case 'timer-toggle': toggleTimer(); break;
      case 'timer-reset':  resetTimer(); break;

      case 'draw-toggle': toggleInk(); break;
      case 'draw-undo':   undoStroke(); break;
      case 'draw-clear':  clearStrokes(); break;

      case 'notes': document.body.classList.toggle('is-presenter'); break;
      case 'black': document.body.classList.toggle('is-black'); break;
      case 'help':  closeMenu(); document.body.classList.add('is-help'); break;
      case 'grid':  closeMenu(); openOverview(); break;

      case 'fullscreen': toggleFullscreen(); break;

      case 'export': runExport(); break;
    }
    syncMenu();
  }

  /* =====================================================================
     Exportar em PDF

     Caminho principal: pedir ao servidor local, que roda o Chrome sem
     interface e devolve o arquivo pronto — o mesmo resultado de
     `node tools/export-pdf.js`, sem sair da apresentação.

     Quando não há servidor (apresentação aberta por duplo clique, em
     file://), abre a versão paginada numa aba e chama a impressão: aí é o
     apresentador que escolhe "Salvar como PDF".
     ===================================================================== */

  var exporting = false;

  /* A pasta da apresentação, lida do endereço: /decks/<pasta>/index.html */
  function deckFolder() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('decks');
    return i >= 0 && parts[i + 1] ? parts[i + 1] : (deck.id || '');
  }

  function exportHint(text, state) {
    var hint = document.querySelector('[data-export-hint]');
    if (!hint) return;
    hint.textContent = text;
    hint.classList.toggle('is-working', state === 'working');
    hint.classList.toggle('is-error', state === 'error');
  }

  function runExport() {
    if (exporting) return;

    var button = document.querySelector('[data-action="export"]');

    if (location.protocol === 'file:') {
      printableTab('Sem servidor aqui: abri a versão paginada numa aba. Escolha "Salvar como PDF".');
      return;
    }

    exporting = true;
    if (button) { button.disabled = true; button.textContent = 'Gerando…'; }
    exportHint('Carregando as fotos e montando as páginas. Leva cerca de um minuto.', 'working');

    var name = 'apresentacao.pdf';

    fetch('/__export/' + encodeURIComponent(deckFolder()))
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        var header = res.headers.get('X-Export-File');
        if (header) name = decodeURIComponent(header);
        return res.blob();
      })
      .then(function (blob) {
        saveBlob(blob, name);
        exportHint('Pronto. O arquivo também ficou na pasta export/.');
      })
      .catch(function () {
        printableTab('Não consegui gerar pelo servidor. Abri a versão paginada numa aba — escolha "Salvar como PDF".');
      })
      .then(function () {
        exporting = false;
        if (button) { button.disabled = false; button.textContent = 'Exportar PDF'; }
      });
  }

  function printableTab(message) {
    exportHint(message, 'error');
    global.open(location.pathname + '?export&print', '_blank');
  }

  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    /* O download precisa começar antes de soltar a URL. */
    global.setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function openMenu() {
    document.body.classList.add('is-menu');
    syncMenu();
    if (els.menuSearch) els.menuSearch.focus();

    var active = els.menuList && els.menuList.querySelector('.menu__item.is-current');
    if (active) active.scrollIntoView({ block: 'center' });
  }

  function closeMenu() {
    document.body.classList.remove('is-menu');
    if (els.menuSearch) els.menuSearch.blur();
  }

  function toggleMenu() {
    if (document.body.classList.contains('is-menu')) closeMenu();
    else openMenu();
  }

  /* Reflete no menu o que está ligado, para nunca divergir do estado real. */
  function syncMenu() {
    var body = document.body;

    setButtonState('timer-toggle', timer.running, timer.running ? 'Pausar' : 'Iniciar');
    setButtonState('draw-toggle', ink.on, ink.on ? 'Desativar' : 'Ativar');
    setButtonState('notes', body.classList.contains('is-presenter'));
    setButtonState('black', body.classList.contains('is-black'));

    document.querySelectorAll('[data-ink]').forEach(function (button) {
      button.classList.toggle('is-on', button.getAttribute('data-ink') === ink.color);
    });

    syncMenuSelection();
  }

  function setButtonState(action, on, label) {
    var button = document.querySelector('[data-action="' + action + '"]');
    if (!button) return;
    button.classList.toggle('is-on', Boolean(on));
    if (label) button.textContent = label;
  }

  function syncMenuSelection() {
    if (!els.menuList) return;
    Array.prototype.forEach.call(els.menuList.querySelectorAll('.menu__item'), function (item) {
      item.classList.toggle('is-current', Number(item.getAttribute('data-menu-item')) === current);
    });
  }

  /* =====================================================================
     Eventos
     ===================================================================== */

  function bindEvents() {
    global.addEventListener('resize', function () {
      fitStage();
      if (document.body.classList.contains('is-overview')) scaleThumbs();
    });

    document.addEventListener('keydown', onKey);

    if (els.next) els.next.addEventListener('click', next);
    if (els.prev) els.prev.addEventListener('click', prev);
    if (els.timer) els.timer.addEventListener('click', toggleTimer);

    var closeHelp = document.querySelector('.help');
    if (closeHelp) closeHelp.addEventListener('click', function () {
      document.body.classList.remove('is-help');
    });

    bindIdle();
    bindSwipe();
    bindInk();
    renderTimer();
    syncMenu();
  }

  function onKey(event) {
    var key = event.key;

    /* Digitando na busca do menu, o teclado é dela. */
    var tag = (event.target && event.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      if (key === 'Escape') { event.target.blur(); closeMenu(); }
      return;
    }

    if ((event.ctrlKey || event.metaKey) && (key === 'z' || key === 'Z')) {
      undoStroke();
      event.preventDefault();
      return;
    }

    /* Digitar um número e apertar Enter pula direto para o slide. */
    if (/^[0-9]$/.test(key)) {
      jumpBuffer += key;
      global.clearTimeout(jumpTimer);
      jumpTimer = global.setTimeout(function () { jumpBuffer = ''; }, 1400);
      return;
    }

    if (key === 'Enter' && jumpBuffer) {
      var target = parseInt(jumpBuffer, 10) - 1;
      jumpBuffer = '';
      closeOverview();
      show(target, target > current ? 'fwd' : 'back');
      event.preventDefault();
      return;
    }

    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        next(); event.preventDefault(); break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'Backspace':
        prev(); event.preventDefault(); break;

      case 'Home': show(0, 'back'); event.preventDefault(); break;
      case 'End':  show(slides.length - 1, 'fwd'); event.preventDefault(); break;

      case 'g': case 'G':
      case 'o': case 'O':
        toggleOverview(); event.preventDefault(); break;

      case 'm': case 'M':
        toggleMenu(); event.preventDefault(); break;

      case 'd': case 'D':
        toggleInk(); break;

      case 'n': case 'N':
        document.body.classList.toggle('is-presenter'); syncMenu(); break;

      case 'b': case 'B':
        document.body.classList.toggle('is-black'); syncMenu(); break;

      case 't':
        toggleTimer(); break;

      case 'T':
        resetTimer(); break;

      case 'f': case 'F':
        toggleFullscreen(); break;

      case '?': case 'h': case 'H':
        document.body.classList.toggle('is-help'); break;

      case 'Escape':
        closeOverview();
        closeMenu();
        if (ink.on) toggleInk(false);
        document.body.classList.remove('is-help', 'is-black');
        syncMenu();
        break;
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(function () {});
  }

  /* Cromo e cursor somem quando o mouse para — a tela fica limpa na live. */
  function bindIdle() {
    var idleTimer = null;

    function wake() {
      document.body.classList.remove('is-idle');
      global.clearTimeout(idleTimer);
      idleTimer = global.setTimeout(function () {
        document.body.classList.add('is-idle');
      }, 2600);
    }

    ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(function (name) {
      document.addEventListener(name, wake, { passive: true });
    });

    wake();
  }

  function bindSwipe() {
    var x0 = null;

    document.addEventListener('touchstart', function (e) {
      x0 = e.changedTouches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
      x0 = null;
    }, { passive: true });
  }

  /* =====================================================================
     Utilidades
     ===================================================================== */

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* Resolve quando a promessa terminar ou quando estourar o teto de tempo. */
  function race(promise, ms) {
    return Promise.race([
      promise,
      new Promise(function (resolve) { global.setTimeout(resolve, ms); })
    ]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.Deck = { next: next, prev: prev, show: show };
})(window);
