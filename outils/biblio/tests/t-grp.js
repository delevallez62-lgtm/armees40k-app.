const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Sim';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
async function open(q,match,size){await click('[data-bld="add"]');await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},q);await wait(250);
 console.log(await ev(()=>[...document.querySelectorAll('#bldm .bld-c b')].map(x=>x.innerText).slice(0,12).join(' | ')));await ev(m=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>new RegExp(m,'i').test(x.querySelector('b').innerText));c.click()},match);await wait(300);await click('[data-bld="size"][data-v="'+size+'"]');await wait(150)}
const plus=async re=>{await ev(re=>{const e=[...document.querySelectorAll('#bldm [data-bld="wq"][data-d="1"]')].find(x=>new RegExp(re,'i').test(x.dataset.k));if(!e)throw new Error('arme absente '+re);e.click()},re);await wait(250)};
const pop=()=>ev(()=>{const p=document.getElementById('lckpop');return p?p.innerText.replace(/\n/g,' | '):null});
// Capitaine en armure Terminator : « Arme combinée » = 3 profils, un seul compteur
await open('terminator','^Capitaine en armure Terminator$',1);
const rows=await ev(()=>[...document.querySelectorAll('#bldm .bld-w')].map(r=>r.querySelector('b').innerText));
console.log('lignes :',rows.join(' | '));
ok('une seule ligne « arme combinée » (profils regroupés)',rows.filter(x=>/combi/i.test(x)).length===1&&!rows.some(x=>/infernus|purgatus|damnatus/i.test(x)),rows);
await plus('combi');
ok('+ ajoute tous les profils de l\'arme',await ev(()=>Object.keys(BLDSTATE.cfg.wq).filter(k=>/combi/i.test(k)).length===3),await ev(()=>Object.keys(BLDSTATE.cfg.wq)));
await ev(()=>{const e=[...document.querySelectorAll('#bldm [data-bld="wq"][data-d="-1"]')].find(x=>/combi/i.test(x.dataset.k));e.click()});await wait(250);
ok('− retire tous les profils',await ev(()=>Object.keys(BLDSTATE.cfg.wq).filter(k=>/combi/i.test(k)).length===0),1);
await plus('combi');await click('[data-bld="ok"]');await wait(300);
ok('capitaine avec arme combinée : ajouté sans popup',!(await pop())&&await ev(()=>S.lists[0].units.length===1),await pop());
ok('récapitulatif : une seule ligne d\'arme',await ev(()=>{const u=S.lists[0].units[0];return (u.cfg.eq||[]).filter(x=>/combi/i.test(x)).length===1}),await ev(()=>S.lists[0].units[0].cfg.eq));
// Terminators : poing tronçonneur (2 profils)
await open('terminator','^Escouade de Terminators$',5);
const r2=await ev(()=>[...document.querySelectorAll('#bldm .bld-w')].map(r=>r.querySelector('b').innerText));
ok('une seule ligne « poing tronçonneur »',r2.filter(x=>/chainfist|tron/i.test(x)).length===1,r2);
await plus('chainfist|tron');await plus('chainfist|tron');
ok('2 poings tronçonneurs sur les deux profils',await ev(()=>Object.entries(BLDSTATE.cfg.wq).filter(([k])=>/chainfist/i.test(k)).every(([k,v])=>v===2)&&Object.keys(BLDSTATE.cfg.wq).filter(k=>/chainfist/i.test(k)).length===2),await ev(()=>BLDSTATE.cfg.wq));
ok('aucun blocage pour 2 poings tronçonneurs (« n\'importe quel nombre »)',!(await pop()),await pop());
await p.screenshot({path:'grp1.png'});
await b.close()})();
