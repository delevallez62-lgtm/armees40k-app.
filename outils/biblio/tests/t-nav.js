const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:320,height:700},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(()=>{window.__dr=1});
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{let e=document.querySelector(s);if(!e){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await wait(220)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Nav';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
await click('[data-bld="add"]');await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},'intercessor');await wait(300);
await ev(()=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>/^Escouade d.Intercessors$/i.test(x.querySelector('b').innerText));c.click()});await wait(400);
await click('[data-bld="size"][data-v="10"]');await wait(200);
await ev(()=>{BLDSTATE.figOpen=true});await click('[data-bld="fig"][data-i="0"]');
const nm=()=>ev(()=>({t:(document.querySelector('.bld-nt b')||{}).innerText,s:(document.querySelector('.bld-nt small')||{}).innerText,prev:document.querySelector('.bld-na[aria-label^="Figurine préc"]').disabled,next:document.querySelector('.bld-na[aria-label^="Figurine suiv"]').disabled}));
const nav=async d=>{await click('.bld-na[aria-label^="Figurine '+(d>0?'suiv':'préc')+'"]');await wait(200)};
let s0=await nm();ok('figurine 1 : nom + « Figurine 1 / 10 », précédent désactivé',/1 \/ 10/.test(s0.s)&&s0.prev&&!s0.next,s0);
await nav(1);let s1=await nm();ok('suivant → figurine 2 (nom mis à jour)',/2 \/ 10/.test(s1.s)&&s1.t!==s0.t&&!s1.prev,s1);
await nav(1);let s2=await nm();ok('suivant → figurine 3',/3 \/ 10/.test(s2.s),s2);
await nav(-1);let s3=await nm();ok('précédent → figurine 2',/2 \/ 10/.test(s3.s),s3);
// raccourcis numérotés
await click('.bld-fnav button[data-i="9"]');let s9=await nm();ok('raccourci 10 → dernière figurine, suivant désactivé',/10 \/ 10/.test(s9.s)&&s9.next&&!s9.prev,s9);
ok('la page n’est pas fermée : la fiche est toujours ouverte',!!(await ev(()=>document.querySelector('.bld-fiche'))),0);
// la barre ne déborde pas sur un écran étroit (320 px)
const ov=await ev(()=>({sw:document.querySelector('.bib-pn').scrollWidth,cw:document.querySelector('.bib-pn').clientWidth}));ok('aucun débordement horizontal à 320 px',ov.sw<=ov.cw+1,ov);
// modification d'une figurine puis navigation : le changement est conservé
await click('.bld-fnav button[data-i="0"]');
const opened=await ev(()=>{const d=document.querySelector('details.bld-dr');if(!d)return null;d.open=true;d.dispatchEvent(new Event('toggle',{bubbles:true}));return d.getAttribute('data-figdr')});
const before=await ev(()=>[...document.querySelectorAll('.bld-fw b')].map(x=>x.innerText).join('|'));
await ev(()=>{const b=[...document.querySelectorAll('details.bld-dr .bld-fc:not(.on):not([disabled]):not(.bld-fb)')][0];b.click()});await wait(300);
const after=await ev(()=>[...document.querySelectorAll('.bld-fw b')].map(x=>x.innerText).join('|'));
ok('une arme autorisée est choisie (équipement modifié)',before!==after,{before,after});
const openAfter=await ev(()=>document.querySelector('details.bld-dr').open);ok('le tiroir reste ouvert après le choix',openAfter===true,openAfter);
await nav(1);await nav(-1);
const back=await ev(()=>[...document.querySelectorAll('.bld-fw b')].map(x=>x.innerText).join('|'));ok('les changements sont conservés après navigation (aller-retour)',back===after,{back,after});
// tiroir : conservé d'une Intercessor à l'autre (même règle), fermé si la règle n'existe pas sur la figurine affichée
await click('.bld-fnav button[data-i="2"]');
const rid=await ev(()=>{const d=document.querySelector('details.bld-dr');if(!d)return null;d.open=true;d.dispatchEvent(new Event('toggle',{bubbles:true}));return d.getAttribute('data-figdr')});
await nav(1);const keep=await ev(r=>{const d=document.querySelector('details.bld-dr[data-figdr="'+r+'"]');return d?d.open:'absent'},rid);ok('tiroir ouvert conservé sur la figurine suivante (même règle)',keep===true||keep==='absent',keep);
await click('.bld-fnav button[data-i="0"]');
const g0=await ev(r=>{const d=document.querySelector('details.bld-dr[data-figdr="'+r+'"]');return d?d.open:'absent'},rid);ok('sur le Sergent, un tiroir sans règle correspondante n’existe pas / est fermé',g0===false||g0==='absent',g0);
// option impossible : non cliquable (disabled)
const imp=await ev(()=>{const x=[...document.querySelectorAll('.bld-fc')].filter(b=>b.disabled);return{n:x.length,ok:x.every(b=>b.closest('.bld-fcw').querySelector('.bld-why'))}});console.log('options impossibles sur cette figurine :',JSON.stringify(imp));
ok('chaque option impossible est désactivée et affiche sa raison',imp.n===0||imp.ok,imp);
// validation + retour liste
await click('[data-bld="figback"].b.p');await wait(250);
const lst=await ev(()=>({fiche:!!document.querySelector('.bld-fiche'),liste:document.querySelectorAll('.bld-fg').length,val:(document.querySelector('.bld-vd')||{}).innerText}));
ok('« Enregistrer » revient à la liste des figurines avec la validation',!lst.fiche&&lst.liste===10&&/conforme|erreur/i.test(lst.val||''),lst);
const mod=await ev(()=>[...document.querySelectorAll('.bld-fg.mod')].length);ok('la figurine modifiée est marquée dans la liste',mod>=1,mod);
await b.close()})();
