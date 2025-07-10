// Modern ML Blog JavaScript with GSAP animations
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

class MLBlog {
  constructor() {
    this.posts = []
    this.categories = {}
    this.isLoading = false
    this.searchIndex = []
    this.init()
  }

  async init() {
    this.showLoadingSplash()
    await this.loadContent()
    this.setupEventListeners()
    this.setupAnimations()
    this.setupTypewriter()
    this.hideLoadingSplash()
  }

  showLoadingSplash() {
    const splash = document.getElementById("loading-splash")
    if (splash) {
      splash.classList.remove("hidden")
    }
  }

  hideLoadingSplash() {
    const splash = document.getElementById("loading-splash")
    if (splash) {
      setTimeout(() => {
        splash.classList.add("hidden")
        setTimeout(() => {
          splash.style.display = "none"
        }, 500)
      }, 2000)
    }
  }

  async loadContent() {
    // Simulate loading posts from markdown files
    // In a real implementation, this would fetch from a build-generated JSON
    this.posts = await this.generateSamplePosts()
    this.buildSearchIndex()
    this.updatePostCounts()
  }

  async generateSamplePosts() {
    return [
      {
        id: "transformer-architecture-explained",
        title: "Understanding Transformer Architecture: From Attention to GPT",
        category: "Deep Learning",
        date: "2024-01-15",
        readTime: "8 min read",
        excerpt:
          "Deep dive into the transformer architecture that revolutionized NLP and beyond. Learn about self-attention, positional encoding, and how these models work.",
        tags: ["Transformers", "Attention", "NLP", "Deep Learning"],
        featured: true,
      },
      {
        id: "vision-transformers-guide",
        title: "Vision Transformers: Applying Attention to Images",
        category: "Computer Vision",
        date: "2024-01-12",
        readTime: "12 min read",
        excerpt:
          "How Vision Transformers (ViTs) are changing computer vision by treating images as sequences of patches and applying transformer architecture.",
        tags: ["ViT", "Computer Vision", "Transformers"],
      },
      {
        id: "gradient-descent-optimization",
        title: "Gradient Descent and Modern Optimization Techniques",
        category: "ML Fundamentals",
        date: "2024-01-10",
        readTime: "6 min read",
        excerpt:
          "From basic gradient descent to Adam and beyond. Understanding optimization algorithms that power modern machine learning.",
        tags: ["Optimization", "Gradient Descent", "Mathematics"],
      },
      {
        id: "bert-language-understanding",
        title: "BERT and the Revolution in Language Understanding",
        category: "NLP",
        date: "2024-01-08",
        readTime: "10 min read",
        excerpt:
          "How BERT changed natural language processing with bidirectional training and masked language modeling.",
        tags: ["BERT", "NLP", "Language Models"],
      },
      {
        id: "cnn-architectures-evolution",
        title: "Evolution of CNN Architectures: From LeNet to EfficientNet",
        category: "Computer Vision",
        date: "2024-01-05",
        readTime: "15 min read",
        excerpt: "Journey through the evolution of convolutional neural networks and how they shaped computer vision.",
        tags: ["CNN", "Computer Vision", "Architecture"],
      },
      {
        id: "pytorch-advanced-techniques",
        title: "Advanced PyTorch Techniques for Production",
        category: "Tools & Frameworks",
        date: "2024-01-03",
        readTime: "14 min read",
        excerpt: "Professional PyTorch development practices, optimization techniques, and deployment strategies.",
        tags: ["PyTorch", "Production", "MLOps"],
      },
    ]
  }

  buildSearchIndex() {
    this.searchIndex = this.posts.map((post) => ({
      ...post,
      searchText: `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.category}`.toLowerCase(),
    }))
  }

