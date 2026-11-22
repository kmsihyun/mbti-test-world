const ticketSize = 6;
const numbers = Array.from({ length: 45 }, (_, index) => index + 1);
const selected = new Set();
const grid = document.querySelector('#number-grid');
const pickCount = document.querySelector('#pick-count');
const quickPick = document.querySelector('#quick-pick');
const clearTicket = document.querySelector('#clear-ticket');
const drawButton = document.querySelector('#draw');
const mode = document.querySelector('#reveal-mode');
const message = document.querySelector('#draw-message');
const myNumbers = document.querySelector('#my-numbers');
const drawnNumbers = document.querySelector('#drawn-numbers');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let drawing = false;
let drawn = [];

function sampleTicket() {
  const pool = [...numbers];
  return Array.from({ length: ticketSize }, () => {
    const index = Math.floor(Math.random() * pool.length);
    return pool.splice(index, 1)[0];
  });
}

function renderBalls(list, values, matches = []) {
  list.replaceChildren(...Array.from({ length: ticketSize }, (_, index) => {
    const ball = document.createElement('li');
    const number = values[index];
    ball.textContent = number ?? '·';
    if (number === undefined) ball.setAttribute('aria-hidden', 'true');
    if (matches.includes(number)) {
      ball.classList.add('match');
      ball.setAttribute('aria-label', number + ' 일치');
    }
    return ball;
  }));
}

function updateControls() {
  pickCount.textContent = selected.size + ' / ' + ticketSize;
  for (const button of grid.children) {
    const isSelected = selected.has(Number(button.textContent));
    button.setAttribute('aria-pressed', String(isSelected));
    button.disabled = drawing || (!isSelected && selected.size === ticketSize);
  }
  quickPick.disabled = drawing;
  clearTicket.disabled = drawing || selected.size === 0;
  mode.disabled = drawing;
  drawButton.disabled = drawing || selected.size !== ticketSize;
}

function updateTicket() {
  drawn = [];
  renderBalls(myNumbers, [...selected].sort((a, b) => a - b));
  renderBalls(drawnNumbers, drawn);
  message.textContent = selected.size === ticketSize
    ? '번호가 준비됐어요. 추첨해 볼까요?'
    : '번호 여섯 개를 선택하면 추첨할 수 있어요.';
  updateControls();
}

for (const number of numbers) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = number;
  button.addEventListener('click', () => {
    if (drawing) return;
    if (selected.has(number)) selected.delete(number);
    else if (selected.size < ticketSize) selected.add(number);
    updateTicket();
  });
  grid.append(button);
}

quickPick.addEventListener('click', () => {
  selected.clear();
  sampleTicket().forEach(number => selected.add(number));
  updateTicket();
});

clearTicket.addEventListener('click', () => {
  selected.clear();
  updateTicket();
  grid.firstElementChild.focus();
});

drawButton.addEventListener('click', async () => {
  if (drawing || selected.size !== ticketSize) return;
  drawing = true;
  updateControls();
  drawn = sampleTicket();
  message.textContent = '번호를 추첨하고 있어요…';
  renderBalls(drawnNumbers, []);
  if (mode.querySelector(':checked').value === 'sequence' && !reducedMotion.matches) {
    for (let count = 1; count <= ticketSize; count++) {
      await new Promise(resolve => setTimeout(resolve, 230));
      const revealed = drawn.slice(0, count);
      renderBalls(drawnNumbers, revealed, revealed.filter(number => selected.has(number)));
    }
  }
  const matches = drawn.filter(number => selected.has(number));
  renderBalls(drawnNumbers, drawn, matches);
  renderBalls(myNumbers, [...selected].sort((a, b) => a - b), matches);
  message.textContent = matches.length
    ? '여섯 개 중 ' + matches.length + '개 일치! 맞힌 번호: ' + matches.sort((a, b) => a - b).join(', ')
    : '이번에는 일치한 번호가 없어요. 같은 번호로 다시 뽑아도 돼요.';
  drawing = false;
  updateControls();
  drawButton.focus();
});

updateTicket();
