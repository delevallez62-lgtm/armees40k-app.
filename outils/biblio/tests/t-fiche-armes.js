const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:900}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
await p.evaluate(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='imp';draw()});await p.waitForTimeout(500);
await p.evaluate(t=>{document.getElementById('raw').value=t},fs.readFileSync(__dirname+'/fixtures-aln-assault.txt','utf8'));
await p.evaluate(()=>{document.querySelector('[data-act="imp"]').click()});await p.waitForTimeout(1500);
console.log('dialogue :',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.ov,.bib-ov')].map(e=>e.innerText.replace(/\n+/g,' | ').slice(0,300)))));
for(let k=0;k<3;k++){await p.evaluate(()=>{const b=[...document.querySelectorAll('.ov button,.bib-ov button')].find(x=>/Importer|Valider|Continuer|Fusionner|Oui|Ajouter/i.test(x.innerText));b&&b.click()});await p.waitForTimeout(1000)}

await p.evaluate(()=>{const L=S.lists[S.lists.length-1];const T=BIBAST.test;const lib=T.byName('Assault Intercessor Squad');const u=L.units[0];const m=S.coll[u.ref];
 BIB.LB().links[u.ref]={id:lib.id,h:lib.h,v:(BIB.D.man||{}).version||'',at:Date.now(),prof:0,applied:[],stale:false};m.eqx=Object.assign({id:lib.id,n:lib.n},lib.wp||{});u.size=5;try{save()}catch(e){}
 S.cur=L.id;tab='units';draw()});await p.waitForTimeout(600);
await p.evaluate(()=>{const c=document.querySelector('.card.hv');if(c)c.click()});await p.waitForTimeout(600);
console.log('bouton équipement :',await p.evaluate(()=>!!document.querySelector('[data-eqf]')));
await p.evaluate(()=>{const b=document.querySelector('[data-eqf]');if(b)b.click()});await p.waitForTimeout(800);
console.log('écran :',await p.evaluate(()=>({scr:BLDSTATE.scr,liste:document.querySelectorAll('.bld-fg').length})));

const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(()=>{document.querySelector('.bld-fg[data-i="0"]').click()});await p.waitForTimeout(500);
await p.evaluate(()=>{const D=[...document.querySelectorAll('details.bld-dr')];D[0].open=true;const x=[...D[0].querySelectorAll('.bld-fc[data-bld="figo"]')].find(x=>/plasma/i.test(x.innerText));if(!x.classList.contains('on'))x.click()});await p.waitForTimeout(300);
await p.evaluate(()=>{const D=[...document.querySelectorAll('details.bld-dr')];D[1].open=true;const x=[...D[1].querySelectorAll('.bld-fc[data-bld="figo"]')].find(x=>/Tonnerre/i.test(x.innerText));if(!x.classList.contains('on'))x.click()});await p.waitForTimeout(300);
await p.evaluate(()=>{document.querySelector('[data-bld="figback"].b.p').click()});await p.waitForTimeout(300);
await p.evaluate(()=>{document.querySelector('[data-bld="ok"]').click()});await p.waitForTimeout(800);
const st=await p.evaluate(()=>{const L=S.lists[S.lists.length-1];const u=L.units[0];return{weapons:(u.weapons||[]).map(w=>w.name),equip:u.equip}});
const has=re=>st.weapons.some(n=>re.test(n));
ok('après enregistrement, l\'unité de la liste garde l\'épée tronçonneuse',has(/tron[cç]onneuse/i),st);
ok('… le marteau tonnerre du Sergent',has(/marteau/i),st);
ok('… le pistolet à plasma (Standard et Surcharge)',has(/plasma.*standard/i)&&has(/plasma.*surcharge/i),st);
ok('… le pistolet bolter lourd',has(/bolter.*lourd/i),st);
await p.evaluate(()=>{const L=S.lists[S.lists.length-1];S.cur=L.id;tab='units';draw()});await p.waitForTimeout(400);
await p.evaluate(()=>{const c=document.querySelector('.card.hv');if(c)c.click()});await p.waitForTimeout(600);
const rows=await p.evaluate(()=>[...document.querySelectorAll('.pn td.wzn,.ov td.wzn')].map(x=>x.textContent.trim()));
ok('la fiche d\'unité affiche toutes les armes (distance ET corps à corps)',rows.some(x=>/tron[cç]onneuse/i.test(x))&&rows.some(x=>/marteau/i.test(x))&&rows.some(x=>/plasma/i.test(x))&&rows.some(x=>/bolter/i.test(x)),rows);
await b.close()})();
