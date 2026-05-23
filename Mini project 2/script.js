// Global State Management
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('aura_wishlist')) || [];

// Product Database
const defaultProducts = [
  {
    id: 1,
    title: "Tailored Slim-Fit Suit",
    category: "Suits",
    price: 320.00,
    originalPrice: 420.00,
    rating: 4.9,
    reviews: 187,
    color: "charcoal",
    size: "L",
    popularity: 97,
    icon: "🕴️",
    iconBg: "linear-gradient(135deg, #2d2a26 0%, #4a4540 100%)",
    description: "An impeccably tailored slim-fit suit in premium Italian wool-blend. Features a two-button single-breasted jacket, flat-front trousers, and a structured notched lapel — built to command every room."
  },
  {
    id: 2,
    title: "Structured Linen Blazer",
    category: "Clothes",
    price: 135.00,
    rating: 4.7,
    reviews: 214,
    color: "tan",
    size: "M",
    popularity: 91,
    icon: "👔",
    iconBg: "linear-gradient(135deg, #cda885 0%, #e8d5bc 100%)",
    description: "A refined relaxed linen blazer with a deconstructed, unlined interior for breathable warm-weather styling. Pair with wide-leg trousers or smart denim for an effortlessly polished look."
  },
  {
    id: 3,
    title: "Oxford Derby Leather Shoes",
    category: "Shoes",
    price: 210.00,
    originalPrice: 265.00,
    rating: 4.8,
    reviews: 156,
    color: "charcoal",
    size: "10",
    popularity: 94,
    icon: "👞",
    iconBg: "linear-gradient(135deg, #1a1614 0%, #3d322b 100%)",
    description: "Handcrafted from full-grain calf leather, these Oxford derbies feature Goodyear-welt construction for superior durability. Almond toe, leather sole, and a mirror-polish finish."
  },
  {
    id: 4,
    title: "Precision Swiss Timepiece",
    category: "Watches",
    price: 495.00,
    rating: 5.0,
    reviews: 89,
    color: "gold",
    size: "OS",
    popularity: 99,
    icon: "⌚",
    iconBg: "linear-gradient(135deg, #b8860b 0%, #dfa124 100%)",
    description: "Swiss-movement luxury dress watch in a 40mm stainless steel case with a sapphire crystal glass. Features an exhibition caseback, genuine leather strap, and 100M water resistance."
  },
  {
    id: 5,
    title: "Signature Eau de Parfum",
    category: "Perfume",
    price: 95.00,
    rating: 4.8,
    reviews: 302,
    color: "terracotta",
    size: "OS",
    popularity: 96,
    icon: "🧴",
    iconBg: "linear-gradient(135deg, #d46a43 0%, #f0a882 100%)",
    description: "A sophisticated unisex fragrance with warm opening notes of bergamot and mandarin, transitioning to a rich heart of cedarwood, leather, and vetiver. Lasts 10–12 hours."
  },
  {
    id: 6,
    title: "Wide-Brim Wool Fedora Hat",
    category: "Hats",
    price: 75.00,
    originalPrice: 95.00,
    rating: 4.6,
    reviews: 128,
    color: "charcoal",
    size: "OS",
    popularity: 85,
    icon: "🎩",
    iconBg: "linear-gradient(135deg, #2d2a26 0%, #5c5450 100%)",
    description: "A classic wide-brim fedora made from 100% pressed wool felt with a grosgrain ribbon band. Crushable, packable, and season-spanning — the definitive headwear statement piece."
  },
  {
    id: 7,
    title: "Polarized Aviator Sunglasses",
    category: "Sunglasses",
    price: 145.00,
    rating: 4.9,
    reviews: 243,
    color: "gold",
    size: "OS",
    popularity: 98,
    icon: "🕶️",
    iconBg: "linear-gradient(135deg, #4a3b1a 0%, #dfa124 100%)",
    description: "Titanium-framed polarized aviator sunglasses with UV400 protection lenses. Lightweight at just 18g, featuring spring hinges, anti-reflective coating, and a premium leather case."
  },
  {
    id: 8,
    title: "Argan Oil Hair Elixir Set",
    category: "Hair Products",
    price: 68.00,
    rating: 4.7,
    reviews: 375,
    color: "terracotta",
    size: "OS",
    popularity: 90,
    icon: "💆",
    iconBg: "linear-gradient(135deg, #c17f3e 0%, #e8b87a 100%)",
    description: "A premium 3-piece hair care ritual: cold-pressed Moroccan argan oil serum, volumizing shampoo with keratin complex, and a deep-conditioning mask. For all hair types."
  }
];

let products = JSON.parse(localStorage.getItem('aura_admin_products')) || defaultProducts;

if (!localStorage.getItem('aura_admin_products')) {
  localStorage.setItem('aura_admin_products', JSON.stringify(products));
}

function getStoreCategories() {
  const defaultCategories = ['Suits','Clothes','Shoes','Watches','Perfume','Hats','Sunglasses','Hair Products'];
  try {
    const saved = JSON.parse(localStorage.getItem('aura_categories'));
    if (saved && Array.isArray(saved)) {
      return [...new Set([...defaultCategories, ...saved])];
    }
  } catch (e) {}
  return defaultCategories;
}

/* ==========================================
   SEARCH HISTORY & RECOMMENDATION HELPERS
   ========================================== */
function saveSearchHistory(query) {
  if (!query) return;
  try {
    const key = 'aura_search_history';
    const raw = JSON.parse(localStorage.getItem(key)) || [];
    // normalize and dedupe
    const normalized = query.trim().toLowerCase();
    const filtered = raw.filter(q => q !== normalized);
    filtered.unshift(normalized);
    const limited = filtered.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(limited));
  } catch (e) {}
}

function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem('aura_search_history')) || [];
  } catch (e) { return []; }
}

function getLastSearch() {
  const hist = getSearchHistory();
  return hist.length ? hist[0] : null;
}

function renderRecommendedSection() {
  const recommendedGrid = document.getElementById('recommendedGrid');
  const recCount = document.getElementById('recBannerCount');
  if (!recommendedGrid) return;

  const last = getLastSearch();
  let results = [];
  if (last) {
    const q = last.toLowerCase();
    results = products.filter(p => (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    ));
  }

  if (!results.length) {
    // fallback: show most popular items
    results = [...products].sort((a,b) => b.popularity - a.popularity).slice(0,4);
  }

  recCount && (recCount.textContent = results.length);
  recommendedGrid.innerHTML = `
    <div class="rec-scroll">
      ${results.slice(0,6).map(p => `
        <a class="rec-item" href="product-detail.html?id=${p.id}">
          <div class="rec-thumb" style="background:${p.iconBg};">${p.icon}</div>
          <div class="rec-meta"><strong>${p.title}</strong><span>${p.category}</span></div>
        </a>
      `).join('')}
    </div>
  `;
}

