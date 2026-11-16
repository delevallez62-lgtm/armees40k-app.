const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();await BIB.init();tab='coll';draw()});
const nb=()=>p.evaluate(()=>{const c=Object.values(S.coll).find(m=>/^boyz$/i.test(m.name));return(c.weapons||[]).length});
const ref=await p.evaluate(()=>Object.values(S.coll).find(m=>/^boyz$/i.test(m.name)).ref);
console.log('avant lien',await nb());
await p.evaluate(r=>{const u=BIBAUTO(S.coll[r]);const x=document.createElement('button');x.dataset.bib='cmp';x.dataset.r=r;x.dataset.id=u.u.id;document.body.appendChild(x);x.click()},ref);await p.waitForTimeout(600);
console.log('après lien',await nb());
// on supprime 3 armes : elles doivent revenir toutes seules
await p.evaluate(r=>{S.coll[r].weapons.splice(6,3)},ref);console.log('après suppression',await nb());
await p.waitForTimeout(4500);console.log('après attente',await nb());
// affichage fiche
await p.evaluate(r=>{S.coll[r].weapons.splice(8,2);ed=S.coll[r];ctx='coll';edit=false;draw()},ref);console.log('juste après redraw fiche',await nb(),'lignes affichées:',await p.evaluate(()=>document.querySelectorAll('#md .encu .wz tr, #md .encu tbody tr').length));
// délier : plus de resync
await p.evaluate(r=>{delete S.lib.links[r];S.coll[r].weapons.splice(0,4)},ref);await p.waitForTimeout(4500);console.log('délié, plus de resync',await nb());
console.log(errs);await b.close()})();
