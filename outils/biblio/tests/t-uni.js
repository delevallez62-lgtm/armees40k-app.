const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);
const R=await ev(async()=>{await BIB.init();window.__majPop=1;const D=BIB.D;
const sheet=(ref,name,u,extra)=>{const pr=u.pr[0];const m={ref,name,stats:{M:pr.M.replace('"',''),E:pr.E,SV:pr.SV,PV:pr.PV,CD:pr.CD,CO:pr.CO},weapons:[...u.rw,...u.mw].filter(w=>!/^➤/.test(w.n)).map(w=>BIB.wToApp(w,/Melee/i.test(w.r))),equip:'x',apt:'',text:[],kw:'Infanterie',fkw:'',pts:100,nb:3,subs:[],notes:'ma note perso',eqsel:{a:1}};Object.assign(m,extra||{});S.coll[ref]=m;return m};
const nw=D.units.find(x=>x.n==='Necron Warriors'),ai=D.units.find(x=>x.n==='Assault Intercessor Squad'),is=D.units.find(x=>x.n==='Intercessor Squad');
sheet('fr1','Guerriers Nécrons',nw);sheet('fr2','Assault Intercessor Squad',ai);sheet('zz','Zorglub Mega',nw,{stats:{M:'9',E:'9',SV:'9+',PV:'9',CD:'9+',CO:'9'},weapons:[]});
// noms identiques dans 2 factions
const cnt={};D.units.forEach(u=>(cnt[u.n]=cnt[u.n]||[]).push(u));const dup=Object.entries(cnt).find(([n,a])=>a.length>1&&new Set(a.map(x=>x._c)).size>1);
if(dup){sheet('dup',dup[0],dup[1][0],{fkw:'',kw:''})}
S.lists=[{id:'L1',name:'Armée test',units:[{ref:'fr1',size:10,pts:100,subs:[]},{ref:'fr2',size:5,pts:100,subs:[]}],dets:[],strats:[]}];
const before=JSON.stringify({c:S.coll,l:S.lists}),fr1Before=JSON.stringify(S.coll.fr1);
const res=BIBUNI({});await new Promise(r=>setTimeout(r,600));
const lb=S.lib;const out={res,dup:dup&&dup[0],l1:lb.links.fr1&&{id:lb.links.fr1.id===nw.id,st:lb.links.fr1.st},l2:lb.links.fr2&&lb.links.fr2.id===ai.id,l2not:lb.links.fr2&&lb.links.fr2.id===is.id,lz:!!lb.links.zz,ldup:dup?!!lb.links.dup:null,uncDup:dup?!!(lb.unc||{}).dup:null,
 nameNW:BIB.tName('Necron Warriors'),ns:BIBNS(nw),lsA:BIBLS('fr1'),lsU:BIBLS(dup?'dup':'zz'),
 sheetSame:(()=>{const a=JSON.parse(fr1Before),c=JSON.parse(JSON.stringify(S.coll.fr1));delete c.eqx;return JSON.stringify(a)===JSON.stringify(c)})(),
 listSame:JSON.stringify(S.lists)===JSON.stringify(JSON.parse(before).l),
 search:BIBAL('fr1'),blk:BIBUNIBLK(S.coll.fr1),lnk:BIBLNK({ref:'fr1'}),bk:!!lb.ubk};
return out});
console.log(JSON.stringify(R).slice(0,900));
ok('1. fiche de collection FR rapprochée automatiquement (Necron Warriors)',R.l1&&R.l1.id&&R.l1.st==='auto',R.l1);
ok('   nom français appris de la collection = confirmé',R.nameNW.st==='ok'&&R.nameNW.t==='Guerriers Nécrons',R.nameNW);
ok('   statut nom : Français confirmé',R.ns.k==='ok',R.ns);ok('   statut lien : confirmé automatiquement',R.lsA.k==='auto',R.lsA);
ok('2. unités différentes aux noms proches non fusionnées',R.l2===true&&R.l2not!==true,[R.l2,R.l2not]);
ok('3. fiche inconnue : aucun lien, aucune traduction inventée',R.lz===false,R.lz);
ok('4. noms identiques dans 2 factions : pas de fusion (incertain)',R.dup==null||(R.ldup===false&&R.uncDup===true),[R.dup,R.ldup,R.uncDup]);
ok('5. fiche personnelle inchangée (notes, équipement, stats)',R.sheetSame,R.sheetSame);
ok('6. listes d\'armées inchangées',R.listSame,R.listSame);
ok('7. recherche en anglais : le nom anglais est trouvé',/Necron Warriors/.test(R.search),R.search);
ok('8. sauvegarde faite avant la migration',R.bk,R.bk);
ok('9. bouton « Voir la fiche en anglais » dans Modifier',/Voir la fiche en anglais/.test(R.lnk)&&/Voir la fiche en anglais/.test(R.blk),R.lnk.slice(0,200));
ok('   statut incertain affiché',/incertaine|Aucune correspondance/.test(await ev(()=>BIBUNIBLK(S.coll[S.coll.dup?'dup':'zz']))),1);
// vue anglaise : ouverture, contenu, fermeture, aucune modification
const snap=await ev(()=>JSON.stringify({c:S.coll,l:S.lists,lib:S.lib}));
await ev(()=>document.querySelector('body').insertAdjacentHTML('beforeend','<button id="tb" data-uni="en" data-r="fr1"></button>'));await ev(()=>document.getElementById('tb').click());await p.waitForTimeout(300);
const en=await ev(()=>document.getElementById('bibe').innerText);ok('10. vue anglaise : nom, armes et capacités en anglais',/Necron Warriors/.test(en)&&/Gauss flayer/i.test(en)&&/Abilities/.test(en),en.slice(0,200));
await ev(()=>document.querySelector('#bibe [data-uni="close"]').click());await p.waitForTimeout(200);
const after=await ev(()=>JSON.stringify({c:S.coll,l:S.lists,lib:S.lib}));const closed=await ev(()=>document.getElementById('bibe').innerHTML==='');
ok('11. fermeture : retour à la fiche, rien de modifié',closed&&after===snap,[closed,after===snap]);
// correction du nom français puis restauration
await ev(()=>{const i=document.createElement('input');i.id='uninm';i.value='Guerriers Nécrons (corrigé)';document.body.appendChild(i);const bt=document.createElement('button');bt.id='sv';bt.dataset.uni='savenm';bt.dataset.r='fr1';document.body.appendChild(bt);bt.click()});await p.waitForTimeout(200);
ok('12. correction manuelle du nom français',await ev(()=>BIB.tName('Necron Warriors').t==='Guerriers Nécrons (corrigé)'),1);
const rs=await ev(async()=>{const ok=await BIBUNIRESTORE('first');return{ok,links:Object.keys(S.lib.links).length,hasFr1:!!S.coll.fr1,lists:S.lists.length}});
ok('13. restauration de la sauvegarde',rs.ok&&rs.links===0&&rs.hasFr1===true&&rs.lists===1,rs);
await b.close()})();
