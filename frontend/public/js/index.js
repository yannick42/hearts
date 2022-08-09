
import { Game } from "/js/game.js";
import { sleep } from "/js/util.js";

document.getElementById('start-btn').addEventListener('click', function() {
  main();
});

async function main() {

  // distribute cards
  Game.start(['south']); // array with human players

  // Start game loop
  while(!Game.isFinished()) { // all cards played ?
    
    console.warn("----------------");

    let playedCards = [];

    // each player show a card
    for(let c = 0; c < Game.playingOrder.length; c++) {

      let p = Game.getCurrentPlayer(),
          card;

      if(p.type == 'AI') { // TODO: add a basic "AI"
        card = await p.play('random');
      } else {
        // UI: show the current cards played
        Game.showPlayedCard(playedCards);

        // TODO : show authorized moves !

        card = await p.play('wait_click');
      }

      playedCards.push(card);

      Game.next(); // go to next player
    }

    // UI: show the current cards played
    Game.showPlayedCard(playedCards);
    //console.warn(playedCards);


    // TODO: check who wins !!
      // TODO: who wins start in the next loop
    

    // UI: update players board
    Object.keys(Game.players).map(player => Game.displayPlayerCards(player));


    // temporisation
    await sleep(250 /*ms*/);
  }

  // TODO: Show winner, ...
}

main()