const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
const r=await p.evaluate(async()=>{await BIB.init();const D=BIB.D;
 BIB.autoTr("Each time a model in this unit makes an attack, you can re-roll the hit roll.");await new Promise(r=>setTimeout(r,2500));
 const T=[
  "Each time a model in this unit makes an attack, you can re-roll the wound roll.",
  "Each time a model in this unit makes an attack, add 1 to the Hit roll.",
  "While this unit is within 6\" of one or more friendly units, each time an enemy unit makes an attack against this unit, subtract 1 from the Hit roll.",
  "Your opponent's units can never fly over the lasers of death."];
 const out=T.map(t=>[t,BIB.autoTr(t)]);
 // apprentissage : on valide une traduction contenant un mot nouveau
 BIB.learnPair("Frostbolt","Trait de givre");
 return{out,lexUser:JSON.stringify(BIB.LB().lex),size:Object.keys(D.lexB).length}});
console.log(JSON.stringify(r,null,1));console.log(errs);await b.close()})();
