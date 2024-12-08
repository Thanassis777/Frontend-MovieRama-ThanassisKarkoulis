/**
 * @constant {Object} state
 * Stores the application's global state, including genres, movies, search results, and the currently selected movie.
 * @property {Object} genres - A map of genre IDs to genre names.
 * @property {Array} movies - List of movies currently in theaters.
 * @property {Array} searchMovies - List of movies resulting from a search query.
 * @property {Object|null} clickedMovie - Details of the currently clicked movie.
 */
const state = {
    genres: {},
    movies: [],
    searchMovies: [],
    clickedMovie: null,
};

/**
 * Fetches and stores the list of movie genres from the API.
 * Updates the `state.genres` object with a mapping of genre IDs to genre names.
 * @async
 * @function fetchGenres
 * @returns {Promise<void>}
 */
const fetchGenres = async () => {
    try {
        const response = await fetch(genreUrl);
        const data = await response.json();

        const returnVal = {};
        data.genres.forEach(({ id, name }) => (returnVal[id] = name));

        state.genres = returnVal;
    } catch (error) {
        handleFetchError(error);
    }
};

/**
 * Fetches detailed information about a specific movie, including its trailer, reviews, and similar movies.
 * @async
 * @function fetchMovie
 * @param {number} id - The ID of the movie to fetch.
 * @returns {Promise<Object|null>} A detailed movie object, or `null` if the fetch fails.
 * @property {Object} movie - Detailed information about the movie.
 * @property {Object|null} trailer - Trailer data if available, otherwise `null`.
 * @property {Array} reviews - Array of up to 2 reviews for the movie.
 * @property {Array} similar - Array of up to 8 similar movies.
 */
const fetchMovie = async (id) => {
    try {
        const [movieData, videoData, reviewsData, similarData] = await Promise.all([
            fetch(`${searchMovieUrl}/${id}?api_key=${apiKey}`).then((res) => res.json()),
            fetch(`${searchMovieUrl}/${id}/videos?api_key=${apiKey}`).then((res) => res.json()),
            fetch(`${searchMovieUrl}/${id}/reviews?api_key=${apiKey}`).then((res) => res.json()),
            fetch(`${searchMovieUrl}/${id}/similar?api_key=${apiKey}`).then((res) => res.json()),
        ]);

        const videoTrailer = videoData.results.find((result) => result.type === "Trailer");
        const reviews = reviewsData.results.slice(0, 2);
        const similar = similarData.results.slice(0, 8);

        return { movie: movieData, trailer: videoTrailer, reviews, similar };
    } catch (error) {
        handleFetchError(error);
        return null;
    }
};

/**
 * Fetches movies either in theaters or based on the search query, using pagination for infinite scrolling.
 * Updates the global state with fetched movies and triggers rendering of the movie list.
 * @async
 * @function fetchMovies
 * @returns {Promise<void>}
 */
const fetchMovies = async () => {
    const searchBox = document.getElementById("query");

    try {
        let response;

        if (searchBox.value) {
            response = await fetch(
                `${searchUrl}?query=${searchBox.value}&page=${state.searchMovies.length + 1}&api_key=${apiKey}`
            );
            const data = await response.json();

            state.searchMovies = [
                ...state.searchMovies,
                { page: data.page, movieList: data.results },
            ];
        } else {
            response = await fetch(`${nowPlayingUrl}&page=${state.movies.length + 1}`);
            const data = await response.json();

            state.movies = [
                ...state.movies,
                { page: data.page, movieList: data.results },
            ];
        }

        renderMovies();
    } catch (error) {
        handleFetchError(error);
    }
};

/**
 * Initializes the application by fetching genres and the initial set of movies.
 * @async
 * @function main
 * @returns {Promise<void>}
 */
const main = async () => {
    await fetchGenres();
    await fetchMovies();
};

// Start the application
main();
