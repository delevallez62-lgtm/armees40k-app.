const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Sim';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
async function addUnit(q,match,size,wants){
 await click('[data-bld="add"]');await wait(150);
 await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},q);await wait(250);
 const found=await ev(m=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>new RegExp(m,'i').test(x.querySelector('b').innerText));if(c){c.click();return c.querySelector('b').innerText}return null},match);await wait(300);
 if(!found)return{found};
 await click('[data-bld="size"][data-v="'+size+'"]');await wait(120);
 const keys=await ev(()=>[...document.querySelectorAll('#bldm [data-bld="wq"][data-d="1"]')].map(e=>e.dataset.k));
 const done={};
 for(const [re,n] of wants){const k=keys.find(k=>new RegExp(re,'i').test(k));if(!k){done[re]='introuvable';continue}
  for(let i=0;i<n;i++)await ev(k=>{const e=[...document.querySelectorAll('#bldm [data-bld="wq"][data-d="1"]')].find(x=>x.dataset.k===k);if(e)e.click()},k);done[re]=k+' ×'+n}
 await click('[data-bld="ok"]');await wait(250);return{found,keys,done}}
const res={};
res.vj=await addUnit('jump','Vanguard Veteran Squad with Jump|Avant-garde.*r.acteur|r.acteurs dorsaux',5,[['plasma',3],['marteau|hammer',1]]);
res.ts=await addUnit('terminator','^Escouade de Terminators$|Terminator Squad|^Terminators$',10,[['canon d.assaut|assault cannon',1],['lance-flammes lourd|heavy flamer',1],['tron.onneuse|chainfist',2]]);
console.log(JSON.stringify(res,null,1).slice(0,2500));
const r1=await ev(()=>{const L=S.lists[0];const r=BIBLCK.run(L);return {units:L.units.map(u=>({n:u.name,sz:u.cfg&&u.cfg.size,wq:u.cfg&&u.cfg.wq})),eq:r.sec.find(s=>s.id==='eq').items.map(i=>i.lv+' '+(i.t||i.nodet))}});
console.log(JSON.stringify(r1,null,1));
ok('configuration légale via le constructeur : aucune erreur ni avertissement d\'équipement',r1.eq.every(x=>!/^(bad|warn) /.test(x)),r1.eq);
// rendre illégal : 4 plasmas (max 3) sur les vétérans
await ev(()=>{const u=S.lists[0].units[0];const k=Object.keys(u.cfg.wq).find(k=>/plasma/i.test(k));u.cfg.wq[k]=4});
const r2=await ev(()=>BIBLCK.run(S.lists[0]).sec.find(s=>s.id==='eq').items.map(i=>i.lv+' '+(i.t||i.nodet)));
ok('4 pistolets plasma (max 3) → erreur détectée',r2.some(x=>/^bad /.test(x)),r2);
await b.close()})();
