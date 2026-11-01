const {types,groups,axes}=Personality;
const grid=document.getElementById('type-grid');
const detail=document.getElementById('type-detail');
let group='all';
const search=document.getElementById('type-search');
function render(){
 const query=search.value.trim().toLowerCase();
 const list=Object.values(types).filter(t=>(group==='all'||t.group===group)&&[t.code,t.title,...t.tags,t.summary].join(' ').toLowerCase().includes(query));
 grid.replaceChildren();
 for(const t of list){const card=document.createElement('a');card.className=`type-card ${groups[t.group].color}`;card.href=`#${t.code}`;card.innerHTML=`<span class="card-group">${groups[t.group].name}</span><span class="type-code">${t.code}</span><h3>${t.title}</h3><p>${t.summary}</p><span class="card-bottom">${t.tags.join(' · ')} <b aria-hidden="true">↗</b></span>`;grid.append(card);}
 document.getElementById('type-count').textContent=`${list.length}가지 유형`;
 document.getElementById('empty').hidden=list.length>0;
}
function showDetail(focus=true){
 const code=location.hash.slice(1).toUpperCase();const t=types[code];
 if(!t){detail.hidden=true;return;}
 detail.hidden=false;detail.className=`type-detail paper ${groups[t.group].color}`;
 detail.innerHTML=`<div class="detail-top"><span class="eyebrow">${groups[t.group].name}</span><a href="#all-title" class="small-link">목록으로 ↑</a></div><div class="detail-hero"><span class="detail-code">${t.code}</span><div><h2 id="detail-title">${t.title}</h2><p>${t.summary}</p><div class="tags">${t.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div></div><div class="detail-columns"><article><span class="detail-number">01 / STRENGTH</span><h3>이런 강점이 있어요</h3><p>${t.strength}</p></article><article><span class="detail-number">02 / GROWTH</span><h3>조금 더 넓어지는 연습</h3><p>${t.growth}</p></article><article><span class="detail-number">03 / CONNECTION</span><h3>이렇게 대화해보세요</h3><p>${t.communication}</p></article></div><div class="letter-notes">${axes.map(a=>{const left=code.includes(a.pair[0]);return `<span><b>${left?a.pair[0]:a.pair[1]}</b> ${left?a.left:a.right}</span>`;}).join('')}</div>`;
 if(focus){detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});detail.focus({preventScroll:true});}
}
document.getElementById('axis-guide').innerHTML=axes.map(a=>`<article class="axis-card"><span class="axis-letters">${a.pair[0]} <i>↔</i> ${a.pair[1]}</span><h3>${a.title}</h3><span class="muted">${a.left} · ${a.right}</span><p>${a.note}</p></article>`).join('');
document.querySelectorAll('[data-group]').forEach(button=>button.addEventListener('click',()=>{group=button.dataset.group;document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
search.addEventListener('input',render);
window.addEventListener('hashchange',()=>showDetail());
try{if(sessionStorage.getItem('mbti-result'))document.getElementById('my-result').hidden=false;}catch{}
render();showDetail();
