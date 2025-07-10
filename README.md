# ML Blog - Minimalist Machine Learning Blog

A minimalist, black and white blog focused on Machine Learning topics. Built with a custom static site generator and deployed via GitHub Actions.

## Features

- ✨ **Minimalist Design**: Clean black and white aesthetic
- 📝 **Markdown Content**: Write posts in Markdown with front matter
- 🏷️ **Tagging System**: Organize posts with tags
- 📱 **Responsive**: Works on all devices
- 🚀 **GitHub Actions**: Automated build and deployment
- 📡 **RSS Feed**: Subscribe to new posts
- 🎯 **Zero JavaScript**: Fast, accessible, and lightweight
- 🔍 **SEO Friendly**: Proper meta tags and semantic HTML

## Quick Start

1. **Fork this repository**
2. **Enable GitHub Pages** in repository settings
3. **Add your content** by creating Markdown files in the `posts/` directory
4. **Push to main branch** - GitHub Actions will build and deploy automatically

## Writing Posts

Create a new `.md` file in the `posts/` directory with front matter:

\`\`\`markdown
---
title: "Your Post Title"
date: "2024-01-15"
author: "Your Name"
description: "Brief description for SEO"
excerpt: "Short excerpt for the home page"
tags: ["machine-learning", "python", "tutorial"]
readTime: "5 min read"
---

# Your Post Content

Write your post content here using Markdown...
\`\`\`

## Local Development

\`\`\`bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally
npm run dev
\`\`\`

Visit `http://localhost:3000` to view your site.

## Customization

### Styling
Edit `public/styles.css` to customize the appearance while maintaining the minimalist aesthetic.

### Site Information
Update the following files:
- `templates/layout.html` - Site title and navigation
- `build.js` - RSS feed configuration
- `.github/workflows/deploy.yml` - Custom domain (if applicable)

### About Page
Edit the about page content in the `generateAboutPage()` function in `build.js`.

## Deployment

The site automatically deploys to GitHub Pages when you push to the main branch. The GitHub Action:

1. Installs Node.js and dependencies
2. Runs the build script
3. Deploys the generated files to GitHub Pages

## Project Structure

\`\`\`
├── posts/                  # Markdown blog posts
├── templates/             # HTML templates
├── public/               # Generated static files
│   └── styles.css       # Minimalist CSS
├── build.js             # Static site generator
├── package.json         # Node.js dependencies
└── .github/workflows/   # GitHub Actions
\`\`\`

## Tech Stack

- **Static Site Generator**: Custom Node.js script
- **Content**: Markdown with YAML front matter
- **Styling**: Pure CSS (black and white minimalist)
- **Deployment**: GitHub Actions + GitHub Pages
- **Dependencies**: Marked (Markdown parser) + Gray Matter (front matter parser)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your own blog!
