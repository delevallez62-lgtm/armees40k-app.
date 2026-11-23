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
const pop=()=>p.evaluate(()=>{const o=document.getElementById('ttp');return o&&o.innerText?o.innerText.replace(/\n+/g,' | ').slice(0,170):null});
const click=(s)=>p.evaluate(s=>{const e=document.querySelector(s);if(e)e.click();return !!e},s);
console.log('1 départ :',await pop());await click('#ttp [data-tt2="px"]');
for(let i=0;i<6;i++){await p.evaluate(()=>{const w=document.querySelector('#gpo');if(!w)return;const mo=w.querySelector('.mpk .mo:not(.on)')||w.querySelector('.mo');const g=w.querySelector('[data-gp="go"]');if(g){g.click();return}if(mo&&!w.querySelector('.mo.on'))mo.click();const n=w.querySelector('[data-gp="wnext"]');if(n)n.click()});await p.waitForTimeout(700);const q=await pop();if(q&&/Choisis la mission/.test(q)){console.log('2 mission :',q);await click('#ttp [data-tt2="px"]')}if(!(await p.evaluate(()=>!!document.querySelector('#gpo'))))break}
await p.waitForTimeout(1500);
const d=await pop();console.log('3 lancement :',d);ok('pas d\'étape ouverte d\'office',!/ÉTAPE/.test(d||''),d);
await click('#ttp [data-tt2="pd"]');await p.waitForTimeout(300);
ok('aucune fenêtre automatique ensuite',!(await pop()),await pop());
console.log('pastille :',await p.evaluate(()=>document.getElementById('ttpill').innerText));
await click('[data-tt2="pill"]');await p.waitForTimeout(200);console.log('4 étape :',await pop());
const n1=await p.evaluate(()=>document.querySelectorAll('#ttp .tt2-dots i').length);ok('étape = 1 seule fenêtre',n1===1,n1);
await click('#ttp [data-tt2="pd"]');await p.waitForTimeout(250);ok('étape suivante non ouverte d\'office',!(await pop()),await pop());
// stratagèmes : fenêtre au bon moment
await p.evaluate(()=>{tab='pst';draw()});await p.waitForTimeout(600);console.log('5 stratagèmes :',await pop());await click('#ttp [data-tt2="px"]');
await p.evaluate(()=>{tab='bat';draw()});await p.waitForTimeout(600);console.log('6 score :',await pop());await click('#ttp [data-tt2="px"]');
await p.evaluate(()=>{tab='play';draw()});await p.waitForTimeout(500);
await click('.puh');await p.waitForTimeout(400);
const f=await p.evaluate(()=>{document.querySelector('.tt-chip[data-c="w:F"]').click();return document.getElementById('ttp').innerText.replace(/\n+/g,' | ')});ok('table des forces (pas de sélecteur de figurines)',/Force ≥ 2/.test(f)&&!(await p.evaluate(()=>!!document.querySelector('#ttp select'))),f);
console.log('avant lanceur: seen',JSON.stringify(await p.evaluate(()=>S.tut.seen)),await p.evaluate(()=>{const e=document.getElementById('dzp');return e?JSON.stringify(e.getBoundingClientRect())+' '+e.className+' '+e.parentNode.id+' '+getComputedStyle(e).display+getComputedStyle(e).visibility+getComputedStyle(e).transform:'none'}));await click('[data-tt2="sx"]');
const dz=await p.evaluate(()=>{const e=document.querySelector('[data-dzw],.wza,[data-dz]');if(e){e.click();return e.outerHTML.slice(0,80)}return null});for(const w of [50,150,300]){await p.waitForTimeout(w);console.log('  t+',w,await pop())}await p.waitForTimeout(300);console.log('8 lanceur :',await pop(),JSON.stringify(await p.evaluate(()=>({tab,pop:S.tut.pop,seen:S.tut.seen,dz:!!document.getElementById('dzp'),h:document.getElementById('dzp')&&document.getElementById('dzp').offsetHeight,on:S.tut.on,gpo:!!document.getElementById('gpo')}))));await click('#ttp [data-tt2="pd"]');await p.waitForTimeout(300);await p.evaluate(()=>{const s=document.querySelectorAll('#dzp .dzph>span');if(s[1])s[1].click()});await p.waitForTimeout(600);console.log('9 blesser :',(await pop()||'').slice(0,120));
console.log('dzph:',await p.evaluate(()=>{const e=document.querySelector('#dzp .dzph');return e?e.innerText.replace(/\n+/g,' '):null}));
console.log(errs);await b.close()})();
