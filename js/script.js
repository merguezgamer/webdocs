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

gallery?.addEventListener('click', (e) => {
    console.log('gallery click', e.target);
    const card = e.target.closest('.photo-card');
    if (!card) return;
    const imgEl = card.querySelector('img');
    // prefer the actual img src/currentSrc (resolved path) because data-full may point to a non-existent folder
    const src = imgEl?.currentSrc || imgEl?.src || card.dataset.full;
    console.log('opening lightbox for', src);
    if (!src) { console.warn('no image source found for this card'); return; }
    openLightbox(src, imgEl?.alt || 'Photo');
});

// also support keyboard open (Enter)
gallery?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const card = e.target.closest('.photo-card');
        if (!card) return;
        const imgEl = card.querySelector('img');
        const src = imgEl?.currentSrc || imgEl?.src || card.dataset.full;
        if (!src) { console.warn('no image source found for this card'); return; }
        openLightbox(src, imgEl?.alt || 'Photo');
    }
})

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

// Rendre l'image hero cliquable pour ouvrir la lightbox en grand écran
(function heroClickable() {
    const hero = document.querySelector('.hero-media .hero-img');
    if (!hero) return;
    // clic
    hero.addEventListener('click', () => openLightbox(hero.src, hero.alt || 'Image'));
    // ouverture clavier (Enter)
    hero.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(hero.src, hero.alt || 'Image'); });
    // assure le curseur (au cas où)
    hero.style.cursor = 'pointer';
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

