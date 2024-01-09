const moviePoster = document.querySelector('.movie-poster');
const movieName = document.querySelector('.movie-name');
const movieDescription = document.querySelector('.movie-description');
const movieRank = document.querySelector('.movie-rank');
const getRandomMovieButton = document.querySelector('.find-movie');
const language = 'language=pt-BR';

fetch('js/API.txt')
    .then(Response => Response.text())
    .then(data => {
        var shift = 3;
        var data = decrypt('67fig3162d3984fh291ggi2g017fge32', shift);
        const API_KEY = data;

        getRandomMovieButton.addEventListener('click', async () => {
            document.getElementById('movie-container').style.display = "flex";
        
            const randomId = Math.floor(Math.random() * 5000)
        
            const movie = await fetch(`https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}&${language}`)
            const movieData = await movie.json()
            
        
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            movieName.textContent = movieData.title
            movieDescription.textContent = movieData.overview
            movieRank.textContent = movieData.vote_average
         })
    })

    function encrypt(text, shift) {
        var result = '';
        for (var i = 0; i < text.length; i++) {
            var asciiCode = text.charCodeAt(i);
            if (asciiCode >= 65 && asciiCode <= 90) {
                result += String.fromCharCode((asciiCode - 65 + shift) % 26 + 65);
            } else if (asciiCode >= 97 && asciiCode <= 122) {
                result += String.fromCharCode((asciiCode - 97 + shift) % 26 + 97);
            } else {
                result += text.charAt(i);
            }
        }
        return result;
    }
    
    function decrypt(text, shift) {
        return encrypt(text, 26 - shift);
    }
    

    

