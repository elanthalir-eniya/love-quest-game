const $=s=>document.querySelector(s),C=$('#c'),X=C.getContext('2d'),W=960,H=540,G=450;C.width=W;C.height=H;
const I=n=>{const i=new Image();i.src='assets/'+n+'.png';return i};
const IM={lok:I('lokesh'),kan:I('kanmani')};
const S={};['bgm','collect','hit','win'].forEach(n=>S[n]=new Audio('assets/'+n+'.wav'));S.bgm.loop=true;S.bgm.volume=.35;
let mute=false;const play=n=>{if(mute)return;try{S[n].currentTime=0;S[n].play()}catch(e){}};
const N={1:'Level 1 · The Beginning 🌸',2:'Level 2 · The Love Challenge 💗',3:'Level 3 · Forever Together 🌙'};
const LV={1:{emoji:'💗',goal:3000,xs:[480,950,1400,1950,2550],hi:[0,1,0,1,0],ob:[700,1180,1700,2250,2780]},
3:{emoji:'🍦',goal:3400,xs:[450,1000,1550,2150,2800],hi:[1,0,1,0,1],ob:[650,780,1250,1800,2000,2500,3050]}};
let mode='none',T=0,lv=0,L,P,kx=0,cam=0,got=0,score=0,items=[],obs=[],hint=0,parts=[],nextFn=null,mt=0,met=0,keys={},cs={p:0,m:0};

// ---------- UI helpers ----------
const ui=$('#ui'),dlg=$('#dlg');
function card(html,ms,cb){ui.innerHTML='<div class="full">'+html+'</div>';ui.className='on';setTimeout(()=>{ui.className='';cb&&setTimeout(cb,600)},ms)}
function say(lines,cb){let i=0;const n=()=>{if(i>=lines.length){dlg.className='';nextFn=null;cb&&cb();return}
 const d=lines[i++],k=d.w=='k';dlg.className='on';
 dlg.innerHTML=`<img src="assets/${k?'kanmani':'lokesh'}_face.png"><div><b>${k?'Kanmani 💗':'Lokesh 😎'}</b><p>${d.t}</p><small>tap / Enter ▶</small></div>`};
 nextFn=n;dlg.onclick=n;n()}
function hud(){const on=mode=='run'||mode=='cards'||mode=='meet'||mode=='fin';$('#hud').style.display=lv?'flex':'none';
 $('#hl').textContent=N[lv]||'';$('#hs').textContent='⭐ '+score;
 if(lv==2){$('#hm').textContent=`Pairs ${cs.p}/6 · Moves ${cs.m}`;$('#pf').style.width=cs.p/6*100+'%'}
 else if(L){$('#hm').textContent=`${L.emoji} ${got}/5 collected`+(hint>0?' — collect all 5 first!':'');$('#pf').style.width=Math.min(100,P.x/L.goal*100)+'%'}
 $('#touch').className=mode=='run'?'on':''}
$('#bm').onclick=()=>{mute=!mute;mute?S.bgm.pause():S.bgm.play();$('#bm').textContent=mute?'🔇':'🔊'};
$('#bx').onclick=()=>{if(confirm('Restart the game from Level 1?'))begin()};

// ---------- Game flow ----------
function title(){ui.innerHTML='<div class="full"><h1>THE LOVE QUEST ❤️</h1><small>A Journey Through Our Story</small><button id="go">▶ Start</button></div>';ui.className='on';
 $('#go').onclick=()=>{S.bgm.play().catch(()=>{});ui.className='';setTimeout(()=>card('<span class="big">Hi Lokesh 💗</span>',3200,intro),500)}}
function intro(){lv=0;mode='intro';hud();
 say([{w:'k',t:'Are you ready to play this game? Let\'s go, hurray! 🎉'},{w:'l',t:'I\'m ready! 💪'}],()=>card('Level 1<br><small>The Beginning 🌸</small>',1800,()=>startRun(1)))}
function begin(){lv=0;score=0;L=null;mode='none';parts=[];$('#cards').className='';dlg.className='';card('<span class="big">Restarting 💗</span>',1200,()=>startRun(1))}
function startRun(n){lv=n;L=LV[n];P={x:120,y:0,vy:0,f:1,hold:0,hit:0};cam=0;got=0;met=0;mt=0;hint=0;parts=[];kx=L.goal+(n==1?30:60);
 items=L.xs.map((x,i)=>({x,y:L.hi[i]?140:35,d:0}));obs=L.ob.map(x=>({x}));mode='fin';hud();
 say([{w:'k',t:n==1?'Collect 5 hearts 💗 on the road, jump over the rocks, and meet me at Crossword bookshop! 📚':'Last level! Collect 5 ice creams 🍦 in the magical garden and find me, my love! 🌙'},
 {w:'l',t:'Arrow keys / buttons to move, Space to jump. Let\'s go! 🏃'}],()=>{mode='run'})}
