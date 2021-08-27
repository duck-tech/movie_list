const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //收藏清單
let currentMode = 'card'
const dataPanel = document.querySelector('#data-panel')
const showingMode = document.querySelector('.showing-mode')


// render datapanel
function renderMovieList(data, mode) {
    let rawHTML = ''
        // processing
    switch (mode) {
        // card mode
        case "card":
            data.forEach((item) => {
                // title image
                rawHTML += `
              <div class="col-sm-3">
              <div class="mb-2">
                  <div class="card">
                      <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
                      <div class="card-body">
                          <h5 class="card-title">${item.title}</h5>
                      </div>
                      <div class="card-footer text-muted">
                          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X </button>
                      </div>
                  </div>
              </div>
          </div>`
            })
            break
        case 'list':
            rawHTML += '<ul class="list-group w-100 mb-2">'
            dataPanel.innerHTML = rawHTML
            data.forEach(item => {
                rawHTML += `
      <li class="list-group-item d-flex align-items-center justify-content-between flex-wrap">
        <h5 class="card-title">${item.title}</h5>
        <div class="list-btn">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X </button>
        </div>
      </li>`
            })
            rawHTML += '</ul>'
            break
    }

    dataPanel.innerHTML = rawHTML
}
// Mode 切換
showingMode.addEventListener('click', function onModeClicked(event) {
    if (event.target.tagName === 'I') {
        currentMode = event.target.dataset.mode
        renderMovieList(movies, currentMode)
    }
})


function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')

    axios.get(INDEX_URL + id).then((response) => {
        const data = response.data.results
        modalTitle.innerText = data.title
        modalDate.innerText = 'Release date: ' + data.release_date
        modalDescription.innerText = data.description
        modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`
    })
}

function removeFromFavorite(id) {
    if (!movies) return

    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if (movieIndex === -1) return

    movies.splice(movieIndex, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    renderMovieList(movies, currentMode)
}
//listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
    if (event.target.matches('.btn-show-movie')) {
        showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-remove-favorite')) {
        removeFromFavorite(Number(event.target.dataset.id))
    }
})

renderMovieList(movies, currentMode)