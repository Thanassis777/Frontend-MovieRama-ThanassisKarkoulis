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
    try {
        const [movieData, videoData, reviewsData, similarData] = await Promise.all([
            fetch(`${searchMovieUrl}/${id}?api_key=${apiKey}`).then(res => res.json()),
            fetch(`${searchMovieUrl}/${id}/videos?api_key=${apiKey}`).then(res => res.json()),
            fetch(`${searchMovieUrl}/${id}/reviews?api_key=${apiKey}`).then(res => res.json()),
            fetch(`${searchMovieUrl}/${id}/similar?api_key=${apiKey}`).then(res => res.json()),
        ]);

        const videoTrailer = videoData.results.find(result => result.type === "Trailer");
        const reviews = reviewsData.results.slice(0, 2);
        const similar = similarData.results.slice(0, 7);

        return { movie: movieData, trailer: videoTrailer, reviews, similar };
    } catch (error) {
        handleFetchError(error);
        return null;
    }
};

const fetchMovies = async () => {
    const searchBox = document.getElementById("query");

    try {
        let response;

        if (searchBox.value) {
            response = await fetch(`${searchUrl}?query=${searchBox.value}&page=${state.searchMovies.length + 1}&api_key=${apiKey}`);
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

main();
