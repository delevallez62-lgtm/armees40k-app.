const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();await BIB.init();S.lists.push({id:'lnew',name:'Vide',units:[]});S.cur='lnew';tab='units';draw()});await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('[data-act="npick"]').click());await p.waitForTimeout(500);
console.log('étape 1:',await p.evaluate(()=>{const e=document.querySelector('#pr');return e.innerText.replace(/\n/g,' | ').slice(0,260)}));
await p.screenshot({path:'pk1.png'});
await p.evaluate(()=>[...document.querySelectorAll('#pr [data-bib="pkfac"]')].find(e=>/^Orks/.test(e.innerText)).click());await p.waitForTimeout(400);
console.log('étape 2:',await p.evaluate(()=>{const e=document.querySelector('#pr');return{h4:[...e.querySelectorAll('h4')].map(x=>x.innerText),coll:[...e.querySelectorAll('[data-act="pick"] b')].map(x=>x.innerText),lib:e.querySelectorAll('[data-bib="pklib"]').length}}));
await p.screenshot({path:'pk2.png'});
// recherche dans la faction
await p.fill('#pq','warboss');await p.waitForTimeout(400);
console.log('recherche warboss:',await p.evaluate(()=>[...document.querySelectorAll('#pr [data-bib="pklib"] b, #pr [data-act="pick"] b')].map(x=>x.innerText)));
// choisir une unité de la bibliothèque
await p.evaluate(()=>document.querySelector('#pr [data-bib="pklib"]').click());await p.waitForTimeout(700);
console.log('fiche ouverte:',await p.evaluate(()=>{const e=document.querySelector('#wpk .pn');return e?e.innerText.replace(/\n/g,' | ').slice(0,150):null}),'fiche créée:',await p.evaluate(()=>Object.values(S.coll).filter(m=>m.fromLib).map(m=>m.name)));
await p.evaluate(()=>document.querySelector('#wpk [data-act="wpok"]').click());await p.waitForTimeout(500);
console.log('ajoutée à la liste:',await p.evaluate(()=>S.lists.find(l=>l.id==='lnew').units.map(u=>u.name+' ('+u.weapons.length+' armes)')));
console.log(errs);await b.close()})();