function renderDashboardBanners() {
  // Favorites banner preview
  const favPreview = document.getElementById('favPreview');
  const favCountEl = document.getElementById('favBannerCount');
  const sbFavsCount = document.getElementById('sbFavsCount');
  const sbRecCount = document.getElementById('sbRecCount');
  const sbNotifCount = document.getElementById('sbNotifCount');

  const savedProducts = products.filter(p => wishlist.includes(p.id)).slice(0,4);
  const favCount = wishlist.length;
  favCountEl && (favCountEl.textContent = favCount);
  sbFavsCount && (sbFavsCount.textContent = favCount);

  if (favPreview) {
    if (!savedProducts.length) {
      favPreview.innerHTML = `<div class="fav-empty">No favorites yet.</div>`;
    } else {
      favPreview.innerHTML = savedProducts.map(p => `
        <a class="fav-thumb" href="product-detail.html?id=${p.id}">
          ${p.image ? `<img src="${p.image}" alt="${p.title}"/>` : `<div style=\"background:${p.iconBg};\">${p.icon}</div>`}
        </a>
      `).join('');
    }
  }

  // Notifications
  const notifs = JSON.parse(localStorage.getItem('aura_notifications') || '[]');
  const notifCount = Array.isArray(notifs) ? notifs.length : 0;
  const notifList = document.getElementById('notificationsList');
  const notifBannerCount = document.getElementById('notifBannerCount');
  sbNotifCount && (sbNotifCount.textContent = notifCount);
  notifBannerCount && (notifBannerCount.textContent = notifCount);
  if (notifList) {
    if (!notifCount) {
      notifList.innerHTML = `<div class="notif-empty">You're all caught up.</div>`;
    } else {
      notifList.innerHTML = notifs.slice(0,4).map(n => `<div class="notif-item">${n}</div>`).join('');
    }
  }

  // Sidebar recommended count (based on last search or fallback)
  const last = getLastSearch();
  const recEst = last ? products.filter(p => (p.title + p.description + p.category).toLowerCase().includes(last)).length : 0;
  sbRecCount && (sbRecCount.textContent = recEst || products.length);

  // ensure recommended section rendered
  renderRecommendedSection();
}

// Document Ready Initializations
document.addEventListener("DOMContentLoaded", () => {
  initGlobalUI();
  updateBadges();
  renderSidebarCart();
  
  // Route specific script loading
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes("shop.html") || path.endsWith("/shop") || path.endsWith("/shop/")) {
    initShopPage();
    initShopFilterDrawer();
  } else if (path.includes("product-detail.html") || path.includes("/product-detail") || path.includes("/product-detail/")) {
    initDetailPage();
  } else if (path.includes("cart.html") || path.includes("/cart") || path.includes("/cart/")) {
    initCartPage();
  } else if (path.includes("checkout.html") || path.includes("/checkout") || path.includes("/checkout/")) {
    initCheckoutPage();
  } else if (path.includes("profile.html") || path.includes("/profile") || path.includes("/profile/")) {
    initProfilePage();
  } else if (path.includes("contact.html") || path.includes("/contact") || path.includes("/contact/")) {
    initContactPage();
  } else if (path.includes("index.html") || path.endsWith("/") || path.endsWith("/index") || path.endsWith("/index/")) {
    initHomePage();
  }
});

/* ==========================================
   MOBILE SHOP FILTER DRAWER
   ========================================== */
function initShopFilterDrawer() {
  const sidebar      = document.querySelector(".shop-sidebar");
  const toggleBtn    = document.getElementById("mobileFilterBtn");
  const closeBtn     = document.getElementById("filterCloseBtn");
  const backdrop     = document.getElementById("filterBackdrop");

  if (!sidebar || !toggleBtn) return;

  function openDrawer() {
    sidebar.classList.add("mobile-active");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    sidebar.classList.remove("mobile-active");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn)  closeBtn.addEventListener("click",  closeDrawer);
  if (backdrop)  backdrop.addEventListener("click",  closeDrawer);

  // Close drawer when any filter is selected on mobile
  sidebar.addEventListener("click", (e) => {
    const isFilter =
      e.target.matches(".category-filter") ||
      e.target.matches(".color-swatch-filter") ||
      e.target.matches(".size-filter");
    if (isFilter && window.innerWidth <= 1024) {
      setTimeout(closeDrawer, 180); // brief delay so the active state is visible
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}



/* ==========================================
   GLOBAL UTILITIES & NAVIGATION
   ========================================== */
function initGlobalUI() {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".overlay");
  const cartToggle = document.getElementById("cartToggle");
  const closeCart = document.getElementById("closeCart");
  const cartSidebar = document.getElementById("cartSidebar");
  const searchToggle = document.getElementById("searchToggle");
  const closeSearch = document.getElementById("closeSearch");
  const searchOverlay = document.getElementById("searchOverlay");

  // Sticky Navbar Scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }

  // Sidebar Cart Toggle
  if (cartToggle && cartSidebar) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault();
      cartSidebar.classList.add("active");
      overlay.classList.add("active");
    });
  }

  if (closeCart && cartSidebar) {
    closeCart.addEventListener("click", () => {
      cartSidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Search Overlay Toggle
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener("click", (e) => {
      e.preventDefault();
      searchOverlay.classList.add("active");
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  // Overlay Click closes Sidebar
  if (overlay) {
    overlay.addEventListener("click", () => {
      if (cartSidebar) cartSidebar.classList.remove("active");
      if (navMenu) navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Global search input handling
  const globalSearchInput = document.getElementById("globalSearchInput");
  if (globalSearchInput) {
    globalSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = e.target.value.trim();
        if (query) {
          sessionStorage.setItem("search_query", query);
          // persist search history for recommendations
          try { saveSearchHistory(query); } catch (err) {}
          searchOverlay.classList.remove("active");
          window.location.href = "shop.html";
        }
      }
    });
  }
}

// Update badges on the navbar
function updateBadges() {
  const cartBadge = document.getElementById("cartCount");
  const wishlistBadge = document.getElementById("wishlistCount");
  
  if (cartBadge) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalQty;
    cartBadge.style.display = totalQty > 0 ? "flex" : "none";
  }
  
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
    wishlistBadge.style.display = wishlist.length > 0 ? "flex" : "none";
  }
}

// Toast Alert System
function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ==========================================
   CART STATE & SIDEBAR RENDER
   ========================================== */
function addToCart(productId, size, color, quantity = 1, showFeedback = true) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const existingItemIndex = cart.findIndex(item => 
    item.id === productId && item.size === size && item.color === color
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      image: prod.image,
      size: size,
      color: color,
      quantity: quantity
    });
  }

  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateBadges();
  renderSidebarCart();
  
  if (showFeedback) {
    showToast(`Added ${prod.title} to cart`);
    
    // Auto-open sidebar cart for premium micro-experience
    const cartSidebar = document.getElementById("cartSidebar");
    const overlay = document.querySelector(".overlay");
    if (cartSidebar && overlay) {
      cartSidebar.classList.add("active");
      overlay.classList.add("active");
    }
  }
}

function updateCartQuantity(productId, size, color, delta) {
  const idx = cart.findIndex(item => 
    item.id === productId && item.size === size && item.color === color
  );
  
  if (idx > -1) {
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
    
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateBadges();
    renderSidebarCart();
    
    // If we're on the dedicated cart page, refresh it
    if (window.location.pathname.includes("cart.html")) {
      renderCartPageItems();
    }
  }
}

function removeCartItem(productId, size, color) {
  cart = cart.filter(item => 
    !(item.id === productId && item.size === size && item.color === color)
  );
  
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateBadges();
  renderSidebarCart();
  
  if (window.location.pathname.includes("cart.html")) {
    renderCartPageItems();
  }
  showToast("Item removed from cart");
}

