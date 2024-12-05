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

const createYouTubeIframe = (videoId) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.width = 640;
  iframe.height = 390;

  return iframe;
};

const isScrolledToBottom = () => window.scrollY + window.innerHeight >= document.body.scrollHeight - 50; // Add offset for accuracy

const resetState = () => {
  state.movies = [];
  state.searchMovies = [];
};

const handleFetchError = (error) => {
  console.error("Error fetching data:", error);
  alert("Something went wrong. Please try again later.");
};



// Utility functions for DOM manipulation
const createElement = (tag, classNames = [], attributes = {}, textContent = "") => {
  const element = document.createElement(tag);
  classNames.forEach((className) => element.classList.add(className));
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;
  return element;
};

const appendChildren = (parent, ...children) => {
  children.forEach((child) => parent.appendChild(child));
};

// Lazy-load images
const lazyLoadImage = (img, src) => {
  img.setAttribute("data-src", src);
  img.classList.add("lazy-load");
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

const createModalHero = (movieData) => {
  const modalHero = createElement("div", ["modal-info-hero"]);

  // Video
  const video = createElement("div", ["video"]);
  if (movieData.trailer?.key) {
    video.appendChild(createYouTubeIframe(movieData.trailer.key));
  } else {
    const noVideo = createElement("img", ["no-video"], { src: "./assets/icons/noVideo.png" });
    video.appendChild(noVideo);
  }

  // Reviews
  const reviews = createElement("div", ["reviews"]);
  const reviewsTitle = createElement("h2", [], {}, "Reviews");
  appendChildren(reviews, reviewsTitle);

  if (movieData.reviews.length) {
    movieData.reviews.forEach((review) => {
      const reviewContainer = createElement("div", ["review-container"]);
      const author = createElement("div", ["author"], {}, review.author);
      const reviewContent = createElement("div", ["review-content"], {}, review.content);
      appendChildren(reviewContainer, author, reviewContent);
      reviews.appendChild(reviewContainer);
    });
  } else {
    const noReviews = createElement("div", ["no-reviews-available"], {}, "No reviews available");
    reviews.appendChild(noReviews);
  }

  appendChildren(modalHero, video, reviews);
  return modalHero;
};


const createSimilarMoviesSection = (similarMovies) => {
  const similar = createElement("div", ["similar"]);
  const similarTitle = createElement("h2", ["similar-title"], {}, "Similar");
  const similarContainer = createElement("div", ["similar-container"]);

  similarMovies.forEach((movie) => {
    const movieContainer = createMovieElement(movie);
    similarContainer.appendChild(movieContainer);
  });

  appendChildren(similar, similarTitle, similarContainer);
  return similar;
};



