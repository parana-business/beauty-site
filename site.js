(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 760px)');
  const {number, instagram, gallery} = window.beautySite;
  document.documentElement.classList.add('has-js');

  const heroImage = document.querySelector('#hero-image');
  const loader = document.querySelector('#loader');
  if (!heroImage.complete && !reducedMotion.matches && !location.hash) {
    const loaderTimer = window.setTimeout(() => { loader.hidden = false; }, 80);
    const reveal = () => {
      window.clearTimeout(loaderTimer);
      window.clearTimeout(deadline);
      if (!loader.hidden) {
        loader.classList.add('is-opening');
        loader.addEventListener('animationend', (event) => {
          if (event.target === loader) loader.hidden = true;
        });
      }
    };
    const deadline = window.setTimeout(reveal, 1450);
    heroImage.addEventListener('load', reveal, {once: true});
    heroImage.addEventListener('error', reveal, {once: true});
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  menuToggle.hidden = false;

  function setMenu(open, returnFocus = false) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => setMenu(menu.hidden));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden && !document.querySelector('dialog[open]')) {
      event.preventDefault();
      setMenu(false, true);
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.hidden && !event.target.closest('.site-header')) setMenu(false);
  });
  narrow.addEventListener('change', () => setMenu(false));

  const serviceButtons = [...document.querySelectorAll('.service-toggle')];
  const servicePanels = serviceButtons.map((button) =>
    document.getElementById(button.getAttribute('aria-controls'))
  );
  function selectService(index, animate = true) {
    serviceButtons.forEach((button, position) => {
      const active = position === index;
      const panel = servicePanels[position];
      button.setAttribute('aria-expanded', String(active));
      panel.hidden = !active;
      panel.classList.toggle('panel-reveal', active && animate);
    });
  }
  selectService(0, false);
  serviceButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      if (expanded && !narrow.matches) return;
      selectService(expanded ? -1 : index);
      if (narrow.matches && button.getBoundingClientRect().top < menuToggle.closest('header').offsetHeight) {
        button.scrollIntoView({block: 'start'});
      }
    });
  });
  narrow.addEventListener('change', () => {
    if (!narrow.matches && servicePanels.every((panel) => panel.hidden)) selectService(0, false);
  });

  const dialog = document.querySelector('#preview-dialog');
  const dialogHeading = document.querySelector('#dialog-heading');
  const dialogDetail = document.querySelector('#dialog-detail');
  const dialogImage = document.querySelector('.dialog-image');
  const dialogMessage = document.querySelector('.dialog-message');
  const messagePreview = document.querySelector('#message-preview');
  const copyStatus = document.querySelector('.copy-status');
  const interest = document.querySelector('#interest');
  const submit = document.querySelector('#contact-submit');
  let previousFocus;

  function showDialog({title, detail, message, picture}, trigger) {
    previousFocus = trigger;
    dialogHeading.textContent = title;
    dialogDetail.textContent = detail || '';
    dialogDetail.hidden = !detail;
    dialogMessage.hidden = !message;
    messagePreview.value = message || '';
    copyStatus.textContent = '';
    dialogImage.hidden = !picture;
    if (picture) {
      dialogImage.src = trigger.href;
      dialogImage.alt = picture.alt;
    }
    dialog.showModal();
  }

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (previousFocus?.closest('#mobile-nav') && menu.hidden) {
      menuToggle.focus();
    } else {
      previousFocus?.focus();
    }
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(messagePreview.value);
      copyStatus.textContent = 'Mensaje copiado.';
    } catch {
      messagePreview.focus();
      messagePreview.select();
      copyStatus.textContent = 'Seleccionamos el mensaje para que puedas copiarlo.';
    }
  });

  function messageFor(service) {
    return service
      ? 'Hola, quisiera consultar por ' + service + '. ¿Qué turnos tienen disponibles?'
      : 'Hola, quisiera consultar por turnos. ¿Qué disponibilidad tienen?';
  }

  function refreshSubmitLink() {
    if (number) submit.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(messageFor(interest.value));
  }
  interest.addEventListener('change', refreshSubmitLink);
  refreshSubmitLink();

  document.querySelectorAll('.contact-action').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (number) return;
      event.preventDefault();
      showDialog({
        title: 'Consulta por WhatsApp',
        detail: 'El número del salón está pendiente de confirmación.',
        message: messageFor(link === submit ? interest.value : link.dataset.service),
      }, link);
    });
  });
  document.querySelectorAll('.instagram-action').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (instagram) return;
      event.preventDefault();
      showDialog({title: 'Instagram', detail: 'El perfil oficial del salón está pendiente de confirmación.'}, link);
    });
  });
  document.querySelectorAll('[data-gallery]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const picture = gallery[Number(link.dataset.gallery)];
      showDialog({title: picture.title, picture, detail: 'Imagen editorial de muestra.'}, link);
    });
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenu(false);
      const target = link.hash && document.getElementById(link.hash.slice(1));
      if (target && !dialog.open) target.focus({preventScroll: true});
    });
  });

  const hero = document.querySelector('.hero');
  const services = document.querySelector('.services');
  const gallerySection = document.querySelector('.gallery');
  const firstPiece = gallerySection.querySelector('.gallery-piece');
  const contact = document.querySelector('.contact');
  const footer = document.querySelector('.footer-inner');
  const clamp = (value) => Math.min(1, Math.max(0, value));
  let frame;

  function updateMotion() {
    frame = undefined;
    const screen = window.innerHeight;
    const heroTop = hero.getBoundingClientRect().top;
    const serviceTop = services.getBoundingClientRect().top;
    const pieceTop = firstPiece.getBoundingClientRect().top;
    const contactTop = contact.getBoundingClientRect().top;
    const footerTop = footer.getBoundingClientRect().top;
    const small = narrow.matches;
    const heroOffset = Math.min(small ? 50 : 160, Math.max(0, -heroTop) * (small ? .12 : .27));
    const veil = clamp((screen * .89 - serviceTop) / (screen * .42));
    const intro = clamp((screen * .97 - pieceTop) / (screen * .46));
    const outro = clamp((screen - contactTop) / (screen * .62));
    const line = clamp((screen + 8 - footerTop) / 54);
    hero.style.setProperty('--hero-shift', heroOffset + 'px');
    services.style.setProperty('--veil-shift', (24 - veil * (small ? 9 : 18)) + 'px');
    gallerySection.style.setProperty('--gallery-inset', ((1 - intro) * (small ? 8 : 22)) + '%');
    gallerySection.style.setProperty('--gallery-shift', -outro * (small ? 11 : 29) + 'px');
    footer.style.setProperty('--footer-line', String(line));
  }

  function requestMotion() {
    if (!reducedMotion.matches && frame === undefined) frame = window.requestAnimationFrame(updateMotion);
  }
  window.addEventListener('scroll', requestMotion, {passive: true});
  window.addEventListener('resize', requestMotion);
  reducedMotion.addEventListener('change', requestMotion);
  requestMotion();
})();
