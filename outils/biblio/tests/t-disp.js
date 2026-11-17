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
if(two){await pick(two[0]);const m2=await ev(()=>({btns:[...document.querySelectorAll('#bldms [data-bld="disp"]')].map(x=>x.innerText),cur:BLDL().mission}));
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
// plusieurs règles : sélection multiple (Space Marines : 16 règles)
await ev(()=>{S.pm=null;S.mg=true;BLDSTATE.scr='home';BLDSTATE.id=null;tab='bld';draw()});
await ev(()=>{document.getElementById('bldn').value='SM';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value});await click('[data-bld="create"]');
const n0=await ev(()=>({tot:BLDL().frule.items.length,sel:document.querySelector('#bldfr summary').innerText}));
ok('plusieurs règles : aucune cochée par défaut au-delà de 4',n0.tot>4&&/0\/\d+/.test(n0.sel),n0);
await ev(()=>{const d=document.querySelector('#bldfr');d.open=true;d.dispatchEvent(new Event('toggle'))});
await click('[data-bld="frpick"]');
const boxes=await ev(()=>[...document.querySelectorAll('#bldfr [data-bldfr]')].map(x=>x.dataset.bldfr));
ok('cases à cocher pour chaque règle',boxes.length===n0.tot,boxes.slice(0,3));
for(const i of [0,2]){await ev(k=>{const c=document.querySelectorAll('#bldfr [data-bldfr]')[k];c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}))},i);await p.waitForTimeout(200)}
const after=await ev(()=>({sel:BLDL().frsel,txt:document.querySelector('#bldfr summary').innerText,titles:[...document.querySelectorAll('#bldfr h4')].map(x=>x.innerText)}));
ok('plusieurs règles cochées et affichées',after.sel.length===2&&after.titles.length===2,after);
await click('[data-bld="frpick"]');
await ev(()=>{S.cur=BLDL().id;tab='units';draw()});await p.waitForTimeout(300);
ok('sélection conservée dans la liste d\'unités',(await ev(()=>[...document.querySelectorAll('#bldfr h4')].length))===2);
await ev(()=>{S.pm=BLDL().id;S.mg=false;tab='play';draw()});await p.waitForTimeout(300);
ok('sélection conservée dans le mode jeu',(await ev(()=>[...document.querySelectorAll('#bldfr h4')].length))===2);
console.log(R.join('\n'));console.log(errs);await b.close()})();