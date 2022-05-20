import "./sass/main.scss";
import SimpleLightbox from 'simplelightbox';
import Notiflix from "notiflix";
import "simplelightbox/dist/simple-lightbox.min.css";
import card from './card.hbs';
import {
  fetchGallery,
  fetchParams,
} from "./services/api-service.js";


const refs = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("input[name$='searchQuery']"),
  submitBtn: document.querySelector("button[type$='submit']"),
  gallery: document.querySelector(".gallery"),
  loadMore: document.querySelector(".load-more"),
};

const incrementPage = () => (fetchParams.page += 1);
 const resetPage = () => (fetchParams.page = 1);

const addBtn = () => {
  refs.loadMore.classList.remove("visually-hidden");
};
const removeBtn = () => {
  refs.loadMore.classList.add("visually-hidden");
};

removeBtn();

let ligthbox = null;
const getImages = e => {
  e.preventDefault();
   resetPage();
   clearCardList();
   if (!refs.input.value) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );

    return;
  }

  fetchParams.page = 1;
 fetchParams.q = refs.input.value.trim();
  fetchGallery(fetchParams)
    .then(data => {
      createImagesMarkup(data.hits);
     ligthbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    animationSpeed: 210,
    fadeSpeed: 210,
        });
      let pageValue = data.total / fetchParams.per_page;
      incrementPage();
      addBtn();
 Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      
      if (data.total === 0) {
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
        return removeBtn();
      }
      if (fetchParams.page >= pageValue) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results.");
        return removeBtn();
      }
    }).catch((error) => {
      Notiflix.Notify.failure(error.message);
    });
}
 
refs.form.addEventListener("submit", getImages);
refs.loadMore.addEventListener("click", loadImages);

function clearCardList() {
  refs.gallery.innerHTML = "";
}

function loadImages() {
  fetchGallery(fetchParams)
    .then(data => {
      let pageValue = data.total /fetchParams.per_page;
      createImagesMarkup(data.hits);
      incrementPage();
      if (fetchParams.page >= pageValue) {
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


function createImagesMarkup (images){
  const markup = card(images);
  refs.gallery.insertAdjacentHTML("beforeend", markup);
return markup;
};
