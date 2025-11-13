// Wait until the whole page is loaded
document.addEventListener("DOMContentLoaded", () => {

  // Get main buttons and sections
  let scrollButton = document.getElementById("scrollBtn");
  let aboutSection = document.getElementById("about");
  let topButton = document.getElementById("backToTop");

  // ✅ Scroll smoothly to "About" section when clicked
  if (scrollButton && aboutSection) {
    scrollButton.addEventListener("click", () => {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ✅ Show/Hide "Back to Top" button while scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topButton.style.display = "flex";
    } else {
      topButton.style.display = "none";
    }
  });

  // ✅ Scroll smoothly to top when "Back to Top" is clicked
  if (topButton) {
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ✅ Redirect to quiz page when "Take the Skin Quiz" is clicked
  const quizButton = document.getElementById("scrollBtn");
  if (quizButton) {
    quizButton.addEventListener("click", () => {
      window.location.href = "quiz.html";
    });
  }
});
