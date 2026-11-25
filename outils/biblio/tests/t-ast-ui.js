const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:+process.argv[3]||390,height:900},isMobile:+process.argv[3]>600?false:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
await p.evaluate(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov,.ov').forEach(e=>e.remove());S.lists=[];const L=BIBAST.test.mkList('space-marines',2000,'Mes Ultramarines');BIBAST.test.fillList(L,4);while(L.units.length>3&&BIBAST.test.calc(L).total>1750)L.units.pop();BIBAST.test.applyPts(L);S.cur=L.id;S.ana={sec:'ast',ast:{list:L.id}};tab='ana';draw()});await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>document.querySelector('.ast')?document.querySelector('.ast').innerText.slice(0,500):'pas de .ast'));
await p.screenshot({path:'ast-top.png',fullPage:false});
// ouvrir un conseil
await p.evaluate(()=>{const r=document.querySelector('[data-ast="rec"]')||document.querySelector('[data-ast="goto"]');if(r)r.click()});await p.waitForTimeout(800);
await p.screenshot({path:'ast-full.png',fullPage:true});
await b.close()})();
