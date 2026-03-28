/**
 * gallery.test.js — Unit tests for gallery.js
 * Environment: jsdom (configured in package.json)
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { filterCards, openLightbox, closeLightbox, initGallery } from '../js/gallery.js';

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a minimal gallery DOM fixture and inject it into document.body.
 * Returns the dialog element for convenience.
 */
function buildFixture() {
  document.body.innerHTML = `
    <main id="gallery">
      <article class="gallery-card" data-category="gnomes">
        <figure>
          <img src="resources/images/gnomes/gnome.jpg" alt="Gnome" />
          <figcaption><h3>Gnome</h3></figcaption>
        </figure>
      </article>
      <article class="gallery-card" data-category="animals">
        <figure>
          <img src="resources/images/animals/chicken.jpg" alt="Chicken" />
          <figcaption><h3>Chicken</h3></figcaption>
        </figure>
      </article>
      <article class="gallery-card" data-category="objects">
        <figure>
          <img src="resources/images/objects/candle.jpg" alt="Candle" />
          <figcaption><h3>Candle</h3></figcaption>
        </figure>
      </article>
    </main>

    <dialog id="lightbox">
      <button id="lightbox-close">&times;</button>
      <img id="lightbox-img" src="" alt="" />
    </dialog>
  `;

  // jsdom doesn't implement showModal/close — provide minimal stubs
  const dialog = document.getElementById('lightbox');
  dialog.showModal = jest.fn(() => { dialog.open = true; });
  dialog.close    = jest.fn(() => { dialog.open = false; });

  return dialog;
}

// ── filterCards ────────────────────────────────────────────────────────────

describe('filterCards()', () => {
  beforeEach(buildFixture);

  test('shows all cards when category is "all"', () => {
    // First hide everything, then call 'all'
    document.querySelectorAll('.gallery-card').forEach((c) => c.setAttribute('hidden', ''));
    filterCards('all');
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach((card) => {
      expect(card.hasAttribute('hidden')).toBe(false);
    });
  });

  test('shows only gnome cards when filtering by "gnomes"', () => {
    filterCards('gnomes');
    const gnomeCards   = document.querySelectorAll('[data-category="gnomes"]');
    const animalCards  = document.querySelectorAll('[data-category="animals"]');
    const objectCards  = document.querySelectorAll('[data-category="objects"]');

    gnomeCards.forEach((c)  => expect(c.hasAttribute('hidden')).toBe(false));
    animalCards.forEach((c) => expect(c.hasAttribute('hidden')).toBe(true));
    objectCards.forEach((c) => expect(c.hasAttribute('hidden')).toBe(true));
  });

  test('shows only animal cards when filtering by "animals"', () => {
    filterCards('animals');
    const animalCards = document.querySelectorAll('[data-category="animals"]');
    const nonAnimal   = document.querySelectorAll('.gallery-card:not([data-category="animals"])');

    animalCards.forEach((c) => expect(c.hasAttribute('hidden')).toBe(false));
    nonAnimal.forEach((c)   => expect(c.hasAttribute('hidden')).toBe(true));
  });

  test('returns all cards visible after switching from filtered to "all"', () => {
    filterCards('plants');
    filterCards('all');
    document.querySelectorAll('.gallery-card').forEach((card) => {
      expect(card.hasAttribute('hidden')).toBe(false);
    });
  });
});

// ── openLightbox ───────────────────────────────────────────────────────────

describe('openLightbox()', () => {
  let dialog;
  beforeEach(() => { dialog = buildFixture(); });

  test('sets the lightbox image src and alt', () => {
    openLightbox('resources/images/gnomes/gnome.jpg', 'A gnome', null);
    const img = document.getElementById('lightbox-img');
    expect(img.getAttribute('src')).toBe('resources/images/gnomes/gnome.jpg');
    expect(img.getAttribute('alt')).toBe('A gnome');
  });

  test('calls showModal to open the dialog', () => {
    openLightbox('resources/images/animals/mouse.jpg', 'Mouse', null);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
  });

  test('stores the trigger element reference on the dialog', () => {
    const trigger = document.createElement('button');
    openLightbox('resources/images/plants/cactus.jpg', 'Cactus', trigger);
    expect(dialog._triggerEl).toBe(trigger);
  });

  test('does nothing if dialog element is missing', () => {
    document.getElementById('lightbox').remove();
    expect(() => openLightbox('img.jpg', 'alt', null)).not.toThrow();
  });
});

