const searchBox = document.getElementById("query");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");

const moviesTitle = document.querySelector(".movies-title");
moviesTitle.innerHTML = "Playing Now";

const handleSearch = debounce(async () => {
    const searchTerm = document.getElementById("query").value;

    await fetchMovies(searchTerm);
}, 500);

searchBox.addEventListener("input", (event) => {
    event.preventDefault();

    const movieListContainer = document.querySelector(".movie-list-container");

    const searchTerm = event.target.value;
    movieListContainer.innerHTML = "";

    resetState();
    searchTerm
        ? (moviesTitle.innerHTML = "Search results:")
        : (moviesTitle.innerHTML = "Playing Now");

    handleSearch()
});

searchBox.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const modal = document.querySelector(".modal");
        const modalOverlay = document.querySelector(".modal-overlay");

        if (modal && modalOverlay) {
            closeModal(modal, modalOverlay);
        }
    }
});

const throttledFetchMovies = throttle(async () => {
    await fetchMovies();
}, 1000);

window.addEventListener("scroll", () => {
    const isAtBottom = isScrolledToBottom();

    if (isAtBottom) {
        throttledFetchMovies(); // Use the pre-defined throttled function
    }
});

// Dynamically adjust modal size and position on window resize
window.addEventListener("resize", () => {
    if (modal) {
        modal.style.maxHeight = "80vh";
        modal.style.top = "50%";
        modal.style.transform = "translate(-50%, -50%)";
    }
});

// Adjust close button to use the smooth close
document.addEventListener("click", (event) => {
    if (event.target.matches(".close-modal")) {
        closeModal(modal, modalOverlay);
    }
});
