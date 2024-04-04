/*
  --------------------------------------------------------------------------------------
  Variáveis
  --------------------------------------------------------------------------------------
*/
let loginMode = true;
let activeTab = "latestAdded";
const url = "http://127.0.0.1:5000";

/*
  --------------------------------------------------------------------------------------
  Função para alternar entre o form de login e de cadastro
  --------------------------------------------------------------------------------------
*/
const toggleForm = () => {
  const form = document.forms["loginForm"];
  const confirmPasswordInput = document.querySelector(
    "input[name=confirmar_senha]"
  );
  const nameInput = document.querySelector("input[name=nome]");
  const registerLink = document.querySelector("#registerLink");
  const formButton = document.querySelector("#formButton");

  loginMode = !loginMode;
  nameInput.classList.toggle("hidden");
  confirmPasswordInput.classList.toggle("hidden");
  nameInput.toggleAttribute("required");
  confirmPasswordInput.toggleAttribute("required");
  registerLink.textContent = loginMode ? "Não tenho cadastro" : "Fazer login";
  formButton.textContent = loginMode ? "Login" : "Cadastrar";
  form.reset();
};

/*
  --------------------------------------------------------------------------------------
  Função para fazer login
  --------------------------------------------------------------------------------------
*/
const onLoginFormSubmit = (e) => {
  let acao = loginMode ? "login" : "cadastro";
  const form = document.forms["loginForm"];

  e.preventDefault();
  fetch(`${url}/${acao}`, {
    method: "post",
    body: new FormData(form),
  })
    .then((response) => {
      response.json().then((json) => {
        if (response.status != 200) {
          alert(json.message);
          return;
        }

        setUserLoggedIn(json);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para definir o usuário como logado
  --------------------------------------------------------------------------------------
*/
setUserLoggedIn = (json) => {
  localStorage.setItem("token", json.token);
  toggleModal("userFormModal");
  toggleAddButton();
  toggleLoginLinkText();
  toggleYourBookmarksTab();
};

/*
  --------------------------------------------------------------------------------------
  Função para submeter o formulário e cadastrar favorito
  --------------------------------------------------------------------------------------
*/
const onBookmarkFormSubmit = (e) => {
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
      refreshTab();
      toggleModal("bookmarkFormModal");
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
const refreshTab = () => {
  activeTab === "latestAdded" ? loadLatestAdded() : loadYourBookmarks();
};

/*
  --------------------------------------------------------------------------------------
  Função para validar senha no formulário de cadastro
  --------------------------------------------------------------------------------------
*/
const validatePassword = () => {
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
const toggleModal = (modalId) => {
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
  toggleLoginLinkText();
  toggleAddButton();
  toggleYourBookmarksTab();
};

/*
  --------------------------------------------------------------------------------------
  Função de controle da aba de Seus favoritos. Se logado, exibe; se não, esconde.
  --------------------------------------------------------------------------------------
*/
toggleYourBookmarksTab = () => {
  const yourBookmarks = document.querySelector("#yourBookmarks");
  yourBookmarks.classList.toggle("hidden");
};

/*
  --------------------------------------------------------------------------------------
  Função para alternar as abas
  --------------------------------------------------------------------------------------
*/
const toggleTab = (event) => {
  const link = event.target;
  const parent = link.parentElement;
  const ulElement = link.parentElement.parentElement;

  if (parent.classList.contains("active")) return;

  for (const child of ulElement.children) {
    child.classList.remove("active");
  }

  parent.classList.add("active");
  link.id === "yourBookmarks" ? loadYourBookmarks() : loadLatestAdded();
  activeTab = link.id;
};

/*
  --------------------------------------------------------------------------------------
  Função para carregar os favoritos adicionados mais recentemente
  --------------------------------------------------------------------------------------
*/
const loadLatestAdded = () => {
  clearTab();
  fetch(`${url}/favoritos`)
    .then((response) => response.json())
    .then((json) => {
      json["favoritos"].forEach((bookmark) => {
        insertBookmark(bookmark);
      });
    })
    .catch((error) => {
      console.log(error);
      showNoBookmarkMessage();
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para exibir uma mensagem de que não há nenhum favorito
  --------------------------------------------------------------------------------------
*/
const showNoBookmarkMessage = () => {
  const tabContent = document.querySelector("#tabContent");
  tabContent.innerHTML = `<p><strong>Nenhum favorito ainda... ¬¬</strong>`;
  tabContent.innerHTML += `Faça login e adicione um!</p>`;
};

/*
  --------------------------------------------------------------------------------------
  Função para limpar as abas de conteúdo anterior.
  --------------------------------------------------------------------------------------
*/
const clearTab = () => {
  const tabContent = document.querySelector("#tabContent");

  tabContent.innerHTML = "";
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir um favorito na lista
  --------------------------------------------------------------------------------------
*/
const insertBookmark = (bookmark, deleteButton = false) => {
  const tabContent = document.querySelector("#tabContent");
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
  tabContent.appendChild(bookmarkCard);

  if (deleteButton) {
    bookmarkDelete.setAttribute("href", "javascript: void(0)");
    bookmarkDelete.setAttribute(
      "onclick",
      `deleteBookmark(event, ${bookmark.id})`
    );
    bookmarkDelete.innerHTML = `<small>remover</small>`;
    bookmarkCard.appendChild(bookmarkDelete);
  }
};

const deleteBookmark = (event, bookmarkId) => {
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
          loadYourBookmarks();
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
const loadYourBookmarks = () => {
  clearTab();

  if (!localStorage.getItem("token")) return;

  fetch(`${url}/meus-favoritos`, {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((json) => {
      json["favoritos"].forEach((bookmark) => {
        insertBookmark(bookmark, true);
      });
    })
    .catch((error) => {
      console.log(error);
      showNoBookmarkMessage();
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para controlara a exibição do botão de adicionar favorito
  --------------------------------------------------------------------------------------
*/
const toggleAddButton = () => {
  const addButton = document.querySelector("#addBookmarkButton");

  addButton.classList.toggle("hidden");
};

const toggleLoginLinkText = () => {
  const loginLink = document.querySelector("#loginLink");
  const logoutLink = document.querySelector("#logoutLink");

  loginLink.classList.toggle("hidden");
  logoutLink.classList.toggle("hidden");
};

const verifyUserLogin = () => {
  let token = localStorage.getItem("token");

  if (!token) {
    toggleModal("userFormModal");
    return;
  }

  fetch(`${url}/usuario`, {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.status == 200) {
        toggleAddButton();
        toggleLoginLinkText();
        toggleYourBookmarksTab();
      }
    })
    .catch((error) => {
      console.log(error);
      showNoBookmarkMessage();
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para iniciar aplicação
  --------------------------------------------------------------------------------------
*/
const initApp = () => {
  console.log("Inicializando app...");
  verifyUserLogin();
  loadLatestAdded();
};

initApp();