// ── closeLightbox ──────────────────────────────────────────────────────────

describe('closeLightbox()', () => {
  let dialog;
  beforeEach(() => { dialog = buildFixture(); });

  test('calls dialog.close()', () => {
    closeLightbox(dialog);
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });

  test('restores focus to the trigger element', () => {
    const trigger = document.createElement('button');
    trigger.focus = jest.fn();
    document.body.appendChild(trigger);
    dialog._triggerEl = trigger;

    closeLightbox(dialog);
    expect(trigger.focus).toHaveBeenCalledTimes(1);
  });

  test('does not throw when trigger element is null', () => {
    dialog._triggerEl = null;
    expect(() => closeLightbox(dialog)).not.toThrow();
  });

  test('does nothing when dialog is null', () => {
    expect(() => closeLightbox(null)).not.toThrow();
  });
});

// ── initGallery ────────────────────────────────────────────────────────────

describe('initGallery()', () => {
  let dialog;
  beforeEach(() => { dialog = buildFixture(); });

  function buildNavFixture() {
    // Add filter nav to fixture
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <button class="filter-btn active" data-filter="all" aria-pressed="true">All</button>
      <button class="filter-btn" data-filter="gnomes" aria-pressed="false">Gnomes</button>
      <button class="filter-btn" data-filter="animals" aria-pressed="false">Animals</button>
      <button class="filter-btn" data-filter="objects" aria-pressed="false">Objects &amp; Other</button>
    `;
    document.body.prepend(nav);
    return nav;
  }

  test('makes gallery cards keyboard-focusable', () => {
    initGallery(document);
    document.querySelectorAll('.gallery-card').forEach((card) => {
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('role')).toBe('button');
    });
  });

  test('clicking a filter button hides non-matching categories', () => {
    buildNavFixture();
    initGallery(document);
    const gnomeBtn = document.querySelector('[data-filter="gnomes"]');
    gnomeBtn.click();
    const animalCards = document.querySelectorAll('[data-category="animals"]');
    animalCards.forEach((c) => expect(c.hasAttribute('hidden')).toBe(true));
  });

  test('clicking a filter button updates aria-pressed on active button', () => {
    buildNavFixture();
    initGallery(document);
    const gnomeBtn = document.querySelector('[data-filter="gnomes"]');
    const allBtn   = document.querySelector('[data-filter="all"]');
    gnomeBtn.click();
    expect(gnomeBtn.getAttribute('aria-pressed')).toBe('true');
    expect(allBtn.getAttribute('aria-pressed')).toBe('false');
  });

  test('clicking a gallery card opens the lightbox', () => {
    initGallery(document);
    const card = document.querySelector('[data-category="gnomes"]');
    card.click();
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
  });

  test('clicking the lightbox close button closes the dialog', () => {
    initGallery(document);
    dialog.open = true;
    document.getElementById('lightbox-close').click();
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });

  test('clicking the dialog backdrop closes the dialog', () => {
    initGallery(document);
    // Simulate click on the dialog element itself (backdrop)
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });

  test('handles gallery click where target has no card ancestor', () => {
    initGallery(document);
    const gallery = document.getElementById('gallery');
    // Click on the gallery element itself (not a card)
    expect(() => gallery.dispatchEvent(new MouseEvent('click', { bubbles: false }))).not.toThrow();
  });

  test('keydown Enter on a gallery card opens the lightbox', () => {
    initGallery(document);
    const card = document.querySelector('[data-category="animals"]');
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    card.dispatchEvent(event);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
  });

  test('keydown on non-Enter/Space key does not open lightbox', () => {
    initGallery(document);
    const card = document.querySelector('[data-category="animals"]');
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    card.dispatchEvent(event);
    expect(dialog.showModal).not.toHaveBeenCalled();
  });
});
