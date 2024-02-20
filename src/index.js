import axios from 'axios';
import Notiflix from 'notiflix';

// const axios = require('axios').default;

const API_KEY = '42458788-a8c12bb6253815950dff0c06c';
const BASE_URL = 'https://pixabay.com/api/';
let queryString = '';
const SEARCH_TERM = queryString.split(' ').join('+');

const photoCard = document.querySelector('.photo-card');
const searchInput = document.querySelector('[data-search]');
searchInput.addEventListener('input', event => {
  queryString = event.target.value.split(' ').join('+');
  console.log(queryString);
});

fetch(
  `${BASE_URL}?key=${API_KEY}&q=${SEARCH_TERM}&image_type=photo&orientation=horizontal&safesearch=true`
)
  .then(response => response.json())
  .then(({ hits }) => {
    const markupArray = hits.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <br>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            <br>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            <br>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <br>${downloads}
          </p>
        </div>
      </div>
    `
    );
    return markupArray;
  })
  .then(markupArray => {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Wyczyść zawartość galerii
    markupArray.forEach(markup => {
      gallery.insertAdjacentHTML('beforeend', markup);
    });
  })
  .catch(error => {
    'Sorry, there are no images matching your search query. Please try again.',
      error;
  });
