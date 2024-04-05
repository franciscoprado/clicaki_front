/*
  --------------------------------------------------------------------------------------
  Função para submeter o formulário e cadastrar favorito
  --------------------------------------------------------------------------------------
*/
const enviarFavorito = (e) => {
  const form = document.forms["addBookmarkForm"];

  e.preventDefault();

  fetch(`${url}/favorito`, {
    method: "post",
    body: new FormData(form),
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.status != 200) {
        alert("Erro: usuário não autorizado.");
        logout();
        return;
      }

      response.json();
    })
    .then((json) => {
      form.reset();
      atualizarAba();
      alternarModal("bookmarkFormModal");
    })
    .catch((error) => {
      alert(error);
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para recarregar os favoritos da aba ativa
    --------------------------------------------------------------------------------------
  */
const atualizarAba = () => {
  abaAtiva === "latestAdded" ? carregarUltimosAdicionados() : carregarSeusFavoritos();
};

/*
  --------------------------------------------------------------------------------------
  Função para validar senha no formulário de cadastro
  --------------------------------------------------------------------------------------
*/
const validarSenha = () => {
  const password = document.querySelector("input[name=senha]");
  const confirm = document.querySelector("input[name=confirmar_senha]");

  if (confirm.value === password.value) {
    confirm.setCustomValidity("");
  } else {
    confirm.setCustomValidity("Senhas precisam ser iguais.");
  }
};

/*
    --------------------------------------------------------------------------------------
    Função para fechar/abrir a modal de login
    --------------------------------------------------------------------------------------
  */
const alternarModal = (modalId) => {
  const modal = document.querySelector(`#${modalId}`);
  const form = document.forms["loginForm"];

  modal.classList.toggle("hidden");
  form.reset();
};

/*
    --------------------------------------------------------------------------------------
    Função de logout, removendo token local
    --------------------------------------------------------------------------------------
  */
const logout = () => {
  const latestAdded = document.querySelector("#latestAdded");

  latestAdded.dispatchEvent(new Event("click"));
  localStorage.removeItem("token");
  alternarTextoLoginLink();
  alternarBotaoAdicionar();
  alternarAbaSeusFavoritos();
};

/*
  --------------------------------------------------------------------------------------
  Função de controle da aba de Seus favoritos. Se logado, exibe; se não, esconde.
  --------------------------------------------------------------------------------------
*/
alternarAbaSeusFavoritos = () => {
  const yourBookmarks = document.querySelector("#yourBookmarks");
  yourBookmarks.classList.toggle("hidden");
};

/*
    --------------------------------------------------------------------------------------
    Função para alternar as abas
    --------------------------------------------------------------------------------------
  */
const alternarAba = (event) => {
  const link = event.target;
  const parent = link.parentElement;
  const ulElement = link.parentElement.parentElement;

  if (parent.classList.contains("ativo")) return;

  for (const child of ulElement.children) {
    child.classList.remove("ativo");
  }

  parent.classList.add("ativo");
  link.id === "yourBookmarks" ? carregarSeusFavoritos() : carregarUltimosAdicionados();
  abaAtiva = link.id;
};

/*
  --------------------------------------------------------------------------------------
  Função para carregar os favoritos adicionados mais recentemente
  --------------------------------------------------------------------------------------
*/
const carregarUltimosAdicionados = () => {
  limparAba();
  fetch(`${url}/favoritos`)
    .then((response) => response.json())
    .then((json) => {
      json["favoritos"].forEach((bookmark) => {
        exibirFavorito(bookmark);
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
  abaConteudo.innerHTML += `Faça login e adicione um!</p>`;
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
const exibirFavorito = (bookmark, deleteButton = false) => {
  const abaConteudo = document.querySelector("#abaConteudo");
  const bookmarkCard = document.createElement("li");
  const bookmarkDate = document.createElement("time");
  const bookmarkLink = document.createElement("a");
  const bookmarkDelete = document.createElement("a");
  const bookmarkTitle = document.createElement("h3");
  const date = new Date(bookmark.data_insercao);

  bookmarkLink.textContent = bookmark.titulo;
  bookmarkLink.setAttribute("href", bookmark.url);
  bookmarkLink.setAttribute("target", "_blank");
  bookmarkLink.setAttribute("title", bookmark.url);
  bookmarkDate.textContent = `adicionado em ${date.toLocaleDateString()}`;
  bookmarkDate.setAttribute("datetime", date.toISOString());

  bookmarkTitle.appendChild(bookmarkLink);
  bookmarkCard.appendChild(bookmarkTitle);
  bookmarkCard.appendChild(bookmarkDate);
  bookmarkCard.classList.add("card");
  abaConteudo.appendChild(bookmarkCard);

  if (deleteButton) {
    bookmarkDelete.setAttribute("href", "javascript: void(0)");
    bookmarkDelete.setAttribute(
      "onclick",
      `removerFavorito(event, ${bookmark.id})`
    );
    bookmarkDelete.innerHTML = `<small>remover</small>`;
    bookmarkCard.appendChild(bookmarkDelete);
  }
};

/*
    --------------------------------------------------------------------------------------
    Função para remover um favorito do usuário
    --------------------------------------------------------------------------------------
  */
const removerFavorito = (event, bookmarkId) => {
  const card = event.target.parentElement.parentElement;

  fetch(`${url}/favorito?id=${bookmarkId}`, {
    method: "delete",
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      response.json().then((json) => {
        if (response.status != 200) {
          alert(json.message);
          logout();
        } else {
          alert("Favorito removido com sucesso!");
          card.remove();
          carregarSeusFavoritos();
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
    --------------------------------------------------------------------------------------
    Função para carregar os favoritos do usuário
    --------------------------------------------------------------------------------------
  */
const carregarSeusFavoritos = () => {
  limparAba();

  if (!localStorage.getItem("token")) return;

  fetch(`${url}/meus-favoritos`, {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const favoritos = json["favoritos"];
      favoritos.forEach((bookmark) => {
        exibirFavorito(bookmark, true);
      });
    })
    .catch((error) => {
      console.log(error);
      exibirMensagemSemFavoritos();
    });
};
