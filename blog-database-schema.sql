-- Blog Hub Content Management Database Schema
-- Self-updating blog with RSS ingestion and analytics integration

-- Main blog posts table
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(60) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    publish_date DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Author information (JSON)
    author JSON NOT NULL,
    
    -- Content fields
    excerpt TEXT(160) NOT NULL,
    content LONGTEXT,
    cover_image JSON NOT NULL,
    
    -- Taxonomy
    tags JSON,
    category ENUM(
        'seo', 
        'web-development', 
        'ppc', 
        'social-media', 
        'content-marketing', 
        'analytics', 
        'email-marketing', 
        'local-seo'
    ) NOT NULL,
    
    -- SEO fields
    reading_time INT,
    primary_keyword VARCHAR(100) NOT NULL,
    internal_links JSON,
    external_links JSON,
    faq_items JSON,
    schema_type ENUM('Article', 'BlogPosting', 'HowTo', 'FAQPage') DEFAULT 'BlogPosting',
    
    -- Meta data
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    
    -- Status and source
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    source JSON, -- For RSS imported content
    
    -- Analytics data (updated via API)
    analytics JSON,
    
    -- Indexes for performance
    INDEX idx_status_publish_date (status, publish_date),
    INDEX idx_category (category),
    INDEX idx_trending (((CAST(JSON_EXTRACT(analytics, '$.trendingScore') AS DECIMAL(5,2))))),
    FULLTEXT INDEX idx_content_search (title, excerpt, content)
);

-- RSS feed sources configuration
CREATE TABLE rss_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    trust_score INT DEFAULT 5,
    active BOOLEAN DEFAULT TRUE,
    last_sync DATETIME,
    sync_frequency INT DEFAULT 240, -- minutes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- RSS sync history and deduplication
CREATE TABLE rss_sync_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source_id INT,
    original_url VARCHAR(255),
    original_title VARCHAR(255),
    post_id INT NULL, -- NULL if filtered out
    sync_status ENUM('imported', 'duplicate', 'filtered', 'error'),
    quality_score DECIMAL(3,2),
    sync_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_id) REFERENCES rss_sources(id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id),
    UNIQUE KEY unique_source_url (source_id, original_url)
);

-- Analytics snapshots for historical trending
CREATE TABLE analytics_snapshots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    snapshot_date DATE NOT NULL,
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    avg_time_on_page INT DEFAULT 0,
    bounce_rate DECIMAL(4,3) DEFAULT 0.500,
    social_shares INT DEFAULT 0,
    comments INT DEFAULT 0,
    trending_score DECIMAL(5,2) DEFAULT 0,
    
    FOREIGN KEY (post_id) REFERENCES blog_posts(id),
    UNIQUE KEY unique_post_date (post_id, snapshot_date)
);

-- Content performance tracking
CREATE TABLE content_performance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    metric_type ENUM('pageview', 'share', 'comment', 'conversion'),
    metric_value INT DEFAULT 1,
    source VARCHAR(50), -- 'organic', 'social', 'email', etc.
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES blog_posts(id),
    INDEX idx_post_metric (post_id, metric_type),
    INDEX idx_date_source (recorded_at, source)
);

-- Sample data insertion
INSERT INTO rss_sources (name, url, category, trust_score) VALUES
('Google Search Central Blog', 'https://developers.google.com/search/blog/feeds/posts/default', 'seo', 10),
('Moz Blog', 'https://moz.com/blog/feed', 'seo', 9),
('Search Engine Journal', 'https://www.searchenginejournal.com/feed/', 'seo', 8),
('Search Engine Land', 'https://searchengineland.com/feed', 'seo', 8),
('Content Marketing Institute', 'https://contentmarketinginstitute.com/feed/', 'content-marketing', 7);

-- Views for common queries

-- Latest posts view
CREATE VIEW latest_posts AS
SELECT 
    id,
    title,
    slug,
    publish_date,
    author,
    excerpt,
    cover_image,
    category,
    reading_time,
    tags,
    JSON_EXTRACT(analytics, '$.pageViews') as page_views
FROM blog_posts 
WHERE status = 'published'
ORDER BY publish_date DESC;

-- Trending posts view
CREATE VIEW trending_posts AS
SELECT 
    id,
    title,
    slug,
    publish_date,
    author,
    excerpt,
    cover_image,
    category,
    tags,
    JSON_EXTRACT(analytics, '$.trendingScore') as trending_score,
    JSON_EXTRACT(analytics, '$.pageViews') as page_views,
    JSON_EXTRACT(analytics, '$.socialShares') as social_shares
FROM blog_posts 
WHERE status = 'published'
    AND publish_date > DATE_SUB(NOW(), INTERVAL 90 DAY)
ORDER BY trending_score DESC;

