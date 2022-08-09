
import { Game } from "/js/game.js";
import { sleep, log } from "/js/util.js";

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

async function main() {

  let round = 1;
  // Start game loop
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
          card,
          availableMove,
          retries = 0; // attempts

      do {
        if(p.type == 'AI') {
          card = await p.proposeCard('random'); // TODO: add a basic "AI"
        } else {
          // UI: show the current cards played
          Game.showPlayedCard(playedCards);

          // TODO : show authorized moves visually (greyed out card) !

          card = await p.proposeCard('wait_click');
        }
        
        availableMove = Game.isAvailableMove(playedCards, card);

        if(p.type === "human" && !availableMove) log('You can\'t play ' + card + " " + ("!".repeat(retries+1)));

        retries++;
      } while(!availableMove);
      
      // the move is valid -> play and add it
      p.play(card);
      playedCards.push(card);


      Game.next(); // go to next player
    }

    // UI: show the current cards played
    Game.showPlayedCard(playedCards);
    log("Round "+round+" : "+playedCards);

    Game.heartsPlayed = Game.heartsPlayed || playedCards.map(c => c[0]).includes('♥');


    // TODO: check who loses !!
      // TODO: who loses, will start in the next round ?
    console.log("Looser : ", Game.whoLose(playedCards));
    

    // UI: update players board
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