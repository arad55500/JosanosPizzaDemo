/* ============================================================
   JOEZANO'S PIZZA — Main JavaScript
   Navigation, scroll reveals, parallax, form validation
   ============================================================ */

(function () {
  'use strict';

  /* ----- DOM Ready ----- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupNav();
    setupScrollReveal();
    setupHeroParallax();
    setupForms();
    highlightActiveNav();
    setupImageFallbacks();
  }


  /* ===========================
     1. NAVIGATION
     =========================== */
  function setupNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.querySelector('.navbar__toggle');
    const menu   = document.querySelector('.navbar__menu');
    const overlay = document.querySelector('.navbar__overlay');

    if (!navbar) return;

    // Scroll: add .scrolled class
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
        document.body.style.overflow = expanded ? '' : 'hidden';
      });

      // Close on overlay click
      if (overlay) {
        overlay.addEventListener('click', () => closeMenu(toggle, menu, overlay));
      }

      // Close on menu link click
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeMenu(toggle, menu, overlay));
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          closeMenu(toggle, menu, overlay);
        }
      });
    }
  }

  function closeMenu(toggle, menu, overlay) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }


  /* ===========================
     2. SCROLL REVEAL (IntersectionObserver)
     =========================== */
  function setupScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Make everything visible immediately
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const options = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }


  /* ===========================
     3. HERO PARALLAX (lightweight)
     =========================== */
  function setupHeroParallax() {
    const heroBg = document.querySelector('.hero__bg');
    if (!heroBg) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.05)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ===========================
     4. FORM VALIDATION
     =========================== */
  function setupForms() {
    document.querySelectorAll('[data-validate-form]').forEach(form => {
      const successEl = form.parentElement.querySelector('.form-success');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
          clearError(input);
        });

        // Validate required fields
        form.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            showError(field, 'This field is required.');
            isValid = false;
          }
        });

        // Validate email
        form.querySelectorAll('[type="email"]').forEach(emailField => {
          if (emailField.value.trim() && !isValidEmail(emailField.value)) {
            showError(emailField, 'Please enter a valid email address.');
            isValid = false;
          }
        });

        // Validate phone
        form.querySelectorAll('[type="tel"]').forEach(phoneField => {
          if (phoneField.value.trim() && !isValidPhone(phoneField.value)) {
            showError(phoneField, 'Please enter a valid phone number.');
            isValid = false;
          }
        });

        if (isValid) {
          // Show success
          form.style.display = 'none';
          if (successEl) {
            successEl.classList.add('visible');
            successEl.setAttribute('aria-live', 'polite');
          }
        } else {
          // Focus first error field
          const firstError = form.querySelector('.error');
          if (firstError) firstError.focus();
        }
      });

      // Live clear errors on input
      form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
        field.addEventListener('input', () => clearError(field));
      });
    });
  }

  function showError(field, message) {
    field.classList.add('error');
    const errorEl = field.parentElement.querySelector('.form-error-msg');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error-msg');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\d\s\-\(\)\+]{7,}$/.test(phone);
  }


  /* ===========================
     5. ACTIVE NAV LINK
     =========================== */
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }


  /* ===========================
     6. IMAGE FALLBACKS
     =========================== */
  function setupImageFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach(img => {
      img.addEventListener('error', function handler() {
        this.removeEventListener('error', handler);
        this.closest('.food-card__img, .gallery-item, .menu-item__img')
          ?.classList.add('img-placeholder');
        this.style.display = 'none';

        // Add placeholder icon
        const placeholder = document.createElement('span');
        placeholder.textContent = '🍕';
        placeholder.style.fontSize = '3rem';
        this.parentElement.appendChild(placeholder);
      });
    });
  }

})();
