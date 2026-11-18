const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='news';draw()});await wait(500);
ok('menu discret « Traduction » en bas de Nouveautés',await ev(()=>!!document.getElementById('nwtr')&&/Traduction/.test(document.body.innerText)),1);
ok('fermé par défaut',await ev(()=>!document.getElementById('nwtr').open),1);
await ev(()=>{document.getElementById('nwtr').open=true});await wait(2500);
const t1=await ev(()=>({txt:document.getElementById('nwtrc').innerText.slice(0,160),dr:document.querySelectorAll('#nwtrc details.bib-nw').length,openCount:[...document.querySelectorAll('#nwtrc details.bib-nw')].filter(d=>d.open).length}));
ok('liste en tiroirs, tous fermés',t1.dr>0&&t1.openCount===0,t1);
// ouvrir une fiche d'unité
const info=await ev(()=>{const d=document.querySelector('#nwtrc details.bib-nw');d.open=true;return d.dataset.trk});await wait(500);
const t2=await ev(()=>{const d=document.querySelector('#nwtrc details.bib-nw');return{sg:!!d.querySelector('.sg .sx'),ta:d.querySelectorAll('textarea').length,txt:d.innerText.slice(0,200)}});
ok('tiroir ouvert : fiche d\'unité (caractéristiques + champs modifiables)',t2.sg&&t2.ta>=1,t2);
// modifier le nom + enregistrer
const before=await ev(()=>{const d=document.querySelector('#nwtrc details.bib-nw');const en=d.querySelector('textarea')?TRNEN():null;return 1}).catch(()=>1);
const r=await ev(()=>{const d=document.querySelector('#nwtrc details.bib-nw');const key=d.dataset.trk;const u=BIB.D.byId[key.split(':')[1]];const ta=d.querySelector('textarea');ta.value='Nom français de test';d.querySelector('[data-trn="save"]').click();return{n:u.n,id:u.id}});await wait(600);
ok('enregistrement : nom traduit partout',await ev(n=>BIB.tName(n).t==='Nom français de test'&&BIB.tName(n).st==='ok',r.n),r);
ok('ré-affichage : l\'élément traduit quitte la liste ou reste cohérent',await ev(()=>!!document.getElementById('nwtr').open),1);
// vérifier ailleurs : bibliothèque
await ev(()=>{tab='bib';draw()});await wait(300);
await ev(n=>{const i=document.getElementById('bibq');i.value=n;i.dispatchEvent(new Event('input',{bubbles:true}))},'Nom français de test');await wait(600);
ok('appliqué dans la bibliothèque',/Nom français de test/i.test(await ev(()=>document.getElementById('bibl').innerText)),1);
// stratagèmes
await ev(()=>{tab='news';draw()});await wait(400);await ev(()=>{document.getElementById('nwtr').open=true});await wait(2200);
await ev(()=>document.querySelector('[data-trn="kind"][data-v="str"]').click());await wait(400);
const s1=await ev(()=>{const d=document.querySelector('#nwtrc details.bib-nw');if(!d)return null;d.open=true;return d.dataset.trk});await wait(500);
const s2=await ev(()=>{const d=document.querySelector('#nwtrc details.bib-nw');return d?{ta:d.querySelectorAll('textarea').length,txt:d.innerText.slice(0,200)}:null});
ok('stratagème : affiché comme un stratagème (PC, phase, Quand/Cible/Effet)',s2&&/Phase/.test(s2.txt)&&/Quand|Cible|Effet/.test(s2.txt),s2);
await ev(()=>{document.querySelectorAll('[data-trn="kind"]')[0].click()});
await ev(()=>{const i=document.getElementById('trnq');i.value='zzzzqq';i.dispatchEvent(new Event('input',{bubbles:true}))});await wait(700);
ok('recherche',/Rien à traduire/.test(await ev(()=>document.getElementById('nwtrc').innerText)),1);
await ev(()=>document.querySelectorAll('.bib-ov,#encov').forEach(e=>e.remove()));
await b.close()})();
