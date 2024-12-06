// Toggle Dark Mode
const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
};

// Add a button to toggle dark mode
const createDarkModeButton = () => {
    const header = document.querySelector(".header");
    const button = document.createElement("button");

    button.textContent = "Dark Mode";
    button.classList.add("dark-mode-toggle");
    button.addEventListener("click", toggleDarkMode);
    header.appendChild(button);
};

createDarkModeButton();