function startCards(){lv=2;mode='cards';L=null;cs={p:0,m:0};hud();const e=['💖','🌸','🍦','📚','🌙','⭐'],d=[...e,...e].sort(()=>Math.random()-.5),g=$('#cards');g.innerHTML='';g.className='on';
 let a=null,lock=false;
 d.forEach(v=>{const b=document.createElement('button');b.className='cd';b.textContent=v;g.appendChild(b);
  b.onclick=()=>{if(lock||b.classList.contains('f'))return;b.classList.add('f');if(!a){a=b;return}
   cs.m++;if(a.textContent==v){a.classList.add('m');b.classList.add('m');a=null;cs.p++;score+=100;play('collect');
    if(cs.p==6){score+=Math.max(100,600-cs.m*20);play('win');setTimeout(()=>{g.className='';say([
     {w:'k',t:'Heyy, you finished it! Just like I said, you are so intelligent 💗'},{w:'l',t:'Yes, I am! 😎'},
     {w:'k',t:'You might find the next level difficult... 😏'}],()=>card('🔓 Level 3 Unlocked!<br><small>Forever Together 🌙</small>',2200,()=>startRun(3)))},900)}}
   else{lock=true;const x=a;a=null;setTimeout(()=>{x.classList.remove('f');b.classList.remove('f');lock=false},800)}}});
 say([{w:'k',t:'Level 2: flip the cards and match all 6 pairs! Show me how well you know us 💞'}])}
function finish(){mode='fin';score+=500;play('win');
 if(lv==1)say([{w:'k',t:'You played well, Lokesh! 💗'},{w:'l',t:'Thank you! Our first meet is adorable 🥰'},{w:'k',t:'Yesss, it\'s true! 🌸'}],()=>card('🔓 Level 2 Unlocked!<br><small>The Love Challenge 💗</small>',2200,startCards));
 else{mode='meet'}}
function ending(){mode='fin';
 card('You completed all three levels! ❤️<br>My love<br><small>— Kanmani</small>',4200,()=>card('But this isn\'t the end of our story.<br>The best adventure is the one we continue together. 🌙',5200,()=>card('You have unlocked my heart! 🔓💖',3800,()=>{
 ui.innerHTML=`<div class="full"><span class="big" style="font-size:2.4em">I Love You Babe 💖</span><small>Lokesh ❤️ Kanmani<br>Final score: ⭐ ${score}</small><button id="again">↺ Play Again</button></div>`;ui.className='on';$('#again').onclick=begin;burst(480,270,40)})))}
function burst(x,y,n){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*6,vy:-Math.random()*5-1,l:90+Math.random()*60,e:['💖','💗','✨','💕'][i%4]})}

// ---------- Input ----------
const K={ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r',ArrowUp:'j',w:'j',' ':'j'};
addEventListener('keydown',e=>{if(e.key=='Enter'||(e.key==' '&&nextFn)){if(nextFn){e.preventDefault();nextFn();return}}
 if(K[e.key]){keys[K[e.key]]=1;e.preventDefault()}if(e.key=='Shift')keys.s=1});
addEventListener('keyup',e=>{if(K[e.key])keys[K[e.key]]=0;if(e.key=='Shift')keys.s=0});
[['tl','l'],['tr','r'],['tj','j']].forEach(([id,k])=>{const b=$('#'+id);
 b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=1});['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,()=>keys[k]=0))});
addEventListener('contextmenu',e=>e.preventDefault());

// ---------- Update ----------
function update(){
 if(mode=='run'){const dx=(keys.r?1:0)-(keys.l?1:0);
  if(dx){P.f=dx;P.hold=Math.min(90,P.hold+1)}else P.hold=0;
  const sp=dx*(2.8+Math.min(3.2,P.hold/25)+(keys.s?1:0));P.x+=sp;
  if(keys.j&&P.y==0)P.vy=14;P.y+=P.vy;P.vy-=.7;if(P.y<=0){P.y=0;P.vy=0}
  if(P.hit>0)P.hit--;if(hint>0)hint--;
  const lim=got>=5?L.goal-90:L.goal-130;if(P.x<40)P.x=40;
  if(P.x>lim){P.x=lim;if(got<5)hint=120}
  items.forEach(it=>{if(!it.d&&Math.abs(P.x-it.x)<45&&Math.abs(P.y+60-it.y)<70){it.d=1;got++;score+=100;play('collect');burst(it.x-cam,H-G+250,6)}});
  obs.forEach(o=>{if(P.hit<=0&&Math.abs(P.x-o.x)<38&&P.y<36){P.hit=70;P.x=Math.max(40,P.x-90);P.vy=8;score=Math.max(0,score-50);play('hit')}});
  if(got>=5&&P.x>=L.goal-90)finish()}
 if(mode=='meet'){if(kx-P.x>75){P.x+=1;kx-=1;P.f=1}else{if(!met){met=1;burst(P.x-cam+60,300,50);play('win')}mt++;if(mt==220)ending()}}
 parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.l--});parts=parts.filter(p=>p.l>0)}