function toggleWishlist(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const idx = wishlist.indexOf(productId);
  let isActive = false;
  
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Removed ${prod.title} from wishlist`);
  } else {
    wishlist.push(productId);
    showToast(`Added ${prod.title} to wishlist`);
    isActive = true;
  }

  localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  updateBadges();
  
  // Update heart active classes on cards
  const heartBtns = document.querySelectorAll(`.wishlist-toggle-btn[data-id="${productId}"], .favorite-action-btn[data-id="${productId}"]`);
  heartBtns.forEach(btn => {
    if (isActive) {
      btn.classList.add("active");
      const span = btn.querySelector("span");
      if (span) span.textContent = "Saved";
    } else {
      btn.classList.remove("active");
      const span = btn.querySelector("span");
      if (span) span.textContent = "Favorite";
    }
  });

  // Re-render favorites panel if we are on profile page
  if (document.getElementById("favoritesGrid")) {
    renderFavoritesGrid();
  }
}

function renderFavoritesGrid() {
  const grid = document.getElementById("favoritesGrid");
  const emptyView = document.getElementById("favoritesEmptyView");
  if (!grid) return;

  if (wishlist.length === 0) {
    grid.style.display = "none";
    if (emptyView) emptyView.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  if (emptyView) emptyView.style.display = "none";

  const savedProducts = products.filter(p => wishlist.includes(p.id));
  grid.innerHTML = savedProducts.map(p => buildProductCardHTML(p)).join("");
}

function renderSidebarCart() {
  const cartBody = document.getElementById("sidebarCartItems");
  const cartTotal = document.getElementById("sidebarCartTotal");
  if (!cartBody || !cartTotal) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-message">
        <i class="fas fa-shopping-bag"></i>
        <p>Your shopping cart is empty</p>
      </div>
    `;
    cartTotal.textContent = "Br 0.00";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
    // Look up live product for icon data
    const liveProduct = products.find(p => p.id === item.id);
    let iconHtml = `<div class="cart-sidebar-icon-thumb" style="background:#eee;">📦</div>`;
    if (liveProduct) {
      if (liveProduct.image) {
        iconHtml = `<div class="cart-sidebar-icon-thumb" style="border: 1px solid var(--gray-100); overflow: hidden;"><img src="${liveProduct.image}" style="width:100%; height:100%; object-fit:cover; display:block;" /></div>`;
      } else {
        iconHtml = `<div class="cart-sidebar-icon-thumb" style="background:${liveProduct.iconBg};">${liveProduct.icon}</div>`;
      }
    }
    
    html += `
      <div class="cart-sidebar-item">
        <div class="cart-sidebar-img">
          ${iconHtml}
        </div>
        <div class="cart-sidebar-info">
          <div>
            <h4>${item.title}</h4>
            <p class="cart-sidebar-details">Size: ${item.size} | Color: ${item.color}</p>
          </div>
          <div class="cart-sidebar-qty">
            <div class="qty-pill">
              <button onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', 1)">+</button>
            </div>
            <span class="cart-sidebar-price">Br ${item.price.toFixed(2)}</span>
          </div>
        </div>
        <div class="remove-sidebar-item" onclick="removeCartItem(${item.id}, '${item.size}', '${item.color}')">
          <i class="fas fa-times"></i>
        </div>
      </div>
    `;
  });

  cartBody.innerHTML = html;
  cartTotal.textContent = `Br ${subtotal.toFixed(2)}`;
}

/* ==========================================
   SHARED: PRODUCT CARD HTML BUILDER
   ========================================== */
