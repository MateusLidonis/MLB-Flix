const moviePoster = document.querySelector(".movie-poster");
const movieName = document.querySelector(".movie-name");
const movieDescription = document.querySelector(".movie-description");
const movieRank = document.querySelector(".movie-rank");
const getRandomMovieButton = document.querySelector(".find-movie");
const language = "language=pt-BR";

var shift = 3;
var data = decrypt("67fig3162d3984fh291ggi2g017fge32", shift);
const API_KEY = data;

fetch(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&${language}`
)
  .then((response) => response.json())
  .then((genreData) => {
    console.log(genreData);

    // Seleciona o elemento do DOM onde as caixas de seleção serão inseridas
    let checkboxContainer = document.getElementById("checkbox-container");

    // Itera sobre a resposta da API
    genreData.genres.forEach((checkbox) => {
      // Cria um novo elemento de caixa de seleção
      let newCheckbox = document.createElement("input");

      // Define o tipo do elemento como checkbox
      newCheckbox.type = "checkbox";

      // Define um identificador único para a caixa de seleção
      newCheckbox.id = `checkbox-${checkbox.id}`;

      // Cria um rótulo para a caixa de seleção
      let label = document.createElement("label");
      label.htmlFor = newCheckbox.id;
      label.appendChild(document.createTextNode(checkbox.name));
      // Cria uma nova div
      let div = document.createElement("div");
      // Adiciona a caixa de seleção e o rótulo ao contêiner
      div.appendChild(newCheckbox);
      div.appendChild(label);

      // Adiciona a div ao contêiner
      checkboxContainer.appendChild(div);

      let checkboxes = document.querySelectorAll("input[type='checkbox']");
    });
  })
  .catch((error) => {
    console.error("Erro:", error);
  });

async function fetchMovieWithDescription(randomId) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}&${language}`
  );
  const movieData = await movie.json();

  // Verifica se o filme tem descrição
  if (movieData.overview) {
    // Se o filme tem descrição, retorna os dados do filme
    return movieData;
  } else {
    // Se o filme não tem descrição, busca outro filme
    const newRandomId = Math.floor(Math.random() * 5000);
    return fetchMovieWithDescription(newRandomId);
  }
}

getRandomMovieButton.addEventListener("click", async () => {
  document.getElementById("movie-container").style.display = "flex";

  const randomId = Math.floor(Math.random() * 5000);

  const movieData = await fetchMovieWithDescription(randomId);
  console.log(movieData.overview);
  moviePoster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  movieName.textContent = movieData.title;
  movieDescription.textContent = movieData.overview;
  movieRank.textContent = movieData.vote_average;
});

function encrypt(text, shift) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var asciiCode = text.charCodeAt(i);
    if (asciiCode >= 65 && asciiCode <= 90) {
      result += String.fromCharCode(((asciiCode - 65 + shift) % 26) + 65);
    } else if (asciiCode >= 97 && asciiCode <= 122) {
      result += String.fromCharCode(((asciiCode - 97 + shift) % 26) + 97);
    } else {
      result += text.charAt(i);
    }
  }
  return result;
}

function decrypt(text, shift) {
  return encrypt(text, 26 - shift);
}
