const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await BIB.init();const D=BIB.D;let tot=0,unb=0,askc=0;const ex=[];
 for(const lu of D.units){if(!(lu.wp&&lu.wp.opt&&lu.wp.opt.length))continue;const ws=[...new Set([...(lu.rw||[]),...(lu.mw||[])].map(w=>String(w.n).replace(/^➤\s*/,'').replace(/\(.*?\)/g,'').split(/\s+[-–]\s+/)[0].trim()))];
  for(const w of ws){tot++;const e={lib:lu,name:lu.n};const asked=BIBLCK.unverif(e,[w]).length>0;if(asked)askc++;}}
 return{tot,askc}});
console.log(JSON.stringify(r));await b.close()})();
