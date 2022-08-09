
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
  async proposeCard(strategy) {
    switch(strategy) {
      case "random":
      default: // default strategy

          let randomIndex, card, p = Game.getCurrentPlayer();
          //do
          //{
            randomIndex = Math.floor(Math.random()*this.cards.length);
            card = this.cards[randomIndex];
          //}
          //while(card === '♠Q' && p.cards.length > 1); // do not pick Queen of Spades unless last card ...
          // TODO: do that only if first card ...

          //console.info(`${this.name} is playing card ${card} !`);

          // resolve immediatly !
          return new Promise((resolve, reject) => resolve(card));
      
      case "wait_click":
        return new Promise((resolve, reject) => {

          const fn = (e) => {
            const card = e.target.innerText;

            if(e.target.tagName !== 'SPAN') return; // skip clicks outside a card...

            //console.log("clicked:", card)
            //this.cards.splice(this.cards.indexOf(card), 1);

            // stop listening to clicks when finished
            document.getElementById(this.name).removeEventListener('mouseup', fn);

            // emit the chosen card
            resolve(card);
          }

          // allow user to choose a card
          document.getElementById(this.name).addEventListener('mouseup', fn);
        });
    }
  }

  play(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
  }

}
