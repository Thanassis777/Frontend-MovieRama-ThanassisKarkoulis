require('./utils');

describe('Utils functions', () => {
    // Test for getImage
    describe('getImage', () => {
        it('getImage should return placeholder for null/undefined image', () => {
            expect(Utils.getImage(null)).toBe('./assets/icons/noImage.png');
            expect(Utils.getImage(undefined)).toBe('./assets/icons/noImage.png');
        });

        it('getImage should return valid image URL when image path is provided', () => {
            expect(Utils.getImage('path/to/image.jpg')).toBe('https://image.tmdb.org/t/p/w500/path/to/image.jpg');
        });
    });

    // Test for throttle
    describe('throttle', () => {
        jest.useFakeTimers();

        it('should call the throttled function at most once within the delay', () => {
            const mockCallback = jest.fn();
            const throttledFunction = Utils.throttle(mockCallback, 1000);

            throttledFunction();
            throttledFunction();
            jest.advanceTimersByTime(500);
            throttledFunction();
            jest.advanceTimersByTime(1000);

            expect(mockCallback).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(1000);
            throttledFunction();
            expect(mockCallback).toHaveBeenCalledTimes(2);
        });
    });

    // Test for debounce
    describe('debounce', () => {
        jest.useFakeTimers();

        it('should call the debounced function after the specified delay', () => {
            const mockCallback = jest.fn();
            const debouncedFunction = Utils.debounce(mockCallback, 1000);

            debouncedFunction();
            expect(mockCallback).not.toHaveBeenCalled();
            jest.advanceTimersByTime(1000);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });

        it('should reset the delay if the function is called again within the delay period', () => {
            const mockCallback = jest.fn();
            const debouncedFunction = Utils.debounce(mockCallback, 1000);

            debouncedFunction();
            jest.advanceTimersByTime(500);
            debouncedFunction();
            jest.advanceTimersByTime(500);
            expect(mockCallback).not.toHaveBeenCalled();
            jest.advanceTimersByTime(500);
            expect(mockCallback).toHaveBeenCalledTimes(1);
        });
    });

    // Test for isScrolledToBottom
    describe('isScrolledToBottom', () => {
        it('should return true if scrolled to the bottom of the page', () => {
            global.window = {
                scrollY: 500,
                innerHeight: 500,
                document: {
                    body: { scrollHeight: 1000 },
                },
            };

            expect(Utils.isScrolledToBottom()).toBe(true);
        });
    });

    // Test for resetState
    describe('resetState', () => {
        it('should reset state.movies and state.searchMovies arrays', () => {
            global.state = { movies: [1, 2, 3], searchMovies: [4, 5, 6] };
            Utils.resetState();
            expect(state.movies).toEqual([]);
            expect(state.searchMovies).toEqual([]);
        });
    });

    // Test for handleFetchError
    describe('handleFetchError', () => {
        jest.useFakeTimers();

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should not retry if retries is 0', () => {
            const mockAlert = jest.fn();
            global.alert = mockAlert;

            const mockError = new Error('Test error');
            const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
            const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

            Utils.handleFetchError(mockError, 0);

            // Ensure console.warn is never called
            expect(spyWarn).not.toHaveBeenCalled();

            // Ensure console.error is called immediately
            expect(spyError).toHaveBeenCalledTimes(1);
            expect(spyError).toHaveBeenCalledWith('Error fetching data:', mockError);

            // Ensure alert is called immediately
            expect(mockAlert).toHaveBeenCalledWith('Something went wrong. Please try again later.');
        });
    });

    // Test for lazyLoadImage
    describe('lazyLoadImage', () => {
        it('should set the src to the loading placeholder and add the "movie-lazy-load" class', () => {
            const img = document.createElement('img');
            const src = 'https://example.com/sample.jpg';

            Utils.lazyLoadImage(img, src);
            expect(img.src).toContain('https://example.com/sample.jpg');
            expect(img.classList).toContain('movie-lazy-load');
            expect(img.getAttribute('data-src')).toBe(src);
        });
    });
});

