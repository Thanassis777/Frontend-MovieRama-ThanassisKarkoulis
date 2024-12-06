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

const createModal = (movieData) => {
  const existingModal = document.querySelector(".modal");
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

const observeLazyImages = () => {
  document.querySelectorAll(".movie-lazy-load:not(.loaded)").forEach((img) => {
    lazyLoadImage(img, img.getAttribute("data-src"));
  });
};

const renderMovies = () => {
  let moviesToRender = searchbox.value ? state.searchMovies : state.movies;

  moviesToRender[moviesToRender.length - 1]?.movieList.forEach((movie) => {
    const movieContainer = createMovieElement(movie);

    movieListContainer.appendChild(movieContainer);
    observeLazyImages();
  });
};

const handleModal = async (movieId) => {
  const movieData = await fetchMovie(movieId);
  createModal(movieData);
};
