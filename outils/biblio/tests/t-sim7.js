const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
const r=await p.evaluate(async()=>{await BIB.init();window.__majPop=1;const D=BIB.D,f=n=>D.units.find(x=>x.n===n),st={M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'};
 const det=D.dets.find(x=>x.n==='Angelic Inheritors'),enh=D.enh.find(x=>x.det===det.n&&x.pts!=null);
 const mk=(n,size,cfg,subs)=>{const lu=f(n);return{name:lu.n,ref:'r'+lu.id.slice(0,5),size,pts:0,stats:st,weapons:[],subs:subs||[],cfg:Object.assign({lib:lu.id,size,wq:{},wn:{},wg:{},subs:[]},cfg||{})}};
 const ldr=(n,label)=>({label,name:f(n).name||n,ref:'s'+f(n).id.slice(0,5),pts:0,cfg:{lib:f(n).id,size:1,wq:{},wn:{},wg:{}}});
 const cap=mk('Captain in Terminator Armour',1,{enh:{id:enh.id,name:enh.n},wq:{'Relic Fist':1}});
 const ts=mk('Terminator Squad',10,{wq:{'Power fist':10,'Storm bolter':8,'Assault Cannon':1,'Cyclone missile launcher - frag':1,'Cyclone missile launcher - krak':1,'Chainfist - Standard':2,'Chainfist - Hunter: Monster/Vehicle':2},wg:{'Cyclone Missile Launcher':1}});
 const vj=mk('Vanguard Veteran Squad with Jump Packs',5,{wq:{'Thunder Hammer':1,'Plasma pistol (Standard)':3,'Plasma pistol (Supercharge)':3}});
 const sg=mk('Sternguard Veteran Squad',10,{wq:{'Heavy Bolter':1,'Pyrecannon':1,'Power fist':1}});
 const ic=[mk('Intercessor Squad',5),mk('Intercessor Squad',5),mk('Intercessor Squad',10)];
 const L={id:'big',name:'Armée simulée',dets:[],strats:[],bld:{limit:2000,facN:'Space Marines',dets:[{id:det.id,name:det.n,en:det.n}]},units:[cap,ts,vj,sg,...ic],chk:{warlord:'0.'}};
 S.lists=[L];S.cur='big';try{BLDSYNC()}catch(e){}
 const res=BIBLCK.run(L);return{counts:res.counts,total:res.total,items:res.sec.flatMap(s=>s.items.filter(i=>i.lv==='bad'||i.lv==='warn').map(i=>s.id+': '+i.lv+' '+i.t))}});
console.log(JSON.stringify(r,null,1));
ok('liste complète légale : 0 erreur',r.counts.bad===0,r);ok('liste complète légale : 0 avertissement',r.counts.warn===0,r.items);
await b.close()})();
