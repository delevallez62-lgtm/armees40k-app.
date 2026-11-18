const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const st={M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'};
 S.coll={};S.lists=[{id:'l1',name:'Ma liste test',units:[
  {name:'Intercessors',ref:'r1',size:5,pts:80,stats:st,weapons:[],subs:[]},
  {name:'Terminators',ref:'r2',size:10,pts:380,stats:st,weapons:[],subs:[]},
  {name:'Capitaine',ref:'r3',size:1,pts:90,stats:st,weapons:[],subs:[]}],dets:[],strats:[]},
  {id:'l2',name:'Liste vide',units:[],dets:[],strats:[]}];S.cur='l1';tab='lists';draw()});await wait(400);
const t=await ev(()=>document.querySelector('.grid .card').innerText);
ok('liste : figurines et points sur la carte',/16\s*figurines/.test(t)&&/550\s*pts/.test(t),t);
ok('liste vide : 0 figurine · 0 pts toujours affichés',await ev(()=>{const c=[...document.querySelectorAll('.grid .card')][1];return /0\s*figurine/.test(c.innerText)&&/0\s*pts/.test(c.innerText)}),1);
await p.screenshot({path:'lp1.png'});
await ev(()=>document.querySelector('[data-act="open"][data-id="l1"]').click());await wait(400);
const c0=await ev(()=>[...document.querySelectorAll('.card.hv')].map(c=>({s:c.querySelector('[data-blp=size]').value,p:c.querySelector('[data-blp=pts]').value})));
ok('chaque figurine montre son effectif et ses points',JSON.stringify(c0)===JSON.stringify([{s:'5',p:'80'},{s:'10',p:'380'},{s:'1',p:'90'}]),c0);
ok('en-tête : total figurines/points',await ev(()=>/16 figurines · 550 pts/.test(document.body.innerText)),await ev(()=>document.querySelector('.card.row').innerText));
await p.screenshot({path:'lp2.png'});
await p.fill('[data-blp=pts][data-i="0"]','100');await p.press('[data-blp=pts][data-i="0"]','Enter');await wait(400);
ok('modifier les points : pris en compte et sans ouvrir la fiche',await ev(()=>S.lists[0].units[0].pts===100&&/570 pts/.test(document.body.innerText)&&!document.querySelector('.ov')),await ev(()=>document.body.innerText.slice(0,200)));
await p.fill('[data-blp=size][data-i="1"]','8');await p.press('[data-blp=size][data-i="1"]','Enter');await wait(400);
ok('modifier le nombre de figurines',await ev(()=>S.lists[0].units[1].size===8&&/14 figurines/.test(document.body.innerText)),await ev(()=>document.querySelector('.card.row').innerText));
await ev(()=>{tab='lists';draw()});await wait(300);
ok('carte de liste mise à jour',await ev(()=>/14\s*figurines/.test(document.querySelector('.grid .card').innerText)&&/570\s*pts/.test(document.querySelector('.grid .card').innerText)),await ev(()=>document.querySelector('.grid .card').innerText));
ok('pas de débordement',await ev(()=>document.documentElement.scrollWidth<=innerWidth+1),1);
await ev(()=>{S.cur='l1';tab='units';draw()});await wait(300);
await ev(()=>document.querySelector('.card.hv').click());await wait(300);
ok('toucher la carte (hors champs) ouvre toujours la fiche',await ev(()=>/Intercessors/i.test(document.body.innerText)&&!!document.querySelector('.card .cap')),1);
await b.close()})();