// ---------- Drawing ----------
function hills(off,base,amp,col){X.fillStyle=col;X.beginPath();X.moveTo(0,H);for(let x=0;x<=W;x+=10)X.lineTo(x,base+Math.sin((x+off)/140)*amp+Math.sin((x+off)/57)*amp*.3);X.lineTo(W,H);X.fill()}
function tree(x,s,t,c){X.fillStyle='#8a5a44';X.fillRect(x-6*s,G-70*s,12*s,75*s);X.fillStyle=c;[[0,-90],[-28,-65],[28,-65]].forEach(([a,b])=>{X.beginPath();X.arc(x+a*s,G+b*s,36*s,0,7);X.fill()})}
function bg(n,c){const g=X.createLinearGradient(0,0,0,H),st=(...a)=>a.forEach((v,i)=>g.addColorStop(i/(a.length-1),v));
 n==1?st('#a9d6ff','#ffd9ec','#fff3d6'):n==2?st('#4b3b8f','#b58ae0','#ffc2e6'):st('#0b1040','#3a2a7a','#8a4aa8');
 X.fillStyle=g;X.fillRect(0,0,W,H);
 if(n==1){X.fillStyle='#fff6b0';X.beginPath();X.arc(780,100,50,0,7);X.fill();X.fillStyle='#fff9';[[150,90],[450,60],[640,130]].forEach(([x,y])=>{x=(x-c*.05+2000)%1100-100;X.beginPath();X.arc(x,y,28,0,7);X.arc(x+30,y+5,22,0,7);X.arc(x-28,y+8,20,0,7);X.fill()})}
 if(n!=1){X.fillStyle='#fff';for(let i=0;i<70;i++){X.globalAlpha=.4+.6*Math.abs(Math.sin(T/30+i));X.fillRect((i*137)%W,(i*71)%330,2,2)}X.globalAlpha=1}
 if(n==3){X.fillStyle='#fff8d6';X.shadowColor='#fff8d6';X.shadowBlur=40;X.beginPath();X.arc(760,110,55,0,7);X.fill();X.shadowBlur=0;X.fillStyle='#e6d9a8';X.beginPath();X.arc(740,95,10,0,7);X.arc(785,125,7,0,7);X.fill()}
 if(n==2){X.fillStyle='#8a63c8';X.fillRect(420,170,120,150);X.fillRect(400,150,30,170);X.fillRect(530,150,30,170);[[415,150],[545,150],[480,170]].forEach(([x,y])=>{X.beginPath();X.moveTo(x-22,y);X.lineTo(x,y-50);X.lineTo(x+22,y);X.fill()});X.fillStyle='#ffe28a';X.fillRect(470,250,20,40)}
 hills(c*.15,n==3?330:300,40,n==1?'#c9b3f0':n==3?'#2b2a6a':'#9a70d8');hills(c*.3+200,n==3?380:350,30,n==1?'#a8e0a0':n==3?'#23234f':'#7f5cc0');
 if(n!=2){for(let i=-1;i<6;i++){const x=i*260-(c*.6)%260+130;n==1?tree(x,1,0,i%2?'#6cc47a':'#85d98d'):(X.fillStyle='#173a40',X.beginPath(),X.arc(x,G-15,45,0,7),X.arc(x+40,G-5,35,0,7),X.fill(),X.fillStyle='#ff9ccc',X.shadowColor='#ff9ccc',X.shadowBlur=12,X.fillRect(x-20,G-30,5,5),X.fillRect(x+25,G-15,5,5),X.shadowBlur=0)}}
 if(n==2){X.font='24px serif';for(let i=0;i<14;i++){X.globalAlpha=.6;X.fillText(i%2?'✨':'💜',(i*83+T*.3)%W,H-((T*.4+i*50)%H))}X.globalAlpha=1}
 if(n==3){X.font='22px serif';for(let i=0;i<9;i++){X.globalAlpha=.55;X.fillText('💗',(i*113+T*.2)%W,H-((T*.5+i*70)%H))}X.globalAlpha=1}
 if(n!=2){X.fillStyle=n==1?'#9bd77a':'#2f5a55';X.fillRect(0,G,W,H-G);X.fillStyle=n==1?'#ecd7a8':'#4b3c7a';X.fillRect(0,G+12,W,70);X.fillStyle='#fff8';for(let x=-(c%80);x<W;x+=80)X.fillRect(x,G+44,40,4)}}
