/* ============================================================
   WASH WIZARD DETAILING — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Sticky Header ---- */
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---- Mobile Nav Toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--header-h')
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll-to-Top Button ---- */
  const scrollTopBtn = document.getElementById('scroll-top');

  function updateScrollTopBtn() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateScrollTopBtn, { passive: true });
  updateScrollTopBtn();

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Scroll-based Reveal Animation ---- */
  const revealTargets = [
    '.service-card',
    '.wuf-item',
    '.testimonial-card',
    '.gallery-item',
    '.contact-detail-item',
    '.trust-item',
  ];

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, index) {
      el.classList.add('reveal');
      el.style.transitionDelay = (index % 3) * 0.1 + 's';
      revealObserver.observe(el);
    });
  });

  // Add reveal CSS via JS so it still works without the class in the stylesheet
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(revealStyle);

  /* ---- Contact Form Handler ---- */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic client-side validation
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(function (field) {
        field.classList.remove('input-error');
        if (!field.value.trim()) {
          field.classList.add('input-error');
          valid = false;
        }
      });

      if (!valid) {
        const firstError = form.querySelector('.input-error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        form.hidden = true;
        formSuccess.hidden = false;
      }, 800);
    });

    // Live validation feedback
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('blur', function () {
        if (!field.value.trim()) {
          field.classList.add('input-error');
        } else {
          field.classList.remove('input-error');
        }
      });
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.classList.remove('input-error');
        }
      });
    });
  }

  // Error style for validation
  const errorStyle = document.createElement('style');
  errorStyle.textContent = `
    .input-error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important;
    }
  `;
  document.head.appendChild(errorStyle);

  /* ---- Active nav link highlighting ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-link');
  const headerH   = () => parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  ) || 72;

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navItems.forEach(function (link) {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: `-${headerH()}px 0px -60% 0px`, threshold: 0 }
  );

  sections.forEach(function (section) { sectionObserver.observe(section); });

  // Active link style
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-link.active {
      color: #fff !important;
      background: rgba(14,165,233,0.15) !important;
    }
  `;
  document.head.appendChild(activeStyle);

})();
