const searchBox = document.getElementById("query");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const movieListContainer = document.querySelector(".movie-list-container");

const moviesTitle = document.querySelector(".movies-title");
moviesTitle.innerHTML = "Playing Now";

/**
 * Handles debounced search input from the user.
 * Fetches movies based on the search term entered the search box.
 * The function is debounced to reduce frequent API calls during user input.
 */
const debouncedSearchHandler = debounce(async () => {
    try {
        const searchTerm = document.getElementById("query").value;
        await fetchMovies(searchTerm);
    } catch (error) {
        handleFetchError(error);
    }
}, 500);

/**
 * Resets the search results and updates the title based on the search term.
 *
 * @param {string} searchTerm - The search term entered by the user.
 */
const resetSearch = (searchTerm) => {
    movieListContainer.innerHTML = "";
    resetState();
    moviesTitle.innerHTML = searchTerm ? "Search results:" : "Playing Now";
};

/**
 * Event listener for input event on the search box.
 * Resets the search and triggers the debounced search handler.
 *
 * @param {InputEvent} event - The input event triggered by typing in the search box.
 */
searchBox.addEventListener("input", (event) => {
    event.preventDefault();

    const searchTerm = event.target.value;
    resetSearch(searchTerm);
    debouncedSearchHandler();
});

/**
 * Prevents the default behavior when the Enter key is pressed inside the search box.
 *
 * @param {KeyboardEvent} event - The keypress event triggered by user input.
 */
searchBox.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
    }
});

/**
 * Closes the modal when the Escape key is pressed.
 *
 * @param {KeyboardEvent} event - The keydown event triggered by the user pressing a key.
 */
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const modal = document.querySelector(".modal");
        const modalOverlay = document.querySelector(".modal-overlay");

        if (modal && modalOverlay) {
            closeModal(modal, modalOverlay);
        }
    }
});

/**
 * Fetches more movies when the user scrolls to the bottom of the page.
 * The function is throttled to avoid excessive API calls during fast scrolling.
 */
const throttledFetchMovies = throttle(async () => {
    try {
        await fetchMovies();
    } catch (error) {
        handleFetchError(error);
    }
}, 1000);

/**
 * Event listener for the scroll event.
 * Checks if the user has scrolled to the bottom and triggers throttled movie fetching.
 */
window.addEventListener("scroll", () => {
    const isAtBottom = isScrolledToBottom();

    if (isAtBottom) {
        throttledFetchMovies();
    }
});

/**
 * Dynamically adjusts the size and position of the modal on window resize.
 */
window.addEventListener("resize", () => {
    if (modal) {
        modal.style.maxHeight = "80vh";
        modal.style.top = "50%";
        modal.style.transform = "translate(-50%, -50%)";
    }
});

/**
 * Handles click events on the document.
 * Closes the modal if the close button is clicked.
 *
 * @param {MouseEvent} event - The click event triggered on the document.
 */
document.addEventListener("click", (event) => {
    if (event.target.matches(".close-modal")) {
        closeModal(modal, modalOverlay);
    }
});
