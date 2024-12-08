const searchBox = document.getElementById("query");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const movieListContainer = document.querySelector(".movie-list-container");

const moviesTitle = document.querySelector(".movies-title");
moviesTitle.innerHTML = "Playing Now";

const debouncedSearchHandler = debounce(async () => {
    try {
        const searchTerm = document.getElementById("query").value;
        await fetchMovies(searchTerm);
    } catch (error) {
        handleFetchError(error);
    }
}, 500);

const resetSearch = (searchTerm) => {
    movieListContainer.innerHTML = "";
    resetState();
    moviesTitle.innerHTML = searchTerm ? "Search results:" : "Playing Now";
};

searchBox.addEventListener("input", (event) => {
    event.preventDefault();

    const searchTerm = event.target.value;
    resetSearch(searchTerm);
    debouncedSearchHandler();
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
    try {
        await fetchMovies();
    } catch (error) {
        handleFetchError(error);
    }
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
