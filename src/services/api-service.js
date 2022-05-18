const API_KEY = "27487139-e524d10819fee38ea9f4aa544";
const GALLERY_URL = `https://pixabay.com/api/?key=${API_KEY}`;

let page = 1;
const incrementPage = () => (page += 1);
const resetPage = () => (page = 1);

const fetchGallery = (name) => {
  return fetch(
    `${GALLERY_URL}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  )
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error(error));
      }
      return response.json();
    })
    .then((data) => data);
};

export { fetchGallery, incrementPage, resetPage, page };
