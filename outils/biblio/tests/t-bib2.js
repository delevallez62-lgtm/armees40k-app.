const {chromium}=require('playwright');const fs=require('fs');
const st=JSON.parse(fs.readFileSync(__dirname+'/etat.json','utf8'));
const mk=(ref,name,stats,weapons,apt,kw)=>({ref,name,pts:0,nb:0,stats,weapons,equip:'',apt:apt||'',kw:kw||'',fkw:'',text:[],subs:[]});
const W=(n,r,a,h,f,pa,d,c)=>({name:n,range:r,a,hit:h,f,pa,d,caps:c||''});
st.coll.rsm1=mk('rsm1','space marine intercessor',{M:'6',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'},[W('Fusil bolter','24','2','3+','4','-1','1'),W('Pistolet bolter','12','1','3+','4','0','1','Pistolet'),W('Arme de mêlée','Mêlée','3','3+','4','0','1')],'Tir de barrage','Infanterie');
st.coll.rork1=mk('rork1','boyz',{M:'6',E:'5',SV:'5+',PV:'',CD:'7+',CO:'2'},[W("Fling'",'18','2','5+','4','0','1','Tir rapide 1')],'Waaagh!','Infanterie, Orks');
st.lists[0].units.push({ref:'rork1',name:'boyz',size:10,pts:85,subs:[],stats:st.coll.rork1.stats,weapons:clone(st.coll.rork1.weapons),equip:'',apt:'',kw:'',fkw:'',text:[]});
function clone(o){return JSON.parse(JSON.stringify(o))}
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
await ctx.addInitScript(s=>{if(!sessionStorage.getItem('x')){localStorage.setItem('armees40k',s);sessionStorage.setItem('x',1)}},JSON.stringify(st));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
const o={};
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true});
o.init=await p.evaluate(async()=>{const D=await BIB.init();return{ready:D.ready,err:D.err,units:D.units.length,dets:D.dets.length,str:D.str.length,enh:D.enh.length,v:D.man.version,origin:D.origin}});
// séparation : la bibliothèque est dans IndexedDB, pas dans S / localStorage
o.sep=await p.evaluate(()=>({inS:JSON.stringify(S).length<3000000&&!/Intercessor Squad/.test(JSON.stringify(S)),ls:(localStorage.getItem('armees40k')||'').includes('Intercessor Squad')}));
// symbole : collection seulement
await p.evaluate(()=>{tab='coll';draw()});await p.waitForTimeout(500);
o.collBtns=await p.evaluate(()=>document.querySelectorAll('.tile .bibb').length);
await p.evaluate(()=>{tab='lists';draw()});await p.waitForTimeout(300);o.listsBtns=await p.evaluate(()=>document.querySelectorAll('.bibb').length);
await p.evaluate(()=>{S.cur=S.lists[0].id;tab='units';draw()});await p.waitForTimeout(300);o.unitsBtns=await p.evaluate(()=>document.querySelectorAll('.bibb').length);
// suggestions
o.sug=await p.evaluate(()=>{const f=n=>BIB.suggest(Object.values(S.coll).find(m=>m.name===n)).map(x=>x.u.n+'('+x.sc.toFixed(2)+')');return{necron:f('immortels').concat(Object.values(S.coll).filter(m=>/guerrier/i.test(m.name)).map(m=>BIB.suggest(m).length)),marine:f('space marine intercessor'),boyz:f('boyz')}});
console.log(JSON.stringify(o,null,1));

const snap=()=>p.evaluate(()=>JSON.stringify({coll:Object.keys(S.coll).length,lists:S.lists.map(l=>l.units.map(u=>u.name+':'+u.weapons.length)),boyz:S.coll.rork1,ic:S.coll.rsm1}));
const before=await snap();
// rapprochement Boyz via le symbole
await p.evaluate(()=>{tab='coll';draw()});await p.waitForTimeout(300);
await p.evaluate(()=>document.querySelector('.tile .bibb[data-r="rork1"]').click());await p.waitForTimeout(600);
console.log('suggestions Boyz:',await p.evaluate(()=>[...document.querySelectorAll('#bibsr .bib-row b')].map(x=>x.innerText).join(' | ')));await p.screenshot({path:'bib-link.png'});
await p.evaluate(()=>document.querySelector('#bibsr [data-bib="cmp"]').click());await p.waitForTimeout(700);
console.log('cmp titre:',await p.evaluate(()=>document.querySelector('#bibm .bib-pn p').innerText));

const cmp=await p.evaluate(()=>[...document.querySelectorAll('#bibm .bib-pn h4')].map(h=>h.innerText+' → '+(h.nextElementSibling?h.nextElementSibling.innerText.slice(0,90).replace(/\n/g,' / '):'')));
console.log(cmp.join('\n'));await p.screenshot({path:'bib-cmp.png'});
// rien n'a changé avant validation
console.log('avant validation inchangé:',(await snap())===before);
// valider
await p.evaluate(()=>document.querySelector('[data-bib="apply"]').click());await p.waitForTimeout(600);
const after=JSON.parse(await snap());const b0=JSON.parse(before);
console.log('Boyz après:',JSON.stringify({stats:after.boyz.stats,nweap:after.boyz.weapons.length,w0:after.boyz.weapons[0],apt:after.boyz.apt,kw:after.boyz.kw,txt:after.boyz.text.length}).slice(0,700));
console.log('Fling conservé tel quel:',JSON.stringify(after.boyz.weapons[0])===JSON.stringify(b0.boyz.weapons[0]),'| nb fiches coll:',b0.coll===after.coll,'| listes inchangées:',JSON.stringify(b0.lists)===JSON.stringify(after.lists));
console.log('lien:',await p.evaluate(()=>JSON.stringify(S.lib.links.rork1)));
// annuler les ajouts
await p.evaluate(()=>document.querySelector('.tile .bibb[data-r="rork1"]').click());await p.waitForTimeout(500);
console.log('déjà rapprochée:',await p.evaluate(()=>/Déjà rapprochée/.test(document.querySelector('#bibm').innerText)));
console.log(errs);await b.close()})();
