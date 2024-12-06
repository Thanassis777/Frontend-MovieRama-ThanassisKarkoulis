const searchBox = document.getElementById("query");

const moviesTitle = document.querySelector(".movies-title");
moviesTitle.innerHTML = "Playing Now";

searchBox.addEventListener("input", (event) => {
    const movieListContainer = document.querySelector(".movie-list-container");

    event.preventDefault();

    const searchTerm = event.target.value;
    movieListContainer.innerHTML = "";

    resetState();
    searchTerm
        ? (moviesTitle.innerHTML = "Search results:")
        : (moviesTitle.innerHTML = "Playing Now");

    debounce(fetchMovies, 1000)();
});

searchBox.addEventListener("keypress", (event) => {
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

window.addEventListener("scroll", () => {
    const isAtBottom = isScrolledToBottom();
    if (isAtBottom) {
        throttledFetching();
    }
});
