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
const setUserLoggedIn = (json) => {
  localStorage.setItem("token", json.token);
  toggleModal("userFormModal");
  toggleAddButton();
  toggleLoginLinkText();
  toggleYourBookmarksTab();
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

/*
    --------------------------------------------------------------------------------------
    Função para alternar o comportamento do link do cabeçalho (Login/Sair)
    --------------------------------------------------------------------------------------
  */
const toggleLoginLinkText = () => {
  const loginLink = document.querySelector("#loginLink");
  const logoutLink = document.querySelector("#logoutLink");

  loginLink.classList.toggle("hidden");
  logoutLink.classList.toggle("hidden");
};

/*
    --------------------------------------------------------------------------------------
    Função para verificar se usuário está logado
    --------------------------------------------------------------------------------------
  */
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
