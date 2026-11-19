const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(async()=>{await BIB.init();window.__majPop=1;const D=BIB.D,st={M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'};const det=D.dets.find(x=>x.n==='Angelic Inheritors');
 window.__eq=(name,size,wq)=>{const lu=D.units.find(x=>x.n===name);const u={name:lu.n,ref:'rq'+lu.id.slice(0,5),size,pts:0,stats:st,weapons:[],subs:[],cfg:{lib:lu.id,size,wq:wq||{},wn:{},wg:{},subs:[]}};
  const L={id:'sim',name:'Sim',dets:[],strats:[],bld:{limit:2000,facN:'Space Marines',dets:[{id:det.id,name:det.n,en:det.n}]},units:[u]};S.lists=[L];S.cur='sim';
  const eq=BIBLCK.run(L).sec.find(s=>s.id==='eq').items;return{bad:eq.filter(i=>i.lv==='bad').map(i=>i.t),warn:eq.filter(i=>i.lv==='warn').map(i=>i.t),info:eq.filter(i=>i.lv==='info').map(i=>i.t||i.nodet)}}});
const E=(n,s,wq)=>p.evaluate(([n,s,wq])=>__eq(n,s,wq),[n,s,wq]);
const legal=async(t,n,s,wq)=>{const r=await E(n,s,wq);ok('LÉGAL · '+t,!r.bad.length&&!r.warn.length&&!r.info.some(x=>/non reconnue/.test(x)),r)};
const illegal=async(t,n,s,wq)=>{const r=await E(n,s,wq);ok('ILLÉGAL détecté · '+t,r.bad.length>0,r)};
const VJ='Vanguard Veteran Squad with Jump Packs',TS='Terminator Squad';
// français seulement (glossaire de l'appli) / mélange français-anglais
await legal('VJ 5 : tout en français (pistolet à plasma, marteau tonnerre)',VJ,5,{'Pistolet à plasma':3,'Marteau tonnerre':1});
await legal('VJ 5 : marteau en français, plasma en anglais',VJ,5,{'Marteau de tonnerre':1,'Plasma pistol (Standard)':3});
await legal('VJ 5 : pluriel et accents (Pistolets à plasma)',VJ,5,{'Pistolets à plasma':3});
await illegal('VJ 5 : 4 pistolets à plasma en français',VJ,5,{'Pistolet à plasma':4});
await legal('TS 10 : canon d\'assaut (FR) + lance-flammes lourd (FR)',TS,10,{'Canon d\'assaut':1,'Lance-flammes lourd':1});
await legal('TS 10 : Assault Cannon (EN) + Lance-flammes lourd (FR)',TS,10,{'Assault Cannon':1,'Lance-flammes lourd':1});
await illegal('TS 5 : Assault Cannon (EN) + Lance-flammes lourd (FR) : 2 pour 5 figurines',TS,5,{'Assault Cannon':1,'Lance-flammes lourd':1});
await legal('TS 5 : poing tronçonneur et arme énergétique (noms de l\'appli)',TS,5,{'Arme énergétique':1,'Chainfist - Standard':3});
// nom traduit modifié par l'utilisateur après coup : l'ancien et le nouveau nom restent reconnus
await p.evaluate(()=>{BIB.LB().tr['n:'+'thunder hammer']={fr:'Marteau-pilon',st:'ok',src:'user',at:Date.now()}});
await legal('VJ 5 : nouveau nom saisi par l\'utilisateur (Marteau-pilon)',VJ,5,{'Marteau-pilon':1,'Pistolet à plasma':3});
await legal('VJ 5 : ancien nom toujours reconnu (Marteau de tonnerre)',VJ,5,{'Marteau de tonnerre':1,'Pistolet à plasma':3});
await illegal('VJ 5 : poing + nouveau marteau = 2 remplacements pour le sergent',VJ,5,{'Marteau-pilon':1,'Poing énergétique':1});
await b.close()})();
