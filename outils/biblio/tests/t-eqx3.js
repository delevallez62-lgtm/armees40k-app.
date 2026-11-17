const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(async()=>{await BIB.init();const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();
 const u=BIB.D.units.find(x=>x.n==='Immortals'&&x._c==='necrons'),v=BIB.D.units.find(x=>x.n==='Boyz'&&x._c==='orks');
 const mk=(r,n)=>({ref:r,name:n,stats:{},weapons:[],equip:'',apt:'',text:[],kw:'',fkw:'',pts:0,nb:0,subs:[]});
 S.coll.a=mk('a','Fiche A');S.coll.b=mk('b','Fiche B');S.coll.c=mk('c','Fiche C');
 BIB.LB().links.a={id:u.id,h:u.h,v:'x',at:1,prof:0,applied:[],stale:false};           // liée, sans copie
 BIB.LB().links.b={id:v.id,h:v.h,v:'x',at:1,prof:0,applied:[],stale:false};S.coll.b.eqx={id:v.id,n:'Boyz',loadout:'ancien texte',opt:[],comp:[]}; // liée, copie périmée
 BIBSNAP();
 return{a:S.coll.a.eqx&&S.coll.a.eqx.opt.length,b:S.coll.b.eqx.loadout.slice(0,40),b_opt:S.coll.b.eqx.opt.length,c:!!S.coll.c.eqx}})),errs);await b.close()})();
