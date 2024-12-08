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
});
