/**
 * Returns the URL for an image or a placeholder if no image is available.
 * @param {string} image - The image path or null/undefined.
 * @returns {string} - The full image URL or the placeholder URL.
 */
const getImage = (image) => image
    ? `https://image.tmdb.org/t/p/w500/${image}` // Use smaller image for performance
    : "./assets/icons/noImage.png";

/**
 * Creates a throttled version of a callback function that only executes once per specified delay.
 * @param {Function} callback - The function to throttle.
 * @param {number} [delay=1000] - The delay in milliseconds between calls.
 * @returns {Function} - The throttled function.
 */
const throttle = (callback, delay = 1000) => {
  let lastCalledTime = 0;

  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCalledTime >= delay) {
      callback(...args);
      lastCalledTime = now;
    }
  };
};

/**
 * Creates a debounced version of a callback function that delays execution until after a specified delay.
 * @param {Function} callback - The function to debounce.
 * @param {number} [delay=1000] - The delay in milliseconds before execution.
 * @returns {Function} - The debounced function.
 */
const debounce = (callback, delay = 1000) => {
  let time;

  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => callback(...args), delay);
  };
};

/**
 * Checks if the user has scrolled to the bottom of the page.
 * @returns {boolean} - True if scrolled to the bottom, otherwise false.
 */
const isScrolledToBottom = () => window.scrollY + window.innerHeight >= document.body.scrollHeight - 50; // Add offset for accuracy

/**
 * Resets the application state by clearing movies and searchMovies arrays.
 */
const resetState = () => {
  state.movies = [];
  state.searchMovies = [];
};

/**
 * Handles fetch errors with retries and displays an error message if all retries fail.
 * @param {Error} error - The error object.
 * @param {number} [retries=5] - The number of retry attempts.
 */
const handleFetchError = (error, retries = 5) => {
  if (retries > 0) {
    console.warn(`Retrying... (${5 - retries + 1} attempts left)`);

    setTimeout(() => {
      handleFetchError(error, retries - 1);
    }, 1000); // Delay of 1 second before retrying
  } else {
    console.error("Error fetching data:", error);
    alert("Something went wrong. Please try again later.");
  }
};

/**
 * Lazily loads an image, replacing a placeholder with the actual image once it is visible.
 * @param {HTMLImageElement} img - The image element to lazy-load.
 * @param {string} src - The source URL for the image.
 */
const lazyLoadImage = (img, src) => {
  img.src = "./assets/icons/loading.gif"; // Placeholder image
  img.setAttribute("data-src", src);
  img.classList.add("movie-lazy-load");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = img.getAttribute("data-src");
          img.onload = () => img.classList.add("loaded");
          obs.unobserve(img);
        }
      });
    });
    observer.observe(img);
  } else {
    img.src = img.getAttribute("data-src");
    img.onload = () => img.classList.add("loaded");
  }
};


// For Testing
const Utils = {
  getImage,
  throttle,
  debounce,
  lazyLoadImage,
  handleFetchError,
  resetState,
  isScrolledToBottom,
};

if (typeof window !== 'undefined') {
  window.Utils = Utils;
} else if (typeof global !== 'undefined') {
  global.Utils = Utils;
}
