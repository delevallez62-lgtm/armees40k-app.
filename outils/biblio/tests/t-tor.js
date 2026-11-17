const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(()=>{window.__majPop=1;const c=document.querySelector('#encov [data-enc="ovclose"]');c&&c.click();dzToggle(true)});await wait(500);
// arme sans « Torrent » connu : 8 touches à 4+
await ev(()=>{dzWeapon({name:'Bolter',a:'8',ct:'4+',f:'4',pa:'0',d:'1',c:'',m:1})});await wait(600);
await ev(()=>document.getElementById('dzth').click());await wait(4500);
const st0=await ev(()=>({n:document.querySelectorAll('#dzt .dzd').length,ph:[...document.querySelectorAll('#dzph>span')].findIndex(s=>s.classList.contains('on')),btn:(()=>{const b=document.querySelector('[data-z="xt"]');return b?{hidden:b.hidden,txt:b.innerText}:null})(),s:document.querySelectorAll('#dzt .dzd.s').length}));
ok('après le premier jet : bouton « Torrent » proposé',st0.btn&&!st0.btn.hidden,st0);
await ev(()=>document.querySelector('[data-z="xt"]').click());await wait(400);
const st1=await ev(()=>({s:document.querySelectorAll('#dzt .dzd.s').length,x:document.querySelectorAll('#dzt .dzd.x').length,n:document.querySelectorAll('#dzt .dzd').length,txt:document.getElementById('dzhow').innerText,btn:document.querySelector('[data-z="xt"]').innerText}));
ok('Torrent activé : tous les dés comptent comme réussis',st1.s===st1.n&&st1.x===0&&/Torrent/.test(st1.txt),st1);
await ev(()=>document.getElementById('dzrr').click());await wait(4500);
const st2=await ev(()=>({ph:[...document.querySelectorAll('#dzph>span')].findIndex(s=>s.classList.contains('on')),n:document.querySelectorAll('#dzt .dzd').length,hist:document.getElementById('dzph').innerText}));
ok('validation : on passe à la blessure avec tous les dés',st2.ph===1&&st2.n===8,st2);
// désactivation
await ev(()=>document.getElementById('dznew').click());await wait(500);
await ev(()=>document.getElementById('dzth').click());await wait(4000);
await ev(()=>{document.querySelector('[data-z="xt"]').click()});await wait(300);await ev(()=>{document.querySelector('[data-z="xt"]').click()});await wait(300);
const st3=await ev(()=>({btn:document.querySelector('[data-z="xt"]').innerText,s:document.querySelectorAll('#dzt .dzd.s').length,n:document.querySelectorAll('#dzt .dzd').length}));
ok('Torrent désactivable (retour aux vrais jets)',!/oui/.test(st3.btn),st3);
await b.close()})();
