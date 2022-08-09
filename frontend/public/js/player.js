
import { Game } from "/js/game.js";

export class Player {

  cards = [];

  constructor(name) {
    this.name = name;
  }

  /**
   * Async function to choose a card to play
   * - TODO : given the board game
   */
  async play(strategy) {
    switch(strategy) {
      case "random":
      default: // default strategy

          let randomIndex = Math.floor(Math.random()*this.cards.length);
          let card = this.cards.splice(randomIndex, 1)
          console.info(`${this.name} is playing card ${card} !`);

          // resolve immediatly !
          return new Promise((resolve, reject) => resolve(card[0]));
      
      case "wait_click":
        return new Promise((resolve, reject) => {

          let fn = (e) => {
            let card = e.target.innerText;

            if(e.target.tagName !== 'SPAN') return; // skip clicks outside a card...

            console.log("clicked:", card)
            this.cards.splice(this.cards.indexOf(card), 1);

            // stop listening to clicks when finished
            document.getElementById(this.name).removeEventListener('click', fn);

            // emit the chosen card
            resolve(card);
          }

          // allow user to choose a card
          document.getElementById(this.name).addEventListener('click', fn);
        });
    }
  }

}
