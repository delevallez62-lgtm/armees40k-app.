const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
const mode=process.argv[3]||'merge';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();await BIB.init();tab='coll';draw()});
// 1) recherche dans la collection
await p.fill('#q','boyz');await p.waitForTimeout(600);
console.log('bloc bibliothèque:',await p.evaluate(()=>{const e=document.querySelector('.bib-cs');return e?e.innerText.replace(/\n/g,' | ').slice(0,200):null}));
await p.screenshot({path:'cs.png'});
await p.evaluate(()=>{const r=[...document.querySelectorAll('.bib-cs .bib-row')].find(e=>/^Boyz$/.test(e.querySelector('b').innerText.trim()));r.querySelector('[data-bib="mk"]').click()});await p.waitForTimeout(600);
console.log('fiche créée:',JSON.stringify(await p.evaluate(()=>{const m=Object.values(S.coll).find(x=>x.fromLib);return m&&{name:m.name,stats:m.stats,w:m.weapons.length,apt:m.apt.slice(0,80),kw:m.kw.slice(0,60),pts:m.pts,link:!!S.lib.links[m.ref]}})));
// 2) import PDF
await p.evaluate(()=>{S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
console.log('dialogue:',await p.evaluate(()=>{const d=document.querySelector('#dg');return d?d.innerText.replace(/\n/g,' | ').slice(0,260):'aucun'}));
// éventuel dialogue d'import précédent
await p.evaluate((mode)=>{const bs=[...document.querySelectorAll('#dg button')];const f=bs.find(x=>/Fusionner/.test(x.innerText));const g=bs.find(x=>/Garder séparées/.test(x.innerText));(mode==='merge'?f:g)&&(mode==='merge'?f:g).click()},mode);await p.waitForTimeout(1200);
console.log('résultat:',JSON.stringify(await p.evaluate(()=>Object.values(S.coll).filter(m=>/boyz/i.test(m.name)).map(m=>({name:m.name,fromLib:!!m.fromLib,merged:!!m.merged,w:m.weapons.length,names:m.weapons.map(w=>w.name),apt:m.apt,link:!!S.lib.links[m.ref]})))));
console.log('liste boyz armes:',JSON.stringify(await p.evaluate(()=>S.lists.flatMap(l=>l.units).filter(u=>/boyz/i.test(u.name)).map(u=>u.weapons.length))));
console.log(errs);await b.close()})();
