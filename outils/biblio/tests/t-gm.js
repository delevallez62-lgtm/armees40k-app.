const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;
S.lists=[{id:'A',name:'Armée A',units:[],dets:[],strats:[],mission:'disruption',game:'w40k'},{id:'B',name:'Armée B',units:[],dets:[],strats:[],mission:'take-and-hold',game:'w40k'}];S.cur='A';
S.prep={g:'w40k',l:'B',m1:'purge-the-foe',i1:'',m2:'',me:'Moi'};tab='lists';draw()});await wait(300);
await ev(()=>gPrep('A'));await wait(500);
const r=await ev(()=>({m1:S.prep.m1,l:S.prep.l,txt:document.body.innerText}));
ok('liste A choisie : sa mission est reprise (pas l\'ancienne)',r.l==='A'&&r.m1==='',r);
ok('la mission de la liste s\'affiche',/Disruption|Perturbation|Désorganisation/i.test(r.txt)||/mission/i.test(r.txt),r.txt.slice(0,200));
await ev(()=>{document.querySelector('.gclose,[data-gp="close"]')&&document.querySelector('.gclose,[data-gp="close"]').click()});
// autre liste via le sélecteur
const r2=await ev(()=>{const s=document.querySelector('[data-gs="l"]');if(!s)return null;s.value='B';s.dispatchEvent(new Event('change',{bubbles:true}));return {m1:S.prep.m1,eff:(S.lists.find(l=>l.id===S.prep.l)||{}).mission}});
ok('changer de liste dans la préparation : mission de B',r2&&r2.eff==='take-and-hold'&&r2.m1==='',r2);
await ev(()=>{S.prep.l='A';S.prep.m1='purge-the-foe';S.prep.i1='x';gReset&&0;});
await ev(()=>{const c=document.querySelector('.gclose,[data-gp="close"]');c&&c.click()});
const r3=await ev(()=>{S.pm=null;S.mg=false;gPrep('A');return {m1:S.prep.m1,i1:S.prep.i1}});
ok('même liste, ancien choix temporaire effacé : mission de la liste appliquée',r3.m1==='',r3);
// écran des détachements
await ev(()=>{S.lists=[{id:'D',name:'Orks',units:[],dets:[],strats:[],bld:{fac:'orks',facN:'Orks',limit:2000,fmt:'',pv:'x',tot:0,dets:[]}}];S.cur='D';BLDSTATE.id='D';BLDSTATE.scr='edit';BLDSTATE.step='1';S.pm=null;tab='bld';draw()});await wait(400);await ev(()=>document.querySelector('[data-bld="det"]').click());await wait(500);
const d=await ev(()=>{const e=document.querySelector('#bldm');return {bar:!!e.querySelector('.bld-dpbar'),pills:e.querySelectorAll('.bld-dpb').length,txt:e.innerText.slice(0,260)}});
ok('détachements : bandeau des points + pastille de coût sur chaque détachement',d.bar&&d.pills>3,d);
await ev(()=>{['encov','bibp'].forEach(i=>{const e=document.getElementById(i);if(e)e.innerHTML=''});document.querySelectorAll('.bib-ov').forEach(e=>{if(!e.closest('#bldm'))e.remove()})});await p.screenshot({path:'det-pts.png'});
await b.close()})();
