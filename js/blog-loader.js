/**
 * Dynamic Blog Content Loader
 * Loads blog posts from data/posts.json and displays them on blog pages
 */

class BlogLoader {
    constructor() {
        this.posts = [];
        this.currentFilter = '*';
        this.isLoading = false;
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.setupEventListeners();
        this.renderInitialContent();
    }

    async loadPosts() {
        this.isLoading = true;
        try {
            // Add cache busting to ensure fresh content
            const cacheBuster = new Date().getTime();
            const response = await fetch(`/data/posts.json?v=${cacheBuster}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.posts = data.posts || [];
            console.log(`Loaded ${this.posts.length} blog posts`);
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.posts = this.getFallbackPosts();
        }
        this.isLoading = false;
    }

    setupEventListeners() {
        // Filter tags
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFilterClick(tag);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-posts');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadMorePosts();
            });
        }

        // Search functionality
        const searchForm = document.querySelector('.blog-hub-search form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }
    }

    handleFilterClick(clickedTag) {
        // Update active filter
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        clickedTag.classList.add('active');

        this.currentFilter = clickedTag.getAttribute('data-filter');
        this.renderFilteredPosts();
    }

    renderInitialContent() {
        this.renderFeaturedPosts();
        this.renderLatestPosts();
        this.renderTrendingPosts();
        this.renderGridBlog();
    }

    renderFeaturedPosts() {
        const featuredContainer = document.querySelector('.featured-posts-container');
        if (!featuredContainer) return;

        const featuredPosts = this.posts.filter(post => post.isFeatured).slice(0, 3);
        
        if (featuredPosts.length === 0) {
            featuredContainer.innerHTML = '<p>No featured posts available.</p>';
            return;
        }

        featuredContainer.innerHTML = featuredPosts.map(post => `
            <div class="col-md-6 col-lg-4">
                <article class="post-modern">
                    <div class="post-modern__aside">
                        <a href="blog/?slug=${post.slug}">
                            <img src="${post.featuredImage.url || 'images/bg-decor-1.png'}" alt="${post.featuredImage.alt}" width="370" height="239" loading="lazy" onerror="this.src='images/bg-decor-1.png'"/>
                        </a>
                        <div class="post-modern__badge">Featured</div>
                    </div>
                    <div class="post-modern__main">
                        <h3 class="post-modern__title">
                            <a href="blog/?slug=${post.slug}">${post.title}</a>
                        </h3>
                        <div class="post-modern__meta">
                            <span class="post-modern__time">${this.formatDate(post.publishDate)}</span>
                            <span class="post-modern__read-time">${post.readTime} min read</span>
                        </div>
                        <p class="post-modern__text">${post.excerpt}</p>
                        <a class="button button-primary-outline" href="blog/?slug=${post.slug}">Read More</a>
                    </div>
                </article>
            </div>
        `).join('');
    }

    renderLatestPosts() {
        const latestContainer = document.querySelector('.latest-posts-container');
        if (!latestContainer) return;

        const latestPosts = this.posts
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, 8);

        if (latestPosts.length === 0) {
            latestContainer.innerHTML = '<p>No recent posts available.</p>';
            return;
        }

        latestContainer.innerHTML = latestPosts.map(post => `
            <div class="col-md-6 col-lg-3">
                <article class="post-classic">
                    <div class="post-classic__aside">
                        <a href="blog/?slug=${post.slug}">
                            <img src="${post.featuredImage.url}" alt="${post.featuredImage.alt}" width="370" height="239" loading="lazy"/>
                        </a>
                    </div>
                    <div class="post-classic__main">
                        <time class="post-classic__time" datetime="${post.publishDate}">${this.formatDate(post.publishDate)}</time>
                        <h4><a class="post-classic__title" href="blog/?slug=${post.slug}">${post.title}</a></h4>
                        <div class="post-classic__meta">
                            <span class="post-classic__category">${post.category}</span>
                            <span class="post-classic__read-time">${post.readTime} min read</span>
                        </div>
                        <p class="post-classic__text">${post.excerpt}</p>
                    </div>
                </article>
            </div>
        `).join('');
    }

    renderTrendingPosts() {
        const trendingContainer = document.querySelector('.trending-posts-container');
        if (!trendingContainer) return;

        const trendingPosts = this.posts
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 3);

        if (trendingPosts.length === 0) {
            trendingContainer.innerHTML = '<p>No trending posts available.</p>';
            return;
        }

        trendingContainer.innerHTML = trendingPosts.map((post, index) => `
            <div class="col-lg-4">
                <article class="post-trending">
                    <div class="post-trending__content">
                        <div class="post-trending__number">${index + 1}</div>
                        <div class="post-trending__image">
                            <a href="blog/?slug=${post.slug}">
                                <img src="${post.featuredImage.url}" alt="${post.featuredImage.alt}" width="100" height="100" loading="lazy"/>
                            </a>
                        </div>
                        <div class="post-trending__main">
                            <h4><a href="blog/?slug=${post.slug}">${post.title}</a></h4>
                            <div class="post-trending__meta">
                                <span class="post-trending__views">${this.formatNumber(post.views || 0)} views</span>
                                <span class="post-trending__shares">${this.formatNumber(post.shares || 0)} shares</span>
                            </div>
                            <p>${post.excerpt}</p>
                        </div>
                    </div>
                </article>
            </div>
        `).join('');
    }

    renderFilteredPosts() {
        const filteredContainer = document.querySelector('.filtered-posts-container');
        if (!filteredContainer) return;

        let filteredPosts = this.posts;

        if (this.currentFilter !== '*') {
            filteredPosts = this.posts.filter(post => {
                const category = post.category.toLowerCase().replace(/\s+/g, '-');
                const tags = post.tags.map(tag => tag.toLowerCase().replace(/\s+/g, '-'));
                return category === this.currentFilter || tags.includes(this.currentFilter);
            });
        }

        if (filteredPosts.length === 0) {
            filteredContainer.innerHTML = '<p>No posts found for the selected filter.</p>';
            return;
        }

        filteredContainer.innerHTML = filteredPosts.map(post => `
            <div class="col-md-6 col-lg-4">
                <article class="post-modern">
                    <div class="post-modern__aside">
                        <a href="blog/?slug=${post.slug}">
                            <img src="${post.featuredImage.url}" alt="${post.featuredImage.alt}" width="370" height="239" loading="lazy"/>
                        </a>
                    </div>
                    <div class="post-modern__main">
                        <h3 class="post-modern__title">
                            <a href="blog/?slug=${post.slug}">${post.title}</a>
                        </h3>
                        <div class="post-modern__meta">
                            <span class="post-modern__time">${this.formatDate(post.publishDate)}</span>
                            <span class="post-modern__category">${post.category}</span>
                        </div>
                        <p class="post-modern__text">${post.excerpt}</p>
                        <a class="button button-primary-outline" href="blog/?slug=${post.slug}">Read More</a>
                    </div>
                </article>
            </div>
        `).join('');
    }

    handleSearch() {
        const searchInput = document.getElementById('blog-search');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;

        const searchResults = this.posts.filter(post => {
            return post.title.toLowerCase().includes(searchTerm) ||
                   post.excerpt.toLowerCase().includes(searchTerm) ||
                   post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   post.category.toLowerCase().includes(searchTerm);
        });

        this.displaySearchResults(searchResults, searchTerm);
    }

    displaySearchResults(results, searchTerm) {
        const resultsContainer = document.querySelector('.search-results-container');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="search-results">
                <h3>Search Results for "${searchTerm}" (${results.length} found)</h3>
                <div class="row row-40">
                    ${results.map(post => `
                        <div class="col-md-6 col-lg-4">
                            <article class="post-modern">
                                <div class="post-modern__aside">
                                    <a href="blog/?slug=${post.slug}">
                                        <img src="${post.featuredImage.url}" alt="${post.featuredImage.alt}" width="370" height="239" loading="lazy"/>
                                    </a>
                                </div>
                                <div class="post-modern__main">
                                    <h3 class="post-modern__title">
                                        <a href="blog/?slug=${post.slug}">${post.title}</a>
                                    </h3>
                                    <div class="post-modern__meta">
                                        <span class="post-modern__time">${this.formatDate(post.publishDate)}</span>
                                        <span class="post-modern__category">${post.category}</span>
                                    </div>
                                    <p class="post-modern__text">${post.excerpt}</p>
                                    <a class="button button-primary-outline" href="blog/?slug=${post.slug}">Read More</a>
                                </div>
                            </article>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    loadMorePosts() {
        // Implementation for loading more posts (pagination)
        console.log('Load more posts functionality');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    renderGridBlog() {
        const gridContainer = document.querySelector('.grid-blog-container');
        if (!gridContainer) return;

        const allPosts = this.posts.slice(0, 12); // Show first 12 posts in grid

        if (allPosts.length === 0) {
            gridContainer.innerHTML = '<p>No blog posts available.</p>';
            return;
        }

        gridContainer.innerHTML = allPosts.map(post => `
            <div class="col-md-6 col-xl-4">
                <article class="post-minimal">
                    <img src="${post.featuredImage.url || 'images/bg-decor-1.png'}" alt="${post.featuredImage.alt}" width="418" height="315" loading="lazy" onerror="this.src='images/bg-decor-1.png'"/>
                    <div class="post-classic-title">
                        <h6><a href="blog/?slug=${post.slug}">${post.title}</a></h6>
                    </div>
                    <div class="post-meta">
                        <div class="group-xs">
                            <a href="blog/?slug=${post.slug}">
                                <time datetime="${post.publishDate}">${this.formatDate(post.publishDate)}</time>
                            </a>
                            <a class="meta-author" href="blog/?slug=${post.slug}">by ${post.author.name}</a>
                            <ul class="list-inline-tag">
                                <li><a href="blog/?slug=${post.slug}">${post.category}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="post-classic-body">
                        <p>${post.excerpt}</p>
                    </div>
                </article>
            </div>
        `).join('');
    }

    getFallbackPosts() {
        // Fallback posts if data loading fails
        return [
            {
                id: "fallback-1",
                title: "Welcome to Our Digital Marketing Blog",
                slug: "welcome-digital-marketing-blog",
                excerpt: "Discover expert insights, strategies, and tips to grow your business with digital marketing.",
                author: {
                    name: "NSM Prime Team",
                    avatar: "images/logo-default-216x80.png"
                },
                publishDate: new Date().toISOString(),
                readTime: 5,
                featuredImage: {
                    url: "images/bg-decor-1.png",
                    alt: "Digital Marketing Blog"
                },
                tags: ["Digital Marketing", "Welcome"],
                category: "General",
                isFeatured: true,
                views: 0,
                shares: 0
            }
        ];
    }
}

// Initialize blog loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.blogLoader = new BlogLoader();
});