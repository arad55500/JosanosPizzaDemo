/* ============================================================
   JOEZANO'S PIZZA — Gallery Lightbox
   Keyboard accessible, touch-friendly, vanilla JS
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initGallery);

  function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox     = document.getElementById('lightbox');
    if (!galleryItems.length || !lightbox) return;

    const lbImg     = lightbox.querySelector('.lightbox__img');
    const lbClose   = lightbox.querySelector('.lightbox__close');
    const lbPrev    = lightbox.querySelector('.lightbox__nav--prev');
    const lbNext    = lightbox.querySelector('.lightbox__nav--next');
    const lbCounter = lightbox.querySelector('.lightbox__counter');

    const images = [];
    let currentIndex = 0;

    // Collect gallery images
    galleryItems.forEach((item, i) => {
      const img = item.querySelector('img');
      if (img) {
        images.push({
          src: img.src,
          alt: img.alt || `Gallery image ${i + 1}`
        });
      }

      // Open lightbox on click
      item.addEventListener('click', () => openLightbox(i));

      // Keyboard: Enter/Space to open
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image ${i + 1} in lightbox`);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxImage();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus close button for accessibility
      setTimeout(() => lbClose?.focus(), 100);
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Return focus to the gallery item
      galleryItems[currentIndex]?.focus();
    }

    function updateLightboxImage() {
      if (!images[currentIndex]) return;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt;
      if (lbCounter) {
        lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
      }
    }

    function goNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    }

    function goPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }

    // Event listeners
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', goPrev);
    if (lbNext)  lbNext.addEventListener('click', goNext);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
      }
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    }, { passive: true });
  }

})();
