/**
 * gallery.js — Hoey Art & Love
 * Exported functions are pure/testable with Jest + jsdom.
 */

/**
 * Filter gallery cards by category.
 * Cards whose data-category does not match are hidden.
 * When category is 'all', all cards are shown.
 *
 * @param {string} category
 * @param {Document} [doc=document]
 */
export function filterCards(category, doc = document) {
  const cards = doc.querySelectorAll('.gallery-card');
  cards.forEach((card) => {
    if (category === 'all' || card.dataset.category === category) {
      card.removeAttribute('hidden');
    } else {
      card.setAttribute('hidden', '');
    }
  });
}

/**
 * Open the lightbox with a given image.
 *
 * @param {string} imgSrc
 * @param {string} altText
 * @param {Element} triggerEl  — element that triggered the open (for focus restore)
 * @param {Document} [doc=document]
 */
export function openLightbox(imgSrc, altText, triggerEl, doc = document) {
  const dialog = doc.getElementById('lightbox');
  const img = doc.getElementById('lightbox-img');
  if (!dialog || !img) return;

  img.setAttribute('src', imgSrc);
  img.setAttribute('alt', altText);
  dialog._triggerEl = triggerEl;
  dialog.showModal();
}

/**
 * Close the lightbox and restore focus to the element that opened it.
 *
 * @param {HTMLDialogElement} dialog
 */
export function closeLightbox(dialog) {
  if (!dialog) return;
  const triggerEl = dialog._triggerEl;
  dialog.close();
  if (triggerEl && typeof triggerEl.focus === 'function') {
    triggerEl.focus();
  }
}

/**
 * Wire all event listeners. Called once on DOMContentLoaded.
 * Exported so it can be tested with jsdom.
 *
 * @param {Document} [doc=document]
 */
export function initGallery(doc = document) {
  const filterBtns = doc.querySelectorAll('.filter-btn');
  const gallery = doc.getElementById('gallery');
  const dialog = doc.getElementById('lightbox');
  const closeBtn = doc.getElementById('lightbox-close');

  // Category filter
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      filterCards(btn.dataset.filter, doc);
    });
  });

  // Open lightbox when a gallery card image is clicked
  if (gallery) {
    gallery.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;
      const img = card.querySelector('img');
      if (!img) return;
      openLightbox(img.getAttribute('src'), img.getAttribute('alt'), card, doc);
    });

    // Keyboard: Enter/Space on a focused card
    gallery.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.gallery-card');
      if (!card) return;
      e.preventDefault();
      const img = card.querySelector('img');
      if (!img) return;
      openLightbox(img.getAttribute('src'), img.getAttribute('alt'), card, doc);
    });

    // Make cards keyboard-focusable
    doc.querySelectorAll('.gallery-card').forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
    });
  }

  // Close lightbox — close button
  if (closeBtn && dialog) {
    closeBtn.addEventListener('click', () => closeLightbox(dialog));
  }

  // Close lightbox — restore focus when dialog closes natively (Escape key)
  if (dialog) {
    dialog.addEventListener('close', () => {
      const triggerEl = dialog._triggerEl;
      if (triggerEl && typeof triggerEl.focus === 'function') {
        triggerEl.focus();
      }
    });

    // Close lightbox — click outside the dialog content
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeLightbox(dialog);
      }
    });
  }
}

if (typeof document !== 'undefined' && typeof process === 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initGallery(document));
}
