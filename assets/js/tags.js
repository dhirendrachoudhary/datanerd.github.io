class TagsPage {
  constructor() {
    this.posts = []
    this.tags = new Map()
    this.selectedTag = null
    this.init()
  }

  async init() {
    await this.loadPosts()
    this.processTagsData()
    this.checkSelectedTag()
    this.renderTagsCloud()
    this.renderTaggedPosts()
  }

  async loadPosts() {
    try {
      const response = await fetch("data/posts.json")
      const data = await response.json()
      this.posts = data.posts
    } catch (error) {
      console.error("Error loading posts:", error)
      // Fallback to hardcoded data if JSON fails
      this.posts = this.getFallbackPosts()
    }
  }

  getFallbackPosts() {
    return [
      {
        id: "introduction-to-neural-networks",
        title: "Introduction to Neural Networks",
        date: "2024-01-15",
        author: "ML Researcher",
        excerpt: "Understanding the building blocks of artificial intelligence through neural networks.",
        tags: ["neural-networks", "deep-learning", "ai", "beginners"],
        readTime: "8 min read",
        category: "Deep Learning",
      },
      {
        id: "gradient-descent-explained",
        title: "Gradient Descent Explained",
        date: "2024-01-10",
        author: "ML Researcher",
        excerpt: "A deep dive into the optimization algorithm that powers machine learning.",
        tags: ["optimization", "algorithms", "mathematics"],
        readTime: "6 min read",
        category: "Algorithms",
      },
      {
        id: "python-for-machine-learning",
        title: "Python for Machine Learning",
        date: "2024-01-05",
        author: "ML Researcher",
        excerpt: "Essential Python libraries and tools for machine learning practitioners.",
        tags: ["python", "tools", "beginners"],
        readTime: "10 min read",
        category: "Tools",
      },
      {
        id: "understanding-overfitting",
        title: "Understanding Overfitting",
        date: "2023-12-28",
        author: "ML Researcher",
        excerpt: "Learn how to identify and prevent overfitting in your machine learning models.",
        tags: ["model-validation", "best-practices", "debugging"],
        readTime: "7 min read",
        category: "Best Practices",
      },
      {
        id: "linear-regression-from-scratch",
        title: "Linear Regression from Scratch",
        date: "2023-12-20",
        author: "ML Researcher",
        excerpt: "Build a linear regression model from the ground up using only NumPy.",
        tags: ["regression", "numpy", "tutorial", "from-scratch"],
        readTime: "12 min read",
        category: "Tutorial",
      },
      {
        id: "convolutional-neural-networks",
        title: "Convolutional Neural Networks",
        date: "2023-12-15",
        author: "ML Researcher",
        excerpt: "Explore CNNs and their applications in computer vision.",
        tags: ["cnn", "computer-vision", "deep-learning"],
        readTime: "15 min read",
        category: "Computer Vision",
      },
    ]
  }

  processTagsData() {
    this.posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (this.tags.has(tag)) {
          this.tags.get(tag).push(post)
        } else {
          this.tags.set(tag, [post])
        }
      })
    })
  }

  checkSelectedTag() {
    const urlParams = new URLSearchParams(window.location.search)
    this.selectedTag = urlParams.get("tag")
  }

  renderTagsCloud() {
    const tagsCloud = document.getElementById("tagsCloud")

    const tagsHTML = Array.from(this.tags.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([tag, posts]) => `
                <span class="tag ${this.selectedTag === tag ? "active" : ""}" 
                      data-tag="${tag}">
                    #${tag} (${posts.length})
                </span>
            `,
      )
      .join("")

    tagsCloud.innerHTML = tagsHTML

    // Add click event listeners
    tagsCloud.addEventListener("click", (e) => {
      if (e.target.classList.contains("tag")) {
        const tag = e.target.dataset.tag
        this.selectTag(tag)
      }
    })
  }

  selectTag(tag) {
    this.selectedTag = tag

    // Update URL
    const url = new URL(window.location)
    url.searchParams.set("tag", tag)
    window.history.pushState({}, "", url)

    // Update UI
    document.querySelectorAll(".tag").forEach((el) => el.classList.remove("active"))
    document.querySelector(`[data-tag="${tag}"]`)?.classList.add("active")

    this.renderTaggedPosts()
  }

  renderTaggedPosts() {
    const taggedPostsContainer = document.getElementById("taggedPosts")

    if (!this.selectedTag) {
      taggedPostsContainer.innerHTML =
        '<p style="text-align: center; color: #666;">Select a tag to view related posts</p>'
      return
    }

    const posts = this.tags.get(this.selectedTag) || []

    if (posts.length === 0) {
      taggedPostsContainer.innerHTML = '<p style="text-align: center; color: #666;">No posts found for this tag</p>'
      return
    }

    taggedPostsContainer.innerHTML = posts
      .map(
        (post) => `
            <article class="blog-card">
                <div class="meta">
                    <span class="category">${post.category}</span>
                    <span>${this.formatDate(post.date)}</span>
                    <span>${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p class="excerpt">${post.excerpt}</p>
                <div class="tags">
                    ${post.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <small>By ${post.author}</small>
                    <a href="${post.id}.html" class="btn">Read More</a>
                </div>
            </article>
        `,
      )
      .join("")
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TagsPage()
})