function fig(im,x,feet,h,flip,bob,rot,flash){if(!im.naturalWidth)return;const w=h*im.naturalWidth/im.naturalHeight;
 X.fillStyle='#0003';X.beginPath();X.ellipse(x,G+30,w*.4,8,0,0,7);X.fill();
 X.save();X.translate(x,feet+bob);X.rotate(rot||0);if(flip)X.scale(-1,1);if(flash)X.globalAlpha=.5;X.drawImage(im,-w/2,-h,w,h);X.restore()}
function scene(){bg(lv,cam);
 if(lv==1){const sx=L.goal+100-cam;X.fillStyle='#e8b98a';X.fillRect(sx,G-190,320,205);X.fillStyle='#b5523b';X.fillRect(sx-10,G-210,340,30);
  X.fillStyle='#fff';X.fillRect(sx+40,G-175,240,40);X.fillStyle='#b5523b';X.font='bold 30px Georgia';X.textAlign='center';X.fillText('Crossword',sx+160,G-145);X.textAlign='left';
  X.fillStyle='#8ad0ee';X.fillRect(sx+30,G-120,100,80);X.fillRect(sx+200,G-120,90,80);X.fillStyle='#7a4a35';X.fillRect(sx+145,G-110,45,115);X.font='28px serif';X.fillText('📚',sx+50,G-70);X.fillText('📖',sx+225,G-70)}
 else{const gx=L.goal+130-cam;X.fillStyle='#ffe28a';X.shadowColor='#ffe28a';X.shadowBlur=30;X.fillRect(gx-4,G-150,8,150);X.fillRect(gx+96,G-150,8,150);X.fillRect(gx-20,G-165,140,12);X.shadowBlur=0;X.font='34px serif';X.fillText('💗',gx+30,G-130)}
 X.font='36px serif';X.textAlign='center';
 items.forEach(it=>{if(!it.d)X.fillText(L.emoji,it.x-cam,G+20-it.y+Math.sin(T/10+it.x)*5)});
 obs.forEach(o=>{const x=o.x-cam;if(lv==1){X.fillStyle='#8c8c9e';X.beginPath();X.ellipse(x,G+5,32,28,0,Math.PI,0);X.fill();X.fillStyle='#a8a8bc';X.beginPath();X.ellipse(x-8,G-12,12,8,0,0,7);X.fill()}else{X.fillStyle='#1f5a3a';X.beginPath();X.arc(x-12,G,20,Math.PI,0);X.arc(x+12,G,22,Math.PI,0);X.fill();X.fillStyle='#ff9ccc';X.fillRect(x-4,G-18,5,5)}});
 X.textAlign='left';
 fig(IM.kan,kx-cam,G+40,150,0,Math.sin(T/20)*2,0);
 const mv=mode=='run'&&(keys.l||keys.r)&&P.y==0,bob=mv?-Math.abs(Math.sin(T*.3))*8:0,rot=mv?Math.sin(T*.3)*.05:0;
 fig(IM.lok,P.x-cam,G+40-P.y,150,P.f<0,bob,rot,P.hit>0&&T%8<4);
 if(mode=='meet'){X.font='40px serif';const px=P.x-cam;X.fillText('🍦',met?px+85:px+55,G-60-(met?Math.sin(mt/8)*6:0))}
 parts.forEach(p=>{X.font='24px serif';X.globalAlpha=Math.min(1,p.l/30);X.fillText(p.e,p.x,p.y)});X.globalAlpha=1}
function loop(){T++;update();X.clearRect(0,0,W,H);
 if(mode=='intro'){bg(1,T*2);fig(IM.kan,300,G+60,330,0,Math.sin(T/20)*3);fig(IM.lok,660,G+60,330,0,Math.sin(T/20+1)*3);
  X.font='bold 30px Georgia';X.textAlign='center';X.fillStyle='#fff';X.strokeStyle='#8a4aa8';X.lineWidth=5;[['Kanmani 💗',300],['Lokesh 😎',660]].forEach(([t,x])=>{X.strokeText(t,x,95);X.fillText(t,x,95)});X.textAlign='left'}
 else if(lv==2)bg(2,T);
 else if(lv&&L){cam=Math.min(Math.max(P.x-350,0),L.goal-520);scene()}
 else bg(1,T);
 hud();requestAnimationFrame(loop)}
loop();title();
