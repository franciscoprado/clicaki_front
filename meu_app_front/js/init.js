/*
  --------------------------------------------------------------------------------------
  Variáveis
  --------------------------------------------------------------------------------------
*/
const URL = "http://127.0.0.1:5000";
let modoLogin = true;
let abaAtiva = "ultimosAdicionados";
let paginaAtual = 1;
let paginasTotal = 0;

/*
  --------------------------------------------------------------------------------------
  Função para submeter o formulário e cadastrar favorito
  --------------------------------------------------------------------------------------
*/
const enviarFavorito = (e) => {
  const form = document.forms["adicionarFavoritoForm"];

  e.preventDefault();
  fetch(`${URL}/favorito`, {
    method: "post",
    body: new FormData(form),
  })
    .then((response) => response.json())
    .then((json) => {
      carregarFavoritos();
      alternarModal("modalAdicionarFavorito");
    })
    .catch((error) => {
      alert(error);
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para fechar/abrir a modal de login
    --------------------------------------------------------------------------------------
  */
const alternarModal = (modalId) => {
  const modal = document.querySelector(`#${modalId}`);
  const form = document.forms["adicionarFavoritoForm"];
  modal.classList.toggle("hidden");
  form.reset();
};

/*
  --------------------------------------------------------------------------------------
  Função para carregar os favoritos adicionados mais recentemente
  --------------------------------------------------------------------------------------
*/
const carregarFavoritos = () => {
  const carregarMaisBotao = document.querySelector("#carregarMaisBotao");

  limparAba();
  fetch(`${URL}/favoritos`)
    .then((response) => response.json())
    .then((json) => {
      paginaAtual = 1;
      paginasTotal = json["paginas_total"] ?? 1;
      json["favoritos"].forEach((favorito) => {
        inserirFavorito(favorito);
      });

      if (paginasTotal > paginaAtual) {
        carregarMaisBotao.classList.remove("hidden");
      } else {
        carregarMaisBotao.classList.add("hidden");
      }
    })
    .catch((error) => {
      console.log(error);
      exibirMensagemSemFavoritos();
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para exibir uma mensagem de que não há nenhum favorito
    --------------------------------------------------------------------------------------
  */
const exibirMensagemSemFavoritos = () => {
  const abaConteudo = document.querySelector("#abaConteudo");
  abaConteudo.innerHTML = `<p><strong>Nenhum favorito ainda... ¬¬</strong>`;
  abaConteudo.innerHTML += `Adicione um clicando no botão de "+" no canto direito!</p>`;
};

/*
    --------------------------------------------------------------------------------------
    Função para limpar as abas de conteúdo anterior.
    --------------------------------------------------------------------------------------
  */
const limparAba = () => {
  const abaConteudo = document.querySelector("#abaConteudo");

  abaConteudo.innerHTML = "";
};

/*
    --------------------------------------------------------------------------------------
    Função para inserir um favorito na lista
    --------------------------------------------------------------------------------------
  */
const inserirFavorito = (favorito) => {
  const abaConteudo = document.querySelector("#abaConteudo");
  const favoritoCard = document.createElement("li");
  const favoritoData = document.createElement("time");
  const favoritoLink = document.createElement("a");
  const favoritoDelete = document.createElement("a");
  const favoritoTitulo = document.createElement("h3");
  const dataInsercao = new Date(favorito.data_insercao);

  favoritoLink.textContent = favorito.titulo;
  favoritoLink.setAttribute("href", "javascript: void(0);");
  favoritoLink.setAttribute("onclick", `abrirFavorito(${favorito.id});`);
  favoritoLink.setAttribute("title", favorito.url);
  favoritoData.textContent = `adicionado em ${dataInsercao.toLocaleDateString()}`;
  favoritoData.setAttribute("datetime", dataInsercao.toISOString());

  favoritoTitulo.appendChild(favoritoLink);
  favoritoCard.appendChild(favoritoTitulo);
  favoritoCard.appendChild(favoritoData);
  favoritoCard.classList.add("card");
  abaConteudo.appendChild(favoritoCard);

  favoritoDelete.setAttribute("href", "javascript: void(0)");
  favoritoDelete.setAttribute(
    "onclick",
    `removerFavorito(event, ${favorito.id})`
  );
  favoritoDelete.innerHTML = `<small>remover</small>`;
  favoritoCard.appendChild(favoritoDelete);
};

/*
    --------------------------------------------------------------------------------------
    Função para abrir detalhes do favorito.
    --------------------------------------------------------------------------------------
  */
const abrirFavorito = (favoritoId) => {
  const favoritoUrl = document.querySelector("#favoritoUrl");
  const favoritoDescricao = document.querySelector("#favoritoDescricao");

  fetch(`${URL}/favorito?id=${favoritoId}`)
    .then((response) => {
      response.json().then((json) => {
        alternarModal("modalFavoritoDetalhe");
        favoritoDescricao.innerHTML = json["descricao"] ? json["descricao"] : "Sem descrição.";
        favoritoUrl.innerHTML = json["url"];
        favoritoUrl.setAttribute("href", json["url"]);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para remover um favorito do usuário
    --------------------------------------------------------------------------------------
  */
const removerFavorito = (event, favoritoId) => {
  const card = event.target.parentElement.parentElement;

  fetch(`${URL}/favorito?id=${favoritoId}`, {
    method: "delete",
  })
    .then((response) => {
      response.json().then((json) => {
        alert("Favorito removido com sucesso!");
        card.remove();
        carregarFavoritos();
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para carregar mais favoritos e adicioná-los ao final
  --------------------------------------------------------------------------------------
*/
const carregarMais = () => {
  const carregarMaisBotao = document.querySelector("#carregarMaisBotao");

  paginaAtual += 1;

  fetch(`${URL}/favoritos?pagina=${paginaAtual}`)
    .then((response) => response.json())
    .then((json) => {
      paginasTotal = json["paginas_total"] ?? 1;

      if (paginasTotal === paginaAtual) {
        carregarMaisBotao.classList.add("hidden");
      }

      json["favoritos"].forEach((favorito) => {
        inserirFavorito(favorito);
      });
    })
    .catch((error) => {
      console.log(error);
      exibirMensagemSemFavoritos();
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para iniciar aplicação
  --------------------------------------------------------------------------------------
*/
const iniciar = () => {
  console.log("Inicializando app...");
  carregarFavoritos();
};

iniciar();
