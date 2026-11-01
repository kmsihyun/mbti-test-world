(function(root){
 const questions = [
 ['E','새로운 사람에게 먼저 말을 거는 편이다.'],
 ['S','추상적인 이론보다 구체적인 사례로 배우는 것이 편하다.'],
 ['F','친구가 고민을 말하면 해결책보다 공감을 먼저 건넨다.'],
 ['J','여행 전 일정과 준비물을 미리 정리하는 편이다.'],
 ['E','여럿이 함께하는 활동에서 활력을 얻는다.'],
 ['N','현재의 사실보다 앞으로의 가능성을 상상하는 일이 즐겁다.'],
 ['T','의견을 정할 때 개인적인 감정보다 논리와 근거를 우선한다.'],
 ['J','여러 일을 벌이기보다 한 가지를 마무리하고 다음 일을 시작한다.'],
 ['I','모임에서 새로운 사람보다 익숙한 사람과 대화하는 것이 편하다.'],
 ['S','새로운 방법을 시도하기보다 검증된 방법을 사용하는 편이다.'],
 ['F','갈등을 해결할 때 옳고 그름만큼 상대방의 마음을 고려한다.'],
 ['J','일정이나 목록을 만들어 계획하는 것을 좋아한다.'],
 ['I','생각을 말하기 전에 혼자 정리할 시간이 필요하다.'],
 ['N','설명을 들을 때 세부 사항보다 전체적인 의미를 먼저 파악한다.'],
 ['T','어려운 결정을 내릴 때 일관된 기준을 중요하게 여긴다.'],
 ['P','예정에 없던 기회가 생기면 계획을 유연하게 바꾼다.'],
 ['I','여럿과 시간을 보낸 뒤에는 혼자 쉬며 에너지를 회복한다.'],
 ['N','하나의 주제에서 여러 아이디어와 가능성을 떠올리는 편이다.'],
 ['F','피드백을 줄 때 상대방이 어떻게 받아들일지 먼저 생각한다.'],
 ['P','세부 일정을 확정하기보다 상황에 맞춰 움직이는 것이 편하다.']
 ].map(([yes,text])=>({yes,text}));
 const pairs=['EI','SN','TF','JP'];
 function calculate(answers){
  if(answers.length!==questions.length||answers.some(a=>typeof a!=='boolean'))throw new Error('20개 질문에 모두 답해주세요.');
  const counts=Object.fromEntries('EISNTFJP'.split('').map(k=>[k,0]));
  questions.forEach((q,i)=>{const pair=pairs.find(p=>p.includes(q.yes));const letter=answers[i]?q.yes:[...pair].find(c=>c!==q.yes);counts[letter]++;});
  return {type:pairs.map(p=>counts[p[0]]>counts[p[1]]?p[0]:p[1]).join(''),counts};
 }
 const api={questions,pairs,calculate};
 if(typeof module!=='undefined')module.exports=api;else root.Quiz=api;
})(typeof window!=='undefined'?window:globalThis);
