/**
 * Projects Loader for Portfolio
 * Fetches repositories from GitHub API and renders them as cards.
 */

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
});

async function fetchProjects() {
    const container = document.getElementById('projects-grid');
    const username = 'michael-pimentel';
    const topicFilter = 'portfolio'; // Tag repos with this topic on GitHub to show them

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
            const isFork = repo.fork;
            const hasTopic = repo.topics && repo.topics.includes(topicFilter);

            // Logic: Show if it has the 'portfolio' tag OR if not a fork (fallback mode)
            // Ideally, you should tag your best projects with 'portfolio' on GitHub.
            // For now, we'll show non-forks.
            return !isFork;
        });

        // Sort by Last Updated
        filteredProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // Clear loading
        container.innerHTML = '';

        if (filteredProjects.length === 0) {
            container.innerHTML = `<p class="loading">No projects found. Check back soon!</p>`;
            return;
        }

        // Render Cards
        filteredProjects.forEach((repo, index) => {
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

    // Format Name
    const displayName = repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Tech Stack
    const lang = repo.language;
    const topics = repo.topics || [];
    let techStack = [];
    if (lang) techStack.push(lang);
    techStack = [...new Set([...techStack, ...topics])].slice(0, 4);

    const tagsHtml = techStack.map(tag =>
        `<span class="tech-tag">${escapeHtml(tag)}</span>`
    ).join('');

    const description = repo.description || 'No description provided.';

    // Links
    const repoUrl = repo.html_url;
    // Use homepage if available, otherwise just repo (we can handle "Live" button visibility logic)
    const liveUrl = repo.homepage;

    // Button Logic
    let actionButtons = `
        <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-card outline">View Code</a>
    `;

    if (liveUrl) {
        actionButtons = `
            <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-card outline">Code</a>
            <a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-card fill">Live Demo</a>
        `;
    }

    card.innerHTML = `
        <div class="card-header">
            <div class="folder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <!-- Optional: External Link Icon if needed -->
        </div>
        
        <div class="card-content">
            <h3 class="project-title">${escapeHtml(displayName)}</h3>
            <p class="project-desc">${escapeHtml(description)}</p>
            
            <div class="project-meta">
                <div class="tech-stack">
                    ${tagsHtml}
                </div>
                <div class="card-actions">
                    ${actionButtons}
                </div>
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
