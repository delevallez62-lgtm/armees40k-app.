const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:900}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await BIB.init();return BLDAUDIT2()});
console.log((r.bad.length?'❌ ':'✅ ')+'chaque arme choisie retrouvée (unités '+r.units+', contrôles '+r.checks+')',JSON.stringify(r.bad.slice(0,10)));
await b.close()})();
