const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const r=await p.evaluate(async()=>{await BIB.init();const E=BIBLCK.eqe();let seed=777;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
 const st={units:0,runs:0,illegalAfterWalk:0,blockedButApplicable:0,availableButInvalid:0,crash:0,partial:0};const fails=[];
 for(const u of BIB.D.units){if(!(u.wp&&u.wp.comp&&u.wp.loadout))continue;let M;try{M=E.model(u)}catch(e){st.crash++;continue}if(!M.usable)continue;
  const sizes=[];const lo=(u.sz&&u.sz.min)||1,hi=(u.sz&&u.sz.max)||lo;[lo,hi].forEach(s=>{if(E.compatible(M,s)&&!sizes.includes(s))sizes.push(s)});if(!sizes.length)continue;st.units++;if(!M.reliable)st.partial++;
  for(const size of sizes){for(let rep=0;rep<3;rep++){
   try{let figs=E.newFigs(M,size);
    for(let step=0;step<14;step++){const i=Math.floor(rnd()*figs.length);const opts=E.options(M,size,figs,i);const av=[];opts.forEach(o=>o.alts.forEach(a=>{if(!a.sel&&a.ok)av.push([o.rule.id,a.ai])}));
     /* cohérence : une option marquée indisponible doit réellement produire une erreur */
     opts.forEach(o=>o.alts.forEach(a=>{if(!a.sel){const t=figs.map((g,j)=>j===i?{t:g.t,c:Object.assign({},g.c,{[o.rule.id]:[a.ai]})}:g);const nerr=E.validate(M,size,t).errors.length;const base=E.validate(M,size,figs).errors.length;if(a.ok&&nerr>base){st.availableButInvalid++;if(fails.length<6)fails.push({u:u.n,size,kind:'dispo mais invalide',rule:o.rule.txt})}if(!a.ok&&nerr<=base){st.blockedButApplicable++;if(fails.length<6)fails.push({u:u.n,size,kind:'bloquée à tort',rule:o.rule.txt,why:a.why})}}}));
     if(!av.length)continue;const [rid,ai]=av[Math.floor(rnd()*av.length)];figs=figs.map((g,j)=>j===i?{t:g.t,c:Object.assign({},g.c,{[rid]:[ai]})}:g)}
    st.runs++;const v=E.validate(M,size,figs);if(v.errors.length){st.illegalAfterWalk++;if(fails.length<6)fails.push({u:u.n,size,kind:'illégal après parcours',err:v.errors.slice(0,2).map(x=>x.msg)})}
   }catch(e){st.crash++;if(fails.length<6)fails.push({u:u.n,err:String(e)})}}}}
 return{st,fails}});
console.log(JSON.stringify(r,null,1).slice(0,3500));await b.close()})();
