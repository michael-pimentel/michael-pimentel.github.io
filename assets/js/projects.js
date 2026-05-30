/**
 * Projects Loader for Portfolio
 * Fetches repositories from GitHub API and renders them as cards.
 */

// Projects that live in private repos — added manually so they still show on the portfolio.
// These are merged with GitHub results and support all the same fields.
const manualProjects = [
    {
        name: 'AI-Insider-Loop',
        displayName: 'AI Insider Loop',
        description: 'A curated news and analysis platform covering AI research, product launches, policy shifts, and industry trends — your edge on everything artificial intelligence.',
        homepage: 'https://aiinsiderloop.com',
        language: 'TypeScript',
        topics: ['next-js', 'ai', 'news', 'react'],
        badge: null,
        badgeColor: null,
        isManual: true,
    },
];

// Add custom descriptions here. Key = exact GitHub repo name.
// These override whatever description is set on GitHub.
const projectOverrides = {
    'Open-Closed-Prediction-Model-Emilio-Michael': {
        description: 'A machine learning model built with Emilio to predict whether a business is open or closed based on real-world data.',
        badge: 'Internship Project',
        badgeColor: 'blue',
    },
    'H2OHacks': {
        badge: 'Hackathon Finalist',
    },
    'Code-Performance-Analyzer': {
        description: 'A tool that analyzes and benchmarks code performance, helping identify bottlenecks and optimize runtime efficiency.',
    },
    'HackDay': {
        description: 'A project built during a hackathon, showcasing rapid prototyping and creative problem solving under a time constraint.',
    },
    // Add more overrides below as needed:
    // 'repo-name': { description: 'Your custom description here.', badge: 'Award name' },
};

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
});

async function fetchProjects() {
    const container = document.getElementById('projects-grid');
    const username = 'michael-pimentel';
    const repoBlocklist = ['michael-pimentel.github.io'];
    const forkAllowlist = [
        'Open-Closed-Prediction-Model-Emilio-Michael',
        'Code-Performance-Analyzer',
        'HackDay',
    ];

    // Show loading state
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;

    try {
        // Fetch repositories (sorted by updated date)
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const repos = await response.json();

        // Filter Repositories
        // Criteria: 
        // 1. Must be public (implicit in fetch)
        // 2. Not a fork (unless significant)
        // 3. OPTIONAL: Filter by topic if you want to curate (uncomment the topic check below)
        const filteredProjects = repos.filter(repo => {
            if (repoBlocklist.includes(repo.name)) return false;
            if (forkAllowlist.includes(repo.name)) return true;
            return !repo.fork;
        });

        // Pinned repos appear first in this order; the rest sort by last updated
        const pinnedOrder = [
            'AI-Insider-Loop',
            'H2OHacks',
            'Open-Closed-Prediction-Model-Emilio-Michael',
            'AutoApply',
            'Code-Performance-Analyzer',
        ];
        const lastOrder = ['HackDay'];
        filteredProjects.sort((a, b) => {
            const ai = pinnedOrder.indexOf(a.name);
            const bi = pinnedOrder.indexOf(b.name);
            const aLast = lastOrder.includes(a.name);
            const bLast = lastOrder.includes(b.name);
            if (ai !== -1 && bi !== -1) return ai - bi;
            if (ai !== -1) return -1;
            if (bi !== -1) return 1;
            if (aLast && bLast) return 0;
            if (aLast) return 1;
            if (bLast) return -1;
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        // Clear loading
        container.innerHTML = '';

        if (filteredProjects.length === 0) {
            container.innerHTML = `<p class="loading">No projects found. Check back soon!</p>`;
            return;
        }

        // Merge manual projects
        const allProjects = [...manualProjects, ...filteredProjects];

        // Re-apply sort with manual projects included
        allProjects.sort((a, b) => {
            const aName = a.name;
            const bName = b.name;
            const ai = pinnedOrder.indexOf(aName);
            const bi = pinnedOrder.indexOf(bName);
            const aLast = lastOrder.includes(aName);
            const bLast = lastOrder.includes(bName);
            if (ai !== -1 && bi !== -1) return ai - bi;
            if (ai !== -1) return -1;
            if (bi !== -1) return 1;
            if (aLast && bLast) return 0;
            if (aLast) return 1;
            if (bLast) return -1;
            if (a.isManual) return -1;
            if (b.isManual) return 1;
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        // Render Cards
        allProjects.forEach((repo, index) => {
            const card = createProjectCard(repo, index);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load projects:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load projects from GitHub.</p>
                <p style="margin-top:0.5rem; font-size: 0.9em; opacity: 0.8;">${error.message}</p>
                <a href="https://github.com/${username}" target="_blank" class="btn-primary" style="margin-top: 1rem;">Visit GitHub Profile</a>
            </div>
        `;
    }
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;

    const displayName = repo.displayName || repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const lang = repo.language;
    const topics = repo.topics || [];
    let techStack = lang ? [lang] : [];
    techStack = [...new Set([...techStack, ...topics])].slice(0, 4);
    const tagsHtml = techStack.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('');

    const override = projectOverrides[repo.name] || {};
    const description = repo.isManual ? repo.description : (override.description || repo.description || 'No description provided.');
    const badge = repo.isManual ? repo.badge : override.badge;
    const badgeColor = repo.isManual ? repo.badgeColor : override.badgeColor;
    const badgeHtml = badge ? `<span class="project-badge${badgeColor ? ` badge-${badgeColor}` : ''}">${escapeHtml(badge)}</span>` : '';
    const liveUrl = repo.homepage;
    const detailUrl = `/work/?repo=${encodeURIComponent(repo.name)}`;

    // Whole card navigates to detail page
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => { location.href = detailUrl; });

    const liveBtnHtml = liveUrl
        ? `<div class="card-actions">
               <a href="${liveUrl}" target="_blank" rel="noopener noreferrer"
                  class="btn-card fill"
                  onclick="event.stopPropagation()">Live Demo ↗</a>
           </div>`
        : '';

    card.innerHTML = `
        <div class="card-header">
            <div class="folder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            ${badgeHtml}
        </div>
        <div class="card-content">
            <h3 class="project-title">${escapeHtml(displayName)}</h3>
            <p class="project-desc">${escapeHtml(description)}</p>
            <div class="project-meta">
                <div class="tech-stack">${tagsHtml}</div>
                ${liveBtnHtml}
            </div>
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
