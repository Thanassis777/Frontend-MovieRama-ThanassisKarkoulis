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

  // Movie Info
  const movieInfo = createElement("div", ["movie-info"]);
  const title = createElement("h2", ["movie-title"], {}, movie.title);
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
  const overview = createElement("p", ["movie-overview"], {}, movie.overview);

  appendChildren(movieInfo, title, releaseYear, genre, voteAverage, overview);
  appendChildren(movieContainer, poster, movieInfo);

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

  if (existingModal) existingModal.remove();

  const modal = createElement("div", ["modal"]);
  const modalInfo = createElement("div", ["modal-info"]);

  // Title
  const modalInfoTitle = createElement("div", ["modal-info-title"], {}, movieData.movie.title);

  // Hero Section (Video + Reviews)
  const modalHero = createModalHero(movieData);

  // Similar Movies Section
  const similarMovies = createSimilarMoviesSection(movieData.similar);

  // Close Button
  const closeButton = createElement("button", ["close-modal"], {}, "X");
  closeButton.addEventListener("click", () => modal.remove());

  appendChildren(modalInfo, modalInfoTitle, modalHero, similarMovies);
  appendChildren(modal, modalInfo, closeButton);
  mainContainer.appendChild(modal);

  // Lazy load images in modal
  observeLazyImages();
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
  const movieData = await fetchMovie(movieId);
  createModal(movieData);
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
