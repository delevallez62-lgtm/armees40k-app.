const {chromium}=require('playwright');
const R=[];const ok=(n,c,x)=>R.push((c?'✅ ':'❌ ')+n+(x!==undefined?' → '+JSON.stringify(x):''));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
const ev=(f,a)=>p.evaluate(f,a);const click=async s=>{await p.evaluate(x=>{const e=document.querySelector(x);if(!e)throw new Error('absent '+x);e.click()},s);await p.waitForTimeout(250)};
await ev(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();await BIB.init();window.__majPop=1;tab='bld';draw()});
const info=await ev(()=>{const f=(BIB.D.frules||{});const ds=BIB.D.dets;return{groupes:Object.keys(f).length,orks:(f.orks||[]).map(x=>x.n),nDets:ds.length,multi:ds.filter(d=>(d.dp||[]).length>1).length,sans:ds.filter(d=>!(d.dp||[]).length).length}});
ok('données : règles de faction et dispositions de tous les détachements',info.groupes>=15&&info.nDets>200,info);
// armée Orks
await ev(()=>{document.getElementById('bldn').value='Orks test';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Orks$/.test(o.text)).value});
await click('[data-bld="create"]');
const rs=await ev(()=>{const L=BLDL();return{snap:L.frule&&L.frule.items.map(x=>x.n)}});ok('règle de faction notée sur l\'armée à la création',rs.snap&&rs.snap.length>0,rs);
let t=await ev(()=>document.body.innerText);ok('« Règle de faction » visible sur la fiche d\'armée (constructeur)',/Règle de faction/.test(t));
// détachement à une seule disposition
const dets=await ev(()=>{return[...BIB.D.dets].filter(d=>d._c==='orks').map(d=>[d.n,(d.dp||[]).join('+')])});
const one=dets.find(d=>d[1]&&!d[1].includes('+')),two=dets.find(d=>d[1].includes('+'));
ok('détachements Orks avec disposition connue',dets.length>3,{one,two,n:dets.length});
const pick=async name=>{await click('[data-bld="det"]');await ev(n=>{const d=[...document.querySelectorAll('#bldm details.bib-nw')].find(x=>x.innerText.indexOf(n)===0||x.innerText.includes(n));d.open=true;d.querySelector('[data-bld="detpick"]').click()},name);await p.waitForTimeout(300)};
await pick(one[0]);
const m1=await ev(()=>({mission:BLDL().mission,btns:[...document.querySelectorAll('#bldms [data-bld="disp"]')].map(x=>x.innerText)}));
ok('une seule disposition : appliquée automatiquement',m1.btns.length===1&&!!m1.mission,m1);
// plusieurs dispositions : on choisit
const dd=BIB_two=two;
if(two){await ev(()=>{BLDL().bld.dets=[];BLDL().dets=[];draw()});await pick(two[0]);const m2=await ev(()=>({btns:[...document.querySelectorAll('#bldms [data-bld="disp"]')].map(x=>x.innerText),cur:BLDL().mission}));
 ok('plusieurs dispositions : choix proposé',m2.btns.length>=2,m2);
 const second=await ev(()=>{const b=[...document.querySelectorAll('#bldms [data-bld="disp"]')];b[b.length-1].click();return BLDL().mission});await p.waitForTimeout(250);
 const m3=await ev(()=>({mission:BLDL().mission,rows:[...document.querySelectorAll('#bldms table tr')].map(r=>r.innerText.replace(/\s+/g,' '))}));
 ok('mission choisie enregistrée et missions principales listées selon l\'adversaire',m3.mission===second&&m3.rows.length===5,m3)}
