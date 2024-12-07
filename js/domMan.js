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

const createMovieElement = (movie) => {
  const movieContainer = createElement("div", ["movie-container"]);

  // Poster
  const poster = createElement("img", ["movie-poster"]);
  lazyLoadImage(poster, getImage(movie.backdrop_path));

  // Title (Separate Section)
  const title = createElement("h2", ["movie-title"], {}, movie.title);

  // Content (All elements except title)
  const movieContent = createElement("div", ["movie-content"]);
  const releaseYear = createElement("p", ["movie-release-year"], {}, `Release: ${movie.release_date}`);
  const genre = createElement(
      "p",
      ["movie-genre"],
      {},
      `Genre(s): ${movie.genre_ids?.map((genreId) => state.genres[genreId]).join(", ")}`
  );
  const voteNumber = createElement("span", ["vote-number"], {}, movie.vote_average);
  const voteAverage = createElement("p", ["movie-vote-average"], {}, "Vote Average: ");
  voteAverage.appendChild(voteNumber);

  // Description with Expand/Collapse
  const overview = createElement("p", ["movie-overview"], {}, movie.overview);
  const toggleButton = createElement("span", ["read-more"], {}, "Read More");

  toggleButton.addEventListener("click", (event) => {
    // Prevent propagation to avoid modal opening
    event.stopPropagation();
    overview.classList.toggle("expanded");
    toggleButton.textContent = overview.classList.contains("expanded") ? "Read Less" : "Read More";
  });

  // Append content into the movie-content div
  appendChildren(movieContent, releaseYear, genre, voteAverage, overview, toggleButton);
  appendChildren(movieContainer, poster, title, movieContent);

  // Event Listener for Modal
  movieContainer.addEventListener("click", () => handleModal(movie.id));

  return movieContainer;
};

const observeLazyImages = () => {
  document.querySelectorAll(".movie-lazy-load:not(.loaded)").forEach((img) => {
    lazyLoadImage(img, img.getAttribute("data-src"));
  });
};

const createModal = (movieData) => {
  const existingModal = document.querySelector(".modal");
  const mainContainer = document.querySelector(".main-container");
  const modalOverlay = document.querySelector(".modal-overlay");

  if (existingModal) existingModal.remove();

  const modal = createElement("div", ["modal"]);

  // Create a fixed header for the modal
  const modalHeader = createElement("div", ["modal-header"]);
  const modalInfoTitle = createElement("div", ["modal-info-title"], {}, movieData.movie.title);
  const closeButton = createElement("button", ["close-modal"], {}, "X");
  closeButton.addEventListener("click", () => closeModal(modal, modalOverlay));

  appendChildren(modalHeader, modalInfoTitle, closeButton);

  // Create the scrollable content section
  const modalContent = createElement("div", ["modal-content"]);
  const modalHero = createModalHero(movieData);
  const similarMovies = createSimilarMoviesSection(movieData.similar);

  appendChildren(modalContent, modalHero, similarMovies);

  appendChildren(modal, modalHeader, modalContent);
  mainContainer.appendChild(modal);
};

const renderMovies = () => {
  const searchBox = document.getElementById("query");

  let moviesToRender = searchBox.value ? state.searchMovies : state.movies;

  moviesToRender[moviesToRender.length - 1]?.movieList.forEach((movie) => {
    const movieContainer = createMovieElement(movie);
    const movieListContainer = document.querySelector(".movie-list-container");

    movieListContainer.appendChild(movieContainer);
    observeLazyImages();
  });
};

const handleModal = async (movieId) => {
  try {
    // Create the overlay dynamically if it doesn't exist
    let modalOverlay = document.querySelector(".modal-overlay");
    if (!modalOverlay) {
      modalOverlay = document.createElement("div");
      modalOverlay.classList.add("modal-overlay");
      document.body.appendChild(modalOverlay);
    }

    // Fetch movie data
    const movieData = await fetchMovie(movieId);

    // Remove any existing modal (if needed)
    const existingModal = document.querySelector(".modal");
    if (existingModal) existingModal.remove();

    // Create a new modal
    createModal(movieData);
    const modal = document.querySelector(".modal");

    // Ensure the modal starts hidden for smooth animation
    modal.classList.add("open");
    modalOverlay.classList.add("open");

    console.log(9999, modal, 'modal')
    console.log(9999, modalOverlay, 'modalOverlay' )

    // Add click listener to the overlay to close the modal
    modalOverlay.addEventListener("click", () => closeModal(modal, modalOverlay));

  } catch (error) {
    console.error("Error handling modal:", error);
  }
};

const closeModal = (modal, modalOverlay) => {
  if (modal) {
    modal.classList.add("closing"); // Add a closing animation if desired
  }
  if (modalOverlay) {
    modalOverlay.classList.add("closing"); // Add a closing animation for the overlay
  }

  // Wait for animations to end before cleanup
  const cleanup = () => {
    modal.remove();
    modalOverlay.remove();
  };

  if (modal) {
    modal.addEventListener("transitionend", cleanup, { once: true });
  }

  // Fallback in case transition events don't trigger
  setTimeout(cleanup, 300); // Match CSS transition duration (if any)
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

const createModalHero = (movieData) => {
  const modalHero = createElement("div", ["modal-info-hero"]);

  // Video Section
  const video = createElement("div", ["video"]);
  if (movieData.trailer?.key) {
    // If video is available, embed it
    video.appendChild(createYouTubeIframe(movieData.trailer.key));
  } else {
    // If no video is available, display the "No Video" image
    const noVideoImg = createElement("img", ["no-video"], {
      src: "./assets/icons/noVideo.png",
      alt: "No Video Available",
    });
    video.appendChild(noVideoImg);
  }

  // Reviews Section
  const reviews = createElement("div", ["reviews"]);
  const reviewsTitle = createElement("h2", [], {}, "Reviews");
  reviews.appendChild(reviewsTitle);

  if (movieData.reviews.length) {
    movieData.reviews.forEach((review) => {
      const reviewContainer = createElement("div", ["review-container"]);
      const author = createElement("div", ["author"], {}, review.author);
      const reviewContent = createElement("div", ["review-content"], {}, review.content);
      appendChildren(reviewContainer, author, reviewContent);
      reviews.appendChild(reviewContainer);
    });
  } else {
    const noReviews = createElement(
        "div",
        ["no-reviews-available"],
        {},
        "No reviews available"
    );
    reviews.appendChild(noReviews);
  }

  appendChildren(modalHero, video, reviews);
  return modalHero;
};

const createSimilarMoviesSection = (similarMovies) => {
  const similar = createElement("div", ["similar"]);
  const similarTitle = createElement("h2", ["similar-title"], {}, "Similar Movies");

  // Container for similar movies
  const similarContainer = createElement("div", ["similar-container"]);

  if (similarMovies.length) {
    // If similar movies exist, render them
    similarMovies.forEach((movie) => {
      const movieContainer = createMovieElement(movie);
      similarContainer.appendChild(movieContainer);
    });
  } else {
    // If no similar movies, display a message
    const noSimilarMovies = createElement(
        "div",
        ["no-similar-movies"],
        {},
        "No similar movies available"
    );
    similarContainer.appendChild(noSimilarMovies);
  }

  appendChildren(similar, similarTitle, similarContainer);
  return similar;
};
