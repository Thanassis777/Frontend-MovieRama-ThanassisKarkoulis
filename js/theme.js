/**
 * Toggles the dark mode class on the body element.
 * Updates the text content of the dark mode toggle button
 * to indicate the current mode ("Dark Mode" or "Light Mode").
 */
const toggleDarkMode = () => {
    const body = document.body;
    const button = document.querySelector(".dark-mode-toggle");

    // Toggle the dark mode class on the body
    body.classList.toggle("dark-mode");

    // Update button text
    if (body.classList.contains("dark-mode")) {
        button.textContent = "Light Mode";
    } else {
        button.textContent = "Dark Mode";
    }
};

/**
 * Creates and appends a button to toggle dark mode to the header.
 * The button listens for click events to toggle dark mode using `toggleDarkMode`.
 */
const createDarkModeButton = () => {
    const header = document.querySelector(".header");
    const button = document.createElement("button");

    button.textContent = "Dark Mode"; // Default text
    button.classList.add("dark-mode-toggle");
    button.addEventListener("click", toggleDarkMode);
    header?.appendChild(button);
};

// Initialize the dark mode toggle button
createDarkModeButton();


// For Testing
const ThemeUtils = {
    createDarkModeButton,
    toggleDarkMode,
};

if (typeof window !== 'undefined') {
    window.ThemeUtils = ThemeUtils;
} else if (typeof global !== 'undefined') {
    global.ThemeUtils = ThemeUtils;
}
