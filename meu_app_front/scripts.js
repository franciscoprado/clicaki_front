/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = "http://127.0.0.1:5000/produtos";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach((item) =>
        insertList(item.nome, item.quantidade, item.valor)
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList();

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append("nome", inputProduct);
  formData.append("quantidade", inputQuantity);
  formData.append("valor", inputPrice);

  let url = "http://127.0.0.1:5000/produto";
  fetch(url, {
    method: "post",
    body: formData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
};

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName("td")[0].innerHTML;
      if (confirm("Você tem certeza?")) {
        div.remove();
        deleteItem(nomeItem);
        alert("Removido!");
      }
    };
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item);
  let url = "http://127.0.0.1:5000/produto?nome=" + item;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === "") {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice);
    postItem(inputProduct, inputQuantity, inputPrice);
    alert("Item adicionado!");
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price];
  var table = document.getElementById("myTable");
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement();
};

/*
  --------------------------------------------------------------------------------------
  Elementos do HTML
  --------------------------------------------------------------------------------------
*/
let loginMode = true;
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
  fetch(`http://127.0.0.1:5000/${acao}`, {
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
