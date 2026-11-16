const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>{const W=(n,r)=>({name:n,range:r||"12",a:"1",hit:"3+",f:"4",pa:"0",d:"1"});
const m={weapons:[W("Fling'"),W("Kombi-karbo - Fling'"),W("Kombi-karbo - Karbonizeur"),W("Pince de Gork","Mêlée"),W("Autre")]};
const u={equip:"Fling' (9), Pince de Gork, Kombi-karbo",weapons:[W("Fling'")],mdl:[{n:"Boss",eq:"Kombi-karbo"}]};
const n=fixEq(u,m);return{n,w:u.weapons.map(x=>x.name),errs:0}})),errs);await b.close()})();
