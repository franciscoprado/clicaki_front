/*
  --------------------------------------------------------------------------------------
  Função para alternar entre o form de login e de cadastro
  --------------------------------------------------------------------------------------
*/
const alternarFormulario = () => {
  const form = document.forms["loginForm"];
  const confirmPasswordInput = document.querySelector(
    "input[name=confirmar_senha]"
  );
  const nameInput = document.querySelector("input[name=nome]");
  const registerLink = document.querySelector("#registerLink");
  const formButton = document.querySelector("#formButton");

  modoLogin = !modoLogin;
  nameInput.classList.toggle("hidden");
  confirmPasswordInput.classList.toggle("hidden");
  nameInput.toggleAttribute("required");
  confirmPasswordInput.toggleAttribute("required");
  registerLink.textContent = modoLogin ? "Não tenho cadastro" : "Fazer login";
  formButton.textContent = modoLogin ? "Login" : "Cadastrar";
  form.reset();
};

/*
    --------------------------------------------------------------------------------------
    Função para fazer login
    --------------------------------------------------------------------------------------
  */
const fazerLogin = (e) => {
  let acao = modoLogin ? "login" : "cadastro";
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

        definiarUsuarioLogado(json);
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
const definiarUsuarioLogado = (json) => {
  localStorage.setItem("token", json.token);
  alternarModal("userFormModal");
  alternarBotaoAdicionar();
  alternarTextoLoginLink();
  alternarAbaSeusFavoritos();
};

/*
  --------------------------------------------------------------------------------------
  Função para controlara a exibição do botão de adicionar favorito
  --------------------------------------------------------------------------------------
*/
const alternarBotaoAdicionar = () => {
  const addButton = document.querySelector("#adicionarFavoritoBotao");

  addButton.classList.toggle("hidden");
};

/*
    --------------------------------------------------------------------------------------
    Função para alternar o comportamento do link do cabeçalho (Login/Sair)
    --------------------------------------------------------------------------------------
  */
const alternarTextoLoginLink = () => {
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
const verificarUsuarioLogado = () => {
  let token = localStorage.getItem("token");

  if (!token) {
    alternarModal("userFormModal");
    return;
  }

  fetch(`${url}/usuario`, {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.status == 200) {
        alternarBotaoAdicionar();
        alternarTextoLoginLink();
        alternarAbaSeusFavoritos();
      }
    })
    .catch((error) => {
      console.log(error);
      exibirMensagemSemFavoritos();
    });
};
