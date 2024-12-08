/**
 * Creates an HTML element with the specified attributes, classes, and text content.
 * @param {string} tag - The tag name of the HTML element.
 * @param {string[]} [classNames=[]] - Array of class names to add to the element.
 * @param {Object} [attributes={}] - Key-value pairs of attributes to set on the element.
 * @param {string} [textContent=""] - Text content to set for the element.
 * @returns {HTMLElement} - The created HTML element.
 */
const createElement = (tag, classNames = [], attributes = {}, textContent = "") => {
  const element = document.createElement(tag);

  if (classNames.length) element.classList.add(...classNames);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;

  return element;
};

/**
 * Appends multiple child elements to a parent element.
 * @param {HTMLElement} parent - The parent element.
 * @param {...HTMLElement} children - The child elements to append.
 */
const appendChildren = (parent, ...children) => children.forEach(child => parent.appendChild(child));

/**
 * Creates an HTML element with text content and optional class names.
 * @param {string} tag - The tag name of the HTML element.
 * @param {string[]} [classNames] - Array of class names to add to the element.
 * @param {string} text - The text content to set for the element.
 * @returns {HTMLElement} - The created HTML element with text.
 */
const createTextElement = (tag, classNames, text) =>
    createElement(tag, classNames, {}, text);

/**
 * Observes and lazy-loads images with the specified class.
 */
const observeLazyImages = () => {
  document.querySelectorAll(".movie-lazy-load:not(.loaded)").forEach((img) => {
    lazyLoadImage(img, img.getAttribute("data-src"));
  });
};

/**
 * Adds a toggle event listener to a button for expanding or collapsing content.
 * @param {HTMLElement} button - The button element.
 * @param {HTMLElement} content - The content to toggle.
 */
const addToggleEventListener = (button, content) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    content.classList.toggle("expanded");
    button.textContent = content.classList.contains("expanded") ? "Read Less" : "Read More";
  });
};

/**
 * Closes a modal and its overlay with a transition effect.
 * @param {HTMLElement} modal - The modal element.
 * @param {HTMLElement} modalOverlay - The modal overlay element.
 */
const closeModal = (modal, modalOverlay) => {
  const cleanup = () => {
    modal?.remove();
    modalOverlay?.remove();
  };

  modal?.classList.add("closing");
  modalOverlay?.classList.add("closing");

  modal?.addEventListener("transitionend", cleanup, { once: true });
  setTimeout(cleanup, 300);
};

/**
 * Creates and appends an overlay for modals.
 * @returns {HTMLElement} - The created overlay element.
 */
const createOverlay = () => {
  const overlay = document.createElement("div");

  overlay.classList.add("modal-overlay");
  document.body.appendChild(overlay);

  return overlay;
};

/**
 * Creates an HTML structure representing a movie.
 * @param {Object} movie - The movie data.
 * @returns {HTMLElement} - The created movie element.
 */
const createMovieElement = (movie) => {
  const movieContainer = createElement("div", ["movie-container"]);
  const poster = createElement("img", ["movie-poster"]);

  lazyLoadImage(poster, getImage(movie.backdrop_path));

  const title = createTextElement("h2", ["movie-title"], movie.title);

  const movieContent = createElement("div", ["movie-content"]);
  const releaseYear = createTextElement("p", ["movie-release-year"], `Release: ${movie.release_date}`);
  const genre = createTextElement(
      "p",
      ["movie-genre"],
      `Genre(s): ${movie.genre_ids?.map((id) => state.genres[id]).join(", ")}`
  );

  const voteAverage = createTextElement(
      "p",
      ["movie-vote-average"],
      `Vote Average: ${movie.vote_average}`
  );

  const overview = createTextElement("p", ["movie-overview"], movie.overview);
  const toggleButton = createTextElement("span", ["read-more"], "Read More");
  addToggleEventListener(toggleButton, overview);

  appendChildren(movieContent, releaseYear, genre, voteAverage, overview, toggleButton);
  appendChildren(movieContainer, poster, title, movieContent);

  movieContainer.addEventListener("click", () => handleModal(movie.id));

  return movieContainer;
};

/**
 * Creates a modal header with a title and a close button.
 * @param {string} titleText - The title text for the modal.
 * @param {Function} closeModalCallback - The callback to execute when the modal is closed.
 * @returns {HTMLElement} - The created modal header.
 */
const createModalHeader = (titleText, closeModalCallback) => {
  const header = createElement("div", ["modal-header"]);
  const title = createTextElement("div", ["modal-info-title"], titleText);
  const closeButton = createTextElement("button", ["close-modal"], "X");

  closeButton.addEventListener("click", closeModalCallback);
  appendChildren(header, title, closeButton);

  return header;
};

/**
 * Creates the main content of a modal.
 * @param {Object} movieData - The data for the movie.
 * @returns {HTMLElement} - The created modal content.
 */
