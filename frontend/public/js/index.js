
// Game states
let game = {
  currentPlayer: 'north',
  scores: {
    north: 0,
    east: 0,
    south: 0,
    west: 0
  }
};

// Players
let players = {
  north: {},
  east: {},
  south: {},
  west: {}
};
const playingOrder = ['north', 'east', 'south', 'west'];
let firstPlayer = 'north';

// Cards
const colors = ['♠', '♦', '♣', '♥']; // ordered colors
const ordered_numbers = Array.from({length:10-2+1},(v,k)=>k+2).map(String).concat(['J', 'Q', 'K', 'A']);

// "cross join"
const allCards = colors.flatMap(color => {
  return ordered_numbers.map(num => `${color}${num}`);
});



/**
 * Distribute all cards to players
 */
function distributeCardDeck(cards) {
  cards.forEach((card, i) => {
    let currentPlayer = players[playingOrder[i%playingOrder.length]];
    if(currentPlayer.cards?.length)  {
      currentPlayer.cards.push(card);
    } else {
      currentPlayer.cards = [card];
    }
  });
  playingOrder.map(player => players[player].cards.sort(orderFn))
}

// sort cards
let orderFn = (card1, card2) => {
  if(colors.indexOf(card1[0]) === colors.indexOf(card2[0])) {
    return ordered_numbers.indexOf(card1.slice(1)) > ordered_numbers.indexOf(card2.slice(1)) ? 1 : -1;
   }
  return colors.indexOf(card1[0]) > colors.indexOf(card2[0]) ? 1 : -1;
}

function displayPlayerCards(player) {
  players[player].cards.map(card => {
    let domElem = document.getElementById(player);
    let newCard = document.createElement('span');
    newCard.className = 'card';
    newCard.innerText = card;
    if(card.includes('♥') || card.includes('♦')) newCard.style.color = 'red';
    domElem.appendChild(newCard);
  });
}

function main() {
  const shuffledCards = allCards.sort(() => Math.random() - 0.5);
  
  // give cards
  distributeCardDeck(shuffledCards);
  
  // afficher les cartes distribuées à chaque joueurs
  playingOrder.map(player => displayPlayerCards(player));
  
  let i = 0;
  // game loop
  while(true) {
    
    i++;
    
    if(i >= 13) {
      // fin de pli
      // TODO
      break;
    }
  }
  
}


// start...
main();
