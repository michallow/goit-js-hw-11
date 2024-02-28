import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '42458788-a8c12bb6253815950dff0c06c';
const BASE_URL = 'https://pixabay.com/api/';
let queryString = '';
let currentPage = 1;
const perPage = 40;

const photoCard = document.querySelector('.photo-card');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('[data-search]');
const loadMoreBtn = document.querySelector('.load-more');

const hideLoadMoreBtn = () => {
  loadMoreBtn.style.display = 'none';
};

const showLoadMoreBtn = () => {
  loadMoreBtn.style.display = 'block';
};

hideLoadMoreBtn();

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  clearPhotoCard();
  queryString = searchInput.value.trim();

  if (
    queryString === '' ||
    queryString === ' ' ||
    !queryString.replace(/\s/g, '').length
  ) {
    Notiflix.Notify.info(`Please enter your search term.`);
    return;
  }

  queryString = queryString.split(' ').join('+');
  try {
    currentPage = 1;
    const { photos, totalHits, totalPages } = await fetchPhotos(
      queryString,
      currentPage
    );
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    renderPhotos({ photos, totalHits });
    showLoadMoreBtn();
  } catch (error) {
    console.log(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  try {
    const { photos, totalHits, totalPages } = await fetchPhotos(
      queryString,
      currentPage
    );
    renderPhotos({ photos, totalHits });
  } catch (error) {
    console.error(error);
  }
});

async function fetchPhotos(searchTerm, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );

  const totalHits = response.data.totalHits;
  const photos = response.data.hits;
  const totalPages = Math.ceil(totalHits / perPage);

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw new Error('No results found');
  }

  if (page > totalPages) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    hideLoadMoreBtn();
    throw new Error('No more results');
  }

  return { photos, totalHits, totalPages };
}

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

lightbox.on('show.simplelightbox', function () {
  lightbox.load();
});

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
    <div class="photo-card-template">
      <a href="${largeImageURL}" data-lightbox="gallery">
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
  lightbox.refresh();
  showLoadMoreBtn();
  smoothScroll(cardHeight * 2);
}

async function smoothScroll(scrollAmount) {
  await new Promise(resolve => {
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(resolve, 1000);
  });
}

async function clearPhotoCard() {
  photoCard.innerHTML = '';
};

