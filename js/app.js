// Seleciona elementos do DOM para exibir informações do filme
const moviePoster = document.querySelector(".movie-poster");
const movieName = document.querySelector(".movie-name");
const movieDescription = document.querySelector(".movie-description");
const movieRank = document.querySelector(".movie-rank");
const getRandomMovieButton = document.querySelector(".find-movie");
const language = "language=pt-BR";
/*
const movieYear = document.getElementById("movie-year");
const yearInput = movieYear.value;*/

// Decifra a chave da API
var shift = 3;
var data = decrypt("67fig3162d3984fh291ggi2g017fge32", shift);
const API_KEY = data;

// Função para buscar todos os gêneros disponíveis
getGenres();

// Evento de clique para buscar um filme aleatório
getRandomMovieButton.addEventListener("click", async () => {
  // Obtém os valores dos checkboxes marcados
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let checkedIds = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedIds.push(checkbox.id);
    }
    console.log(checkedIds);
  });

  // Exibe o contêiner do filme e desativa o botão
  document.getElementById("movie-container").style.display = "flex";
  getRandomMovieButton.style.opacity = "0.8";
  getRandomMovieButton.style.pointerEvents = "none";

  // Busca um filme aleatório
  const randomId = Math.floor(Math.random() * 500000);
  const movieData = await fetchMovieWithDescription(randomId);

  // Exibe as informações do filme
  moviePoster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  movieName.textContent = movieData.title;
  movieDescription.textContent = movieData.overview;
  movieRank.textContent = movieData.vote_average;

  // Reativa o botão
  getRandomMovieButton.style.opacity = "1";
  getRandomMovieButton.style.pointerEvents = "auto";
});

// Função para criptografar um texto
function encrypt(text, shift) {
  var result = "";
  // Itera sobre cada caractere do texto
  for (var i = 0; i < text.length; i++) {
    // Itera sobre cada caractere do texto
    var asciiCode = text.charCodeAt(i);
    // Verifica se o caractere é uma letra maiúscula
    if (asciiCode >= 65 && asciiCode <= 90) {
      // Se for, criptografa o caractere e adiciona ao resultado
      result += String.fromCharCode(((asciiCode - 65 + shift) % 26) + 65);
      // Verifica se o caractere é uma letra minúscula
    } else if (asciiCode >= 97 && asciiCode <= 122) {
      // Se for, criptografa o caractere e adiciona ao resultado
      result += String.fromCharCode(((asciiCode - 97 + shift) % 26) + 97);
      // Se o caractere não for uma letra, adiciona ao resultado sem criptografar
    } else {
      result += text.charAt(i);
    }
  }
  // Retorna o texto criptografado
  return result;
}
// Função para descriptografar um texto
function decrypt(text, shift) {
  // Chama a função encrypt com 26 - shift para descriptografar o texto
  return encrypt(text, 26 - shift);
}

function getGenres() {
  // Busca a lista de gêneros de filmes
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
        newCheckbox.id = `${checkbox.id}`;

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
      });
    })
    .catch((error) => {
      console.error("Erro:", error);
    });

  return null;
}

// Função para buscar um filme com descrição
async function fetchMovieWithDescription(randomId) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}`
    /*`https://api.themoviedb.org/3/discover/movie/?api_key=${API_KEY}&with_genres=${checkedIds.join(
      ","
    )}&region=US`*/
  );
  const movieData = await movie.json();
  // Verifica se o filme tem descrição
  if (
    movieData.overview &&
    movieData.poster_path &&
    movieData.title &&
    movieData.vote_average
  ) {
    // Se o filme tem descrição, retorna os dados do filme
    return movieData;
  } else {
    // Se o filme não tem descrição, busca outro filme
    const newRandomId = Math.floor(Math.random() * 500000);
    return fetchMovieWithDescription(newRandomId);
  }
}
