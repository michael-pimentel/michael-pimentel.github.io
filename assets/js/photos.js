// Builds the photo strip on the About page from window.aboutPhotos.
// To add photos: drop files into assets/photos/ and add entries to
// the window.aboutPhotos array in about/index.html.

(function () {
    const strip   = document.getElementById('photo-strip');
    const hint    = document.getElementById('photo-hint');
    const photos  = window.aboutPhotos || [];

    if (!strip) return;

    if (photos.length === 0) {
        // No photos yet — show placeholder cards
        const placeholders = [
            'linear-gradient(135deg, #111 0%, #1a1a1a 60%, #222 100%)',
            'linear-gradient(145deg, #0f0f0f 0%, #191919 50%, #111 100%)',
            'linear-gradient(120deg, #141414 0%, #1c1c1c 60%, #0d0d0d 100%)',
            'linear-gradient(160deg, #0a0a0a 0%, #181818 50%, #141414 100%)',
            'linear-gradient(130deg, #131313 0%, #1b1b1b 60%, #0f0f0f 100%)',
        ];
        placeholders.forEach(bg => {
            strip.insertAdjacentHTML('beforeend', `
                <div class="photo-card">
                    <div class="photo-placeholder" style="background:${bg}">
                        <span class="photo-add-label">+ Add a photo</span>
                    </div>
                    <div class="photo-caption">Caption here</div>
                </div>
            `);
        });
        if (hint) hint.textContent = 'Add photos by editing about/index.html';
        return;
    }

    // Render real photos
    photos.forEach(({ file, caption }) => {
        strip.insertAdjacentHTML('beforeend', `
            <div class="photo-card">
                <img src="../assets/photos/${file}" alt="${caption || ''}" loading="lazy">
                ${caption ? `<div class="photo-caption">${caption}</div>` : ''}
            </div>
        `);
    });

    if (hint) hint.textContent = '';

    // Duplicate cards for a seamless loop: [A][A], animate -50%.
    const originals = Array.from(strip.children);
    originals.forEach(card => strip.appendChild(card.cloneNode(true)));

    const PX_PER_SEC = 30;
    const imgs = Array.from(strip.querySelectorAll('img'));
    Promise.all(imgs.map(img =>
        img.complete ? Promise.resolve() :
        new Promise(r => { img.onload = r; img.onerror = r; })
    )).then(() => {
        const setWidth = strip.scrollWidth / 2;
        strip.style.animationDuration = (setWidth / PX_PER_SEC) + 's';
    });
})();