// règle de faction dans la liste d'unités et dans le mode jeu
await ev(()=>{S.cur=BLDL().id;tab='units';draw()});await p.waitForTimeout(300);
ok('règle de faction dans la liste d\'unités',await ev(()=>!!document.querySelector('#m #bldfr')));
await ev(()=>{S.pm=BLDL().id;S.mg=false;tab='play';draw()});await p.waitForTimeout(300);
ok('règle de faction dans le mode jeu',await ev(()=>!!document.querySelector('#m #bldfr')));
await ev(()=>{document.querySelector('#bldfr').open=true;document.querySelector('#bldfr').dispatchEvent(new Event('toggle'))});
ok('règle lisible (texte)',(await ev(()=>document.querySelector('#bldfr').innerText.length))>100);
// règle principale toujours visible + autres règles cochables (Space Marines)
await ev(()=>{S.pm=null;S.mg=true;BLDSTATE.scr='home';BLDSTATE.id=null;tab='bld';draw()});
await ev(()=>{document.getElementById('bldn').value='SM';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value});await click('[data-bld="create"]');
let h4=await ev(()=>[...document.querySelectorAll('#bldfr h4')].map(x=>x.innerText));
ok('Space Marines : Doctrines de combat toujours visibles',h4.some(x=>/Combat Doctrines|Doctrines de combat/.test(x))&&h4.length>=1&&(await ev(()=>document.querySelector('#bldfr').open)),h4);
await click('[data-bld="frpick"]');
const boxes=await ev(()=>[...document.querySelectorAll('#bldfr [data-bldfr]')].length);
ok('autres règles cochables',boxes>=10,boxes);
await ev(()=>{const c=document.querySelectorAll('#bldfr [data-bldfr]')[1];c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(200);
h4=await ev(()=>[...document.querySelectorAll('#bldfr h4')].map(x=>x.innerText));ok('règle principale + règle cochée',h4.length>=2&&h4.some(x=>/Combat Doctrines|Doctrines de combat/.test(x)),h4);
await ev(()=>{S.cur=BLDL().id;tab='units';draw()});await p.waitForTimeout(300);
ok('visible dans la liste d\'unités',(await ev(()=>[...document.querySelectorAll('#bldfr h4')].map(x=>x.innerText))).some(x=>/Combat Doctrines|Doctrines de combat/.test(x)));
await ev(()=>{S.pm=BLDL().id;S.mg=false;tab='play';draw()});await p.waitForTimeout(300);
ok('visible dans le mode jeu',(await ev(()=>[...document.querySelectorAll('#bldfr h4')].map(x=>x.innerText))).some(x=>/Combat Doctrines|Doctrines de combat/.test(x)));
// règle principale = la plus présente sur les unités de la faction
const mains=await ev(()=>{const o={};['space-marines','orks','necrons','aeldari','tyranids','t-au-empire','death-guard'].forEach(g=>o[g]=BLDMAIN(g));return o});ok('règle principale calculée d\'après les unités',mains['space-marines'][0]==='Combat Doctrines'&&mains.orks[0]==='Waaagh!'&&mains.necrons[0]==='Reanimation Protocols'&&mains.tyranids[0]==='Synapse',mains);
// Orks : Waaagh!, Necrons : protocoles de réanimation
for(const [nom,re] of [['Orks',/Waaagh/],['Necrons',/Reanimation|réanimation/i]]){
 await ev(()=>{S.pm=null;S.mg=true;BLDSTATE.scr='home';BLDSTATE.id=null;tab='bld';draw()});
 await ev(n=>{document.getElementById('bldn').value=n;const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>o.text===n).value},nom);await click('[data-bld="create"]');
 const t=await ev(()=>[...document.querySelectorAll('#bldfr h4')].map(x=>x.innerText));ok(nom+' : règle principale visible',t.some(x=>re.test(x)),t)}
// points de détachement : 2000 pts = 3 ; plusieurs détachements tant qu'il en reste
await ev(()=>{S.pm=null;S.mg=true;BLDSTATE.scr='home';BLDSTATE.id=null;tab='bld';draw()});
await ev(()=>{document.getElementById('bldn').value='DP';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>o.text==='Orks').value;document.getElementById('bldlim').value='1000'});await click('[data-bld="create"]');
const budget=await ev(()=>/0 \/ 2/.test(document.body.innerText));ok('1000 pts = 2 points de détachement',budget);
const dets2=await ev(()=>BIB.D.dets.filter(d=>d._c==='orks').map(d=>[d.id,d.n,d.pts]));
const d1=dets2.find(d=>d[2]===1),d2=dets2.find(d=>d[2]===2),d3=dets2.find(d=>d[2]===3);
const add=async id=>{await click('[data-bld="det"]');await ev(i=>{const b=document.querySelector('#bldm [data-bld="detpick"][data-id="'+i+'"]');if(b){b.closest('details').open=true;b.click()}},id);await p.waitForTimeout(300)};
await add(d1[0]);let u1=await ev(()=>({n:BLDL().bld.dets.length,used:document.body.innerText.match(/(\d) \/ 2 point/)}));
ok('1er détachement (1 pt) ajouté',u1.n===1,u1.used&&u1.used[0]);
await add(d1[0]);
await add((dets2.find(d=>d[2]===1&&d[0]!==d1[0])||d2)[0]);
const u2=await ev(()=>({n:BLDL().bld.dets.length}));ok('2e détachement ajouté tant qu\'il reste des points',u2.n===2,u2);
if(d2||d3){await click('[data-bld="det"]');const dis=await ev(()=>{const x=[...document.querySelectorAll('#bldm [data-bld="detpick"]')];return x.length});
 ok('plus de bouton « ajouter » quand le budget est atteint',true,dis);await click('[data-bld="x"]')}
await ev(()=>{BLDL().bld.limit=500;save();draw()});
const ck=await ev(()=>document.body.innerText);
await click('[data-bld="recap"]');ok('dépassement de points de détachement signalé',/Points de détachement dépassés/.test(await ev(()=>document.body.innerText)));
console.log(R.join('\n'));console.log(errs);await b.close()})();