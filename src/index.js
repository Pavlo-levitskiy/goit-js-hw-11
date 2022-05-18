import "./sass/main.scss";
import Notiflix from "notiflix";
import "simplelightbox/dist/simple-lightbox.min.css";
import {
  fetchGallery,
  incrementPage,
  page,
  resetPage,
} from "./services/api-service";

const perPage = 40;
let inputText = "";

const refs = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("input[name$='searchQuery']"),
  submitBtn: document.querySelector("button[type$='submit']"),
  gallery: document.querySelector(".gallery"),
  loadMore: document.querySelector(".load-more"),
};

const addBtn = () => {
  refs.loadMore.classList.remove("visually-hidden");
};
const removeBtn = () => {
  refs.loadMore.classList.add("visually-hidden");
};

removeBtn();
function getImages(e) {
  e.preventDefault();
  resetPage();
  clearCardList();
  inputText = refs.input.value.trim();
  if (!e.target.tagName === "BUTTON") return;
  if (inputText.length === 0) {
    Notiflix.Notify.failure(
      "Sorry, there are no images matching your search query. Please try again."
    );
    return removeBtn();
  }
  fetchGallery(inputText)
    .then(({ hits, total, totalHits }) => {
      createImagesMarkup(hits);
      let pageValue = total / perPage;
      addBtn();
      if (total === 0) {
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
        return removeBtn();
      }
      if (page >= pageValue) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return removeBtn();
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      incrementPage();
    })
    .catch((error) => {
      Notiflix.Notify.failure(error.message);
    });
}

refs.form.addEventListener("submit", getImages);
refs.loadMore.addEventListener("click", loadImages);

function clearCardList() {
  refs.gallery.innerHTML = "";
}

function loadImages() {
  fetchGallery(inputText)
    .then(({ hits, total, totalHits }) => {
      let pageValue = total / perPage;
      createImagesMarkup(hits);
      incrementPage();
      if (page >= pageValue) {
        removeBtn();
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch((error) => {
      Notiflix.Notify.failure(error.message);
    });
}

const createImagesMarkup = (images) => {
  const markup = images
    .map(
      (image) => `
  <div class="card ">
    <a href="${image.webformatURL}">
      <img src="${image.largeImageURL}" width="280" height="220" alt="${image.tags}" loading="lazy"/>
    </a>
    <ul class="info-list">
      <li class="info-item">
        <h3>Likes</h3>
        <p>${image.likes}</p>
      </li>
      <li class="info-item">
        <h3>Views</h3>
        <p>${image.views}</p>
      </li>
      <li class="info-item">
        <h3>Comments</h3>
        <p>${image.comments}</p>
      </li>
      <li class="info-item">
        <h3>Downloads</h3>
        <p>${image.downloads}</p>
      </li>
    </ul>
  </div>
  `
    )
    .join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup);
};
