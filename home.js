const typeCodes = Object.keys(window.Personality.types);
const tiles = [...document.querySelectorAll('.letter-tiles b')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let deck = [];
let lastType;
let timer;

function showNextType() {
  if (!deck.length) {
    deck = [...typeCodes];
    for (let index = deck.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [deck[index], deck[other]] = [deck[other], deck[index]];
    }
    if (deck.at(-1) === lastType) {
      [deck[0], deck[deck.length - 1]] = [deck.at(-1), deck[0]];
    }
  }
  lastType = deck.pop();
  tiles.forEach((tile, index) => {
    tile.textContent = lastType[index];
    tile.nextElementSibling.textContent = ['EI', 'NS', 'FT', 'PJ'][index].replace(lastType[index], '');
  });
}

function updateRotation() {
  clearInterval(timer);
  if (!motion.matches && !document.hidden) timer = setInterval(showNextType, 2400);
}

showNextType();
updateRotation();
motion.addEventListener('change', updateRotation);
document.addEventListener('visibilitychange', updateRotation);
