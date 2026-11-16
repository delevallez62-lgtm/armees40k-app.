const {chromium}=require('playwright');const fs=require('fs');
const st=JSON.parse(fs.readFileSync(__dirname+'/etat.json','utf8'));
const mk=(ref,name,stats,weapons,apt,kw)=>({ref,name,pts:0,nb:0,stats,weapons,equip:'',apt:apt||'',kw:kw||'',fkw:'',text:[],subs:[]});
const W=(n,r,a,h,f,pa,d,c)=>({name:n,range:r,a,hit:h,f,pa,d,caps:c||''});
st.coll.rsm1=mk('rsm1','intercessor',{M:'6',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},[W('Fusil bolter','24','2','3+','4','-1','1'),W('Pistolet bolter','12','1','3+','4','0','1','Pistolet'),W('Arme de corps à corps','Mêlée','3','3+','4','0','1')],'','Infanterie');
st.coll.rork1=mk('rork1','boyz',{M:'6',E:'5',SV:'5+',PV:'1',CD:'7+',CO:'2'},[W("Fling'",'18','2','5+','4','0','1','Tir rapide 1')],'Waaagh!','Infanterie');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
await ctx.addInitScript(s=>{if(!sessionStorage.getItem('x')){localStorage.setItem('armees40k',s);sessionStorage.setItem('x',1)}},JSON.stringify(st));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;await BIB.init();tab='coll';draw()});await p.waitForTimeout(400);
const open=async ref=>{await p.evaluate(r=>{ed=S.coll[r];ctx='coll';edit=false;draw()},ref);await p.waitForTimeout(500)};
console.log('appariements auto:',await p.evaluate(()=>Object.fromEntries(['rsm1','rork1',Object.values(S.coll).find(m=>/immortels/i.test(m.name)).ref].map(r=>{const a=BIBAUTO(S.coll[r]);return[S.coll[r].name,a?a.u.n+' ['+a.level+'] '+a.why:null]}))));
await open('rork1');
console.log('Boyz — tiroir présent, fermé:',await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');return d?{open:d.open,txt:d.querySelector('summary').innerText}:null}));
await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');d.open=true;d.dispatchEvent(new Event('toggle'))});await p.waitForTimeout(300);
await p.evaluate(()=>{document.querySelector('#md details.bib-dr').scrollIntoView()});
console.log('contenu:',await p.evaluate(()=>{const t=document.querySelector('#md details.bib-dr').innerText;return{base:/Chaque figurine est équipée|Chaque Nob/.test(t),options:/peut remplacer son|peuvent chacune remplacer/.test(t),composition:/figurines/.test(t),warnEN:document.querySelectorAll('#md details.bib-dr .bib-warn').length,armes:document.querySelectorAll('#md details.bib-dr .bib-row').length,extrait:t.slice(0,420).replace(/\n/g,' | ')}}));
await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');const h=[...d.querySelectorAll('h4')].find(x=>/Options/.test(x.innerText));h.scrollIntoView({block:'start'})});await p.screenshot({path:'bib-dr1.png'});console.log('cartes options:',await p.evaluate(()=>document.querySelectorAll('#md .bib-oc .bib-oh').length));
// il reste ouvert après un redessin
await p.evaluate(()=>draw());await p.waitForTimeout(300);console.log('reste ouvert après redessin:',await p.evaluate(()=>document.querySelector('#md details.bib-dr').open));
// bouton EN
await p.evaluate(()=>{const b=document.querySelector('#md [data-bibdr="en"]');if(b)b.click()});await p.waitForTimeout(300);
console.log('bascule EN:',await p.evaluate(()=>/Any number|Every|equipped with/.test(document.querySelector('#md details.bib-dr').innerText)));
// intercessor : correspondance par profil (à vérifier ?)
await open('rsm1');
console.log('Intercessor tiroir:',await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');return d?d.querySelector('summary').innerText+' || '+d.querySelector('.bib-drb').innerText.slice(0,200).replace(/\n/g,' '):null}));
// non concerné : Immortels
await open(await p.evaluate(()=>Object.values(S.coll).find(m=>/immortels/i.test(m.name)).ref));
console.log('Immortels (Nécrons) :', await p.evaluate(()=>!!document.querySelector('#md details.bib-dr')));
// pas dans les listes
await p.evaluate(()=>{ed=null;S.cur=S.lists[0].id;tab='units';draw();ed=S.lists[0].units[0];ctx='list';draw()});await p.waitForTimeout(400);console.log('fiche de liste :',await p.evaluate(()=>!!document.querySelector('#md details.bib-dr')));
console.log(errs);await b.close()})();
