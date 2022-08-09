
import { Game } from "/js/game.js";

export class Player {

  cards = [];

  constructor(name) {
    this.name = name;
  }

  /**
   * Choose a card to play given the board game
   */
  play(strategy) {
    switch(strategy) {
      case "random":
        default:
          let randomIndex = Math.floor(Math.random()*this.cards.length);
          let card = this.cards.splice(randomIndex, 1)
          console.info(`${this.name} is playing card ${card} !`);
          return card[0];
    }
  }

}
