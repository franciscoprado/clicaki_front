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
  limparAba();
  fetch(`${URL}/favoritos`)
    .then((response) => response.json())
    .then((json) => {
      paginasTotal = json["total_paginas"];
      json["favoritos"].forEach((favorito) => {
        exibirFavorito(favorito);
      });
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
const exibirFavorito = (favorito, deleteBotao = false) => {
  const abaConteudo = document.querySelector("#abaConteudo");
  const favoritoCard = document.createElement("li");
  const favoritoData = document.createElement("time");
  const favoritoLink = document.createElement("a");
  const favoritoDelete = document.createElement("a");
  const favoritoTitulo = document.createElement("h3");
  const dataInsercao = new Date(favorito.data_insercao);

  favoritoLink.textContent = favorito.titulo;
  favoritoLink.setAttribute("href", favorito.url);
  favoritoLink.setAttribute("target", "_blank");
  favoritoLink.setAttribute("title", favorito.url);
  favoritoData.textContent = `adicionado em ${dataInsercao.toLocaleDateString()}`;
  favoritoData.setAttribute("datetime", dataInsercao.toISOString());

  favoritoTitulo.appendChild(favoritoLink);
  favoritoCard.appendChild(favoritoTitulo);
  favoritoCard.appendChild(favoritoData);
  favoritoCard.classList.add("card");
  abaConteudo.appendChild(favoritoCard);

  if (deleteBotao) {
    favoritoDelete.setAttribute("href", "javascript: void(0)");
    favoritoDelete.setAttribute(
      "onclick",
      `removerFavorito(event, ${favorito.id})`
    );
    favoritoDelete.innerHTML = `<small>remover</small>`;
    favoritoCard.appendChild(favoritoDelete);
  }
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
        exibirFavorito(favorito);
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
