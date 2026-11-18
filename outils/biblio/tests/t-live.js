const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();await ctx.route(/^https?:\/\/(?!localhost|raw\.githubusercontent\.com)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));p.on('requestfailed',r=>console.log('FAIL',r.url().slice(0,100),r.failure()&&r.failure().errorText));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3000);
const r=await p.evaluate(async()=>{await BIB.init();const before=BIB.D.man.version;
 // simuler une copie ancienne : retirer une traduction + version précédente
 BIB.D.man.version='ancienne-version';const lb=BIB.LB();lb.last=null;
 let res;try{res=await BIB.checkUpdate(true)}catch(e){res={err:String(e&&e.message||e)}}
 return{before,res:JSON.stringify(res).slice(0,400),after:BIB.D.man.version,src:lb.src}});
console.log(JSON.stringify(r));await b.close()})();
