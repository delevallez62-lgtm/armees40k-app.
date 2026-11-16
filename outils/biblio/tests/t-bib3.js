const {chromium}=require('playwright');const fs=require('fs');
const st=JSON.parse(fs.readFileSync(__dirname+'/etat.json','utf8'));
const mk=(ref,name,stats,weapons,apt,kw)=>({ref,name,pts:0,nb:0,stats,weapons,equip:'',apt:apt||'',kw:kw||'',fkw:'',text:[],subs:[]});
const W=(n,r,a,h,f,pa,d,c)=>({name:n,range:r,a,hit:h,f,pa,d,caps:c||''});
st.coll.rsm1=mk('rsm1','space marine intercessor',{M:'6',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},[W('Fusil bolter','24','2','3+','4','-1','1'),W('Pistolet bolter','12','1','3+','4','0','1','Pistolet'),W('Arme de mêlée','Mêlée','3','3+','4','0','1')],'Tir de barrage','Infanterie');
st.coll.rork1=mk('rork1','boyz',{M:'6',E:'5',SV:'5+',PV:'',CD:'7+',CO:'2'},[W("Fling'",'18','2','5+','4','0','1','Tir rapide 1')],'Waaagh!','Infanterie, Orks');
st.lists[0].units.push({ref:'rork1',name:'boyz',size:10,pts:85,subs:[],stats:st.coll.rork1.stats,weapons:clone(st.coll.rork1.weapons),equip:'',apt:'',kw:'',fkw:'',text:[]});
function clone(o){return JSON.parse(JSON.stringify(o))}
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
await ctx.addInitScript(s=>{if(!sessionStorage.getItem('x')){localStorage.setItem('armees40k',s);sessionStorage.setItem('x',1)}},JSON.stringify(st));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
const o={};
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true});
o.init=await p.evaluate(async()=>{const D=await BIB.init();return{ready:D.ready,err:D.err,units:D.units.length,dets:D.dets.length,str:D.str.length,enh:D.enh.length,v:D.man.version,origin:D.origin}});
// séparation : la bibliothèque est dans IndexedDB, pas dans S / localStorage
o.sep=await p.evaluate(()=>({inS:JSON.stringify(S).length<3000000&&!/Intercessor Squad/.test(JSON.stringify(S)),ls:(localStorage.getItem('armees40k')||'').includes('Intercessor Squad')}));
// symbole : collection seulement
await p.evaluate(()=>{tab='coll';draw()});await p.waitForTimeout(500);
o.collBtns=await p.evaluate(()=>document.querySelectorAll('.tile .bibb').length);
await p.evaluate(()=>{tab='lists';draw()});await p.waitForTimeout(300);o.listsBtns=await p.evaluate(()=>document.querySelectorAll('.bibb').length);
await p.evaluate(()=>{S.cur=S.lists[0].id;tab='units';draw()});await p.waitForTimeout(300);o.unitsBtns=await p.evaluate(()=>document.querySelectorAll('.bibb').length);
// suggestions
o.sug=await p.evaluate(()=>{const f=n=>BIB.suggest(Object.values(S.coll).find(m=>m.name===n)).map(x=>x.u.n+'('+x.sc.toFixed(2)+')');return{necron:f('immortels').concat(Object.values(S.coll).filter(m=>/guerrier/i.test(m.name)).map(m=>BIB.suggest(m).length)),marine:f('space marine intercessor'),boyz:f('boyz')}});
console.log(JSON.stringify(o,null,1));

const snap=()=>p.evaluate(()=>JSON.stringify({coll:Object.keys(S.coll).length,lists:S.lists.map(l=>l.units.map(u=>u.name+':'+u.weapons.length)),boyz:S.coll.rork1,ic:S.coll.rsm1}));
const before=await snap();
// rapprochement Boyz via le symbole
await p.evaluate(()=>{tab='coll';draw()});await p.waitForTimeout(300);
await p.evaluate(()=>(()=>{const b=document.createElement('button');b.dataset.bib='open';b.dataset.r='rork1';document.body.appendChild(b);b.click();b.remove()})());await p.waitForTimeout(600);
console.log('suggestions Boyz:',await p.evaluate(()=>[...document.querySelectorAll('#bibsr .bib-row b')].map(x=>x.innerText).join(' | ')));await p.screenshot({path:'bib-link.png'});
await p.evaluate(()=>document.querySelector('#bibsr [data-bib="cmp"]').click());await p.waitForTimeout(700);
console.log('cmp titre:',await p.evaluate(()=>document.querySelector('#bibm .bib-pn p').innerText));

const cmp=await p.evaluate(()=>[...document.querySelectorAll('#bibm .bib-pn h4')].map(h=>h.innerText+' → '+(h.nextElementSibling?h.nextElementSibling.innerText.slice(0,90).replace(/\n/g,' / '):'')));
console.log(cmp.join('\n'));await p.screenshot({path:'bib-cmp.png'});
// rien n'a changé avant validation
console.log('avant validation inchangé:',(await snap())===before);
// valider
await p.evaluate(()=>document.querySelector('[data-bib="apply"]').click());await p.waitForTimeout(600);
const after=JSON.parse(await snap());const b0=JSON.parse(before);
console.log('Boyz après:',JSON.stringify({stats:after.boyz.stats,nweap:after.boyz.weapons.length,w0:after.boyz.weapons[0],apt:after.boyz.apt,kw:after.boyz.kw,txt:after.boyz.text.length}).slice(0,700));
console.log('Fling conservé tel quel:',JSON.stringify(after.boyz.weapons[0])===JSON.stringify(b0.boyz.weapons[0]),'| nb fiches coll:',b0.coll===after.coll,'| listes inchangées:',JSON.stringify(b0.lists)===JSON.stringify(after.lists));
console.log('lien:',await p.evaluate(()=>JSON.stringify(S.lib.links.rork1)));

