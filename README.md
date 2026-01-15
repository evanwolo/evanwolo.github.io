# Evan Wologodzew's Portfolio

A minimalist personal website built with Jekyll and hosted on GitHub Pages.

## Structure

- `index.md` - Homepage with projects and blog post list
- `_posts/` - Blog posts in Markdown format
- `_layouts/` - Jekyll templates (default and post layouts)
- `_config.yml` - Jekyll configuration

## Adding Blog Posts

Create a new file in `_posts/` with the format: `YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: Your Post Title
date: YYYY-MM-DD
---

Your content here...
```

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000` to view your site.

## Deployment

Push to GitHub. GitHub Pages automatically builds and serves your Jekyll site.

## Technologies

- Jekyll for static site generation
- Markdown for blog content
- Vanilla CSS and JavaScript
- GitHub Pages for hosting
