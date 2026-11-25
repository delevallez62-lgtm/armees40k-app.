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
await p.evaluate(()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();document.querySelectorAll('.ov,#encov,.bib-ov').forEach(e=>e.remove());window.__majPop=1;S.tut.on=false;tab='home';draw()});await p.waitForTimeout(500);
ok('pas de bulle sur l\'accueil',await p.evaluate(()=>getComputedStyle(document.getElementById('nbub')).display==='none'),1);
await p.evaluate(()=>{S.cur=S.lists[0].id;tab='units';draw()});await p.waitForTimeout(500);
ok('bulle visible dans une armée',await p.evaluate(()=>getComputedStyle(document.getElementById('nbub')).display!=='none'),1);
await p.evaluate(()=>document.getElementById('nbub').click());await p.waitForTimeout(300);
ok('post-it ouvert',await p.evaluate(()=>document.getElementById('npad').classList.contains('on')),1);
await p.fill('#nbt','Prendre les Boyz en premier\nAttention au Kamion');await p.waitForTimeout(700);
ok('texte enregistré dans l\'armée',await p.evaluate(()=>/Boyz en premier/.test(S.lists[0].note||'')),await p.evaluate(()=>S.lists[0].note));
await p.screenshot({path:'note1.png'});
await p.evaluate(()=>document.querySelector('[data-nb="x"]').click());await p.waitForTimeout(200);
ok('fermé',await p.evaluate(()=>!document.getElementById('npad').classList.contains('on')),1);
ok('pastille « contient une note »',await p.evaluate(()=>document.getElementById('nbub').classList.contains('has')),1);
await p.evaluate(()=>{tab='dets';draw()});await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('nbub').click());await p.waitForTimeout(300);
ok('texte conservé à la réouverture (autre menu de l\'armée)',await p.evaluate(()=>/Kamion/.test(document.getElementById('nbt').value)),await p.evaluate(()=>document.getElementById('nbt').value));
await p.evaluate(()=>document.querySelector('[data-nb="x"]').click());
// mode jeu
await p.evaluate(()=>{tab='play';draw()});await p.waitForTimeout(500);
await p.evaluate(()=>document.getElementById('nbub').click());await p.waitForTimeout(300);
console.log('dbg',await p.evaluate(()=>JSON.stringify({tab,pm:S.pm,cur:S.cur,on:document.getElementById('npad').className,html:document.getElementById('npad').innerHTML.slice(0,200)})));ok('mode jeu : même texte d\'armée + onglets',await p.evaluate(()=>/Kamion/.test(document.getElementById('nbt').value)&&!!document.querySelector('[data-nb="sp"]')),1);
await p.evaluate(()=>document.querySelector('[data-nb="sp"]').click());await p.waitForTimeout(250);
await p.fill('#nbt','Adversaire : Necrons, il aime les Doomsday');await p.waitForTimeout(600);
ok('note de partie séparée',await p.evaluate(()=>/Necrons/.test((S.bat&&S.bat.note)||'')&&!/Necrons/.test(S.lists[0].note)),await p.evaluate(()=>JSON.stringify([S.bat&&S.bat.note,S.lists[0].note])));
await p.screenshot({path:'note2.png'});
for(const t of ['pst','bat']){await p.evaluate(t=>{tab=t;draw()},t);await p.waitForTimeout(400);console.log(t,'bulle:',await p.evaluate(()=>getComputedStyle(document.getElementById('nbub')).display!=='none'))}
// rechargement
await p.reload();await p.waitForTimeout(3000);
console.log('après rechargement :',await p.evaluate(()=>JSON.stringify((S.lists[0].note||'').slice(0,30))));
await b.close()})();
