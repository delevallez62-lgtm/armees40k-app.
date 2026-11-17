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
// ajouter une 2e faction
await p.evaluate(()=>document.querySelector('#pr [data-bib="pkfaca"][data-v="1"]').click());await p.waitForTimeout(300);
console.log('choix 2e faction:',await p.evaluate(()=>document.querySelector('#pr').innerText.replace(/\n/g,' | ').slice(0,150)));
await p.evaluate(()=>[...document.querySelectorAll('#pr [data-bib="pkfac"]')].find(e=>/^Necrons/.test(e.innerText)).click());await p.waitForTimeout(400);
console.log('2 factions:',await p.evaluate(()=>{const e=document.querySelector('#pr');return{chips:[...e.querySelectorAll('.bib-chips button')].map(x=>x.innerText),h3:[...e.querySelectorAll('h3')].map(x=>x.innerText),lib:e.querySelectorAll('[data-bib="pklib"]').length}}));
await p.screenshot({path:'pk3.png'});
await p.fill('#pq','immortals');await p.waitForTimeout(300);
console.log('recherche immortals:',await p.evaluate(()=>[...document.querySelectorAll('#pr h3, #pr [data-bib="pklib"] b')].map(x=>x.innerText)));
// retirer Orks
await p.evaluate(()=>[...document.querySelectorAll('#pr .bib-chips button')].find(e=>/^Orks/.test(e.innerText)).click());await p.waitForTimeout(300);
console.log('après retrait Orks:',await p.evaluate(()=>[...document.querySelectorAll('#pr .bib-chips button')].map(x=>x.innerText)));
await p.evaluate(()=>document.querySelector('#pr [data-bib="pklib"]').click());await p.waitForTimeout(700);
console.log('fiche:',await p.evaluate(()=>{const e=document.querySelector('#wpk .pn');return e?e.innerText.replace(/\n/g,' | ').slice(0,90):null}));
console.log(errs);await b.close()})();