// ===== traduction =====
console.log('traduction:',JSON.stringify(await p.evaluate(()=>({
 kw:['Rapid Fire 2','Anti-Infantry 3+','Lethal Hits: non-Monster/Vehicle','Sustained Hits D3','Melta 2','Close-quarters','Frobnicate'].map(x=>BIB.tWK(x).t+'/'+BIB.tWK(x).st),
 uk:['Infantry','Character','Battleline','Tacticus'].map(x=>BIB.tKW(x).t+'/'+BIB.tKW(x).st),
 ab:['Deep Strike','Feel No Pain 5+','Deadly Demise D3','Firing Deck 12','Waaagh!'].map(x=>BIB.tAB(x).t+'/'+BIB.tAB(x).st),
 nm:BIB.tName('Intercessor Squad').st}))));
// ===== synchro différentielle (source simulée) =====
const sync=async(dir)=>p.evaluate(async d=>{S.lib.src='http://localhost:8766/'+d+'/';const before=JSON.stringify(S.lib.links);const r=await BIB.checkUpdate(true);return{state:r.state,err:r.err,news:r.news?{add:r.news.items.add.map(x=>x.t+' '+x.n),chg:r.news.items.chg.map(x=>x.t+' '+x.n),stale:r.news.stale}:null,ver:BIB.D.man.version,units:BIB.D.units.length,linksKept:JSON.stringify(S.lib.links).length>10,staleFlag:S.lib.links.rork1&&S.lib.links.rork1.stale}},dir);
console.log('1) source corrompue :',JSON.stringify(await sync('bad')));
console.log('   après refus, version inchangée & intégrité :',await p.evaluate(async()=>({v:BIB.D.man.version,bad:await BIB.verify(),u:BIB.D.units.length})));
console.log('2) mise à jour valide :',JSON.stringify(await sync('v2')));
console.log('   rapprochement Boyz conservé, fiche perso intacte :',await p.evaluate(()=>({link:!!S.lib.links.rork1,fling:S.coll.rork1.weapons[0].name,kw:S.coll.rork1.kw.slice(0,30)})));
console.log('3) relance (déjà à jour) :',JSON.stringify(await sync('v2')));
console.log('   intégrité :',await p.evaluate(async()=>(await BIB.verify()).length===0));
await p.evaluate(()=>{tab='bib';draw()});await p.waitForTimeout(500);console.log('   nouveautés affichées:',await p.evaluate(()=>/Nouveautés/.test(document.querySelector('main').innerText)));await p.screenshot({path:'bib-news.png'});
await p.evaluate(()=>{tab='home';draw()});await p.waitForTimeout(400);console.log('   bandeau accueil:',await p.evaluate(()=>!!document.querySelector('.bib-ban')));
// sauvegarde / restauration / version précédente
const exp=await p.evaluate(async()=>{const t=await BIB.exportLib();return{len:t.length,ok:JSON.parse(t).kind}});console.log('export:',JSON.stringify(exp));
console.log('restauration version précédente :',await p.evaluate(async()=>{const m=await import('data:text/javascript,0').catch(()=>0);document.querySelector('body');return 'voir ci-dessous'}));
console.log('import d\'un fichier invalide refusé :',await p.evaluate(async()=>{try{await BIB.importLib('{"kind":"autre"}');return 'ACCEPTÉ'}catch(e){return e.message}}));
console.log('import d\'une sauvegarde altérée refusé :',await p.evaluate(async()=>{const o=JSON.parse(await BIB.exportLib());o.chunks.orks=o.chunks.orks.slice(0,-3)+'xyz';try{await BIB.importLib(JSON.stringify(o));return 'ACCEPTÉ'}catch(e){return e.message}}));

// version précédente + annulation des ajouts
console.log('version précédente :',await p.evaluate(async()=>{const v0=BIB.D.man.version;await BIB.verify();const o=await new Promise(ok=>{const r=indexedDB.open('hammer-biblio',1);r.onsuccess=()=>{const t=r.result.transaction('prev','readonly').objectStore('prev').getAll();t.onsuccess=()=>ok(t.result.map(x=>x.id))}});return{v0,prevChunks:o}}));
await p.evaluate(()=>{tab='coll';draw()});await p.waitForTimeout(300);
const w0=await p.evaluate(()=>S.coll.rork1.weapons.length);
await p.evaluate(()=>(()=>{const b=document.createElement('button');b.dataset.bib='open';b.dataset.r='rork1';document.body.appendChild(b);b.click();b.remove()})());await p.waitForTimeout(500);
console.log('lien actuel signalé « a changé » :',await p.evaluate(()=>/a changé/.test(document.querySelector('#bibm').innerText)));
await p.evaluate(()=>document.querySelector('[data-bib="unlink"]').click());await p.waitForTimeout(400);
console.log('dialogue défaire:',await p.evaluate(()=>(document.querySelector('#dg')||{}).innerText.slice(0,120).replace(/\n/g,' ')));
await p.evaluate(()=>document.querySelector('#dg [data-act="dgalt"]').click());await p.waitForTimeout(500);
console.log('armes',w0,'→',await p.evaluate(()=>S.coll.rork1.weapons.length),'| lien supprimé:',await p.evaluate(()=>!S.lib.links.rork1),'| Fling conservé:',await p.evaluate(()=>S.coll.rork1.weapons[0].name));
console.log(errs);await b.close()})();
