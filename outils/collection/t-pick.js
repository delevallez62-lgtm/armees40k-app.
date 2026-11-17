const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();await BIB.init();});
// lie Boyz (14 armes) puis nouvelle liste vide
const ref=await p.evaluate(()=>Object.values(S.coll).find(m=>/^boyz$/i.test(m.name)).ref);
await p.evaluate(r=>{const u=BIBAUTO(S.coll[r]);const x=document.createElement('button');x.dataset.bib='cmp';x.dataset.r=r;x.dataset.id=u.u.id;document.body.appendChild(x);x.click()},ref);await p.waitForTimeout(600);
await p.evaluate(()=>{S.lists.push({id:'lnew',name:'Vide',units:[]});S.cur='lnew';tab='units';draw()});await p.waitForTimeout(300);
await p.evaluate(()=>{const e=document.querySelector('[data-act="npick"]');e.click()});await p.waitForTimeout(400);
await p.evaluate(()=>[...document.querySelectorAll('#pr [data-bib="pkfac"]')].find(e=>/^Orks/.test(e.innerText)).click());await p.waitForTimeout(300);await p.evaluate(r=>document.querySelector('[data-act="pick"][data-r="'+r+'"]').click(),ref);await p.waitForTimeout(500);
console.log('fiche ouverte:',await p.evaluate(()=>{const e=document.querySelector('#wpk .pn');return e?e.innerText.replace(/\n/g,' | ').slice(0,200):null}));
console.log('cochées par défaut:',await p.evaluate(()=>[...document.querySelectorAll('#wpk .wpr')].map(e=>(e.classList.contains('on')?'✔':'·')+e.querySelector('b').innerText).join(', ')));
await p.screenshot({path:'pick.png'});
// décocher la 1re, cocher une arme de bibliothèque
await p.evaluate(()=>{const r=[...document.querySelectorAll('#wpk .wpr')];r[0].click()});await p.waitForTimeout(200);
await p.evaluate(()=>{const r=[...document.querySelectorAll('#wpk .wpr')];r.find(e=>/Big Shoota/.test(e.innerText)).click()});await p.waitForTimeout(200);
await p.evaluate(()=>document.querySelector('#wpk [data-act="wpok"]').click());await p.waitForTimeout(500);
console.log('unité ajoutée:',await p.evaluate(()=>S.lists.find(l=>l.id==='lnew').units.map(u=>({n:u.name,w:u.weapons.map(w=>w.name)}))));
console.log(errs);await b.close()})();
