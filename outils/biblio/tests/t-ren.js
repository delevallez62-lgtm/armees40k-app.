const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const clickBtn=async re=>{const r=await ev(re=>{const b=[...document.querySelectorAll('button')].find(x=>new RegExp(re).test(x.innerText.trim()));if(!b)return false;b.click();return true},re);await wait(300);return r};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const W=(n,a,h,f,pa,d)=>({name:n,range:'24"',a,hit:h,f,pa,d,caps:''});
 S.coll.c1={ref:'c1',name:'Escouade Ancienne',stats:{M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},weapons:[W('Bolter','2','3+','4','0','1'),W('Épée','3','3+','4','-1','1')],equip:'',apt:'',text:[],kw:'',fkw:'',pts:100,nb:1,subs:[],notes:'MA NOTE'};
 S.lists=[{id:'L',name:'Liste',units:[{ref:'c1',size:5,pts:100,subs:[]}],dets:[],strats:[]}];window.__go=null;window.__r=null});
// 1) collection : même profil, autre nom
const res=await ev(async()=>{const r={units:[{name:'Escouade Renommée',stats:{M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},weapons:[{name:'Bolter',range:'24"',a:'2',hit:'3+',f:'4',pa:'0',d:'1',caps:''},{name:'Épée',range:'24"',a:'3',hit:'3+',f:'4',pa:'-1',d:'1',caps:''}],pts:100}]};
 const asked=BIBMERGE.ask(r,[],{},(rr,it,o)=>{window.__go=o});return {asked,cands:BIBMERGE.rcands(r.units).map(x=>x.src+':'+(x.m?x.m.name:x.u.n))}});
ok('proposition affichée pour une fiche de la collection',res.asked&&res.cands[0]==='collection:Escouade Ancienne',res);
ok('fenêtre « Même unité ? »',await ev(()=>/Même unité/.test(document.body.innerText)&&/Escouade Renommée/.test(document.body.innerText)),await ev(()=>document.body.innerText.slice(0,200)));
await clickBtn('^Oui, c.est la même');
const a1=await ev(()=>({name:S.coll.c1.name,old:S.coll.c1.old,notes:S.coll.c1.notes,list:S.lists[0].units[0].ref,go:!!window.__go}));
ok('confirmation : le nom existant est remplacé par celui de l\'import',a1.name==='Escouade Renommée'&&a1.go,a1);
ok('données personnelles et liste intactes',a1.notes==='MA NOTE'&&a1.list==='c1',a1);
// 2) refus : rien ne change
await ev(()=>{S.coll.c1.name='Escouade Ancienne';window.__go=null;const r={units:[{name:'Autre Nom',stats:{M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},weapons:[{name:'Bolter',range:'24"',a:'2',hit:'3+',f:'4',pa:'0',d:'1',caps:''},{name:'Épée',range:'24"',a:'3',hit:'3+',f:'4',pa:'-1',d:'1',caps:''}]}]};BIBMERGE.ask(r,[],{},(rr,it,o)=>{window.__go=o})});await wait(300);
await clickBtn('^Non, garder séparées');
ok('refus : fiche existante inchangée, import poursuit',await ev(()=>S.coll.c1.name==='Escouade Ancienne'&&!!window.__go),await ev(()=>S.coll.c1.name));
// 3) bibliothèque : profil d'une unité de la bibliothèque sous un autre nom
const lib=await ev(async()=>{const u=BIB.D.units.find(x=>x.n==='Necron Warriors');const pf=u.pr[0];const ws=[...u.rw.map(w=>BIB.wToApp(w,false)),...u.mw.map(w=>BIB.wToApp(w,true))];
 const r={units:[{name:'Guerriers de test',stats:{M:pf.M,E:pf.E,SV:pf.SV,PV:pf.PV,CD:pf.CD,CO:pf.CO},weapons:ws}]};window.__go=null;
 const c=BIBMERGE.rcands(r.units);const asked=BIBMERGE.ask(r,[],{},(rr,it,o)=>{window.__go=o;window.__r=rr});return{c:c.map(x=>x.src+':'+(x.m?x.m.name:x.u.n)),asked}});
ok('proposition pour une unité de la bibliothèque',lib.asked&&/^bibliothèque:/.test(lib.c[0]||''),lib);
await clickBtn('^Oui, c.est la même');
const a3=await ev(()=>{const u=BIB.D.units.find(x=>x.n==='Necron Warriors');return{go:!!window.__go,lren:window.__go&&window.__go._lren&&window.__go._lren.length,name:BIB.tName('Necron Warriors')}});
ok('confirmation : le nom de la fiche de la bibliothèque devient celui de l\'import',a3.name.t==='Guerriers de test'&&a3.name.st==='ok'&&a3.lren===1,a3);
// post : lien créé avec la fiche importée
const a4=await ev(()=>{S.coll.imp={ref:'imp',name:'Guerriers de test',stats:{},weapons:[],equip:'',apt:'',text:[],kw:'',fkw:'',pts:1,nb:1,subs:[]};BIBMERGE.post(window.__go);const lk=S.lib.links.imp;return lk&&{id:!!lk.id,st:lk.st}});
ok('après l\'import : la fiche importée est liée à la bibliothèque',a4&&a4.id,a4);
// 4) aucune proposition si le nom existe déjà
ok('pas de proposition quand le nom est identique',await ev(()=>BIBMERGE.rcands([{name:'Escouade Ancienne',stats:{M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},weapons:[{name:'Bolter',range:'24"',a:'2',hit:'3+',f:'4',pa:'0',d:'1'}]}]).length===0),1);
await b.close()})();