function buildProductCardHTML(p, showLink = true) {
  const isWishlisted = wishlist.includes(p.id) ? "active" : "";
  const priceHtml = p.originalPrice
    ? `<span class="price-original">Br ${p.originalPrice.toFixed(2)}</span> <span class="price-current">Br ${p.price.toFixed(2)}</span>`
    : `<span class="price-current">Br ${p.price.toFixed(2)}</span>`;
  
  // Use image if present, otherwise fall back to gradient icon panel
  const imgPanel = p.image
    ? `<img src="${p.image}" class="product-card-img" style="width: 100%; height: 100%; object-fit: cover;" alt="${p.title}">`
    : `<div class="product-icon-panel" style="background: ${p.iconBg};">
         <span class="product-icon-emoji">${p.icon}</span>
       </div>`;

  const titleEl = showLink
    ? `<a href="product-detail.html?id=${p.id}">${p.title}</a>`
    : p.title;

  return `
    <div class="product-card">
      <div class="product-img-wrapper">
        ${imgPanel}
        <div class="product-badges">
          ${p.originalPrice ? '<span class="tag-sale">SALE</span>' : ''}
          ${p.popularity > 95 ? '<span class="tag-new">BEST</span>' : ''}
        </div>
        <div class="product-action-bar">
          <button class="quick-add-btn favorite-action-btn ${isWishlisted}" data-id="${p.id}" onclick="toggleWishlist(${p.id}); this.classList.toggle('active');">
            <i class="fas fa-heart"></i>
            <span>${isWishlisted ? 'Saved' : 'Favorite'}</span>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${p.category}</span>
        <h3 class="product-card-title">${titleEl}</h3>
        <div class="product-card-rating">
          ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}
          ${p.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
          <span>(${p.reviews})</span>
        </div>
        <div class="product-card-price">
          ${priceHtml}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================
   PAGE: HOME (index.html)
   ========================================= */
function initHomePage() {
  // Hero Slider
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  let currentSlide = 0;

  if (slides.length > 0) {
    const changeSlide = (n) => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => changeSlide(currentSlide + 1));
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => changeSlide(currentSlide - 1));
    }

    // Auto-advance slide every 7s
    setInterval(() => changeSlide(currentSlide + 1), 7000);
  }

  // Render Featured trending products (rating >= 4.8)
  const trendingGrid = document.getElementById("trendingGrid");
  if (trendingGrid) {
    const trendingProducts = products.filter(p => p.rating >= 4.8);
    trendingGrid.innerHTML = trendingProducts.map(p => buildProductCardHTML(p)).join("");
  }

  // Real-time product synchronization across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'aura_admin_products') {
      products = JSON.parse(e.newValue) || defaultProducts;
      if (trendingGrid) {
        const trendingProducts = products.filter(p => p.rating >= 4.8);
        trendingGrid.innerHTML = trendingProducts.map(p => buildProductCardHTML(p)).join("");
      }
    }
  });

  // Contact form submission simulator
  const homeNewsletterForm = document.getElementById("homeNewsletterForm");
  if (homeNewsletterForm) {
    homeNewsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = homeNewsletterForm.querySelector("input[type='email']");
      if (emailInput.value.trim()) {
        showToast(`Thank you! Subscription confirmed for ${emailInput.value.trim()}`);
        emailInput.value = "";
      }
    });
  }
}

/* ==========================================
   PAGE: SHOP (shop.html)
   ========================================== */
function initShopPage() {
  const shopGrid = document.getElementById("shopGrid");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const searchInput = document.getElementById("shopSearch");
  const sortSelect = document.getElementById("shopSort");
  const colorSwatches = document.querySelectorAll(".color-swatch-filter");
  const sizePills = document.querySelectorAll(".size-filter");
  const productsCountEl = document.getElementById("productsCount");
  
  // Filter States
  let activeCategory = "All";
  let activeColor = "All";
  let activeSize = "All";
  let maxPrice = 600;
  let searchQuery = (sessionStorage.getItem("search_query") || "").trim();
  let currentSort = "popularity";

  // Dynamic Shop Categories rendering
  function renderShopCategories() {
    const filterList = document.querySelector(".filter-links-list");
    if (!filterList) return;
    const cats = getStoreCategories();
    const emojiMap = {
      'Suits': '🕴️',
      'Clothes': '👔',
      'Shoes': '👞',
      'Watches': '⌚',
      'Perfume': '🧴',
      'Hats': '🎩',
      'Sunglasses': '🕶️',
      'Hair Products': '💆'
    };
    let html = `<li class="filter-link-item category-filter${activeCategory === 'All' ? ' active' : ''}" data-cat="All">All Items</li>`;
    cats.forEach(c => {
      const emoji = emojiMap[c] || '✨';
      const activeClass = activeCategory === c ? ' active' : '';
      html += `<li class="filter-link-item category-filter${activeClass}" data-cat="${c}">${emoji} ${c}</li>`;
    });
    filterList.innerHTML = html;

    // Re-bind click events since elements are recreated
    const newCategoryFilters = document.querySelectorAll(".category-filter");
    newCategoryFilters.forEach(btn => {
      btn.addEventListener("click", () => {
        newCategoryFilters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-cat");
        applyFilters();
      });
    });
  }

  // Initial render of categories
  renderShopCategories();

  // Pre-fill search if came from navbar search overlay
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    sessionStorage.removeItem("search_query");
  }

  // Real-time synchronization across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'aura_admin_products') {
      products = JSON.parse(e.newValue) || defaultProducts;
      applyFilters();
    } else if (e.key === 'aura_categories') {
      renderShopCategories();
      applyFilters();
    }
  });

  // Update Range dynamic label
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", (e) => {
      maxPrice = parseFloat(e.target.value);
      priceValue.textContent = `Br ${maxPrice}`;
      applyFilters();
    });
  }

  // Search Input listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      applyFilters();
    });
  }

  // Sorting Selector
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }

  // Colors Selector
  colorSwatches.forEach(sw => {
    sw.addEventListener("click", () => {
      colorSwatches.forEach(s => s.classList.remove("active"));
      sw.classList.add("active");
      activeColor = sw.getAttribute("data-color");
      applyFilters();
    });
  });

  // Sizes Selector
  sizePills.forEach(pill => {
    pill.addEventListener("click", () => {
      sizePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeSize = pill.getAttribute("data-size");
      applyFilters();
    });
  });

  function applyFilters() {
    let filtered = products.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchColor = activeColor === "All" || p.color === activeColor;
      const matchSize = activeSize === "All" || p.size === activeSize || p.size === "OS";
      const matchPrice = p.price <= maxPrice;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchColor && matchSize && matchPrice && matchSearch;
    });

    // Sorting operations
    if (currentSort === "popularity") {
      filtered.sort((a, b) => b.popularity - a.popularity);
    } else if (currentSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    renderShopGrid(filtered);
  }

  function renderShopGrid(items) {
    if (productsCountEl) {
      productsCountEl.textContent = items.length;
    }
    if (!shopGrid) return;

    if (items.length === 0) {
      shopGrid.innerHTML = `
        <div class="cart-empty-message" style="grid-column: 1 / -1; padding: 4rem 0;">
          <i class="fas fa-search"></i>
          <p>No products found matching your active filter choices</p>
        </div>
      `;
      return;
    }

    shopGrid.innerHTML = items.map(p => buildProductCardHTML(p)).join("");
  }

  // Initial call
  applyFilters();
}

/* ==========================================
   PAGE: PRODUCT DETAIL (product-detail.html)
   ========================================== */
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id")) || 1;
  const prod = products.find(p => p.id === id) || products[0];

  // Dynamic values binding
  document.getElementById("detailTitle").textContent = prod.title;
  document.getElementById("detailCategory").textContent = prod.category;
  document.getElementById("detailSnippet").textContent = prod.description;
  document.getElementById("detailPrice").textContent = `Br ${prod.price.toFixed(2)}`;
  
  const ratingStars = document.getElementById("detailStars");
  if (ratingStars) {
    ratingStars.innerHTML = `
      ${'<i class="fas fa-star"></i>'.repeat(Math.floor(prod.rating))}
      ${prod.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
    `;
  }
  document.getElementById("detailReviewsNum").textContent = `(${prod.reviews} customer reviews)`;

  // Main icon panel + thumbs for detail gallery
  const mainIconWrap = document.getElementById("detailMainIconWrap");
  const thumbsContainer = document.getElementById("detailThumbs");

  if (mainIconWrap) {
    if (prod.image) {
      mainIconWrap.style.background = "none";
      mainIconWrap.innerHTML = `<img src="${prod.image}" class="detail-main-img" style="width:100%; height:100%; object-fit:cover; display:block; border-radius:12px;" />`;
    } else {
      mainIconWrap.style.background = prod.iconBg;
      mainIconWrap.innerHTML = `
        <div class="detail-icon-panel-wrap" style="height:100%; display:flex; align-items:center; justify-content:center;">
          <span class="detail-main-emoji" style="font-size:8rem;">${prod.icon}</span>
        </div>
      `;
    }
  }

  // Three tinted variant thumbnails
  const thumbTints = [
    { filter: "none", label: "View 1" },
    { filter: "brightness(0.75) saturate(1.3)", label: "View 2" },
    { filter: "saturate(0.3) brightness(1.1)", label: "View 3" }
  ];

  if (thumbsContainer) {
    if (prod.image) {
      thumbsContainer.innerHTML = thumbTints.map((t, i) => `
        <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="swapDetailThumb(${JSON.stringify(t.filter)}, '', this)">
          <div class="thumb-icon-panel" style="filter: ${t.filter}; background: none; border: 1px solid var(--gray-100); overflow: hidden; height:100%; width:100%;">
            <img src="${prod.image}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>
      `).join("");
    } else {
      thumbsContainer.innerHTML = thumbTints.map((t, i) => `
        <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="swapDetailThumb(${JSON.stringify(t.filter)}, '${prod.iconBg}', this)">
          <div class="thumb-icon-panel" style="background: ${prod.iconBg}; filter: ${t.filter};">
            <span>${prod.icon}</span>
          </div>
        </div>
      `).join("");
    }
  }

  // Size selections
  const sizePills = document.querySelectorAll(".size-pill-detail");
  let selectedSize = prod.size;
  
  sizePills.forEach(pill => {
    pill.addEventListener("click", () => {
      sizePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedSize = pill.getAttribute("data-size");
      document.getElementById("selectedSizeVal").textContent = selectedSize;
    });
  });

  // Color selections
  const swatchPills = document.querySelectorAll(".swatch-detail");
  let selectedColor = prod.color;

  swatchPills.forEach(pill => {
    pill.addEventListener("click", () => {
      swatchPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedColor = pill.getAttribute("data-color");
      document.getElementById("selectedColorVal").textContent = selectedColor.toUpperCase();
    });
  });

  // Details Tab Controls
  const tabItems = document.querySelectorAll(".tab-nav-item");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabItems.forEach(item => {
    item.addEventListener("click", () => {
      tabItems.forEach(i => i.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      item.classList.add("active");
      const targetPaneId = item.getAttribute("data-tab");
      document.getElementById(targetPaneId).classList.add("active");
    });
  });

  // Primary CTA click action - Favorites conversion
  const favBtn = document.getElementById("detailAddToFavorites");
  if (favBtn) {
    // Initial state set
    const isSaved = wishlist.includes(prod.id);
    if (isSaved) {
      favBtn.classList.add("active");
      favBtn.innerHTML = `SAVED TO FAVORITES <i class="fa-solid fa-heart"></i>`;
    } else {
      favBtn.classList.remove("active");
      favBtn.innerHTML = `ADD TO FAVORITES <i class="fa-solid fa-heart"></i>`;
    }

    favBtn.onclick = () => {
      toggleWishlist(prod.id);
      const nowSaved = wishlist.includes(prod.id);
      if (nowSaved) {
        favBtn.classList.add("active");
        favBtn.innerHTML = `SAVED TO FAVORITES <i class="fa-solid fa-heart"></i>`;
      } else {
        favBtn.classList.remove("active");
        favBtn.innerHTML = `ADD TO FAVORITES <i class="fa-solid fa-heart"></i>`;
      }
    };
  }

  // Related Grid mapping
  const relatedGrid = document.getElementById("relatedGrid");
  if (relatedGrid) {
    const relatedList = products.filter(p => p.id !== prod.id).slice(0, 3);
    relatedGrid.innerHTML = relatedList.map(p => buildProductCardHTML(p)).join("");
  }
}

// Detail gallery thumb swap (icon-based)
window.swapDetailThumb = function(filterVal, iconBg, element) {
  const mainIconWrap = document.getElementById("detailMainIconWrap");
  const thumbs = document.querySelectorAll(".thumb-item");

  if (mainIconWrap) {
    mainIconWrap.style.filter = filterVal;
  }

  thumbs.forEach(t => t.classList.remove("active"));
  element.classList.add("active");
};

/* ==========================================
   PAGE: SHOPPING CART (cart.html)
   ========================================== */
function initCartPage() {
  renderCartPageItems();

  // Coupon promo simulator
  const applyPromoBtn = document.getElementById("applyPromoBtn");
  const promoInput = document.getElementById("promoInput");
  
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === "AURA10" || code === "WELCOME20") {
        const pct = code === "AURA10" ? 10 : 20;
        sessionStorage.setItem("active_promo", code);
        sessionStorage.setItem("active_promo_pct", pct);
        promoInput.value = "";
        renderCartPageItems();
        showToast(`Promo code ${code} applied successfully!`, "success");
      } else {
        showToast("Invalid promotional code.", "info");
      }
    });
  }
}

window.removePromoCode = function() {
  sessionStorage.removeItem("active_promo");
  sessionStorage.removeItem("active_promo_pct");
  renderCartPageItems();
  showToast("Promotional code removed.");
};

function renderCartPageItems() {
  const tableBody = document.getElementById("cartPageTableBody");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryShipping = document.getElementById("summaryShipping");
  const summaryTax = document.getElementById("summaryTax");
  const summaryTotal = document.getElementById("summaryTotal");
  const goalProgress = document.getElementById("shippingGoalProgress");
  const goalText = document.getElementById("shippingGoalText");
  const summaryDiscountRow = document.getElementById("summaryDiscountRow");
  const summaryDiscountVal = document.getElementById("summaryDiscountVal");
  const promoBadge = document.getElementById("promoAppliedBadge");

  if (!tableBody) return;

  if (cart.length === 0) {
    document.getElementById("cartLayout").style.display = "none";
    document.getElementById("cartEmptyView").style.display = "block";
    return;
  }

  document.getElementById("cartLayout").style.display = "grid";
  document.getElementById("cartEmptyView").style.display = "none";

  let html = "";
  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
    
    const liveProduct = products.find(p => p.id === item.id);
    const imgHtml = (liveProduct && liveProduct.image)
      ? `<img src="${liveProduct.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; display:block;">`
      : (liveProduct && liveProduct.icon)
        ? `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:${liveProduct.iconBg}; font-size:1.8rem; border-radius:8px;">${liveProduct.icon}</div>`
        : `<img src="${item.image || 'assets/placeholder.jpg'}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; display:block;">`;

    html += `
      <div class="cart-table-row">
        <div class="cart-table-item">
          <div class="cart-table-img" style="border: 1px solid var(--gray-100); overflow: hidden; border-radius: 8px;">
            ${imgHtml}
          </div>
          <div class="cart-table-info">
            <h4>${item.title}</h4>
            <span>Size: ${item.size}</span>
            <span>Color: ${item.color}</span>
          </div>
        </div>
        <div class="cart-price-col">Br ${item.price.toFixed(2)}</div>
        <div class="cart-qty-col">
          <div class="qty-pill">
            <button onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', 1)">+</button>
          </div>
        </div>
        <div class="cart-subtotal-col">Br ${itemSubtotal.toFixed(2)}</div>
        <div class="cart-remove-col" onclick="removeCartItem(${item.id}, '${item.size}', '${item.color}')">
          <i class="fas fa-trash-alt"></i>
        </div>
      </div>
    `;
  });

  tableBody.innerHTML = html;

  // Shipping progress math (Free shipping over Br 150)
  const freeShippingThreshold = 150.00;
  let shippingCost = 15.00;
  
  if (subtotal >= freeShippingThreshold) {
    shippingCost = 0;
    if (goalProgress) goalProgress.style.width = "100%";
    if (goalText) goalText.innerHTML = "Congratulations! You have unlocked <span>FREE SHIPPING</span>";
  } else {
    const needed = freeShippingThreshold - subtotal;
    const pct = (subtotal / freeShippingThreshold) * 100;
    if (goalProgress) goalProgress.style.width = `${pct}%`;
    if (goalText) goalText.innerHTML = `Spend <span>Br ${needed.toFixed(2)}</span> more to unlock <span>FREE SHIPPING</span>`;
  }

  // Promo code calculation
  const promoCode = sessionStorage.getItem("active_promo");
  const promoPct = parseFloat(sessionStorage.getItem("active_promo_pct")) || 0;
  let discount = 0;

  if (promoCode && promoPct > 0) {
    discount = subtotal * (promoPct / 100);
    if (summaryDiscountRow && summaryDiscountVal) {
      summaryDiscountRow.style.display = "flex";
      summaryDiscountVal.textContent = `-Br ${discount.toFixed(2)}`;
    }
    if (promoBadge) {
      promoBadge.style.display = "flex";
      promoBadge.innerHTML = `
        <span>Code <strong>${promoCode}</strong> applied (-${promoPct}%)</span>
        <i class="fas fa-times" onclick="removePromoCode()"></i>
      `;
    }
  } else {
    if (summaryDiscountRow) summaryDiscountRow.style.display = "none";
    if (promoBadge) promoBadge.style.display = "none";
  }

  const baseTaxRate = 0.08; // 8% sales tax
  const tax = (subtotal - discount) * baseTaxRate;
  const netTotal = subtotal - discount + shippingCost + tax;

  if (summarySubtotal) summarySubtotal.textContent = `Br ${subtotal.toFixed(2)}`;
  if (summaryShipping) summaryShipping.textContent = shippingCost === 0 ? "FREE" : `Br ${shippingCost.toFixed(2)}`;
  if (summaryTax) summaryTax.textContent = `Br ${tax.toFixed(2)}`;
  if (summaryTotal) summaryTotal.textContent = `Br ${netTotal.toFixed(2)}`;
  
  // Store values for Checkout Page to pull later
  localStorage.setItem("checkout_subtotal", subtotal);
  localStorage.setItem("checkout_discount", discount);
  localStorage.setItem("checkout_shipping", shippingCost);
  localStorage.setItem("checkout_tax", tax);
  localStorage.setItem("checkout_total", netTotal);
}

