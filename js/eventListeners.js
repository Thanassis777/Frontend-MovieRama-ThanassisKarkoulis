const searchBox = document.getElementById("query");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");

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
    if (event.key === "Escape") {
        const modal = document.querySelector(".modal");
        const modalOverlay = document.querySelector(".modal-overlay");

        if (modal && modalOverlay) {
            closeModal(modal, modalOverlay);
        }
    }
});

window.addEventListener("scroll", () => {
    const isAtBottom = isScrolledToBottom();
    const throttledFetching = throttle(fetchMovies, 1000);

    if (isAtBottom) {
        throttledFetching();
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
