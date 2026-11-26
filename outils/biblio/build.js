/* ===== Constructeur d'armée V11 : catalogue visuel, effectifs, armes, meneurs, détachement, optimisations, points ===== */
const BLD={id:null,scr:"home",step:"1",q:"",src:"all",fac:"",role:"",cfg:null,ldr:null,dq:"",lq:"",log:null};
const RG=r=>{r=String(r||"");return/Epic Hero/i.test(r)?"Héros épiques":/Character/i.test(r)?"Personnages":/Battleline/i.test(r)?"Ligne":/Dedicated Transport/i.test(r)?"Transports assignés":/Aircraft/i.test(r)?"Aéronefs":/Titanic/i.test(r)?"Titanesques":/Monster/i.test(r)?"Monstres":/Walker/i.test(r)?"Marcheurs":/Mounted/i.test(r)?"Montés":/Vehicle/i.test(r)?"Véhicules":/Infantry/i.test(r)?"Infanterie":/Fortification/i.test(r)?"Fortifications":r||"Autre"};
const roleOf=u=>{if(!u)return"Autre";const r=u.wp&&u.wp.role;if(r)return RG(r);const k=(u.kw||[]).join(" ");return RG(/Epic Hero/i.test(k)?"Epic Hero":/Character/i.test(k)?"Character":/Battleline/i.test(k)?"Battleline":/Vehicle/i.test(k)?"Vehicle":/Monster/i.test(k)?"Monster":/Infantry/i.test(k)?"Infantry":"")};
const isChar=u=>/Personnage|Héros/.test(roleOf(u));
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const ptsMeta=()=>{const m=D.man||{},p=(m.source&&m.source.points)||{};return{src:p.source||"Données de la bibliothèque",pub:p.published||(m.source&&m.source.wahapedia&&m.source.wahapedia.last_update)||"",ver:m.version||"",sync:p.synchronised||m.generated||"",chk:(LB().last&&LB().last.at)||0}};
const ptsVer=()=>ptsMeta().pub+"|"+ptsMeta().ver.replace(/\+fr\d+(\.[0-9a-f]+)?/,"");
/* points de détachement : 500 pts = 1, 1 000 pts = 2, 2 000 pts = 3 (règle donnée par l'utilisateur) */
const dpMax=lim=>lim>=2000?3:lim>=1000?2:lim>=500?1:0;
function detsOf(L){const b=L.bld||(L.bld={});if(!Array.isArray(b.dets))b.dets=b.det?[{id:b.det.id,name:b.det.name,en:b.det.en||b.det.name}]:[];
 return b.dets.map(d=>{const x=D.dets.find(z=>z.id===d.id);return Object.assign({},d,{dp:x&&x.pts!=null?+x.pts:null,x})})}
const dpUsed=L=>detsOf(L).reduce((a,d)=>a+(d.dp||0),0);
const enhFor=L=>{const ds=detsOf(L);return ds.length?D.enh.filter(x=>ds.some(d=>nk(x.det||"")===nk(d.en))):[]};
/* ----- barème ----- */
const pcOf=u=>u&&((u.wp&&u.wp.pc)||u.pc)||null;
const tierFor=(pc,copy)=>pc.tiers.find(t=>copy>=t.a&&(t.b==null||copy<=t.b))||pc.tiers[pc.tiers.length-1];
function sizesOf(u,copy){if(!u)return[];const pc=pcOf(u);if(pc)return tierFor(pc,copy).sz.map(x=>({n:x.n,m:x.m||x.n,pts:x.pts}));
 if(u.sz&&u.sz.min!=null){const a=[];for(let n=u.sz.min;n<=Math.min(u.sz.max,u.sz.min+12);n++)a.push({n,m:n,pts:n===u.sz.min&&u.pts!=null?+u.pts:null});return a}return[]}
function costOf(u,size,copy){if(!u)return{pts:null,note:"Coût à vérifier"};const pc=pcOf(u);
 if(pc){const t=tierFor(pc,copy),r=t.sz.find(x=>size===x.n||(x.m&&size>=x.n&&size<=x.m));return r?{pts:r.pts,src:"Wahapedia 11e",tier:t.a+(t.b==null?"+":t.b!==t.a?"–"+t.b:"")}:{pts:null,note:"Effectif hors barème : coût à vérifier"}}
 if(u.pts!=null&&(!u.sz||size===u.sz.min))return{pts:+u.pts,src:"BSData"};return{pts:null,note:"Coût à vérifier"}}
/* ----- moteur de points centralisé ----- */
function calc(L){const lines=[],seen={};let total=0,unk=0;const bump=id=>seen[id]=(seen[id]||0)+1;
 const add=(ln)=>{lines.push(ln);if(ln.pts==null)unk++;else total+=ln.pts};
 (L.units||[]).forEach((u,i)=>{const c=u.cfg,lu=c&&c.lib&&D.byId[c.lib];
  if(!lu||u.pm){add({i,k:"u",name:u.name,sz:u.size,pts:+u.pts||0,note:u.pm?"coût modifié à la main":"coût saisi à la main"});(u.subs||[]).forEach((s,j)=>add({i,j,k:"l",name:(s.label||"Meneur")+" : "+s.name,pts:+((S.coll[s.ref]||{}).pts??s.pts)||0,note:"coût saisi à la main"}));return}
  const copy=bump(lu.id),cs=costOf(lu,c.size,copy);
  add({i,k:"u",name:u.name,sz:c.size,pts:cs.pts,note:cs.note||("barème "+cs.src+(cs.tier?" · exemplaire "+cs.tier:"")),lib:lu.id});
  const pc=pcOf(lu);((pc&&pc.wg)||[]).forEach(w=>{const q=(c.wg||{})[w.n]||0;if(q)add({i,k:"w",name:q+" × "+w.n,pts:q*w.pts,note:w.pts+" pts pièce"})});
  if(c.enh&&c.enh.id){const e=D.enh.find(x=>x.id===c.enh.id);add({i,k:"e",name:"Optimisation : "+(e?tName(e.n).t:c.enh.name),pts:e&&e.pts!=null?+e.pts:null,note:e&&e.pts!=null?"":"Coût à vérifier"})}
  (u.subs||[]).forEach((s,j)=>{const sc=s.cfg,sl=sc&&sc.lib&&D.byId[sc.lib];if(!sl){add({i,j,k:"l",name:(s.label||"Meneur")+" : "+s.name,pts:+((S.coll[s.ref]||{}).pts??s.pts)||0,note:"coût saisi à la main"});return}
   const cp=bump(sl.id),cc=costOf(sl,sc.size||1,cp);add({i,j,k:"l",name:(s.label||"Meneur")+" : "+s.name,pts:cc.pts,note:cc.note||("barème "+cc.src+(cc.tier?" · exemplaire "+cc.tier:"")),lib:sl.id});
   if(sc.enh&&sc.enh.id){const e=D.enh.find(x=>x.id===sc.enh.id);add({i,j,k:"e",name:"Optimisation : "+(e?tName(e.n).t:sc.enh.name),pts:e&&e.pts!=null?+e.pts:null,note:e&&e.pts!=null?"":"Coût à vérifier"})}})});
 return{lines,total,unk}}
/* écrit les coûts dans les champs classiques (points d'unité) pour que le reste de l'appli reste cohérent */
function applyPts(L){try{const R=calc(L);(L.units||[]).forEach((u,i)=>{if(!u.cfg||u.pm)return;const mine=R.lines.filter(l=>l.i===i&&l.j==null&&l.pts!=null);u.pts=mine.reduce((a,l)=>a+l.pts,0);u.size=u.cfg.size;
  (u.subs||[]).forEach((s,j)=>{if(!s.cfg)return;const sl=R.lines.filter(l=>l.i===i&&l.j===j&&l.pts!=null);s.pts=sl.reduce((a,l)=>a+l.pts,0)})});return R}catch(_){return calc(L)}}
/* mise à jour du barème : recalcul, différences conservées, effectifs et équipements intacts */
function syncPts(L){const b=L.bld;if(!b)return;const R=calc(L),old=b.tot==null?R.total:b.tot,ver=ptsVer();
 if(b.pv&&b.pv!==ver){const ch=[];(L.units||[]).forEach((u,i)=>{if(!u.cfg)return;const nw=R.lines.filter(l=>l.i===i&&l.j==null&&l.pts!=null).reduce((a,l)=>a+l.pts,0);if(Math.abs(nw-(+u.pts||0))>0&&u.pts!=null)ch.push({n:u.name,o:+u.pts||0,p:nw})});
  if(ch.length||R.total!==old){b.log=b.log||[];b.log.unshift({at:Date.now(),v:ver,o:old,n:R.total,ch,seen:false});b.log=b.log.slice(0,10)}}
 b.pv=ver;const R2=applyPts(L);b.tot=R2.total}
/* ----- accès aux listes ----- */
const curL=()=>(S.lists||[]).find(l=>l.id===BLD.id)||null;
const imgOf=m=>(m&&S.imgs&&S.imgs[m.ref])||"";
/* profils d'une même arme (« - Standard », « – frag », « (Supercharge) ») : une seule arme */
const wgk=n=>String(n||"").replace(/^➤\s*/,"").replace(/\s*\(.*?\)\s*$/,"").split(/\s+[-–]\s+/)[0].trim();
const wgBase=w=>wgk(w.en||w.name);
const wgroups=W=>{const m=new Map();(W||[]).forEach(w=>{const k=nk(wgBase(w));if(!m.has(k)){let nm=wgk(w.name);if(w.en){try{nm=frName(wgk(w.en))||nm}catch(_){}}m.set(k,{key:k,name:nm,base:lckBase(wgBase(w)),ws:[]})}m.get(k).ws.push(w)});return[...m.values()]};
/* « 9 × Épée ; 1 × Marteau — Sergent » ou « Fusil, Épée » -> totaux par arme */
function eqFromText(t,size){const o={};String(t||"").split(/;|\n|,(?![^()]*\))/).forEach(x=>{x=x.trim();if(!x)return;const m=/^(\d+)\s*[x×]\s*(.+?)(?:\s+[—–-]\s+.*)?$/.exec(x);if(m){const k=m[2].trim();o[k]=Math.max(o[k]||0,+m[1])}else{const k=x.replace(/\s*\(\s*\d+\s*\)\s*$/,"").replace(/\s+[—–-]\s+.*$/,"").trim();if(k)o[k]=Math.max(o[k]||0,size||1)}});return o}
/* ----- équipement figurine par figurine (moteur EQE) ----- */
const figMode=c=>!!(c&&c.figs);
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.dataset&&d.dataset.figdr!==undefined){BLD.figDr=BLD.figDr||{};BLD.figDr[d.dataset.figdr]=d.open}if(d&&d.dataset&&d.dataset.figd!==undefined)BLD.figOpen=d.open;if(d&&d.dataset&&d.dataset.figq!==undefined)BLD.figQ=d.open},true);
function figSync(c,e){const M=EQE.model(e.lib),v=EQE.validate(M,c.size,c.figs),tot=EQE.totals(v.final),wq={};
 wgroups(weaponsOf(e)).forEach(g=>{const t=tot[g.base||lckBase(g.name)];if(t&&t.q>0)g.ws.forEach(w=>{wq[w.name]=t.q})});c.wq=wq;c.wn={};c.figErr=v.errors;c.figEq=Object.values(tot).filter(t=>t.q>0).map(t=>t.q+" × "+EQE.itemTxt(t.n))}
function figInit(c,e){if(!e.lib||c.figs===null)return;let M;try{M=EQE.model(e.lib)}catch(_){return}if(!M||!M.usable||!EQE.counts(M,c.size))return;
 if(!c.figs||c.figs.length!==c.size){if(c.figs){c.figs=EQE.resize(M,c.size,c.figs)||EQE.newFigs(M,c.size)}else{const had=c.idx!=null&&Object.keys(c.wq||{}).length;c.figs=had?EQE.fromCounts(M,c.size,c.wq):EQE.newFigs(M,c.size)}}
 if(!c.figs)return;BLD.fig=0;BLD.figSheet=false;figSync(c,e)}
