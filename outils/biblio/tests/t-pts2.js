const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='bib';draw()});await p.waitForTimeout(400);
await ev(()=>{const i=document.getElementById('bibq');i.value='Aggressor Squad';i.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(600);
const card=await ev(()=>document.getElementById('bibl').innerText.slice(0,200));ok('carte : points selon les figurines',/3 fig\. : 90 pts/.test(card)&&/6 fig\. : 180 pts/.test(card),card);
await ev(()=>document.querySelector('[data-bib="unit"]').click());await p.waitForTimeout(500);
const f=await ev(()=>document.getElementById('bibm').innerText);ok('fiche : tableau « Points selon le nombre de figurines »',/Points selon le nombre de figurines/.test(f)&&/3 figurines\s+90 pts/.test(f)&&/6 figurines\s+180 pts/.test(f),f.slice(0,400));
// unité à paliers par exemplaire
await ev(()=>{document.querySelector('#bibm [data-bib="x"]').click();const i=document.getElementById('bibq');i.value='Bladeguard Veteran';i.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(600);
await ev(()=>document.querySelector('[data-bib="unit"]').click());await p.waitForTimeout(500);
const g=await ev(()=>document.getElementById('bibm').innerText);ok('paliers par exemplaire affichés (1re à 2e / 3e et suivantes)',/1re à 2e unité/.test(g)&&/3e unité et suivantes/.test(g)&&/110 pts/.test(g),g.slice(0,500));
await b.close()})();
