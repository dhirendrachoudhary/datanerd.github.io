const fs = require("fs").promises
const path = require("path")
const marked = require("marked")
const matter = require("gray-matter")

class StaticSiteGenerator {
  constructor() {
    this.posts = []
    this.tags = new Map()
    this.outputDir = "public"
    this.postsDir = "posts"
    this.templatesDir = "templates"
  }

  async build() {
    console.log("🚀 Building ML Blog...")

    // Ensure output directory exists
    await this.ensureDir(this.outputDir)

    // Load and process posts
    await this.loadPosts()

    // Generate pages
    await this.generateHomePage()
    await this.generatePostPages()
    await this.generateTagPages()
    await this.generateAboutPage()
    await this.generateRSSFeed()

    console.log("✅ Build complete!")
    console.log(`📄 Generated ${this.posts.length} posts`)
    console.log(`🏷️  Generated ${this.tags.size} tag pages`)
  }

  async ensureDir(dir) {
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }
  }

  async loadPosts() {
    const postFiles = await fs.readdir(this.postsDir)
    const markdownFiles = postFiles.filter((file) => file.endsWith(".md"))

    for (const file of markdownFiles) {
      const filePath = path.join(this.postsDir, file)
      const content = await fs.readFile(filePath, "utf-8")
      const { data, content: markdown } = matter(content)

      const post = {
        ...data,
        content: marked.parse(markdown),
        slug: file.replace(".md", ""),
        url: `/${file.replace(".md", ".html")}`,
      }

      this.posts.push(post)

      // Process tags
      if (post.tags) {
        post.tags.forEach((tag) => {
          if (!this.tags.has(tag)) {
            this.tags.set(tag, [])
          }
          this.tags.get(tag).push(post)
        })
      }
    }

    // Sort posts by date (newest first)
    this.posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async loadTemplate(templateName) {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`)
    return await fs.readFile(templatePath, "utf-8")
  }

  async generateHomePage() {
    const template = await this.loadTemplate("layout")

    const postsHtml = this.posts
      .map(
        (post) => `
            <article class="article-item">
                <h2 class="article-title">
                    <a href="${post.url}">${post.title}</a>
                </h2>
                <div class="article-meta">
                    <span>📅 ${this.formatDate(post.date)}</span>
                    <span>👤 ${post.author}</span>
                    <span>⏱️ ${post.readTime || "5 min read"}</span>
                </div>
                <div class="article-excerpt">
                    ${post.excerpt || post.description}
                </div>
                ${
                  post.tags
                    ? `
                    <div class="tags">
                        ${post.tags.map((tag) => `<a href="/tag-${tag}.html" class="tag">#${tag}</a>`).join("")}
                    </div>
                `
                    : ""
                }
            </article>
        `,
      )
      .join("")

    const content = `
            <div class="article-list">
                ${postsHtml}
            </div>
        `

    const html = template
      .replace("{{title}}", "Home")
      .replace("{{description}}", "A minimalist Machine Learning blog")
      .replace("{{content}}", content)

    await fs.writeFile(path.join(this.outputDir, "index.html"), html)
  }

  async generatePostPages() {
    const template = await this.loadTemplate("layout")

    for (const post of this.posts) {
      const content = `
                <article>
                    <header class="article-header">
                        <h1>${post.title}</h1>
                        <div class="article-meta">
                            <span>📅 ${this.formatDate(post.date)}</span>
                            <span>👤 ${post.author}</span>
                            <span>⏱️ ${post.readTime || "5 min read"}</span>
                        </div>
                        ${
                          post.tags
                            ? `
                            <div class="tags">
                                ${post.tags.map((tag) => `<a href="/tag-${tag}.html" class="tag">#${tag}</a>`).join("")}
                            </div>
                        `
                            : ""
                        }
                    </header>
                    <div class="article-content">
                        ${post.content}
                    </div>
                </article>
            `

      const html = template
        .replace("{{title}}", post.title)
        .replace("{{description}}", post.description || post.excerpt)
        .replace("{{content}}", content)

      await fs.writeFile(path.join(this.outputDir, `${post.slug}.html`), html)
    }
  }

  async generateTagPages() {
    const template = await this.loadTemplate("layout")

    // Generate individual tag pages
    for (const [tag, posts] of this.tags) {
      const postsHtml = posts
        .map(
          (post) => `
                <article class="article-item">
                    <h3 class="article-title">
                        <a href="${post.url}">${post.title}</a>
                    </h3>
                    <div class="article-meta">
                        <span>📅 ${this.formatDate(post.date)}</span>
                        <span>👤 ${post.author}</span>
                    </div>
                    <div class="article-excerpt">
                        ${post.excerpt || post.description}
                    </div>
                </article>
            `,
        )
        .join("")

      const content = `
                <h1>Posts tagged with "${tag}"</h1>
                <div class="article-list">
                    ${postsHtml}
                </div>
                <p><a href="/tags.html">← Back to all tags</a></p>
            `

      const html = template
        .replace("{{title}}", `Tag: ${tag}`)
        .replace("{{description}}", `Posts tagged with ${tag}`)
        .replace("{{content}}", content)

      await fs.writeFile(path.join(this.outputDir, `tag-${tag}.html`), html)
    }

    // Generate tags index page
    const tagsHtml = Array.from(this.tags.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([tag, posts]) => `
                <a href="/tag-${tag}.html" class="tag">
                    #${tag} (${posts.length})
                </a>
            `,
      )
      .join("")

    const content = `
            <h1>All Tags</h1>
            <div class="tag-cloud">
                ${tagsHtml}
            </div>
        `

    const html = template
      .replace("{{title}}", "Tags")
      .replace("{{description}}", "Browse posts by tags")
      .replace("{{content}}", content)

    await fs.writeFile(path.join(this.outputDir, "tags.html"), html)
  }

  async generateAboutPage() {
    const template = await this.loadTemplate("layout")

    const content = `
            <h1>About</h1>
            <p>Welcome to my minimalist Machine Learning blog. This site is built with a custom static site generator, deployed via GitHub Actions, and focuses on clean, readable content about ML topics.</p>
            
            <h2>Tech Stack</h2>
            <ul>
                <li>Static Site Generator (Node.js)</li>
                <li>Markdown for content</li>
                <li>GitHub Actions for deployment</li>
                <li>GitHub Pages for hosting</li>
                <li>Zero JavaScript on the frontend</li>
                <li>Minimalist black and white design</li>
            </ul>
            
            <h2>Contact</h2>
            <p>Find me on <a href="https://github.com">GitHub</a> or reach out via email.</p>
        `

    const html = template
      .replace("{{title}}", "About")
      .replace("{{description}}", "About this ML blog")
      .replace("{{content}}", content)

    await fs.writeFile(path.join(this.outputDir, "about.html"), html)
  }

  async generateRSSFeed() {
    const items = this.posts
      .slice(0, 10)
      .map(
        (post) => `
            <item>
                <title>${this.escapeXml(post.title)}</title>
                <link>https://yourdomain.github.io${post.url}</link>
                <description>${this.escapeXml(post.description || post.excerpt)}</description>
                <pubDate>${new Date(post.date).toUTCString()}</pubDate>
                <guid>https://yourdomain.github.io${post.url}</guid>
            </item>
        `,
      )
      .join("")

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>ML Blog</title>
        <link>https://yourdomain.github.io</link>
        <description>A minimalist Machine Learning blog</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
    </channel>
</rss>`

    await fs.writeFile(path.join(this.outputDir, "feed.xml"), rss)
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;"
        case ">":
          return "&gt;"
        case "&":
          return "&amp;"
        case "'":
          return "&apos;"
        case '"':
          return "&quot;"
      }
    })
  }
}

// Build the site
const generator = new StaticSiteGenerator()
generator.build().catch(console.error)
