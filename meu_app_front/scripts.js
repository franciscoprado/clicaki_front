/*
  --------------------------------------------------------------------------------------
  Elementos do HTML
  --------------------------------------------------------------------------------------
*/
let loginMode = true;
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
const onFormSubmit = (e) => {
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
      });
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
const toggleModal = () => {
  const modal = document.querySelector("#userFormModal");

  modal.classList.toggle("hidden");
};