/* ==========================================
   PAGE: CHECKOUT PAYMENTS (checkout.html)
   ========================================== */
function initCheckoutPage() {
  const steps = document.querySelectorAll(".step-node");
  const panes = document.querySelectorAll(".checkout-pane");
  const summaryItemsContainer = document.getElementById("checkoutSummaryItems");

  const subtotal = parseFloat(localStorage.getItem("checkout_subtotal")) || 0;
  const discount = parseFloat(localStorage.getItem("checkout_discount")) || 0;
  const shipping = parseFloat(localStorage.getItem("checkout_shipping")) || 0;
  const tax = parseFloat(localStorage.getItem("checkout_tax")) || 0;
  const total = parseFloat(localStorage.getItem("checkout_total")) || 0;

  // Bind values in the right pane order summary
  document.getElementById("checkoutSubtotal").textContent = `Br ${subtotal.toFixed(2)}`;
  if (discount > 0) {
    document.getElementById("checkoutDiscountRow").style.display = "flex";
    document.getElementById("checkoutDiscount").textContent = `-Br ${discount.toFixed(2)}`;
  }
  document.getElementById("checkoutShipping").textContent = shipping === 0 ? "FREE" : `Br ${shipping.toFixed(2)}`;
  document.getElementById("checkoutTax").textContent = `Br ${tax.toFixed(2)}`;
  document.getElementById("checkoutTotal").textContent = `Br ${total.toFixed(2)}`;

  // Bind items preview list
  if (summaryItemsContainer) {
    let html = "";
    cart.forEach(item => {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; padding-bottom:1rem; border-bottom:1px solid var(--gray-100);">
          <div>
            <strong>${item.title}</strong> x ${item.quantity}
            <span style="display:block; color:var(--gray-500); font-size:0.75rem;">Size: ${item.size} | Color: ${item.color}</span>
          </div>
          <span>Br ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `;
    });
    summaryItemsContainer.innerHTML = html;
  }

  // Multi-step buttons click logic
  window.goToStep = function(stepNum) {
    steps.forEach((node, idx) => {
      node.classList.remove("active");
      if (idx < stepNum - 1) node.classList.add("complete");
      else node.classList.remove("complete");
      
      if (idx === stepNum - 1) node.classList.add("active");
    });

    panes.forEach(pane => pane.classList.remove("active"));
    panes[stepNum - 1].classList.add("active");

    // Scroll to top of layout smooth
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // Card flipping simulator triggers
  const ccCard = document.getElementById("ccCard");
  const ccNumberInput = document.getElementById("ccNumberInput");
  const ccNameInput = document.getElementById("ccNameInput");
  const ccExpiryInput = document.getElementById("ccExpiryInput");
  const ccCvvInput = document.getElementById("ccCvvInput");

  if (ccNumberInput) {
    ccNumberInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = val.match(/\d{4,16}/g);
      let match = (matches && matches[0]) || '';
      let parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        e.target.value = parts.join(' ');
      } else {
        e.target.value = val;
      }
      
      // Update front CC label
      document.getElementById("ccDisplayNum").textContent = e.target.value || "•••• •••• •••• ••••";
    });
  }

  if (ccNameInput) {
    ccNameInput.addEventListener("input", (e) => {
      document.getElementById("ccDisplayName").textContent = e.target.value.toUpperCase() || "CARDHOLDER NAME";
    });
  }

  if (ccExpiryInput) {
    ccExpiryInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
      } else {
        e.target.value = val;
      }
      document.getElementById("ccDisplayExpiry").textContent = e.target.value || "MM/YY";
    });
  }

  if (ccCvvInput) {
    // Focus triggers 3D Card flip to back
    ccCvvInput.addEventListener("focus", () => {
      ccCard.classList.add("flipped");
    });
    ccCvvInput.addEventListener("blur", () => {
      ccCard.classList.remove("flipped");
    });
    ccCvvInput.addEventListener("input", (e) => {
      document.getElementById("ccDisplayCvv").textContent = e.target.value || "•••";
    });
  }

  // Shipping Method selection radio toggle style
  const methodOptions = document.querySelectorAll(".shipping-option-card");
  methodOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      methodOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      const radio = opt.querySelector("input[type='radio']");
      if (radio) {
        radio.checked = true;
        // Update shipping fees in real-time
        const cost = parseFloat(radio.getAttribute("data-cost"));
        localStorage.setItem("checkout_shipping", cost);
        
        // Recalculate net total
        const newTotal = subtotal - discount + cost + tax;
        localStorage.setItem("checkout_total", newTotal);
        
        document.getElementById("checkoutShipping").textContent = cost === 0 ? "FREE" : `Br ${cost.toFixed(2)}`;
        document.getElementById("checkoutTotal").textContent = `Br ${newTotal.toFixed(2)}`;
      }
    });
  });

  // Finish checkout simulator submission
  const paymentForm = document.getElementById("checkoutPaymentForm");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = document.getElementById("billingEmail").value || "customer@aurawear.com";
      const totalPoints = Math.floor(total);

      // Transition to final success printable receipt
      document.getElementById("receiptEmail").textContent = email;
      document.getElementById("receiptOrderNo").textContent = `#AU-${Math.floor(100000 + Math.random() * 900000)}`;
      document.getElementById("receiptTotal").textContent = `Br ${total.toFixed(2)}`;
      document.getElementById("receiptPointsGained").textContent = `+${totalPoints} Aura Points`;

      // Hide summary pane columns
      document.getElementById("checkoutStepsPane").style.display = "none";
      document.getElementById("checkoutSummaryColumn").style.display = "none";
      document.getElementById("receiptPane").style.display = "block";

      // Clear local storage cart state
      cart = [];
      localStorage.setItem("aura_cart", JSON.stringify(cart));
      updateBadges();

      showToast("Order completed successfully!", "success");
    });
  }
}

