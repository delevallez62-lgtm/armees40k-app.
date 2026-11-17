const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
const g=async f=>{const p=await ctx.newPage();await p.goto('http://localhost:8765/'+f);await p.waitForTimeout(3500);const r=await p.evaluate(async()=>{await BIB.init();return [BIB.D.man.version,BIB.tName('Canoness').t,BIB.tName('Battle Sisters Squad').t]});await p.close();return r};
console.log('ancienne',JSON.stringify(await g('promote97.html')));
console.log('nouvelle',JSON.stringify(await g(process.argv[2])));
await b.close()})();
