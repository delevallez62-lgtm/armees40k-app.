const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();await BIB.init();S.lists.push({id:'lnew',name:'Vide',units:[]});S.cur='lnew';tab='units';draw()});await p.waitForTimeout(300);
const pickRef=async name=>{await p.evaluate(()=>document.querySelector('[data-act="npick"]').click());await p.waitForTimeout(400);
 console.log('PR:',await p.evaluate(()=>document.querySelector('#pr')&&document.querySelector('#pr').innerText.slice(0,80)));await p.evaluate(()=>[...document.querySelectorAll('#pr [data-bib="pkfac"]')].find(e=>/^Orks/.test(e.innerText)).click());await p.waitForTimeout(300);
 await p.evaluate(n=>[...document.querySelectorAll('#pr [data-act="pick"]')].find(e=>new RegExp(n,'i').test(e.innerText)).click(),name);await p.waitForTimeout(600)};
const info=()=>p.evaluate(()=>{const e=document.querySelector('#wpk .pn');return{sections:[...e.querySelectorAll('.sech')].map(x=>x.innerText),lien:(e.querySelector('.bib-lkc,.bib-meta')||{}).innerText,abilites:e.querySelectorAll('[data-hlz] p, .apn .an').length,options:(e.querySelector('details.bib-dr')||{}).open&&e.querySelector('details.bib-dr').innerText.length,link:[...e.querySelectorAll('.bib-lkc button')].map(x=>x.innerText)}});
// 1) fiche de collection NON liée (Kamion)
await pickRef('kamion');console.log('kamion (non lié):',JSON.stringify(await info()));
await p.screenshot({path:'ff1.png'});
await p.evaluate(()=>document.querySelector('#wpk [data-act="wpx"]').click());await p.waitForTimeout(300);
// 2) Boyz : lier via la proposition
await pickRef('boyz');console.log('boyz avant:',JSON.stringify(await info()));
await p.evaluate(()=>{const x=document.querySelector('#wpk [data-bib="cmp"]');if(x)x.click()});await p.waitForTimeout(800);
console.log('boyz après lien:',JSON.stringify(await info()),'armes:',await p.evaluate(()=>document.querySelectorAll('#wpk .wpr').length));
await p.screenshot({path:'ff2.png'});
console.log(errs);await b.close()})();
