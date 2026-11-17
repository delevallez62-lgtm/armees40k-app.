const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ev=(f,a)=>p.evaluate(f,a);
await ev(()=>{window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='home';draw()});await p.waitForTimeout(300);
const r=await ev(()=>{const m=document.getElementById('gmore');if(m)m.click();const s=document.getElementById('gsheet');return s?[...s.querySelectorAll('[data-tab]')].map(x=>x.dataset.tab+':'+x.innerText.trim().slice(0,20)):null});await p.waitForTimeout(400);
console.log(JSON.stringify(r));
const c=await ev(()=>{const x=document.querySelector('#gsheet [data-tab="lore"]');if(!x)return 'absent';x.click();return 'ok'});await p.waitForTimeout(500);
console.log(c,await ev(()=>!!document.querySelector('.lo-g')&&document.querySelector('.lo-ttl h1').innerText));
await b.close()})();
