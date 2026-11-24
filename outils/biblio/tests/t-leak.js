const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
const W=390;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2200);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();tab='learn';draw()});await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelector('.tt-card [data-tt="start"]').click());await p.waitForTimeout(700);
for(let i=0;i<6;i++){const r=await p.evaluate(()=>{const w=document.querySelector('#gpo');if(!w)return 'fermé';const mo=w.querySelector('.mpk .mo:not(.on)')||w.querySelector('.mo');const g=w.querySelector('[data-gp="go"]');if(g){g.click();return 'go'}if(mo&&!w.querySelector('.mo.on'))mo.click();const n=w.querySelector('[data-gp="wnext"]');if(n)n.click();return 'next'});await p.waitForTimeout(600);if(r==='go')break}
await p.waitForTimeout(1500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
const st=()=>p.evaluate(()=>({on:S.tut.on,ph:S.tut.phase,pm:!!S.pm,pill:!!document.getElementById('ttpill'),pop:!!(document.getElementById('ttp')||{}).innerText,hint:document.querySelectorAll('.tt-uhint').length}));
await p.evaluate(()=>{document.querySelectorAll('.ov,#encov,.bib-ov').forEach(e=>e.remove());window.__majPop=1});
// lancer le tutoriel (fait par l'en-tête) puis vérifier qu'il tourne
console.log('tuto en cours',JSON.stringify(await st()));
// fin de la partie sans quitter le tutoriel
await p.evaluate(()=>{S.pm=null;tab='lists';draw()});await p.waitForTimeout(700);
const a=await st();ok('partie finie : tutoriel éteint',!a.on&&!a.pill&&!a.pop,a);
// nouvelle partie CLASSIQUE avec la même liste
await p.evaluate(()=>{S.pm=S.lists[0].id;tab='play';draw()});await p.waitForTimeout(900);
await p.evaluate(()=>document.querySelector('.puh')&&document.querySelector('.puh').click());await p.waitForTimeout(400);
const b2=await st();ok('partie classique : aucun élément de tutoriel',!b2.on&&!b2.pill&&!b2.pop&&b2.hint===0,b2);
await b.close()})();
