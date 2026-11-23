const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
await p.evaluate(async()=>{try{await BIB.init()}catch(e){}window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove())});
const tabs=process.argv[3].split(',');
for(const t of tabs){const r=await p.evaluate(t=>{try{tab=t;draw()}catch(e){return 'ERR '+e.message}const m=document.getElementById('m');return [...m.querySelectorAll('button,summary,h1,h2,h3,h4,label,a,select,input')].map(e=>(e.tagName[0]+':'+(e.innerText||e.placeholder||e.value||'').trim().replace(/\s+/g,' ').slice(0,50))).filter(x=>x.length>3).slice(0,60).join(' | ')},t);console.log('##',t,'\n',r)}
await b.close()})();
