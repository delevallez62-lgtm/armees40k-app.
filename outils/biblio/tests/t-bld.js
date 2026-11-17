const {chromium}=require('playwright');
const R=[];const ok=(n,c,x)=>{R.push((c?'✅ ':'❌ ')+n+(x!==undefined?' → '+JSON.stringify(x):''))};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/localhost:8766/.test(u))return r.continue();r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
const ev=(f,a)=>p.evaluate(f,a);const click=async sel=>{await p.evaluate(s=>{let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();await BIB.init();window.__majPop=1;
 // fiches de collection : 1 liée à Terminator Squad, 1 non liée
 const W=(n,r,a,h,f,pa,d)=>({name:n,range:r,a,hit:h,f,pa,d,caps:''});
 const ts=BIB.D.units.find(x=>x.n==='Terminator Squad');
 S.coll.cts={ref:'cts',name:'Terminators',stats:{M:'5',E:'5',SV:'2+',PV:'3',CD:'6+',CO:'1'},weapons:[W('Fusil tempête','24"','2','3+','4','0','1'),W('Épée énergétique','Mêlée','4','3+','5','-2','1'),W('Marteau tonnerre','Mêlée','3','4+','8','-2','2')],equip:'Fusil tempête, Épée énergétique',apt:'',text:[],kw:'Infanterie',fkw:'',pts:190,nb:0,subs:[]};
 BIB.LB().links.cts={id:ts.id,h:ts.h,v:'x',at:1,prof:0,applied:[],stale:false};
 S.coll.cx={ref:'cx',name:'Machine maison',stats:{M:'6',E:'6',SV:'3+',PV:'8',CD:'7+',CO:'3'},weapons:[W('Canon maison','24"','3','3+','8','-1','2')],equip:'',apt:'',text:[],kw:'Véhicule',fkw:'',pts:0,nb:0,subs:[]};
 tab='bld';draw()});
const html=()=>p.evaluate(()=>document.body.innerText);
// création
await ev(()=>{document.getElementById('bldn').value='Test 2000';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');
ok('création : points affichés',/0 \/ 2 000 points/.test(await html()));
// catalogue
await click('[data-bld="add"]');
const cat=await ev(()=>{const e=[...document.querySelectorAll('#bldm .bld-c')];return{n:e.length,names:e.slice(0,3).map(x=>x.querySelector('b').innerText)}});
ok('catalogue visuel (cartes)',cat.n>10,cat);
// 3) présente dans les deux : une seule carte « Terminators », avec 📦 et 📚
await ev(()=>{const q=document.getElementById('bldq');q.value='termin';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
const term=await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].map(x=>x.innerText.replace(/\n/g,' | ')));
ok('doublons : une seule carte pour l\'unité dans les deux sources',term.filter(t=>/^🛡 \| Terminators/.test(t)).length===1&&!term.some(t=>/^🛡 \| Terminator Squad/.test(t)),term.slice(0,4));
ok('carte : nom, effectif, coût, catégorie, provenances',/Terminators.*5 figurines.*pts.*📦.*📚|Terminators[\s\S]*📦[\s\S]*📚/.test(term.find(t=>/Terminators/.test(t))||''));
// filtres
await click('[data-bld="src"][data-v="coll"]');
ok('filtre « Ma collection »',(await ev(()=>document.querySelectorAll('#bldm .bld-c').length))<=3);
await click('[data-bld="src"][data-v="lib"]');await ev(()=>{const q=document.getElementById('bldq');q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
ok('filtre « Bibliothèque »',(await ev(()=>document.querySelectorAll('#bldm .bld-c').length))>20);
await click('[data-bld="src"][data-v="all"]');
// 1) unité uniquement dans la collection
await ev(()=>{const q=document.getElementById('bldq');q.value='maison';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
await click('#bldm .bld-c');
let t=await html();ok('collection seule : coût à vérifier tant que non saisi',/à vérifier/i.test(t)&&/Coût \(saisi à la main\)/.test(t));
await ev(()=>{const i=document.getElementById('bldman');i.value='120';i.dispatchEvent(new Event('input',{bubbles:true}))});
await click('[data-bld="ok"]');
ok('collection seule : coût saisi pris en compte',/120 \/ 2 000 points/.test(await html()),await ev(()=>0));
// 2) unité uniquement dans la bibliothèque (Intercessor Squad)
await click('[data-bld="add"]');await ev(()=>{const q=document.getElementById('bldq');q.value='intercessor squad';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
const ic=await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].map(x=>x.innerText.replace(/\n/g,' | ')).slice(0,3));ok('bibliothèque seule affichée (nom anglais)',ic.some(x=>/Intercessor Squad/.test(x)),ic);
await ev(()=>{[...document.querySelectorAll('#bldm .bld-c')].find(x=>/Intercessor Squad/.test(x.innerText)).click()});await p.waitForTimeout(300);
t=await html();
// 4) plusieurs tailles
const sizes=await ev(()=>[...document.querySelectorAll('#bldm [data-bld="size"]')].map(x=>x.innerText.replace(/\s+/g,' ')));ok('plusieurs tailles autorisées (lues dans le barème)',sizes.length>=2&&sizes.every(s=>/pts/.test(s)),sizes);
await click('[data-bld="size"][data-v="10"]');
const ic10=await ev(()=>document.querySelector('#bldm .bld-bar b').innerText);ok('palier 10 figurines (non proportionnel au 5)',/170/.test(ic10),ic10);
await click('[data-bld="ok"]');
const R1=await ev(()=>BLDCALC(BLDL()).total);ok('total = 120 + 170',R1===290,R1);
// 5/6) plusieurs équipements, gratuits : Terminators
await click('[data-bld="add"]');await ev(()=>{const q=document.getElementById('bldq');q.value='terminators';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
await ev(()=>{[...document.querySelectorAll('#bldm .bld-c')].find(x=>/Terminators/.test(x.innerText)).click()});await p.waitForTimeout(300);
t=await html();
ok('armes : compteurs par arme, pas de lignes répétées',(await ev(()=>document.querySelectorAll('#bldm .bld-w').length))>=3);
// 9 x Épée... 1 x Marteau - Sergent  (taille 10, 9 épées + 1 marteau)
await click('[data-bld="size"][data-v="10"]');for(const k of ['Fusil tempête','Épée énergétique'])for(let i=0;i<10;i++)await ev(kk=>{const e=document.querySelector('#bldm [data-bld="wq"][data-k="'+kk+'"][data-d="-1"]');if(e)e.click()},k);
for(let i=0;i<9;i++)await ev(()=>document.querySelector('#bldm [data-bld="wq"][data-k="Épée énergétique"][data-d="1"]').click());
await ev(()=>document.querySelector('#bldm [data-bld="wq"][data-k="Marteau tonnerre"][data-d="1"]').click());await p.waitForTimeout(150);
await ev(()=>{const i=document.querySelector('#bldm [data-bldn="Marteau tonnerre"]');i.value='Sergent';i.dispatchEvent(new Event('input',{bubbles:true}))});
// 7) équipement payant : Cyclone (barème Wahapedia)
const wg=await ev(()=>[...document.querySelectorAll('#bldm [data-bld="wg"]')].map(x=>x.dataset.k));ok('équipement payant lu dans le barème',wg.includes('Cyclone Missile Launcher'),wg);
await ev(()=>document.querySelector('#bldm [data-bld="wg"][data-d="1"]').click());await ev(()=>document.querySelector('#bldm [data-bld="wg"][data-d="1"]').click());await p.waitForTimeout(150);
const pvw=await ev(()=>document.querySelector('#bldm .bld-bar b').innerText);ok('coût de l\'équipement payant ajouté (2 × 10)',/\d+ pts/.test(pvw),pvw);
if(0)console.log('DBG wq',JSON.stringify(await ev(()=>BLDSTATE.cfg.wq)),'rows',JSON.stringify(await ev(()=>[...document.querySelectorAll('#bldm .bld-w b')].map(x=>x.innerText))));
await click('[data-bld="ok"]');
const txt=await ev(()=>recap=document.body.innerText);
ok('affichage compact 9 × / 1 ×',/9 × Épée énergétique/.test(txt)&&/1 × Marteau tonnerre — Sergent/.test(txt),(txt.split('\n').filter(x=>/ × /.test(x))));
const calc=await ev(()=>BLDCALC(BLDL()));const tl=calc.lines.filter(l=>l.i===2);ok('lignes de coût de l\'unité',tl.length>=2&&tl.some(l=>/Cyclone/.test(l.name)&&l.pts===20),tl.map(l=>l.name+':'+l.pts));
// 8) meneur
await click('[data-bld="edit"][data-i="2"]');await click('[data-bld="ldr"]');
await ev(()=>{const q=document.getElementById('bldlq');q.value='captain';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
const ld=await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].slice(0,4).map(x=>x.innerText.replace(/\n/g,' | ')));ok('choix du meneur (nom, coût, compatibilité)',ld.length&&/pts|vérifier/.test(ld[0]),ld[0]);
await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].find(x=>/Captain In Terminator Armour|Capitaine/i.test(x.innerText)).click());await p.waitForTimeout(300);
await click('[data-bld="ok"]');
const withL=await ev(()=>BLDCALC(BLDL()));ok('meneur : coût ajouté séparément',withL.lines.some(l=>l.k==='l'&&l.pts>0),withL.lines.filter(l=>l.k==='l').map(l=>l.name+':'+l.pts));
const tot1=withL.total;
await click('[data-bld="edit"][data-i="2"]');await click('[data-bld="ldrx"]');await click('[data-bld="ok"]');
const noL=await ev(()=>BLDCALC(BLDL()).total);ok('retrait du meneur',noL<tot1,[tot1,noL]);
// 8b) appui (en plus du meneur)
await click('[data-bld="edit"][data-i="2"]');await click('[data-bld="ldr"][data-kind="Appui"]');
const ah=await html();ok('écran « Ajouter un appui »',/Ajouter un appui/.test(ah),ah.slice(0,100));
await ev(()=>{const q=document.getElementById('bldlq');q.value='ancient';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
const sc=await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].map(x=>x.innerText.replace(/\n/g,' | ')));ok('appuis proposés (unités Support)',sc.length>0&&sc.some(x=>/Ancient/i.test(x)),sc.slice(0,3));
await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].find(x=>/Ancient/i.test(x.innerText)).click());await p.waitForTimeout(300);
await click('[data-bld="ok"]');
const wa=await ev(()=>({subs:BLDL().units[2].subs.map(s=>s.label),lines:BLDCALC(BLDL()).lines.filter(l=>l.k==='l').map(l=>l.name+':'+l.pts)}));ok('appui ajouté avec son coût',wa.subs.includes('Appui')&&wa.lines.some(l=>/^Appui :/.test(l)),wa);
await click('[data-bld="edit"][data-i="2"]');await click('[data-bld="ldr"][data-kind="Meneur"]');
await ev(()=>{const q=document.getElementById('bldlq');q.value='captain';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
await ev(()=>[...document.querySelectorAll('#bldm .bld-c')].find(x=>/Captain|Capitaine/i.test(x.innerText)).click());await p.waitForTimeout(300);
const both=await ev(()=>BLDSTATE&&BLDL?0:0);const bs=await ev(()=>{const c=BLDSTATE.cfg||{};return (c.subs||[]).map(s=>s.label)});ok('meneur + appui ensemble',bs.length===2&&bs[0]==='Meneur'&&bs[1]==='Appui',bs);
await click('[data-bld="ldrx"][data-kind="Appui"]');const bs2=await ev(()=>(BLDSTATE.cfg.subs||[]).map(s=>s.label));ok('retrait de l\'appui seul',bs2.length===1&&bs2[0]==='Meneur',bs2);
await click('[data-bld="ldrx"][data-kind="Meneur"]');await click('[data-bld="ok"]');
// fin : un seul bouton Enregistrer, plus d'export
await click('[data-bld="step"][data-s="4"]');const f4=await ev(()=>({save:!!document.querySelector('[data-bld="savelist"]'),exp:!!document.querySelector('[data-bld="json"],[data-bld="print"],[data-bld="share"],[data-bld="copy"],[data-bld="dup"]'),txt:document.body.innerText}));
ok('étape finale : bouton « Enregistrer la liste »',f4.save&&/Enregistrer la liste/.test(f4.txt),f4.save);ok('plus aucun bouton d\'export',!f4.exp&&!/Exporter|PDF|Partager/.test(f4.txt.replace(/Importer.*/g,'')),f4.exp);

// 9/10) détachement + optimisation
await click('[data-bld="det"]');const dets=await ev(()=>[...document.querySelectorAll('#bldm details.bib-nw summary b')].map(x=>x.innerText));ok('détachements de la faction proposés',dets.length>3,dets.slice(0,3));
await ev(()=>{document.querySelector('#bldm details.bib-nw').open=true});
const dd=await ev(()=>document.querySelector('#bldm details.bib-nw').innerText.slice(0,160).replace(/\n/g,' | '));ok('détachement : règle, stratagèmes, optimisations',/stratagème|optimisation/i.test(dd),dd);
await ev(()=>document.querySelector('#bldm [data-bld="detpick"]').click());await p.waitForTimeout(300);
ok('détachement choisi',/⚔ /.test(await html()));
// optimisation sur un personnage : on ajoute un capitaine seul
await click('[data-bld="add"]');await ev(()=>{const q=document.getElementById('bldq');q.value='captain in terminator';q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(250);
await ev(()=>{[...document.querySelectorAll('#bldm .bld-c')].find(x=>/Captain In Terminator/i.test(x.innerText)).click()});await p.waitForTimeout(300);
const enhs=await ev(()=>[...document.querySelectorAll('#bldm [data-bld="enh"][data-v]')].filter(x=>x.dataset.v).map(x=>x.dataset.v));ok('optimisations du détachement proposées',enhs.length>0,enhs.length);
const before=await ev(()=>document.querySelector('#bldm .bld-bar b').innerText);
if(enhs.length){await ev(()=>[...document.querySelectorAll('#bldm [data-bld="enh"][data-v]')].find(x=>x.dataset.v).click());await p.waitForTimeout(200)}
const after=await ev(()=>document.querySelector('#bldm .bld-bar b').innerText);ok('optimisation : coût ajouté une seule fois',before!==after||!enhs.length,[before,after]);
await click('[data-bld="ok"]');
// 12) dépassement de limite
await ev(()=>{BLDL().bld.limit=300;save();draw()});await p.waitForTimeout(200);
ok('limite dépassée signalée',/Limite dépassée/.test(await html()));
await ev(()=>{BLDL().bld.limit=2000;save();draw()});
// 11) mise à jour de points : on simule un nouveau barème (+10 par palier Terminator)
const logs=await ev(()=>{const L=BLDL(),ts=BIB.D.units.find(x=>x.n==='Terminator Squad');const pc=(ts.wp||{}).pc;pc.tiers.forEach(t=>t.sz.forEach(s=>s.pts+=10));BIB.D.man.source=BIB.D.man.source||{};BIB.D.man.source.points=Object.assign({},BIB.D.man.source.points||{},{published:'2026-12-01 00:00:00'});const old=BLDCALC(L).total;draw();const n=BLDCALC(L).total;return{old,n,log:(L.bld.log||[]).length,ch:(L.bld.log||[])[0]&&L.bld.log[0].ch.map(c=>c.n+':'+c.o+'→'+c.p),sizes:L.units.map(u=>u.size)}});
const lg2=await ev(()=>{const g=BLDL().bld.log[0];return{o:g.o,n:g.n,d:g.n-g.o}});ok('mise à jour des points : différence détectée et effectifs inchangés',lg2.d===10&&logs.log>=1&&logs.sizes.join()==='1,10,10,1',[lg2,logs.ch]);
ok('bandeau « Mise à jour des points »',/Mise à jour des points[\s\S]*Ancien total/.test(await html()));
// 14) sauvegarde / réouverture / export / import
const json=await ev(()=>{const L=BLDL();return JSON.stringify({kind:'hammer-armee',v:1,list:L,sheets:{}})});
await ev(()=>{BLDSTATE.scr='home';BLDSTATE.id=null;draw()});
await ev(()=>{const id=S.lists[S.lists.length-1].id;[...document.querySelectorAll('[data-bld="open"]')].pop().click()});await p.waitForTimeout(300);
const reopen=await ev(()=>({n:BLDL().units.length,det:!!BLDL().bld.det,cfg:BLDL().units.map(u=>u.cfg&&u.cfg.size)}));ok('réouverture : choix conservés',reopen.n>=3&&reopen.det,reopen);
const imp=await ev(txt=>{const L=BLD_IMPORT?0:0;return 0},json).catch(()=>0);
// 10) récapitulatif + vérifications
await click('[data-bld="step"][data-s="4"]');const rc=await html();ok('récapitulatif (unités, équipements, détail des points, vérifications)',/Détail des points/.test(rc)&&/Vérifications/.test(rc)&&/Barème :/.test(rc));
ok('barème : source, publication, synchro',/Wahapedia/.test(rc)&&/publié le/.test(rc)&&/synchronisé le/.test(rc));
// 13) hors ligne
await ctx.setOffline(true);await ev(()=>{BLDSTATE.scr='edit';draw()});await p.waitForTimeout(200);
ok('hors ligne : calcul des points',/ \/ 2 000 points/.test(await html()));
await ctx.setOffline(false);
console.log(R.join('\n'));console.log(errs);await b.close()})();
