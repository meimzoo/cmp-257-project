
// Wait for page to fully load
document.addEventListener("DOMContentLoaded", () => {

  // Get all product rows and arrow buttons
  const productRows = document.querySelectorAll(".product-row");
  const nextButton = document.querySelector(".scroll-right");
  const prevButton = document.querySelector(".scroll-left");

  // Check for missing elements
  if (productRows.length === 0) {
    console.warn("⚠️ No product rows found! Add class 'product-row' to your product sections.");
    return;
  }
  if (!nextButton || !prevButton) {
    console.warn("⚠️ Missing scroll buttons! Add .scroll-right and .scroll-left buttons.");
    return;
  }

  // Keep track of which page each row is on
  const pages = Array.from(productRows, () => 0);

  // Scroll function for all rows
  function scrollAllRows(forward = true) {
    productRows.forEach((row, index) => {
      const visibleWidth = row.clientWidth;
      const totalWidth = row.scrollWidth;
      const totalPages = Math.ceil(totalWidth / visibleWidth);

      // Move one page forward or backward
      pages[index] = forward
        ? Math.min(pages[index] + 1, totalPages - 1)
        : Math.max(pages[index] - 1, 0);

      // Smooth scroll
      const targetX = pages[index] * visibleWidth;
      row.scrollTo({ left: targetX, behavior: "smooth" });
    });

    updateArrowButtons();
  }

  // Update visibility of left/right arrows
  function updateArrowButtons() {
    const atStart = pages.every(page => page === 0);
    const atEnd = pages.every((page, i) => {
      const total = Math.ceil(productRows[i].scrollWidth / productRows[i].clientWidth);
      return page >= total - 1;
    });

    prevButton.style.visibility = atStart ? "hidden" : "visible";
    nextButton.style.visibility = atEnd ? "hidden" : "visible";
  }

  // Handle clicks
  nextButton.addEventListener("click", () => scrollAllRows(true));
  prevButton.addEventListener("click", () => scrollAllRows(false));

  // Adjust when window resizes
  window.addEventListener("resize", () => {
    productRows.forEach((row, index) => {
      const totalPages = Math.ceil(row.scrollWidth / row.clientWidth);
      if (pages[index] >= totalPages) pages[index] = totalPages - 1;

      const targetX = pages[index] * row.clientWidth;
      row.scrollTo({ left: targetX, behavior: "instant" });
    });
    updateArrowButtons();
  });

  // Set initial arrow state
  updateArrowButtons();
});







//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED
//NEW UPDATED --------------------------------------------------------------------------------------------------


// shop.js

document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     1) EXISTING SCROLL BEHAVIOR
     =========================== */

  // Get all product rows and arrow buttons
  const productRows = document.querySelectorAll(".product-row");
  const nextButton = document.querySelector(".scroll-right");
  const prevButton = document.querySelector(".scroll-left");

  // Check for missing elements
  if (productRows.length === 0) {
    console.warn("⚠️ No product rows found! Add class 'product-row' to your product sections.");
  }

  if (!nextButton || !prevButton) {
    console.warn("⚠️ Missing scroll buttons! Add .scroll-right and .scroll-left buttons.");
  }

  // Keep track of which page each row is on
  const pages = Array.from(productRows, () => 0);

  // Scroll function for all rows
  function scrollAllRows(forward = true) {
    productRows.forEach((row, index) => {
      const visibleWidth = row.clientWidth;
      const totalWidth = row.scrollWidth;
      const totalPages = Math.ceil(totalWidth / visibleWidth);

      // Move one page forward or backward
      pages[index] = forward
        ? Math.min(pages[index] + 1, totalPages - 1)
        : Math.max(pages[index] - 1, 0);

      // Smooth scroll
      const targetX = pages[index] * visibleWidth;
      row.scrollTo({ left: targetX, behavior: "smooth" });
    });

    updateArrowButtons();
  }

  // Update visibility of left/right arrows
  function updateArrowButtons() {
    if (!nextButton || !prevButton || productRows.length === 0) return;

    const atStart = pages.every(page => page === 0);
    const atEnd = pages.every((page, i) => {
      const total = Math.ceil(productRows[i].scrollWidth / productRows[i].clientWidth);
      return page >= total - 1;
    });

    prevButton.style.visibility = atStart ? "hidden" : "visible";
    nextButton.style.visibility = atEnd ? "hidden" : "visible";
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => scrollAllRows(true));
  }
  if (prevButton) {
    prevButton.addEventListener("click", () => scrollAllRows(false));
  }

  // Adjust when window resizes
  window.addEventListener("resize", () => {
    productRows.forEach((row, index) => {
      const totalPages = Math.ceil(row.scrollWidth / row.clientWidth);
      if (pages[index] >= totalPages) pages[index] = Math.max(0, totalPages - 1);

      const targetX = pages[index] * row.clientWidth;
      row.scrollTo({ left: targetX, behavior: "instant" });
    });
    updateArrowButtons();
  });

  // Set initial arrow state
  updateArrowButtons();


  /* ===========================
     2) CART / LOCALSTORAGE LOGIC
     =========================== */

  // Helper: load cart from localStorage
  function loadCart() {
    try {
      const raw = localStorage.getItem("hsmfCart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
      return [];
    }
  }

  // Helper: save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("hsmfCart", JSON.stringify(cart));
  }

  // Attach "Add to Bag" handlers to all product buttons
  const addButtons = document.querySelectorAll(".product-card button");

  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      if (!card) return;

      const nameEl = card.querySelector("h4");
      const priceEl = card.querySelector("p");
      const imgEl = card.querySelector("img");

      const name = nameEl ? nameEl.textContent.trim() : "Product";
      const priceText = priceEl ? priceEl.textContent.trim().replace("$", "") : "0";
      const price = parseFloat(priceText) || 0;
      const img = imgEl ? imgEl.getAttribute("src") : "";

      // Simple ID based on name
      const id = name.toLowerCase().replace(/\s+/g, "-");

      let cart = loadCart();

      // Check if item already exists in cart
      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id,
          name,
          price,
          quantity: 1,
          img
        });
      }

      saveCart(cart);

      // Simple feedback so the user sees something happened
      alert(`${name} added to your bag.`);
    });
  });
});

