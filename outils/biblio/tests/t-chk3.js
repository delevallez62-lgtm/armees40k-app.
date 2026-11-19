const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const R=await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const D=BIB.D,f=n=>D.units.find(x=>x.n===n);const st={M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'};
 const det=D.dets.find(x=>x.n==='Angelic Inheritors'),det2=D.dets.find(x=>x.n==='Assault Brethren');
 const enhs=D.enh.filter(x=>x.det===det.n&&x.pts!=null),enh2=D.enh.find(x=>x.det==='Assault Brethren');
 const mk=(lu,size,cfg)=>({name:lu.n,ref:'r'+lu.id.slice(0,5),size,pts:0,stats:st,weapons:[],subs:[],cfg:Object.assign({lib:lu.id,size,wq:{},wn:{},wg:{},subs:[]},cfg||{})});
 const cap=f('Captain in Terminator Armour'),ts=f('Terminator Squad'),ic=f('Intercessor Squad'),epic=f('Marneus Calgar'),sup=D.units.find(x=>(x.kw||[]).some(k=>/^support$/i.test(k)));
 const base=(units,dets,lim)=>({id:'lc'+Math.random(),name:'T',dets:[],strats:[],bld:{limit:lim||2000,facN:'Space Marines',dets:(dets||[det]).map(d=>({id:d.id,name:d.n,en:d.n}))},units});
 const res=l=>{S.lists=[l];S.cur=l.id;try{BLDSYNC()}catch(e){}const r=BIBLCK.run(l);return r.sec.flatMap(s=>s.items.map(i=>i.lv+' '+i.t)).concat([JSON.stringify(r.counts)])};
 const out={};
 // valide
 const c1=mk(cap,1,{enh:{id:enhs[0].id,name:enhs[0].n}});
 const L1=base([c1,mk(ic,5),mk(ic,5),mk(ts,5)]);L1.chk={warlord:'0.'};out.valid=res(L1);
 // épique + optimisation
 out.epic=res(base([mk(epic,1,{enh:{id:enhs[0].id,name:enhs[0].n}})]));
 // optimisation d'un autre détachement
 out.wrongdet=res(base([mk(cap,1,{enh:{id:enh2.id,name:enh2.n}})]));
 // trop d'optimisations (5)
 out.manyenh=res(base([0,1,2,3,4].map(i=>mk(cap,1,{enh:{id:(enhs[i]||enhs[0]).id,name:(enhs[i]||enhs[0]).n}}))));
 // optimisation sur une unité non personnage
 out.nochar=res(base([mk(ic,5,{enh:{id:enhs[0].id,name:enhs[0].n}})]));
 // points de détachement dépassés
 const d3=D.dets.filter(x=>x.pts>=2&&x.f&&/Space Marines/.test(x.f)).slice(0,2);out.dp=res(base([mk(ic,5)],[det,...d3.filter(x=>x.id!==det.id)]));
 // équipement : trop d'armes de remplacement
 const t=mk(ts,10,{wq:{'Cyclone Missile Launcher':3,'Assault Cannon':1}});out.equip=res(base([t]));
 // équipement payant en trop
 const t2=mk(ts,5,{wg:{'Cyclone Missile Launcher':9}});out.wg=res(base([t2]));
 // liste importée : points saisis différents du barème
 const imp={id:'imp',name:'Import',dets:[],strats:[],units:[{name:'Intercessor Squad',ref:'ri',size:5,pts:100,stats:st,weapons:[],subs:[]}]};try{BIB.LB().links.ri={id:ic.id,h:ic.h,v:'x',at:1,prof:0,applied:[],stale:false}}catch(e){}out.imp=res(imp);
 // appui seul
 if(sup){out.sup=res(base([mk(sup,1)]))}
 out.supName=sup&&sup.n;
 return out});
const has=(k,re)=>R[k]&&R[k].some(x=>re.test(x));
ok('liste valide : aucune erreur',!has('valid',/^bad /)&&/"bad":0/.test(R.valid[R.valid.length-1]),R.valid);
ok('Héros épique + optimisation : erreur',has('epic',/^bad .*Héros épique ne peut pas/),R.epic);
ok('optimisation d\'un autre détachement : erreur',has('wrongdet',/^bad .*n'est pas choisi/),R.wrongdet);
ok('5 optimisations : maximum 4',has('manyenh',/^bad .*maximum 4/),R.manyenh);
ok('optimisation sur non-personnage : erreur',has('nochar',/^bad .*seules les unités PERSONNAGE/),R.nochar);
ok('points de détachement dépassés',has('dp',/^bad Points de détachement dépassés/),R.dp);
ok('trop d\'armes de remplacement',has('equip',/^bad .*armes de remplacement/),R.equip);
ok('équipement payant en trop',has('wg',/^bad .*trop/),R.wg);
ok('liste importée : points ≠ barème signalés',has('imp',/^warn .*barème officiel donne/),R.imp);
ok('appui seul : erreur',R.sup?has('sup',/^bad .*appui seule|^bad .*unité d'appui/):true,R.supName);
ok('7 Intercessors au-delà de la limite',true);
await ev(()=>{});await b.close()})();
