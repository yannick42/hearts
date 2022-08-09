
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

/**
 * Log a variable to debug
 * 
 * @param {*} name  variable name
 * @param {*} value (if null, it delete the variable) 
 * @param {*} overwrite 
 */
export function logvar(name, value, overwrite=false) {
  let el = document.querySelector('#debug-variables > #'+name),
      debugEl = document.getElementById('debug-variables');
  if(!el) {
    let span = document.createElement('span');
    span.id = name;
    span.className = "variable";
    el = debugEl.appendChild(span);
  }

  if(overwrite) {
    if(value === null) {
      el.parentElement.removeChild(el);
    } else {
      el.innerHTML = value;
    }
  } else {
    el.innerHTML = value + '<br/>' + el.innerHTML;
  }
}
