const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const D=BIB.D,st={M:'5',E:'5',SV:'2+',PV:'3',CD:'6+',CO:'1'};const det=D.dets.find(x=>x.n==='Angelic Inheritors');const lu=D.units.find(x=>x.n==='Terminator Squad');
 const mk=(wq)=>({name:'Escouade de Terminators',ref:'rt1',size:10,pts:380,stats:st,weapons:[],subs:[],cfg:{lib:lu.id,size:10,wq,wn:{},wg:{},subs:[]}});
 S.coll={};S.lists=[{id:'lm',name:'Ancienne liste',dets:[],strats:[],bld:{limit:2000,facN:'Space Marines',dets:[{id:det.id,name:det.n,en:det.n}]},
  units:[mk({'Power fist':10,'Storm bolter':9,'Assault Cannon':1,'Cyclone missile launcher - frag':1,'Cyclone missile launcher - krak':1,'Chainfist - Standard':2,'Chainfist - Hunter: Monster/Vehicle':2}),mk({'Assault Cannon':1,'Heavy Flamer':1,'Cyclone missile launcher - frag':1})]}];
 S.cur='lm';BLDSTATE.id='lm';tab='bld';BLDSTATE.scr='edit';draw()});await wait(400);
// vérification de liste sur d'anciennes configurations (totaux) : détecte l'excès
const r=await ev(()=>BIBLCK.run(S.lists[0]).sec.find(s=>s.id==='eq').items.map(i=>i.lv+' '+(i.u||'')+' '+i.t));
ok('ancienne configuration légale : aucune erreur',!r.slice(0,1).some(x=>/^bad/.test(x)),r);
ok('ancienne configuration illégale (3 armes spéciales pour 10) : erreur',r.some(x=>/^bad/.test(x)),r);
await b.close()})();