const createModalContent = (movieData) => {
  const content = createElement("div", ["modal-content"]);
  appendChildren(content, createMovieModal(movieData), createSimilarMoviesSection(movieData.similar));

  return content;
};

/**
 * Creates a modal for a movie.
 * @param {Object} movieData - The movie data to display in the modal.
 */
const createModal = (movieData) => {
  const existingModal = document.querySelector(".modal");

  const modalOverlay = document.querySelector(".modal-overlay") || createOverlay();
  const mainContainer = document.querySelector(".main-container");

  if (existingModal) existingModal.remove();

  const modal = createElement("div", ["modal"]);
  appendChildren(modal,
      createModalHeader(movieData.movie.title, () => closeModal(modal, modalOverlay)),
      createModalContent(movieData)
  );

  mainContainer.appendChild(modal);

  modalOverlay.classList.add("open");
  modal.classList.add("open");
  modalOverlay.addEventListener("click", () => closeModal(modal, modalOverlay));
};

/**
 * Creates a YouTube iframe element for embedding videos.
 * @param {string} videoId - The YouTube video ID.
 * @returns {HTMLIFrameElement} - The created iframe element.
 */
const createYouTubeIframe = (videoId) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.width = 640;
  iframe.height = 390;

  return iframe;
};

/**
 * Creates the movie section of a modal, including a video and reviews.
 * @param {Object} movieData - The data for the movie.
 * @returns {HTMLElement} - The created movie section.
 */
const createMovieModal = (movieData) => {
  const modalMovie = createElement("div", ["modal-info-movie"]);
  const video = createElement("div", ["video"]);

  if (movieData.trailer?.key) {
    video.appendChild(createYouTubeIframe(movieData.trailer.key));
  } else {
    const noVideoImg = createElement("img", ["no-video"], {
      src: "./assets/icons/noVideo.png",
      alt: "No Video Available",
    });
    video.appendChild(noVideoImg);
  }

  const reviews = createReviewSection(movieData.reviews);
  appendChildren(modalMovie, video, reviews);

  return modalMovie;
};

/**
 * Creates a section displaying reviews.
 * @param {Array} reviews - Array of review objects.
 * @returns {HTMLElement} - The created review section.
 */
const createReviewSection = (reviews) => {
  const reviewSection = createElement("div", ["reviews"]);
  const title = createTextElement("h2", [], "Reviews");

  appendChildren(reviewSection, title);

  if (reviews.length) {
    reviews.forEach(({ author, content }) => {
      const reviewContainer = createElement("div", ["review-container"]);
      appendChildren(
          reviewContainer,
          createTextElement("div", ["author"], author),
          createTextElement("div", ["review-content"], content)
      );
      reviewSection.appendChild(reviewContainer);
    });
  } else {
    reviewSection.appendChild(createTextElement("div", ["no-reviews-available"], "No reviews available"));
  }

  return reviewSection;
};

/**
 * Creates a section displaying similar movies.
 * @param {Array} similarMovies - Array of similar movie objects.
 * @returns {HTMLElement} - The created similar movies section.
 */
const createSimilarMoviesSection = (similarMovies) => {
  const container = createElement("div", ["similar"]);
  const title = createTextElement("h2", ["similar-title"], "Similar Movies");
  const movieContainer = createElement("div", ["similar-container"]);

  if (similarMovies.length) {
    similarMovies.forEach((movie) => movieContainer.appendChild(createMovieElement(movie)));
  } else {
    movieContainer.appendChild(createTextElement("div", ["no-similar-movies"], "No similar movies available"));
  }

  appendChildren(container, title, movieContainer);

  return container;
};

/**
 * Renders a list of movies in the DOM.
 */
const renderMovies = () => {
  const searchBox = document.getElementById("query");
  const moviesToRender = searchBox.value ? state.searchMovies : state.movies;
  const lastMoviesList = moviesToRender[moviesToRender.length - 1]?.movieList || [];

  if (lastMoviesList.length === 0) {
    movieListContainer.innerHTML = "";

    // Display "No results found" message if no movies are available
    const noResultsMessage = createElement(
        "div",
        ["no-results"],
        {},
        "No results found. Please try another search."
    );
    movieListContainer.appendChild(noResultsMessage);
  } else {
    // Render movies if available
    lastMoviesList.forEach((movie) => {
      const movieElement = createMovieElement(movie);
      movieListContainer.appendChild(movieElement);
    });

    // Observe lazy-loaded images
    observeLazyImages();
  }
};

/**
 * Handles fetching and displaying a modal for a movie by ID.
 * @param {number} movieId - The ID of the movie.
 */
const handleModal = async (movieId) => {
  try {
    const movieData = await fetchMovie(movieId);
    createModal(movieData);
  } catch (error) {
    handleFetchError(error);
  }
};
