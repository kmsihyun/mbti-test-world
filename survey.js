const $=id=>document.getElementById(id);
let index=0;
const answers=[];
function display(){
 $('step').textContent=`${String(index+1).padStart(2,'0')} / 20`;
 $('progress').value=index;
 $('question').textContent=Quiz.questions[index].text;
 $('back').disabled=index===0;
 $('yes').setAttribute('aria-pressed',String(answers[index]===true));
 $('no').setAttribute('aria-pressed',String(answers[index]===false));
 $('question').focus();
}
function answer(value){
 if(index>=Quiz.questions.length)return;
 answers[index]=value;
 if(++index<Quiz.questions.length){display();return;}
 const {type,counts}=Quiz.calculate(answers);
 const data=window.mbtiResults[type];
 $('quiz').hidden=true;$('result').hidden=false;
 $('result-title').textContent=type;
 $('result-body').innerHTML=`<img class="type-image" src="${data.imageSrc}" alt="${type} 유형 일러스트"><div class="description">${data.descriptionText}</div>`;
 $('scores').replaceChildren();
 for(const pair of Quiz.pairs){const row=document.createElement('p');row.textContent=`${pair[0]} ${counts[pair[0]]} : ${counts[pair[1]]} ${pair[1]}`;$('scores').append(row);}
 $('result-title').focus();
}
$('yes').addEventListener('click',()=>answer(true));
$('no').addEventListener('click',()=>answer(false));
$('back').addEventListener('click',()=>{if(index>0){index--;display();}});
$('restart').addEventListener('click',()=>{index=0;answers.length=0;$('quiz').hidden=false;$('result').hidden=true;display();});
display();
