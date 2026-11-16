const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();await BIB.init();tab='coll';draw()});await p.waitForTimeout(500);
const refs=await p.evaluate(()=>Object.values(S.coll).map(m=>m.ref));
for(const r of refs){
 const o=await p.evaluate(async r=>{const m=S.coll[r];let am=null,err=null;try{am=BIBAUTO(m)}catch(e){err=e.message}ed=m;ctx='coll';edit=false;draw();await new Promise(k=>setTimeout(k,250));const d=document.querySelector('#md details.bib-dr');return{name:m.name,match:am?am.u.n+' ['+am.level+'] '+am.why:null,err,drawer:!!d}},r);
 console.log(JSON.stringify(o));}
console.log('erreurs page:',errs);await b.close()})();
