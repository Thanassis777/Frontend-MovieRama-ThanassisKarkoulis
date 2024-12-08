require('./theme');

describe('Dark Mode Functions', () => {
    beforeEach(() => {
        // Set up a minimal DOM structure for testing
        document.body.innerHTML = `
      <div class="header"></div>
    `;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('toggleDarkMode', () => {
        it('should add the dark-mode class to the body and update button text to "Light Mode"', () => {
            // Set up a button in the DOM
            const button = document.createElement('button');
            button.classList.add('dark-mode-toggle');
            document.body.appendChild(button);

            // Call the function
            ThemeUtils.toggleDarkMode();

            // Assertions
            expect(document.body.classList.contains('dark-mode')).toBe(true);
            expect(button.textContent).toBe('Light Mode');
        });

        it('should remove the dark-mode class from the body and update button text to "Dark Mode"', () => {
            // Set up a button and enable dark mode
            const button = document.createElement('button');
            button.classList.add('dark-mode-toggle');
            document.body.appendChild(button);
            document.body.classList.add('dark-mode'); // Start in dark mode

            // Call the function
            ThemeUtils.toggleDarkMode();

            // Assertions
            expect(document.body.classList.contains('dark-mode')).toBe(false);
            expect(button.textContent).toBe('Dark Mode');
        });
    });

    describe('createDarkModeButton', () => {
        it('should create a button and append it to the header', () => {
            // Ensure the header exists
            const header = document.querySelector('.header');
            expect(header).not.toBeNull();

            ThemeUtils.createDarkModeButton();

            // Assertions
            const button = document.querySelector('.dark-mode-toggle');
            expect(button).not.toBeNull();
            expect(button.textContent).toBe('Dark Mode');
        });

        it('should toggle dark mode when the button is clicked', () => {
            ThemeUtils.createDarkModeButton();

            const button = document.querySelector('.dark-mode-toggle');

            // Simulate a button click
            button.click();

            // Assertions
            expect(document.body.classList.contains('dark-mode')).toBe(true);
            expect(button.textContent).toBe('Light Mode');

            // Simulate another click
            button.click();

            // Assertions
            expect(document.body.classList.contains('dark-mode')).toBe(false);
            expect(button.textContent).toBe('Dark Mode');
        });
    });
});