const typeLabel=n=>{let r;try{r=tName(n)}catch(_){r=null}if(r&&(r.st==="ok"||r.prop))return r.st==="ok"?r.t:r.prop;return String(n).replace(/\bSergeant\b/g,"Sergent").replace(/\bLeader\b/g,"Chef").replace(/\bVeterans?\b/g,"Vétéran").replace(/\bwith\b/g,"avec").replace(/\bJump Pack\b/g,"réacteur dorsal")};
const figName=(M,figs,i)=>{const f=figs[i],t=M.types[f.t];const same=figs.filter(g=>g.t===f.t);if(same.length<2)return typeLabel(t.name);return typeLabel(t.name)+" "+(figs.slice(0,i+1).filter(g=>g.t===f.t).length)};
const figSum=(M,final,i)=>final[i].map(x=>EQE.itemTxt(x.n)+(x.q>1?" ×"+x.q:"")).join(" · ");
const wstat=w=>`${w.range&&w.range!=="Mêlée"?E(w.range)+(/^\d/.test(w.range)?'"':"")+" · ":(w.range?E(w.range)+" · ":"")}A ${E(w.a)} · ${E(w.hit)} · F ${E(w.f)} · PA ${E(w.pa)} · D ${E(w.d)}${w.caps?" · "+E(w.caps):""}`;
function wprof(e,items,cmp){const G=wgroups(weaponsOf(e));return(items||[]).map(it=>{const b=lckBase(it.n),g=G.find(x=>(x.base||lckBase(x.name))===b);if(!g)return"";return g.ws.map((w,wi)=>{const suf=String(w.name).replace(/^➤\s*/,"").slice(wgk(w.name).length).replace(/^\s*[-–]\s*/,"").replace(/^\((.*)\)$/,"$1").trim(),mel=!w.range||/m[êe]l/i.test(w.range),rg=mel?"Mêlée":E(w.range)+(/^\d/.test(w.range)?'"':""),
 cw=cmp&&cmp.length?(cmp.length===g.ws.length?cmp[wi]:(cmp.length===1?cmp[0]:null)):null,
 cells=[["Portée",rg,"range"],["A",w.a,"a"],[mel?"CC":"CT",w.hit,"hit"],["F",w.f,"f"],["PA",w.pa,"pa"],["D",w.d,"d"]],ab=String(w.caps||"").split(/\s*,\s*/).filter(x=>x&&x!=="-"),
 nz=x=>String(x==null?"":x).replace(/[\s"]/g,"").toLowerCase(),cmel=cw&&(!cw.range||/m[êe]l/i.test(cw.range));
 return`<span class="bld-ws">${suf&&g.ws.length>1?'<span class="bld-md">'+E(suf)+"</span>":""}<span class="bld-sg">${cells.map(([l,v,k])=>{const df=cw&&(k==="range"?(cmel?"mêlée":nz(cw.range))!==(mel?"mêlée":nz(w.range)):nz(cw[k])!==nz(w[k]));return`<span${df?' class="df"':""}><i>${l}</i><b>${E(v==null||v===""?"–":v)}</b></span>`}).join("")}</span>${ab.length?`<span class="bld-ab">${ab.map(x=>`<em>${E(x)}</em>`).join("")}</span>`:""}</span>`}).join("")}).join("")}
const wob=(e,items)=>{const G=wgroups(weaponsOf(e)),out=[];(items||[]).forEach(it=>{const b=lckBase(it.n),g=G.find(x=>(x.base||lckBase(x.name))===b);if(g)g.ws.forEach(w=>out.push(w))});return out};
const dnum=x=>{const t=String(x==null?"":x);if(/d/i.test(t))return null;const m=t.match(/-?\d+/);return m?+m[0]:null};
function wdelta(A,B){if(!A.length||!B.length)return"";if(A.length!==1||B.length!==1)return'<span class="bld-dl"><i class="dn">plusieurs modes de tir : compare les profils ci-dessus</i></span>';
 const a=A[0],b=B[0],o=[];[["Portée","range",1],["Attaques","a",1],["Touche","hit",-1],["Force","f",1],["PA","pa",-1],["Dégâts","d",1]].forEach(([l,k,sg])=>{const x=a[k],y=b[k];if(String(x)===String(y))return;
  if(k==="range"&&(/m[êe]l/i.test(x)||/m[êe]l/i.test(y))){if(/m[êe]l/i.test(x)!==/m[êe]l/i.test(y))o.push(`<i class="dn">${l} : ${E(y)} → ${E(x)}</i>`);return}
  const nx=dnum(x),ny=dnum(y);if(nx!=null&&ny!=null&&nx!==ny){const ok=(nx-ny)*sg>0;o.push(`<i class="${ok?"du":"dd"}">${ok?"▲":"▼"} ${l} : ${E(y)} → ${E(x)}</i>`)}else o.push(`<i class="dn">${l} : ${E(y)} → ${E(x)}</i>`)});
 return`<span class="bld-dl">${o.length?o.join(""):'<i class="dn">mêmes caractéristiques</i>'}</span>`}
const kindOf=ws=>{const k=new Set((ws||[]).map(w=>!w.range||/m[êe]l/i.test(w.range)?"m":"t"));return k.size===2?"x":k.has("m")?"m":k.has("t")?"t":"n"};
const kindBadge=ws=>{const k=kindOf(ws);return k==="m"?'<span class="bld-k m">Mêlée</span>':k==="t"?'<span class="bld-k t">Tir</span>':k==="x"?'<span class="bld-k t">Tir</span><span class="bld-k m">Mêlée</span>':""};
function twinSim(c,M,idx,tw){let nf=JSON.parse(JSON.stringify(c.figs));const src=JSON.stringify(nf[idx].c||{}),ok=[],no=[];
 for(const j of tw){const t=JSON.parse(JSON.stringify(nf));t[j].c=JSON.parse(src);const before=EQE.validate(M,c.size,nf).errors.length;if(EQE.validate(M,c.size,t).errors.length<=before){nf=t;ok.push(j)}else no.push(j)}
 return{ok,no}}
function figSheetHtml(c,e,M){const v=EQE.validate(M,c.size,c.figs),sel=Math.min(BLD.fig||0,c.figs.length-1),f=c.figs[sel],t=M.types[f.t],lib=e.lib;
 const pr=((lib&&lib.pr)||[]);const p=pr.find(x=>nk(x.n)===nk(t.name))||pr[0];
 const L=[["Mvt","M"],["End.","E"],["Svg","SV"],["PV","PV"],["Cd","CD"],["CO","CO"]];
 let h=`<div class="bib-top"><h2>${E(e.name)}</h2><button class="b" data-bld="figback">← Retour</button></div><div class="bld-fiche"><div class="bld-nav"><button type="button" class="bld-na" data-bld="fignav" data-i="${sel-1}" ${sel<=0?"disabled":""} aria-label="Figurine précédente">‹</button><div class="bld-nt"><b>${E(figName(M,c.figs,sel))}</b><small>Figurine ${sel+1} / ${c.figs.length}</small></div><button type="button" class="bld-na" data-bld="fignav" data-i="${sel+1}" ${sel>=c.figs.length-1?"disabled":""} aria-label="Figurine suivante">›</button></div>${c.figs.length>1?`<div class="bld-fnav">${c.figs.map((g,j)=>`<button type="button" class="${j===sel?"on":""}" data-bld="fignav" data-i="${j}" aria-label="Figurine ${j+1}" ${j===sel?'aria-current="true"':""}>${j+1}</button>`).join("")}</div>`:""}${p?`<div class="bld-fst">${L.map(([n,k])=>`<span><i>${n}</i><b>${E(p[k]!=null?p[k]:"–")}</b></span>`).join("")}</div>`:""}</div>`;
 {const tw=(BLD.figTwins||[]).filter(k=>k!==sel&&k<c.figs.length&&c.figs[k].t===f.t),chg=JSON.stringify(f.c||{})!==BLD.figBase;
  if(tw.length&&!chg)h+=`<div class="bld-twin"><b>🧬 ${tw.length} autre${tw.length>1?"s":""} figurine${tw.length>1?"s":""} ${tw.length>1?"ont":"a"} le même équipement</b> (${tw.map(k=>E(figName(M,c.figs,k))).join(", ")})<small>Change une arme ci-dessous : tu pourras ensuite choisir combien de ces figurines reçoivent le même changement.</small></div>`;
  if(tw.length&&chg){const n=Math.max(1,Math.min(tw.length,BLD.figTwinN==null?tw.length:BLD.figTwinN));h+=`<div class="bld-twin"><b>🧬 ${tw.length} autre${tw.length>1?"s":""} figurine${tw.length>1?"s":""} avai${tw.length>1?"ent":"t"} le même équipement</b> (${tw.map(k=>E(figName(M,c.figs,k))).join(", ")})${tw.length>1?`<div class="bld-pr" style="margin-top:8px"><span class="bld-pl">Combien en modifier ?</span><span class="bld-st"><button type="button" data-bld="figtwinn" data-d="-1" ${n<=1?"disabled":""} aria-label="Moins">−</button><b>${n}</b><button type="button" data-bld="figtwinn" data-d="1" ${n>=tw.length?"disabled":""} aria-label="Plus">+</button></span></div>`:""}${(()=>{const sim=twinSim(c,M,sel,tw.slice(0,n));return`<div class="bld-tc"><b>${sim.ok.length}</b> figurine${sim.ok.length>1?"s":""} sera${sim.ok.length>1?"ont":""} modifiée${sim.ok.length>1?"s":""} : ${sim.ok.map(k=>E(figName(M,c.figs,k))).join(", ")||"aucune"}${sim.no.length?`<br><span class="bld-tn">${sim.no.length} non éligible${sim.no.length>1?"s":""} (plafond atteint ou option interdite) : ${sim.no.map(k=>E(figName(M,c.figs,k))).join(", ")}</span>`:""}</div>`})()}<button type="button" class="b p" data-bld="figtwin">Appliquer à ${twinSim(c,M,sel,tw.slice(0,n)).ok.length} figurine${twinSim(c,M,sel,tw.slice(0,n)).ok.length>1?"s":""} identique${twinSim(c,M,sel,tw.slice(0,n)).ok.length>1?"s":""}</button><small>Facultatif : sinon, elles gardent leur équipement.</small></div>`}}
 h+=v.errors.length?`<div class="bld-vd bad">❌ ${v.errors.slice(0,3).map(x=>E(x.msg)).join(" · ")}</div>`:`<div class="bld-vd ok">✅ Équipement conforme</div>`;
 h+=`<div class="bld-sec">🎒 Ce que porte cette figurine</div>`+((v.final[sel]||[]).map(x=>`<div class="bld-fw"><b>${E(EQE.itemTxt(x.n))}${x.q>1?" ×"+x.q:""}</b>${wprof(e,[x])||'<span class="bld-ws">Profil non disponible</span>'}</div>`).join("")||'<p class="bib-meta">Aucun équipement connu.</p>');
 const opts=EQE.options(M,c.size,c.figs,sel);
 h+=`<div class="bld-sec ch">🔁 Que veux-tu changer ? <small>Touche une ligne pour ouvrir ses choix. Tes choix comptent tout de suite.</small></div><div class="bld-leg"><span><b>✓</b> choisi</span><span><b>🔒</b> impossible (la raison est écrite)</span><span><b class="df-k">▢</b> cadre doré = valeur différente de l'arme actuelle</span></div>`+(opts.length?opts.map(o=>{const used=c.figs.filter(g=>((g.c||{})[o.rule.id]||[]).length).length,baseW=wob(e,(o.rule.from||[]).map(n=>({n}))),cur=((f.c||{})[o.rule.id]||[]).length;
  const alts=o.alts.slice().sort((x,y)=>(y.ok||y.sel?1:0)-(x.ok||x.sel?1:0));
  const selA=o.alts.find(x=>x.sel),curItems=selA?o.rule.alts[selA.ai]:(o.rule.from||[]).map(n=>({n})),curQ=wprof(e,curItems),nOff=o.alts.filter(x=>!x.ok&&!x.sel).length;
  return`<details class="bld-fo bld-dr${selA?" chg":""}" data-figdr="${o.rule.id}"${BLD.figDr&&BLD.figDr[o.rule.id]?" open":""}><summary><span class="bld-dk">${o.from?"Remplacer":"Ajouter"}</span><span class="bld-dn">${selA?"✓ "+E(selA.txt):(o.from?E(o.from)+" <em>(de base)</em>":"Rien de plus")}</span>${curQ?`<span class="bld-wp">${curQ}</span>`:""}<span class="bld-dh">${o.alts.length} choix${nOff?" · "+nOff+" 🔒":""} · limite ${o.cap} figurine${o.cap>1?"s":""} (${used} utilisée${used>1?"s":""}) <b>▾ voir</b></span></summary><div class="bld-fcs"><span class="bld-fcw"><button type="button" class="bld-fc bld-fb${cur?"":" on"}" data-bld="figbase" data-r="${o.rule.id}"><span class="bld-n">${cur?"↩ Revenir à":"✓ Garder"} : ${o.from?E(o.from)+" (de base)":"rien de plus"}</span>${(()=>{const q=wprof(e,(o.rule.from||[]).map(n=>({n})));return q?`<span class="bld-wp">${q}</span>`:""})()}</button></span>${alts.map(a=>`<span class="bld-fcw"><button type="button" class="bld-fc kd-${kindOf(wob(e,o.rule.alts[a.ai]))}${a.sel?" on":a.ok?"":" off"}" ${a.ok?"":"disabled"} data-bld="figo" data-r="${o.rule.id}" data-a="${a.ai}"><span class="bld-n"><span class="bld-ix">${alts.indexOf(a)+1}</span>${a.sel?"✓ ":a.ok?"":"🔒 "}${E(a.txt)}${kindBadge(wob(e,o.rule.alts[a.ai]))}</span>${(()=>{const q=wprof(e,o.rule.alts[a.ai],baseW);return q?`<span class="bld-wp">${q}</span>`:""})()}</button>${a.ok&&o.rule.kind==="any"?`<button type="button" class="bld-fa" data-bld="figall" data-r="${o.rule.id}" data-a="${a.ai}" title="Appliquer à toutes les figurines possibles">Toutes</button>`:""}${!a.ok&&a.why?`<small class="bld-why">🔒 ${E(a.why)}</small>`:""}</span>`).join("")}</div></details>`}).join(""):`<p class="bib-meta">Cette figurine n'a aucune option : elle garde son équipement de base.</p>`);
 if(lib&&lib.wp&&((lib.wp.opt||[]).length||lib.wp.loadout))h+=`<div class="bld-sec op">📜 Options d'équipement de l'unité</div><div class="bld-ops">${lib.wp.loadout?`<p>${frItem(lib.wp.loadout,"équipement de base").html}</p>`:""}<ul>${(lib.wp.opt||[]).map(o=>`<li>${frItem(o,"option d'équipement").html}</li>`).join("")}</ul></div>`;
 h+=`<div class="bld-bar"><button class="b p" data-bld="figback" style="flex:1">✔ Enregistrer — retour aux figurines</button></div>`;return h}
function figHtml(c,e,M){const v=EQE.validate(M,c.size,c.figs),sel=Math.min(BLD.fig||0,c.figs.length-1);
 let h=`<h4>Équipement <span class="bib-meta">(figurine par figurine)</span></h4>`;
 h+=v.errors.length?`<div class="bld-vd bad">❌ ${v.errors.length} erreur${v.errors.length>1?"s":""}</div>${v.errors.slice(0,4).map(x=>`<div class="bld-ck bad">❌ ${x.fig!=null?E(figName(M,c.figs,x.fig))+" — ":""}${E(x.msg)}</div>`).join("")}`:`<div class="bld-vd ok">✅ Équipement conforme</div>`;
 if(!M.reliable)h+=`<details class="bib-nw"><summary><b>⚠ Validation partielle</b> <span class="bib-meta">${M.issues.length} point${M.issues.length>1?"s":""} non pris en charge</span></summary><ul style="padding-left:18px">${M.issues.slice(0,8).map(x=>`<li>${E(x)}</li>`).join("")}</ul><p class="bib-meta">Ces options ne sont pas proposées : relis la fiche pour les connaître.</p></details>`;
 if(EQE.flexN(M)>=2){const g=EQE.tally(c.figs);h+=`<div class="bld-pm">${M.types.filter(t=>t.min!==t.max).map(t=>`<div class="bld-pr"><span class="bld-pl">Composition : <b>${E(typeLabel(t.name))}</b> <small>${t.min}–${t.max}</small></span><span class="bld-st"><button type="button" data-bld="fcomp" data-t="${t.i}" data-d="-1" ${EQE.setCount(M,c.size,c.figs,t.i,-1)?"":"disabled"} aria-label="Retirer">−</button><b>${g[t.i]||0}</b><button type="button" data-bld="fcomp" data-t="${t.i}" data-d="1" ${EQE.setCount(M,c.size,c.figs,t.i,1)?"":"disabled"} aria-label="Ajouter">+</button></span></div>`).join("")}</div>`}
 h+=`<div class="bld-sec ch">🔁 Équipement des figurines <small>touche une figurine pour ouvrir sa fiche et changer ses armes</small></div>`;
 h+=`<div class="bld-fgl">${c.figs.map((f,i)=>`<button type="button" class="bld-fg${Object.keys(f.c||{}).some(k=>(f.c[k]||[]).length)?" mod":""}" data-bld="fig" data-i="${i}"><b>${E(figName(M,c.figs,i))} <small>✏️ modifier</small></b><span>${E(figSum(M,v.final,i))}</span></button>`).join("")}</div>`;
 return h}
const eqLines=(c,weapons)=>{if(c&&c.figs&&c.figEq)return c.figEq.slice();const g=new Map();Object.keys(c.wq||{}).forEach(n=>{const q=c.wq[n];if(q>0){const k=nk(wgk(n));const x=g.get(k)||{name:wgk(n),q:0,w:""};x.q=Math.max(x.q,q);x.w=x.w||(c.wn||{})[n]||"";g.set(k,x)}});return[...g.values()].map(x=>x.q+" × "+x.name+(x.w?" — "+x.w:""))};
const sizeTxt=(u,copy)=>{const s=sizesOf(u,copy||1);return s.length?s[0].n+" figurine"+(s[0].n>1?"s":""):""};
const costTxt=(u,copy)=>{const s=sizesOf(u,copy||1);if(!s.length)return"Coût à vérifier";const c=costOf(u,s[0].n,copy||1);return c.pts==null?"Coût à vérifier":(s.length>1?"dès ":"")+c.pts+" pts"};
/* ----- catalogue : une seule carte par unité (collection ET bibliothèque reliées par leurs liens validés) ----- */
function catEntries(){const out=[],by=new Map(),links=LB().links;
 Object.values(S.coll||{}).filter(m=>!(m.mrg&&S.coll[m.mrg])).forEach(m=>{const lk=links[m.ref],lu=lk&&D.byId[lk.id],key=lu?"u:"+lu.id:"c:"+m.ref;
  if(by.has(key)){by.get(key).colls.push(m);return}
  const e={key,name:m.name,lib:lu||null,coll:m,colls:[m],img:imgOf(m),role:lu?roleOf(lu):RG(/personnage/i.test(m.kw||"")?"Character":/véhicule/i.test(m.kw||"")?"Vehicle":/infanterie/i.test(m.kw||"")?"Infantry":""),fac:lu?lu._c:""};by.set(key,e);out.push(e)});
 D.units.forEach(u=>{const key="u:"+u.id;if(by.has(key))return;const t=tName(u.n),e={key,name:t.st==="ok"?t.t:u.n,lib:u,coll:null,colls:[],img:"",role:roleOf(u),fac:u._c};by.set(key,e);out.push(e)});return out}
function entryOf(key){return catEntries().find(e=>e.key===key)||null}
function catFilter(L){let A=catEntries();const q=nk(BLD.q||""),f=BLD.fac===""?(L&&L.bld&&L.bld.fac||""):BLD.fac==="*"?"":BLD.fac;
 A=A.filter(e=>(BLD.src==="all"||(BLD.src==="coll"?!!e.coll:!!e.lib))&&(!f||!e.lib||inFac(e.lib,f))&&(!BLD.role||e.role===BLD.role)&&(!q||q.split(" ").every(w=>nk(e.name+" "+(e.lib?e.lib.n+" "+((D.fr[hh(e.lib.n)]||{}).fr||""):"")).includes(w))));
 return A.sort((a,b)=>String(a.name).localeCompare(b.name))}
function catHtml(L){const A=catFilter(L),roles=[...new Set(catEntries().map(e=>e.role))].sort(),lim=BLD.more?9999:48;
 const facs=facList(),curF=BLD.fac===""?(L&&L.bld&&L.bld.fac||""):BLD.fac==="*"?"":BLD.fac;
 const card=e=>{const sz=e.lib?sizeTxt(e.lib,1):(e.coll&&e.coll.nb?"":"");const ct=e.lib?costTxt(e.lib,1):(e.coll&&e.coll.pts?e.coll.pts+" pts (saisi)":"Coût à vérifier");
  return`<button type="button" class="bld-c" data-bld="pick" data-k="${E(e.key)}"><span class="bld-im">${e.img?`<img src="${e.img}" alt="">`:"🛡"}</span><b>${E(e.name)}</b><small>${E([sz,ct].filter(Boolean).join(" — "))}</small><small>${E(e.role)}</small><span class="bld-bd">${e.coll?'<i title="Ma collection">📦</i>':""}${e.lib?'<i title="Bibliothèque V11">📚</i>':""}</span>${e.coll&&!e.lib?'<span class="bld-nl">🔗 à lier</span>':""}</button>`};
 const nl=A.filter(e=>e.coll&&!e.lib).length;
 return`<div class="bib-top"><h2>Ajouter une unité</h2><button class="b" data-bld="x">✕</button></div>
 <input id="bldq" placeholder="Rechercher une unité…" value="${E(BLD.q)}" autocomplete="off">${nl?`<p class="bib-meta">🔗 ${nl} fiche${nl>1?"s":""} de ta collection ${nl>1?"ne sont":"n'est"} pas liée${nl>1?"s":""} à la bibliothèque. Touche-en une, puis « Lier » : le lien vaut partout dans l'appli.</p>`:""}
 <div class="row" style="gap:6px;margin:6px 0">${[["all","Toutes les unités"],["coll","📦 Ma collection"],["lib","📚 Bibliothèque"]].map(([k,n])=>`<button class="b ${BLD.src===k?"p":""}" data-bld="src" data-v="${k}">${n}</button>`).join("")}</div>
 <div class="row" style="gap:6px"><select id="bldf" style="flex:1"><option value="*"${curF===""?" selected":""}>Toutes les factions</option>${facs.map(([k,n,c])=>`<option value="${E(k)}"${curF===k?" selected":""}>${E(n)}</option>`).join("")}</select><select id="bldr" style="flex:1"><option value="">Toutes les catégories</option>${roles.map(r=>`<option${BLD.role===r?" selected":""}>${E(r)}</option>`).join("")}</select></div>
 <div class="bld-hint">Touche une unité pour la configurer. <b>📦</b> = dans ta collection, <b>📚</b> = dans la bibliothèque. Utilise la recherche ou les filtres pour trouver plus vite.</div><p class="bib-meta">${A.length} unité${A.length>1?"s":""}</p><div class="bld-g">${A.slice(0,lim).map(card).join("")}</div>${A.length>lim?`<button class="b" data-bld="more" style="width:100%;margin-top:8px">Afficher les ${A.length-lim} autres</button>`:""}`}
/* ----- configuration d'une unité : effectif, armes, équipements payants, optimisation, meneur ----- */
function weaponsOf(e){if(e.coll&&(e.coll.weapons||[]).length)return e.coll.weapons.map(w=>Object.assign({},w));
 if(e.lib)return[...(e.lib.rw||[]).map(w=>Object.assign(wToApp(w,false),{name:frName(String(w.n).replace(/^➤\s*/,"")),en:w.n})),...(e.lib.mw||[]).map(w=>Object.assign(wToApp(w,true),{name:frName(String(w.n).replace(/^➤\s*/,"")),en:w.n}))];return[]}
function defaultWeapons(e,c){const W=weaponsOf(e),nz=t=>nk(String(t||"").replace(/^➤\s*/,"")),eq=[];
 String((e.coll&&e.coll.equip)||"").split(/,(?![^()]*\))/).forEach(x=>{x=x.replace(/\s*\(\s*\d+\s*\)\s*$/,"").trim();if(x)eq.push([nz(x),c.size])});
 /* fiche créée automatiquement depuis la bibliothèque : son « équipement » liste toutes les armes de la fiche, ce n'est pas un choix : aucune arme par défaut */
 if(e.lib&&e.coll&&eq.length>=Math.max(3,W.length-1))eq.length=0;
 if(!eq.length&&e.lib&&e.lib.wp&&e.lib.wp.loadout){const re=/\*\*(?:Every|Each)\s+([^*]*?)\s+(?:is|are)\s+equipped\s+with:\*\*\s*([^\n]+)/gi;let m;const t=String(e.lib.wp.loadout);while((m=re.exec(t))){const all=/^(model|figurine)s?$/i.test(m[1].trim())||!/nob|sergeant|boss|champion|leader|captain|lieutenant/i.test(m[1]);m[2].split(/;/).forEach(x=>{x=x.replace(/\.$/,"").replace(/^\d+\s+/,"").trim();if(x)eq.push([nz(x),all?c.size:1])})}}
 W.forEach(w=>{const a=nz(w.name),b=nz(w.en||"");const h=eq.find(([n])=>a===n||a.indexOf(n+" - ")===0||b===n||b.indexOf(n+" - ")===0||(n&&b&&(b.indexOf(n)===0)));if(h)c.wq[w.name]=Math.max(c.wq[w.name]||0,h[1])})}
function copyIdx(L,c){const e=entryOf(c.key);if(!e||!e.lib)return 1;let n=0;(L.units||[]).forEach((u,i)=>{if(c.idx!=null&&i>=c.idx)return;if(u.cfg&&u.cfg.lib===e.lib.id)n++;(u.subs||[]).forEach(s=>{if(s.cfg&&s.cfg.lib===e.lib.id)n++})});return n+1}
function openCfg(key,idx){const L=curL(),e=entryOf(key);if(!L||!e)return;let c;
 if(idx!=null){const u=L.units[idx];c=JSON.parse(JSON.stringify(u.cfg||{}));c.key=key;c.idx=idx;c.size=c.size||u.size||(e.lib&&sizesOf(e.lib,1)[0]&&sizesOf(e.lib,1)[0].n)||1;c.wq=c.wq||{};c.wn=c.wn||{};c.wg=c.wg||{};if(!u.cfg){c.fromImport=1;const eqw=eqFromText(u.equip,c.size);if(Object.keys(eqw).length)c.wq=eqw}c.subs=JSON.parse(JSON.stringify(u.subs||[]));c.manual=c.manual||u.pts||0}
 else{c={key,idx:null,wq:{},wn:{},wg:{},enh:null,subs:[],manual:(e.coll&&e.coll.pts)||0};const sz=e.lib?sizesOf(e.lib,copyIdx(L,{key,idx:null})):[];c.size=sz.length?sz[0].n:1;defaultWeapons(e,c)}
 BLD.cfg=c;BLD.scr="cfg";figInit(c,e);render()}
function preview(L,c,e){const lib=e&&e.lib,tmp={name:e.name,size:c.size,pts:+c.manual||0,cfg:{lib:lib?lib.id:null,size:c.size,wg:c.wg,enh:c.enh},subs:c.subs||[]},L2={units:c.idx!=null?L.units.map((u,i)=>i===c.idx?tmp:u):[...L.units,tmp]},R=calc(L2),i=c.idx!=null?c.idx:L2.units.length-1;
 const mine=R.lines.filter(l=>l.i===i);return{lines:mine,total:mine.reduce((a,l)=>a+(l.pts||0),0),unk:mine.filter(l=>l.pts==null).length}}
const stepper=(a,k,v,mx)=>`<span class="bld-st"><button type="button" data-bld="${a}" data-k="${E(k)}" data-d="-1">−</button><b>${v}</b><button type="button" data-bld="${a}" data-k="${E(k)}" data-d="1" ${mx!=null&&v>=mx?"disabled":""}>+</button></span>`;
function supList(ll){const a=((ll&&ll.ab)||[]).find(x=>/^support$/i.test(x.n)&&/attached to/i.test(x.d||""));if(!a)return null;return stripMd(a.d).replace(/^[\s\S]*?attached to the following units?:/i,"").split(/[,\n■•]+/).map(x=>nk(x)).filter(Boolean)}
function compat(ul,ll,kind){if(!ul||!ll)return{s:"?",t:"À vérifier"};
 if(kind==="Appui"){const l=supList(ll);if(l&&l.length)return l.includes(nk(ul.n))?{s:"ok",t:"✓ Peut rejoindre cette unité"}:{s:"?",t:"À vérifier : non listé"};return{s:"?",t:"À vérifier"}}
 const a=((ul.wp||{}).ledby||[]).map(nk),b=((ll.wp||{}).leads||[]).map(nk);
 if(a.includes(nk(ll.n))||b.includes(nk(ul.n)))return{s:"ok",t:"✓ Peut rejoindre cette unité"};if(!a.length&&!b.length)return{s:"?",t:"À vérifier"};return{s:"?",t:"À vérifier : non listé"}}
function cfgHtml(){const L=curL(),c=BLD.cfg,e=entryOf(c.key);if(!L||!e)return"";const lib=e.lib,copy=copyIdx(L,c),sizes=lib?sizesOf(lib,copy):[],pv=preview(L,c,e),pc=lib&&pcOf(lib),W=weaponsOf(e);
 let h=`<div class="bib-top"><h2>${E(e.name)}</h2><button class="b" data-bld="x">✕</button></div><div class="row" style="gap:10px;align-items:center"><span class="bld-im" style="width:64px;height:64px">${e.img?`<img src="${e.img}" alt="">`:"🛡"}</span><span class="bib-meta">${e.coll?"📦 Ma collection ":""}${e.lib?"📚 Bibliothèque":""}<br>${E(e.role)}${lib?" · "+E(facLbl(lib)):""}</span></div>`;
 if(e.coll&&!e.lib&&window.BIBLNKP){try{h+=window.BIBLNKP(e.coll)}catch(_){}}
 h+=`<h4>Effectif <span class="bib-meta">(combien de figurines)</span></h4>`;
 if(sizes.length){h+=`<div class="row" style="gap:6px;flex-wrap:wrap">${sizes.map(s=>`<button type="button" class="b ${c.size===s.n?"p":""}" data-bld="size" data-v="${s.n}">${s.n} figurine${s.n>1?"s":""} · ${s.pts==null?"à vérifier":s.pts+" pts"}</button>`).join("")}</div><p class="bib-meta">Tailles et coûts lus dans le barème${pc?" Wahapedia 11e (exemplaire n°"+copy+" de cette unité)":" de la bibliothèque"}.</p>`}
 else h+=`<div class="row" style="gap:8px;align-items:center">${stepper("sz","sz",c.size,40)}<label style="flex:1">Coût (saisi à la main)<input id="bldman" inputmode="numeric" value="${E(c.manual||"")}"></label></div><p class="bib-meta">Aucun barème pour cette unité : le coût reste « à vérifier » tant que tu ne l'as pas saisi.</p>`;
 const FM=figMode(c)&&e.lib?EQE.model(e.lib):null;
 if(FM&&BLD.figSheet&&c.figs&&c.figs.length)return figSheetHtml(c,e,FM);
 if(FM)h+=figHtml(c,e,FM);else{
 h+=`<h4>Armes <span class="bib-meta">(quantité par arme)</span></h4>`;
 if(e.lib){let M0=null;try{M0=EQE.model(e.lib)}catch(_){}h+=`<p class="bib-meta" style="color:#ffd37a">⚠ Équipement non configurable figurine par figurine pour cette unité : contrôle par totaux${M0&&M0.issues.length?" ("+E(M0.issues[0])+")":""}.</p>`}
 if(!W.length)h+=`<p class="bib-meta">Aucune arme connue pour cette unité.</p>`;
 else h+=`<p class="bib-meta">Un compteur par arme (ses profils sont ajoutés ensemble). Porteur facultatif (ex. Sergent).</p>`+wgroups(W).map(g=>{const q=Math.max(0,...g.ws.map(w=>c.wq[w.name]||0)),why=(()=>{if(q>=c.size||!window.BIBLCK||!e.lib)return q>=c.size?"Maximum atteint":"";try{const c2=JSON.parse(JSON.stringify(c));g.ws.forEach(w=>{c2.wq[w.name]=q+1});const pr=BIBLCK.cfgTryFull(L,c,e,c2);return pr.length?String(pr[0].t||pr[0].d||"Non permis par la fiche"):""}catch(_){return""}})(),st=w=>`${E(w.range||"")}${/^\d/.test(w.range||"")?'"':""} · A ${E(w.a)} · ${E(w.hit)} · F ${E(w.f)} · PA ${E(w.pa)} · D ${E(w.d)}${w.caps?" · "+E(w.caps):""}`;
  return`<div class="bld-w ${q?"on":""}"><div class="row" style="justify-content:space-between;gap:6px"><button type="button" class="bld-fc${q?" on":why?" off":""}" ${!q&&why?"disabled":""} data-bld="wq" data-k="${E(g.name)}" data-d="${q?-q:1}" style="flex:1">${q?"✓ ":""}${E(g.name)}</button>${q?stepper("wq",g.name,q,c.size):""}</div>${!q&&why?`<small class="bld-why">${E(why)}</small>`:""}${g.ws.map(w=>{const suf=String(w.name).replace(/^➤\s*/,"").slice(wgk(w.name).length).replace(/^\s*[-–]\s*/,"").replace(/^\((.*)\)$/,"$1").trim();return`<div class="bib-meta">${suf&&g.ws.length>1?"<i>"+E(suf)+"</i> · ":""}${st(w)}</div>`}).join("")}${q?`<input class="bldnote" data-bldn="${E(g.name)}" placeholder="Porteur (facultatif)" value="${E((c.wn||{})[g.ws[0].name]||"")}">`:""}</div>`}).join("");}
 if(pc&&pc.wg&&pc.wg.length)h+=`<h4>Équipements payants</h4>${pc.wg.map(w=>`<div class="row" style="justify-content:space-between;gap:6px;margin:4px 0"><span><b>${E(w.n)}</b><div class="bib-meta">${w.pts} pts pièce</div></span>${stepper("wg",w.n,(c.wg||{})[w.n]||0,null)}</div>`).join("")}<p class="bib-meta">Les autres armes et équipements sont inclus dans le coût de l'unité : aucun point en plus.</p>`;
 const eq=lib&&lib.wp&&((lib.wp.opt||[]).length||lib.wp.loadout);if(eq)h+=`<details class="bib-nw"><summary><b>Options et restrictions d'équipement</b> <span class="bib-meta">À vérifier à la main</span></summary>${lib.wp.loadout?`<p>${frItem(lib.wp.loadout,"équipement de base").html}</p>`:""}<ul style="padding-left:18px">${(lib.wp.opt||[]).map(o=>`<li>${frItem(o,"option d'équipement").html}</li>`).join("")}</ul></details>`;
 if(lib&&isChar(lib)){const det=detsOf(L).length,list=enhFor(L),used=new Set(L.units.filter((u,i)=>i!==c.idx&&u.cfg&&u.cfg.enh).map(u=>u.cfg.enh.id));
  h+=`<h4>Amélioration de personnage <span class="bib-meta">(optimisation, coûte des points)</span></h4>`+(!det?`<p class="bib-meta">Choisis d'abord un détachement pour voir ses optimisations.</p>`:!list.length?`<p class="bib-meta">Aucune optimisation connue pour ce détachement.</p>`:`<button type="button" class="b ${!c.enh?"p":""}" data-bld="enh" data-v="">Aucune</button>`+list.map(x=>`<div class="bld-w ${c.enh&&c.enh.id===x.id?"on":""}"><div class="row" style="justify-content:space-between;gap:6px"><b>${E(tName(x.n).t)}</b><span>${x.pts==null?"à vérifier":"+"+x.pts+" pts"}</span></div><div class="bib-meta">${md2(trDesc(x.d).st==="ok"?trDesc(x.d).t:(trDesc(x.d).prop||x.d))}</div>${used.has(x.id)?`<span class="bib-meta">Déjà prise par une autre unité</span>`:`<button type="button" class="b ${c.enh&&c.enh.id===x.id?"p":""}" data-bld="enh" data-v="${E(x.id)}">${c.enh&&c.enh.id===x.id?"✓ Choisie":"Choisir"}</button>`}</div>`).join(""))}
 if(!lib||!isChar(lib)){const slot=(kind,hint)=>{const mine=(c.subs||[]).map((x,j)=>[x,j]).filter(([x])=>(x.label||"Meneur")===kind);return`<h4>${kind} <span class="bib-meta">(${hint})</span></h4>`+(mine.length?mine.map(([sb])=>{const sl=sb.cfg&&sb.cfg.lib&&D.byId[sb.cfg.lib],cm=compat(lib,sl,kind);return`<div class="bld-w on"><div class="row" style="gap:8px;align-items:center"><span class="bld-im" style="width:44px;height:44px">${imgOf(S.coll[sb.ref])?`<img src="${imgOf(S.coll[sb.ref])}" alt="">`:"🛡"}</span><span style="flex:1"><b>${E(sb.name)}</b><div class="bib-meta">${sl?(costOf(sl,1,1).pts==null?"Coût à vérifier":costOf(sl,1,1).pts+" pts"):"coût saisi"} · ${E(cm.t)}</div></span></div><div class="row" style="gap:6px;margin-top:6px"><button type="button" class="b" data-bld="ldr" data-kind="${kind}">Changer</button><button type="button" class="b x" data-bld="ldrx" data-kind="${kind}">Retirer</button></div></div>`}).join(""):`<button type="button" class="b" data-bld="ldr" data-kind="${kind}" style="width:100%">➕ Ajouter ${kind==="Appui"?"un appui":"un meneur"}</button>`)};h+=slot("Meneur","un personnage qui rejoint l'unité")+slot("Appui","un personnage de soutien qui s'ajoute à l'unité")}
 h+=`<div class="bld-bar"><div><b>${pv.unk?"≥ ":""}${fmt(pv.total)} pts</b><div class="bib-meta">${pv.unk?pv.unk+" coût à vérifier":"unité + équipements"}</div></div><button class="b p" data-bld="ok" style="flex:1">${c.idx!=null?"Enregistrer":"Ajouter à l'armée"}</button></div>`;return h}
function ensureSheet(e){return e.coll||createFromLib(e.lib)}
function commitCfg(){const L=curL(),c=BLD.cfg,e=c&&entryOf(c.key);if(!L||!e)return;const m=ensureSheet(e),W=weaponsOf(e).filter(w=>(c.wq[w.name]||0)>0).map(w=>{const x=Object.assign({},w);delete x.en;return x});
 const old=c.idx!=null?L.units[c.idx]:null,n=old||{ref:m.ref,size:c.size,pts:0,subs:[],man:1};
 if(!old){SH.forEach(f=>{n[f]=clone(m[f])})}
 const imp=old&&!old.cfg;if(imp&&!old.equipOld)old.equipOld=old.equip||"";
 n.weapons=imp?(W.length?W:(n.weapons||[])):(W.length||!(e.coll&&(e.coll.weapons||[]).length)?W:(n.weapons||[]));n.size=c.size;n.equip=eqLines(c).join(" ; ")||n.equip||"";n.subs=c.subs||[];if(imp)n.pm=1;
 n.cfg={lib:e.lib?e.lib.id:null,size:c.size,wq:c.wq,wn:c.wn,wg:c.wg,figs:c.figs||null,enh:c.enh||null,manual:+c.manual||0,eq:eqLines(c)};if(!e.lib)n.pts=+c.manual||0;
 if(!old)L.units.push(n);syncPts(L);applyPts(L);save();BLD.cfg=null;BLD.scr="edit";try{draw()}catch(_){}render()}
/* ----- meneurs ----- */
function ldrHtml(){const L=curL(),c=BLD.cfg,e=entryOf(c.key),ul=e&&e.lib,q=nk(BLD.lq||""),K=BLD.ldrKind||"Meneur",isSup=x=>x&&(x.kw||[]).some(k=>/^support$/i.test(k));
 let A=catEntries().filter(x=>(x.lib?(K==="Appui"?isSup(x.lib):isChar(x.lib)):(K==="Appui"?/Appui/.test(x.role):/Personnage|Héros/.test(x.role)))&&(!q||nk(x.name+" "+(x.lib?x.lib.n:"")).includes(q)));
 const g=L.bld&&L.bld.fac;A=A.filter(x=>!x.lib||!g||inFac(x.lib,g)||BLD.lall);
 A.sort((a,b)=>{const ca=compat(ul,a.lib,K).s==="ok",cb=compat(ul,b.lib,K).s==="ok";return(cb-ca)||String(a.name).localeCompare(b.name)});
 return`<div class="bib-top"><h2>${K==="Appui"?"Ajouter un appui":"Ajouter un meneur"}</h2><button class="b" data-bld="back">← Retour</button></div><p class="bib-meta">Pour : <b>${E(e.name)}</b>. Le coût du ${K==="Appui"?"personnage d'appui":"meneur"} s'ajoute à part. « À vérifier » = association non confirmée par les données : rien n'est interdit.</p>
 <input id="bldlq" placeholder="Rechercher ${K==="Appui"?"un appui":"un personnage"}…" value="${E(BLD.lq)}" autocomplete="off"><label class="bib-ck" style="margin:6px 0"><input type="checkbox" data-bldck="lall" ${BLD.lall?"checked":""}><span>Afficher les personnages de toutes les factions</span></label>
 <div class="bld-g">${A.slice(0,60).map(x=>{const cm=compat(ul,x.lib,K),ct=x.lib?costTxt(x.lib,1):(x.coll&&x.coll.pts?x.coll.pts+" pts (saisi)":"Coût à vérifier");return`<button type="button" class="bld-c" data-bld="ldrpick" data-k="${E(x.key)}"><span class="bld-im">${x.img?`<img src="${x.img}" alt="">`:"🛡"}</span><b>${E(x.name)}</b><small>${E(ct)}</small><small>${E(cm.t)}</small><span class="bld-bd">${x.coll?"<i>📦</i>":""}${x.lib?"<i>📚</i>":""}</span></button>`}).join("")}</div>`}
function ldrPick(key){const c=BLD.cfg,le=entryOf(key);if(!le)return;const m=ensureSheet(le),K=BLD.ldrKind||"Meneur",s={label:K,ref:m.ref};SH.forEach(f=>{s[f]=clone(m[f])});s.weapons=clone(m.weapons||[]);s.cfg={lib:le.lib?le.lib.id:null,size:1,enh:null};
 s.pts=le.lib?(costOf(le.lib,1,1).pts||0):(+m.pts||0);c.subs=(c.subs||[]).filter(x=>(x.label||"Meneur")!==K).concat([s]).sort((a,b)=>((a.label||"Meneur")==="Meneur"?0:1)-((b.label||"Meneur")==="Meneur"?0:1));BLD.scr="cfg";render()}
/* ----- lien collection ↔ bibliothèque fait depuis le constructeur : mise à jour de l'écran en cours ----- */
let LKSIG=null;const lkSig=()=>{try{const l=LB().links;return Object.keys(l).map(k=>k+":"+(l[k]&&l[k].id)).join("|")}catch(_){return""}};
function relinked(){const c=BLD.cfg;if(c&&BLD.scr==="cfg"){const m=/^c:(.+)$/.exec(c.key||""),ref=m?m[1]:(c.refKey||null);if(m){const ne=catEntries().find(x=>x.colls.some(y=>y.ref===ref));if(ne&&ne.key!==c.key){c.key=ne.key;c.refKey=ref;if(ne.lib&&c.idx==null){const sz=sizesOf(ne.lib,copyIdx(curL(),{key:ne.key,idx:null}));if(sz.length)c.size=sz[0].n;c.wq={};c.wn={};c.wg={};defaultWeapons(ne,c)}}}}
 try{draw()}catch(_){}render()}
setInterval(()=>{try{if(!BLD.id||!["cat","cfg","ldr"].includes(BLD.scr)){LKSIG=lkSig();return}const n=lkSig();if(LKSIG!==null&&n!==LKSIG){LKSIG=n;relinked()}else LKSIG=n}catch(_){}},500);
/* ----- détachements ----- */
function detList(L){const g=L.bld&&L.bld.fac;const grp=String(g||"").indexOf("sm:")===0?"space-marines":g;return D.dets.filter(d=>!grp||d._c===grp).sort((a,b)=>a.n.localeCompare(b.n))}
function detHtml(){const L=curL(),cur=detsOf(L),q=nk(BLD.dq||""),mx=dpMax(L.bld.limit||0),used=dpUsed(L),left=mx-used,chosen=new Set(cur.map(d=>d.id));let A=detList(L).filter(d=>!q||nk(d.n).includes(q));
 const sub=d=>{const ab=d.ab||{},t=trDesc(ab.description||""),tx=t.st==="ok"?t.t:(t.prop||ab.description||""),rs=/Restrictions?:\s*([\s\S]*)$/i.exec(stripMd(tx)),st=D.str.filter(x=>nk(x.det||"")===nk(d.n)),en=D.enh.filter(x=>nk(x.det||"")===nk(d.n)),cost=d.pts!=null?+d.pts:null,over=L.bld.limit&&cost!=null&&cost>left;
  return`<details class="bib-nw"><summary><span class="bld-dpb ${over&&!chosen.has(d.id)?"over":""}" title="Points de détachement">${cost!=null?cost+" pt"+(cost>1?"s":""):"? pt"}</span><b>${E(tName(d.n).t)}</b> ${chosen.has(d.id)?'<span class="bib-st">choisi</span>':""} <span class="bib-meta">${cost!=null?"coûte "+cost+" point"+(cost>1?"s":"")+" de détachement · ":""}${st.length} stratagème${st.length>1?"s":""} · ${en.length} amélioration${en.length>1?"s":""}</span><div class="bib-meta">🎯 Mission : ${(d.dp||[]).length?E((d.dp||[]).map(p=>{try{return misTag(DISP[p])}catch(_){return p}}).join(" · ")):"inconnue"}</div></summary>
  ${ab.name?`<h4>${E(frAbN(ab.name))} <span class="bib-meta">(règle du détachement)</span></h4><div>${md2(tx)}</div>`:""}${rs?`<h4>Restrictions connues</h4><p>${E(rs[1].trim())}</p>`:""}
  ${st.length?`<h4>Stratagèmes</h4><ul style="padding-left:18px;margin:4px 0">${st.map(x=>`<li><b>${E(tName(x.n).t)}</b> <span class="bib-meta">${x.cp!=null?x.cp+" PC":""}</span></li>`).join("")}</ul>`:""}
  ${en.length?`<h4>Améliorations de personnage</h4><ul style="padding-left:18px;margin:4px 0">${en.map(x=>`<li><b>${E(tName(x.n).t)}</b> <span class="bib-meta">${x.pts==null?"coût à vérifier":x.pts+" pts"}</span></li>`).join("")}</ul>`:""}
  ${chosen.has(d.id)?`<button type="button" class="b x" data-bld="detx" data-id="${E(d.id)}" style="width:100%;margin-top:6px">Retirer ce détachement</button>`:over?`<p class="bib-meta" style="color:#e0a030">⛔ Il ne te reste que ${Math.max(0,left)} point(s) de détachement : retire un détachement ou augmente la limite de points.</p>`:`<button type="button" class="b p" data-bld="detpick" data-id="${E(d.id)}" style="width:100%;margin-top:6px">➕ Ajouter ce détachement</button>`}</details>`};
 return`<div class="bib-top"><h2>Détachements</h2><button class="b" data-bld="x">✕</button></div>
 <div class="bld-hint">Un <b>détachement</b> donne à ton armée une règle spéciale, des stratagèmes et des améliorations. Chaque détachement coûte des <b>points de détachement</b> (1 à 3). Tu en as ${L.bld.limit?mx+" pour "+fmt(L.bld.limit)+" pts":"selon la limite de points (à définir)"} : 500 pts = 1, 1 000 pts = 2, 2 000 pts = 3. Tu peux en ajouter tant qu'il t'en reste.</div>
 <div class="bld-dpbar ${L.bld.limit&&left<=0?"full":""}"><div><b>${used} / ${L.bld.limit?mx:"?"}</b> points de détachement utilisés</div><div class="bld-dpl">${L.bld.limit?(left>0?"Il t'en reste <b>"+left+"</b>":"Plus aucun point disponible"):"Définis d'abord la limite de points"}</div>${cur.length?`<div class="bib-meta">${E(cur.map(d=>d.name+(d.dp!=null?" ("+d.dp+" pt"+(d.dp>1?"s":"")+")":"")).join(" + "))}</div>`:""}</div>
 <input id="bldd" placeholder="Rechercher un détachement…" value="${E(BLD.dq)}" autocomplete="off">${A.length?A.map(sub).join(""):'<p class="bib-meta">Aucun détachement dans la bibliothèque pour cette faction.</p>'}`}
function detSync(L){L.dets=(L.dets||[]).filter(x=>!x.bld);L.strats=(L.strats||[]).filter(x=>!x.bld);const ds=detsOf(L);L.bld.det=ds[0]?{id:ds[0].id,name:ds[0].name,en:ds[0].en}:null;
 ds.forEach(dd=>{const d=dd.x;if(!d)return;const ab=d.ab||{},t=trDesc(ab.description||""),tx=stripMd(t.st==="ok"?t.t:(t.prop||ab.description||""));
  L.dets.push({name:tName(d.n).t,cost:d.pts!=null?String(d.pts):"",rule:(ab.name?frAbN(ab.name)+" : ":"")+tx,bld:1});
  D.str.filter(x=>nk(x.det||"")===nk(d.n)).forEach(x=>{const parts=[["when","Quand"],["tg","Cible"],["fx","Effet"],["rs","Restrictions"]].map(([k,l])=>x[k]?l+" : "+stripMd((trDesc(x[k]).st==="ok"?trDesc(x[k]).t:(trDesc(x[k]).prop||x[k]))):"").filter(Boolean).join("\\n");L.strats.push({det:tName(d.n).t,name:tName(x.n).t,cp:x.cp,body:parts,bld:1})})});
 const okE=new Set(enhFor(L).map(e=>e.id));let lost=0;L.units.forEach(u=>{if(u.cfg&&u.cfg.enh&&!okE.has(u.cfg.enh.id)){u.cfg.enh=null;lost++}(u.subs||[]).forEach(sb=>{if(sb.cfg&&sb.cfg.enh&&!okE.has(sb.cfg.enh.id)){sb.cfg.enh=null;lost++}})});
 syncPts(L);applyPts(L);return lost}
function detPick(id){const L=curL(),d=D.dets.find(x=>x.id===id);if(!L||!d)return;L.bld=L.bld||{};const cur=detsOf(L);if(cur.some(x=>x.id===id))return;
 const mx=dpMax(L.bld.limit||0),cost=d.pts!=null?+d.pts:0;
 if(L.bld.limit&&dpUsed(L)+cost>mx){try{toast("Pas assez de points de détachement ("+Math.max(0,mx-dpUsed(L))+" restant)")}catch(_){}return}
 L.bld.dets=cur.map(x=>({id:x.id,name:x.name,en:x.en})).concat([{id:d.id,name:tName(d.n).t,en:d.n}]);const lost=detSync(L);save();BLD.scr="edit";try{draw()}catch(_){}try{toast("Détachement ajouté"+(lost?" · "+lost+" amélioration(s) retirée(s)":""))}catch(_){}render()}/* ----- vérifications simples et fiables ----- */
function checks(L){const R=calc(L),out=[],b=L.bld||{};
 if(b.limit&&R.total>b.limit)out.push({lv:"bad",t:"Limite dépassée : "+fmt(R.total)+" / "+fmt(b.limit)+" pts (+"+fmt(R.total-b.limit)+")"});else if(b.limit)out.push({lv:"ok",t:"Dans la limite : "+fmt(R.total)+" / "+fmt(b.limit)+" pts"});
 if(R.unk)out.push({lv:"warn",t:R.unk+" coût"+(R.unk>1?"s":"")+" à vérifier : le total n'est pas exact"});
 const ds=detsOf(L);if(!ds.length)out.push({lv:"info",t:"Aucun détachement choisi"});else if(b.limit){const mx=dpMax(b.limit),u=dpUsed(L);if(u>mx)out.push({lv:"bad",t:"Points de détachement dépassés : "+u+" / "+mx});else out.push({lv:"ok",t:"Points de détachement : "+u+" / "+mx})}
 (L.units||[]).forEach((u,i)=>{const c=u.cfg,lu=c&&c.lib&&D.byId[c.lib];if(!lu)return;const sz=sizesOf(lu,1);if(sz.length&&!sz.some(s=>c.size>=s.n&&c.size<=s.m))out.push({lv:"warn",t:u.name+" : effectif "+c.size+" hors barème (à vérifier)"});
  (u.subs||[]).forEach(s=>{const sl=s.cfg&&s.cfg.lib&&D.byId[s.cfg.lib],cm=compat(lu,sl,s.label);if(cm.s!=="ok")out.push({lv:"info",t:u.name+" + "+s.name+" : association à vérifier"})})});
 const seen={};(L.units||[]).forEach(u=>{if(u.cfg&&u.cfg.enh){seen[u.cfg.enh.id]=(seen[u.cfg.enh.id]||0)+1}});Object.keys(seen).forEach(k=>{if(seen[k]>1)out.push({lv:"bad",t:"Optimisation prise "+seen[k]+" fois"})});
 return out}
/* ----- récapitulatif compact ----- */
function unitText(u,i,R){const c=u.cfg||{},ln=R.lines.filter(l=>l.i===i&&l.j==null),base=ln.find(l=>l.k==="u"),tot=ln.filter(l=>l.pts!=null).reduce((a,l)=>a+l.pts,0),unk=ln.some(l=>l.pts==null);
 const eq=(c.eq&&c.eq.length?c.eq:eqLines(c)),out=[`${u.name} — ${c.size||u.size||"?"} figurine${(c.size||u.size)>1?"s":""} — ${unk?"coût à vérifier":tot+" pts"}`];
 eq.forEach(x=>out.push("   "+x));ln.filter(l=>l.k==="w"||l.k==="e").forEach(l=>out.push("   "+l.name+(l.pts!=null?" ("+l.pts+" pts)":" (à vérifier)")));
 (u.subs||[]).forEach((s,j)=>{const sl=R.lines.filter(l=>l.i===i&&l.j===j),st=sl.filter(l=>l.pts!=null).reduce((a,l)=>a+l.pts,0);out.push("   "+(s.label||"Meneur")+" : "+s.name+" — "+(sl.some(l=>l.pts==null)?"coût à vérifier":st+" pts"))});return out}
function recapText(L){const R=calc(L),b=L.bld||{},m=ptsMeta(),o=[L.name,[b.facN,detsOf(L).map(d=>d.name).join(" + "),b.fmt].filter(Boolean).join(" · "),"Points : "+(R.unk?"≥ ":"")+fmt(R.total)+(b.limit?" / "+fmt(b.limit):"")+" pts"+(R.unk?" ("+R.unk+" coût à vérifier)":""),""];
 (L.units||[]).forEach((u,i)=>{unitText(u,i,R).forEach(x=>o.push(x));o.push("")});o.push("Barème : "+m.src+(m.pub?" · publié "+String(m.pub).slice(0,10):"")+(m.sync?" · synchronisé "+m.sync:""));return o.join("\n")}
function recapHtml(L,forPrint){const R=calc(L),b=L.bld||{},m=ptsMeta(),ck=checks(L),old=m.chk&&Date.now()-m.chk>7*864e5;
 const row=(u,i)=>{const t=unitText(u,i,R),eq=t.slice(1).map(x=>x.trim().replace(/^[•\-]\s*/,"")).filter(Boolean);return`<div class="bld-rc"><b>${E(t[0])}</b>${eq.length?`<div class="bib-meta">${E(eq.join(" · "))}</div>`:""}</div>`};
 const rc=window.BIBLCK?BIBLCK.run(L):null,bad=rc?rc.sec.flatMap(s=>s.items.filter(x=>x.lv==="bad")):[],warn=rc?rc.sec.flatMap(s=>s.items.filter(x=>x.lv==="warn")):[];
 const verdict=rc?`<div class="bld-vd ${bad.length?"bad":warn.length?"warn":"ok"}">${bad.length?"❌ "+bad.length+" erreur"+(bad.length>1?"s":""):warn.length?"⚠️ "+warn.length+" à vérifier":"✅ Liste conforme"}</div>${bad.concat(warn).slice(0,5).map(x=>`<div class="bld-ck ${x.lv}">${x.lv==="bad"?"❌":"⚠️"} ${E((x.u?x.u+" — ":"")+x.t)}</div>`).join("")}${forPrint==="print"?"":`<button class="b" data-chk="${L.id}" style="margin:6px 0 10px">Voir le détail de la vérification</button>`}`:"";
 return`<div class="bib-top"><h2>${E(L.name)}</h2>${forPrint?"":`<button class="b" data-bld="back">← Retour</button>`}</div><p class="bib-meta">${E([b.facN,detsOf(L).map(d=>d.name).join(" + "),b.fmt].filter(Boolean).join(" · "))}</p>
 <div class="bld-tot"><b>${R.unk?"≥ ":""}${fmt(R.total)}${b.limit?" / "+fmt(b.limit):""} pts</b>${R.unk?`<span class="bib-meta"> · ${R.unk} coût à vérifier</span>`:""}</div>
 ${verdict}
 ${(L.units||[]).map(row).join("")||'<p class="bib-meta">Aucune unité.</p>'}
 ${forPrint==="print"?`<h4>Détail des points</h4><table style="width:100%;font-size:13px">${R.lines.map(l=>`<tr><td>${E(l.name)}${l.sz?" ("+l.sz+")":""}</td><td style="text-align:right">${l.pts==null?"à vérifier":l.pts+" pts"}</td></tr>`).join("")}<tr><td><b>Total</b></td><td style="text-align:right"><b>${R.total} pts</b></td></tr></table>`:""}
 <p class="bib-meta">Barème ${E(m.src)}${m.pub?" · "+E(String(m.pub).slice(0,10)):""}${old||!m.chk?" · ⚠ mise à jour non vérifiée récemment":""}</p>`}
/* ----- export / import ----- */
function exportJson(L){const sheets={};(L.units||[]).forEach(u=>{[u].concat(u.subs||[]).forEach(x=>{if(x.ref&&S.coll[x.ref])sheets[x.ref]=clone(S.coll[x.ref])})});return JSON.stringify({kind:"hammer-armee",v:1,at:Date.now(),pts:ptsMeta(),list:clone(L),sheets})}
function importJson(txt){let o;try{o=JSON.parse(txt)}catch(_){throw new Error("Fichier illisible")}if(!o||o.kind!=="hammer-armee"||!o.list)throw new Error("Ce n'est pas une armée HAMMER");
 const L=o.list;L.id="l"+Date.now();L.name=(L.name||"Armée")+(S.lists.some(x=>x.name===L.name)?" (importée)":"");Object.keys(o.sheets||{}).forEach(r=>{if(!S.coll[r])S.coll[r]=o.sheets[r]});S.lists.push(L);save();return L}
function dl2(name,text,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:type||"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function printList(L){let p=document.getElementById("bldprint");if(!p){p=document.createElement("div");p.id="bldprint";document.body.appendChild(p)}p.innerHTML=recapHtml(L,"print");p.style.display="block";setTimeout(()=>{try{window.print()}catch(_){}setTimeout(()=>{p.style.display="none"},400)},50)}
/* ----- vues principales ----- */
function homeHtml(){const lists=S.lists||[];
 return`<div class="card"><b style="font-size:18px">🛠 Créer une armée</b>
 <p class="bib-meta">Tu vas construire ta liste en 4 étapes (la barre du haut les montre). Rien n'est définitif : tu peux tout modifier ensuite.</p>
 <ol class="bld-steps"><li><b>Armée</b> : faction, taille de la partie et détachement (ci-dessous)</li><li><b>Règles</b> : les règles spéciales de ton armée</li><li><b>Unités</b> : tu les choisis dans un catalogue, puis tu règles effectif, équipement et chef (meneur)</li><li><b>Vérifier</b> : les points sont calculés et la liste est contrôlée</li></ol></div>
 <div class="card"><b>1 · Armée : faction et taille de la partie</b>
 <label>Nom de ton armée<input id="bldn" placeholder="ex. Mon armée Orks"></label>
 <label>Faction <span class="bib-meta">(le camp que tu joues)</span><select id="bldfac"><option value="">— Choisir ma faction —</option>${facList().map(([k,n])=>`<option value="${E(k)}">${E(n)}</option>`).join("")}</select></label>
 <label>Limite de points <span class="bib-meta">(la taille de la partie : plus c'est grand, plus il y a d'unités)</span><input id="bldlim" inputmode="numeric" value="2000"></label>
 <div class="row" style="gap:6px;margin:6px 0">${[500,1000,2000].map(n=>`<button type="button" class="b" data-bld="lim" data-v="${n}">${n} pts</button>`).join("")}</div>
 <label>Format de partie <span class="bib-meta">(facultatif, juste pour t'y retrouver)</span><input id="bldfmt" placeholder="ex. Partie standard" list="bldfl"><datalist id="bldfl"><option value="Combat Patrol"><option value="Incursion"><option value="Strike Force"><option value="Onslaught"></datalist></label>
 <button class="b p" data-bld="create" style="width:100%;margin-top:8px;min-height:46px;font-size:16px">Créer l'armée →</button></div>
 <div class="card"><b>Mes armées</b>${lists.length?lists.map(l=>{let p=0;try{p=l.bld?calc(l).total:lpts(l)}catch(_){}return`<div class="row" style="justify-content:space-between;gap:6px;margin:6px 0"><span><b>${E(l.name)}</b><div class="bib-meta">${(l.units||[]).length} unité(s) · ${p} pts${l.bld&&l.bld.limit?" / "+l.bld.limit:""}</div></span><button class="b" data-bld="open" data-id="${E(l.id)}">Ouvrir</button></div>`}).join(""):'<p class="bib-meta">Tu n\'as pas encore d\'armée. Remplis le formulaire ci-dessus.</p>'}
 <label class="b" style="cursor:pointer;display:inline-block;margin-top:6px">📂 Importer une armée enregistrée<input type="file" id="bldimp" accept=".json,application/json" hidden></label></div>`}
function stepsHtml(L,R){const b=L.bld||{},ds=detsOf(L),n=(L.units||[]).length;let t;
 if(!b.fac||!b.limit)t=["1","Choisis ta faction et la limite de points","onglet 1 « Armée »"];
 else if(!ds.length)t=["2","Choisis un détachement","onglet 1 « Armée »"];
 else if(!n)t=["3","Ajoute ta première unité","onglet 3 « Unités »"];
 else if(R.unk)t=["4","Vérifie "+R.unk+" coût(s) incertain(s)","onglet 3 : touche « Modifier » sur les unités ⚠"];
 else if(b.limit&&R.total>b.limit)t=["!","Limite dépassée","retire une unité ou réduis un effectif"];
 else t=["✓","Armée valide","ajoute d'autres unités ou ouvre le récapitulatif"];
 return`<div class="bld-next"><span class="bld-nn">${t[0]}</span><span><b>${E(t[1])}</b><br><span class="bib-meta">${E(t[2])}</span></span></div>
 <details class="bld-how"><summary class="bib-meta">ℹ Comment ça marche ?</summary><div class="bld-hint"><b>1.</b> Choisis faction, limite et <b>détachement</b>. <b>2.</b> Touche <b>Ajouter une unité</b> (📦 = ta collection, 📚 = bibliothèque). <b>3.</b> Règle l'<b>effectif</b> et les <b>armes</b>. <b>4.</b> Ajoute un <b>meneur</b> si tu veux. <b>5.</b> Ouvre le <b>récapitulatif</b>. « ⚠ à vérifier » = information non confirmée.</div></details>`}
function editHtml(L){syncPts(L);const st=BLD.step||"1";const R=calc(L),b=L.bld||(L.bld={}),ds=detsOf(L),mx=dpMax(b.limit||0),used=dpUsed(L),pct=b.limit?Math.min(100,R.total/b.limit*100):0,over=b.limit&&R.total>b.limit,m=ptsMeta();
 const un=(L.units||[]).map((u,i)=>{const t=unitText(u,i,R);return`<div class="card bld-u"><div class="row" style="gap:8px;align-items:center"><span class="bld-im" style="width:48px;height:48px">${imgOf(S.coll[u.ref])?`<img src="${imgOf(S.coll[u.ref])}" alt="">`:"🛡"}</span><span style="flex:1;min-width:0"><b>${E(t[0])}</b></span></div>${t.slice(1).map(x=>`<div class="bib-meta">${E(x.trim())}</div>`).join("")}<div class="row" style="gap:6px;margin-top:6px"><button class="b" data-bld="edit" data-i="${i}">✎ Modifier</button><button class="b x" data-bld="del" data-i="${i}">Retirer</button></div></div>`}).join("");
 const lg=(b.log||[]).find(x=>!x.seen);
 return`<div class="card bld-top"><div class="row" style="justify-content:space-between;gap:6px"><input id="bldname" value="${E(L.name)}" style="font-weight:700;flex:1;min-width:0" aria-label="Nom de l'armée"><button class="b" data-bld="home" aria-label="Retour à mes armées" style="flex:none">←</button></div>
 <div class="bld-pts ${over?"over":""}"><b>${R.unk?"≥ ":""}${fmt(R.total)} / ${b.limit?fmt(b.limit):"—"} points</b><div class="bld-bar2"><i style="width:${pct}%"></i></div>${R.unk?`<span class="bib-meta">${R.unk} coût à vérifier : le total n'est pas exact</span>`:""}${over?`<span class="bib-meta" style="color:#e0563f">Limite dépassée de ${fmt(R.total-b.limit)} pts</span>`:""}</div></div>
<div class="bld-tabs" role="tablist">${[["1","Armée"],["2","Règles"],["3","Unités"],["4","Vérifier"]].map(x=>`<button type="button" role="tab" data-bld="step" data-s="${x[0]}" class="${st==x[0]?"on":""}"><i>${x[0]}</i>${x[1]}</button>`).join("")}</div>
 ${stepsHtml(L,R)}
 ${lg?`<div class="card" style="border-color:var(--ac)"><b>Mise à jour des points</b><p class="bib-meta">Ancien total : ${fmt(lg.o)} pts · Nouveau total : ${fmt(lg.n)} pts · Différence : ${lg.n-lg.o>=0?"+":""}${lg.n-lg.o} pts</p>${lg.ch.map(x=>`<div class="bib-meta">${E(x.n)} : ${x.o} → ${x.p} pts</div>`).join("")}<p class="bib-meta">Les effectifs et équipements n'ont pas changé.</p><button class="b" data-bld="logok">OK</button></div>`:""}
${st==="2"||st==="4"?ruleBlock(L):""}
${st==="1"?` <div class="card bld-sett"><h3 class="bld-h">Faction, taille et détachements</h3><p class="bib-meta">${b.facN?E(b.facN)+(b.limit?" · "+fmt(b.limit)+" pts":""):"à choisir"} · ${ds.length?"⚔ "+E(ds.map(d=>d.name).join(", ")):"aucun détachement"}</p>
 <div class="bld-set"><b>Faction et taille</b>
 <div class="row" style="gap:6px;flex-wrap:wrap"><label style="flex:1;min-width:130px">Faction<select id="bldfac2"><option value="">—</option>${facList().map(([k,n])=>`<option value="${E(k)}"${b.fac===k?" selected":""}>${E(n)}</option>`).join("")}</select></label><label style="width:110px">Limite (pts)<input id="bldlim2" inputmode="numeric" value="${E(b.limit||"")}"></label><label style="flex:1;min-width:130px">Format<input id="bldfmt2" value="${E(b.fmt||"")}"></label></div></div>
 <div class="bld-set"><b>Détachements</b><p class="bib-meta">Les détachements donnent des règles, des stratagèmes et des améliorations. Chacun coûte des « points de détachement » : ${b.limit?"tu en as <b>"+mx+"</b> pour "+fmt(b.limit)+" pts":"définis d'abord la limite de points"} (500 pts = 1, 1 000 = 2, 2 000 = 3).</p>
 <p><b>${used} / ${b.limit?mx:"?"}</b> point${used>1?"s":""} de détachement utilisé${used>1?"s":""}</p>
 ${ds.map(d=>`<div class="row" style="justify-content:space-between;gap:6px;margin:4px 0"><span>⚔ <b>${E(d.name)}</b> <span class="bib-meta">${d.dp!=null?d.dp+" pt"+(d.dp>1?"s":""):""}</span></span><button class="b x" data-bld="detx" data-id="${E(d.id)}">Retirer</button></div>`).join("")}
 <button class="b ${ds.length?"":"p"}" data-bld="det" style="width:100%;margin-top:4px">${ds.length?"➕ Ajouter un autre détachement":"➕ Choisir un détachement"}</button>${b.limit&&used>=mx&&ds.length?`<p class="bib-meta">Tous tes points de détachement sont utilisés.</p>`:""}</div></div>

 <button class="b p bld-nx" data-bld="step" data-s="2">Suivant : règles →</button>`:""}
${st==="1"?ruleBlock(L):""}
${st==="2"?` ${missionBlock(L)}

 <button class="b p bld-nx" data-bld="step" data-s="3">Suivant : unités →</button>`:""}
${st==="3"?` <div class="card"><b>Unités</b> <span class="bib-meta">${(L.units||[]).length}</span>
 <button class="b p" data-bld="add" style="width:100%;min-height:52px;font-size:1.05em">➕ Ajouter une unité</button></div>
 ${un||'<div class="card"><p class="bib-meta">Aucune unité pour l\'instant. Touche « Ajouter une unité ».</p></div>'}

 <button class="b p bld-nx" data-bld="step" data-s="4">Suivant : vérifier →</button>${ruleBlock(L)}`:""}
${st==="4"?`<div class="card bld-rcp">${recapHtml(L,true)}</div>
 <button class="b bld-save" data-chk="${L.id}" style="margin-bottom:8px">✅ Vérification complète (règles V11)</button>
 <button class="b p bld-save" data-bld="savelist">💾 Enregistrer la liste</button>
`:""}
 <p class="bib-meta">Barème : ${E(m.src)}${m.pub?" · publié le "+E(String(m.pub).slice(0,10)):""} · synchronisé le ${E(m.sync||"—")}${!m.chk||Date.now()-m.chk>7*864e5?" · ⚠ aucune vérification récente":""}</p>`}
function sheetHtml(L){if(BLD.scr==="cat")return catHtml(L);if(BLD.scr==="cfg")return cfgHtml();if(BLD.scr==="ldr")return ldrHtml();if(BLD.scr==="det")return detHtml();if(BLD.scr==="recap")return recapHtml(L);return""}
function tmpClean(){if(!BLD.tmp)return;const L=(S.lists||[]).find(l=>l.id===BLD.tmp);if(L&&L.bld&&!(L.bld.dets||[]).length&&!L.bld.fac&&!L.bld.limit)delete L.bld;BLD.tmp=null}
function render(){css();const L=curL(),ov=["cat","cfg","ldr","det","recap"].includes(BLD.scr)&&L,b=box("bldm");if(!ov)tmpClean();
 if(!ov){b.innerHTML="";return}const old=b.querySelector(".bib-pn"),st=old?old.scrollTop:0,keep=document.activeElement&&document.activeElement.id;
 b.innerHTML=`<div class="bib-ov" data-bld="bg"><div class="bib-pn">${sheetHtml(L)}</div></div>`;const pn=b.querySelector(".bib-pn");if(pn)pn.scrollTop=st;if(keep){const f=document.getElementById(keep);if(f&&f.setSelectionRange){f.focus();try{f.setSelectionRange(f.value.length,f.value.length)}catch(_){}}}}
/* ----- règle de faction + mission principale (Force Disposition) ----- */
const DISP={"Take and Hold":"take-and-hold","Purge the Foe":"purge-the-foe","Disruption":"disruption","Reconnaissance":"reconnaissance","Priority Assets":"priority-assets"};
const ORD5=["take-and-hold","purge-the-foe","disruption","reconnaissance","priority-assets"];
const grpOfFac=f=>String(f||"").indexOf("sm:")===0?"space-marines":String(f||"");
function listGroup(L){let g=grpOfFac(L.bld&&L.bld.fac);if(g)return g;const c={};(L.units||[]).forEach(u=>{const lu=u.cfg&&u.cfg.lib&&D.byId[u.cfg.lib],lk=!lu&&LB().links[u.ref],x=lu||(lk&&D.byId[lk.id]);if(x)c[x._c]=(c[x._c]||0)+1});return Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||""}
function frItems(L){const g=listGroup(L),src=g&&D.frules&&D.frules[g];
 if(src&&src.length){const it=src.map(r=>{const t=trDesc(r.d),tx=stripMd(t.st==="ok"?t.t:(t.prop||r.d));const tn=tAB(r.n);return{n:tn.st==="ok"?tn.t:(tn.prop||tn.t),_en:r.n,d:tx}});
  if(JSON.stringify((L.frule||{}).items)!==JSON.stringify(it)){L.frule={g,at:Date.now(),items:it};try{save()}catch(_){}}return it}
 return(L.frule&&L.frule.items)||[]}
/* règle de faction principale = celle qui se retrouve sur le plus d'unités de la faction (+ les sous-règles citées dans son texte) */
const MAINC={};
function mainNames(g){const fr=(D.frules||{})[g]||[];if(!fr.length)return[];const key=D.units.length+"|"+fr.length;if(MAINC[g]&&MAINC[g].k===key)return MAINC[g].n;
 const nz=t=>nk(String(t).replace(/\s*\(.*?\)/g,"").replace(/\s+\d.*$/,"")),cnt={};
 D.units.forEach(u=>{if(u._c!==g)return;const seen=new Set((u.ab||[]).map(a=>nz(a.n)));fr.forEach(r=>{if(seen.has(nz(r.n)))cnt[r.n]=(cnt[r.n]||0)+1})});
 const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];let n=[];
 if(top){const t=fr.find(r=>r.n===top),tx=nk(t.d||"");n=[top].concat(fr.filter(r=>r.n!==top&&tx.includes(nk(r.n))).map(r=>r.n))}
 else if(fr.length===1)n=[fr[0].n];
 MAINC[g]={k:key,n};return n}
const mainOf=(L,it)=>{const m=mainNames(listGroup(L));return m.length?it.filter(x=>m.includes(x._en||x.n)):[]};
function frSel(L,it){const main=mainOf(L,it),rest=it.filter(x=>!main.includes(x));const s=L.frsel;
 if(Array.isArray(s))return main.concat(rest.filter(x=>s.includes(x.n)));
 return main.length?main:(it.length>4?[]:it)}
function ruleBlock(L){const it=frItems(L);if(!it.length)return"";const main=mainOf(L,it),sel=frSel(L,it),pick=!!BLD.frpick&&it.length>1,fl=facList().find(x=>x[0]===listGroup(L)),rest=it.filter(x=>!main.includes(x));
 return`<details class="card bld-fr" id="bldfr" ${(BLD.fro!==false&&(BLD.step==="2"||BLD.step==="4"))||pick?"open":""}><summary><b>📜 Règle de faction</b> <small class="bib-meta">${E(fl?fl[1]:"")}</small></summary>
 ${main.length?`<p class="bib-meta">Règle d'armée principale : toujours affichée.</p>`:""}
 ${rest.length>0&&it.length>1?`<div style="margin:6px 0"><button type="button" class="b" data-bld="frpick">${pick?"✔ Terminé":"☑ Autres règles de la faction ("+rest.filter(x=>sel.includes(x)).length+"/"+rest.length+")"}</button></div>`:""}
 ${pick?`<div class="bld-w">${rest.map(x=>`<label class="bib-ck"><input type="checkbox" data-bldfr="${E(x.n)}" ${sel.includes(x)?"checked":""}><span>${E(x.n)}</span></label>`).join("")}</div>`:""}
 ${sel.length?sel.map(x=>`<h4 style="margin:8px 0 2px">${E(x.n)}</h4><div style="font-size:14px">${md2(x.d)}</div>`).join(""):`<p class="bib-meta">Aucune règle sélectionnée.${rest.length?" Touche « Autres règles de la faction » pour en cocher.":""}</p>`}</details>`}
function dispsOf(L){const names=[];detsOf(L).forEach(d=>names.push(d.en||d.name));(L.dets||[]).forEach(d=>names.push(d.name));const out=[],seen=new Set();
 names.forEach(n=>{const d=D.dets.find(x=>nk(x.n)===nk(n)||nk(tName(x.n).t)===nk(n));if(d)(d.dp||[]).forEach(p=>{const id=DISP[p];if(id&&!seen.has(id)){seen.add(id);out.push({id,en:p,det:d.n})}})});return out}
const msdOf=(me,op)=>{const M=window.__msd||[],l=M.filter(m=>m.cat===me);return l[ORD5.indexOf(op)]||null};
function missionBlock(L){if(!L.bld||!detsOf(L).length&&!(L.dets||[]).length)return"";const ds=dispsOf(L),opts=ds.length?ds:ORD5.map(id=>({id,en:id})),cur=L.mission,okc=opts.some(o=>o.id===cur);
 if(opts.length===1&&L.mission!==opts[0].id){L.mission=opts[0].id;L.game=L.game||"w40k";try{save()}catch(_){}}
 const nm=id=>{try{return misTag(id)}catch(_){return id}};
 const tbl=L.mission?`<table style="width:100%;font-size:12.5px;margin-top:6px">${ORD5.map(op=>{const m=msdOf(L.mission,op);return`<tr><td class="bib-meta">si l'adversaire a ${E(nm(op))}</td><td><b>${E(m?m.nm:"—")}</b></td></tr>`}).join("")}</table>`:"";
 return`<div class="card" id="bldms"><b>🎯 Mission principale</b><p class="bib-meta">${ds.length?(opts.length>1?"Ton détachement donne le choix entre "+opts.length+" Forces Dispositions. Choisis celle de ton armée :":"Force Disposition imposée par ton détachement :"):"Force Disposition inconnue pour ce détachement : choisis librement (à vérifier)."}</p>
 <div class="row" style="gap:6px;flex-wrap:wrap">${opts.map(o=>`<button type="button" class="b ${L.mission===o.id?"p":""}" data-bld="disp" data-v="${o.id}">${E(nm(o.id))}</button>`).join("")}</div>${tbl}${L.mission&&!okc&&ds.length?`<p class="bib-meta" style="color:#e0a030">⚠ Cette disposition n'est pas proposée par le détachement choisi (à vérifier).</p>`:""}
 <p class="bib-meta">La mission principale exacte dépend de la Force Disposition de l'adversaire. Le mode jeu l'utilise automatiquement.</p></div>`}
/* petit texte « Règle de faction » sous les en-têtes : liste d'unités et mode jeu */
{const old=window.tbPost;window.tbPost=()=>{try{postRule()}catch(_){}if(old)old()}}
function postRule(){const m=document.getElementById("m"),o=document.getElementById("bldfr");const t=typeof tab!=="undefined"?tab:"";
 if(!m||!["units","play","pst"].includes(t)){if(o&&o.dataset.auto)o.remove();return}
 const L=(S.lists||[]).find(l=>l.id===S.cur);if(!L){if(o&&o.dataset.auto)o.remove();return}if(o&&o.dataset.auto==="1"&&o.dataset.l===L.id+"|"+t)return;
 const h=ruleBlock(L);if(o&&o.dataset.auto)o.remove();if(!h)return;m.insertAdjacentHTML("afterbegin",h.replace('id="bldfr"','id="bldfr" data-auto="1" data-l="'+L.id+"|"+t+'"'))}
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.id==="bldfr")BLD.fro=d.open},true);
/* ----- événements ----- */
window.XV=window.XV||{};XV.bld=function(){try{if(!D.ready&&!D.err)init();const L=curL();return L&&BLD.scr!=="home"?editHtml(L):homeHtml()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
const rd=()=>{try{draw()}catch(_){}render()};
const clampQ=(c)=>{Object.keys(c.wq||{}).forEach(k=>{if(c.wq[k]>c.size)c.wq[k]=c.size})};
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-bld]");if(!b)return;const a=b.dataset.bld,L=curL(),c=BLD.cfg;
 if(a==="frpick"){e.preventDefault();e.stopPropagation();BLD.frpick=!BLD.frpick;BLD.fro=true;try{draw()}catch(_){}render();return}
 if(a==="bg"){if(e.target===b){BLD.scr="edit";BLD.cfg=null;render()}return}
 e.preventDefault();e.stopPropagation();
 if(a==="lim"){const i=document.getElementById("bldlim");if(i)i.value=b.dataset.v;return}
 if(a==="create"){const g=id=>(document.getElementById(id)||{}).value||"",fac=g("bldfac");if(!fac){try{toast("Choisis d'abord une faction")}catch(_){}return}
  await init();const n=g("bldn").trim()||"Armée "+((S.lists||[]).length+1),fl=facList().find(x=>x[0]===fac),l={id:"l"+Date.now(),name:n,units:[],dets:[],strats:[],total:"",bld:{fac,facN:fl?fl[1]:fac,fmt:g("bldfmt").trim(),limit:parseInt(g("bldlim"),10)||0,pv:ptsVer(),tot:0}};
  S.lists.push(l);S.cur=l.id;BLD.id=l.id;BLD.scr="edit";BLD.step="1";try{frItems(l)}catch(_){}save();rd();return}
 if(a==="open"){BLD.id=b.dataset.id;const l=curL();if(l&&!l.bld)l.bld={fac:"",facN:"",fmt:"",limit:+l.ovP||0,pv:ptsVer(),tot:null};BLD.scr="edit";S.cur=BLD.id;{const l2=curL(),b2=l2&&l2.bld||{};BLD.step=(!b2.fac||!b2.limit||!detsOf(l2).length)?"1":((l2.units||[]).length?"3":"3")}rd();return}
 if(a==="step"){BLD.step=b.dataset.s;rd();try{window.scrollTo(0,0)}catch(_){}return}
 if(a==="home"){BLD.scr="home";BLD.id=null;rd();return}
 if(!L)return;
 if(a==="add"){BLD.scr="cat";BLD.src="all";BLD.fac="";BLD.q="";BLD.role="";BLD.more=false;render();return}
 if(a==="x"){BLD.scr="edit";BLD.cfg=null;render();return}
 if(a==="back"){BLD.scr=BLD.scr==="ldr"?"cfg":"edit";render();return}
 if(a==="src"){BLD.src=b.dataset.v;render();return}
 if(a==="more"){BLD.more=true;render();return}
 if(a==="pick"){openCfg(b.dataset.k,null);return}
 if(a==="edit"){const u=L.units[+b.dataset.i];if(u)openCfg(u.cfg&&u.cfg.lib?"u:"+u.cfg.lib:"c:"+u.ref,+b.dataset.i);return}
 if(a==="del"){const i=+b.dataset.i,u=L.units[i];if(!u)return;ask({t:"Retirer « "+u.name+" » de l'armée ?",p:"Sa fiche de collection n'est pas supprimée.",ok:"Retirer",dg:1},()=>{L.units.splice(i,1);syncPts(L);applyPts(L);save();rd()});return}
 if(c){
  if(a==="size"||a==="sz"){const o=c.size,n=a==="size"?+b.dataset.v:Math.max(1,Math.min(40,c.size+(+b.dataset.d)));
   if(figMode(c)){const e0=entryOf(c.key),M0=EQE.model(e0.lib),nf=n===o?c.figs:EQE.resize(M0,n,c.figs);
    if(!nf){BIBLCK.pop({t:"Effectif impossible ("+n+")",items:[{t:"Composition non prévue pour "+n+" figurines"}],buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}
    const v0=EQE.validate(M0,n,nf);if(v0.errors.length){BIBLCK.pop({t:"Effectif impossible ("+n+")",p:"L'équipement choisi ne serait plus permis. Modifie-le d'abord :",items:v0.errors.slice(0,4).map(x=>({t:(x.fig!=null?figName(M0,nf,x.fig)+" — ":"")+x.msg})),buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}
    c.size=n;c.figs=nf;BLD.fig=0;figSync(c,e0);render();return}
   const c2=JSON.parse(JSON.stringify(c));c2.size=n;Object.keys(c2.wq).forEach(k=>{if(c2.wq[k]===o)c2.wq[k]=n});clampQ(c2);
   if(n!==o&&window.BIBLCK){const pr=BIBLCK.cfgTryFull(L,c,entryOf(c.key),c2);if(pr.length){BIBLCK.pop({t:"Effectif impossible ("+n+")",items:pr,buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}}
   c.size=n;c.wq=c2.wq;c.wg=c2.wg||c.wg;render();return}
  if(a==="figpm"){const e=entryOf(c.key),M=EQE.model(e.lib),d=+b.dataset.d,nf=JSON.parse(JSON.stringify(c.figs)),key=b.dataset.k;
   const grp=[];M.rules.forEach(r=>r.alts.forEach((al,ai)=>{if(r.from.map(lckBase).join("+")+"→"+al.map(x=>lckBase(x.n)+x.q).join("+")===key)grp.push({r,ai})}));
   const before=EQE.validate(M,c.size,c.figs).errors.length;
   if(d>0){let ok=false;for(const {r,ai} of grp){for(let j=0;j<nf.length&&!ok;j++){const f=nf[j];if(!r.types.includes(f.t)||((f.c||{})[r.id]||[]).length)continue;const t=JSON.parse(JSON.stringify(nf));t[j].c=t[j].c||{};t[j].c[r.id]=[ai];if(EQE.validate(M,c.size,t).errors.length<=before){nf[j].c=nf[j].c||{};nf[j].c[r.id]=[ai];ok=true}}if(ok)break}
    if(!ok){BIBLCK.pop({t:"Option impossible",items:[{t:"Aucune figurine ne peut recevoir cette option"}],buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}}
   else{let done=false;for(let j=nf.length-1;j>=0&&!done;j--){for(const {r,ai} of grp){if(((nf[j].c||{})[r.id]||[]).includes(ai)){nf[j].c[r.id]=[];done=true;break}}}}
   c.figs=nf;figSync(c,e);render();return}
  if(a==="fcomp"){const e=entryOf(c.key),M=EQE.model(e.lib),nf=EQE.setCount(M,c.size,c.figs,+b.dataset.t,+b.dataset.d);if(!nf)return;
   const v=EQE.validate(M,c.size,nf),before=EQE.validate(M,c.size,c.figs).errors.length;if(v.errors.length>before){BIBLCK.pop({t:"Composition impossible",p:"L'équipement choisi ne serait plus permis :",items:v.errors.slice(0,3).map(x=>({t:(x.fig!=null?figName(M,nf,x.fig)+" — ":"")+x.msg})),buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}
   c.figs=nf;BLD.fig=0;figSync(c,e);render();return}
  if(a==="fig"){const i0=+b.dataset.i,f0=c.figs[i0],k0=JSON.stringify((f0&&f0.c)||{});BLD.fig=i0;BLD.figSheet=true;BLD.figBase=k0;BLD.figTwinN=null;BLD.figTwins=c.figs.map((g,j)=>j!==i0&&f0&&g.t===f0.t&&JSON.stringify(g.c||{})===k0?j:-1).filter(j=>j>=0);render();try{document.getElementById("bldm").scrollTop=0}catch(_){}return}
  if(a==="fignav"){const e=entryOf(c.key),M=EQE.model(e.lib),i0=Math.max(0,Math.min(c.figs.length-1,+b.dataset.i));if(i0===(BLD.fig||0))return;const f0=c.figs[i0],k0=JSON.stringify((f0&&f0.c)||{});
   BLD.fig=i0;BLD.figSheet=true;BLD.figBase=k0;BLD.figTwinN=null;BLD.figTwins=c.figs.map((g,j)=>j!==i0&&f0&&g.t===f0.t&&JSON.stringify(g.c||{})===k0?j:-1).filter(j=>j>=0);
   try{const ids=new Set(EQE.options(M,c.size,c.figs,i0).map(o=>String(o.rule.id)));BLD.figDr=BLD.figDr||{};Object.keys(BLD.figDr).forEach(k=>{if(!ids.has(String(k)))delete BLD.figDr[k]})}catch(_){}
   figSync(c,e);render();return}
  if(a==="figback"){try{const e=entryOf(c.key);if(e&&e.lib)figSync(c,e)}catch(_){}BLD.figSheet=false;render();return}
  if(a==="figtwinn"){const t=(BLD.figTwins||[]).length,cur=BLD.figTwinN==null?t:BLD.figTwinN;BLD.figTwinN=Math.max(1,Math.min(t,cur+(+b.dataset.d)));render();return}
  if(a==="figtwin"){const e=entryOf(c.key),M=EQE.model(e.lib),idx=BLD.fig||0,tw0=BLD.figTwins||[],tw=tw0.slice(0,BLD.figTwinN==null?tw0.length:Math.max(1,Math.min(tw0.length,BLD.figTwinN)));let nf=JSON.parse(JSON.stringify(c.figs));const src=JSON.stringify(nf[idx].c||{});let ok=0;
   for(const j of tw){const t=JSON.parse(JSON.stringify(nf));t[j].c=JSON.parse(src);const before=EQE.validate(M,c.size,nf).errors.length;if(EQE.validate(M,c.size,t).errors.length<=before){nf=t;ok++}}
   c.figs=nf;figSync(c,e);BLD.figTwins=tw0.filter(j=>JSON.stringify(nf[j].c||{})!==src);BLD.figTwinN=null;
   if(ok<tw.length){try{BIBLCK.pop({t:ok?"Appliqué à "+ok+" figurine"+(ok>1?"s":"")+" sur "+tw.length:"Impossible de l'appliquer aux autres",p:(ok?"Les "+(tw.length-ok)+" autre"+(tw.length-ok>1?"s":"")+" ne peuvent":"Les "+tw.length+" figurine"+(tw.length>1?"s":"")+" ne peuvent")+" pas recevoir cet équipement : la limite de l'option (nombre maximum de figurines) est déjà atteinte.",items:[],buttons:[{k:"ok",l:"Compris",cls:"p"}]})}catch(_){}}
   else{try{toast("Équipement appliqué à "+ok+" figurine"+(ok>1?"s":"")+" identique"+(ok>1?"s":""))}catch(_){}}
   render();return}
  if(a==="figbase"){const e=entryOf(c.key),M=EQE.model(e.lib),r=+b.dataset.r,idx=BLD.fig||0,nf=JSON.parse(JSON.stringify(c.figs));if(!((nf[idx].c||{})[r]||[]).length)return;
   const before=EQE.validate(M,c.size,c.figs).errors.length;nf[idx].c[r]=[];
   const v=EQE.validate(M,c.size,nf);if(v.errors.length>before){BIBLCK.pop({t:"Retour impossible",items:v.errors.slice(0,3).map(x=>({t:x.msg})),buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}
   c.figs=nf;figSync(c,e);render();return}
  if(a==="figo"||a==="figall"){const e=entryOf(c.key),M=EQE.model(e.lib),r=+b.dataset.r,ai=+b.dataset.a,idx=BLD.fig||0,nf=JSON.parse(JSON.stringify(c.figs));
   const before=EQE.validate(M,c.size,c.figs).errors.length;
   if(a==="figo"){const cur=((nf[idx].c||{})[r]||[]).includes(ai);nf[idx].c=nf[idx].c||{};nf[idx].c[r]=cur?[]:[ai]}
   else{const R=M.rules[r];nf.forEach((f,j)=>{if(!R.types.includes(f.t)||((f.c||{})[r]||[]).includes(ai))return;const t=JSON.parse(JSON.stringify(nf));t[j].c=t[j].c||{};t[j].c[r]=[ai];if(EQE.validate(M,c.size,t).errors.length<=before){nf[j].c=nf[j].c||{};nf[j].c[r]=[ai]}})}
   const v=EQE.validate(M,c.size,nf);if(v.errors.length>before){BIBLCK.pop({t:"Option impossible",items:v.errors.slice(0,3).map(x=>({t:x.msg})),buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}
   c.figs=nf;figSync(c,e);render();return}
  if(a==="wq"){const k=b.dataset.k,e=entryOf(c.key),g=e&&wgroups(weaponsOf(e)).find(x=>x.name===k),names=g?g.ws.map(w=>w.name):[k];
   const cur=Math.max(0,...names.map(n=>c.wq[n]||0)),nv=Math.max(0,Math.min(c.size,cur+(+b.dataset.d)));
   const c2=JSON.parse(JSON.stringify(c));names.forEach(n=>{if(nv)c2.wq[n]=nv;else delete c2.wq[n]});
   if(+b.dataset.d>0&&window.BIBLCK){const pr=BIBLCK.cfgTryFull(L,c,e,c2);if(pr.length){BIBLCK.pop({t:"« "+k+" » impossible",items:pr,buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}}
   const apply=()=>{names.forEach(n=>{if(nv)c.wq[n]=nv;else{delete c.wq[n];delete c.wn[n]}});render()};
   if(+b.dataset.d>0&&window.BIBLCK){const uv=BIBLCK.unverif(e,names);if(uv.length&&!c.uvok){c.uvok={}}if(uv.length&&!(c.uvok||{})[k]){BIBLCK.pop({t:"À vérifier sur la fiche",p:"« "+k+" » : je ne peux pas confirmer automatiquement que "+nv+" soit permis pour "+c.size+" figurine"+(c.size>1?"s":"")+".",items:[],buttons:[{k:"no",l:"Annuler"},{k:"yes",l:"C'est permis",cls:"p"}],cb:x=>{if(x==="yes"){c.uvok=c.uvok||{};c.uvok[k]=1;apply()}}});return}}
   apply();return}
  if(a==="wg"){const k=b.dataset.k,nv=Math.max(0,(c.wg[k]||0)+(+b.dataset.d));
   const c2=JSON.parse(JSON.stringify(c));if(nv)c2.wg[k]=nv;else delete c2.wg[k];
   if(+b.dataset.d>0&&window.BIBLCK){const pr=BIBLCK.cfgTryFull(L,c,entryOf(c.key),c2);if(pr.length){BIBLCK.pop({t:"« "+k+" » impossible",items:pr,buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}}
   c.wg=c2.wg;render();return}
  if(a==="enh"){const v=b.dataset.v,ne=v?{id:v,name:(D.enh.find(x=>x.id===v)||{}).n||""}:null;
   if(ne&&window.BIBLCK){const c2=JSON.parse(JSON.stringify(c));c2.enh=ne;const pr=BIBLCK.cfgTryFull(L,c,entryOf(c.key),c2);if(pr.length){BIBLCK.pop({t:"Optimisation impossible",items:pr,buttons:[{k:"ok",l:"Compris",cls:"p"}]});return}}
   c.enh=ne;render();return}
  if(a==="ldr"){BLD.ldrKind=b.dataset.kind||"Meneur";BLD.lq="";BLD.scr="ldr";render();return}
  if(a==="ldrx"){const K=b.dataset.kind||"Meneur";c.subs=(c.subs||[]).filter(x=>(x.label||"Meneur")!==K);render();return}
  if(a==="ldrpick"){ldrPick(b.dataset.k);return}
  if(a==="ok"){if(window.BIBLCK){const pr=BIBLCK.cfgProblems(L,c,entryOf(c.key));if(pr.length){const ed=c.idx!=null;BIBLCK.pop({t:"Unité non conforme",p:(entryOf(c.key)||{}).name,items:pr,buttons:[{k:"edit",l:"Modifier l'unité",cls:"p"},{k:"add",l:ed?"Enregistrer quand même":"Ajouter quand même"}],cb:x=>{if(x==="add")commitCfg()}});return}}commitCfg();return}
 }
 if(a==="det"){BLD.scr="det";BLD.dq="";render();return}
 if(a==="detpick"){detPick(b.dataset.id);return}
 if(a==="detx"){const id=b.dataset.id;L.bld.dets=detsOf(L).filter(d=>d.id!==id).map(d=>({id:d.id,name:d.name,en:d.en}));detSync(L);save();rd();return}
 if(a==="savelist"){const done=()=>{try{save()}catch(_){}try{toast("Liste « "+(L.name||"armée")+" » enregistrée ✓")}catch(_){}BLD.scr="home";BLD.id=null;rd()};
   const bad=window.BIBLCK?BIBLCK.run(L).sec.flatMap(s=>s.items.filter(x=>x.lv==="bad")):[];
   if(bad.length){BIBLCK.pop({t:"Liste non conforme",p:bad.length+" erreur"+(bad.length>1?"s":"")+" à corriger avant de valider :",items:bad.slice(0,6).map(x=>({t:(x.u?x.u+" — ":"")+x.t,d:x.d})),buttons:[{k:"fix",l:"Corriger",cls:"p"},{k:"save",l:"Enregistrer quand même"}],cb:x=>{if(x==="save")done()}});return}
   done();return}
 if(a==="recap"){BLD.scr="recap";render();return}
 if(a==="print"){printList(L);return}
 if(a==="json"){dl2((L.name||"armee").replace(/[^\w-]+/g,"_")+".hammer.json",exportJson(L));return}
 if(a==="copy"){try{await navigator.clipboard.writeText(recapText(L));toast("Liste copiée ✓")}catch(_){dl2((L.name||"armee")+".txt",recapText(L),"text/plain")}return}
 if(a==="share"){const t=recapText(L);try{if(navigator.share)await navigator.share({title:L.name,text:t});else{await navigator.clipboard.writeText(t);toast("Liste copiée : colle-la où tu veux ✓")}}catch(_){}return}
 if(a==="dup"){const n=clone(L);n.id="l"+Date.now();n.name=L.name+" (copie)";S.lists.push(n);S.cur=n.id;BLD.id=n.id;save();toast("Armée dupliquée ✓");rd();return}
 if(a==="classic"){S.cur=L.id;tab="units";try{draw()}catch(_){}return}
 if(a==="disp"){L.mission=b.dataset.v;L.game=L.game||"w40k";if(L.mid){try{const mm=(window.__msd||[]).find(x=>x.id===L.mid);if(!mm||mm.cat!==L.mission)L.mid=""}catch(_){}}save();rd();return}
 if(a==="logok"){(L.bld.log||[]).forEach(x=>x.seen=true);save();rd();return}
},true);
document.addEventListener("input",e=>{const t=e.target;if(!t)return;
 if(t.id==="bldq"){BLD.q=t.value;BLD.more=false;render()}
 else if(t.id==="bldlq"){BLD.lq=t.value;render()}
 else if(t.id==="bldd"){BLD.dq=t.value;render()}
 else if(t.id==="bldman"&&BLD.cfg){BLD.cfg.manual=parseInt(t.value,10)||0}
 else if(t.dataset&&t.dataset.bldn&&BLD.cfg){const e=entryOf(BLD.cfg.key),g=e&&wgroups(weaponsOf(e)).find(x=>x.name===t.dataset.bldn);(g?g.ws.map(w=>w.name):[t.dataset.bldn]).forEach(n=>{BLD.cfg.wn[n]=t.value})}},true);
document.addEventListener("change",async e=>{const t=e.target;if(!t)return;const L=curL();
 if(t.dataset&&t.dataset.bldfr!=null){const LL=(S.lists||[]).find(l=>l.id===S.cur)||L;if(LL){const it=frItems(LL),cur=Array.isArray(LL.frsel)?LL.frsel.slice():frSel(LL,it).filter(x=>!mainOf(LL,it).includes(x)).map(x=>x.n),n=t.dataset.bldfr,i=cur.indexOf(n);if(t.checked&&i<0)cur.push(n);if(!t.checked&&i>=0)cur.splice(i,1);LL.frsel=cur;BLD.fro=true;save();try{draw()}catch(_){}render()}return}
 if(t.id==="bldf"){BLD.fac=t.value;render()}else if(t.id==="bldr"){BLD.role=t.value;render()}
 else if(t.dataset&&t.dataset.bldck==="lall"){BLD.lall=t.checked;render()}
 else if(t.id==="bldname"&&L){L.name=t.value.trim()||L.name;save()}
 else if(t.id==="bldfac2"&&L){L.bld.fac=t.value;const f=facList().find(x=>x[0]===t.value);L.bld.facN=f?f[1]:"";try{frItems(L)}catch(_){}save();rd()}
 else if(t.id==="bldlim2"&&L){L.bld.limit=parseInt(t.value,10)||0;save();rd()}
 else if(t.id==="bldfmt2"&&L){L.bld.fmt=t.value.trim();save()}
 else if(t.id==="bldimp"&&t.files&&t.files[0]){try{const l=importJson(await t.files[0].text());BLD.id=l.id;BLD.scr="edit";S.cur=l.id;toast("Armée importée ✓");rd()}catch(err){try{toast("⚠ "+err.message)}catch(_){}}}},true);
/* points mis à jour avec la bibliothèque : recalcul de toutes les armées du constructeur */
window.BLDSYNC=()=>{try{(S.lists||[]).forEach(l=>{if(l.bld)syncPts(l)});save()}catch(_){}};
window.BLDCALC=calc;window.BLDCOST=costOf;
/* ouvre le configurateur d'équipement (＋/−, règles de la fiche) sur une unité d'une liste existante */
window.BLDEDIT=async(id,idx)=>{try{await init()}catch(_){}const L=(S.lists||[]).find(l=>l.id===id),u=L&&L.units[idx];if(!u)return;if(!L.bld){L.bld={};BLD.tmp=L.id}else BLD.tmp=null;BLD.id=id;
 let key=u.cfg&&u.cfg.lib?"u:"+u.cfg.lib:null;if(!key){const en=catEntries().find(x=>(x.colls||[]).some(m=>m.ref===u.ref));key=en?en.key:"c:"+u.ref}
 openCfg(key,idx)};
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("[data-eqc],[data-eqf]");if(!t)return;e.preventDefault();e.stopPropagation();
 if(t.dataset.eqc!==undefined){window.BLDEDIT(S.cur,+t.dataset.eqc);return}
 try{const x=window.__EDX&&window.__EDX.get(),L0=(S.lists||[]).find(l=>l.id===S.cur),idx=x&&L0?L0.units.indexOf(x.ed):-1;if(idx<0)return;const id=S.cur;window.__EDX.close();try{draw()}catch(_){}window.BLDEDIT(id,idx)}catch(_){}},true);
/* après l'import d'une unité (ou depuis « Choisir les armes ») : configurateur ＋/− si la fiche est liée à la bibliothèque */
window.BLDEQASK=(ref,lead)=>{const L=(S.lists||[]).find(l=>l.id===S.cur);if(!L)return false;let idx=-1;(L.units||[]).forEach((u,i)=>{if(u.ref===ref)idx=i});if(idx<0)return false;const u=L.units[idx];const lib=BIBLCK.lib(u);if(!lib)return false;const M=EQE.model(lib);if(!M||!M.usable)return false;window.BLDEDIT(L.id,idx);return true};
/* fiche d'une unité de liste : l'équipement se règle avec le configurateur (pas d'ajout/suppression d'arme à la main) */
window.BIBEQLOCK=(p,b)=>{try{const x=window.__EDX&&window.__EDX.get();if(!x||x.ctx!=="list"||x.ed==null||b)return false;const u=x.ed;if(!u||u!==p)return false;const lib=BIBLCK.lib(u);if(!lib)return false;const M=EQE.model(lib);return !!(M&&M.usable)}catch(_){return false}};
window.BLDL=curL;window.BLDSTATE=BLD;window.BLDRELINK=relinked;
window.BLDMAIN=mainNames;
/* ----- listes d'armée : figurines + points toujours visibles, modifiables dans la liste ----- */
const lpm=u=>Math.max(0,Math.round(+u.size||+((S.coll[u.ref]||{}).nb)||1));
const lpU=u=>+u.pts||0;
const lpS=s=>+((S.coll[s.ref]||{}).pts??s.pts)||0;
const lpFig=l=>(l.units||[]).reduce((a,u)=>a+lpm(u)+(u.subs||[]).reduce((b,s)=>b+(+((S.coll[s.ref]||{}).nb)||1),0),0);
const lpSum=l=>(l.units||[]).reduce((a,u)=>a+lpU(u)+(u.subs||[]).reduce((b,s)=>b+lpS(s),0),0);
const lpOv=v=>v!==undefined&&v!==null&&v!=="";
const lpTot=l=>lpOv(l.ovP)?+l.ovP||0:(l.pedit||!(+l.total>0))?lpSum(l):(+l.total);
const lpFg=l=>lpOv(l.ovF)?+l.ovF||0:lpFig(l);
const lpN=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,"\u202f");
window.BIBLP={fig:lpFg,pts:lpTot,
 txt:l=>lpFg(l)+" figurine"+(lpFg(l)>1?"s":"")+" · "+lpN(lpTot(l))+" pts",
 badges:l=>`<div class="blp-b"><span>🧍 <b>${lpFg(l)}</b> figurine${lpFg(l)>1?"s":""}</span><span>⭐ <b>${lpN(lpTot(l))}</b> pts</span></div>`,
 card:(u,i)=>{const sub=(u.subs||[]).reduce((a,s)=>a+lpS(s),0);return`<span class="blp-s"><label>Fig.<input type="number" inputmode="numeric" min="1" step="1" data-blp="size" data-i="${i}" value="${lpm(u)}" aria-label="Nombre de figurines"></label><label>Pts<input type="number" inputmode="numeric" min="0" step="5" data-blp="pts" data-i="${i}" value="${lpU(u)}" aria-label="Points de l'unité"></label>${sub?`<small>+${sub} pts meneur/appui</small>`:""}${(()=>{let st={s:"na",t:""};try{st=BIBLCK.unitStatus(u)}catch(_){}const ic={ok:"✅",bad:"❌",warn:"⚠️",na:"🔗"}[st.s];return`<button type="button" class="b blp-eq ${st.s}" data-eqc="${i}" title="${E(st.t)}">${ic} Équipement ＋/−</button>`})()}</span>`}};
(function(){const c=document.createElement("style");c.id="blpcss";c.textContent=`.blp-b{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}.blp-b span{background:var(--bg);border:1px solid var(--bd);border-radius:999px;padding:4px 12px;font-size:15px}.blp-b b{font-size:17px}
.blp-s{margin-left:auto;margin-top:22px;display:flex;flex-direction:column;gap:4px;align-items:flex-end;flex:none;padding-right:34px}.blp-s label{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--mu,#9a9a9a)}.blp-s input{width:68px;min-height:36px;text-align:center;font-size:16px;padding:2px 4px}.blp-s small{font-size:11px;color:var(--mu,#9a9a9a)}.blp-eq{font-size:12px;min-height:34px;padding:4px 8px;margin-top:2px}.blp-eq.bad{border-color:#d1503b}.blp-eq.warn{border-color:#d9a93a}`;document.head.appendChild(c)})();
(function(){const c=document.createElement("style");c.id="bldfigcss";c.textContent=`.bld-pm{display:grid;gap:6px;margin:8px 0}.bld-pr{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid var(--bd);border-radius:12px;background:var(--card)}.bld-pl{flex:1;min-width:0;font-size:13.5px;line-height:1.3}.bld-pl small{display:block}.bld-pr .bld-st button:disabled{opacity:.3}
.bld-fgl{display:grid;gap:6px;margin:8px 0}.bld-fg{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;width:100%;padding:8px 10px;border-radius:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font:inherit;cursor:pointer}.bld-fg span{font-size:12px;color:var(--mu)}.bld-fg.on{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac) inset}.bld-fg.mod b::after{content:" ✎";font-weight:400}
.bld-fst{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin-top:6px}.bld-fst span{text-align:center;border:1px solid var(--bd);border-radius:8px;padding:3px 0;background:var(--card)}.bld-fst i{display:block;font-style:normal;font-size:10px;color:var(--mu)}.bld-fst b{font-size:16px}.bld-twin{margin:8px 0;padding:10px 12px;border:2px solid #4a5d8f;border-radius:12px;background:color-mix(in srgb,#4a5d8f 16%,var(--card));font-size:13.5px}.bld-twin .b{display:block;width:100%;margin-top:8px;min-height:44px}.bld-twin small{display:block;margin-top:4px;color:var(--mu)}.bld-sec{margin:14px 0 6px;padding:8px 12px;border-radius:10px;background:var(--ac2);color:#fff;font-weight:800;font-size:14px;letter-spacing:.3px}.bld-sec small{display:block;font-weight:500;font-size:11px;opacity:.9;margin-top:2px}.bld-sec.ch{background:#c9731a}.bld-sec.op{background:#4a5d8f}.bld-ops{border:1px solid var(--bd);border-radius:10px;padding:6px 12px;background:var(--card);font-size:13px}.bld-ops ul{padding-left:18px;margin:4px 0}.bld-ops li{margin:4px 0}.bld-fc.off{opacity:.4;filter:grayscale(1);text-decoration:line-through;pointer-events:none}.bld-fc.on{box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 35%,transparent)}.bld-fiche{border:1px solid var(--ac);border-radius:12px;padding:8px 10px;margin:6px 0;background:var(--bg)}.bld-fw{padding:4px 0;border-top:1px solid var(--bd)}.bld-fw:first-of-type{border-top:0}.bld-ws{display:block;font-size:12px;color:var(--mu);margin-top:2px}.bld-ws i{color:var(--tx)}.bld-wp{display:block;font-weight:400;margin-top:3px}.bld-fc.on .bld-ws{color:#fff}.bld-fc{display:block;width:100%}.bld-fp{border:1px solid var(--bd);border-radius:12px;padding:8px 10px;margin:6px 0}.bld-fo{padding:6px 0;border-top:1px solid var(--bd)}.bld-fo:first-of-type{border-top:0}.bld-fh{font-size:13px;margin-bottom:4px}.bld-fh small{color:var(--mu);margin-left:6px}.bld-fcs{display:grid;gap:6px}.bld-fcw{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.bld-fc{flex:1;min-width:0;text-align:left;padding:8px 10px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:inherit;cursor:pointer}.bld-fc.on{background:var(--ac);color:#fff;border-color:var(--ac);font-weight:700}.bld-fc.off{opacity:.45;cursor:not-allowed;text-decoration:line-through}.bld-fa{border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:10px;padding:8px 10px;font:inherit;font-size:12px}.bld-ws{margin-top:6px!important}.bld-md{display:block;font-size:12px;font-weight:700;color:var(--tx);margin:6px 0 2px}.bld-sg{display:grid;grid-template-columns:1.5fr repeat(5,1fr);gap:3px;margin-top:4px}.bld-sg span{text-align:center;border:1px solid var(--bd);border-radius:8px;padding:3px 0;background:var(--bg)}.bld-sg i{display:block;font-style:normal;font-size:9px;letter-spacing:.04em;text-transform:uppercase;color:var(--mu)}.bld-sg b{font-size:16px;color:var(--tx)}.bld-ab{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}.bld-ab em{font-style:normal;font-size:12px;font-weight:700;border-radius:8px;padding:2px 8px;background:color-mix(in srgb,var(--ac) 22%,var(--card));color:var(--tx);border:1px solid color-mix(in srgb,var(--ac) 55%,var(--bd))}.bld-fc.on .bld-sg span{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.5)}.bld-fc.on .bld-sg i,.bld-fc.on .bld-sg b{color:#fff}.bld-fc.on .bld-ab em{background:rgba(255,255,255,.22);color:#fff;border-color:rgba(255,255,255,.6)}.bld-fiche{border:2px solid #C89B3C!important;background:#0b0b0a!important;border-radius:14px!important}.bld-nav{display:flex;align-items:center;gap:8px}.bld-nt{flex:1;min-width:0;text-align:center}.bld-nt b{display:block;font-size:17px;color:#F1CC67;line-height:1.15;overflow-wrap:anywhere}.bld-nt small{display:block;font-size:12.5px;color:var(--mu);margin-top:2px}.bld-na{flex:none;width:52px;height:52px;border-radius:14px;border:2px solid #C89B3C;background:#17130a;color:#F1CC67;font:inherit;font-size:30px;font-weight:800;line-height:1;cursor:pointer;touch-action:manipulation}.bld-na:active{background:#C89B3C;color:#1b1405}.bld-na[disabled]{opacity:.3;pointer-events:none}.bld-fnav{display:flex;gap:5px;overflow-x:auto;margin:8px 0 2px;padding-bottom:2px;scrollbar-width:none}.bld-fnav button{flex:none;min-width:34px;height:32px;border-radius:9px;border:1px solid #6b5220;background:#12100a;color:var(--tx);font:inherit;font-size:13px;font-weight:700;cursor:pointer}.bld-fnav button.on{background:linear-gradient(#F1CC67,#C89B3C);color:#1b1405;border-color:#F1CC67}.bld-tc{margin-top:8px;font-size:13px}.bld-tc b{color:#F1CC67;font-size:15px}.bld-tn{color:#ffb3b3}.bld-sec.ch{background:linear-gradient(#C89B3C,#a77d28)!important;color:#1b1405!important}.bld-sec.ch small{color:#1b1405!important;opacity:.85}.bld-fc.on{background:linear-gradient(#F1CC67,#C89B3C)!important;color:#1b1405!important;border-color:#F1CC67!important}.bld-fc.on .bld-sg span{background:rgba(0,0,0,.14)!important;border-color:rgba(0,0,0,.4)!important}.bld-fc.on .bld-sg i,.bld-fc.on .bld-sg b{color:#1b1405!important}.bld-fc.on .bld-ab em{background:rgba(0,0,0,.16)!important;color:#1b1405!important;border-color:rgba(0,0,0,.4)!important}.bld-vd.ok{background:#0f2a1a!important;color:#7ee2a4!important}.bld-vd.bad{background:#2a0f0f!important;color:#ff9c9c!important}.bld-fcs{gap:12px!important}.bld-fc{border-left:6px solid #555!important;padding:10px 12px!important}.bld-fc.kd-t{border-left-color:#4f8fd6!important}.bld-fc.kd-m{border-left-color:#d65a4f!important}.bld-fc.kd-x{border-left-color:#b78bd6!important}.bld-fc.on{border-left-color:#1b1405!important}.bld-ix{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#2a2417;color:#F1CC67;font-size:12px;font-weight:800;margin-right:7px;vertical-align:1px}.bld-fc.on .bld-ix{background:#1b1405;color:#F1CC67}.bld-n{font-size:17px!important}.bld-k{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:7px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;vertical-align:2px}.bld-k.t{background:#173352;color:#9cc8f5}.bld-k.m{background:#4a1a17;color:#f5a39c}.bld-fc.on .bld-k{background:rgba(0,0,0,.2);color:#1b1405}.bld-sg span.df{border:2px solid #F1CC67!important;box-shadow:0 0 0 1px #F1CC67 inset}.bld-sg span.df b{color:#F1CC67}.bld-fc.on .bld-sg span.df{border-color:#1b1405!important;box-shadow:0 0 0 1px #1b1405 inset}.bld-fc.on .bld-sg span.df b{color:#1b1405!important}.df-k{color:#F1CC67}.bld-dr>summary{list-style:none;cursor:pointer;display:block}.bld-dr>summary::-webkit-details-marker{display:none}.bld-dk{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);font-weight:800}.bld-dn{display:block;font-size:16px;font-weight:800;margin-top:1px}.bld-dn em{font-style:normal;font-weight:500;color:var(--mu);font-size:13px}.bld-dh{display:block;font-size:12px;color:var(--mu);margin-top:6px}.bld-dh b{float:right;color:var(--ac)}.bld-dr[open]>summary .bld-dh b{visibility:hidden}.bld-dr.chg{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac) inset}.bld-dr>.bld-fcs{margin-top:10px;padding-top:10px;border-top:1px dashed var(--bd);animation:bldsl .22s ease-out}@keyframes bldsl{from{opacity:0;transform:translateY(-6px)}}.bld-why{flex-basis:100%;color:#ffb3b3;font-size:12.5px;padding:0 4px}.bld-n{display:block;font-weight:700;font-size:15px}.bld-dl{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.bld-dl i{font-style:normal;font-size:12px;font-weight:700;border-radius:8px;padding:2px 8px;background:var(--card);color:var(--tx);border:1px solid var(--bd)}.bld-dl i.du{background:#1f6b46;color:#fff;border-color:#1f6b46}.bld-dl i.dd{background:#a4552a;color:#fff;border-color:#a4552a}.bld-leg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--mu);margin:4px 2px 8px}.bld-leg .u{color:#3ddc97}.bld-leg .d{color:#e08a52}.bld-fc.off{text-decoration:none!important;background:repeating-linear-gradient(135deg,var(--bg),var(--bg) 8px,color-mix(in srgb,var(--bd) 60%,var(--bg)) 8px,color-mix(in srgb,var(--bd) 60%,var(--bg)) 16px)}.bld-fc.on .bld-dl i{border-color:#fff}.bld-fo{border:1px solid var(--bd);border-radius:12px;padding:10px;margin:8px 0;background:var(--card)}.bld-fh{font-size:14px}`;document.head.appendChild(c)})();
(function(){const c=document.createElement("style");c.id="bldvdcss";c.textContent=`.bld-vd{font-weight:800;font-size:16px;padding:8px 12px;border-radius:12px;margin:8px 0}.bld-vd.ok{background:#17402c;color:#b9f1d2}.bld-vd.warn{background:#5a4416;color:#ffe3a6}.bld-vd.bad{background:#5a2323;color:#ffd0d0}`;document.head.appendChild(c)})();
document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest(".blp-s")){e.stopPropagation()}},true);
document.addEventListener("keydown",e=>{if(e.target&&e.target.dataset&&e.target.dataset.blp&&e.key==="Enter"){e.preventDefault();e.target.blur()}},true);
document.addEventListener("change",e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.blp)return;e.stopImmediatePropagation();e.stopPropagation();
 const L=(S.lists||[]).find(l=>l.id===S.cur),u=L&&L.units[+t.dataset.i];if(!u)return;let v=Math.round(+t.value);if(!isFinite(v)||v<0)v=0;
 if(t.dataset.blp==="pts"){u.pts=v;u.pm=1;L.pedit=1}
 else{if(v<1)v=1;u.size=v;if(u.cfg){u.cfg.size=v;if(!u.pm){try{applyPts(L)}catch(_){}}}L.pedit=1}
 try{if(L.bld)L.bld.tot=calc(L).total}catch(_){}
 save();try{draw()}catch(_){}},true);
