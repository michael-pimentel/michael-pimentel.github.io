// Lightning flashes + cloud color picker

// ── Cloud Color Picker ────────────────────────────────────────
const PRESETS = [
    { label: 'Deep Red', rgb: [220,  20,  20], hex: '#dc1414' },
    { label: 'Orange',   rgb: [255, 100,  20], hex: '#ff6414' },
    { label: 'Yellow',   rgb: [255, 215,  40], hex: '#ffd728' },
    { label: 'Green',    rgb: [ 40, 200,  90], hex: '#28c85a' },
    { label: 'Blue',     rgb: [ 60, 140, 255], hex: '#3c8cff' },
    { label: 'Purple',   rgb: [150,  60, 255], hex: '#963cff' },
    { label: 'Pink',     rgb: [255,  90, 180], hex: '#ff5ab4' },
    { label: 'White',    rgb: [255, 255, 255], hex: '#ffffff' },
];

const picker = document.createElement('div');
picker.id = 'cloud-picker';
picker.innerHTML = `
    <button id="cloud-picker-toggle" title="Change cloud colour">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        </svg>
    </button>
    <div id="cloud-picker-panel">
        <p class="picker-label">Cloud colour</p>
        <div class="picker-presets">
            ${PRESETS.map((p, i) => `
                <button class="picker-swatch ${i === 0 ? 'active' : ''}"
                        data-index="${i}"
                        style="background:${p.hex}"
                        title="${p.label}"></button>
            `).join('')}
        </div>
        <input type="color" id="picker-custom" value="#ffffff" title="Custom colour">
    </div>
`;
document.body.appendChild(picker);

const toggle = document.getElementById('cloud-picker-toggle');
const panel  = document.getElementById('cloud-picker-panel');

toggle.addEventListener('click', () => picker.classList.toggle('open'));

// Close when clicking outside
document.addEventListener('click', e => {
    if (!picker.contains(e.target)) picker.classList.remove('open');
});

function applyColor(r, g, b) {
    window.cloudColor = [r, g, b];
    localStorage.setItem('cloudColor', JSON.stringify([r, g, b]));
    window.regenerateClouds();
    window.updateMouseGlow?.();
}

document.querySelectorAll('.picker-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
        const p = PRESETS[+btn.dataset.index];
        applyColor(...p.rgb);
        document.querySelectorAll('.picker-swatch').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('picker-custom').value = p.hex;
    });
});

document.getElementById('picker-custom').addEventListener('input', e => {
    const hex = e.target.value;
    const r   = parseInt(hex.slice(1, 3), 16);
    const g   = parseInt(hex.slice(3, 5), 16);
    const b   = parseInt(hex.slice(5, 7), 16);
    applyColor(r, g, b);
    document.querySelectorAll('.picker-swatch').forEach(s => s.classList.remove('active'));
});

// Sync picker UI to whatever colour was already loaded (from localStorage)
(function syncPickerUI() {
    const [cr, cg, cb] = window.cloudColor || [255, 255, 255];
    document.querySelectorAll('.picker-swatch').forEach(s => s.classList.remove('active'));
    PRESETS.forEach((p, i) => {
        if (p.rgb[0] === cr && p.rgb[1] === cg && p.rgb[2] === cb) {
            document.querySelectorAll('.picker-swatch')[i].classList.add('active');
        }
    });
    // Sync custom input colour
    const toHex = n => n.toString(16).padStart(2, '0');
    document.getElementById('picker-custom').value = `#${toHex(cr)}${toHex(cg)}${toHex(cb)}`;
})();
