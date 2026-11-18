const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove())});
const info=await ev(()=>{const d=BIB.D.paintsDB;return d?{n:d.paints.length,brands:d.brands.length}:null});ok('catalogue de peintures embarqué (hors ligne)',info&&info.n>8000,info);
// décodeur : 4 images (propre, bruitée/floue, retournée, tournée) — via canvas
for(const [f,lab] of [['bc1.png','image nette'],['bc2.png','image floue + bruit + réduite'],['bc3.png','code-barres à l\'envers (180°)'],['bc4.png','code-barres vertical (90°)']]){
 const r=await ev(async f=>{const im=new Image();im.src='http://localhost:8765/'+f;await new Promise(r=>im.onload=r);const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);return BIBPSC.decode(x.getImageData(0,0,c.width,c.height))},f);
 ok('décodeur hors ligne : '+lab,r==='5011921183340',r)}
ok('somme de contrôle EAN',await ev(()=>BIBPSC.check('5011921183340')&&!BIBPSC.check('5011921183341')),1);
// UI : onglet Peinture
await ev(()=>{tab='paint';draw()});await wait(500);
await ev(()=>{const t=[...document.querySelectorAll('button,[data-x]')].find(x=>/Mes peintures/i.test(x.innerText));t&&t.click()});await wait(400);
const bt=await ev(()=>!!document.querySelector('[data-pscan]'));
ok('bouton « Scanner un code-barres » dans l\'onglet Peinture',bt,await ev(()=>document.body.innerText.slice(0,200)));
await ev(()=>document.querySelector('[data-pscan]').click());await wait(400);
ok('fenêtre de scan ouverte',await ev(()=>!!document.getElementById('psc')&&/Scanner un pot/.test(document.getElementById('psc').innerText)),1);
// reconnaissance : le pot s'affiche ; + l'ajoute
const n0=await ev(()=>__hob.hob().paints.length);
const PL=async()=>{await ev(()=>{const b=document.querySelector('#pspot [data-pot="+"]');b&&b.click()});await wait(200);await ev(()=>{const x=document.querySelector('#pspot [data-pot="x"]');x&&x.click()});await wait(100)};
await ev(()=>BIBPSC.onCode('5011921183340'));await wait(300);
ok('code reconnu : le pot s\'affiche, pas encore ajouté',await ev(n=>!!document.getElementById('pspot')&&/Administratum Grey/.test(document.getElementById('pspot').innerText)&&__hob.hob().paints.length===n,n0),1);
await PL();
const a=await ev(()=>{const h=__hob.hob();const p=h.paints.find(x=>x.ean==='5011921183340');return {n:h.paints.length,p:p&&{n:p.n,b:p.b,t:p.t,c:p.c,rg:p.rg}}});
ok('code reconnu : nom, marque, teinte et type',a.p&&a.p.n==='Administratum Grey'&&a.p.b==='Citadel'&&a.p.c==='#8f9690'&&a.p.t==='Air',a);
ok('ajouté avec « + » à « Mes peintures »',a.n===n0+1,a);
// même pot (ancien code-barres) : pas de doublon
await ev(()=>{BIBPSC.onCode('5011921199815')});await wait(200);await PL();
ok('autre code-barres du même pot : pas de doublon',await ev(()=>__hob.hob().paints.filter(x=>x.n==='Administratum Grey').length===1),1);
// saisie manuelle
await ev(()=>{document.getElementById('psman').value='5011921182848';document.querySelector('[data-psc="man"]').click()});await wait(300);
ok('saisie manuelle : pot reconnu affiché',await ev(()=>/Abaddon Black/.test(document.getElementById('pspot').innerText)),1);
await PL();
ok('ajout confirmé',await ev(()=>__hob.hob().paints.some(x=>x.n==='Abaddon Black')),1);
// code inconnu : saisie perso mémorisée
await ev(()=>BIBPSC.onCode('4006381333931'));await wait(200);
ok('code inconnu : formulaire pour l\'ajouter soi-même',await ev(()=>!!document.getElementById('psun')),await ev(()=>document.getElementById('psmsg').innerText));
await ev(()=>{document.getElementById('psun').value='Ma peinture perso';document.querySelector('[data-psc="addun"]').click()});await wait(300);
await ev(()=>BIBPSC.onCode('4006381333931'));await wait(300);
ok('code mémorisé : reconnu comme déjà dans la collection',await ev(()=>/Dans ta liste/.test(document.getElementById('pspot').innerText)),1);
await ev(()=>{const x=document.querySelector('#pspot [data-pot="x"]');x&&x.click()});
await ev(()=>BIBPSC.onCode('1234567890123'));await wait(200);
ok('code invalide refusé',await ev(()=>/illisible|invalide/.test(document.getElementById('psmsg').innerText)),1);
// recherche catalogue
await ev(()=>{const q=document.getElementById('psq');q.value='abaddon';q.dispatchEvent(new Event('input',{bubbles:true}))});await wait(500);
ok('recherche dans le catalogue',await ev(()=>document.querySelectorAll('#psres .rs').length>0),1);
await ev(()=>{document.querySelector('[data-psc="close"]').click()});await wait(300);
ok('fenêtre fermée',await ev(()=>!document.getElementById('psc')),1);
await b.close()})();
