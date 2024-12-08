require('./main');

describe.skip('Main.js Functions', () => {
    beforeEach(() => {
        // Reset the state before each test
        state.genres = {};
        state.movies = [];
        state.searchMovies = [];
        state.clickedMovie = null;
        global.fetch = jest.fn(); // Mock the global fetch function
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('fetchGenres', () => {
        it('should fetch genres and update state.genres', async () => {
            const mockGenres = {
                genres: [
                    { id: 1, name: 'Action' },
                    { id: 2, name: 'Comedy' },
                ],
            };
            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockGenres),
            });

            await MainUtils.fetchGenres();

            expect(fetch).toHaveBeenCalledWith('undefined'); // Replace 'undefined' with your actual genreUrl variable
            expect(state.genres).toEqual({
                1: 'Action',
                2: 'Comedy',
            });
        });

        it('should handle errors gracefully', async () => {
            fetch.mockRejectedValueOnce(new Error('Network Error'));

            await MainUtils.fetchGenres();

            expect(state.genres).toEqual({}); // No changes to the state
        });
    });

    describe('fetchMovie', () => {
        it('should fetch detailed movie data and return an object', async () => {
            const mockMovie = { id: 1, title: 'Sample Movie' };
            const mockVideos = { results: [{ type: 'Trailer', key: 'trailerKey' }] };
            const mockReviews = { results: [{ content: 'Great movie!' }] };
            const mockSimilar = { results: [{ id: 2, title: 'Similar Movie' }] };

            fetch
                .mockResolvedValueOnce({ json: jest.fn().mockResolvedValueOnce(mockMovie) })
                .mockResolvedValueOnce({ json: jest.fn().mockResolvedValueOnce(mockVideos) })
                .mockResolvedValueOnce({ json: jest.fn().mockResolvedValueOnce(mockReviews) })
                .mockResolvedValueOnce({ json: jest.fn().mockResolvedValueOnce(mockSimilar) });

            const result = await fetchMovie(1);

            expect(fetch).toHaveBeenCalledTimes(4);
            expect(result).toEqual({
                movie: mockMovie,
                trailer: mockVideos.results[0],
                reviews: mockReviews.results,
                similar: mockSimilar.results,
            });
        });

        it('should return null if an error occurs', async () => {
            fetch.mockRejectedValueOnce(new Error('Network Error'));

            const result = await fetchMovie(1);

            expect(result).toBeNull();
        });
    });

    describe('fetchMovies', () => {
        beforeEach(() => {
            // Simulate the search box in the DOM
            document.body.innerHTML = `<input id="query" value="" />`;
        });

        it('should fetch movies and update state.movies if no search query', async () => {
            const mockMovies = {
                page: 1,
                results: [{ id: 1, title: 'Now Playing' }],
            };
            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockMovies),
            });

            await fetchMovies();

            expect(fetch).toHaveBeenCalledWith('undefined'); // Replace 'undefined' with your actual nowPlayingUrl variable
            expect(state.movies).toEqual([
                { page: 1, movieList: mockMovies.results },
            ]);
        });

        it('should fetch movies and update state.searchMovies if search query is provided', async () => {
            document.getElementById('query').value = 'searchTerm';

            const mockSearchMovies = {
                page: 1,
                results: [{ id: 2, title: 'Searched Movie' }],
            };
            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockSearchMovies),
            });

            await fetchMovies();

            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('query=searchTerm'));
            expect(state.searchMovies).toEqual([
                { page: 1, movieList: mockSearchMovies.results },
            ]);
        });

        it('should handle errors gracefully', async () => {
            fetch.mockRejectedValueOnce(new Error('Network Error'));

            await fetchMovies();

            expect(state.movies).toEqual([]);
            expect(state.searchMovies).toEqual([]);
        });
    });
});
