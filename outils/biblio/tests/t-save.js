const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
await p.evaluate(async()=>{await BIB.init();window.__majPop=1;S.lists=[{id:'q',name:'Armée Orks',units:[],dets:[],strats:[],bld:{fac:'orks',facN:'Orks',limit:2000,fmt:'',pv:'x',tot:0,dets:[]}}];S.cur='q';BLDSTATE.id='q';BLDSTATE.scr='edit';BLDSTATE.step='4';tab='bld';draw()});await p.waitForTimeout(400);
await p.screenshot({path:'save4.png'});
await p.evaluate(()=>document.querySelector('[data-bld="savelist"]').click());await p.waitForTimeout(400);
console.log(await p.evaluate(()=>({scr:BLDSTATE.scr,txt:document.body.innerText.includes('Mes armées')})));
await b.close()})();
