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
     Duraciones confirmadas: las de los flyers (tiempo real de masaje);
     Booksy indica 55 min para Esencia y Combo y 30 min para Presoterapia. */
  var RITUALES = {
    esencia:      { nombre: 'Esencia Terra', corto: 'Esencia', duracion: '50 min de masaje', precio: 35,
                    desc: 'Masaje relajante premium de inspiración mediterránea, con toallas calientes.' },
    express:      { nombre: 'Terra Express', duracion: '30 min', precio: 22.5,
                    desc: 'La experiencia Esencia Terra en formato corto.' },
    reset:        { nombre: 'Terra Reset', duracion: '55 min', precio: 35,
                    desc: 'Masaje descontracturante y deportivo.' },
    presoterapia: { nombre: 'Presoterapia Terra', duracion: '30–40 min', precio: 25,
                    desc: 'Presoterapia neumática con tecnología Bootech® para piernas cansadas.' },
    combo:        { nombre: 'Combo Premium Terra', duracion: '50 min', precio: 45,
                    desc: 'Masaje manual y presoterapia a la vez.' }
  };

  var DATOS = {
    esencia: RITUALES.esencia,
    express: RITUALES.express,
    reset: RITUALES.reset,
    presoterapia: RITUALES.presoterapia,
    combo: RITUALES.combo,
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
    el.textContent = /\.precio$/.test(ruta) ? euros(valor) : valor;
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
      description: 'Quiromasaje y bienestar en Carcaixent. Masaje relajante, descontracturante, deportivo y presoterapia.',
      url: CONTACTO.web,
      image: CONTACTO.web + 'assets/og-image.jpg',
      logo: CONTACTO.web + 'assets/logo-terra.svg',
      telephone: CONTACTO.telefono,
      email: correo(),
      founder: { '@type': 'Person', name: 'Héctor Salom', jobTitle: 'Quiromasajista' },
      priceRange: '€€',
      paymentAccepted: 'Tarjeta de crédito, tarjeta de débito',
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
    titulo.className = 'panel__nombre';
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

  /* ---------- Carrusel de reseñas (móvil): scroll-snap nativo + puntos ---------- */
  var carrusel = document.querySelector('[data-carrusel]');
  var puntos = document.querySelectorAll('[data-puntos] button');
  var resenas = carrusel.querySelectorAll('.opinion');
  function puntoActivo() {
    var paso = resenas.length > 1 ? resenas[1].offsetLeft - resenas[0].offsetLeft : 1;
    var i = Math.max(0, Math.min(resenas.length - 1, Math.round(carrusel.scrollLeft / paso)));
    puntos.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
  }
  carrusel.addEventListener('scroll', puntoActivo, { passive: true });
  puntos.forEach(function (b, i) {
    b.addEventListener('click', function () {
      carrusel.scrollTo({ left: resenas[i].offsetLeft - resenas[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

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

  /* ---------- Hero · 1. Intro al cargar: el logo se dibuja ---------- */
  var marca = document.querySelector('[data-marca]');
  var logo = document.querySelector('[data-logo]');
  var trazos = logo.querySelectorAll('#circulo, #manos path');
  trazos.forEach(function (p) {
    var largo = p.getTotalLength() + 2;
    p.style.strokeDasharray = largo + ' ' + largo;
    p.style.strokeDashoffset = largo;
  });
  gsap.set('#piedra', { autoAlpha: 0, y: -12 });
  gsap.set('#texto', { autoAlpha: 0 });
  gsap.set(logo, { visibility: 'visible' });

  // Capa para el logo HD (acabado metálico real): solo en pantallas de más de 768px.
  var capaHD = null;
  if (window.matchMedia('(min-width: 769px)').matches) {
    capaHD = document.createElement('span');
    capaHD.className = 'hero__hd-capa';
    capaHD.setAttribute('aria-hidden', 'true');
    capaHD.innerHTML =
      '<span class="hero__hd"><picture>' +
      '<source type="image/webp" srcset="assets/img/logo-hd-800.webp 800w, assets/img/logo-hd.webp 1600w" sizes="400px">' +
      '<img src="assets/img/logo-hd-800.jpg" srcset="assets/img/logo-hd-800.jpg 800w, assets/img/logo-hd.jpg 1600w" sizes="400px" alt="" decoding="async">' +
      '</picture></span>';
    marca.appendChild(capaHD);
  }

  function fundidoHD() {
    if (!capaHD) return;
    var hd = capaHD.querySelector('.hero__hd');
    var img = hd.querySelector('img');
    var mostrar = function () { gsap.to(hd, { opacity: 1, duration: 1.2, ease: 'sine.inOut' }); };
    if (img.complete && img.naturalWidth) mostrar();
    else img.addEventListener('load', mostrar, { once: true });
  }

  var intro = gsap.timeline({ delay: 0.2 });
  intro
    .to(trazos, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
    .to('#piedra', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.15')
    .to('#texto', { autoAlpha: 1, duration: 0.9, ease: 'sine.inOut' }, '-=0.35')
    .fromTo('.hero__textos > *',
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }, '-=0.4')
    .add(fundidoHD, '-=0.6');
  if (!deslizaOculto) {
    intro.fromTo(desliza, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'sine.inOut' }, '-=0.6');
  }

  /* ---------- Hero · 2. Scroll: de la noche a la luz ---------- */
  var salida = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: true,
      anticipatePin: 1
    }
  });
  salida
    .to(marca, { scale: 0.6, yPercent: -10, ease: 'none', duration: 1 }, 0)
    .to('.hero__textos', { autoAlpha: 0, y: -24, ease: 'none', duration: 0.45 }, 0)
    .fromTo('.hero__luz', { yPercent: 0 }, { yPercent: -100, ease: 'sine.inOut', duration: 1 }, 0);
  // Sobre el papel se ve el logo plano: el HD (con su fondo negro) se desvanece al empezar a subir la luz.
  if (capaHD) salida.to(capaHD, { opacity: 0, ease: 'none', duration: 0.4 }, 0.1);

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
