const {test}=require('node:test');
const assert=require('node:assert/strict');
const {questions,pairs,calculate}=require('./quiz.js');
const fs=require('node:fs');
const vm=require('node:vm');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('results.js','utf8'),ctx);
test('16개 유형과 결과 이미지',()=>{
 for(let mask=0;mask<16;mask++){
  const target=pairs.map((p,i)=>p[(mask>>i)&1]).join('');
  const result=calculate(questions.map(q=>target.includes(q.yes)));
  assert.equal(result.type,target);
  for(const letter of target)assert.equal(result.counts[letter],5);
  const data=ctx.window.mbtiResults[target];assert.ok(data);assert.ok(fs.existsSync(data.imageSrc));
 }
});
test('역방향 문항',()=>{
 const answers=questions.map(q=>'ESTJ'.includes(q.yes));answers[8]=true;
 const result=calculate(answers);assert.equal(result.counts.E,4);assert.equal(result.counts.I,1);
});
test('미완료 응답 거부',()=>{
 assert.throws(()=>calculate([]));assert.throws(()=>calculate(Array(20).fill('A')));
});
test('로또 결과 영역',()=>assert.match(fs.readFileSync('lotto1.html','utf8'),/id="result-container"/));
