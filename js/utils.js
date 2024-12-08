const getImage = (image) => image
    ? `https://image.tmdb.org/t/p/w500/${image}` // Use smaller image for performance
    : "./assets/icons/noImage.png";

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

const debounce = (callback, delay = 1000) => {
  let time;

  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => callback(...args), delay);
  };
};

const isScrolledToBottom = () => window.scrollY + window.innerHeight >= document.body.scrollHeight - 50; // Add offset for accuracy

const resetState = () => {
  state.movies = [];
  state.searchMovies = [];
};

const handleFetchError = (error, retries = 5) => {
  if (retries > 0) {
    console.warn(`Retrying... (${3 - retries} attempts left)`);

    setTimeout(() => fetch(...args).catch((e) => handleFetchError(e, retries - 1)), 1000);
  } else {
    console.error("Error fetching data:", error);
    alert("Something went wrong. Please try again later.");
  }
};

// Lazy-load images
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
