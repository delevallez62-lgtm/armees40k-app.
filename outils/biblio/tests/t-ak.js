const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ev=(f,a)=>p.evaluate(f,a);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='paint';draw()});await p.waitForTimeout(300);
await ev(()=>{const t=[...document.querySelectorAll('button,[data-x]')].find(x=>/Mes peintures/i.test(x.innerText));t&&t.click()});await p.waitForTimeout(300);
await ev(()=>{document.getElementById('gxadd').open=true;document.querySelector('[data-pscan]').click()});await p.waitForTimeout(300);
for(const [c,n] of [['8435568304574','Purple'],['8435568302778','Yellow'],['8435568311060','']]){await ev(c=>BIBPSC.onCode(c),c);await p.waitForTimeout(200);console.log(c,await ev(()=>document.getElementById('pspot')?document.querySelector('#pspot .pkht').innerText.replace(/\n/g,' | '):'inconnu'));await ev(()=>{const x=document.querySelector('#pspot [data-pot="x"]');x&&x.click()})}
await b.close()})();
