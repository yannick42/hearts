
import { Game } from "/js/game.js";

export class Player {

  cards = [];

  constructor(name) {
    this.name = name;
  }

  /**
   * Choose a card to play given the board game
   */
  async play(strategy) {
    switch(strategy) {
      case "random":
        default:
          let randomIndex = Math.floor(Math.random()*this.cards.length);
          let card = this.cards.splice(randomIndex, 1)
          console.info(`${this.name} is playing card ${card} !`);
          return new Promise((resolve, reject) => resolve(card[0]));
      
      case "wait_click":
        return new Promise((resolve, reject) => {
          let fn = (e) => {
            let card = e.target.innerText;
            console.log("clicked:", card)
            this.cards.splice(this.cards.indexOf(card), 1);

            document.getElementById(this.name).removeEventListener('click', fn);
            resolve(card);
          }
          document.getElementById(this.name).addEventListener('click', fn);
        });
    }
  }

}
