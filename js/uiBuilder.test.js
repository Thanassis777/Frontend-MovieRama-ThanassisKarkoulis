require('./uiBuilder');
require('./main');

jest.mock('./main', () => ({
    fetchMovie: jest.fn(),
}));
jest.mock('./utils', () => ({
    handleFetchError: jest.fn(),
}));

describe.skip('UI Builder Functions', () => {
    beforeEach(() => {
        // Clear mocks and reset DOM before each test
        jest.clearAllMocks();
        document.body.innerHTML = `
            <div id="query"></div>
            <div class="movie-list-container"></div>
        `;
        global.state = {
            searchMovies: [],
            movies: [],
            genres: {},
        };
    });

    describe('handleModal', () => {
        it.only('should fetch movie data and create a modal', async () => {
            // Mock movie data
            const mockMovieData = {
                movie: { id: 1, title: 'Sample Movie' },
                trailer: { key: 'trailerKey' },
                reviews: [],
                similar: [],
            };
            MainUtils.fetchMovie.mockResolvedValue(mockMovieData);

            // Mock the DOM methods used in the function
            const appendChildMock = jest.fn();
            const modalMock = document.createElement('div');
            modalMock.appendChild = appendChildMock;
            document.querySelector = jest.fn().mockImplementation((selector) => {
                if (selector === '.main-container') return modalMock;
                return null;
            });

            await BuilderUtils.handleModal(1);

            expect(fetchMovie).toHaveBeenCalledWith(1);
            expect(appendChildMock).toHaveBeenCalled(); // Ensures modal was appended
        });

        it('should handle fetch errors gracefully', async () => {
            fetchMovie.mockRejectedValue(new Error('Network Error'));

            await BuilderUtils.handleModal(1);

            expect(handleFetchError).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    // describe('renderMovies', () => {
    //     it('should display "No results found" message when no movies exist', () => {
    //         const searchBox = document.getElementById('query');
    //         searchBox.value = ''; // Simulate no search query
    //         global.state.movies = [];
    //         global.state.searchMovies = [];
    //
    //         renderMovies();
    //
    //         const container = document.querySelector('.movie-list-container');
    //         expect(container.innerHTML).toContain('No results found');
    //     });
    //
    //     it('should render movies from the state', () => {
    //         const mockMovies = [
    //             { id: 1, title: 'Movie 1', genre_ids: [], vote_average: 8.0, backdrop_path: '', release_date: '2022-01-01', overview: 'Overview 1' },
    //             { id: 2, title: 'Movie 2', genre_ids: [], vote_average: 7.5, backdrop_path: '', release_date: '2022-01-02', overview: 'Overview 2' },
    //         ];
    //         global.state.movies = [{ page: 1, movieList: mockMovies }];
    //         const container = document.querySelector('.movie-list-container');
    //
    //         renderMovies();
    //
    //         expect(container.innerHTML).toContain('Movie 1');
    //         expect(container.innerHTML).toContain('Movie 2');
    //     });
    //
    //     it('should observe lazy-loaded images', () => {
    //         const observeLazyImages = jest.fn();
    //         global.observeLazyImages = observeLazyImages;
    //
    //         const mockMovies = [
    //             { id: 1, title: 'Movie 1', genre_ids: [], vote_average: 8.0, backdrop_path: '', release_date: '2022-01-01', overview: 'Overview 1' },
    //         ];
    //         global.state.movies = [{ page: 1, movieList: mockMovies }];
    //
    //         renderMovies();
    //
    //         expect(observeLazyImages).toHaveBeenCalled();
    //     });
    // });
});
