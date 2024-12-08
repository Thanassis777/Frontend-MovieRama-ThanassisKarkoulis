# Frontend-MovieRama-ThanassisKarkoulis

**Overview**

MovieRama is a client-side single-page application designed as a movie catalog. It allows users to explore current movies in theaters, search for movies across a larger database, and view detailed information about individual movies.

**Features**

1. Browse a list of movies currently playing in theaters with infinite scrolling for a seamless experience.
2. Search: Perform dynamic searches for movies across a broader dataset as users type in the search bar.
3. Movie Details: 
   - Expand a movie item to view detailed information, including:
   - Video trailers (if available)
   - Reviews (up to 2)
   - Similar movies



**API Integration**

- **The Movie Database (TMDB) API:**

  - /movie/now_playing: Fetches movies currently in theaters.

  - /genre/movie/list: Retrieves movie genres.
  - /search/movie: Searches for movies based on a query.
  - /movie/{movie_id}: Provides detailed information about a movie, including:
  - /videos: Fetches trailers.
  - /reviews: Fetches reviews.
  - /similar: Fetches similar movies.

**How to Run**

Clone the repository to your local environment.

Open **index.html** in any modern browser (no server setup required).