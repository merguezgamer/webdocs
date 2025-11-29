/* -----------------------
   Petit JS pour interactions
   - Lightbox
   - Article modal
   - Accessibility: keyboard
   ----------------------- */

// LIGHTBOX
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

// délégation clic / clavier pour ouvrir la lightbox — fonctionne pour .photo-card, .photo-lien, .gallery img, etc.
gallery?.addEventListener('click', (e) => {
  // cible une carte galerie quelle que soit la classe utilisée
  const card = e.target.closest('.photo-card, .photo-lien, .gallery-item');
  if (card) {
    const imgEl = card.querySelector('img');
    const src = imgEl?.currentSrc || imgEl?.src || card.dataset.full || card.dataset.src;
    if (src) openLightbox(src, imgEl?.alt || card.dataset.alt || 'Photo');
    return;
  }
  // si on clique directement sur une image dans #gallery sans wrapper
  const img = e.target.closest('#gallery img, .gallery img');
  if (img) {
    const src = img.currentSrc || img.src || img.dataset.full || img.dataset.src;
    if (src) openLightbox(src, img.alt || 'Photo');
  }
});

gallery?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const card = e.target.closest('.photo-card, .photo-lien, .gallery-item');
  if (card) {
    const imgEl = card.querySelector('img');
    const src = imgEl?.currentSrc || imgEl?.src || card.dataset.full || card.dataset.src;
    if (src) openLightbox(src, imgEl?.alt || card.dataset.alt || 'Photo');
    return;
  }
  const img = e.target.closest('#gallery img, .gallery img');
  if (img) {
    const src = img.currentSrc || img.src || img.dataset.full || img.dataset.src;
    if (src) openLightbox(src, img.alt || 'Photo');
  }
});

function openLightbox(src, alt) {
    console.log('openLightbox called with', src, alt);
    if (!src) { console.warn('no src provided to openLightbox'); return; }
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
}
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// --- Ajout : attacher le lightbox aux images du carrousel ---
(function attachCarouselLightbox() {
  const carousel = document.getElementById('photoCarousel');
  if (!carousel) return;
  const imgs = carousel.querySelectorAll('img');
  imgs.forEach(img => {
    // rendre focusable et montrer que c'est cliquable
    if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');
    img.style.cursor = 'pointer';

    // clic -> ouvrir lightbox
    img.addEventListener('click', () => {
      const src = img.currentSrc || img.src || img.getAttribute('data-full') || img.dataset.full;
      if (src) openLightbox(src, img.alt || 'Photo');
    });

    // clavier (Enter) -> ouvrir lightbox
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const src = img.currentSrc || img.src || img.getAttribute('data-full') || img.dataset.full;
        if (src) openLightbox(src, img.alt || 'Photo');
      }
    });

    // si l'image est à l'intérieur d'une .photo-card avec data-full, prioriser ce dataset
    const wrapper = img.closest('.carousel-item .photo-card, .photo-card');
    if (wrapper && (wrapper.dataset.full || wrapper.getAttribute('data-full'))) {
      img.addEventListener('click', () => {
        const src = wrapper.dataset.full || wrapper.getAttribute('data-full');
        if (src) openLightbox(src, img.alt || 'Photo');
      });
    }
  });
})();

// ARTICLE MODAL
const articles = {
    1: {
        title: 'Comment la géothermie chauffe les écoles',
        date: '10 septembre 2025',
        body: `<p>Introduction — Extrait d'un reportage sur comment le réseau alimente les bâtiments scolaires. Interviews, photos et chiffres locaux.</p>
               <h4>Contexte</h4>
               <p>Le projet s'inscrit dans une politique territoriale visant à réduire les émissions de gaz à effet de serre. ...</p>
               <p style="color:var(--muted);font-size:0.9rem">(Ceci est un exemple — remplace par ton texte réel.)</p>`
    },
    2: {
        title: 'Technique : forages et nappes phréatiques',
        date: '1 octobre 2025',
        body: `<p>Article technique sur les forages, les précautions et la surveillance de la ressource en eau.</p>`
    },
    3: {
        title: 'Le territoire face à la transition',
        date: '22 octobre 2025',
        body: `<p>Analyse politique et sociale des réactions locales.</p>`
    }
};

