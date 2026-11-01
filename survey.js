const $ = id => document.getElementById(id);
let index = 0;
let resultType = '';
const answers = [];
function display() {
  $('step').textContent = `${String(index + 1).padStart(2, '0')} / 20`;
  $('progress').value = index;
  $('question').textContent = Quiz.questions[index].text;
  $('back').disabled = index === 0;
  $('yes').setAttribute('aria-pressed', String(answers[index] === true));
  $('no').setAttribute('aria-pressed', String(answers[index] === false));
  $('question').focus();
}
function showResult(saved) {
  const { type, counts } = saved;
  const data = Personality.types[type];
  resultType = type;
  $('quiz').hidden = true;
  $('result').hidden = false;
  $('result').className = `paper result-paper ${Personality.groups[data.group].color}`;
  $('result-body').innerHTML = `<div class="result-heading"><div><h1 id="result-title" tabindex="-1">${type}</h1><h2>${data.title}</h2><p>${data.summary}</p></div><div class="result-seal" aria-hidden="true"><span>MY<br>PERSONALITY</span><b>${type}</b><span>16 UNIQUE PERSPECTIVES</span></div></div><div class="tags">${data.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
  $('scores').innerHTML = Personality.axes.map(axis => {
    const [left, right] = axis.pair;
    const percentage = counts[left] * 20;
    return `<div class="score-row"><div class="score-label"><span><b>${left}</b> ${axis.left} ${percentage}%</span><span>${100-percentage}% ${axis.right} <b>${right}</b></span></div><div class="score-track" role="img" aria-label="${axis.left} ${percentage}%, ${axis.right} ${100-percentage}%"><span style="width:${percentage}%"></span></div><p>${axis.title}</p></div>`;
  }).join('');
  $('result-tips').innerHTML = `<article><span class="eyebrow">YOUR STRENGTH</span><h3>나의 강점 메모</h3><p>${data.strength}</p></article><article><span class="eyebrow">A SMALL NEXT STEP</span><h3>오늘의 작은 연습</h3><p>${data.growth}</p></article>`;
  $('learn-more').href = `explore.html#${type}`;
  $('result-title').focus();
}
function answer(value) {
  if (index >= Quiz.questions.length) return;
  answers[index] = value;
  if (++index < Quiz.questions.length) { display(); return; }
  const result = Quiz.calculate(answers);
  try { sessionStorage.setItem('mbti-result', JSON.stringify(result)); } catch {}
  showResult(result);
}
$('yes').addEventListener('click', () => answer(true));
$('no').addEventListener('click', () => answer(false));
$('back').addEventListener('click', () => { if (index > 0) { index--; display(); } });
$('restart').addEventListener('click', () => {
  index = 0; answers.length = 0; resultType = '';
  try { sessionStorage.removeItem('mbti-result'); } catch {}
  $('quiz').hidden = false; $('result').hidden = true; $('copy-status').textContent = ''; display();
});
$('copy-result').addEventListener('click', async () => {
  const type = Personality.types[resultType];
  const text = `나의 성향은 ${type.code}, ${type.title}! ${type.tags.join(' · ')} — MBTI TEST 세상 (재미로 보는 성향 테스트)`;
  try { await navigator.clipboard.writeText(text); $('copy-status').textContent = '결과 문구를 복사했어요. 친구에게 나눠보세요.'; }
  catch { $('copy-status').textContent = `자동 복사를 사용할 수 없어요. 아래 문구를 직접 복사해주세요: ${text}`; }
});
let saved = null;
try {
  const candidate = JSON.parse(sessionStorage.getItem('mbti-result'));
  if (candidate && Personality.types[candidate.type] && Personality.axes.every(a => [...a.pair].every(c => Number.isInteger(candidate.counts?.[c]) && candidate.counts[c] >= 0 && candidate.counts[c] <= 5) && candidate.counts[a.pair[0]] + candidate.counts[a.pair[1]] === 5) && Quiz.pairs.map(p => candidate.counts[p[0]] > candidate.counts[p[1]] ? p[0] : p[1]).join('') === candidate.type) saved = candidate;
} catch {}
if (saved) { index = 20; showResult(saved); } else display();
