// Shared blog post data
const blogPosts = [
    {
        title: "When the Knapsack Doesn't Fit: A Russian Orthodox Response to Racial Essentialism",
        date: "January 15, 2026",
        category: "Critical Analysis",
        author: "Evan Wologodzew",
        excerpt: "What happens when the framework of privilege can't account for the persecution of supposedly privileged groups? A theological and historical critique of contemporary social theory.",
        url: "/articles/2026-01-15-when-the-knapsack-doesnt-fit.html",
        tags: ["Critical Analysis", "Theology", "Orthodox Christianity", "Social Theory", "Philosophy", "Political Thought", "Religious Freedom"],
        series: null, // Can be set to group articles into series
        seriesOrder: null // Order within series (1, 2, 3, etc.)
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
    },
    {
        title: "The Liturgical Foundations of Software Architecture",
        date: "January 10, 2026",
        category: "Theology",
        author: "Evan Wologodzew",
        excerpt: "What can the Divine Liturgy teach us about building resilient systems? Exploring patterns of repetition, ritual, and reliability in both worship and code.",
        url: "#",
        tags: ["Theology", "Orthodox Christianity", "Software Architecture", "Systems Thinking", "Engineering"],
        series: null,
        seriesOrder: null
    },
    {
        title: "Against Efficiency: A Case for Inefficient Systems",
        date: "January 8, 2026",
        category: "Critical Analysis",
        author: "Evan Wologodzew",
        excerpt: "Why the relentless pursuit of optimization might be destroying what makes systems human. A philosophical argument for embracing strategic inefficiency.",
        url: "#",
        tags: ["Critical Analysis", "Philosophy", "Systems Design", "Political Thought"],
        series: null,
        seriesOrder: null
    },
    {
        title: "State Machines and the Soul",
        date: "January 5, 2026",
        category: "Systems Design",
        author: "Evan Wologodzew",
        excerpt: "How do we model transformation? Exploring the parallels between finite state machines and the Orthodox understanding of theosis.",
        url: "#",
        tags: ["Systems Design", "Theology", "Software Architecture", "Orthodox Christianity", "Engineering"],
        series: null,
        seriesOrder: null
    },
    {
        title: "The Iconography of User Interfaces",
        date: "January 2, 2026",
        category: "Design",
        author: "Evan Wologodzew",
        excerpt: "What Orthodox iconography reveals about the nature of representation, meaning, and the sacred geometry of good design.",
        url: "#",
        tags: ["Design", "Theology", "Orthodox Christianity", "Systems Thinking"],
        series: null,
        seriesOrder: null
    },
    {
        title: "Debugging as Spiritual Practice",
        date: "December 28, 2025",
        category: "Theology",
        author: "Evan Wologodzew",
        excerpt: "The humility required to find errors in our own code mirrors the spiritual discipline of examining our hearts. Reflections on confession and debugging.",
        url: "#",
        tags: ["Theology", "Orthodox Christianity", "Engineering", "Philosophy"],
        series: null,
        seriesOrder: null
    },
    {
        title: "Database Normalization and the Problem of Universals",
        date: "December 24, 2025",
        category: "Systems Design",
        author: "Evan Wologodzew",
        excerpt: "Medieval philosophy meets modern data modeling. How the ancient debate about universals illuminates database design decisions.",
        url: "#",
        tags: ["Systems Design", "Philosophy", "Software Architecture", "Medieval History", "Engineering"],
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
