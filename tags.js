class TagsPage {
    constructor() {
        this.posts = [];
        this.tags = new Map();
        this.selectedTag = null;
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.processTagsData();
        this.checkSelectedTag();
        this.renderTagsCloud();
        this.renderTaggedPosts();
    }

    async loadPosts() {
        try {
            const response = await fetch('posts.json');
            const data = await response.json();
            this.posts = data.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    processTagsData() {
        this.posts.forEach(post => {
            post.tags.forEach(tag => {
                if (this.tags.has(tag)) {
                    this.tags.get(tag).push(post);
                } else {
                    this.tags.set(tag, [post]);
                }
            });
        });
    }

    checkSelectedTag() {
        const urlParams = new URLSearchParams(window.location.search);
        this.selectedTag = urlParams.get('tag');
    }

    renderTagsCloud() {
        const tagsCloud = document.getElementById('tagsCloud');
        
        const tagsHTML = Array.from(this.tags.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([tag, posts]) => `
                <span class="tag ${this.selectedTag === tag ? 'active' : ''}" 
                      onclick="this.selectTag('${tag}')">
                    #${tag} (${posts.length})
                </span>
            `).join('');

        tagsCloud.innerHTML = tagsHTML;

        // Add click event listeners
        tagsCloud.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                const tag = e.target.textContent.split(' ')[0].substring(1);
                this.selectTag(tag);
            }
        });
    }

    selectTag(tag) {
        this.selectedTag = tag;
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('tag', tag);
        window.history.pushState({}, '', url);
        
        // Update UI
        document.querySelectorAll('.tag').forEach(el => el.classList.remove('active'));
        document.querySelector(`[onclick*="${tag}"]`)?.classList.add('active');
        
        this.renderTaggedPosts();
    }

    renderTaggedPosts() {
        const taggedPostsContainer = document.getElementById('taggedPosts');
        
        if (!this.selectedTag) {
            taggedPostsContainer.innerHTML = '<p style="text-align: center; color: #666;">Select a tag to view related posts</p>';
            return;
        }

        const posts = this.tags.get(this.selectedTag) || [];
        
        if (posts.length === 0) {
            taggedPostsContainer.innerHTML = '<p style="text-align: center; color: #666;">No posts found for this tag</p>';
            return;
        }

        taggedPostsContainer.innerHTML = posts.map(post => `
            <article class="blog-card">
                <div class="meta">
                    <span class="category">${post.category}</span>
                    <span>${post.date}</span>
                    <span>${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p class="excerpt">${post.excerpt}</p>
                <div class="tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <small>By ${post.author}</small>
                    <a href="post.html?id=${post.id}" class="btn">Read More</a>
                </div>
            </article>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TagsPage();
});
