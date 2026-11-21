const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Sim';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
async function open(q,match,size){await click('[data-bld="add"]');await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},q);await wait(250);
 await ev(m=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>new RegExp(m,'i').test(x.querySelector('b').innerText));c.click()},match);await wait(300);await click('[data-bld="size"][data-v="'+size+'"]');await wait(150)}
const fig=async i=>{await click('[data-bld="fig"][data-i="'+i+'"]')};
const chips=()=>ev(()=>[...document.querySelectorAll('#bldm .bld-fcw')].map(w=>({t:w.querySelector('.bld-fc').innerText.trim(),on:w.querySelector('.bld-fc').classList.contains('on'),off:w.querySelector('.bld-fc').disabled,why:(w.querySelector('.bld-why')||{}).innerText||''})));
const pick=async re=>{await ev(re=>{const e=[...document.querySelectorAll('#bldm .bld-fc')].find(x=>new RegExp(re,'i').test(x.innerText)&&!x.disabled);if(!e)throw new Error('option absente '+re);e.click()},re);await wait(250)};
const pop=()=>ev(()=>{const p=document.getElementById('lckpop');return p?p.innerText.replace(/\n+/g,' | '):null});
const pm=(re,d)=>ev(([re,d])=>{const rows=[...document.querySelectorAll('#bldm .bld-pr')].filter(r=>new RegExp(re,'i').test(r.querySelector('.bld-pl').innerText));if(!rows.length)throw new Error('ligne absente '+re);const b=rows[0].querySelector('button[data-d="'+d+'"]');if(b.disabled)return false;b.click();return true},[re,d]);
const cntOf=re=>ev(re=>{const r=[...document.querySelectorAll('#bldm .bld-pr')].find(r=>new RegExp(re,'i').test(r.querySelector('.bld-pl').innerText));return r?+r.querySelector('.bld-st b').innerText:null},re);
const plusOn=re=>ev(re=>{const r=[...document.querySelectorAll('#bldm .bld-pr')].find(r=>new RegExp(re,'i').test(r.querySelector('.bld-pl').innerText));return r?!r.querySelector('button[data-d="1"]').disabled:null},re);
// ---- Escouade de Terminators, 5 figurines : + / − par arme
await open('terminator','^Escouade de Terminators$',5);
ok('lignes + / − affichées',await ev(()=>document.querySelectorAll('#bldm .bld-pr').length>=3),await ev(()=>document.querySelectorAll('#bldm .bld-pr').length));
ok('poing tronçonneur : 0 au départ',await cntOf('tron|chainfist')===0,await cntOf('tron|chainfist'));
await pm('tron|chainfist',1);await pm('tron|chainfist',1);await wait(200);
ok('poing tronçonneur : + deux fois → 2',await cntOf('tron|chainfist')===2,await cntOf('tron|chainfist'));
await pm('tron|chainfist',-1);await wait(200);
ok('poing tronçonneur : − → 1',await cntOf('tron|chainfist')===1,await cntOf('tron|chainfist'));
await pm('lance-flammes|heavy flamer',1);await wait(200);
ok('arme spéciale : + → 1',await cntOf('lance-flammes|heavy flamer')===1,await cntOf('lance-flammes|heavy flamer'));
ok('arme spéciale : le + des autres armes spéciales est bloqué (1 pour 5)',await plusOn('canon d.assaut|assault cannon')===false&&await plusOn('cyclone')===false,[await plusOn('canon d.assaut|assault cannon'),await plusOn('cyclone')]);
ok('le + du lance-flammes lui-même est aussi bloqué',await plusOn('lance-flammes|heavy flamer')===false,1);
ok('équipement dérivé cohérent',await ev(()=>Object.keys(BLDSTATE.cfg.wq).some(k=>/lance-flammes|heavy flamer/i.test(k))&&Object.keys(BLDSTATE.cfg.wq).some(k=>/chainfist/i.test(k))),await ev(()=>Object.keys(BLDSTATE.cfg.wq)));
await pm('lance-flammes|heavy flamer',-1);await wait(200);
ok('− libère de nouveau les armes spéciales',await plusOn('canon d.assaut|assault cannon')===true,await plusOn('canon d.assaut|assault cannon'));
await click('[data-bld="size"][data-v="10"]');await wait(200);
await pm('canon d.assaut|assault cannon',1);await pm('lance-flammes|heavy flamer',1);await wait(200);
ok('10 fig. : deux armes spéciales possibles',await cntOf('canon d.assaut|assault cannon')===1&&await cntOf('lance-flammes|heavy flamer')===1,1);
ok('10 fig. : une troisième est bloquée',await plusOn('cyclone')===false,await plusOn('cyclone'));
await p.screenshot({path:'fig3.png'});
// ---- composition variable (moteur) : Boyz
const bz=await ev(async()=>{const E=BIBLCK.eqe();const u=BIB.D.units.find(x=>x.n==='Boyz');const M=E.model(u);
 const f10=E.newFigs(M,10),f20=E.newFigs(M,20);const t10=E.tally(f10),t20=E.tally(f20);
 const v20=E.validate(M,20,f20);const up=E.setCount(M,20,f20,0,1);
 /* 11 figurines : 1 Nob + 10 Boyz ou 2 Nobs + 9 Boyz */
 const f11=E.newFigs(M,11);const a=E.tally(f11);const sw=E.setCount(M,11,f11,0,1);const b=sw?E.tally(sw):null;
 return{flex:E.flexN(M),t10,t20,errs20:v20.errors.length,up:up===null,a,b,swLen:sw?sw.length:0}});
ok('Boyz : composition variable prise en charge (2 types variables)',bz.flex===2,bz);
ok('Boyz 10 : 1 Nob + 9 Boyz ; 20 : 2 Nobs + 18 Boyz',bz.t10[0]===1&&bz.t10[1]===9&&bz.t20[0]===2&&bz.t20[1]===18&&bz.errs20===0,bz);
ok('Boyz 11 : on peut passer de 1 Nob + 10 Boyz à 2 Nobs + 9 Boyz',bz.a[0]===1&&bz.b&&bz.b[0]===2&&bz.b[1]===9&&bz.swLen===11,bz);
await b.close()})();
