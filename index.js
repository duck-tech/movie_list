const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + 　'/api/v1/movies/'
const Poster_URL = BASE_URL　 + '/posters/'
const MOVIES_PER_PAGE = 12
const movies = []
let filterMovies = []
let currentMode = 'card'
let currentPage = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
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
                        <img src="${Poster_URL + item.image}" class="card-img-top" alt="Movie Poster">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                        </div>
                        <div class="card-footer text-muted">
                            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+ </button>
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
						<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
					</div>
				</li>`
            })
            rawHTML += '</ul>'
            break
    }

    dataPanel.innerHTML = rawHTML
}

function renderShowingModeButton(current) {
    const mode = showingMode.children

    for (let i = 0; i < mode.length; i++) {
        if (mode[i].dataset.mode === current) {
            mode[i].style.color = '#ffffff'
            mode[i].style.backgroundColor = '#333333'
        } else {
            mode[i].style.color = '#333333'
            mode[i].style.backgroundColor = '#ffffff'
        }
    }
}

// Mode 切換
showingMode.addEventListener('click', function onModeClicked(event) {
    if (event.target.tagName === 'I') {
        currentMode = event.target.dataset.mode
        renderShowingModeButton(currentMode)
        renderMovieList(getMoviesByPage(currentPage), currentMode)
    }
})

// Modal 內容
function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImg = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')

    axios.get(INDEX_URL + id)
        .then((response) => {
            const data = response.data.results
            modalTitle.innerText = data.title
            modalDate.innerText = 'Release date: ' + data.release_date
            modalDescription.innerText = data.description
            modalImg.innerHTML = `<img src="${Poster_URL + data.image}" alt="movie-poster" class="image-fluid">`
        })
        .catch((err) => console.log(err))

}


// 分頁器
function renderPaginator(amount) {
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE) // 無條件進位
    let rawHTML = ''

    for (let page = 1; page <= numberOfPages; page++) {
        if (page === currentPage) {
            rawHTML += `<li class="page-item active"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
        } else {
            rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
        }

    }
    paginator.innerHTML = rawHTML
}

// page -> 那頁資料
function getMoviesByPage(page) {
    // movies? 'movies' : 'filteredMovies'
    // page 1-> 0-11
    // page 2-> 12-23
    // page 3-> 24-35
    const data = filterMovies.length ? filterMovies : movies // 如果 fileterMovies 是有東西就給我filterMovie 沒有用movies
    const startIndex = (page - 1) * MOVIES_PER_PAGE

    return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 將喜愛項目 存入 localStorage
function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id)
    if (list.some((movie) => movie.id === id)) {
        return alert('此電影已經在收藏清單中!')
    }
    list.push(movie)
        // const jsonString = JSON.stringify(list)
        // console.log('json string', jsonString)
        // console.log('json object:', JSON.parse(jsonString))
    console.log(list)

    localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// More 、Favorite 監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
    if (event.target.matches('.btn-show-movie')) {
        console.log(event.target.dataset)
        showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-add-favorite')) {
        addToFavorite(Number(event.target.dataset.id))
    }
})

// page監聽器 
paginator.addEventListener('click', function onPaginatorClicked(event) {
    if (event.target.tagName !== 'A') return //<a></a>
    const data = filterMovies.length ? filterMovies : movies
    currentPage = Number(event.target.dataset.page)
    renderPaginator(data.length)
    renderMovieList(getMoviesByPage(currentPage), currentMode)

})


// 搜尋
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
    event.preventDefault() //瀏覽器終止元件預設行為
    const keyword = searchInput.value.trim().toLowerCase() //trim() 前面空白和後面空白去掉

    // if (!keyword.length) {
    //     return alert('Please enter valid string')
    // }
    // map,filter,reduce 陣列操作三寶
    filterMovies = movies.filter((movie) => {
        return movie.title.toLowerCase().includes(keyword)
    })

    if (filterMovies.length === 0) {
        return alert('Cannot find movies with keywords: ' + keyword)
    }

    // for (const movie of movies) {
    //     if (movie.title.toLowerCase().includes(keyword)) {
    //         filterMovies.push(movie)
    //     }
    // }
    currentPage = 1
    renderPaginator(filterMovies.length)
    renderMovieList(getMoviesByPage(1), currentMode)
})

// 電影清單
axios.get(INDEX_URL)
    .then((response) => {
        // Array 80
        // for (const movie of response.data.results) {
        //     movies.push(movie)
        // }
        movies.push(...response.data.results)
            // console.log(movies)
            // console.log(movies.length)
        renderShowingModeButton(currentMode)
        renderPaginator(movies.length)
        renderMovieList(getMoviesByPage(1), currentMode)

    })
    .catch((err) => console.log(err))

// localStorage.setItem("default_language", "english")
// console.log(localStorage.getItem('default_language'))
// localStorage.removeItem('default_language')
// console.log(localStorage.getItem('default_language'))
// localStorage.setItem('default_language', JSON.stringify())