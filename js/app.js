//----------------------------------------------------------------------------------------------------------------------
// Seleciona elementos do DOM para exibir informações do filme
const moviePoster = document.querySelector(".movie-poster");
const movieName = document.querySelector(".movie-name");
const movieDescription = document.querySelector(".movie-description");
const movieRank = document.querySelector(".movie-rank");
const getRandomMovieButton = document.querySelector(".find-movie");
const divProviders = document.getElementById("provider-img");
const language = "language=pt-BR";

//document.getElementById("botao").addEventListener("mouseenter", moveButton);
var button = document.getElementById("botao");
var container = document.getElementById("buttonContainer");
var containerRect = container.getBoundingClientRect();

// Definir posição inicial
button.style.left = containerRect.width / 2 - button.offsetWidth / 2 + "px";
button.style.top = containerRect.height / 2 - button.offsetHeight / 2 + "px";
var move = 0;
var anotherChance = 0;
//----------------------------------------------------------------------------------------------------------------------
move = 0;
//----------------------------------------------------------------------------------------------------------------------
// Decifra a chave da API
var shift = 3;
var data = decrypt("67fig3162d3984fh291ggi2g017fge32", shift);
const API_KEY = data;
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Função para buscar todos os gêneros disponíveis ao iniciar a página
getGenres();
//----------------------------------------------------------------------------------------------------------------------
button.addEventListener("mouseenter", function () {
  moveButton();
});
//----------------------------------------------------------------------------------------------------------------------
//Evento de clique para buscar um filme aleatório
getRandomMovieButton.addEventListener("click", async () => {
  console.log("----------------BUTTON CLICK----------------");
  if (move == 0) {
    //--------------------------------------------------------------------------------------------------------------------
    // Obtém os valores dos checkboxes marcados
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    let checkedIds = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedIds.push(checkbox.id);
      }
    });
    console.log("checkedIds: " + checkedIds);
    //--------------------------------------------------------------------------------------------------------------------
    // Escolhe uma página aleatória de todas retornadas pela API
    if (move == 0) {
      const randomPage = await getPage(checkedIds);
      //--------------------------------------------------------------------------------------------------------------------
      // Exibe o contêiner do filme e desativa o botão
      document.getElementById("movie-container").style.display = "flex";
      getRandomMovieButton.style.opacity = "0.8";
      getRandomMovieButton.style.pointerEvents = "none";

      const divProviders = document.getElementById("provider-img");
      divProviders.innerHTML = "";
      //--------------------------------------------------------------------------------------------------------------------
      // Busca um filme aleatório
      const movieData = await fetchMoviesWithGenres(checkedIds, randomPage);
      //--------------------------------------------------------------------------------------------------------------------
      // Reativa o botão
      getRandomMovieButton.style.opacity = "1";
      getRandomMovieButton.style.pointerEvents = "auto";
    }
  }
  moveButton();
});

//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Função que retorna todos os gêneros disponíveis na API para exibí-los nas checkboxes
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
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
async function getPage(checkedIds) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${language}&primary_release_year=2023&with_original_language=en&with_genres=${checkedIds}`
  );
  const movieData = await movie.json();
  const totalPages = movieData.total_pages;
  let randomPage = Math.floor(Math.random() * totalPages + 1);

  console.log("----------------GET PAGE----------------");
  console.log("RandomPage antes da verificação de 500 páginas: " + randomPage);
  // A API tem um limite de 500 páginas (mesmo se retornarem > 500 em totalPages)
  // Esse While faz com que, caso retorne algo maior que 500, o sistema procura uma nova página
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
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Função para retornar um ID de um filme aleatório de uma página aleatória
async function fetchMoviesWithGenres(checkedIds, randomPage) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${language}&with_genres=${checkedIds}&page=${randomPage}&sort_by=popularity.desc`
  );
  const movieData = await movie.json();
  const RandomIndex = Math.floor(Math.random() * movieData.results.length);

  console.log("----------------MOVIES WITH GENRES----------------");
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
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Função para buscar um filme com descrição baseado no ID aleatório retornado por fetchMoviesWithGenres
async function fetchMovieWithDescription(randomId) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/movie/${randomId}?api_key=${API_KEY}&${language}`
  );
  const movieData = await movie.json();

  console.log("----------------MOVIE WITH DESCRIPTION----------------");
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
  // Se o filme tem descrição ...
  if (
    movieData.overview &&
    movieData.poster_path &&
    movieData.title &&
    movieData.vote_average
  ) {
    // ... então imprime os dados do filme no HTML
    moviePoster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    movieName.textContent = movieData.title;
    movieDescription.textContent = movieData.overview;
    movieRank.textContent = movieData.vote_average;
  } else {
    // Se o filme não tem descrição
    // Hoje não é dia de filme :)
    moviePoster.src = "./assets/logo_without_movie.png";
    movieName.textContent = "Sem filme hoje!";
    movieDescription.textContent =
      "Que tal uma boa leitura? Ou então terminar aquele projeto que você deixou parado?";
    movieRank.textContent = "Mais de 8 mil!";
    move++;
    /*if (window.screen.width <= 625) {
      document.getElementById("botao").onclick = function () {
        moveButton();
      };
    } else {
      document.getElementById("botao").onmouseenter = function () {
        if (move == 1) {
          moveButton();
        }
      };
    }*/
  }
}
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
async function getMovieProvider(idForMovieWithGenre) {
  const movie = await fetch(
    `https://api.themoviedb.org/3/movie/${idForMovieWithGenre}/watch/providers?api_key=${API_KEY}`
  );
  const movieData = await movie.json();
  const result = movieData.results.BR;

  console.log("----------------PROVIDERS----------------");
  console.log(movieData);
  // Se não existir opções no Brasil
  if (!result) {
    console.log("Não existe");
    // Se existir, então o índice vai ser igual ao tamanho (caso exista flatrate, buy ou rent), se não existir, indice = 0
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
}
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Função para mostrar os provedores de streaming, compra ou aluguel dos filmes
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
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------------------------------
function moveButton() {
  if (move == 1) {
    var container = document.getElementById("buttonContainer");

    var x = Math.floor(
      Math.random() * (container.clientWidth - button.offsetWidth)
    );
    var y = Math.floor(
      Math.random() * (container.clientHeight - button.offsetHeight)
    );
    button.style.left = x + "px";
    button.style.top = y + "px";
    button.style.position = "absolute";

    anotherChance++;
    if (anotherChance == 5) {
      move = 0;
      anotherChance = 0;
      alert("Você tem mais uma chance, que a sorte esteja sempre a seu favor!");
      var container = document.getElementById("buttonContainer");
      var containerRect = container.getBoundingClientRect();

      // Definir posição inicial
      button.style.left =
        containerRect.width / 2 - button.offsetWidth / 2 + "px";
      button.style.top =
        containerRect.height / 2 - button.offsetHeight / 2 + "px";
    }
  }
}
