
import { Game } from "/js/game.js";
import { sleep, log, logvar } from "/js/util.js";



/**
 * UI events ...
 */
document.getElementById('start-btn-1').addEventListener('click', async function() {
  // distribute cards
  Game.init(['south']); // array with human players

  logvar('winning_score', "<b>Final score :</b> " + Game.winningScore + " (to stop)", true /* overwrite */);
  logvar('results', null, true /* overwrite */);
  logvar('winner', null, true /* overwrite */);
  
  let fold = 1;
  do {
    logvar('fold', "<b>Fold :</b> " + fold, true /* overwrite */);

    // it keep scores between Rounds
    Game.startRound();
    await main();

  } while(!Game.hasALoser());

  logvar('winner', "And the <b>winner</b> is ... <mark class='highlight-winner'>" + Game.winner() + "</mark> !", true /* overwrite */);
});


document.getElementById('start-btn-2').addEventListener('click', async function() {
  // distribute cards
  Game.init(); // with 4 AI

  logvar('winning_score', "<b>Final score :</b> " + Game.winningScore + " (to stop)", true /* overwrite */);
  logvar('results', null, true /* overwrite */);
  logvar('winner', null, true /* overwrite */);
  
  let fold = 1;
  do {
    logvar('fold', "<b>Fold :</b> " + fold, true /* overwrite */);

    log('<hr/>');

    // it keep scores between Rounds
    Game.startRound();
    await main();

    fold++;
  } while(!Game.hasALoser());

  logvar('winner', "And the <b>winner</b> is ... <mark class='highlight-winner'>" + Game.winner() + "</mark> !", true /* overwrite */);
});




/**
 * entrypoint to game logic ...
 * 
 * TODO: handle multiple rounds and stop if a player has >= 100 points
 */
async function main() {

  let round = 1; // fr: pli

  // who is serving ?
  let token = document.getElementById('token');
  token.style.visibility = 'visible';
  token.style.top = (document.getElementById(Game.currentPlayer).getBoundingClientRect().top - 20) + 'px';
  token.style.left = document.getElementById(Game.currentPlayer).getBoundingClientRect().left + 'px';

  // Start the game loop
  while(!Game.isFinished()) { // all cards played ?
    
    //console.warn("----------------");

    let playedCards = [],
        points = 0,
        roundOrder = [];

    if(Game.heartsPlayed) {
      logvar('hearts', 'Hearts played', true /* overwrite */);
    } else {
      logvar('hearts', 'Hearts not playable', true /* overwrite */);
    }

    // each player send a card
    for(let c = 0; c < Game.playingOrder.length; c++) {

      let p = Game.getCurrentPlayer(),
          card, // proposed card
          isAvailableMove, // boolean
          retries = 0; // attempts

      roundOrder.push(p.name);
      do {
        if(p.type === 'AI') {
          card = await p.proposeCard('random'); // TODO: add a basic "AI"
        } else { // human

          // UI: show the current cards played by others
          Game.showPlayedCard(playedCards, roundOrder);

          // Refresh authorized moves visually (greyed out card)
          // TODO : not efficient ?
          let el = document.getElementById(p.name);
          p.cards.forEach((card, index) => {
            let availability = Game.isAvailableMove(playedCards, card);
            let cardElem = el.querySelectorAll(".cards > span").item(index);
            cardElem.style.backgroundColor = availability ? "whitesmoke" : "lightgrey";
            cardElem.style.paddingTop = availability ? "8px" : "";
          });

          card = await p.proposeCard('wait_click');
        }
        
        isAvailableMove = Game.isAvailableMove(playedCards, card);

        if(p.type === "human" && !isAvailableMove) log('You can\'t play ' + card + " " + ("!".repeat(retries+1)));

        retries++;
      } while(!isAvailableMove && retries < 50);

      if(retries >= 50)  {
        console.log('???????');
        return;
      }
      
      // the move is valid -> play and add it
      p.play(card);
      playedCards.push(card);


      Game.next(); // go to next player
    }

    // UI: show the current cards played
    Game.showPlayedCard(playedCards, roundOrder);
    log("Round "+round+" ("+roundOrder+") : "+playedCards);

    Game.heartsPlayed = Game.heartsPlayed || playedCards.map(c => c[0]).includes('♥');

    let roundLoser = roundOrder[Game.whoLose(playedCards)];
    
    // count points & display !
    points = playedCards.filter(c => c[0] === '♥').length + (playedCards.includes('♠Q') ? 13 : 0);
    if(points === 26) {
      log("<b>The winner is : <mark>" + roundLoser + "</mark>, everyone get " + points + " points !</b>");
      Game.scores[roundLoser] += points;
    } else {
      log("<b><mark>" + roundLoser + "</mark> loses and get " + points + " points !</b>");
      Game.scores[roundLoser] += points;
    }

    // the one who lose must start in the next "round"
    Game.next(roundLoser);

    // UI: refresh players board (as a card has been played...)
    Object.keys(Game.players).map(player => Game.displayPlayerCards(player));

    //
    // END of round
    //

    // temporisation to see visually who wins ...
    await sleep( Game.countHumanPlayer > 0 ? 1250 : 250 /*milliseconds*/ );

    logvar('round', "<b>Round :</b> " + round, true /* overwrite */);

    round++;
  }

  //
  // Show round's winner
  //
  let message = '<b>Results:</b><br/>';
  Object.keys(Game.scores).forEach(player => message += '<b><mark>'+player+'</mark> : '+Game.scores[player]+'</b><br/>');

  logvar('results', message, true /* overwrite */);

  // hide token
  document.getElementById('token').style.visibility = 'hidden';

}
