const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();await BIB.init();
 const W=(n,r,a,h,f,pa,d)=>({name:n,range:r,a,hit:h,f,pa,d,caps:''});
 S.coll.tt={ref:'tt',name:'Tétrarque',stats:{M:'8',E:'9',SV:'3+',PV:'12',CD:'6+',CO:'4'},weapons:[W('Canon','24"','D6','4+','9','-2','3')],equip:'Canon',apt:'',text:[],kw:'Véhicule',fkw:'',pts:150,nb:0,subs:[]};
 // une fiche liée à la bibliothèque pour avoir une copie enregistrée
 S.coll.bz={ref:'bz',name:'Boyz',stats:{M:'6',E:'5',SV:'5+',PV:'1',CD:'7+',CO:'2'},weapons:[W("Kikoup'",'Mêlée','3','3+','5','-1','1')],equip:"Kikoup'",apt:'',text:[],kw:'',fkw:'',pts:85,nb:0,subs:[]};
 tab='coll';draw()});
const open=async r=>{await p.evaluate(r=>{ed=S.coll[r];ctx='coll';edit=false;draw();const d=document.querySelector('#md details.bib-dr');if(d)d.open=true},r);await p.waitForTimeout(400)};
await open('tt');console.log('Tétrarque sans lien:',await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');return d?d.innerText.replace(/\n/g,' | ').slice(0,200):'AUCUN TIROIR'}));
// notes personnelles via Modifier
await p.evaluate(()=>{edit=true;draw()});await p.waitForTimeout(300);
await p.evaluate(()=>{const t=document.querySelector('textarea[data-p="eqo"]');t.value="Peut remplacer son canon par un canon laser (max 1).";t.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(300);
await open('tt');console.log('avec notes:',await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');return d?d.innerText.replace(/\n/g,' | ').slice(0,220):'AUCUN'}));
// Boyz : copie enregistrée puis perte de la correspondance
await open('bz');console.log('Boyz (biblio):',await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');return d?d.innerText.replace(/\n/g,' | ').slice(0,120):'AUCUN'}),'eqx:',await p.evaluate(()=>!!S.coll.bz.eqx&&S.coll.bz.eqx.opt.length));
await p.evaluate(()=>{S.coll.bz.name='Zzz inconnu';S.coll.bz.stats={};S.coll.bz.weapons=[];delete S.lib.links.bz;Object.keys(BIB.D).length;});
await open('bz');console.log('Boyz après perte du lien:',await p.evaluate(()=>{const d=document.querySelector('#md details.bib-dr');return d?d.innerText.replace(/\n/g,' | ').slice(0,200):'AUCUN'}));
console.log('texte complet:',await p.evaluate(()=>document.querySelectorAll('#md details.bib-dr details summary').length));
console.log(errs);await b.close()})();
