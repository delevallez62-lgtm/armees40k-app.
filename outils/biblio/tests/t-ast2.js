const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},isMobile:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
await p.evaluate(async()=>{await BIB.init();window.__majPop=1});
const list=await p.evaluate(()=>BIBAST.test.facs());
const out=[];let bad=0,tot=0,recsN=0;
for(const fac of list){const r=await p.evaluate(async fac=>{const res={fac,fails:[],n:0,recs:0,ms:0};try{S.lists=[];const t0=Date.now();
  for(const [seed,lim,fill] of [[2,2000,0],[5,1000,0]]){const L=BIBAST.test.mkList(fac,lim);BIBAST.test.fillList(L,seed);
   /* retire quelques unités pour laisser de la marge */ while(L.units.length>3&&(BIBAST.test.calc(L).total>lim*0.88))L.units.pop();BIBAST.test.applyPts(L);
   const A=BIBAST.analyse(L);if(!A.ok){res.fails.push("analyse refusée : "+A.why);continue}
   const R=BIBAST.recommend(A);res.recs+=R.length;
   const snap=JSON.stringify(L);
   for(const x of R){res.n++;if(!x.legal.ok)continue;
     const V=BIBAST.applyRec(L,x);if(!V){res.fails.push("application impossible : "+x.title);continue}
     if(JSON.stringify(L)!==snap)res.fails.push("liste d'origine modifiée par "+x.title);
     const tv=BIBAST.test.calc(V).total;if(tv!==A.total+x.cost)res.fails.push("points : "+tv+" ≠ "+(A.total+x.cost)+" ("+x.title+")");
     if(lim&&tv>lim)res.fails.push("dépasse la limite : "+x.title);
     const before=new Set(BIBAST.test.bad(L,L.units).map(y=>y.k)),nb=BIBAST.test.bad(V,V.units).filter(y=>!before.has(y.k));if(nb.length)res.fails.push("variante illégale : "+x.title+" → "+nb[0].t);
     const A2=BIBAST.analyse(V);if(A2.ok){const d=Math.abs((A2.I.ind.glob||0)-(x.after.glob||0));if(d>4)res.fails.push("score après ≠ prévu ("+(A2.I.ind.glob)+" vs "+x.after.glob+") : "+x.title)}
     S.lists=S.lists.filter(l=>l.id!==V.id)}
   S.lists=[]}
  res.ms=Date.now()-t0}catch(e){res.fails.push("exception : "+(e&&e.message))}return res},fac);
 tot+=r.n;recsN+=r.recs;out.push(r);console.log(fac,'recs',r.recs,'testées',r.n,r.fails.length?'ÉCHECS '+r.fails.length:'ok',r.ms+'ms');r.fails.slice(0,3).forEach(f=>console.log('   ',f));bad+=r.fails.length}
console.log('TOTAL recommandations',recsN,'échecs',bad);await b.close()})();
