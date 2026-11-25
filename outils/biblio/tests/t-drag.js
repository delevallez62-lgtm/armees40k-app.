const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
const W=390;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2200);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();document.querySelectorAll('.ov,#encov,.bib-ov').forEach(e=>e.remove());window.__majPop=1;S.cur=S.lists[0].id;tab='units';draw()});await p.waitForTimeout(500);
const pos=()=>p.evaluate(()=>{const r=document.getElementById('nbub').getBoundingClientRect();return[Math.round(r.left),Math.round(r.top)]});
const p0=await pos();console.log('départ',p0);
// glisser la bulle (souris = pointer events) vers le haut à gauche
const bx=p0[0]+22,by=p0[1]+22;
await p.mouse.move(bx,by);await p.mouse.down();await p.mouse.move(bx-80,by-60,{steps:6});await p.mouse.move(bx-250,by-300,{steps:8});await p.mouse.up();await p.waitForTimeout(700);
const p1=await pos();console.log('après',p1);
ok('la bulle a bougé',Math.abs(p1[0]-p0[0])>100&&Math.abs(p1[1]-p0[1])>100,[p0,p1]);
ok('le glissement n\'ouvre pas le post-it',await p.evaluate(()=>!document.getElementById('npad').classList.contains('on')),1);
ok('position enregistrée',await p.evaluate(()=>!!localStorage.getItem('a40k_nb_pos')),1);
// toucher simple : ouvre, et le post-it se place près de la bulle
await p.mouse.click(p1[0]+22,p1[1]+22);await p.waitForTimeout(300);
ok('un toucher ouvre toujours le post-it',await p.evaluate(()=>document.getElementById('npad').classList.contains('on')),1);
const rr=await p.evaluate(()=>{const b=document.getElementById('nbub').getBoundingClientRect(),d=document.getElementById('npad').getBoundingClientRect();return{b:[b.left,b.top,b.bottom],d:[d.left,d.top,d.bottom,d.right],vw:innerWidth,vh:innerHeight}});
console.log(JSON.stringify(rr));
ok('post-it visible à l\'écran, collé à la bulle',rr.d[0]>=0&&rr.d[3]<=rr.vw+1&&rr.d[1]>=0&&rr.d[2]<=rr.vh&&Math.abs(rr.d[1]-rr.b[2])<20,rr);
await p.screenshot({path:'drag1.png'});
await p.evaluate(()=>document.querySelector('[data-nb="x"]').click());
// rechargement : même place
await p.reload();await p.waitForTimeout(3200);
await p.evaluate(()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();document.querySelectorAll('.ov,#encov,.bib-ov').forEach(e=>e.remove());window.__majPop=1;S.cur=S.lists[0].id;tab='units';draw()});await p.waitForTimeout(600);
const p2=await pos();ok('position retrouvée après rechargement',Math.abs(p2[0]-p1[0])<3&&Math.abs(p2[1]-p1[1])<3,[p1,p2]);
await b.close()})();
