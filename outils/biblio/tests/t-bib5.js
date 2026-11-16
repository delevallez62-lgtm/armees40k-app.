const {chromium}=require('playwright');const fs=require('fs');
const st=JSON.parse(fs.readFileSync(__dirname+'/etat.json','utf8'));
st.coll.rork1={ref:'rork1',name:'boyz',pts:0,nb:0,stats:{M:'6',E:'5',SV:'5+',PV:'1',CD:'7+',CO:'2'},weapons:[],equip:'',apt:"Jamais Trop Occupé pour Se Battre, Waaagh!",kw:'Infanterie',fkw:'',subs:[],
 text:["Jamais Trop Occupé pour Se Battre Être engagée n’empêche pas cette unité d’être éligible pour entreprendre une action.","Waaagh! Les unités orks qui ont cette aptitude peuvent relancer les jets d'Avance."]};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
await ctx.addInitScript(s=>{if(!sessionStorage.getItem('x')){localStorage.setItem('armees40k',s);sessionStorage.setItem('x',1)}},JSON.stringify(st));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;await BIB.init();tab='coll';draw()});await p.waitForTimeout(400);
const before=await p.evaluate(()=>JSON.stringify({apt:S.coll.rork1.apt,text:S.coll.rork1.text,w:S.coll.rork1.weapons}));
await p.evaluate(()=>(()=>{const b=document.createElement('button');b.dataset.bib='open';b.dataset.r='rork1';document.body.appendChild(b);b.click();b.remove()})());await p.waitForTimeout(500);
await p.evaluate(()=>{const b=document.querySelector('#bibsr [data-bib="cmp"]');b.dataset.bib='cmpx';b.click()});await p.waitForTimeout(700);
const rows=await p.evaluate(()=>[...document.querySelectorAll('[data-bibmap]')].map(s=>({id:s.dataset.bibmap,opts:[...s.options].map(o=>o.text.slice(0,50))})));
console.log('capacités à associer:',JSON.stringify(rows).slice(0,500));
await p.screenshot({path:'bib-map1.png'});
// associer « Never Too Busy to Fight » avec « Jamais Trop Occupé pour Se Battre »
await p.evaluate(()=>{const s=[...document.querySelectorAll('[data-bibmap]')].find(x=>[...x.options].some(o=>/Jamais Trop/.test(o.text)));const o=[...s.options].find(o=>/Jamais Trop/.test(o.text));s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(400);
await p.screenshot({path:'bib-map2.png'});
console.log('après association, texte du bloc:',await p.evaluate(()=>[...document.querySelectorAll('.bib-row.bib-s')].map(x=>x.innerText.slice(0,160).replace(/\n/g,' ')).join(' || ')));
await p.evaluate(()=>document.querySelector('[data-bib="apply"]').click());await p.waitForTimeout(500);
const after=await p.evaluate(()=>JSON.stringify({apt:S.coll.rork1.apt,text:S.coll.rork1.text.slice(0,2),w:S.coll.rork1.weapons}));
const a=JSON.parse(after),b0=JSON.parse(before);
console.log('texte français existant inchangé:',JSON.stringify(a.text.slice(0,2))===JSON.stringify(b0.text.slice(0,2)),'| « Jamais Trop Occupé » toujours unique:',(a.apt.match(/Jamais Trop/g)||[]).length===1,'| « Never Too Busy » non ajoutée:',!/Never Too Busy/.test(a.apt));
console.log('appris:',await p.evaluate(()=>JSON.stringify({names:Object.entries(S.lib.tr).map(([k,v])=>k+'→'+v.fr),tm:Object.values(S.lib.tm).map(x=>x.st+':'+x.en.slice(0,40)+' => '+x.fr.slice(0,40)),done:S.lib.links.rork1.applied.filter(x=>/associ/.test(x))})));
// la bibliothèque affiche maintenant la capacité en français (confirmée)
await p.evaluate(()=>{const u=BIB.D.units.find(x=>x.n==='Boyz');tab='bib';draw();document.querySelector('[data-bib="unit"][data-id="'+u.id+'"]')});
const r=await p.evaluate(()=>{const u=BIB.D.units.find(x=>x.n==='Boyz');const a=u.ab.find(x=>x.n==='Never Too Busy to Fight');return{name:BIB.tAB(a.n),desc:BIB.trDesc(a.d)}});console.log('affichage bibliothèque:',JSON.stringify(r));
// généralisation : paramètre (Feel No Pain 5+ ↔ Insensible à la Douleur 5+)
console.log('généralisation:',await p.evaluate(()=>{const m={apt:'Insensible à la Douleur 5+',text:['Insensible à la Douleur 5+ Chaque fois que la figurine devrait perdre un PV, on lance un D6 : sur 5+, ce PV n’est pas perdu.']};BIB.learnAb(m,{n:'Feel No Pain 5+',d:'Each time this model would lose a wound, roll one D6: on a 5+, that wound is not lost.'},'Insensible à la Douleur 5+');return[BIB.tAB('Feel No Pain 4+'),BIB.tAB('Feel No Pain 6+')].map(x=>x.t+'/'+x.st)}));
console.log(errs);await b.close()})();
