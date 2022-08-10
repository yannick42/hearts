
import { Player } from "/js/player.js";
import { colors, ordered_numbers, allCards, orderFn, log, resetLog } from "/js/util.js";

//
// Game states
//
export let Game = {

  //
  // variables & config.
  //
  winningScore: 30, // TODO: use 100
  currentPlayer: 'north', // north player at first
  playingOrder: [],
  players: {},
  scores: {}, // to keep track of score...
  countHumanPlayer: 0,
  heartsPlayed: false,
  showAIPlayerCards: parseInt(localStorage.getItem('show-all-cards')??0),

  //
  // Functions
  //
  isFinished: () => Object.keys(Game.players).every(player => Game.players[player].cards.length === 0),

  hasALoser: () => Object.keys(Game.players).some(player => Game.scores[player] >= Game.winningScore),

  // TODO : handle if there is a draw
  winner: () => {
    let min = Game.winningScore;
    let winner;
    Object.keys(Game.players).forEach(player => {
      if(Game.scores[player] < min) {
        winner = player;
        min = Game.scores[player];
      } 
    });
    return winner;
  },

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
  next: (goto=null) => {
    if(goto) {
      Game.currentPlayer = goto;
    } else {
      let nextIndex = (Game.playingOrder.indexOf(Game.currentPlayer)+1) % Game.playingOrder.length;
      Game.currentPlayer = Game.playingOrder[nextIndex];
    }
  },

  // shuffle the 52 card (French deck)
  getShuffledCard: () => allCards.sort(() => Math.random() - 0.5),

 /**
  * Distribute all cards to players
  */
  distributeCardDeck: (cards) => {
    cards.forEach((card, i) => {
      let currentPlayer = Game.players[Game.playingOrder[i%Game.playingOrder.length]];
      if(card == '♣2') Game.currentPlayer = currentPlayer.name; // detects who start !
      currentPlayer.cards.push(card);
    });
    Game.playingOrder.map(player => Game.players[player].cards.sort(orderFn))
  },

  displayPlayerCards: (player) => {
    let domElem = document.getElementById(player).querySelector('.cards');
    // empty everything
    domElem.innerHTML = '';

    Game.players[player].cards.map(card => {
      let newCard = Game.DOM.createCard(card);
      console.log("Game.showAIPlayerCards:", Game.showAIPlayerCards);
      if(Game.players[player].type === "AI" && !Game.showAIPlayerCards) newCard.style.setProperty('color', 'transparent', 'important'); 
      domElem.appendChild(newCard);
    });
  },

  DOM: {
    createCard: (card, additionalClassName='') => {
        let newCard = document.createElement('span');
        newCard.className = 'card' + (additionalClassName ? ' '+additionalClassName : '');
        newCard.innerText = card;
        if(card.includes('♥') || card.includes('♦')) newCard.className += ' red';
        return newCard;
    }
  },

  /**
   * Prepare a new Hearts game
   */
  init(humanPlayers=[]) {
    resetLog();

    Game.countHumanPlayer = humanPlayers.length;
    Game.playingOrder = ['north', 'east', 'south', 'west'];
    Game.currentPlayer = 'north';

    // add 4 ordered players
    Game.playingOrder.forEach(player => Game.addPlayer(player, humanPlayers.includes(player) ? 'human' : 'AI'));
  },

  startRound: () => {
    Game.heartsPlayed = false;

    // give all cards to players
    const shuffledCards = Game.getShuffledCard();
    Game.distributeCardDeck(shuffledCards);

    // show distributed cards on board for each player
    Game.playingOrder.map(player => Game.displayPlayerCards(player));

    // find 3 worst cards of every players
    Game.playingOrder.forEach(player => console.log("worst cards of", player, ":", Game.findXWorstCards(Game.players[player])));
    // TODO: give them to ???
  },

  showPlayedCard: (cards, roundOrder=Game.playingOrder) => {
    let domElem = document.getElementById('played-cards');
    // empty everything
    domElem.innerHTML = '';

    cards.forEach((card, i) => {
        let cardDomElem = Game.DOM.createCard(card, 'big-card');
        cardDomElem.id = roundOrder[i]+"-card";
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
    let wantedColor = playedCards[0][0];

    // find greatest of this color
    let cardsToCheck = playedCards.filter(c => c[0] === wantedColor).sort(orderFn);
    let index = playedCards.indexOf(cardsToCheck.pop());

    return index;
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
