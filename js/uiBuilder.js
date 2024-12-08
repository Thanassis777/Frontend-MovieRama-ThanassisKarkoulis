// Utility functions for DOM manipulation
const createElement = (tag, classNames = [], attributes = {}, textContent = "") => {
  const element = document.createElement(tag);

  if (classNames.length) element.classList.add(...classNames);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;

  return element;
};

const appendChildren = (parent, ...children) => children.forEach(child => parent.appendChild(child));

const createTextElement = (tag, classNames, text) =>
    createElement(tag, classNames, {}, text);

// Lazy Load Images
const observeLazyImages = () => {
  document.querySelectorAll(".movie-lazy-load:not(.loaded)").forEach((img) => {
    lazyLoadImage(img, img.getAttribute("data-src"));
  });
};

// Event Listener Utilities
const addToggleEventListener = (button, content) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    content.classList.toggle("expanded");
    button.textContent = content.classList.contains("expanded") ? "Read Less" : "Read More";
  });
};

// Modal Utilities
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

const createOverlay = () => {
  const overlay = document.createElement("div");

  overlay.classList.add("modal-overlay");
  document.body.appendChild(overlay);

  return overlay;
};

// Movie Card
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

// Modal Creation
const createModalHeader = (titleText, closeModalCallback) => {
  const header = createElement("div", ["modal-header"]);
  const title = createTextElement("div", ["modal-info-title"], titleText);
  const closeButton = createTextElement("button", ["close-modal"], "X");

  closeButton.addEventListener("click", closeModalCallback);
  appendChildren(header, title, closeButton);

  return header;
};

const createModalContent = (movieData) => {
  const content = createElement("div", ["modal-content"]);
  appendChildren(content, createModalHero(movieData), createSimilarMoviesSection(movieData.similar));

  return content;
};

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

const createYouTubeIframe = (videoId) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.width = 640;
  iframe.height = 390;

  return iframe;
};

// Hero Section
const createModalHero = (movieData) => {
  const modalHero = createElement("div", ["modal-info-hero"]);
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
  appendChildren(modalHero, video, reviews);

  return modalHero;
};

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

// Similar Movies
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

// Render Movies
const renderMovies = () => {
  const searchBox = document.getElementById("query");
  const moviesToRender = searchBox.value ? state.searchMovies : state.movies;
  const lastMoviesList = moviesToRender[moviesToRender.length - 1]?.movieList || [];

  // Clear the movie list container
  movieListContainer.innerHTML = "";

  if (lastMoviesList.length === 0) {
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

// Handle Modal
const handleModal = async (movieId) => {
  try {
    const movieData = await fetchMovie(movieId);
    createModal(movieData);
  } catch (error) {
    handleFetchError(error);
  }
};
