
import { Player } from "/js/player.js";
import { colors, ordered_numbers, allCards, orderFn } from "/js/util.js";

//
// Game states
//
export let Game = {
  currentPlayer: 'north', // north player at first
  playingOrder: [],
  players: {},
  scores: {}, // to keep track of score...
  addPlayer: (name) => {
    Game.playingOrder.push(name);
    Game.players[name] = new Player(name);
    Game.scores[name] = 0;
  },
  getCurrentPlayer: () => Game.players[Game.currentPlayer],
  getCurrentPlayerId: () => Game.playingOrder.indexOf(Game.currentPlayer),
  // go to next player
  next: () => {
    let nextIndex = (Game.playingOrder.indexOf(Game.currentPlayer)+1) % Game.playingOrder.length;
    Game.currentPlayer = Game.playingOrder[nextIndex];
  },
  // shuffle the 52 card (French deck)
  getShuffledCard: () => allCards.sort(() => Math.random() - 0.5),
 /**
  * Distribute all cards to players
  */
  distributeCardDeck: (cards) => {
    cards.forEach((card, i) => {
      let currentPlayer = Game.players[Game.playingOrder[i%Game.playingOrder.length]];
      currentPlayer.cards.push(card);
    });
    Game.playingOrder.map(player => Game.players[player].cards.sort(orderFn))
  },
  displayPlayerCards: (player) => {
    let domElem = document.getElementById(player);
    // empty everything
    domElem.innerHTML = '';

    Game.players[player].cards.map(card => {  
      let newCard = Game.DOM.createCard(card);
      domElem.appendChild(newCard);
    });
  },
  DOM: {
    createCard: (card) => {
        let newCard = document.createElement('span');
        newCard.className = 'card';
        newCard.innerText = card;
        if(card.includes('♥') || card.includes('♦')) newCard.style.color = 'red';
        return newCard;
    }
  },
  /**
   * Prepare a new Hearts game
   */
  prepare() {
    // add 4 ordered players
    Game.addPlayer('north');
    Game.addPlayer('east');
    Game.addPlayer('south');
    Game.addPlayer('west');

    // give all cards to players
    const shuffledCards = Game.getShuffledCard();
    Game.distributeCardDeck(shuffledCards);

    // show distributed cards on board for each player
    Game.playingOrder.map(player => Game.displayPlayerCards(player));
  },
  showPlayedCard: (cards) => {
    let domElem = document.getElementById('played-cards');
    // empty everything
    domElem.innerHTML = '';

    cards.forEach(card => {
        let cardDomElem = Game.DOM.createCard(card);
        domElem.appendChild(cardDomElem);
    });
  }
};
