
const movies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('input');

const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalDescription = document.querySelector('.modal__description');
const modalImage = document.querySelector('.modal__img');
const modalClose = document.querySelector('.modal__close');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');


const highlightVideoLink = document.querySelector('.highlight__video-link');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightSubtitle = document.querySelector('.subtitle');
const highlightInfo = document.querySelector('.highlight__info');
const highlightGenreLaunch = document.querySelector('.highlight__genre-launch');

let paginaAtual = 0;
let percorrerFilmes = [];

for (const modalChild of modal.children) {
    modalChild.addEventListener("click", (e) => e.stopPropagation());
}

input.addEventListener('keydown', procurarFilmes);

function procurarFilmes(filmes) {
    if (filmes.key === 'Enter') {
        filmesAchados(input.value);
    }
}

async function filmesAchados(input) {
    try {
        const { data } = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input}`);
        const { results } = data
        movies.innerHTML = "";
        criarFilme(results);
    } catch (error) {
        console.log(error);
    }
}

filmesAchados();

async function filmes() {
    const response = await api.get('/discover/movie?language=pt-BR&include_adult=false')

    const filme = response.data.results;

    criarFilme(filme)
}

filmes();

async function filmeDoDia() {
    const carregarFilme = await api.get('/movie/436969?language=pt-BR');


    highlightVideo.style.backgroundImage = `url(${carregarFilme.data.backdrop_path})`;
    highlightTitle.textContent = carregarFilme.data.title;
    highlightRating.textContent = carregarFilme.data.vote_average;

    let generos = [];
    for (let i of carregarFilme.data.genres) {
        generos.push(i.name);
        generos.join(' , ');
    }
    highlightGenres.textContent = generos.join(' , ');
    highlightLaunch.textContent = new Date(
        carregarFilme.data.release_date
    ).toLocaleDateString("pt-br", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    highlightDescription.textContent = carregarFilme.data.overview;

    const { data: highlightLink } = await api.get(
        'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR'
    );

    highlightVideoLink.href = `https://www.youtube.com/watch?v=${highlightLink}`;

    const estrela = document.createElement('img');
    estrela.classList.add('movie__star');
    estrela.src = "./assets/estrela.svg";
    estrela.alt = "Estrela";
}

filmeDoDia()

function criarFilme(filme) {
    movies.textContent = "";
    for (let i = paginaAtual; i < paginaAtual + 6; i++) {
        const cardesDosFilmes = document.createElement('div');
        const spanTitle = document.createElement('span');
        const span = document.createElement('span');
        const movieInfo = document.createElement('div');

        const nota = document.createElement('img');
        nota.src = "../assets/estrela.svg"

        movieInfo.classList.add('movie__info');
        cardesDosFilmes.classList.add('movie');
        spanTitle.classList.add('movie__title');
        span.classList.add('movie__rating');

        cardesDosFilmes.style.backgroundImage = `url(${filme[i].poster_path})`;
        spanTitle.textContent = `${filme[i].title}`;
        span.textContent = `${filme[i].vote_average}`;

        cardesDosFilmes.append(movieInfo);
        movieInfo.append(spanTitle, span, nota);
        movies.append(cardesDosFilmes);


        cardesDosFilmes.addEventListener('click', () => {
            abrirModal(filme[i].id);
        })
    }

}

const fecharModal = () => {
    modal.classList.add('hidden');
}


async function abrirModal(id) {
    modal.classList.remove('hidden');

    const data = await api.get(
        `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`

    );

    console.log(data);

    modal.classList.remove('hidden');
    modal.addEventListener('click', () => {
        modal.classList.add('hidden')
        console.log('fechei');
    })

    const filme = data.data

    modalTitle.textContent = filme.title;
    modalImage.src = filme.backdrop_path;
    modalImage.alt = `Poster ${filme.title}`;
    modalDescription.textContent = filme.overview;
    modalAverage.textContent = filme.vote_average;

    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden')
    })
}

function paginacao() {
    movies.innerHTML = "";
}

btnNext.addEventListener('click', function () {
    paginaAtual === 3 ? paginaAtual = 0 : paginaAtual++;
    filmes();
});

btnPrev.addEventListener('click', function () {
    paginaAtual === 0 ? paginaAtual = 3 : paginaAtual--;
    filmes();
});

