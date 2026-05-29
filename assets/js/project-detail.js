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
                            <p class="detail-placeholder">
                                ✏️  This is where your write-up goes. Describe what the project does, why you built it,
                                what problems it solves, and anything interesting about how you built it.
                                You can edit <code>project-detail.js</code> to add custom descriptions per repo.
                            </p>
                        </div>
                    </div>

                    <div class="detail-section fade-up">
                        <h2 class="detail-section-title">Screenshots / Demo</h2>
                        <div class="detail-screenshots glass-panel">
                            <p class="detail-placeholder">
                                📸  Add screenshots or GIFs of your project here.
                                You can drop <code>&lt;img&gt;</code> tags or embed a video.
                            </p>
                        </div>
                    </div>
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
