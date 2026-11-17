const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);
await ev(async()=>{await BIB.init();window.__majPop=1});
const q=async t=>ev(t=>BIB.search(t,'').map(u=>[u.n,BIB.tName(u.n).t]),t);
let r=await q('Guerriers Nécrons');ok('FR « Guerriers Nécrons » → fiche',r.some(x=>x[0]==='Necron Warriors'),r.slice(0,3));
r=await q('Necron Warriors');ok('EN « Necron Warriors » → fiche affichée en français',r.some(x=>x[0]==='Necron Warriors'&&x[1]==='Guerriers Nécrons'),r.slice(0,3));
r=await q('escouade d\'intercessors');ok('FR « escouade d\'intercessors »',r.some(x=>x[0]==='Intercessor Squad'),r.slice(0,3));
r=await q('Intercessor Squad');ok('EN « Intercessor Squad »',r.some(x=>x[0]==='Intercessor Squad'&&x[1]==="Escouade d'Intercessors"),r.slice(0,3));
r=await q('médiko');ok('accents : « mediko » → Painboy',(await q('mediko')).some(x=>x[0]==='Painboy'),1);
// UI bibliothèque : liste + fiche
for(const [t,exp] of [['Necron Warriors','Guerriers Nécrons'],['Guerriers Nécrons','Guerriers Nécrons'],['painboy','Médiko'],['mediko','Médiko']]){
await ev(()=>{tab='bib';draw()});await p.waitForTimeout(300);
await ev(t=>{const i=document.getElementById('bibq');i.value=t;i.dispatchEvent(new Event('input',{bubbles:true}))},t);await p.waitForTimeout(700);
const txt=await ev(()=>document.body.innerText);ok('barre de recherche « '+t+' » → fiche « '+exp+' »',txt.includes(exp),txt.slice(0,200));}
await ev(()=>{const c=document.querySelector('[data-bib="unit"]');c&&c.click()});await p.waitForTimeout(500);
const ft=await ev(()=>{const o=document.getElementById('bibm');return o?o.innerText.slice(0,200):''});ok('fiche ouverte : titre en français + nom anglais',/Médiko/.test(ft)&&/Nom anglais : /.test(ft),ft);
// collection
await ev(()=>{const u=BIB.D.units.find(x=>x.n==='Necron Warriors');S.coll.t1={ref:'t1',name:'Ma fiche perso',stats:{},weapons:[],equip:'',apt:'',text:[],kw:'',fkw:'',pts:1,nb:1,subs:[]};S.lib.links.t1={id:u.id,h:u.h,v:'x',at:1,prof:0,applied:[],stale:false,st:'manual'}});
const al=await ev(()=>BIBAL('t1'));ok('collection : recherche par nom FR et EN via BIBAL',/Necron Warriors/.test(al)&&/Guerriers Nécrons/.test(al),al);
await b.close()})();
