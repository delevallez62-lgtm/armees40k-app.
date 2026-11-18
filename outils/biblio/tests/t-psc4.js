const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());
 const h=__hob.hob();h.paints.push({id:'pa',n:'Ma peinture A',b:'Citadel',t:'Base',c:'#336699',s:'ok'},{id:'pb',n:'Ma peinture B',b:'Vallejo',t:'Layer',c:'#993366',s:'ok'});tab='paint';draw()});await wait(400);
await ev(()=>{const t=[...document.querySelectorAll('button,[data-x]')].find(x=>/Mes peintures/i.test(x.innerText));t&&t.click()});await wait(400);
const d=await ev(()=>{const g=document.getElementById('gxadd');return g?{open:g.open,btns:[...g.querySelectorAll('button')].map(x=>x.textContent.trim()),sum:g.querySelector('summary').innerText}:null});
ok('tiroir « Ajouter une nouvelle peinture » présent et fermé par défaut',d&&!d.open&&/Ajouter une nouvelle peinture/.test(d.sum),d);
ok('le tiroir contient scanner, lecture de pot, capture, peinture manuelle',d&&d.btns.some(x=>/Scanner/.test(x))&&d.btns.some(x=>/Lire un pot/.test(x))&&d.btns.some(x=>/capture/.test(x))&&d.btns.some(x=>/Peinture/.test(x)),d);
ok('la liste de mes peintures est visible',await ev(()=>/Ma peinture A/.test(document.body.innerText)&&/Ma peinture B/.test(document.body.innerText)),1);
ok('aucun bouton d\'ajout hors du tiroir',await ev(()=>[...document.querySelectorAll('[data-pscan],[data-camgo]')].every(x=>x.closest('#gxadd'))),1);
await ev(()=>{document.getElementById('gxadd').open=true});
ok('le tiroir s\'ouvre et le bouton scanner fonctionne',await ev(()=>{document.querySelector('[data-pscan]').click();return !!document.getElementById('psc')}),1);
// images : capture d'écran de téléphone
for(const [f,l] of [['shot1.jpg','capture d\'écran (code-barres petit au milieu de la page)'],['shot2.jpg','capture d\'écran (mode sombre, code-barres très petit)']]){
 const r=await ev(async f=>{const im=new Image();im.src='http://localhost:8765/'+f;await new Promise(r=>im.onload=r);const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);return await BIBPSC.fromCanvas(c)},f);
 ok('lecture d\'une '+l,r==='5011921183340',r)}
// via le champ « Photo du code-barres » avec la capture
await ev(()=>{document.getElementById('psc').remove()});await ev(()=>{document.querySelector('[data-pscan]').click()});
await p.setInputFiles('[data-psf]','shot1.jpg');await wait(2500);
ok('photo/capture déposée dans la fenêtre : pot reconnu et ajouté',await ev(()=>__hob.hob().paints.some(x=>x.ean==='5011921183340')),await ev(()=>document.getElementById('psmsg').innerText));
// import depuis une capture : le code-barres de la capture est lu d'abord (hors ligne)
await ev(()=>{document.getElementById('psc')&&document.getElementById('psc').remove();const h=__hob.hob();h.paints=h.paints.filter(x=>x.ean!=='5011921183340');document.getElementById('gxadd').open=true;document.querySelector('[data-x="ocr"]').click()});await wait(500);
await p.setInputFiles('#gocrf','shot1.jpg');await wait(3000);
ok('« Depuis une capture » : le code-barres de la capture est reconnu sans internet',await ev(()=>!!document.getElementById('psc')&&__hob.hob().paints.some(x=>x.ean==='5011921183340')),await ev(()=>document.body.innerText.slice(0,150)));
await b.close()})();
