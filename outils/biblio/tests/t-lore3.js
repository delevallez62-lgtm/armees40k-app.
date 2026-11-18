const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());let p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
const boot=async()=>{await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);await p.evaluate(()=>{window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove())})};
const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async(sel,i)=>{await ev(([s,i])=>{const e=document.querySelectorAll(s)[i||0];if(!e)throw new Error('absent '+s);e.click()},[sel,i]);await wait(250)};
const fill=async(vals)=>{await ev(v=>{document.querySelectorAll('#lormd [data-lf]').forEach(i=>{if(i.type!=='file'&&v[i.dataset.lf]!=null){i.value=v[i.dataset.lf]}})},vals)};
await boot();
await ev(()=>{tab='home';draw()});await click('[data-tab="lore"]');
let t=await ev(()=>({h:document.querySelector('.lo-ttl h1').innerText,c:[...document.querySelectorAll('.lo-c b')].map(x=>x.innerText)}));
ok('LORE vierge : 4 rubriques',t.c.length===4&&t.h==='LORE',t);
ok('aucun contenu prérempli (stockage vide)',await ev(()=>JSON.stringify(S.lore.hist.drawers)==='[]'&&S.lore.pers.length+S.lore.orga.length+S.lore.coul.length===0),1);
ok('aucune trace du lore d\'un autre joueur',!(await ev(()=>/Heshzeke|Braise|Sauveurs|Dragons du Dernier|Remparts/.test(document.body.innerText+JSON.stringify(S.lore)))),1);
// Histoire
await click('[data-lo="go"][data-c="hist"]');
ok('Histoire vide en consultation : invitation à modifier',/Modifier/.test(await ev(()=>document.body.innerText)),1);
await click('[data-lo="mode"]');
await click('[data-lo="dadd"]');await fill({t:'Origines'});await click('[data-lm="ok"]');
await click('[data-lo="dadd"]');await fill({t:'Guerres'});await click('[data-lm="ok"]');
ok('2 tiroirs créés, fermés par défaut',await ev(()=>document.querySelectorAll('details.lo-dr').length===2&&[...document.querySelectorAll('details.lo-dr')].every(d=>!d.open)),1);
await ev(()=>{document.querySelector('details.lo-dr').open=true});await click('[data-lo="cadd"]');await fill({t:'Chapitre 1'});await click('[data-lm="ok"]');
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true});
await click('[data-lo="badd"][data-k="p"]');await fill({x:'Premier paragraphe\nsur deux lignes'});await click('[data-lm="ok"]');
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true});
await click('[data-lo="badd"][data-k="h"]');await fill({x:'Un titre'});await click('[data-lm="ok"]');
// image : upload
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true});await click('[data-lo="badd"][data-k="i"]');
await p.setInputFiles('#lormd input[type=file]','red.png');await wait(700);await fill({cap:'Ma légende'});await click('[data-lm="ok"]');await wait(300);
const st1=await ev(()=>{const c=S.lore.hist.drawers[0].ch[0];return {n:c.bl.length,k:c.bl.map(b=>b.k).join(''),img:c.bl[2]&&c.bl[2].id}});
ok('chapitre : paragraphe, titre, image insérés',st1.n===3&&st1.k==='phi'&&st1.img,st1);
// réordonner : monter l'image
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true});await click('[data-lo="bup"]',2);
ok('réorganiser : image remontée',await ev(()=>S.lore.hist.drawers[0].ch[0].bl.map(b=>b.k).join('')==='pih'),1);
// consultation
await click('[data-lo="mode"]');
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true});await wait(200);
const cons=await ev(()=>({img:!!document.querySelector('.lo-im img'),cap:/Ma légende/.test(document.body.innerText),ctl:!!document.querySelector('[data-lo="bup"]')}));
ok('consultation : image, légende, pas de boutons d\'édition',cons.img&&cons.cap&&!cons.ctl,cons);
// dupliquer / supprimer tiroir
await click('[data-lo="mode"]');await click('[data-lo="ddup"]');
ok('tiroir dupliqué',await ev(()=>S.lore.hist.drawers.length===3&&/copie/.test(S.lore.hist.drawers[1].t)),1);
await click('[data-lo="ddel"]',1);await wait(300);await ev(()=>{const o=document.querySelector('#ask,.ask,[data-ask="ok"]');const b=[...document.querySelectorAll('button')].find(x=>/^Supprimer$/.test(x.innerText.trim()));b&&b.click()});await wait(400);
ok('tiroir supprimé (après confirmation)',await ev(()=>S.lore.hist.drawers.length===2),await ev(()=>S.lore.hist.drawers.length));
// personnage
await click('[data-lo="back"]');await click('[data-lo="go"][data-c="pers"]');
await click('[data-lo="iadd"]');await fill({n:'Capitaine Test',ti:'Maître de chapitre',short:'Courte',bio:'Longue biographie'});await p.setInputFiles('#lormd input[type=file]','blue.png');await wait(600);await fill({n:'Capitaine Test',ti:'Maître de chapitre',short:'Courte',bio:'Longue biographie'});await click('[data-lm="ok"]');await wait(300);
ok('personnage créé avec image',await ev(()=>S.lore.pers.length===1&&S.lore.pers[0].img&&S.lore.pers[0].f.bio==='Longue biographie'),await ev(()=>JSON.stringify(S.lore.pers)));
await click('[data-lo="open"]');
await click('[data-lo="exadd"]');await fill({l:'Devise',v:'Pour le test'});await click('[data-lm="ok"]');
ok('information complémentaire ajoutée',await ev(()=>/Devise/.test(document.body.innerText)),1);
await p.setInputFiles('[data-lo-file]','red.png');await wait(700);
ok('image supplémentaire ajoutée',await ev(()=>S.lore.pers[0].imgs.length===1),1);
// organisation, couleurs
await click('[data-lo="back"]');await click('[data-lo="back"]');await click('[data-lo="go"][data-c="coul"]');
await click('[data-lo="iadd"]');await fill({n:'Livrée principale'});await click('[data-lm="ok"]');await click('[data-lo="open"]');
await click('[data-lo="swadd"]');await fill({n:'Vert',c:'#2e7d4f'});await click('[data-lm="ok"]');
ok('couleur ajoutée (nuancier)',await ev(()=>S.lore.coul[0].sw.length===1&&document.querySelector('.lo-sw i')!==null),1);
// persistance : recharger
const snap=await ev(()=>JSON.stringify(S.lore));await wait(500);
await p.close();p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await boot();
const after=await ev(()=>JSON.stringify(S.lore));
ok('persistance : textes conservés après réouverture',after===snap,after.length);
const imgs=await ev(()=>new Promise(r=>setTimeout(()=>r(Object.keys(BIBLORE.LI).length),800)));
ok('persistance : images conservées après réouverture (base locale)',imgs>=3,imgs);
await ev(()=>{tab='lore';LORE_NOP=0;draw()});
await b.close()})();
