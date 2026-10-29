/* =============================================================================
   TERRA MASSATGE · main.js
   Animaciones ligadas al scroll del usuario (GSAP + ScrollTrigger) y scroll
   suave (Lenis). Nunca desplaza la página por su cuenta ni bloquea el scroll.
   ========================================================================== */
(function () {
  'use strict';

  /* ===========================================================================
     DATOS (fuente única): contacto, rituales, precios, duraciones y horario.
     Todos los enlaces y cifras de la página salen de aquí.
     ======================================================================== */

  var CONTACTO = {
    // [CONFIRMAR] Si Booksy permite un enlace directo a "Quiromasaje" o a cada servicio, cámbialo aquí.
    booksy: 'https://booksy.com/es-es/41790_jl-loyal-barber-shop_barberia_57723_carcaixent',
    whatsapp: '34694240107',
    telefono: '+34694240107',
    telefonoVisible: '+34 694 24 01 07',
    correo: { usuario: 'terramassatge', dominio: 'gmail.com' }, // se monta con JS para esquivar bots
    instagram: 'https://www.instagram.com/terramassatge/',
    facebook: 'https://www.facebook.com/TerraMassatge/',
    maps: 'https://www.google.com/maps/place/?q=place_id:ChIJsbBAg--lYQ0RJEYqJbn2HMk',
    resena: 'https://search.google.com/local/writereview?placeid=ChIJsbBAg--lYQ0RJEYqJbn2HMk',
    geo: { lat: 39.1197234, lng: -0.4450366 },
    web: 'https://terramassatge.es/'
  };

  /* Nombre confirmado: "Esencia Terra" (como en Booksy).
     Duraciones y precios: los del documento de cambios del cliente (septiembre 2026).
     El orden de la web lo marca el HTML: Esencia, Reset, Immersion, Presoterapia, Combo, Express. */
  var RITUALES = {
    esencia:      { nombre: 'Esencia Terra', corto: 'Esencia', duracion: '55 min', precio: 35,
                    desc: 'Masaje relajante premium de inspiración mediterránea, con toallas calientes.' },
    reset:        { nombre: 'Terra Reset', duracion: '55 min', precio: 35,
                    desc: 'Masaje descontracturante y deportivo.' },
    immersion:    { nombre: 'Terra Immersion', duracion: '1 h 25 min', precio: 58, extra: 10,
                    desc: 'Ritual completo sin prisas: despertar sensorial, aromaterapia, masaje completo y masaje craneofacial. Presoterapia opcional.' },
    presoterapia: { nombre: 'Presoterapia Terra', duracion: '25–30 min', precio: 25,
                    desc: 'Presoterapia neumática con tecnología Bootech® para piernas cansadas.' },
    combo:        { nombre: 'Combo Premium Terra', duracion: '55 min', precio: 45,
                    desc: 'Masaje manual y presoterapia a la vez.' },
    express:      { nombre: 'Terra Express', duracion: '25–30 min', precio: 22.5,
                    desc: 'La experiencia Terra en formato corto.' }
  };

  var DATOS = {
    esencia: RITUALES.esencia,
    reset: RITUALES.reset,
    immersion: RITUALES.immersion,
    presoterapia: RITUALES.presoterapia,
    combo: RITUALES.combo,
    express: RITUALES.express,
    domicilio: { precio: 45 }, // se muestra como «desde 45 €»
    barberia: [
      { duracion: '1 h', precio: 35 },          // Corte + Terra Express
      { duracion: '1 h 25 min', precio: 50 },   // Corte + Esencia Terra
      { duracion: '1 h 10 min', precio: 38 },   // Corte y barba + Terra Express
      { duracion: '1 h 35 min', precio: 53 }    // Corte y barba + Esencia Terra
    ]
  };

  var HORARIO = [
    { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '09:30', cierra: '14:30' },
    { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '16:00', cierra: '20:00' },
    { dias: ['Saturday'], abre: '09:30', cierra: '14:30' }
  ];

  /* ---------- Utilidades ---------- */
  function euros(n) {
    return (n % 1 ? n.toFixed(2).replace('.', ',') : String(n)) + ' €';
  }
  function leer(ruta) {
    return ruta.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, DATOS);
  }
  function correo() {
    return CONTACTO.correo.usuario + '@' + CONTACTO.correo.dominio;
  }
  function enlace(tipo, mensaje) {
    switch (tipo) {
      case 'booksy': return CONTACTO.booksy;
      case 'whatsapp': return 'https://wa.me/' + CONTACTO.whatsapp + (mensaje ? '?text=' + encodeURIComponent(mensaje) : '');
      case 'telefono': return 'tel:' + CONTACTO.telefono;
      case 'correo': return 'mailto:' + correo();
      case 'instagram': return CONTACTO.instagram;
      case 'facebook': return CONTACTO.facebook;
      case 'maps': return CONTACTO.maps;
      case 'resena': return CONTACTO.resena;
    }
    return null;
  }

  /* ---------- Precios, duraciones y nombres ---------- */
  document.querySelectorAll('[data-dato]').forEach(function (el) {
    var ruta = el.dataset.dato;
    var valor = leer(ruta);
    if (valor == null) return;
    if (/\.precio$/.test(ruta)) el.textContent = euros(valor);
    else if (/\.extra$/.test(ruta)) el.textContent = '+' + euros(valor);
    else el.textContent = valor;
  });

  /* ---------- Textos de contacto ---------- */
  document.querySelectorAll('[data-texto]').forEach(function (el) {
    if (el.dataset.texto === 'telefono') el.textContent = CONTACTO.telefonoVisible;
    if (el.dataset.texto === 'correo') el.textContent = correo();
  });

  /* ---------- Enlaces generados desde CONTACTO ---------- */
  var AVISO_PESTANA = ' (se abre en una pestaña nueva)';
  document.querySelectorAll('[data-enlace]').forEach(function (a) {
    var tipo = a.dataset.enlace;
    var mensaje = a.dataset.mensaje;
    if (a.dataset.mensajeRitual) {
      var r = RITUALES[a.dataset.mensajeRitual];
      mensaje = 'Hola Héctor, quiero reservar el ritual ' + r.nombre;
    }
    var url = enlace(tipo, mensaje);
    if (!url) return;
    a.href = url;
    if (tipo !== 'telefono' && tipo !== 'correo') {
      a.target = '_blank';
      a.rel = 'noopener';
      if (a.hasAttribute('aria-label')) {
        a.setAttribute('aria-label', a.getAttribute('aria-label') + AVISO_PESTANA);
      } else {
        var aviso = document.createElement('span');
        aviso.className = 'sr-only';
        aviso.textContent = AVISO_PESTANA;
        a.appendChild(aviso);
      }
    }
  });

  /* ---------- Correo: si el sistema no tiene app de correo, el mailto no hace nada.
     Por eso, al pulsar, también copiamos la dirección y lo avisamos. ---------- */
  var aviso = document.createElement('div');
  aviso.className = 'aviso';
  aviso.setAttribute('role', 'status');
  aviso.setAttribute('aria-live', 'polite');
  document.body.appendChild(aviso);
  var avisoTimer = null;
  function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.classList.add('es-visible');
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { aviso.classList.remove('es-visible'); }, 6000);
  }
  document.querySelectorAll('[data-enlace="correo"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var dir = correo();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(dir).then(
          function () { mostrarAviso('Hemos copiado nuestro correo: ' + dir + '. Si no se abre tu app de correo, pégalo en tu email.'); },
          function () { mostrarAviso('Nuestro correo: ' + dir); }
        );
      } else {
        mostrarAviso('Nuestro correo: ' + dir);
      }
    });
  });

  /* ---------- Datos estructurados (JSON-LD) ---------- */
  (function () {
    var ld = {
      '@context': 'https://schema.org',
      '@type': 'HealthAndBeautyBusiness',
      name: 'Terra Massatge',
      description: 'Masajes personalizados en Carcaixent, junto a Alzira. Masaje relajante, descontracturante, deportivo y presoterapia.',
      url: CONTACTO.web,
      image: CONTACTO.web + 'assets/og-image.jpg',
      logo: CONTACTO.web + 'assets/logo-terra.svg',
      telephone: CONTACTO.telefono,
      email: correo(),
      founder: { '@type': 'Person', name: 'Héctor Salom', jobTitle: 'Quiromasajista' },
      priceRange: '€€',
      paymentAccepted: 'Efectivo, Bizum, Visa, Mastercard',
      areaServed: ['Carcaixent', 'Alzira', 'La Ribera'].map(function (n) { return { '@type': 'City', name: n }; }),
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle de San Antonio, 57',
        addressLocality: 'Carcaixent',
        addressRegion: 'Valencia',
        postalCode: '46740',
        addressCountry: 'ES'
      },
      geo: { '@type': 'GeoCoordinates', latitude: CONTACTO.geo.lat, longitude: CONTACTO.geo.lng },
      openingHoursSpecification: HORARIO.map(function (h) {
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: h.dias, opens: h.abre, closes: h.cierra };
      }),
      sameAs: [CONTACTO.instagram, CONTACTO.facebook, CONTACTO.maps],
      potentialAction: {
        '@type': 'ReserveAction',
        target: { '@type': 'EntryPoint', urlTemplate: CONTACTO.booksy, actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'] },
        result: { '@type': 'Reservation', name: 'Reserva en Terra Massatge' }
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Rituales Terra',
        itemListElement: Object.keys(RITUALES).map(function (k) {
          var r = RITUALES[k];
          return {
            '@type': 'Offer',
            price: r.precio.toFixed(2),
            priceCurrency: 'EUR',
            itemOffered: { '@type': 'Service', name: r.nombre, description: r.desc }
          };
        })
      }
      // Sin aggregateRating: Google no permite marcar reseñas propias del negocio.
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  })();

  /* ===========================================================================
     INTERFAZ
     ======================================================================== */

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var motion = !reduce && !!gsap && !!ScrollTrigger;

  if (!motion) {
    // Sin movimiento (o si falla el CDN): todo visible desde el principio.
    root.classList.remove('con-movimiento');
    root.classList.add('sin-movimiento');
  }

  /* ---------- Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      // En táctil Lenis deja el scroll nativo (syncTouch desactivado por defecto).
      lenis = new window.Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Hero: vídeo de ambiente (sin audio). Solo se reproduce con movimiento permitido,
     sin ahorro de datos y mientras el hero está a la vista; si no, se queda el póster. ---------- */
  var videoHero = document.querySelector('[data-hero-video]');
  var conexion = navigator.connection || {};
  if (videoHero && !reduce && !conexion.saveData) {
    var reproducir = function () {
      var p = videoHero.play();
      if (p && p.catch) p.catch(function () {});
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        entradas[0].isIntersecting ? reproducir() : videoHero.pause();
      }, { threshold: 0.05 }).observe(videoHero);
    } else {
      reproducir();
    }
  }

  /* ---------- Navegación: fondo sólido al hacer scroll + indicador "desliza" ---------- */
  var nav = document.querySelector('[data-nav]');
  var desliza = document.querySelector('.hero__desliza');
  var deslizaOculto = false;

  function alHacerScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('es-solida', y > 8);
    if (!deslizaOculto && y > 8) {
      deslizaOculto = true;
      if (motion) {
        gsap.killTweensOf(desliza);
        gsap.to(desliza, { autoAlpha: 0, duration: 0.6, ease: 'sine.inOut' });
      }
      desliza.classList.add('es-oculto');
    }
  }
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  /* ---------- Menú móvil (atrapa el foco, se cierra con Escape) ---------- */
  var menu = document.querySelector('[data-menu]');
  var abrir = document.querySelector('[data-menu-abrir]');
  var cerrar = document.querySelector('[data-menu-cerrar]');
  var focoPrevio = null;

  function enfocables() {
    return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])'));
  }

  function abrirMenu() {
    focoPrevio = document.activeElement;
    menu.hidden = false;
    abrir.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    enfocables()[1].focus();
    document.addEventListener('keydown', teclasMenu);
  }

  function cerrarMenu(devolverFoco) {
    if (menu.hidden) return;
    menu.hidden = true;
    abrir.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    document.removeEventListener('keydown', teclasMenu);
    if (devolverFoco !== false && focoPrevio) focoPrevio.focus();
  }

  function teclasMenu(e) {
    if (e.key === 'Escape') { cerrarMenu(); return; }
    if (e.key !== 'Tab') return;
    var items = enfocables();
    var primero = items[0];
    var ultimo = items[items.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  abrir.addEventListener('click', abrirMenu);
  cerrar.addEventListener('click', function () { cerrarMenu(); });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a[target="_blank"]')) cerrarMenu(false);
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
    if (e.matches) cerrarMenu(false);
  });

  /* ---------- Anclas internas (solo cuando el usuario hace clic) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; }
    var destino = document.querySelector(id);
    if (!destino) return;
    e.preventDefault();
    cerrarMenu(false);

    if (lenis) lenis.scrollTo(destino, { offset: 0, duration: 1.2 });
    else destino.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

    if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
    destino.focus({ preventScroll: true });
    history.replaceState(null, '', id);
  });

  /* ---------- WhatsApp flotante: aparece tras pasar el hero ---------- */
  var hero = document.querySelector('[data-hero]');
  var flotante = document.querySelector('[data-whatsapp-flotante]');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      flotante.classList.toggle('es-visible', !entradas[0].isIntersecting);
    }).observe(hero);
  } else {
    flotante.classList.add('es-visible');
  }

  /* ---------- Rituales: panel fijo con el "qué incluye" del ritual centrado ---------- */
  var panel = document.querySelector('[data-panel]');
  var rituales = document.querySelectorAll('.ritual');
  rituales.forEach(function (r, i) {
    var incluye = r.querySelector('.incluye');
    if (!incluye) return;
    var p = document.createElement('div');
    p.className = 'panel' + (i === 0 ? ' es-activo' : '');
    p.dataset.ritual = r.dataset.ritual;
    var titulo = document.createElement('p');
    titulo.className = 'sr-only';
    titulo.textContent = RITUALES[r.dataset.ritual].nombre;
    p.appendChild(titulo);
    p.appendChild(incluye.cloneNode(true));
    panel.appendChild(p);
  });
  var paneles = panel.querySelectorAll('.panel');
  function activarRitual(clave) {
    rituales.forEach(function (r) { r.classList.toggle('es-activo', r.dataset.ritual === clave); });
    paneles.forEach(function (p) { p.classList.toggle('es-activo', p.dataset.ritual === clave); });
  }
  if ('IntersectionObserver' in window) {
    var obsRitual = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) activarRitual(en.target.dataset.ritual); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    rituales.forEach(function (r) { obsRitual.observe(r); });
  }

  /* ---------- Galerías de fotos (rituales y Héctor): scroll-snap nativo, nunca avanzan solas.
     Con una sola foto no se añaden controles; con dos o más, flechas y puntos. ---------- */
  function iniciarGaleria(g) {
    var pista = g.querySelector('.galeria__pista');
    var fotos = pista.children;
    if (fotos.length < 2) return;
    var nombre = g.getAttribute('aria-label') || 'Fotos';
    var controles = document.createElement('div');
    controles.className = 'galeria__controles';
    function boton(clase, etiqueta) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = clase;
      b.setAttribute('aria-label', etiqueta);
      return b;
    }
    var anterior = boton('galeria__flecha galeria__flecha--ant', 'Foto anterior');
    var siguiente = boton('galeria__flecha', 'Foto siguiente');
    anterior.innerHTML = siguiente.innerHTML = '<svg aria-hidden="true" focusable="false"><use href="#s-flecha"/></svg>';
    var puntos = document.createElement('div');
    puntos.className = 'galeria__puntos';
    Array.prototype.forEach.call(fotos, function (f, i) {
      var p = boton('galeria__punto', nombre + ': foto ' + (i + 1) + ' de ' + fotos.length);
      p.addEventListener('click', function () { ir(i); });
      puntos.appendChild(p);
    });
    controles.appendChild(anterior);
    controles.appendChild(puntos);
    controles.appendChild(siguiente);
    g.appendChild(controles);

    function actual() {
      return Math.max(0, Math.min(fotos.length - 1, Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth))));
    }
    function ir(i) {
      i = (i + fotos.length) % fotos.length;
      pista.scrollTo({ left: i * pista.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    }
    function marcar() {
      var i = actual();
      Array.prototype.forEach.call(puntos.children, function (p, j) { p.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    }
    anterior.addEventListener('click', function () { ir(actual() - 1); });
    siguiente.addEventListener('click', function () { ir(actual() + 1); });
    pista.addEventListener('scroll', marcar, { passive: true });
    marcar();
  }
  document.querySelectorAll('[data-galeria]').forEach(iniciarGaleria);

  /* ---------- Reseñas: caja con scroll propio. La pista solo aparece si hay más de lo que se ve. ---------- */
  var cajaResenas = document.querySelector('[data-resenas]');
  var pistaResenas = document.querySelector('[data-resenas-pista]');
  function comprobarResenas() {
    var desborda = cajaResenas.scrollHeight > cajaResenas.clientHeight + 4;
    pistaResenas.hidden = !desborda;
    cajaResenas.classList.toggle('es-desplazable', desborda);
    cajaResenas.classList.toggle('esta-al-final', cajaResenas.scrollTop + cajaResenas.clientHeight >= cajaResenas.scrollHeight - 4);
  }
  cajaResenas.addEventListener('scroll', comprobarResenas, { passive: true });
  window.addEventListener('resize', comprobarResenas);
  comprobarResenas();

  /* ---------- Mapa: se carga solo si el usuario lo pide ---------- */
  var botonMapa = document.querySelector('[data-mapa-cargar]');
  botonMapa.addEventListener('click', function () {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps?q=' + CONTACTO.geo.lat + ',' + CONTACTO.geo.lng + '&z=17&output=embed';
    iframe.title = 'Mapa: Terra Massatge, Calle de San Antonio 57, Carcaixent';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.setAttribute('allowfullscreen', '');
    botonMapa.replaceWith(iframe);
    iframe.focus();
  });

  if (!motion) return;

  /* ===========================================================================
     ANIMACIONES (solo con movimiento)
     ======================================================================== */

  /* ---------- Hero · 1. Intro al cargar ----------
     El anillo se dibuja, las manos se juntan, el montículo se posa en ellas y aparece el texto.
     La intro anima los grupos interiores (.mano__intro, .piedra__intro, #texto y la máscara del anillo);
     el scroll anima los exteriores (#mano-izq, #piedra, cada letra…), así no se pisan. */
  var logo = document.querySelector('[data-logo]');
  var trazoCirculo = logo.querySelector('[data-circulo-trazo]');
  var largoCirculo = 2 * Math.PI * trazoCirculo.r.baseVal.value + 2;
  trazoCirculo.style.strokeDasharray = largoCirculo + ' ' + largoCirculo;
  trazoCirculo.style.strokeDashoffset = largoCirculo;
  var manosIntro = logo.querySelectorAll('.mano__intro');
  gsap.set(manosIntro[0], { x: -36, autoAlpha: 0 });
  gsap.set(manosIntro[1], { x: 36, autoAlpha: 0 });
  gsap.set('.piedra__intro', { autoAlpha: 0, y: -12 });
  gsap.set('#texto', { autoAlpha: 0 });
  gsap.set(logo, { visibility: 'visible' });

  var intro = gsap.timeline({ delay: 0.1 });
  intro
    .to(trazoCirculo, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
    .to(manosIntro, { x: 0, autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0.1)
    .to('.piedra__intro', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .to('#texto', { autoAlpha: 1, duration: 0.6, ease: 'sine.inOut' }, '-=0.3')
    .fromTo('.hero__textos > *',
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, '-=0.4');
  if (!deslizaOculto) {
    intro.fromTo(desliza, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'sine.inOut' }, '-=0.6');
  }

  /* ---------- Hero · 2. Scroll: las manos se abren y dejan caer la tierra ----------
     Coordenadas en unidades del logo (viewBox 1024). Los granos de arena se crean aquí:
     nacen bajo el montículo, entre las manos, y caen mientras la luz sube. */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var arena = logo.querySelector('#arena');
  var granos = [];
  for (var g = 0; g < 70; g++) {
    var c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('cx', (478 + Math.random() * 64).toFixed(1));
    c.setAttribute('cy', (462 + Math.random() * 40).toFixed(1));
    c.setAttribute('r', (1.4 + Math.random() * 2.6).toFixed(1));
    c.setAttribute('fill', 'currentColor');
    c.setAttribute('opacity', '0');
    arena.appendChild(c);
    granos.push(c);
  }

  var salida = gsap.timeline({
    defaults: { immediateRender: false },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=80%',
      pin: true,
      scrub: true,
      anticipatePin: 1
    }
  });
  salida
    .fromTo('.hero__textos', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -24, ease: 'none', duration: 0.3 }, 0)
    // Las manos se separan y se inclinan hacia fuera, como al abrirse
    .fromTo('#mano-izq', { x: 0, y: 0, rotation: 0 }, { x: -120, y: 26, rotation: 16, svgOrigin: '330 430', ease: 'sine.inOut', duration: 0.7 }, 0.08)
    .fromTo('#mano-der', { x: 0, y: 0, rotation: 0 }, { x: 120, y: 26, rotation: -16, svgOrigin: '694 430', ease: 'sine.inOut', duration: 0.7 }, 0.08)
    .fromTo('#manos', { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.3 }, 0.48)
    // El montículo cae por el hueco y se deshace
    .fromTo('#piedra', { y: 0, scaleX: 1, scaleY: 1, autoAlpha: 1 },
      { y: 230, scaleX: 0.7, scaleY: 0.45, svgOrigin: '510 495', autoAlpha: 0, ease: 'power1.in', duration: 0.5 }, 0.2)
    // El texto se abre hacia los lados y se desvanece; el anillo se expande y se apaga
    .fromTo('#circulo', { scale: 1, autoAlpha: 1 }, { scale: 1.12, svgOrigin: '512 512', autoAlpha: 0, ease: 'none', duration: 0.5 }, 0.12)
    .fromTo('.hero__luz', { yPercent: 0 }, { yPercent: -100, ease: 'sine.inOut', duration: 1 }, 0);
  logo.querySelectorAll('.logo__letra').forEach(function (letra) {
    var dx = (Number(letra.dataset.cx) - 512) * 0.9;
    salida.fromTo(letra, { x: 0, autoAlpha: 1 }, { x: dx, autoAlpha: 0, ease: 'sine.in', duration: 0.45 }, 0);
  });
  granos.forEach(function (grano) {
    var inicio = 0.18 + Math.random() * 0.42;
    var caida = 240 + Math.random() * 420;
    salida
      .fromTo(grano, { x: 0, y: 0, opacity: 0 }, { x: (Math.random() - 0.5) * 60, y: caida, ease: 'power1.in', duration: 0.34 }, inicio)
      .to(grano, { opacity: 0.9, ease: 'none', duration: 0.05 }, inicio)
      .to(grano, { opacity: 0, ease: 'none', duration: 0.12 }, inicio + 0.22);
  });

  /* ---------- Entradas de sección: una vez por sección ---------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    if (el.closest('[hidden]')) return;
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
  });

  /* ---------- Parallax sutil solo en fotografías (máx. 40px) ---------- */
  gsap.utils.toArray('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img,
      { y: -20 },
      {
        y: 20, ease: 'none',
        scrollTrigger: { trigger: img.closest('.foto--parallax'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
  });

  /* Recalcular posiciones cuando cargan las fuentes y las imágenes */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
