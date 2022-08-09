
// Cards
export const colors = ['♠', '♦', '♣', '♥']; // ordered colors

export const ordered_numbers = Array.from({length:10-2+1},(v,k)=>k+2).map(String).concat(['J', 'Q', 'K', 'A']);

// "cross join"
export const allCards = colors.flatMap(color => {
  return ordered_numbers.map(num => `${color}${num}`);
});

export const orderFn = (card1, card2) => {
  if(colors.indexOf(card1[0]) === colors.indexOf(card2[0])) {
    return ordered_numbers.indexOf(card1.slice(1)) > ordered_numbers.indexOf(card2.slice(1)) ? 1 : -1;
  }
  return colors.indexOf(card1[0]) > colors.indexOf(card2[0]) ? 1 : -1;
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function log(text) {
    document.getElementById('debug-info').innerHTML = text + '<br/>' + document.getElementById('debug-info').innerHTML;
}

export function resetLog(text) {
    document.getElementById('debug-info').innerHTML = '';
}
