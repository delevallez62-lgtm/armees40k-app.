const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},isMobile:true,hasTouch:true,deviceScaleFactor:1});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(async()=>{try{await BIB.init()}catch(e){}window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove())});
ok('plus de bandeau permanent',await p.evaluate(()=>!document.querySelector('.hp')),1);
const tabs=['home','lists','coll','bib','paint','mis','ana','imp','enc','learn','lore','news','bld'];
for(const t of tabs){await p.evaluate(t=>{tab=t;draw()},t);await p.waitForTimeout(350);
 const r=await p.evaluate(()=>{const q=document.getElementById('hpq');return{q:!!q&&q.style.display!=='none'}});
 await p.evaluate(()=>document.getElementById('hpq').click());await p.waitForTimeout(150);
 const n=await p.evaluate(()=>{const o=document.getElementById('hpov');const t=o?o.querySelectorAll('.hp-o li').length:0;if(o)o.querySelector('[data-hpx]').click();return t});
 ok('tuto '+t+' : rond + '+n+' étapes',r.q&&n>=3,[r,n]);}
await p.evaluate(()=>{tab='lists';draw()});await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById('hpq').click());await p.waitForTimeout(200);await p.screenshot({path:'hp.png'});
await p.evaluate(()=>document.querySelector('[data-hpx]').click());await p.waitForTimeout(100);await p.screenshot({path:'hp0.png'});
await b.close()})();
