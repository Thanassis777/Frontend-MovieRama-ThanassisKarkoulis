const apiKey = "bc50218d91157b1ba4f142ef7baaa6a0";
const baseUrl = "https://api.themoviedb.org/3/";

const endpoints = {
    nowPlaying: `${baseUrl}movie/now_playing?api_key=${apiKey}`,
    genreList: `${baseUrl}genre/movie/list?api_key=${apiKey}`,
    searchMovie: `${baseUrl}search/movie`,
    movieDetails: `${baseUrl}movie`,
};
