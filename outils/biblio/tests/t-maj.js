const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/localhost:8766/.test(u))return r.continue();r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
// préparation : fiche de collection liée aux Immortals, une unité dans une liste, source de mise à jour = mock v3
await p.evaluate(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();await BIB.init();
 const u=BIB.D.units.find(x=>x.n==='Immortals'&&x._c==='necrons');const pf=u.pr[0];
 const mk=(r,n)=>({ref:r,name:n,stats:{M:pf.M,E:pf.E,SV:pf.SV,PV:pf.PV,CD:pf.CD,CO:pf.CO},weapons:[],equip:'',apt:'',text:[],kw:'',fkw:'',pts:u.pts||0,nb:0,subs:[]});
 S.coll.imm=mk('imm','Immortels');BIB.LB().links.imm={id:u.id,h:u.h,v:'x',at:1,prof:0,applied:[],stale:false};
 S.lists=[{id:'L1',name:'Test',units:[Object.assign(mk('imm','Immortels'),{ref:'imm'})]}];S.cur='L1';
 BIB.LB().src='http://localhost:8766/v3/';BIB.LB().last=null;BIB.LB().news=[];BIB.LB().appSeen=999;window.__majPop=0;
 window.__before={pvColl:S.coll.imm.stats.PV,pvList:S.lists[0].units[0].stats.PV,nUnits:BIB.D.units.length,nColl:Object.keys(S.coll).length}});
const r=await p.evaluate(async()=>{const r=await BIB.checkUpdate(true);const n=BIB.LB().news[0];return{state:r.state,err:r.err,add:n&&n.items.add.map(i=>i.k.slice(0,12)+' '+i.n),chg:n&&n.items.chg.map(i=>i.n+' '+JSON.stringify(i.d)),prop:n&&n.prop,created:n&&n.created,before:window.__before,
 after:{pvColl:S.coll.imm.stats.PV,pvList:S.lists[0].units[0].stats.PV,nColl:Object.keys(S.coll).length,newSheet:Object.values(S.coll).filter(m=>m.auto).map(m=>m.name),sheetAbs:S.coll.imm.apt}}});
console.log(JSON.stringify(r,null,1));
// popup
await p.evaluate(()=>{window.__majPop=0;BIB.maj&&0;BIBMAJ.popup()});await p.waitForTimeout(300);
console.log('popup:',await p.evaluate(()=>{const e=document.querySelector('#bibp');return e?e.innerText.replace(/\n/g,' | ').slice(0,300):'aucun'}));
await p.screenshot({path:'maj-pop.png'});
await p.evaluate(()=>document.querySelector('#bibp [data-bib="popn"]').click());await p.waitForTimeout(500);
console.log('onglet:',await p.evaluate(()=>tab),await p.evaluate(()=>document.body.innerText.includes('Nouvelles fiches')));
await p.screenshot({path:'maj-tab.png'});
// ouvrir un tiroir, modifier, enregistrer
await p.evaluate(()=>{const d=[...document.querySelectorAll('details.bib-nw[data-nwk]')].find(x=>/Immortals/.test(x.innerText));d.open=true;d.dispatchEvent(new Event('toggle'))});await p.waitForTimeout(300);
console.log('tiroir:',await p.evaluate(()=>{const d=[...document.querySelectorAll('details.bib-nw[data-nwk]')].find(x=>/Immortals/.test(x.innerText));return d.innerText.replace(/\n/g,' | ').slice(0,260)}));
await p.evaluate(()=>document.querySelector('[data-bibnw="edit"]').click());await p.waitForTimeout(200);
await p.evaluate(()=>{const f=document.querySelector('[data-nwf="st:E"]');f.value='9';document.querySelector('[data-bibnw="save"]').click()});await p.waitForTimeout(500);
console.log('après modif E=9:',await p.evaluate(()=>({lib:BIB.D.units.find(x=>x.n==='Immortals'&&x._c==='necrons').pr[0].E,coll:S.coll.imm.stats.E,list:S.lists[0].units[0].stats.E,ovr:Object.keys(BIB.LB().ovr||{})})));
console.log(errs);await b.close()})();
