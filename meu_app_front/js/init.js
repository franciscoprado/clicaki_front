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
  Função para iniciar aplicação
  --------------------------------------------------------------------------------------
*/
const initApp = () => {
  console.log("Inicializando app...");
  verifyUserLogin();
  loadLatestAdded();
};

initApp();
