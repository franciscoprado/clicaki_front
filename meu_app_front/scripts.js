/*
  --------------------------------------------------------------------------------------
  Elementos do HTML
  --------------------------------------------------------------------------------------
*/
let loginMode = true;
let isLoading = false;
const url = "http://127.0.0.1:5000";
const nameInput = document.querySelector("input[name=nome]");
const confirmPasswordInput = document.querySelector(
  "input[name=confirmar_senha]"
);
const registerLink = document.querySelector("#registerLink");
const formButton = document.querySelector("#formButton");

/*
  --------------------------------------------------------------------------------------
  Função para alternar entre o form de login e de cadastro
  --------------------------------------------------------------------------------------
*/
const toggleForm = () => {
  const form = document.forms["loginForm"];

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

        console.log(json);
        localStorage.setItem("token", json.token);
        toggleModal("userFormModal");
      });
    })
    .catch((error) => {
      console.log(error);
    });
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
    .then((response) => response.json())
    .then((json) => {
      loadLatestAdded();
      toggleModal("bookmarkFormModal");
    })
    .catch((error) => {
      console.log(error);
    });
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

  modal.classList.toggle("hidden");
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
    child.classList.toggle("active");
  }

  link.id === "yourBookmarks" ? loadYourBookmarks() : loadLatestAdded();
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
    });
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
const insertBookmark = (bookmark) => {
  const tabContent = document.querySelector("#tabContent");
  const bookmarkCard = document.createElement("li");
  const bookmarkDate = document.createElement("time");
  const bookmarkLink = document.createElement("a");
  const bookmarkTitle = document.createElement("h2");
  const date = new Date(bookmark.data_insercao);

  bookmarkDate.textContent = `adicionado em ${date.toLocaleDateString()}`;
  bookmarkTitle.textContent = bookmark.titulo;
  bookmarkLink.textContent = bookmark.url;
  bookmarkDate.setAttribute("datetime", date.toISOString());
  bookmarkLink.setAttribute("href", bookmark.url);
  bookmarkLink.setAttribute("target", "_blank");
  bookmarkCard.classList.add("card");
  bookmarkCard.appendChild(bookmarkTitle);
  bookmarkCard.appendChild(bookmarkLink);
  bookmarkCard.appendChild(bookmarkDate);
  tabContent.appendChild(bookmarkCard);
};

/*
  --------------------------------------------------------------------------------------
  Função para carregar os favoritos do usuário
  --------------------------------------------------------------------------------------
*/
const loadYourBookmarks = () => {
  clearTab();
};

/*
  --------------------------------------------------------------------------------------
  Função para iniciar aplicação
  --------------------------------------------------------------------------------------
*/
const initApp = () => {
  console.log("Inicializando app...");
  let token = localStorage.getItem("token");

  if (!token) {
    toggleModal();
  }

  loadLatestAdded();
};

initApp();
