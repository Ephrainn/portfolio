/* ============================================================
   DEVPULSE PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ── Navbar: scroll effect + active link ─────────────────── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const overlay  = document.getElementById('navOverlay');

  if (!navbar) return;

  /* Scrolled state */
  const onScroll = () => {
    navbar.style.background = window.scrollY > 40
      ? 'rgba(13,17,23,.97)'
      : 'rgba(13,17,23,.85)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu toggle */
  const closeMenu = () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    burger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);

  /* Close menu when a link is clicked */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Active link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const allLinks = navLinks.querySelectorAll('.nav-link');

  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    allLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ── Smooth-scroll for all #anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Scroll-progress bar ──────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:2px', 'width:0',
    'background:var(--blue)', 'z-index:9999',
    'transition:width .1s linear', 'pointer-events:none'
  ].join(';');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ── Fade-in on scroll (IntersectionObserver) ────────────── */
(function initFadeIn() {
  /* Tag all direct children of section-containers as fade targets */
  document.querySelectorAll(
    '.hero > .section-container > *,' +
    '.about > .section-container > *,' +
    '.skills > .section-container > *,' +
    '.projects > .section-container > *,' +
    '.education > .section-container > *,' +
    '.services > .section-container > *,' +
    '.contact > .section-container > *'
  ).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
})();

/* ── Proficiency bar animation ───────────────────────────── */
(function initProfBars() {
  const bars = document.querySelectorAll('.prof-bar-fill[data-width]');
  if (!bars.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // Small delay so the fade-in transition finishes first
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, 200);
        io.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();

/* ── Project filter tabs ──────────────────────────────────── */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');

  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Update active state */
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);

        /* Re-trigger a subtle entrance */
        if (match) {
          card.style.animation = 'none';
          card.offsetHeight;               // reflow
          card.style.animation = '';
        }
      });
    });
  });
})();

/* ── Floating "Hire Me" button hide when contact visible ─── */
(function initHireMe() {
  const btn     = document.querySelector('.hire-me-btn');
  const contact = document.getElementById('contact');
  if (!btn || !contact) return;

  const io = new IntersectionObserver(entries => {
    btn.classList.toggle('hidden', entries[0].isIntersecting);
  }, { threshold: 0.2 });

  io.observe(contact);
})();

/* ── Contact form (EmailJS) ───────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const submit = document.getElementById('contactSubmit');
  if (!form) return;

  /*
   * Replace the three placeholders below with your EmailJS credentials:
   *   SERVICE_ID  — from EmailJS dashboard → Email Services
   *   TEMPLATE_ID — from EmailJS dashboard → Email Templates
   *   PUBLIC_KEY  — from EmailJS dashboard → Account → Public Key
   *
   * Template variables used: {{from_name}}, {{from_email}}, {{message}}
   */
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    /* Basic client-side validation */
    if (!name || !email || !message) {
      showFormFeedback(submit, 'Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormFeedback(submit, 'Please enter a valid email.', 'error');
      return;
    }

    const originalHTML = submit.innerHTML;
    submit.disabled = true;
    submit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        message:    message,
      });

      submit.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submit.style.background  = 'var(--green)';
      submit.style.borderColor = 'var(--green)';
      form.reset();

    } catch (err) {
      console.error('EmailJS error:', err);
      submit.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Could not send — try again.';
      submit.style.background  = '#cf222e';
      submit.style.borderColor = '#cf222e';
    }

    setTimeout(() => {
      submit.innerHTML  = originalHTML;
      submit.style.background  = '';
      submit.style.borderColor = '';
      submit.disabled   = false;
    }, 3500);
  });

  function showFormFeedback(btn, msg, type) {
    const orig = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check'}"></i> ${msg}`;
    btn.style.background  = type === 'error' ? '#cf222e' : 'var(--green)';
    btn.style.borderColor = type === 'error' ? '#cf222e' : 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background  = '';
      btn.style.borderColor = '';
    }, 2800);
  }
})();

/* ── Skill icon cards: hover tilt (desktop only) ─────────── */
(function initTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.skill-icon-card, .wid-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-3px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── Page load fade-in ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
