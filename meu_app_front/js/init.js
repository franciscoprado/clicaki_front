/*
  --------------------------------------------------------------------------------------
  Variáveis
  --------------------------------------------------------------------------------------
*/
const URL = "http://127.0.0.1:5000";
let paginaAtual = 1;

/*
  --------------------------------------------------------------------------------------
  Função para submeter o formulário e cadastrar favorito
  --------------------------------------------------------------------------------------
*/
const enviarFavorito = async (e) => {
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
const carregarFavoritos = async () => {
  limparAba();
  fetch(`${URL}/favoritos`)
    .then((response) => response.json())
    .then((json) => {
      paginaAtual = 1;
      exibirFavoritos(json);
    })
    .catch((error) => {
      exibirMensagemSemFavoritos();
    });
};

/*
  --------------------------------------------------------------------------------------
  Função que pega um retorno JSON e itera sobre ele, inserindo os ards na tela
  --------------------------------------------------------------------------------------
*/
const exibirFavoritos = (json) => {
  const favoritos = json["favoritos"] ?? [];
  const paginasTotal = json["paginas_total"] ?? 1;

  favoritos.forEach((favorito) => {
    inserirFavorito(favorito);
  });

  if (paginasTotal > paginaAtual) {
    carregarMaisBotao.classList.remove("hidden");
    return;
  }

  carregarMaisBotao.classList.add("hidden");
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
    Função para gerar o código HTML e inseri-lo como um favorito na lista
    --------------------------------------------------------------------------------------
  */
const inserirFavorito = (favorito) => {
  const abaConteudo = document.querySelector("#abaConteudo");
  const card = new Card(favorito);
  
  abaConteudo.appendChild(card.gerarCard());
};

/*
    --------------------------------------------------------------------------------------
    Função para adicionar mais um curtir ao favorito
    --------------------------------------------------------------------------------------
  */
const curtirFavorito = async (event) => {
  const link = event.currentTarget;
  const curtidasSpan = link.querySelector(".curtidas");
  const favoritoId = link.getAttribute("href").replace("#", "");

  event.preventDefault();
  fetch(`${URL}/favorito/curtir?id=${favoritoId}`, {
    method: "put",
  })
    .then((response) => response.json())
    .then((json) => {
      curtidasSpan.textContent = json["curtidas"];
    })
    .catch((error) => {
      console.error(error);
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para abrir detalhes do favorito.
    --------------------------------------------------------------------------------------
  */
const abrirFavorito = async (favoritoId) => {
  const favoritoUrl = document.querySelector("#favoritoUrl");
  const favoritoDescricao = document.querySelector("#favoritoDescricao");

  fetch(`${URL}/favorito?id=${favoritoId}`)
    .then((response) => response.json())
    .then((json) => {
      alternarModal("modalFavoritoDetalhe");
      favoritoDescricao.innerHTML = json["descricao"];
      favoritoUrl.innerHTML = json["url"];
      favoritoUrl.setAttribute("href", json["url"]);
    })
    .catch((error) => {
      console.error(error);
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para remover um favorito do usuário
    --------------------------------------------------------------------------------------
  */
const removerFavorito = async (event) => {
  const link = event.target.parentElement;
  const card = link.parentElement;
  const favoritoId = link.getAttribute("href").replace("#", "");

  event.preventDefault();
  fetch(`${URL}/favorito?id=${favoritoId}`, {
    method: "delete",
  })
    .then((response) => {
      alert("Favorito removido com sucesso!");
      card.remove();
      carregarFavoritos();
    })
    .catch((error) => {
      console.error(error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para carregar mais favoritos e adicioná-los ao final
  --------------------------------------------------------------------------------------
*/
const carregarMais = async () => {
  paginaAtual += 1;

  fetch(`${URL}/favoritos?pagina=${paginaAtual}`)
    .then((response) => response.json())
    .then((json) => exibirFavoritos(json))
    .catch((error) => {
      console.error(error);
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
