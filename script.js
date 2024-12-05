const apiKey = "bc50218d91157b1ba4f142ef7baaa6a0";
const baseUrl = `https://api.themoviedb.org/3/`;
const nowPlayingUrl = `${baseUrl}movie/now_playing?api_key=${apiKey}`;
const genreUrl = `${baseUrl}genre/movie/list?api_key=${apiKey}`;
const searchUrl = `${baseUrl}search/movie`;
const searchMovieUrl = `${baseUrl}movie`;

const searchbox = document.getElementById("query");
const modal = document.querySelector(".modal");
const mainContainer = document.querySelector(".main-container");
const closeModalBtn = document.querySelector(".close-modal");
const moviesContainer = document.querySelector(".movies");
const moviesTitle = document.querySelector(".movies-title");
const movieListContainer = document.querySelector(".movie-list-container");

moviesTitle.innerHTML = "Playing Now";

//single source of truth
const state = {
    genres: {},
    movies: [],
    searchMovies: [],
    clickedMovie: null,
};


const fetchGenres = async () => {
    try {
        const response = await fetch(genreUrl);
        const data = await response.json();
        const returnVal = {};
        data.genres.forEach(({id, name}) => (returnVal[id] = name));

        state.genres = returnVal;
    } catch (error) {
        handleFetchError(error);
    }
};

const fetchMovie = async (id) => {
    const movieRes = await fetch(`${searchMovieUrl}/${id}?api_key=${apiKey}`);
    const movieData = await movieRes.json();

    const movieVideoRes = await fetch(
        `${searchMovieUrl}/${id}/videos?api_key=${apiKey}`
    );
    const videoData = await movieVideoRes.json();

    const reviewsRes = await fetch(
        `${searchMovieUrl}/${id}/reviews?api_key=${apiKey}`
    );
    const reviewsData = await reviewsRes.json();

    const similarsRes = await fetch(
        `${searchMovieUrl}/${id}/similar?api_key=${apiKey}`
    );
    const similarData = await similarsRes.json();

    const videoTrailer = videoData.results.find(
        (result) => result.type === "Trailer"
    );
    const reviews = reviewsData.results.slice(0, 2);
    const similar = similarData.results.slice(0, 7);

    return {movie: movieData, trailer: videoTrailer, reviews, similar};
};

const fetchMovies = async () => {
    try {
        let response;

        if (searchbox.value) {
            response = await fetch(
                `${searchUrl}?query=${searchbox.value}&page=${
                    state.searchMovies.length + 1
                }&api_key=${apiKey}`
            );
            const data = await response.json();

            state.searchMovies = [
                ...state.searchMovies,
                {page: data.page, movieList: data.results},
            ];
        } else {
            response = await fetch(nowPlayingUrl + `&page=${state.movies.length + 1}`);
            const data = await response.json();
            state.movies = [
                ...state.movies,
                {page: data.page, movieList: data.results},
            ];
        }

        renderMovies();
    } catch (error) {
        handleFetchError(error);
    }

};

const main = async () => {
    await fetchGenres();
    await fetchMovies();
};

const throttledFetching = throttle(fetchMovies, 1000);

window.addEventListener("scroll", () => {
    const isAtBottom = isScrolledToBottom();
    if (isAtBottom) {
        throttledFetching();
    }
});

searchbox.addEventListener("input", (event) => {
    event.preventDefault();
    const searchTerm = event.target.value;
    movieListContainer.innerHTML = "";
    resetState();
    searchTerm
        ? (moviesTitle.innerHTML = "Search results:")
        : (moviesTitle.innerHTML = "Playing Now");

    debounce(fetchMovies, 1000)();
});

searchbox.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});

document.addEventListener("keydown", (event) => {
    const modal = document.querySelector(".modal");
    if (event.key === "Escape" && modal) {
        modal.remove();
    }
});

main();
