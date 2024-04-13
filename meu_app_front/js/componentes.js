/**
 * Classe para auxiliar a geração de cards com informações do favorito.
 * @class
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

  /**
   * Classe para auxiliar a geração de cards com informações do favorito.
   * @class
   */
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

  /**
   * Cria o elemento de âncora do favorito.
   */
  #gerarFavoritoLink() {
    this.#favoritoLink.textContent = this.#favorito.titulo;
    this.#favoritoLink.setAttribute("href", "javascript: void(0);");
    this.#favoritoLink.setAttribute(
      "onclick",
      `abrirFavorito(${this.#favorito.id});`
    );
    this.#favoritoLink.setAttribute("title", this.#favorito.url);
  }

  /**
   * Cria o elemento contendo a data de inserção do favorito.
   */
  #gerarFavoritoData() {
    const data = new Date(this.#favorito.data_insercao);

    this.#favoritoData.textContent = `adicionado em ${data.toLocaleDateString()}`;
    this.#favoritoData.setAttribute("datetime", data.toISOString());
  }

  /**
   * Cria o botão de remover favorito.
   */
  #gerarFavoritoRemover() {
    this.#favoritoRemover.setAttribute("href", `#${this.#favorito.id}`);
    this.#favoritoRemover.setAttribute("title", "Excluir favorito");
    this.#favoritoRemover.setAttribute("onclick", `removerFavorito(event)`);
    this.#favoritoRemover.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
    this.#favoritoRemover.classList.add("danger");
  }

  /**
   * Cria o botão de curtir o favorito.
   */
  #gerarFavoritoCurtidas() {
    this.#favoritosCurtidas.setAttribute("href", `#${this.#favorito.id}`);
    this.#favoritosCurtidas.setAttribute("onclick", `curtirFavorito(event)`);
    this.#favoritosCurtidas.setAttribute("title", "Curtir favorito");
    this.#favoritosCurtidas.innerHTML += `<span class="material-symbols-outlined">thumb_up</span>`;
    this.#favoritosCurtidas.innerHTML += `&nbsp;<span class="curtidas">${
      this.#favorito.curtidas
    }`;
  }

  /**
   * Monta o elemento, adicionando os elementos-filhos a seus pais.
   */
  #montarElemento() {
    this.#favoritoTitulo.appendChild(this.#favoritoLink);
    this.#favoritoHeader.appendChild(this.#favoritoTitulo);
    this.#favoritoFooter.appendChild(this.#favoritoData);
    this.#favoritoFooter.appendChild(this.#favoritoRemover);
    this.#favoritoFooter.appendChild(this.#favoritosCurtidas);
    this.#favoritoCard.appendChild(this.#favoritoHeader);
    this.#favoritoCard.appendChild(this.#favoritoFooter);
  }

  /**
   * Gera o HTML do card.
   * @returns HTMLLIElement
   */
  gerarCard() {
    this.#gerarFavoritoLink();
    this.#gerarFavoritoData();
    this.#gerarFavoritoRemover();
    this.#gerarFavoritoCurtidas();
    this.#montarElemento();

    return this.#favoritoCard;
  }
}
