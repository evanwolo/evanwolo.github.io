# Evan Wologodzew's Portfolio & Terminal Dispatch

A minimalist personal website built with vanilla HTML/CSS/JS and hosted on GitHub Pages.

## Architecture

This site consists of two distinct but connected parts:

### Portfolio (index.html, projects.html)
Modern, minimal tech portfolio showcasing projects and work. Uses:
- System fonts for speed
- Blue accent color scheme (`#2563eb`)
- Subtle animations and gradients
- Dark mode support via `prefers-color-scheme`

### Terminal Dispatch (blog.html, /articles/)
Editorial-style publication for essays on systems, design, and engineering. Features:
- Google Fonts (Playfair Display + Source Sans 3)
- Newspaper-inspired layout
- Crimson accent color (`#c41e3a`)
- Same dark mode support

## Structure

```
/
├── index.html              # Portfolio homepage
├── projects.html           # Full project showcase
├── blog.html              # Terminal Dispatch homepage
├── more-articles.html     # Article archive
└── articles/              # Individual articles
    ├── 2026-01-14-lineage-encoding-feudal-metaphysics.html
    ├── 2025-10-12-reflecting-on-minimalist-software-design.html
    ├── 2025-09-08-why-i-switched-to-a-tiling-window-manager.html
    └── 2025-08-15-understanding-async-await-patterns.html
```

## Navigation Flow

**Portfolio** → Links to Terminal Dispatch in nav  
**Terminal Dispatch** → "← Portfolio" link to return

This separation is intentional—keeping the professional portfolio clean while allowing the blog to embrace editorial aesthetics.

## Adding Articles

1. Create new HTML file in `/articles/` following date-title format:
   ```
   YYYY-MM-DD-title-slug.html
   ```

2. Use `articles/article-template.html` as starting point

3. Add entry to `blog.html` JavaScript array:
   ```javascript
   {
       title: "Article Title",
       date: "Month DD, YYYY",
       category: "Category Name",
       author: "Evan Wologodzew",
       excerpt: "Brief description...",
       url: "/articles/YYYY-MM-DD-title-slug.html",
       tags: ["Tag1", "Tag2"]
   }
   ```

## Local Development

No build tools required. Serve with any static file server:

```bash
# Python
python -m http.server 8000

# Node
npx serve

# VS Code Live Server extension
```

Visit `http://localhost:8000`

## Deployment

Push to GitHub. GitHub Pages serves static files automatically—no Jekyll processing.

## Technologies

- Pure HTML/CSS/JavaScript (no frameworks)
- CSS custom properties for theming
- Vanilla JS for blog filtering
- GitHub Pages for hosting
- Google Fonts (Terminal Dispatch only)

## Design Philosophy

**Portfolio**: Fast, minimal, system fonts, professional  
**Terminal Dispatch**: Editorial, character-driven, Google Fonts, expressive

Both share: Dark mode, semantic HTML, accessibility focus, mobile-responsive
