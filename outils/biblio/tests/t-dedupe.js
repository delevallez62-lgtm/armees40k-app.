const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},isMobile:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(async()=>{await BIB.init()});
const r=await p.evaluate(()=>{const u=BIBAST.test.byName('Aggressor Squad');return{rw:u.rw.map(w=>w.n),mw:u.mw.map(w=>w.n)}});
console.log(JSON.stringify(r));
ok('Aggressors : Flamestorm en une seule ligne par profil',r.rw.filter(n=>/^➤ Flamestorm Gauntlets$/.test(n)).length===1&&r.rw.filter(n=>/Close-quarters$/.test(n)).length===1,r);
/* doublons sur toute la bibliothèque */
const dup=await p.evaluate(()=>{let n=0,ex=[];BIBAST.test.allUnits().forEach(u=>["rw","mw"].forEach(k=>{const s=new Set();(u[k]||[]).forEach(w=>{const key=[w.n,w.r,w.a,w.sk,w.s,w.ap,w.d,JSON.stringify((w.kw||[]).slice().sort())].join('|').toLowerCase();if(s.has(key)){n++;if(ex.length<5)ex.push(u.n+' : '+w.n)}s.add(key)})}));return{n,ex}});
ok('aucune arme en double dans la bibliothèque',dup.n===0,dup);
/* fiches existantes : doublons retirés, armes distinctes conservées */
const f=await p.evaluate(async()=>{S.coll={x1:{ref:'x1',name:'Aggressors',stats:{},weapons:[
 {name:'Flamestorm Gauntlets',range:'12"',a:'3',hit:'-',f:'4',pa:'-1',d:'1',caps:'Torrent'},
 {name:'Flamestorm Gauntlets',range:'12"',a:'3',hit:'-',f:'4',pa:'-1',d:'1',caps:'Torrent'},
 {name:'Flamestorm Gauntlets',range:'12"',a:'3',hit:'-',f:'5',pa:'-1',d:'1',caps:'Torrent'},
 {name:'Twin power fist',range:'Mêlée',a:'3',hit:'3+',f:'8',pa:'-2',d:'2',caps:''}]}};
 S.lists=[{id:'lx',name:'t',units:[{name:'A',ref:'x1',weapons:[{name:'Bolter',range:'24"',a:'2',hit:'3+',f:'4',pa:'0',d:'1',caps:''},{name:'Bolter',range:'24"',a:'2',hit:'3+',f:'4',pa:'0',d:'1',caps:''}],subs:[]}]}];
 BIBAST.test.dedupe();return{coll:S.coll.x1.weapons.map(w=>w.name+' F'+w.f),unit:S.lists[0].units[0].weapons.length}});
console.log(JSON.stringify(f));
ok('fiche : doublon exact retiré, profil de force différente et autre arme conservés',f.coll.length===3&&f.unit===1,f);
await b.close()})();
