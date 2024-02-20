import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '42458788-a8c12bb6253815950dff0c06c';
const BASE_URL = 'https://pixabay.com/api/';
let queryString = '';

const photoCard = document.querySelector('.photo-card');
const searchInput = document.querySelector('[data-search]');

searchInput.addEventListener('input', async event => {
  queryString = event.target.value.split(' ').join('+');
  try {
    const photos = await fetchPhotos(queryString);
    renderPhotos(photos);
  } catch (error) {
    console.log(error);
  }
});

async function fetchPhotos(searchTerm) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
  );
  return response.data.hits;
}

function renderPhotos(photos) {
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

  photoCard.innerHTML = markup;
}

function fetchMoreImages() {
    
}
