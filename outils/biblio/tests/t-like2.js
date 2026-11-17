const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(async()=>{await BIB.init();const D=BIB.D;
 const u=D.units.find(x=>x.n==='Doom Scythe'&&x._c==='necrons');
 const m={ref:'f1',name:'Faucheur',stats:{},weapons:[{name:'Masse blindée',range:'Mêlée',a:'3',hit:'4+',f:'6',pa:'0',d:'1',caps:''}],apt:'',text:[],kw:'',pts:0};
 const r=BIB.buildCmp(m,u,0);return r.weapons.map(x=>[x.x.aw.name,x.x.aw.hit,x.kind])})),errs);await b.close()})();