/* ==========================================
   PAGE: USER CUSTOMER DASHBOARD (profile.html)
   ========================================= */
function initProfilePage() {
  const profileMenuLinks = document.querySelectorAll(".profile-menu-item");
  const profilePanes = document.querySelectorAll(".profile-pane");

  profileMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
      profileMenuLinks.forEach(l => l.classList.remove("active"));
      profilePanes.forEach(p => p.classList.remove("active"));

      link.classList.add("active");
      const targetPaneId = link.getAttribute("data-pane");
      document.getElementById(targetPaneId).classList.add("active");
    });
  });
}

/* ==========================================
   PAGE: BRAND SUPPORT CENTER (contact.html)
   ========================================= */
function initContactPage() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Your support message has been sent successfully!", "success");
      contactForm.reset();
    });
  }
}

/* ============================================================
   USER AUTH SYSTEM  (auth.html + profile.html + all navbars)
   ============================================================ */

// ── Helpers ──────────────────────────────────────────────────
function getAuthUser() {
  try { return JSON.parse(localStorage.getItem('aura_user')) || null; }
  catch { return null; }
}

function setAuthUser(userData) {
  localStorage.setItem('aura_user', JSON.stringify(userData));
}

function clearAuthUser() {
  localStorage.removeItem('aura_user');
}

// Retrieve all registered users (array)
function getRegisteredUsers() {
  try { return JSON.parse(localStorage.getItem('aura_users')) || []; }
  catch { return []; }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('aura_users', JSON.stringify(users));
}

// Show auth toast (used on auth.html)
function showAuthToast(msg, type = 'info') {
  const el = document.getElementById('authToast');
  if (!el) return;
  el.textContent = msg;
  el.className = `auth-toast show ${type}`;
  setTimeout(() => el.className = 'auth-toast', 3200);
}

// ── Tab switching ─────────────────────────────────────────────
function switchAuthTab(tab) {
  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabLogin   = document.getElementById('tabLogin');
  const tabSignup  = document.getElementById('tabSignup');
  const slider     = document.getElementById('authTabSlider');
  if (!loginForm) return;

  if (tab === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    slider.classList.remove('right');
  } else {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    slider.classList.add('right');
  }
}

// ── Password visibility toggle ────────────────────────────────
function togglePasswordVis(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.querySelector('i').className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    btn.querySelector('i').className = 'fa-solid fa-eye';
  }
}

// ── Password strength meter ───────────────────────────────────
function calcPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

function updateStrengthMeter(pw) {
  const score     = calcPasswordStrength(pw);
  const bars      = [document.getElementById('sb1'), document.getElementById('sb2'),
                     document.getElementById('sb3'), document.getElementById('sb4')];
  const label     = document.getElementById('strengthLabel');
  if (!label) return;

  const levels = ['', 'weak', 'fair', 'good', 'strong'];
  const names  = ['Enter a password', 'Too weak', 'Fair', 'Good', 'Strong 🔒'];

  bars.forEach((b, i) => {
    b.className = 'strength-bar';
    if (i < score) b.classList.add(levels[score]);
  });
  label.textContent = names[score];
  label.style.color = ['#aaa','#e53e3e','#d69e2e','#3182ce','var(--success)'][score];
}

