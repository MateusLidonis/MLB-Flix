// Seleciona elementos do DOM para exibir informações do filme
const moviePoster = document.querySelector(".movie-poster");
const movieName = document.querySelector(".movie-name");
const movieDescription = document.querySelector(".movie-description");
const movieRank = document.querySelector(".movie-rank");
const getRandomMovieButton = document.querySelector(".find-movie");
const language = "language=en";
/*
const movieYear = document.getElementById("movie-year");
const yearInput = movieYear.value;*/

// Decifra a chave da API
var shift = 3;
var data = decrypt("67fig3162d3984fh291ggi2g017fge32", shift);
const API_KEY = data;

// Função para buscar todos os gêneros disponíveis
getGenres();

//------------------------------------------------------------------------------
// Evento de clique para buscar um filme aleatório
getRandomMovieButton.addEventListener("click", async () => {
  console.log("------------------------------------------------------------");
  // Obtém os valores dos checkboxes marcados
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let checkedIds = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedIds.push(checkbox.id);
    }
  });

  const randomPage = await getPage(checkedIds);
  console.log("checkedIds: " + checkedIds);
  console.log("Random Page: " + randomPage);
  // Exibe o contêiner do filme e desativa o botão
  document.getElementById("movie-container").style.display = "flex";
  getRandomMovieButton.style.opacity = "0.8";
  getRandomMovieButton.style.pointerEvents = "none";

  const divProviders = document.getElementById("provider-img");
  divProviders.innerHTML = "";

  // Busca um filme aleatório
  //const randomId = Math.floor(Math.random() * 500000);
  //const movieData = await fetchMovieWithDescription(randomId);
  const movieData = await fetchMoviesWithGenres(checkedIds, randomPage);
  //const movieData = await getMovieProvider();

  console.log("----------------O QUE VAI APARECER----------------");

  console.log("Movie Data: " + movieData);
  console.log("Poster Path: " + movieData.poster_path);
  console.log("Title: " + movieData.title);
  console.log("Overview: " + movieData.overview);
  console.log("Nota: " + movieData.vote_average);

  // Exibe as informações do filme
  moviePoster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  movieName.textContent = movieData.title;
  movieDescription.textContent = movieData.overview;
  movieRank.textContent = movieData.vote_average;

  // Reativa o botão
  getRandomMovieButton.style.opacity = "1";
  getRandomMovieButton.style.pointerEvents = "auto";
});
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Função para buscar um filme com descrição
async function fetchMovieWithDescription(randomId) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}&${language}`
    /*`https://api.themoviedb.org/3/discover/movie/?api_key=${API_KEY}&with_genres=${checkedIds.join(
      ","
    )}&region=US`*/
  );
  console.log("----------------MOVIE WITH DESCRIPTION----------------");

  const movieData = await movie.json();
  // Verifica se o filme tem descrição
  console.log(
    "Descrição: " +
      movieData.overview +
      " / " +
      "Poster: " +
      movieData.poster_path +
      " / " +
      "Título: " +
      movieData.title +
      " / " +
      "Nota: " +
      movieData.vote_average
  );
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
    /* const newRandomId = Math.floor(Math.random() * 500000);
    return fetchMovieWithDescription(newRandomId);*/
    return movieData;
  }
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
async function fetchMoviesWithGenres(checkedIds, randomPage) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${language}&primary_release_year=2023&with_original_language=en&with_genres=${checkedIds}&page=${randomPage}`
  );
  console.log("----------------MOVIES WITH GENRES----------------");

  const movieData = await movie.json();
  const RandomIndex = Math.floor(Math.random() * movieData.results.length);
  console.log("Resposta do fetchMoviesWithGenres com Ids e randomPage: ");
  console.log(movie);
  console.log("movieData: ");
  console.log(movieData);
  console.log("randomIndex: " + RandomIndex);
  console.log("Filme aleatório baseado no index: ");
  console.log(movieData.results[RandomIndex]);
  let idForMovieWithGenre = movieData.results[RandomIndex].id;
  getMovieProvider(idForMovieWithGenre);
  return fetchMovieWithDescription(idForMovieWithGenre);
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
async function getPage(checkedIds) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${language}&primary_release_year=2023&with_original_language=en&with_genres=${checkedIds}`
  );
  console.log("----------------GET PAGE----------------");

  const movieData = await movie.json();
  const totalPages = movieData.total_pages;
  let randomPage = Math.floor(Math.random() * totalPages + 1);
  console.log("RandomPage antes: " + randomPage);
  while (randomPage > 500) {
    randomPage = Math.floor(Math.random() * totalPages + 1);
  }
  console.log("Resposta do fetch para retornar página aleatória: ");
  console.log(movie);
  console.log("movieData: ");
  console.log(movieData);
  console.log("totalPages: " + totalPages);
  console.log("randomPage: " + randomPage);
  return randomPage;
}

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
async function getMovieProvider(idForMovieWithGenre) {
  const movie = await fetch(
    /*`https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}&language=en-US`*/
    `https://api.themoviedb.org/3/movie/${idForMovieWithGenre}/watch/providers?api_key=${API_KEY}`
  );
  const movieData = await movie.json();
  console.log("----------------PROVIDERS----------------");
  console.log(movieData);

  const result = movieData.results.BR;
  if (!result) {
    console.log("Não existe");
  } else {
    var indexBuy = result.buy ? result.buy.length : 0;
    var indexRent = result.rent ? result.rent.length : 0;
    var indexFlatrate = result.flatrate ? result.flatrate.length : 0;
    insertProviders(result.flatrate, "Streaming");
    insertProviders(result.rent, "Alugar");
    insertProviders(result.buy, "Comprar");
  }

  let countFlatrate = 0;
  let countBuy = 0;
  let countRent = 0;
  //console.log(movieData.results.BR.flatrate[0].provider_name);
  console.log("----------------STREAMING----------------");
  for (count = 0; countFlatrate < indexFlatrate; countFlatrate++) {
    console.log(
      "Nome: " +
        movieData.results.BR.flatrate[countFlatrate].provider_name +
        " / " +
        "Id: " +
        movieData.results.BR.flatrate[countFlatrate].provider_id
    );
  }

  console.log("----------------COMPRAR----------------");
  for (count = 0; countBuy < indexBuy; countBuy++) {
    console.log(
      "Nome: " +
        movieData.results.BR.buy[countBuy].provider_name +
        " / " +
        "Id: " +
        movieData.results.BR.buy[countBuy].provider_id
    );
  }

  console.log("----------------ALUGAR----------------");
  for (count = 0; countRent < indexRent; countRent++) {
    console.log(
      "Nome: " +
        movieData.results.BR.rent[countRent].provider_name +
        " / " +
        "Id: " +
        movieData.results.BR.rent[countRent].provider_id
    );
  }

  /*const index = movieData.results.length;
  console.log("----------------PROVIDERS----------------");
  console.log(movieData);
  let count = 0;
  for (count = 0; count < index; count++) {
    console.log(
      "Nome: " +
        movieData.results[count].provider_name +
        " / " +
        "Id: " +
        movieData.results[count].provider_id
    );
  }*/
}
/*
&with_watch_providers=337&watch_region=BR
337 = Disney Plus
8 = Netflix
619 = Star Plus
*/
//------------------------------------------------------------------------------
function insertProviders(providers, type) {
  if (!providers) {
    console.error("Nenhum provedor fornecido");
    return;
  }

  const divProviders = document.getElementById("provider-img");

  const text = document.createElement("p");
  text.style.color = "#fffcf9";
  text.textContent = `${type}:`;
  divProviders.appendChild(text);

  providers.forEach((provider) => {
    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w200${provider.logo_path}`;
    img.title = provider.provider_name;
    divProviders.appendChild(img);
  });
}
