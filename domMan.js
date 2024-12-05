const createMovieElement = (movie) => {
  const movieContainer = document.createElement("div");
  movieContainer.classList.add("movie-container");

  const poster = document.createElement("img");
  poster.classList.add("movie-poster");
  
  poster.src = ""; // Placeholder to support lazy loading
  poster.setAttribute('data-src', getImage(movie.backdrop_path));
  poster.classList.add("lazy-load");

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie-info");

  const title = document.createElement("h2");
  title.classList.add("movie-title");
  title.textContent = movie.title;

  const releaseYear = document.createElement("p");
  releaseYear.classList.add("movie-release-year");
  releaseYear.textContent = `Release: ${movie.release_date}`;

  const genre = document.createElement("p");
  genre.classList.add("movie-genre");
  genre.textContent = `Genre(s): ${movie.genre_ids?.map((genreId) => state.genres[genreId]).join(", ")}`;

  const voteNumber = document.createElement("span");
  voteNumber.classList.add("vote-number");
  voteNumber.textContent = movie.vote_average;

  const voteAverage = document.createElement("p");
  voteAverage.classList.add("movie-vote-average");
  voteAverage.textContent = `Vote Average: `;
  voteAverage.appendChild(voteNumber);

  const overview = document.createElement("p");
  overview.classList.add("movie-overview");
  overview.textContent = movie.overview;

  movieInfo.appendChild(title);
  movieInfo.appendChild(releaseYear);
  movieInfo.appendChild(genre);
  movieInfo.appendChild(voteAverage);
  movieInfo.appendChild(overview);

  movieContainer.appendChild(poster);
  movieContainer.appendChild(movieInfo);

  movieContainer.addEventListener("click", () => {
    handleModal(movie.id);
  });
  return movieContainer;
};

const createModal = (movieData) => {
  const modalOld = document.querySelector(".modal");
  if (modalOld) {
    modalOld.remove();
  }
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalInfo = document.createElement("div");
  modalInfo.classList.add("modal-info");

  const modalInfoTitle = document.createElement("div");
  modalInfoTitle.classList.add("modal-info-title");

  modalInfoTitle.innerHTML = movieData.movie.title;

  const modalHero = document.createElement("div");
  modalHero.classList.add("modal-info-hero");

  const video = document.createElement("div");
  video.classList.add("video");
  if (movieData.trailer?.key) {
    video.appendChild(createYouTubeIframe(movieData.trailer.key));
  } else {
    const noVideo = document.createElement("img");
    noVideo.classList.add("no-video");
    noVideo.src = "./assets/icons/noVideo.png";
    video.appendChild(noVideo);
  }

  const reviews = document.createElement("div");
  const reviewsTitle = document.createElement("h2");
  reviewsTitle.innerHTML = "Reviews";
  reviews.appendChild(reviewsTitle);
  reviews.classList.add("reviews");

  if (movieData.reviews.length) {
    movieData.reviews.forEach((review) => {
      const reviewContainer = document.createElement("div");
      reviewContainer.classList.add("review-container");
      const author = document.createElement("div");
      author.classList.add("author");
      author.innerHTML = review.author;
      const reviewContent = document.createElement("div");
      reviewContent.classList.add("review-content");
      reviewContent.innerHTML = review.content;
      reviewContainer.appendChild(author);
      reviewContainer.appendChild(reviewContent);
      reviews.appendChild(reviewContainer);
    });
  } else {
    const noReviewsAvailable = document.createElement("div");
    noReviewsAvailable.classList.add("no-reviews-available");
    noReviewsAvailable.innerHTML = "No reviews available";
    reviews.appendChild(noReviewsAvailable);
  }

  modalHero.appendChild(video);
  modalHero.appendChild(reviews);

  const similar = document.createElement("div");
  similar.classList.add("similar");

  const similarTitle = document.createElement("h2");
  similarTitle.classList.add("similar-title");
  similarTitle.innerHTML = "Similar";

  similar.appendChild(similarTitle);

  const similarContainer = document.createElement("div");
  similarContainer.classList.add("similar-container");

  movieData.similar.forEach((item) => {
    const movieContainer = createMovieElement(item);
    similarContainer.appendChild(movieContainer);
  });

  similar.appendChild(similarContainer);

  modalInfo.appendChild(modalInfoTitle);
  modalInfo.appendChild(modalHero);
  modalInfo.appendChild(similar);

  const closeButton = document.createElement("button");
  closeButton.classList.add("close-modal");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  modal.appendChild(modalInfo);
  modal.appendChild(closeButton);

  mainContainer.appendChild(modal);

  // Ensure lazy images in modal are observed
  observeLazyImages();

  return modal;
};

const observeLazyImages = () => {
  const lazyImages = document.querySelectorAll('.lazy-load:not(.loaded)');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.onload = () => img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => observer.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver support
    lazyImages.forEach((img) => {
      img.src = img.getAttribute('data-src');
      img.onload = () => img.classList.add('loaded');
    });
  }
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