// ── Field error helpers ───────────────────────────────────────
function setFieldError(groupId, errId, msg) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errId);
  if (group) group.classList.toggle('has-error', !!msg);
  if (err)   err.textContent = msg || '';
}

function clearAllErrors(fields) {
  fields.forEach(([g, e]) => setFieldError(g, e, ''));
}

// ── Forgot password toast ─────────────────────────────────────
function showForgotToast(e) {
  e.preventDefault();
  showAuthToast('Password reset link sent! Check your inbox.', 'info');
}

// ── Simulate async delay ──────────────────────────────────────
function fakeDelay(ms = 700) {
  return new Promise(res => setTimeout(res, ms));
}

function setSubmitLoading(btnId, loading) {
  const btn    = document.getElementById(btnId);
  if (!btn) return;
  const text   = btn.querySelector('.auth-btn-text');
  const loader = btn.querySelector('.auth-btn-loader');
  btn.disabled = loading;
  if (text)   text.style.display  = loading ? 'none' : 'flex';
  if (loader) loader.style.display = loading ? 'flex' : 'none';
}

// ── LOGIN handler ─────────────────────────────────────────────
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // Wire password strength to signup field
  const signupPassInput = document.getElementById('signupPass');
  if (signupPassInput) {
    signupPassInput.addEventListener('input', () => updateStrengthMeter(signupPassInput.value));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass  = document.getElementById('loginPass').value;

    clearAllErrors([
      ['loginEmailGroup','loginEmailErr'],
      ['loginPassGroup','loginPassErr']
    ]);

    let valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('loginEmailGroup','loginEmailErr','Please enter a valid email address.');
      valid = false;
    }
    if (!pass) {
      setFieldError('loginPassGroup','loginPassErr','Password is required.');
      valid = false;
    }
    if (!valid) return;

    setSubmitLoading('loginSubmitBtn', true);
    await fakeDelay();

    const users = getRegisteredUsers();
    const match = users.find(u => u.email === email && u.password === pass);

    setSubmitLoading('loginSubmitBtn', false);

    if (!match) {
      setFieldError('loginPassGroup','loginPassErr','Incorrect email or password.');
      showAuthToast('Login failed. Please check your credentials.', 'error');
      return;
    }

    // Remember me: if unchecked, use sessionStorage flag so it clears on browser close
    const remember = document.getElementById('rememberMe')?.checked;
    setAuthUser({ firstName: match.firstName, lastName: match.lastName, email: match.email, joinDate: match.joinDate });
    if (!remember) sessionStorage.setItem('aura_session_only', '1');

    showAuthToast(`Welcome back, ${match.firstName}! 🎉`, 'success');
    setTimeout(() => { window.location.href = 'profile.html'; }, 1000);
  });
}

// ── SIGNUP handler ────────────────────────────────────────────
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const first   = document.getElementById('signupFirst').value.trim();
    const last    = document.getElementById('signupLast').value.trim();
    const email   = document.getElementById('signupEmail').value.trim().toLowerCase();
    const pass    = document.getElementById('signupPass').value;
    const confirm = document.getElementById('signupConfirm').value;
    const terms   = document.getElementById('signupTerms').checked;

    clearAllErrors([
      ['signupFirstGroup','signupFirstErr'],
      ['signupLastGroup','signupLastErr'],
      ['signupEmailGroup','signupEmailErr'],
      ['signupPassGroup','signupPassErr'],
      ['signupConfirmGroup','signupConfirmErr'],
      ['signupTermsGroup','signupTermsErr']
    ]);

    let valid = true;
    if (!first) { setFieldError('signupFirstGroup','signupFirstErr','First name is required.'); valid = false; }
    if (!last)  { setFieldError('signupLastGroup','signupLastErr','Last name is required.');   valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('signupEmailGroup','signupEmailErr','Please enter a valid email address.'); valid = false;
    }
    if (pass.length < 6) { setFieldError('signupPassGroup','signupPassErr','Password must be at least 6 characters.'); valid = false; }
    if (pass !== confirm) { setFieldError('signupConfirmGroup','signupConfirmErr','Passwords do not match.'); valid = false; }
    if (!terms) { setFieldError('signupTermsGroup','signupTermsErr','You must agree to the terms to continue.'); valid = false; }
    if (!valid) return;

    setSubmitLoading('signupSubmitBtn', true);
    await fakeDelay(900);

    // Check for existing account
    const users = getRegisteredUsers();
    if (users.find(u => u.email === email)) {
      setSubmitLoading('signupSubmitBtn', false);
      setFieldError('signupEmailGroup','signupEmailErr','An account with this email already exists.');
      showAuthToast('Email already registered. Please sign in.', 'error');
      return;
    }

    const newUser = {
      firstName: first,
      lastName:  last,
      email,
      password:  pass,
      joinDate:  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    users.push(newUser);
    saveRegisteredUsers(users);
    setAuthUser({ firstName: first, lastName: last, email, joinDate: newUser.joinDate });

    setSubmitLoading('signupSubmitBtn', false);
    showAuthToast(`Account created! Welcome to AURA WEAR, ${first}! ✨`, 'success');
    setTimeout(() => { window.location.href = 'profile.html'; }, 1200);
  });
}

// ── Navbar: update user icon dynamically ──────────────────────
function syncNavbarUserState() {
  const user    = getAuthUser();
  const userBtns = document.querySelectorAll('.navbar-user-btn');

  userBtns.forEach(btn => {
    if (user) {
      btn.href  = 'profile.html';
      btn.title = `${user.firstName} ${user.lastName}`;
    } else {
      btn.href  = 'auth.html';
      btn.title = 'Sign In';
    }
  });
}

