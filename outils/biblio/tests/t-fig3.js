const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Sim';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
async function open(q,match,size){await click('[data-bld="add"]');await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},q);await wait(250);
 await ev(m=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>new RegExp(m,'i').test(x.querySelector('b').innerText));c.click()},match);await wait(300);await click('[data-bld="size"][data-v="'+size+'"]');await wait(150)}
const fig=async i=>{await click('[data-bld="fig"][data-i="'+i+'"]')};
const chips=()=>ev(()=>[...document.querySelectorAll('#bldm .bld-fcw')].map(w=>({t:w.querySelector('.bld-fc').innerText.trim(),on:w.querySelector('.bld-fc').classList.contains('on'),off:w.querySelector('.bld-fc').disabled,why:(w.querySelector('.bld-why')||{}).innerText||''})));
const pick=async re=>{await ev(re=>{const e=[...document.querySelectorAll('#bldm .bld-fc')].find(x=>new RegExp(re,'i').test(x.innerText)&&!x.disabled);if(!e)throw new Error('option absente '+re);e.click()},re);await wait(250)};
const pop=()=>ev(()=>{const p=document.getElementById('lckpop');return p?p.innerText.replace(/\n+/g,' | '):null});
// ---- Intercessors : 1 lance-grenades pour 5 figurines
await open('intercessor','^Escouade d.Intercessors$',5);
await fig(1);
let ch=await chips();console.log('Intercessor 1 :',JSON.stringify(ch.map(x=>x.t)));
await pick('grenade');
ok('5 fig. : 1er lance-grenades accepté',await ev(()=>Object.keys(BLDSTATE.cfg.wq).some(k=>/grenade/i.test(k))),1);
await fig(2);const g2=(await chips()).filter(x=>/grenade/i.test(x.t));
ok('5 fig. : lance-grenades indisponible pour une 2e figurine',g2.length===1&&g2[0].off&&/Maximum 1/.test(g2[0].why),g2);
await click('[data-bld="size"][data-v="10"]');await wait(200);
await fig(2);const g3=(await chips()).filter(x=>/grenade/i.test(x.t));
ok('10 fig. : 2e lance-grenades disponible',g3.length===1&&!g3[0].off,g3);
await pick('grenade');await fig(3);const g4=(await chips()).filter(x=>/grenade/i.test(x.t));
ok('10 fig. : 3e lance-grenades indisponible',g4.length===1&&g4[0].off,g4);
// le sergent ne reçoit pas le lance-grenades (réservé aux Intercessors)
await fig(0);const sg=(await chips()).filter(x=>/grenade/i.test(x.t));
ok('le sergent n\'a pas accès au lance-grenades (réservé aux autres figurines)',sg.length===0,sg);
await click('[data-bld="ok"]');await wait(300);
ok('Intercessors ajoutés',await ev(()=>S.lists[0].units.length===1),1);
// ---- Capitaine en armure Terminator : arme combinée remplace le bolter d'assaut
await open('terminator','^Capitaine en armure Terminator$',1);
await fig(0);const cp=await chips();console.log('Capitaine :',JSON.stringify(cp.map(x=>x.t)));
await pick('combi');
ok('arme combinée : tous les profils comptés dans l\'équipement',await ev(()=>Object.keys(BLDSTATE.cfg.wq).filter(k=>/combi/i.test(k)).length===3),await ev(()=>Object.keys(BLDSTATE.cfg.wq)));
ok('arme combinée : le bolter d\'assaut est remplacé',await ev(()=>!Object.keys(BLDSTATE.cfg.wq).some(k=>/bolter d.assaut|storm bolter/i.test(k))),await ev(()=>Object.keys(BLDSTATE.cfg.wq)));
ok('récapitulatif : une seule ligne « arme combinée »',await ev(()=>BLDSTATE.cfg.figEq.filter(x=>/combi/i.test(x)).length===1),await ev(()=>BLDSTATE.cfg.figEq));
await b.close()})();
