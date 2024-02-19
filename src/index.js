import axios from 'axios';
import Notiflix from 'notiflix';

// const axios = require('axios').default;

const url = '';
const genuineQueryString = queryString.split(' ').join('+');

//używaj Pixaby
//pozyskaj unikalny kod dostępu

// Lista parametrów treści żądania, które należy podać:

// key - Twój unikalny klucz dostępu do API. (42458788-a8c12bb6253815950dff0c06c)
// q - termin, który chcemy wyszukać. W tej aplikacji to treść którą będzie wpisywał użytkownik.
// image_type - typ obrazka. Chcemy tylko zdjęcia, dlatego określ wartość parametru jako photo.
// orientation - orientacja zdjęcia. Określ wartość horizontal.
// safesearch - wyszukiwanie obrazków SFW (Safe For Work). Określ wartość true.

// W odpowiedzi pojawi się tablica obrazów odpowiadających kryteriom parametrów żądania. Każdy obraz opisany jest obiektem, z którego interesują cię tylko następujące właściwości:

//webformatURL - link do małego obrazka.
//largeImageURL - link do dużego obrazka.
//tags - wiersz z opisem obrazka. Będzie pasować do atrybutu alt.
//likes - liczba “lajków”.
//views - liczba wyświetleń.
//comments - liczba komentarzy.
//downloads - liczba pobrań.

// Jeśli backend przekazuje pustą tablicę, oznacza to, że nic odpowiedniego nie znaleziono. W takim wypadku pokaż powiadomienie o treści "Sorry, there are no images matching your search query. Please try again.". Do powiadomień używaj biblioteki notiflix.

fetch(
  'https://pixabay.com/api/?key=42458788-a8c12bb6253815950dff0c06c=yellow+flowers&image_type=photo'
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
    gallery.innerHTML = markupArray.join('');
  });

// images.hits.map(
//     ({
//       webformatURL,
//       largeImageURL,
//       tags,
//       likes,
//       views,
//       comments,
//       downloads,
//     }) => `
//   <div class="photo-card">
//     <a href="${largeImageURL}">
//       <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//     </a>
//     <div class="info">
//       <p class="info-item">
//         <b>Likes</b>
//         <br>${likes}
//       </p>
//       <p class="info-item">
//         <b>Views</b>
//         <br>${views}
//       </p>
//       <p class="info-item">
//         <b>Comments</b>
//         <br>${comments}
//       </p>
//       <p class="info-item">
//         <b>Downloads</b>
//         <br>${downloads}
//       </p>
//     </div>
//   </div>`
//   );