// ── Profile page: gate + populate ────────────────────────────
function initProfilePage() {
  const profileMenuLinks = document.querySelectorAll(".profile-menu-item");
  const profilePanes     = document.querySelectorAll(".profile-pane");

  // Tab switching
  profileMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
      profileMenuLinks.forEach(l => l.classList.remove("active"));
      profilePanes.forEach(p => p.classList.remove("active"));
      link.classList.add("active");
      document.getElementById(link.getAttribute("data-pane")).classList.add("active");
    });
  });

  const user = getAuthUser();
  const gate = document.getElementById('profileGate');

  if (!user) {
    // Show the gate overlay — user must log in
    if (gate) gate.classList.add('active');
    return;
  }

  // Hide gate, show content
  if (gate) gate.classList.remove('active');

  // Populate greeting bar
  const greeting = document.getElementById('profileGreeting');
  if (greeting) {
    const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
    greeting.innerHTML = `
      <div class="profile-user-greeting">
        <div class="greeting-avatar">${initials}</div>
        <div class="greeting-text">
          <h3>Welcome back, ${user.firstName}!</h3>
          <p>${user.email} &nbsp;·&nbsp; Member since ${user.joinDate}</p>
        </div>
        <button class="profile-logout-btn" onclick="logoutUser()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
        </button>
      </div>`;
  }

  // Populate sidebar avatar & name
  const avatarEl = document.querySelector('.profile-avatar-circle');
  const nameEl   = document.querySelector('.profile-nav-header h3');
  const subEl    = document.querySelector('.profile-nav-header p');
  if (avatarEl) avatarEl.textContent = (user.firstName[0] + user.lastName[0]).toUpperCase();
  if (nameEl)   nameEl.textContent   = `${user.firstName} ${user.lastName}`;
  if (subEl)    subEl.textContent    = `Member since ${user.joinDate}`;

  // Welcome heading
  const welcomeH = document.getElementById('profileWelcomeHeading');
  if (welcomeH) welcomeH.textContent = `WELCOME BACK, ${user.firstName.toUpperCase()}`;

  // Render favorites grid
  renderFavoritesGrid();
  // Render dashboard banners & recommended items
  renderDashboardBanners();

  // Sidebar banner quick actions
  const sbFavs = document.getElementById('sbFavs');
  const sbRec = document.getElementById('sbRec');
  const sbNotif = document.getElementById('sbNotif');
  if (sbFavs) sbFavs.addEventListener('click', () => {
    document.querySelectorAll('.profile-menu-item').forEach(i => i.classList.remove('active'));
    const favBtn = document.querySelector('.profile-menu-item[data-pane="paneFavorites"]');
    if (favBtn) { favBtn.classList.add('active'); document.getElementById('paneFavorites').classList.add('active'); }
  });
  if (sbRec) sbRec.addEventListener('click', () => {
    // ensure dashboard pane visible then scroll to recommended
    document.querySelectorAll('.profile-menu-item').forEach(i => i.classList.remove('active'));
    const dashBtn = document.querySelector('.profile-menu-item[data-pane="paneDashboard"]');
    if (dashBtn) { dashBtn.classList.add('active'); document.getElementById('paneDashboard').classList.add('active'); }
    setTimeout(() => { document.getElementById('recommendedGrid')?.scrollIntoView({behavior:'smooth', block:'center'}); }, 250);
  });
  if (sbNotif) sbNotif.addEventListener('click', () => {
    document.querySelectorAll('.profile-menu-item').forEach(i => i.classList.remove('active'));
    const dashBtn = document.querySelector('.profile-menu-item[data-pane="paneDashboard"]');
    if (dashBtn) { dashBtn.classList.add('active'); document.getElementById('paneDashboard').classList.add('active'); }
    setTimeout(() => { document.getElementById('notificationsList')?.scrollIntoView({behavior:'smooth', block:'center'}); }, 250);
  });

  // Activate pane from URL hash if present (e.g. profile.html#paneFavorites)
  const hash = window.location.hash;
  if (hash) {
    const paneId = hash.replace('#', '');
    const targetPane = document.getElementById(paneId);
    if (targetPane) {
      profileMenuLinks.forEach(l => l.classList.remove('active'));
      profilePanes.forEach(p => p.classList.remove('active'));
      const menuItem = document.querySelector(`.profile-menu-item[data-pane="${paneId}"]`);
      if (menuItem) menuItem.classList.add('active');
      targetPane.classList.add('active');
      setTimeout(() => { targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
    }
  }

  // ── Account Settings Form handler ─────────────────────────────
  const accForm = document.getElementById("accountSettingsForm");
  if (accForm) {
    const accFirst = document.getElementById("accFirst");
    const accLast = document.getElementById("accLast");
    const accEmail = document.getElementById("accEmail");
    const accPass = document.getElementById("accPass");

    // Populate current values
    if (accFirst) accFirst.value = user.firstName;
    if (accLast) accLast.value = user.lastName;
    if (accEmail) accEmail.value = user.email;

    accForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const first = accFirst.value.trim();
      const last = accLast.value.trim();
      const email = accEmail.value.trim().toLowerCase();
      const pass = accPass.value;

      // Clear previous validation errors
      clearAllErrors([
        ['accFirstGroup', 'accFirstErr'],
        ['accLastGroup', 'accLastErr'],
        ['accEmailGroup', 'accEmailErr'],
        ['accPassGroup', 'accPassErr']
      ]);

      let valid = true;
      if (!first) { setFieldError('accFirstGroup', 'accFirstErr', 'First name is required.'); valid = false; }
      if (!last) { setFieldError('accLastGroup', 'accLastErr', 'Last name is required.'); valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError('accEmailGroup', 'accEmailErr', 'Please enter a valid email address.');
        valid = false;
      }
      if (pass && pass.length < 6) {
        setFieldError('accPassGroup', 'accPassErr', 'Password must be at least 6 characters.');
        valid = false;
      }

      if (!valid) return;

      setSubmitLoading('accSubmitBtn', true);
      await fakeDelay(600); // Premium simulated saving experience

      // Update users database
      const users = getRegisteredUsers();
      const userIndex = users.findIndex(u => u.email === user.email);
      
      // Check if new email is already taken by someone else
      if (email !== user.email && users.find(u => u.email === email)) {
        setSubmitLoading('accSubmitBtn', false);
        setFieldError('accEmailGroup', 'accEmailErr', 'An account with this email already exists.');
        showToast('Email address is already registered.', 'error');
        return;
      }

      const updatedUser = {
        ...users[userIndex],
        firstName: first,
        lastName: last,
        email: email
      };
      if (pass) {
        updatedUser.password = pass;
      }

      if (userIndex > -1) {
        users[userIndex] = updatedUser;
      } else {
        // Fallback for default accounts
        users.push(updatedUser);
      }
      
      saveRegisteredUsers(users);

      // Update current logged-in session user details
      const newSessionUser = {
        firstName: first,
        lastName: last,
        email: email,
        joinDate: user.joinDate
      };
      setAuthUser(newSessionUser);

      // Instantly refresh user details across the page
      // 1. Greeting header
      const greeting = document.getElementById('profileGreeting');
      if (greeting) {
        const initials = (first[0] + last[0]).toUpperCase();
        greeting.innerHTML = `
          <div class="profile-user-greeting">
            <div class="greeting-avatar">${initials}</div>
            <div class="greeting-text">
              <h3>Welcome back, ${first}!</h3>
              <p>${email} &nbsp;·&nbsp; Member since ${user.joinDate}</p>
            </div>
            <button class="profile-logout-btn" onclick="logoutUser()">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
          </div>`;
      }

      // 2. Sidebar details
      const avatarEl = document.querySelector('.profile-avatar-circle');
      const nameEl   = document.querySelector('.profile-nav-header h3');
      if (avatarEl) avatarEl.textContent = (first[0] + last[0]).toUpperCase();
      if (nameEl)   nameEl.textContent   = `${first} ${last}`;
      
      // 3. Welcome title
      const welcomeH = document.getElementById('profileWelcomeHeading');
      if (welcomeH) welcomeH.textContent = `WELCOME BACK, ${first.toUpperCase()}`;

      // Reset password field
      accPass.value = "";

      setSubmitLoading('accSubmitBtn', false);
      showToast('Account details successfully updated! ✨', 'success');
    });
  }
}

// ── Logout ────────────────────────────────────────────────────
function logoutUser() {
  clearAuthUser();
  sessionStorage.removeItem('aura_session_only');
  showToast('You have been signed out. See you soon! 👋', 'info');
  setTimeout(() => { window.location.href = 'auth.html'; }, 1200);
}

// ── Session-only cleanup (if "remember me" was NOT checked) ───
(function checkSessionOnly() {
  if (sessionStorage.getItem('aura_session_only') !== '1' && !sessionStorage.getItem('aura_session_checked')) {
    // Don't wipe on first load of a new tab — only if explicitly session-only
    sessionStorage.setItem('aura_session_checked', '1');
  }
})();

// ── Auth page init ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Already-logged-in redirect on auth.html
  if (window.location.pathname.toLowerCase().includes('auth.html')) {
    if (getAuthUser()) { window.location.href = 'profile.html'; return; }
    initLoginForm();
    initSignupForm();
    // Check URL param ?tab=signup
    if (new URLSearchParams(window.location.search).get('tab') === 'signup') {
      switchAuthTab('signup');
    }
  }

  // Sync navbar user state on every page
  syncNavbarUserState();
});

