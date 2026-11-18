const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);
// migration de l'ancienne version (notes déjà écrites)
await ev(()=>{window.__majPop=1;S.lore={epre:{t:'Mon ancien texte',at:1},orig:{t:'Autre note',at:2}};save();document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='home';draw()});
await ev(()=>document.querySelector('[data-tab="lore"]').click());await p.waitForTimeout(300);
const r=await ev(()=>({v:S.lore.v,d:S.lore.hist.drawers.map(d=>d.t+':'+d.ch.map(c=>c.t+'='+c.bl[0].x).join('|')),old:!!S.loreOld&&!!S.loreOld.epre}));
ok('migration : anciennes notes conservées dans un tiroir + sauvegarde',r.v===2&&r.d.length===1&&/Mon ancien texte/.test(r.d[0])&&r.old,r);
await ev(()=>{S.lore=undefined;S.loreOld=undefined});
// captures
await ev(()=>{document.querySelector('[data-lo="go"][data-c="hist"]').click()});await p.waitForTimeout(200);
await ev(()=>document.querySelector('[data-lo="mode"]').click());
for(const t of ['Origines','Campagnes']){await ev(()=>document.querySelector('[data-lo="dadd"]').click());await p.waitForTimeout(150);await ev(t=>{document.querySelector('#lormd [data-lf="t"]').value=t;document.querySelector('[data-lm="ok"]').click()},t);await p.waitForTimeout(150)}
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true;});await ev(()=>document.querySelector('[data-lo="cadd"]').click());await p.waitForTimeout(150);await ev(()=>{document.querySelector('#lormd [data-lf="t"]').value='Chapitre un';document.querySelector('[data-lm="ok"]').click()});await p.waitForTimeout(150);
await ev(()=>{document.querySelectorAll('details.lo-dr')[0].open=true;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove())});await p.screenshot({path:'lore-edit.png'});
ok('pas de débordement horizontal',await ev(()=>document.documentElement.scrollWidth<=innerWidth+1),1);
await b.close()})();
