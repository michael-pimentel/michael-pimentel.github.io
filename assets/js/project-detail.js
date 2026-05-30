// Custom content per project. Key = exact GitHub repo name.
// `about`       — HTML string describing the project (paragraphs, lists, etc.)
// `screenshots` — array of objects: { src, alt, caption? }
//                 src can be a relative path (assets/img/...) or any URL
// Custom content per project. Key = exact GitHub repo name.
// `about`       — HTML string describing the project (paragraphs, lists, etc.)
// `screenshots` — array of objects: { src, alt, caption? }
//                 src can be a relative path (assets/img/...) or any URL
const projectDetails = {
    'AutoApply': {
        about: `
            <p>AutoApply streamlines the job application process by automating the repetitive parts — filling out forms, tracking submissions, and keeping everything organized in one place.</p>
            <p>Built with TypeScript, the app lets you store your profile once and apply to multiple positions without re-entering the same information. The live version is deployed on Vercel.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'AutoApply dashboard', caption: 'Application tracker view' },
        ],
    },
    'BookType': {
        about: `
            <p>BookType is a typing practice app with a twist — instead of random words, you type out passages from real books. It's a way to build speed and focus while actually reading something worth reading.</p>
            <p>Built with TypeScript. Choose a book, start typing, and get real-time feedback on accuracy and words per minute.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'BookType typing interface', caption: 'Live typing session' },
        ],
    },
    'finance-claw': {
        about: `
            <p>Built for the OpenClaw Hackathon hosted by NVIDIA and UCSC, finance-claw is a financial tool that helps users get a clearer picture of their money.</p>
            <p>The project was scoped, designed, and shipped within the hackathon window. It was a great exercise in building something useful under a hard deadline with a focused team.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'Finance Claw UI', caption: 'Main dashboard' },
        ],
    },
    'H2OHacks': {
        badge: 'Hackathon Finalist',
        about: `
            <p>A project built for the H2O Hackathon, focused on water-related challenges and sustainability. The app is live on Vercel.</p>
            <p>The hackathon pushed rapid ideation around a specific domain — it was a chance to combine technical skills with real-world impact and pitch a working product to judges.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'H2OHacks app', caption: 'Live demo screenshot' },
        ],
    },
    'Open-Closed-Prediction-Model-Emilio-Michael': {
        badge: 'Internship Project',
        badgeColor: 'blue',
        about: `
            <p>A machine learning project built with Emilio that predicts whether a real-world place (restaurant, shop, etc.) is currently open or closed using metadata features — no live data feed required.</p>
            <p>We engineered scalable features from place metadata and trained a classification model on labeled data. The goal was accuracy at scale: making reliable open/closed calls across many locations without manual lookups.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'Model prediction output', caption: 'Prediction results on test set' },
        ],
    },
    'Code-Performance-Analyzer': {
        about: `
            <p>A Visual Studio extension that uses a local small language model to analyze the time and space complexity of Python code directly in the editor.</p>
            <p>Highlight a function, run the analyzer, and get an instant complexity breakdown without leaving VS Code. Keeping the model local means no API calls and no data leaving your machine.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'VS Code extension panel', caption: 'Complexity analysis in the editor' },
        ],
    },
    'HackDay': {
        about: `
            <p>A mini hackathon project built under tight time constraints. The focus was on scoping a real problem quickly, building just enough to demonstrate the idea, and shipping something functional by the deadline.</p>
            <p>It's a good reminder that constraints breed creativity — some of the best decisions came from having no time to overthink them.</p>
        `,
        screenshots: [
            // { src: 'https://...', alt: 'HackDay prototype', caption: 'Working build from the event' },
        ],
    },
    // Add more repos below:
    // 'repo-name': {
    //     about: `<p>Your write-up here.</p>`,
    //     screenshots: [{ src: 'path/or/url', alt: 'description', caption: 'optional caption' }],
    // },
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const repoName = params.get('repo');
    const username = 'michael-pimentel';
    const container = document.getElementById('project-detail');

    if (!repoName) {
        container.innerHTML = `<div class="container"><p class="detail-error">No project specified. <a href="projects.html">Go back</a></p></div>`;
        return;
    }

    fetch(`https://api.github.com/repos/${username}/${repoName}`)
        .then(r => {
            if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
            return r.json();
        })
        .then(repo => {
            document.title = `${repo.name.replace(/-/g, ' ')} — Michael Pimentel`;

            const displayName = repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const lang = repo.language || null;
            const topics = repo.topics || [];
            let techStack = lang ? [lang, ...topics] : [...topics];
            techStack = [...new Set(techStack)].slice(0, 8);
            const tagsHtml = techStack.map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('');

            const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

            const detail = projectDetails[repo.name] || {};

            const liveBtn = repo.homepage
                ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="btn-primary">Live Demo →</a>`
                : '';

            container.innerHTML = `
                <div class="detail-hero fade-up">
                    <div class="container">
                        <div class="detail-meta-row">
                            ${lang ? `<span class="detail-badge">${escapeHtml(lang)}</span>` : ''}
                            <span class="detail-badge">★ ${repo.stargazers_count}</span>
                            <span class="detail-badge">⑂ ${repo.forks_count}</span>
                            <span class="detail-date">Last updated ${updatedDate}</span>
                        </div>
                        ${detail.badge ? `<span class="project-badge detail-hero-badge${detail.badgeColor ? ` badge-${detail.badgeColor}` : ''}">${escapeHtml(detail.badge)}</span>` : ''}
                        <h1 class="detail-title">${escapeHtml(displayName)}</h1>
                        <p class="detail-desc">${escapeHtml(repo.description || 'No description provided.')}</p>
                        <div class="detail-actions">
                            ${liveBtn}
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-ghost">View on GitHub</a>
                        </div>
                    </div>
                </div>

                <div class="container detail-body">
                    ${tagsHtml.length ? `
                    <div class="detail-section fade-up">
                        <h2 class="detail-section-title">Tech Stack</h2>
                        <div class="skills-list">${tagsHtml}</div>
                    </div>` : ''}

                    <div class="detail-section fade-up">
                        <h2 class="detail-section-title">About This Project</h2>
                        <div class="detail-writeup glass-panel">
                            ${detail.about || `<p class="detail-placeholder">No write-up yet. Add one in <code>project-detail.js</code> under <code>${repo.name}</code>.</p>`}
                        </div>
                    </div>

                    ${detail.screenshots && detail.screenshots.length ? `
                    <div class="detail-section fade-up">
                        <h2 class="detail-section-title">Screenshots / Demo</h2>
                        <div class="detail-screenshots">
                            ${detail.screenshots.map(s => `
                                <figure class="screenshot-figure glass-panel">
                                    <img src="${s.src}" alt="${escapeHtml(s.alt)}" loading="lazy">
                                    ${s.caption ? `<figcaption>${escapeHtml(s.caption)}</figcaption>` : ''}
                                </figure>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            `;

            document.querySelectorAll('.fade-up').forEach(el => {
                const obs = new IntersectionObserver(entries => {
                    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
                }, { threshold: 0.08 });
                obs.observe(el);
            });
        })
        .catch(err => {
            container.innerHTML = `
                <div class="container">
                    <div class="detail-error glass-panel">
                        <p>Couldn't load this project.</p>
                        <p style="opacity:0.5; margin-top:0.5rem; font-size:0.9rem">${err.message}</p>
                        <a href="/projects" class="btn-ghost" style="margin-top:1.5rem; display:inline-block">← Back to Projects</a>

                    </div>
                </div>`;
        });
});

function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
