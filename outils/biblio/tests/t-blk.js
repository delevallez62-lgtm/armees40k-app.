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
// Escouade de Terminators (5 figurines) : 1 arme spéciale max
await open('terminator','^Escouade de Terminators$',5);
const keys=await ev(()=>[...document.querySelectorAll('#bldm [data-bld="wq"][data-d="1"]')].map(e=>e.dataset.k));console.log(keys.join(' / '));
await plus('canon d.assaut|assault cannon');
ok('1er canon d\'assaut accepté',!(await pop())&&await ev(()=>Object.keys(BLDSTATE.cfg.wq).some(k=>/canon d.assaut|assault cannon/i.test(k))),await pop());
await plus('lance-flammes lourd|heavy flamer');
const m1=await pop();
ok('2e arme spéciale (1 pour 5 figurines) : bloquée avec explication',/impossible/i.test(m1||'')&&/pas|n'en autorisent/i.test(m1||''),m1);
ok('la 2e arme n\'est pas ajoutée',await ev(()=>!Object.keys(BLDSTATE.cfg.wq).some(k=>/lance-flammes lourd|heavy flamer/i.test(k))),1);
await p.screenshot({path:'blk1.png'});
await ev(()=>document.querySelector('#lckpop [data-lckp="ok"]').click());await wait(200);
// passer à 10 figurines : la 2e arme devient possible
await click('[data-bld="size"][data-v="10"]');await wait(150);
await plus('lance-flammes lourd|heavy flamer');
ok('à 10 figurines : 2e arme acceptée',!(await pop())&&await ev(()=>Object.keys(BLDSTATE.cfg.wq).some(k=>/lance-flammes lourd|heavy flamer/i.test(k))),await pop());
// repasser à 5 figurines : configuration non conforme → popup à l'ajout
await click('[data-bld="size"][data-v="5"]');await wait(150);
await ev(()=>{const k=Object.keys(BLDSTATE.cfg.wq);});
await click('[data-bld="ok"]');
const m2=await pop();
ok('ajout d\'une unité non conforme : popup avec la raison et le choix',/pas conforme/i.test(m2||'')&&/Modifier/.test(m2||'')&&/Ajouter quand même/.test(m2||''),m2);
await p.screenshot({path:'blk2.png'});
ok('l\'unité n\'est pas encore ajoutée',await ev(()=>S.lists[0].units.length===0),1);
await ev(()=>document.querySelector('#lckpop [data-lckp="edit"]').click());await wait(250);
ok('« Modifier » : retour à la configuration, rien ajouté',await ev(()=>S.lists[0].units.length===0&&!!BLDSTATE.cfg),1);
await click('[data-bld="ok"]');await ev(()=>document.querySelector('#lckpop [data-lckp="add"]').click());await wait(350);
ok('« Ajouter quand même » : unité ajoutée',await ev(()=>S.lists[0].units.length===1),1);
// unité conforme : pas de popup
await open('intercessor','Intercessor',5);await click('[data-bld="ok"]');await wait(300);
ok('unité conforme : ajoutée sans popup',!(await pop())&&await ev(()=>S.lists[0].units.length===2),await pop());
await b.close()})();
