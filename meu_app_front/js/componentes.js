/*
  --------------------------------------------------------------------------------------
  Classe para auxiliar a geração de cards com informações do favorito.
  --------------------------------------------------------------------------------------
*/
class Card {
  #favorito;
  #favoritoCard;
  #favoritoLink;
  #favoritoTitulo;
  #favoritoHeader;
  #favoritoFooter;
  #favoritoData;
  #favoritoRemover;
  #favoritosCurtidas;

  constructor(favorito) {
    this.#favorito = favorito;
    this.#favoritoCard = document.createElement("li");
    this.#favoritoLink = document.createElement("a");
    this.#favoritoTitulo = document.createElement("h3");
    this.#favoritoHeader = document.createElement("header");
    this.#favoritoFooter = document.createElement("footer");
    this.#favoritoData = document.createElement("time");
    this.#favoritoRemover = document.createElement("a");
    this.#favoritosCurtidas = document.createElement("a");
  }

  #gerarFavoritoLink() {
    this.#favoritoLink.textContent = this.#favorito.titulo;
    this.#favoritoLink.setAttribute("href", "javascript: void(0);");
    this.#favoritoLink.setAttribute(
      "onclick",
      `abrirFavorito(${this.#favorito.id});`
    );
    this.#favoritoLink.setAttribute("title", this.#favorito.url);
  }

  #gerarFavoritoData() {
    const data = new Date(this.#favorito.data_insercao);

    this.#favoritoData.textContent = `adicionado em ${data.toLocaleDateString()}`;
    this.#favoritoData.setAttribute("datetime", data.toISOString());
  }

  #gerarFavoritoRemover() {
    this.#favoritoRemover.setAttribute("href", `#${this.#favorito.id}`);
    this.#favoritoRemover.setAttribute("title", "Excluir favorito");
    this.#favoritoRemover.setAttribute("onclick", `removerFavorito(event)`);
    this.#favoritoRemover.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
    this.#favoritoRemover.classList.add("danger");
  }

  #gerarFavoritoCurtidas() {
    this.#favoritosCurtidas.setAttribute("href", `#${this.#favorito.id}`);
    this.#favoritosCurtidas.setAttribute("onclick", `curtirFavorito(event)`);
    this.#favoritosCurtidas.setAttribute("title", "Curtir favorito");
    this.#favoritosCurtidas.innerHTML += `<span class="material-symbols-outlined">thumb_up</span>`;
    this.#favoritosCurtidas.innerHTML += `&nbsp;<span class="curtidas">${
      this.#favorito.curtidas
    }`;
  }

  #montarElemento() {
    this.#favoritoTitulo.appendChild(this.#favoritoLink);
    this.#favoritoHeader.appendChild(this.#favoritoTitulo);
    this.#favoritoFooter.appendChild(this.#favoritoData);
    this.#favoritoFooter.appendChild(this.#favoritoRemover);
    this.#favoritoFooter.appendChild(this.#favoritosCurtidas);
    this.#favoritoCard.appendChild(this.#favoritoHeader);
    this.#favoritoCard.appendChild(this.#favoritoFooter);
  }

  gerarCard() {
    this.#gerarFavoritoLink();
    this.#gerarFavoritoData();
    this.#gerarFavoritoRemover();
    this.#gerarFavoritoCurtidas();
    this.#montarElemento();

    return this.#favoritoCard;
  }
}