-- Content performance summary view
CREATE VIEW content_analytics AS
SELECT 
    bp.id,
    bp.title,
    bp.category,
    bp.publish_date,
    JSON_EXTRACT(bp.analytics, '$.pageViews') as total_views,
    JSON_EXTRACT(bp.analytics, '$.uniqueVisitors') as unique_visitors,
    JSON_EXTRACT(bp.analytics, '$.socialShares') as social_shares,
    JSON_EXTRACT(bp.analytics, '$.trendingScore') as trending_score,
    DATEDIFF(CURRENT_DATE, DATE(bp.publish_date)) as days_since_publish
FROM blog_posts bp
WHERE bp.status = 'published';

-- Stored procedures for automation

DELIMITER //

-- Calculate trending score for a specific post
CREATE PROCEDURE CalculatePostTrendingScore(IN post_id INT)
BEGIN
    DECLARE v_page_views INT DEFAULT 0;
    DECLARE v_unique_visitors INT DEFAULT 0;
    DECLARE v_time_on_page INT DEFAULT 0;
    DECLARE v_social_shares INT DEFAULT 0;
    DECLARE v_comments INT DEFAULT 0;
    DECLARE v_bounce_rate DECIMAL(4,3) DEFAULT 0.500;
    DECLARE v_days_since_publish INT;
    DECLARE v_base_score DECIMAL(10,2);
    DECLARE v_recency_multiplier DECIMAL(4,3);
    DECLARE v_engagement_boost DECIMAL(4,3);
    DECLARE v_trending_score DECIMAL(5,2);
    
    -- Get current analytics data
    SELECT 
        JSON_EXTRACT(analytics, '$.pageViews'),
        JSON_EXTRACT(analytics, '$.uniqueVisitors'),
        JSON_EXTRACT(analytics, '$.averageTimeOnPage'),
        JSON_EXTRACT(analytics, '$.socialShares'),
        JSON_EXTRACT(analytics, '$.comments'),
        JSON_EXTRACT(analytics, '$.bounceRate'),
        DATEDIFF(CURRENT_DATE, DATE(publish_date))
    INTO 
        v_page_views, v_unique_visitors, v_time_on_page, 
        v_social_shares, v_comments, v_bounce_rate, v_days_since_publish
    FROM blog_posts 
    WHERE id = post_id;
    
    -- Calculate base engagement score
    SET v_base_score = (
        (COALESCE(v_page_views, 0) * 0.3) +
        (COALESCE(v_unique_visitors, 0) * 0.2) +
        ((COALESCE(v_time_on_page, 0) / 60) * 0.2) +
        (COALESCE(v_social_shares, 0) * 0.15) +
        (COALESCE(v_comments, 0) * 0.15)
    );
    
    -- Calculate recency multiplier (newer posts get boost)
    SET v_recency_multiplier = GREATEST(0.1, 1 - (v_days_since_publish / 30));
    
    -- Calculate engagement quality boost
    SET v_engagement_boost = 1 + (1 - COALESCE(v_bounce_rate, 0.5));
    
    -- Final trending score
    SET v_trending_score = ROUND(v_base_score * v_recency_multiplier * v_engagement_boost, 2);
    
    -- Update the post with new trending score
    UPDATE blog_posts 
    SET analytics = JSON_SET(analytics, '$.trendingScore', v_trending_score)
    WHERE id = post_id;
    
END //

-- Batch update all trending scores
CREATE PROCEDURE UpdateAllTrendingScores()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_post_id INT;
    DECLARE post_cursor CURSOR FOR 
        SELECT id FROM blog_posts 
        WHERE status = 'published' 
        AND publish_date > DATE_SUB(NOW(), INTERVAL 90 DAY);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN post_cursor;
    
    trending_loop: LOOP
        FETCH post_cursor INTO v_post_id;
        IF done THEN
            LEAVE trending_loop;
        END IF;
        
        CALL CalculatePostTrendingScore(v_post_id);
    END LOOP;
    
    CLOSE post_cursor;
END //

DELIMITER ;

-- Example queries for the blog hub

-- Get latest 8 posts
SELECT * FROM latest_posts LIMIT 8;

-- Get trending posts for last 7 days
SELECT * FROM trending_posts 
WHERE publish_date > DATE_SUB(NOW(), INTERVAL 7 DAY)
LIMIT 10;

-- Get posts by category
SELECT * FROM latest_posts 
WHERE category = 'seo'
LIMIT 10;

-- Search posts by keyword
SELECT id, title, excerpt, category
FROM blog_posts
WHERE status = 'published'
    AND MATCH(title, excerpt, content) AGAINST('local seo las vegas' IN NATURAL LANGUAGE MODE)
ORDER BY publish_date DESC;

-- Performance analytics summary
SELECT 
    category,
    COUNT(*) as total_posts,
    AVG(JSON_EXTRACT(analytics, '$.pageViews')) as avg_page_views,
    AVG(JSON_EXTRACT(analytics, '$.trendingScore')) as avg_trending_score
FROM blog_posts 
WHERE status = 'published'
GROUP BY category
ORDER BY avg_trending_score DESC;