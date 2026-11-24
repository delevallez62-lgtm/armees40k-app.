const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{if(!/figo|figall|figpm|figback|data-bld="fig"/.test(s)){const fb=document.querySelector('[data-bld="figback"]');if(fb)fb.click()}let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Sim';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
async function open(q,match,size){await click('[data-bld="add"]');await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},q);await wait(250);
 await ev(m=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>new RegExp(m,'i').test(x.querySelector('b').innerText));c.click()},match);await wait(300);await click('[data-bld="size"][data-v="'+size+'"]');await wait(150)}
const fig=async i=>{await ev(()=>{BLDSTATE.figOpen=true});await ev(()=>{const b=document.querySelector('[data-bld="figback"]');if(b)b.click()});await click('[data-bld="fig"][data-i="'+i+'"]')};
const chips=()=>ev(()=>[...document.querySelectorAll('#bldm .bld-fcw')].map(w=>({t:w.querySelector('.bld-fc').innerText.trim(),on:w.querySelector('.bld-fc').classList.contains('on'),off:w.querySelector('.bld-fc').disabled,why:(w.querySelector('.bld-why')||{}).innerText||''})));
const pick=async re=>{await ev(re=>{const e=[...document.querySelectorAll('#bldm .bld-fc')].find(x=>new RegExp(re,'i').test(x.innerText)&&!x.disabled&&!x.classList.contains('bld-fb'));if(!e)throw new Error('option absente '+re);e.click()},re);await wait(250)};
const pop=()=>ev(()=>{const p=document.getElementById('lckpop');return p?p.innerText.replace(/\n+/g,' | '):null});
// ---- Escouade de Terminators, 5 figurines
await open('terminator','^Escouade de Terminators$',5);
await fig(1);await pick('tronçon|chainfist');await click('[data-bld="figback"]');
await fig(2);await pick('canon d.assaut|assault cannon');await click('[data-bld="figback"]');
await ev(()=>document.querySelector('[data-bld="ok"]').click());await wait(600);
const wl=()=>ev(()=>{const t=[...document.querySelectorAll('#m .wzn,#md .wzn,.wz td.wzn')].map(x=>x.innerText.trim());return t.join(' | ')});
// ouvrir la fiche de l'unité de la liste
await ev(()=>{tab='units';S.cur=S.lists[S.lists.length-1].id;draw()});await wait(500);
console.log('units cards:',await ev(()=>document.querySelectorAll('#m .card.hv').length));
await ev(()=>{const c=document.querySelector('#m .card.hv');c.click()});await wait(500);
console.log('fiche 1 armes:',await wl());
console.log('u.weapons:',await ev(()=>JSON.stringify(S.lists[S.lists.length-1].units[0].weapons.map(w=>w.name))));
console.log('cfg.wq:',await ev(()=>JSON.stringify(S.lists[S.lists.length-1].units[0].cfg.wq)));
console.log('cfg.eq:',await ev(()=>JSON.stringify(S.lists[S.lists.length-1].units[0].cfg.eq)));

// retour au menu armée : ⚙ Équipement, changer, enregistrer, rouvrir la fiche
await ev(()=>{tab='units';draw()});await wait(400);
await ev(()=>{document.querySelector('[data-eqc]').click()});await wait(900);
console.log('configurateur ouvert:',await ev(()=>!!document.querySelector('#bldm .bld-fg')));
await fig(2);await pick('canon d.assaut|assault cannon');await pick('lance-flammes lourd|heavy flamer');
await click('[data-bld="figback"]');
await ev(()=>{const b=[...document.querySelectorAll('#bldm button')].find(x=>/Enregistrer|Ajouter à l.armée/.test(x.innerText));b.click()});await wait(700);
console.log('u.weapons après:',await ev(()=>JSON.stringify(S.lists[S.lists.length-1].units[0].weapons.map(w=>w.name))));
await ev(()=>{tab='units';draw()});await wait(400);
await ev(()=>{const c=document.querySelector('#m .card.hv');c.click()});await wait(500);
console.log('fiche 2 armes:',await wl());
await b.close()})();
