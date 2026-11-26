const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:900}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await BIB.init();const o=BLDSP();return o.filter(x=>/Celestian Insidiants|Allarus/.test(x.unit)).map(x=>[x.unit,x.miss.map(m=>m.n)])});
console.log((r.length===0?'✅ ':'❌ ')+'équipements fournis (Vexilla, Oratoire, Simulacrum) ne sont plus sans profil',JSON.stringify(r));await b.close()})();
