
import { Player } from "/js/player.js";
import { colors, ordered_numbers, allCards, orderFn, log, resetLog } from "/js/util.js";

//
// Game states
//
export let Game = {

  //
  // variables
  //
  currentPlayer: 'north', // north player at first
  playingOrder: [],
  players: {},
  scores: {}, // to keep track of score...
  countHumanPlayer: 0,
  heartsPlayed: false,

  //
  // Functions
  //
  isFinished: () => Object.keys(Game.players).every(player => Game.players[player].cards.length === 0),

  addPlayer: (name, type = 'AI') => {
    let p = new Player(name)
    p.type = type;
    Game.players[name] = p;
    Game.scores[name] = 0; // initial score

    if(type == "human") {
      document.getElementById(name).classList.remove('ai');
      document.getElementById(name).classList.add('human');
    }
    if(type == "AI") {
      document.getElementById(name).classList.remove('human');
      document.getElementById(name).classList.add('ai');
    }
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
    createCard: (card, additionalClassName='') => {
        let newCard = document.createElement('span');
        newCard.className = 'card' + (additionalClassName ? ' '+additionalClassName : '');
        newCard.innerText = card;
        if(card.includes('♥') || card.includes('♦')) newCard.style.color = 'red';
        return newCard;
    }
  },

  /**
   * Prepare a new Hearts game
   */
  start(humanPlayers=[]) {

    resetLog();

    Game.countHumanPlayer = humanPlayers.length;
    Game.heartsPlayed = false;
    Game.playingOrder = ['north', 'east', 'south', 'west'];

    // add 4 ordered players
    Game.playingOrder.forEach(player => Game.addPlayer(player, humanPlayers.includes(player) ? 'human' : 'AI'));

    // give all cards to players
    const shuffledCards = Game.getShuffledCard();
    Game.distributeCardDeck(shuffledCards);

    // show distributed cards on board for each player
    Game.playingOrder.map(player => Game.displayPlayerCards(player));


    // find 3 worst cards of every players
    Game.playingOrder.forEach(player => console.log("worst cards of", player, ":", Game.findXWorstCards(Game.players[player])));


  },

  showPlayedCard: (cards) => {
    let domElem = document.getElementById('played-cards');
    // empty everything
    domElem.innerHTML = '';

    cards.forEach(card => {
        let cardDomElem = Game.DOM.createCard(card, 'big-card');
        domElem.appendChild(cardDomElem);
    });
  },

  /**
   * Find which player lose
   * 
   * @param {*} playedCards 
   * @returns looser
   */
  whoLose: (playedCards) => {
    let playedColor = playedCards[0];

    // TODO

    return 0;
  },

  /**
   * Find which card are usable, based on what is currently on the board, and player's hand
   * 
   * @param {*} player 
   * @param {*} playedCards 
   */
  getAvailableMoves: (player, playedCards) => {

    // which color is wanted
    let firstPlayed = playedCards[0] ?? null,
        doWeHaveThisColor = false;

    let playedColor = firstPlayed?.length ? firstPlayed[0] : null;

    // someone played or player is the first ?
    if(playedColor) {
      doWeHaveThisColor = Game.players[player].cards.some(c => c[0] === playedColor);
      
      //if(player == "south") log("Do you have the color "+playedColor+" ? " + (doWeHaveThisColor?'yes':'no'));

      if(doWeHaveThisColor) {
        return allCards.filter(card => card.includes(playedColor));
      }
    }

    // Is it possible to play in the wanted color ?
    if(playedColor && !doWeHaveThisColor) {
      // NO ! -> can play everything ???
      return allCards;
    }

    // Only hearts remaining ?! play it... TODO: Check if correct.....
    Game.heartsPlayed = Game.heartsPlayed || Game.players[player].cards.every(c => c[0] === '♥');

    // Is it possible to play heart ?
    return Game.heartsPlayed ? allCards : allCards.filter(card => !card.includes('♥'));
  },

  isAvailableMove: (playedCards, card) => {
    return Game.getAvailableMoves(Game.currentPlayer, playedCards).includes(card);
  },

  // FIX ME !
  // NOT USED YET !
  findXWorstCards: (player, number=3) => {
    // TODO

    let currentCards = player.cards;

    return currentCards.map(String).sort((card1, card2) => {
      return card1.slice(1) > card2.slice(1) ? -1 : 1;
    }).slice(0, number);

  }

};