const articleModal = document.getElementById('articleModal');
const articleContent = document.getElementById('articleContent');

function openArticle(id) {
    const a = articles[id];
    if (!a) return;
    articleContent.innerHTML = `<h2 style="margin-top:0">${a.title}</h2><div class=\"meta\">${a.date}</div><div style=\"margin-top:12px\">${a.body}</div>`;
    articleModal.classList.add('open');
    articleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function closeArticle() {
    articleModal.classList.remove('open');
    articleModal.setAttribute('aria-hidden', 'true');
    articleContent.innerHTML = '';
    document.body.style.overflow = '';
}
articleModal.addEventListener('click', (e) => { if (e.target === articleModal) closeArticle(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeArticle(); });

// TRANSCRIPTION (exemple simple)
function toggleTranscript() {
    alert('Transcription : colle ici la transcription de ton webdoc (ou ouvre un fichier .txt local).');
}

// Téléchargement local : si le fichier video est local, le lien pourra déclencher le téléchargement
function downloadVideo() {
    const v = document.getElementById('docVideo');
    const src = v.querySelector('source')?.src;
    if (!src) { alert('Aucune source trouvée.'); return; }
    // crée un lien <a> pour télécharger si le fichier est dans le dossier local
    const a = document.createElement('a');
    a.href = src;
    a.download = src.split('/').pop() || 'video.mp4';
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// small enhancement: scroll to section when clicking nav (smooth)
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const el = document.querySelector(href);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

// Fallback: si pas d'images locales, remplace par placeholders (utile pour test)
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        // fallback safe SVG placeholder encoded to avoid JS syntax issues
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">'
            + '<rect width="100%" height="100%" fill="#071018"/>'
            + '<text x="50%" y="50%" fill="#aab6b9" font-family="Arial,Helvetica" font-size="20" dominant-baseline="middle" text-anchor="middle">Image manquante — ajoute tes fichiers dans le dossier photos/</text>'
            + '</svg>';
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    });
});

// petit conseil : injecter une image hero si elle existe
(function setHeroImage() {
    const el = document.getElementById('heroMedia');
    // chemins essayés (relatifs depuis ce fichier HTML)
    const possible = ['hero.jpg', 'hero.png', 'photos/hero.jpg', '../images/hero.jpg'];
    for (const p of possible) {
        // on tente d'afficher : crée un élément image pour tester
        const img = new Image();
        img.src = p;
        img.onload = () => { el.style.backgroundImage = `linear-gradient(180deg, rgba(7,10,12,0.15) 0%, rgba(7,10,12,0.5) 100%), url('${p}')`; };
    }
})();

// rendre le hero clickable pour toutes les images dans .hero-media
(function heroClickable() {
  const heroes = document.querySelectorAll('.hero-media img, .hero-media .hero-img');
  heroes.forEach(hero => {
    hero.addEventListener('click', () => openLightbox(hero.currentSrc || hero.src, hero.alt || 'Image'));
    hero.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(hero.currentSrc || hero.src, hero.alt || 'Image'); });
    hero.style.cursor = 'pointer';
    // rendre focusable si nécessaire
    if (!hero.hasAttribute('tabindex')) hero.setAttribute('tabindex', '0');
  });
})();

// Back to top: show button after scrolling and smooth-scroll to top
(function backToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const showAfter = 240; // px
    function toggle() {
        if (window.scrollY > showAfter) { btn.classList.add('show'); btn.setAttribute('aria-hidden', 'false'); }
        else { btn.classList.remove('show'); btn.setAttribute('aria-hidden', 'true'); }
    }
    // initial
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
})();

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".photo-card");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    const desc = document.getElementById("lightboxDesc");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            lightboxImg.src = card.dataset.full;
            caption.textContent = card.dataset.caption || "Titre de la photo";
            desc.textContent = card.dataset.desc || "Aucune description fournie.";
            lightbox.classList.add("open");
        });
    });
});

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
}
