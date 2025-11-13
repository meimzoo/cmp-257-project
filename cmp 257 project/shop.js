
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
