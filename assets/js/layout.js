// Single source of truth for nav + footer.
// Also restores saved cloud colour before clouds.js generates anything.

// ── Restore cloud colour from localStorage ────────────────
// Must run before clouds.js so clouds are built in the right colour.
try {
    const saved = JSON.parse(localStorage.getItem('cloudColor') || 'null');
    // If no saved colour or it's the old white default, use deep red
    const isOldDefault = saved && saved[0] === 255 && saved[1] === 255 && saved[2] === 255;
    window.cloudColor = (saved && !isOldDefault) ? saved : [220, 20, 20];
} catch (e) {
    window.cloudColor = [220, 20, 20];
}

// ── Nav ───────────────────────────────────────────────────
const NAV_HTML = `
<nav class="navbar">
    <div class="container nav-content">
        <a href="/" class="logo">
            <span class="logo-full">Michael Pimentel</span>
            <span class="logo-mid">Michael P.</span>
            <span class="logo-short">mp.</span>
        </a>
        <div class="nav-links">
            <a href="/about"    class="nav-link" data-page="about">About</a>
            <a href="/projects" class="nav-link" data-page="projects">Projects</a>
            <a href="/contact"  class="nav-link" data-page="contact">Contact</a>
        </div>
    </div>
</nav>`;

// ── Footer ────────────────────────────────────────────────
const FOOTER_HTML = `
<footer>
    <div class="container footer-content">
        <p class="copyright">© ${new Date().getFullYear()} Michael Pimentel</p>
        <div class="social-links">
            <a href="https://github.com/michael-pimentel" target="_blank" class="social-link">GitHub</a>
            <a href="mailto:mpimmjc@gmail.com" class="social-link">Email</a>
            <a href="https://www.linkedin.com/in/michael--pimentel/" target="_blank" class="social-link">LinkedIn</a>
        </div>
    </div>
</footer>`;

// Inject into placeholders
const navEl    = document.getElementById('nav-placeholder');
const footerEl = document.getElementById('footer-placeholder');
if (navEl)    navEl.outerHTML    = NAV_HTML;
if (footerEl) footerEl.outerHTML = FOOTER_HTML;

// ── Active nav link ───────────────────────────────────────
const currentPage = location.pathname.replace(/\/$/, '').split('/').filter(Boolean)[0] || '';
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
});
