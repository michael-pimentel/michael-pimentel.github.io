// Shared effects — runs on every page

// ── Mouse glow orb ────────────────────────────────────────
const glow = document.getElementById('mouse-glow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let gx = mx, gy = my;

function updateMouseGlow() {
    if (!glow) return;
    const [r, g, b] = window.cloudColor || [220, 20, 20];
    glow.style.background = `radial-gradient(ellipse, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.08) 40%, transparent 68%)`;
}

window.updateMouseGlow = updateMouseGlow;
updateMouseGlow();

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function loop() {
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    if (glow) glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(loop);
})();

// Footer year handled by layout.js

// Active nav + footer year handled by layout.js

// ── Auto-stagger grid children ────────────────────────────
// Any element with data-stagger will have its direct children
// get fade-up + staggered delays applied automatically
document.querySelectorAll('[data-stagger]').forEach(parent => {
    const step = parseFloat(parent.dataset.stagger) || 0.14;
    [...parent.children].forEach((child, i) => {
        child.classList.add('fade-up');
        child.style.transitionDelay = `${i * step}s`;
    });
});

// ── Scroll reveal (IntersectionObserver) ──────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Respect any inline transition-delay already set
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    // Only trigger when element is meaningfully in view, not just peeking
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
