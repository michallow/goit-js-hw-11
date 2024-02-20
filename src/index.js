import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '42458788-a8c12bb6253815950dff0c06c';
const BASE_URL = 'https://pixabay.com/api/';
let queryString = '';
let currentPage = 1;
const perPage = 20;

const photoCard = document.querySelector('.photo-card');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('[data-search]');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  clearPhotoCard();
  queryString = searchInput.value.trim().split(' ').join('+');
  try {
    currentPage = 1;
    const photos = await fetchPhotos(queryString);
    renderPhotos(photos);
  } catch (error) {
    console.log(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  try {
    currentPage++;
    const { photos, totalHits } = await fetchPhotos(queryString, currentPage);
    renderPhotos({ photos, totalHits });
  } catch (error) {
    console.log(error);
  }
});

async function fetchPhotos(searchTerm, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  return {
    photos: response.data.hits,
    totalHits: response.data.totalHits,
  };
}

function renderPhotos(data) {
  const photos = data.photos;
  const markup = photos
    .map(
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
        <p class="info-item"><b>Likes</b><br>${likes}</p>
        <p class="info-item"><b>Views</b><br>${views}</p>
        <p class="info-item"><b>Comments</b><br>${comments}</p>
        <p class="info-item"><b>Downloads</b><br>${downloads}</p>
      </div>
    </div>
  `
    )
    .join('');

  photoCard.insertAdjacentHTML('beforeend', markup);
}

async function clearPhotoCard() {
  photoCard.innerHTML = '';
}
