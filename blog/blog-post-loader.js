/**
 * Dynamic Blog Post Loader
 * Loads individual blog posts from data/posts.json based on URL slug
 */

class BlogPostLoader {
    constructor() {
        this.posts = [];
        this.currentPost = null;
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.loadCurrentPost();
    }

    async loadPosts() {
        try {
            const response = await fetch('../data/posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.posts = data.posts || [];
            console.log(`Loaded ${this.posts.length} blog posts`);
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.showError('Failed to load blog posts. Please try again later.');
        }
    }

    loadCurrentPost() {
        // Get slug from URL parameters or hash
        const urlParams = new URLSearchParams(window.location.search);
        let slug = urlParams.get('slug') || urlParams.get('post');
        
        // If no slug in URL params, try to extract from the current URL path
        if (!slug) {
            const pathParts = window.location.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            if (fileName && fileName.includes('.html')) {
                slug = fileName.replace('.html', '');
            }
        }

        if (!slug) {
            this.showError('No blog post specified. Please select a post from our blog.');
            return;
        }

        // Find the post by slug
        this.currentPost = this.posts.find(post => post.slug === slug);

        if (!this.currentPost) {
            this.showError('Blog post not found. It may have been moved or deleted.');
            return;
        }

        this.renderPost();
    }

    renderPost() {
        if (!this.currentPost) return;

        const post = this.currentPost;
        
        // Update page title and meta tags
        this.updatePageMeta(post);
        
        // Update breadcrumb
        this.updateBreadcrumb(post);
        
        // Render the blog post header
        this.renderPostHeader(post);
        
        // Render the blog post content
        this.renderPostContent(post);
        
        // Load related posts
        this.renderRelatedPosts(post);
    }

    updatePageMeta(post) {
        // Update title
        document.title = `${post.title} | NSM Prime Blog`;
        document.getElementById('page-title').textContent = `${post.title} | NSM Prime Blog`;
        
        // Update meta description
        document.getElementById('page-description').setAttribute('content', post.metaDescription || post.excerpt);
        
        // Update meta keywords
        const keywords = post.tags.join(', ') + ', NSM Prime, Las Vegas digital marketing';
        document.getElementById('page-keywords').setAttribute('content', keywords);
        
        // Update canonical URL
        const canonicalUrl = `${window.location.origin}/blog/?slug=${post.slug}`;
        document.getElementById('page-canonical').setAttribute('href', canonicalUrl);
        
        // Update Open Graph tags
        document.getElementById('og-title').setAttribute('content', post.title);
        document.getElementById('og-description').setAttribute('content', post.excerpt);
        document.getElementById('og-image').setAttribute('content', post.featuredImage.url);
        document.getElementById('og-url').setAttribute('content', canonicalUrl);
        
        // Update Twitter Card tags
        document.getElementById('twitter-title').setAttribute('content', post.title);
        document.getElementById('twitter-description').setAttribute('content', post.excerpt);
        document.getElementById('twitter-image').setAttribute('content', post.featuredImage.url);
    }

    updateBreadcrumb(post) {
        document.getElementById('breadcrumb-title').textContent = post.title;
    }

    renderPostHeader(post) {
        const container = document.getElementById('blog-post-container');
        
        container.innerHTML = `
            <div class="blog-post-category">
                <span class="badge badge-primary">${post.category}</span>
            </div>
            <h1 class="heading-1 text-white">${post.title}</h1>
            <div class="blog-post-meta">
                <div class="author-info">
                    <img src="${post.author.avatar || '../images/logo-default-216x80.png'}" alt="${post.author.name}" class="author-avatar" onerror="this.src='../images/logo-default-216x80.png'">
                    <div>
                        <div class="author-name">${post.author.name}</div>
                        <div class="text-opacity-70">${post.author.bio}</div>
                    </div>
                </div>
                <div class="post-date">
                    <span class="icon icon-sm linear-icon-calendar"></span>
                    ${this.formatDate(post.publishDate)}
                </div>
                <div class="read-time">
                    <span class="icon icon-sm linear-icon-clock"></span>
                    ${post.readTime} min read
                </div>
                <div class="post-views">
                    <span class="icon icon-sm linear-icon-eye"></span>
                    ${this.formatNumber(post.views || 0)} views
                </div>
            </div>
        `;
    }

    renderPostContent(post) {
        const container = document.getElementById('blog-content-container');
        
        container.innerHTML = `
            <img src="${post.featuredImage.url || '../images/bg-decor-1.png'}" 
                 alt="${post.featuredImage.alt}" 
                 class="featured-image"
                 onerror="this.src='../images/bg-decor-1.png'">
            
            <div class="blog-post-content">
                ${this.formatContent(post.content)}
            </div>
            
            <div class="blog-post-tags">
                <h6>Tags:</h6>
                ${post.tags.map(tag => `<a href="../blog-hub.html?filter=${this.slugify(tag)}" class="tag">${tag}</a>`).join('')}
            </div>
            
            <div class="social-share">
                <h6>Share this article:</h6>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                   target="_blank" class="share-button share-facebook">
                   <i class="fa fa-facebook"></i> Share on Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" 
                   target="_blank" class="share-button share-twitter">
                   <i class="fa fa-twitter"></i> Tweet
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" 
                   target="_blank" class="share-button share-linkedin">
                   <i class="fa fa-linkedin"></i> Share on LinkedIn
                </a>
            </div>
        `;
    }

    renderRelatedPosts(currentPost) {
        const container = document.getElementById('related-posts-container');
        
        // Find related posts (same category or similar tags)
        const relatedPosts = this.posts
            .filter(post => post.id !== currentPost.id)
            .filter(post => 
                post.category === currentPost.category || 
                post.tags.some(tag => currentPost.tags.includes(tag))
            )
            .slice(0, 3);

        if (relatedPosts.length === 0) {
            // If no related posts, show latest posts
            const latestPosts = this.posts
                .filter(post => post.id !== currentPost.id)
                .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
                .slice(0, 3);
            
            container.innerHTML = this.renderPostCards(latestPosts);
        } else {
            container.innerHTML = this.renderPostCards(relatedPosts);
        }
    }

    renderPostCards(posts) {
        return posts.map(post => `
            <div class="col-md-6 col-lg-4">
                <article class="post-modern">
                    <div class="post-modern__aside">
                        <a href="?slug=${post.slug}">
                            <img src="${post.featuredImage.url || '../images/bg-decor-1.png'}" 
                                 alt="${post.featuredImage.alt}" 
                                 width="370" height="239" loading="lazy"
                                 onerror="this.src='../images/bg-decor-1.png'"/>
                        </a>
                    </div>
                    <div class="post-modern__main">
                        <h4 class="post-modern__title">
                            <a href="?slug=${post.slug}">${post.title}</a>
                        </h4>
                        <div class="post-modern__meta">
                            <span class="post-modern__time">${this.formatDate(post.publishDate)}</span>
                            <span class="post-modern__category">${post.category}</span>
                        </div>
                        <p class="post-modern__text">${post.excerpt}</p>
                        <a class="button button-primary-outline" href="?slug=${post.slug}">Read More</a>
                    </div>
                </article>
            </div>
        `).join('');
    }

    formatContent(content) {
        // Convert markdown-style content to HTML
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/## (.*?)(?=<)/g, '<h2>$1</h2>')
            .replace(/### (.*?)(?=<)/g, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    showError(message) {
        const container = document.getElementById('blog-post-container');
        container.innerHTML = `
            <div class="error-message">
                <h2>Oops! Something went wrong</h2>
                <p>${message}</p>
                <a href="../blog-hub.html" class="button button-primary">← Back to Blog</a>
            </div>
        `;
        
        const contentContainer = document.getElementById('blog-content-container');
        contentContainer.innerHTML = '';
        
        const relatedContainer = document.getElementById('related-posts-container');
        relatedContainer.innerHTML = '';
    }
}

// Initialize blog post loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.blogPostLoader = new BlogPostLoader();
});