const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const D=BIB.D,ts=D.units.find(x=>x.n==='Terminator Squad'),st={M:'5',E:'5',SV:'2+',PV:'3',CD:'6+',CO:'1'};
 const W=(n,r,a,h,f,pa,d)=>({name:n,range:r,a,hit:h,f,pa,d,caps:''});
 // unité « importée » : liée à la bibliothèque, sans configuration du constructeur, équipement illégal (3 armes spéciales pour 5)
 S.coll={rt:{ref:'rt',name:'Terminators',stats:st,weapons:[W('Bolter d assaut','24"','2','3+','4','0','1'),W('Canon d assaut','24"','6','3+','6','-1','1'),W('Lance-flammes lourd','12"','D6','N/A','5','-1','1')],equip:'5 × Bolter d assaut ; 5 × Poing énergétique ; 2 × Canon d assaut ; 1 × Lance-flammes lourd',apt:'',text:[],kw:'Infanterie',fkw:'',pts:190,nb:0,subs:[]}};
 BIB.LB().links.rt={id:ts.id,h:ts.h,v:'x',at:1,prof:0,applied:[],stale:false};
 S.lists=[{id:'li',name:'Liste importée',dets:[],strats:[],units:[{name:'Terminators',ref:'rt',size:5,pts:190,stats:st,weapons:[W('Bolter d assaut','24"','2','3+','4','0','1'),W('Canon d assaut','24"','6','3+','6','-1','1')],equip:'5 × Bolter d assaut ; 5 × Poing énergétique ; 2 × Canon d assaut ; 1 × Lance-flammes lourd',subs:[]}]}];
 S.cur='li';tab='units';draw()});await wait(500);
const card=await ev(()=>{const b=document.querySelector('[data-eqc="0"]');return b?{t:b.innerText,cls:b.className,title:b.title}:null});
ok('carte de l’unité importée : bouton équipement avec statut ❌',card&&/❌/.test(card.t),card);
await p.screenshot({path:'eq6a.png'});
await ev(()=>document.querySelector('[data-eqc="0"]').click());await wait(500);
ok('le configurateur ＋/− s’ouvre sur l’unité de la liste',await ev(()=>!!document.querySelector('#bldm .bld-pr')&&/Équipement/.test(document.getElementById('bldm').innerText)),await ev(()=>document.getElementById('bldm').innerText.slice(0,120)));
ok('configuration reconstituée légale (pas d’erreur)',await ev(()=>/Équipement conforme/.test(document.getElementById('bldm').innerText)),1);
await ev(()=>{const d=document.querySelector("#bldm details[data-figq]");if(d)d.open=true});await wait(300);
ok('2 armes spéciales d’emblée impossibles (max 1 pour 5) : ＋ bloqué',await ev(()=>{const r=[...document.querySelectorAll('#bldm .bld-pr')].find(r=>/canon d.assaut/i.test(r.innerText)||/lance-flammes/i.test(r.innerText));return r&&r.querySelector('button[data-d="1"]').disabled}),1);
// − sur l'arme déjà placée puis ＋ sur une autre
await ev(()=>{const rs=[...document.querySelectorAll('#bldm .bld-pr')].filter(r=>/canon d.assaut|lance-flammes|cyclone/i.test(r.innerText)&&+r.querySelector('.bld-st b').innerText>0);if(rs[0])rs[0].querySelector('button[data-d="-1"]').click()});await wait(250);
await ev(()=>{const r=[...document.querySelectorAll('#bldm .bld-pr')].find(r=>/tron|chainfist/i.test(r.innerText));r.querySelector('button[data-d="1"]').click()});await wait(250);
await p.screenshot({path:'eq6b.png'});
await ev(()=>{const x=[...document.querySelectorAll('#bldm button')].find(x=>/Enregistrer|Ajouter à l.armée/.test(x.innerText));x.click()});await wait(500);
const u=await ev(()=>{const u=S.lists[0].units[0];return{pts:u.pts,equip:u.equip,old:u.equipOld,hasCfg:!!u.cfg&&!!u.cfg.figs,weapons:u.weapons.length,bld:!!S.lists[0].bld,pm:u.pm}});
ok('après enregistrement : équipement mis à jour, points conservés',u.pts===190&&u.hasCfg&&/× /.test(u.equip),u);
ok('profils d’armes conservés et ancien équipement sauvegardé',u.weapons===2&&/Canon d.assaut/.test(u.old||''),u);
ok('liste d’armée simple : pas de réglages de constructeur ajoutés',u.bld===false,u);
await p.screenshot({path:'eq6c.png'});
const st=await ev(()=>BIBLCK.unitStatus(S.lists[0].units[0]));
ok('statut de l’unité : conforme',st.s==='ok',st);
// fiche d'unité depuis la liste
await ev(()=>{document.querySelector('.card.hv').click()});await wait(400);
ok('fiche : bouton ⚙ Équipement',await ev(()=>!!document.querySelector('#md [data-eqf]')),await ev(()=>document.querySelector('#md')&&document.querySelector('#md').innerText.slice(0,80)));
await ev(()=>{const b=document.querySelector('#md [data-act="edt"]');b&&b.click()});await wait(300);
ok('fiche en modification : plus d’ajout/suppression d’arme (règles de la fiche)',await ev(()=>!document.querySelector('#md [data-act="addw"]')&&!document.querySelector('#md [data-act="delw"]')&&!!document.querySelector('#md [data-eqf]')),await ev(()=>!!document.querySelector('#md [data-act="addw"]')));
// après l'import : le choix des armes ouvre le configurateur ＋/− (unité liée à la bibliothèque)
await ev(()=>{const x=window.__EDX;x.close();draw()});await wait(200);
await ev(()=>{S.lists[0].units[0].cfg=null;S.lists[0].units[0].equip='5 × Bolter d assaut ; 5 × Poing énergétique';tab='units';draw()});await wait(300);
const opened=await ev(()=>WPK.ask('rt',false));await wait(600);
ok('après l\'import : le choix d\'armes ouvre le configurateur ＋/−',opened===true&&await ev(()=>!!document.querySelector('#bldm .bld-pr')),opened);
await ev(()=>{const x=[...document.querySelectorAll('#bldm button')].find(x=>/^✕$/.test(x.innerText.trim()));x&&x.click()});await wait(300);
ok('fermer sans enregistrer : rien n\'a changé, pas de réglages de constructeur',await ev(()=>!S.lists[0].bld&&!S.lists[0].units[0].cfg),1);
await b.close()})();
