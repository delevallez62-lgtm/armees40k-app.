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
const fig=async i=>{await ev(()=>{BLDSTATE.figOpen=true});await click('[data-bld="fig"][data-i="'+i+'"]')};
const chips=()=>ev(()=>[...document.querySelectorAll('#bldm .bld-fcw')].map(w=>({t:w.querySelector('.bld-fc').innerText.trim(),on:w.querySelector('.bld-fc').classList.contains('on'),off:w.querySelector('.bld-fc').disabled,why:(w.querySelector('.bld-why')||{}).innerText||''})));
await open('terminator','^Escouade de Terminators$',5);await ev(()=>{BLDSTATE.figOpen=true});await click('[data-bld="fig"][data-i="0"]');
const r=await ev(()=>({fiche:(document.querySelector('.bld-fiche')||{}).innerText,chip:(document.querySelector('.bld-fc')||{}).innerText}));console.log(JSON.stringify(r).slice(0,700));
await p.screenshot({path:'fiche.png'});await b.close()})();