  updatePostCounts() {
    // Update category post counts
    const categoryCounts = {}
    this.posts.forEach((post) => {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1
    })

    document.querySelectorAll(".category-card").forEach((card) => {
      const category = card.dataset.category
      const categoryName = this.getCategoryName(category)
      const count = categoryCounts[categoryName] || 0
      const countElement = card.querySelector(".post-count")
      if (countElement) {
        countElement.textContent = `${count} posts`
      }
    })
  }

  getCategoryName(slug) {
    const mapping = {
      "deep-learning": "Deep Learning",
      nlp: "NLP",
      "computer-vision": "Computer Vision",
      "ml-fundamentals": "ML Fundamentals",
      "ai-research": "AI Research",
      "tools-frameworks": "Tools & Frameworks",
    }
    return mapping[slug] || slug
  }

  setupEventListeners() {
    // Navigation
    this.setupNavigation()

    // Search
    this.setupSearch()

    // Load more posts
    this.setupLoadMore()

    // Smooth scrolling
    this.setupSmoothScrolling()

    // Keyboard shortcuts
    this.setupKeyboardShortcuts()
  }

  setupNavigation() {
    const navbar = document.getElementById("navbar")
    const navToggle = document.getElementById("nav-toggle")
    const navMenu = document.getElementById("nav-menu")

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active")
      })
    }

    // Active nav link
    const navLinks = document.querySelectorAll(".nav-link")
    const sections = document.querySelectorAll("section[id]")

    window.addEventListener("scroll", () => {
      let current = ""
      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id")
        }
      })

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active")
        }
      })
    })
  }

  setupSearch() {
    const searchModal = document.getElementById("search-modal")
    const searchInput = document.getElementById("search-input")
    const searchClose = document.getElementById("search-close")
    const searchResults = document.getElementById("search-results")
    const searchTrigger = document.querySelector(".search-trigger")

    // Open search modal
    const openSearch = () => {
      searchModal.classList.add("active")
      setTimeout(() => searchInput.focus(), 100)
    }

    // Close search modal
    const closeSearch = () => {
      searchModal.classList.remove("active")
      searchInput.value = ""
      this.clearSearchResults()
    }

    // Event listeners
    if (searchTrigger) {
      searchTrigger.addEventListener("click", (e) => {
        e.preventDefault()
        openSearch()
      })
    }

    if (searchClose) {
      searchClose.addEventListener("click", closeSearch)
    }

    // Close on backdrop click
    if (searchModal) {
      searchModal.addEventListener("click", (e) => {
        if (e.target.classList.contains("search-backdrop")) {
          closeSearch()
        }
      })
    }

    // Search functionality
    if (searchInput) {
      let searchTimeout
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value)
        }, 300)
      })
    }

    // Suggestion tags
    document.querySelectorAll(".suggestion-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        searchInput.value = tag.textContent
        this.performSearch(tag.textContent)
      })
    })
  }

  performSearch(query) {
    const searchResults = document.getElementById("search-results")

    if (!query.trim()) {
      this.showSearchSuggestions()
      return
    }

    if (query.length < 2) {
      searchResults.innerHTML = '<div class="search-message">Type at least 2 characters to search...</div>'
      return
    }

    const results = this.searchIndex.filter((post) => post.searchText.includes(query.toLowerCase())).slice(0, 8)

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-message">No posts found matching your search.</div>'
      return
    }

    searchResults.innerHTML = `
      <div class="search-results-list">
        <h4>Search Results (${results.length})</h4>
        ${results
          .map(
            (post) => `
          <div class="search-result-item" onclick="window.location.href='posts/${post.id}.html'">
            <div class="search-result-category">${post.category}</div>
            <h5 class="search-result-title">${this.highlightText(post.title, query)}</h5>
            <p class="search-result-excerpt">${this.highlightText(this.truncateText(post.excerpt, 120), query)}</p>
            <div class="search-result-meta">
              <span>${post.date}</span>
              <span>${post.readTime}</span>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
  }

  showSearchSuggestions() {
    const searchResults = document.getElementById("search-results")
    searchResults.innerHTML = `
      <div class="search-suggestions">
        <h4>Popular searches</h4>
        <div class="suggestion-tags">
          <span class="suggestion-tag">Neural Networks</span>
          <span class="suggestion-tag">Transformers</span>
          <span class="suggestion-tag">Computer Vision</span>
          <span class="suggestion-tag">PyTorch</span>
          <span class="suggestion-tag">NLP</span>
          <span class="suggestion-tag">Deep Learning</span>
        </div>
      </div>
    `
  }

  clearSearchResults() {
    this.showSearchSuggestions()
  }

  highlightText(text, query) {
    if (!query) return text
    const regex = new RegExp(`(${this.escapeRegex(query)})`, "gi")
    return text.replace(regex, "<mark>$1</mark>")
  }

  truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + "..." : text
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  setupLoadMore() {
    const loadMoreBtn = document.getElementById("load-more")
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMorePosts()
      })
    }
  }

  async loadMorePosts() {
    const loadMoreBtn = document.getElementById("load-more")
    const spinner = loadMoreBtn.querySelector(".loading-spinner")
    const text = loadMoreBtn.querySelector("span")

    // Show loading state
    spinner.style.display = "block"
    text.textContent = "Loading..."
    loadMoreBtn.disabled = true

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Hide loading state
    spinner.style.display = "none"
    text.textContent = "Load More Posts"
    loadMoreBtn.disabled = false

    // In a real implementation, you would load more posts here
    console.log("Loading more posts...")
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          const offsetTop = target.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const searchModal = document.getElementById("search-modal")
        if (searchModal) {
          searchModal.classList.add("active")
          setTimeout(() => {
            const searchInput = document.getElementById("search-input")
            if (searchInput) searchInput.focus()
          }, 100)
        }
      }

      // Escape to close search
      if (e.key === "Escape") {
        const searchModal = document.getElementById("search-modal")
        if (searchModal && searchModal.classList.contains("active")) {
          searchModal.classList.remove("active")
        }
      }
    })
  }

  setupAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger)

    // Hero animations
    gsap.from(".hero-text", {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 2.5,
    })

    // Category cards animation
    gsap.from(".category-card", {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".categories-grid",
        start: "top 80%",
      },
    })

    // Post cards animation
    gsap.from(".post-card", {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".posts-grid",
        start: "top 80%",
      },
    })

    // Section titles animation
    gsap.from(".section-title", {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".section-title",
        start: "top 85%",
      },
    })

    // Parallax effect for hero background
    gsap.to(".hero-particles", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  }

  setupTypewriter() {
    const typewriterElement = document.querySelector(".typewriter")
    if (!typewriterElement) return

    const words = typewriterElement.dataset.words.split(",")
    let currentWordIndex = 0
    let currentCharIndex = 0
    let isDeleting = false

    const typeSpeed = 100
    const deleteSpeed = 50
    const pauseTime = 2000

    function type() {
      const currentWord = words[currentWordIndex]

      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, currentCharIndex - 1)
        currentCharIndex--
      } else {
        typewriterElement.textContent = currentWord.substring(0, currentCharIndex + 1)
        currentCharIndex++
      }

      let typeSpeedCurrent = isDeleting ? deleteSpeed : typeSpeed

      if (!isDeleting && currentCharIndex === currentWord.length) {
        typeSpeedCurrent = pauseTime
        isDeleting = true
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false
        currentWordIndex = (currentWordIndex + 1) % words.length
      }

      setTimeout(type, typeSpeedCurrent)
    }

    // Start typing animation after loading
    setTimeout(type, 3000)
  }
}

// Initialize the blog when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MLBlog()
})

// Additional utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Intersection Observer for lazy loading
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.1,
}

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      if (img.dataset.src) {
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    }
  })
}, observerOptions)

// Observe all images with data-src
document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img)
})
