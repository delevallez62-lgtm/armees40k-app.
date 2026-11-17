const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;const W=(n,r,a,h,f,pa,d)=>({name:n,range:r,a,hit:h,f,pa,d,caps:''});
S.coll.zz={ref:'zz',name:'Mes Intercessors',stats:{M:'6',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},weapons:[W('Bolt rifle','24"','2','3+','4','-1','1')],equip:'Bolt rifle',apt:'',text:[],kw:'Infanterie',fkw:'',pts:80,nb:0,subs:[]};
S.lists=[{id:'q',name:'Test',units:[],dets:[],strats:[],bld:{fac:'space-marines',facN:'Space Marines',limit:2000,fmt:'',pv:'x',tot:0,dets:[]}}];S.cur='q';BLDSTATE.id='q';BLDSTATE.scr='edit';BLDSTATE.step='3';tab='bld';draw()});
const click=async sel=>{await ev(s=>{const e=document.querySelector(s);if(!e)throw new Error('absent '+s);e.click()},sel);await wait(300)};
await click('[data-bld="add"]');await ev(()=>{BLDSTATE.src='coll';BLDSTATE.fac='*'});await click('[data-bld="src"][data-v="coll"]');
const t1=await ev(()=>document.querySelector('#bldm').innerText);ok('carte « à lier » + message dans le catalogue',/à lier/.test(t1)&&/ne sont pas liées|n'est pas liée/.test(t1),t1.slice(0,300));
await click('[data-bld="pick"][data-k="c:zz"]');
const t2=await ev(()=>document.querySelector('#bldm').innerText);ok('bloc « Fiche non liée » dans la configuration',/Fiche non liée/.test(t2),t2.slice(0,300));
const has=await ev(()=>!!document.querySelector('#bldm [data-bib="cmp"],#bldm [data-bib="open"]'));ok('bouton pour lier',has,has);
await ev(()=>{const b=document.querySelector('#bldm [data-bib="cmp"]')||document.querySelector('#bldm [data-bib="open"]');b.click()});await wait(2500);
const open=await ev(()=>!!document.querySelector('#bibm .bib-ov'));
if(!await ev(()=>S.lib&&S.lib.links&&S.lib.links.zz)){console.log('lien non créé automatiquement, overlay ouvert:',open);}
const r=await ev(()=>({lk:!!(S.lib.links||{}).zz,key:BLDSTATE.cfg&&BLDSTATE.cfg.key,scr:BLDSTATE.scr,txt:document.querySelector('#bldm')?document.querySelector('#bldm').innerText.slice(0,200):''}));
ok('fiche liée partout (lien enregistré)',r.lk,r);ok('l\'écran de configuration se met à jour (unité de la bibliothèque)',/^u:/.test(r.key||''),r);
await b.close()})();
