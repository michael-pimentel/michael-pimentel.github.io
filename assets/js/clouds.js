// Generates the rolling cloud background dynamically.
// window.cloudColor = [r, g, b] — change and call window.regenerateClouds() to recolor.

// Don't overwrite if layout.js already restored a saved colour
window.cloudColor = window.cloudColor || [255, 255, 255];

(function () {
    // Scale cloud count with screen area — minimum 80, no hard cap
    const COUNT       = Math.max(80, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    const MIN_OPACITY = 0.07;
    const MAX_OPACITY = 0.20;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    const container = document.createElement('div');
    container.className = 'bg-clouds';
    container.setAttribute('aria-hidden', 'true');
    document.body.prepend(container);

    function build() {
        container.innerHTML = '';
        const [r, g, b] = window.cloudColor;

        for (let i = 0; i < COUNT; i++) {
            const el = document.createElement('div');
            el.className = 'cloud';

            const width    = rand(200, 700);
            const height   = width * rand(0.35, 0.6);
            const top      = rand(-8, 108);
            const opacity  = rand(MIN_OPACITY, MAX_OPACITY);
            const duration = rand(10, 60);
            const delay    = -rand(0, duration);
            const goLeft   = Math.random() < 0.35;

            const rv = () => Math.floor(rand(20, 80));
            const borderRadius = `${rv()}% ${rv()}% ${rv()}% ${rv()}% / ${rv()}% ${rv()}% ${rv()}% ${rv()}%`;

            el.style.cssText = `
                width: ${width.toFixed(0)}px;
                height: ${height.toFixed(0)}px;
                top: ${top.toFixed(1)}%;
                border-radius: ${borderRadius};
                background: radial-gradient(ellipse, rgba(${r},${g},${b},${opacity.toFixed(3)}) 0%, transparent 68%);
                animation: ${goLeft ? 'cloudLeft' : 'cloudRight'} ${duration.toFixed(1)}s linear infinite;
                animation-delay: ${delay.toFixed(1)}s;
                ${goLeft ? `right: -${width.toFixed(0)}px` : `left: -${width.toFixed(0)}px`};
            `;

            container.appendChild(el);
        }
    }

    build();

    // Exposed so weather.js can trigger a rebuild after color change
    window.regenerateClouds = build;
})();
