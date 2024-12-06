// Toggle Dark Mode
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

// Add a button to toggle dark mode
const createDarkModeButton = () => {
    const header = document.querySelector(".header");
    const button = document.createElement("button");

    button.textContent = "Dark Mode"; // Default text
    button.classList.add("dark-mode-toggle");
    button.addEventListener("click", toggleDarkMode);
    header.appendChild(button);
};

createDarkModeButton();
