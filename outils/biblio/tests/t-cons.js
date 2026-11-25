const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:900},isMobile:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov,.ov').forEach(e=>e.remove());S.lists=[];const L=BIBAST.test.mkList('space-marines',2000,'Mes Ultramarines');BIBAST.test.fillList(L,4);while(L.units.length>3&&BIBAST.test.calc(L).total>1700)L.units.pop();BIBAST.test.applyPts(L);S.cur=L.id;S.ana={sec:'cons',ast:{list:L.id}};tab='ana';draw()});await p.waitForTimeout(3000);
const orig=await p.evaluate(()=>JSON.stringify(S.lists[0]));
ok('onglet Conseils affiché',await p.evaluate(()=>!!document.querySelector('.aw .aw-c')),await p.evaluate(()=>(document.querySelector('.ast')||{}).innerText));
const n0=await p.evaluate(()=>({cards:document.querySelectorAll('.aw .aw-c').length,units:document.querySelectorAll('.aw .aw-u').length,verd:[...document.querySelectorAll('.aw .aw-u .vd')].map(x=>x.innerText).join('|').slice(0,200)}));console.log(JSON.stringify(n0));
// cocher 2 conseils et appliquer
await p.evaluate(()=>{const c=[...document.querySelectorAll('[data-aw="sel"]:not([disabled])')];c.slice(0,2).forEach(x=>{x.click()})});await p.waitForTimeout(1200);
const nsel=await p.evaluate(()=>document.querySelectorAll('.aw-bulk').length);console.log('barre de sélection :',nsel);
await p.evaluate(()=>document.querySelector('[data-aw="applysel"]')&&document.querySelector('[data-aw="applysel"]').click());await p.waitForTimeout(2500);
await p.evaluate(()=>{const o=document.getElementById('lckpop');if(o){const b=o.querySelector('button');b&&b.click()}});
const st1=await p.evaluate(()=>{const d=BIBAST.workspace.get();return{chg:d&&d.chg.map(c=>c.t+' '+c.cost),tags:[...document.querySelectorAll('.aw-u')].filter(x=>/NOUVEAU|MODIFIÉ/.test(x.innerText)).length,total:document.querySelector('.aw-sum b.big')&&document.querySelector('.aw-sum b.big').innerText}});console.log(JSON.stringify(st1));
ok('les modifications apparaissent en direct',st1.chg&&st1.chg.length>=1&&st1.tags>=1,st1);
ok('liste d\'origine intacte',await p.evaluate(o=>JSON.stringify(S.lists[0])===o,orig),1);
await p.screenshot({path:'cons-live.png',fullPage:true});
// annuler la dernière
await p.evaluate(()=>document.querySelector('[data-aw="undo"]').click());await p.waitForTimeout(2000);
console.log('après annulation :',await p.evaluate(()=>BIBAST.workspace.get().chg.length));
// alternatives manuelles
await p.evaluate(()=>document.querySelector('[data-aw="alt"]').click());await p.waitForTimeout(2500);
ok('alternatives proposées pour une unité',await p.evaluate(()=>document.querySelectorAll('.aw .aw-c').length>0&&/Par quoi remplacer/.test(document.querySelector('.aw').innerText)),1);
// enregistrer variante
await p.evaluate(()=>{const b=document.querySelector('[data-aw="altx"]');b&&b.click()});await p.waitForTimeout(500);
// revenir à la liste initiale
await p.evaluate(()=>document.querySelector('[data-aw="reset"]').click());await p.waitForTimeout(500);
await p.evaluate(()=>{const o=document.getElementById('lckpop');if(o){const y=[...o.querySelectorAll('button')].find(x=>/Revenir/.test(x.innerText));y&&y.click()}});await p.waitForTimeout(1500);
ok('retour à la liste initiale (atelier vidé)',await p.evaluate(()=>!BIBAST.workspace.get()&&!document.querySelector('.aw-u.new')),1);
ok('liste d\'origine toujours intacte',await p.evaluate(o=>JSON.stringify(S.lists[0])===o,orig),1);
await b.close()})();
