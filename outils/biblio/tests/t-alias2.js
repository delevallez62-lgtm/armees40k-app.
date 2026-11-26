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
await p.evaluate(()=>{const b=document.querySelector('.bld-fg[data-i="0"]');if(b)b.click()});await p.waitForTimeout(600);
const r=await p.evaluate(()=>{document.querySelectorAll('details.bld-dr').forEach(d=>d.open=true);return{porte:[...document.querySelectorAll('.bld-fw')].map(x=>x.innerText.replace(/\n+/g,' ')),choix:[...document.querySelectorAll('details.bld-dr .bld-fc')].map(b=>b.innerText.replace(/\n+/g,' '))}});
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
ok('liste ALN importée puis reliée : chaque arme portée affiche ses statistiques',r.porte.length>0&&r.porte.every(x=>/PORTÉE/.test(x))&&!r.porte.some(x=>/Profil non disponible/.test(x)),r.porte);
ok('tous les choix et l\'arme de base (épée tronçonneuse) ont leurs statistiques',r.choix.length>=6&&r.choix.every(x=>/PORTÉE/.test(x)),r.choix);
ok('l\'épée tronçonneuse est proposée avec ses statistiques (retour à l\'arme de base)',r.choix.some(x=>/Epée tronçonneuse.*PORTÉE/.test(x)),r.choix);
await b.close()})();
