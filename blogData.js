// Shared blog post data
const blogPosts = [
    {
        title: "The Kingdom the State Cannot See",
        date: "January 15, 2026",
        category: "Critical Analysis",
        author: "Evan Wologodzew",
        excerpt: "When frameworks designed to detect power encounter sacramental communion, they mistake their own blindness for hidden operations.",
        url: "/articles/2026-01-15-the-kingdom-the-state-cannot-see.html",
        tags: ["Critical Analysis", "Theology", "Orthodox Christianity", "Social Theory", "Philosophy", "Political Thought", "Religious Freedom"],
        series: null,
        seriesOrder: null
    },
    {
        title: "Lineage: Encoding Feudal Metaphysics",
        date: "January 14, 2026",
        category: "Systems Design",
        author: "Evan Wologodzew",
        excerpt: "How do you model a world where legitimacy flows through bloodlines, power lives in personal oaths, and identity manifests in heraldic symbols? Building feudal ontology as system architecture.",
        url: "/articles/2026-01-14-lineage-encoding-feudal-metaphysics.html",
        tags: ["Systems Design", "Design", "Productivity", "Engineering", "Game Design", "Systems Thinking", "Medieval History", "Software Architecture"],
        series: null,
        seriesOrder: null
    }
];

// Utility function to get related articles based on shared tags
function getRelatedArticles(currentUrl, limit = 3) {
    const currentPost = blogPosts.find(post => post.url === currentUrl);
    if (!currentPost) return [];
    
    const scored = blogPosts
        .filter(post => post.url !== currentUrl)
        .map(post => {
            const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
            const categoryMatch = post.category === currentPost.category ? 1 : 0;
            return {
                ...post,
                score: sharedTags.length + categoryMatch
            };
        })
        .filter(post => post.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    
    return scored;
}

// Utility function to get articles in the same series
function getSeriesArticles(currentUrl) {
    const currentPost = blogPosts.find(post => post.url === currentUrl);
    if (!currentPost || !currentPost.series) return null;
    
    const seriesArticles = blogPosts
        .filter(post => post.series === currentPost.series)
        .sort((a, b) => a.seriesOrder - b.seriesOrder);
    
    const currentIndex = seriesArticles.findIndex(post => post.url === currentUrl);
    
    return {
        title: currentPost.series,
        total: seriesArticles.length,
        current: currentPost.seriesOrder,
        previous: currentIndex > 0 ? seriesArticles[currentIndex - 1] : null,
        next: currentIndex < seriesArticles.length - 1 ? seriesArticles[currentIndex + 1] : null,
        all: seriesArticles
    };
}

// Utility function to calculate reading time
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

// Utility function to extract headings for TOC
function extractHeadings(contentElement) {
    const headings = contentElement.querySelectorAll('h2, h3');
    const toc = [];
    
    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;
        
        toc.push({
            id: id,
            text: heading.textContent,
            level: heading.tagName.toLowerCase()
        });
    });
    
    return toc;
}
