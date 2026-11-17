const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;tab='bib';draw()});await wait(300);
const search=async t=>{await ev(t=>{const i=document.getElementById('bibq');i.value=t;i.dispatchEvent(new Event('input',{bubbles:true}))},t);await wait(600)};
await search('Guerriers Nécrons');
const c0=await ev(()=>Object.keys(S.coll).length);
ok('bouton « Ajouter à ma collection » sur la carte',await ev(()=>!!document.querySelector('[data-bib="mk"]')),1);
await ev(()=>{const u=BIB.D.units.find(x=>x.n==='Necron Warriors');document.querySelector('[data-bib="mk"][data-id="'+u.id+'"]').click()});await wait(700);
const r=await ev(()=>{const u=BIB.D.units.find(x=>x.n==='Necron Warriors');const m=Object.values(S.coll).find(m=>S.lib.links[m.ref]&&S.lib.links[m.ref].id===u.id);return m&&{name:m.name,w:(m.weapons||[]).length,stats:m.stats,link:!!S.lib.links[m.ref],apt:(m.apt||'').length+(m.text||[]).length}});
ok('fiche créée avec nom français, profil, armes, capacités et lien',r&&r.name==='Guerriers Nécrons'&&r.w>0&&r.stats&&r.stats.E&&r.link,r);
ok('collection : +1 fiche',await ev(()=>Object.keys(S.coll).length)===c0+1,1);
ok('carte : « dans ta collection » (pas de doublon)',await ev(()=>/dans ta collection/.test(document.body.innerText)),1);
// sélection multiple
await search('Intercessor');
for(let i=0;i<2;i++){await ev(i=>{document.querySelectorAll('[data-bib="selt"]')[i].click()},i);await wait(300)}
const bar=await ev(()=>/2 sélectionnée/.test(document.body.innerText));ok('sélection multiple : barre « 2 sélectionnées »',bar,1);
const n0=await ev(()=>Object.keys(S.coll).length);await ev(()=>document.querySelector('[data-bib="mkall"]').click());await wait(700);
ok('ajout multiple',await ev(()=>Object.keys(S.coll).length)===n0+2,1);
// fiche : bouton générer
await search('Painboy');await ev(()=>document.querySelector('[data-bib="unit"]').click());await wait(500);
ok('fiche de bibliothèque : bouton « Générer la fiche »',await ev(()=>/Générer la fiche et l.ajouter|déjà dans ta collection/.test(document.getElementById('bibm').innerText)),1);
await b.close()})();
