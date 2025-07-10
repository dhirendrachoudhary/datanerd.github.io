// Search functionality
let allPosts = []

// Initialize search functionality
document.addEventListener("DOMContentLoaded", () => {
  loadPostsForSearch()
})

function loadPostsForSearch() {
  // Extract posts from the DOM
  const articles = document.querySelectorAll(".article-item")
  allPosts = Array.from(articles).map((article) => {
    const title = article.querySelector(".article-title a").textContent
    const excerpt = article.querySelector(".article-excerpt").textContent
    const url = article.querySelector(".article-title a").href
    const tags = article.dataset.tags ? article.dataset.tags.split(",") : []
    const meta = article.querySelector(".article-meta").textContent

    return {
      title,
      excerpt,
      url,
      tags,
      meta,
      element: article,
    }
  })
}

function toggleSearch() {
  const searchContainer = document.getElementById("searchContainer")
  const searchInput = document.getElementById("searchInput")

  if (searchContainer.style.display === "none") {
    searchContainer.style.display = "block"
    searchInput.focus()
  } else {
    searchContainer.style.display = "none"
    searchInput.value = ""
    document.getElementById("searchResults").innerHTML = ""
    showAllPosts()
  }
}

function searchPosts() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim()
  const searchResults = document.getElementById("searchResults")

  if (query.length === 0) {
    searchResults.innerHTML = ""
    showAllPosts()
    return
  }

  if (query.length < 2) {
    searchResults.innerHTML = '<p style="padding: 0.5rem; color: #666;">Type at least 2 characters to search...</p>'
    return
  }

  const filteredPosts = allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  if (filteredPosts.length === 0) {
    searchResults.innerHTML = '<p style="padding: 0.5rem; color: #666;">No posts found matching your search.</p>'
    hideAllPosts()
    return
  }

  // Display search results
  searchResults.innerHTML = filteredPosts
    .map(
      (post) => `
        <div class="search-result" onclick="window.location.href='${post.url}'">
            <h4>${highlightText(post.title, query)}</h4>
            <p>${highlightText(post.excerpt.substring(0, 150) + "...", query)}</p>
        </div>
    `,
    )
    .join("")

  // Filter main article list
  filterMainArticles(filteredPosts)
}

function highlightText(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi")
  return text.replace(regex, "<strong>$1</strong>")
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function filterMainArticles(filteredPosts) {
  const filteredUrls = new Set(filteredPosts.map((post) => post.url))

  allPosts.forEach((post) => {
    if (filteredUrls.has(post.url)) {
      post.element.style.display = "block"
    } else {
      post.element.style.display = "none"
    }
  })
}

function showAllPosts() {
  allPosts.forEach((post) => {
    post.element.style.display = "block"
  })
}

function hideAllPosts() {
  allPosts.forEach((post) => {
    post.element.style.display = "none"
  })
}

// Close search when clicking outside
document.addEventListener("click", (event) => {
  const searchContainer = document.getElementById("searchContainer")
  const searchButton = event.target.closest('[onclick="toggleSearch()"]')

  if (
    searchContainer &&
    searchContainer.style.display !== "none" &&
    !searchContainer.contains(event.target) &&
    !searchButton
  ) {
    toggleSearch()
  }
})

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + K to open search
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault()
    toggleSearch()
  }

  // Escape to close search
  if (event.key === "Escape") {
    const searchContainer = document.getElementById("searchContainer")
    if (searchContainer && searchContainer.style.display !== "none") {
      toggleSearch()
    }
  }
})
