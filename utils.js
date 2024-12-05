const getImage = (image) => {
  return image
    ? `https://image.tmdb.org/t/p/w500/${image}` // Use smaller image for performance
    : "./assets/icons/noImage.png";
};

const throttle = (callback, delay = 1000) => {
  let lastCalledTime = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCalledTime >= delay) {
      callback(...args);
      lastCalledTime = now;
    }
  };
};

const debounce = (callback, delay = 1000) => {
  let time;
  return (...args) => {
    clearTimeout(time);
    time = setTimeout(() => callback(...args), delay);
  };
};

const createYouTubeIframe = (videoId) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.width = 640;
  iframe.height = 390;
  return iframe;
};

const isScrolledToBottom = () => {
  return window.scrollY + window.innerHeight >= document.body.scrollHeight - 50; // Add offset for accuracy
};

const resetState = () => {
  state.movies = [];
  state.searchMovies = [];
};

const handleFetchError = (error) => {
  console.error("Error fetching data:", error);
  alert("Something went wrong. Please try again later.");
};
