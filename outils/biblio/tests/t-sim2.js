const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const D=BIB.D,st={M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'};
 const det=D.dets.find(x=>x.n==='Angelic Inheritors');
 window.__eq=(name,size,wq,wg)=>{const lu=D.units.find(x=>x.n===name);if(!lu)return{missing:name};
  const u={name:lu.n,ref:'rq'+lu.id.slice(0,5),size,pts:0,stats:st,weapons:[],subs:[],cfg:{lib:lu.id,size,wq:wq||{},wn:{},wg:wg||{},subs:[]}};
  const L={id:'sim',name:'Sim',dets:[],strats:[],bld:{limit:2000,facN:'Space Marines',dets:[{id:det.id,name:det.n,en:det.n}]},units:[u]};S.lists=[L];S.cur='sim';
  const r=BIBLCK.run(L);const eq=r.sec.find(s=>s.id==='eq').items;return{bad:eq.filter(i=>i.lv==='bad').map(i=>i.t),warn:eq.filter(i=>i.lv==='warn').map(i=>i.t),info:eq.filter(i=>i.lv==='info').map(i=>i.t||i.nodet),ok:eq.filter(i=>i.lv==='ok').length}};
 window.__fr=n=>{try{return BIB.tName(n).t}catch(e){return n}};
});
const E=(n,s,wq,wg)=>p.evaluate(([n,s,wq,wg])=>__eq(n,s,wq,wg),[n,s,wq,wg]);
const legal=async(t,n,s,wq,wg)=>{const r=await E(n,s,wq,wg);ok('LÉGAL · '+t,!r.missing&&!r.bad.length&&!r.warn.length,r)};
const illegal=async(t,n,s,wq,wg)=>{const r=await E(n,s,wq,wg);ok('ILLÉGAL détecté · '+t,!r.missing&&r.bad.length>0,r)};
const VJ='Vanguard Veteran Squad with Jump Packs',TS='Terminator Squad',AT='Terminator Assault Squad',SG='Sternguard Veteran Squad',BG='Bladeguard Veteran Squad';
// ----- Vétérans d'avant-garde à réacteurs dorsaux
await legal('VJ 5 : marteau + 3 pistolets plasma (1 sergent + 2)',VJ,5,{'Thunder Hammer':1,'Plasma pistol (Standard)':3,'Plasma pistol (Supercharge)':3,'Heavy Bolt Pistol':2,'Master-crafted Power Weapon':4});
await legal('VJ 5 : poing sergent + aucune modification',VJ,5,{'Power fist':1,'Heavy Bolt Pistol':5,'Master-crafted Power Weapon':4});
await legal('VJ 10 : 5 pistolets plasma (1 + 4) + marteau',VJ,10,{'Thunder Hammer':1,'Plasma pistol (Standard)':5,'Plasma pistol (Supercharge)':5});
await legal('VJ 10 : 3 pistolets plasma seulement',VJ,10,{'Plasma pistol (Standard)':3});
await illegal('VJ 5 : 4 pistolets plasma (max 3)',VJ,5,{'Plasma pistol (Standard)':4});
await illegal('VJ 10 : 6 pistolets plasma (max 5)',VJ,10,{'Plasma pistol (Standard)':6});
await illegal('VJ : poing ET marteau (un seul remplacement pour la relique du sergent)',VJ,5,{'Power fist':1,'Thunder Hammer':1});
// ----- Escouade de Terminators
await legal('TS 5 : sergent arme énergétique + 4 poings tronçonneurs',TS,5,{'Power weapon':1,'Chainfist - Standard':4,'Chainfist - Hunter: Monster/Vehicle':4,'Storm bolter':5,'Power fist':0});
await legal('TS 5 : 1 canon d\'assaut',TS,5,{'Assault Cannon':1,'Storm bolter':4,'Power fist':5});
await legal('TS 10 : canon d\'assaut + lance-missiles cyclone (profils frag/krak)',TS,10,{'Assault Cannon':1,'Cyclone missile launcher - frag':1,'Cyclone missile launcher - krak':1,'Storm bolter':9});
await legal('TS 10 : 2 lance-flammes lourds',TS,10,{'Heavy Flamer':2});
await legal('TS 10 : 3 cyclones payants (nom FR possible)',TS,10,{[__f='Cyclone Missile Launcher']:2},{'Cyclone Missile Launcher':2});
await illegal('TS 5 : canon d\'assaut + lance-flammes lourd (1 pour 5)',TS,5,{'Assault Cannon':1,'Heavy Flamer':1});
await illegal('TS 10 : 3 armes spéciales (2 pour 10)',TS,10,{'Assault Cannon':1,'Heavy Flamer':1,'Cyclone missile launcher - frag':1});
await illegal('TS 5 : équipement payant × 9 pour 5 figurines',TS,5,{},{'Cyclone Missile Launcher':9});
await illegal('TS : équipement payant inconnu',TS,5,{},{'Lance-plasma fantôme':1});
// ----- autres unités à restrictions strictes
await legal('Terminator Assault Squad 5 : marteaux + boucliers',AT,5,{'Thunder hammer':5,'Storm shield':5,'Lightning claw':0});
await legal('Sternguard 10 : 1 bolter lourd + 1 pyrocanon + poing sergent',SG,10,{'Heavy Bolter':1,'Pyrecannon':1,'Power fist':1});
await illegal('Sternguard 5 : bolter lourd + pyrocanon (1 pour 5)',SG,5,{'Heavy Bolter':1,'Pyrecannon':1});
await legal('Bladeguard 5 : équipement de base',BG,5,{});
// noms français
const fr=await p.evaluate(()=>({a:__fr('Thunder Hammer'),b:__fr('Plasma pistol'),c:__fr('Heavy Flamer'),d:__fr('Assault Cannon')}));console.log('noms FR',JSON.stringify(fr));
await legal('VJ 5 (noms français) : 3 pistolets plasma + marteau',VJ,5,{[fr.a]:1,[fr.b]:3});
await illegal('VJ 5 (noms français) : 4 pistolets plasma',VJ,5,{[fr.b]:4});
await legal('TS 10 (noms français) : canon d\'assaut + lance-flammes lourd',TS,10,{[fr.d]:1,[fr.c]:1});
await illegal('TS 5 (noms français) : canon d\'assaut + lance-flammes lourd',TS,5,{[fr.d]:1,[fr.c]:1});
await b.close()})();
