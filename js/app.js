const moviePoster = document.querySelector('.movie-poster');
const movieName = document.querySelector('.movie-name');
const movieDescription = document.querySelector('.movie-description');
const movieRank = document.querySelector('.movie-rank');
const getRandomMovieButton = document.querySelector('.find-movie');

fetch('js/API.txt')
    .then(Response => Response.text())
    .then(data => {
        const API_KEY = data;
        getRandomMovieButton.addEventListener('click', async () => {
            document.getElementById('movie-container').style.display = "flex";
        
            const randomId = Math.floor(Math.random() * 500)
        
            const movie = await fetch(`https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}`)
            const movieData = await movie.json()
            
        
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            movieName.textContent = movieData.title
            movieDescription.textContent = movieData.overview
            movieRank.textContent = movieData.vote_average
         })
    })


