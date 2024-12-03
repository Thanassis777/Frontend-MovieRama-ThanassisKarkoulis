const getImage = (image) => {
  return image
    ? `https://image.tmdb.org/t/p/original/${image}`
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
    time = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const createYouTubeIframe = (videoId) => {
  const iframe = document.createElement("iframe");

  iframe.src = `https://www.youtube.com/embed/${videoId}`;

  iframe.frameborder = 0;

  iframe.allowfullscreen = true;
  iframe.width = 640;
  iframe.height = 390;

  return iframe;
};

const isScrolledToBottom = () => {
  const scrolledPosition = window.scrollY + window.innerHeight;
  const scrollHeight = document.body.scrollHeight;

  return scrolledPosition >= scrollHeight;
};

const resetState = () => {
  state.movies = [];
  state.searchMovies = [];
};
