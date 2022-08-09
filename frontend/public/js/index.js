
import { Game } from "/js/game.js";
import { sleep, log } from "/js/util.js";



/**
 * UI events ...
 */
document.getElementById('start-btn-1').addEventListener('click', function() {
  // distribute cards
  Game.start(['south']); // array with human players
  main();
});


document.getElementById('start-btn-2').addEventListener('click', function() {
  // distribute cards
  Game.start(); // with 4 AI
  main();
});




/**
 * entrypoint to game logic ...
 * 
 * TODO: handle multiple rounds and stop if a player has >= 100 points
 */
async function main() {

  let round = 1; // fr: pli

  // Start the game loop
  while(!Game.isFinished()) { // all cards played ?
    
    console.warn("----------------");

    let playedCards = [];

    if(Game.heartsPlayed) {
      log('Hearts played');
    } else {
      log('Hearts not playable');
    }

    // each player send a card
    for(let c = 0; c < Game.playingOrder.length; c++) {

      let p = Game.getCurrentPlayer(),
          card, // proposed card
          isAvailableMove, // boolean
          retries = 0; // attempts

      do {
        if(p.type === 'AI') {
          card = await p.proposeCard('random'); // TODO: add a basic "AI"
        } else { // human

          // UI: show the current cards played by others
          Game.showPlayedCard(playedCards);

          //
          // TODO: show/refresh authorized moves visually (greyed out card)
          //
          let el = document.getElementById(p.name);
          p.cards.forEach((card, index) => {
            let availability = Game.isAvailableMove(playedCards, card);
            let cardElem = el.querySelectorAll("span").item(index);
            cardElem.style.backgroundColor = availability ? "white" : "lightgrey";
            cardElem.style.paddingTop = availability ? "8px" : "";
          });

          card = await p.proposeCard('wait_click');
        }
        
        isAvailableMove = Game.isAvailableMove(playedCards, card);

        if(p.type === "human" && !isAvailableMove) log('You can\'t play ' + card + " " + ("!".repeat(retries+1)));

        retries++;
      } while(!isAvailableMove);
      
      // the move is valid -> play and add it
      p.play(card);
      playedCards.push(card);


      Game.next(); // go to next player
    }

    // UI: show the current cards played
    Game.showPlayedCard(playedCards);
    log("Round "+round+" : "+playedCards);

    Game.heartsPlayed = Game.heartsPlayed || playedCards.map(c => c[0]).includes('♥');


    // TODO: check who loses !
    // TODO: count points !
    // TODO: the one who lose, should start in the next round ?
    //console.log("Looser : ", Game.whoLose(playedCards));


    // UI: refresh players board (as a card has been played...)
    Object.keys(Game.players).map(player => Game.displayPlayerCards(player));

    //
    // END of round
    //

    // temporisation to see visually who wins ...
    await sleep( Game.countHumanPlayer > 0 ? 750 : 250 /*milliseconds*/ );

    round++;
  }

  // TODO: Show winner, ...

}

main()