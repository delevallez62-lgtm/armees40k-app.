/* ===== Vérification d'une liste d'armée V11 : points, composition, équipements, optimisations, préparation tournoi =====
   Sources : règles de base 11e édition, section « Muster Armies » (25.01–25.04, https://wahapedia.ru/wh40k11ed/the-rules/core-rules/),
   Chapter Approved Tournament Companion (https://wahapedia.ru/wh40k11ed/the-rules/chapter-approved-2025-26/),
   fiches de la bibliothèque (barème de points, options d'équipement, optimisations). Tout se calcule hors ligne. */
const LCK={open:false,id:null};
/* tailles de bataille officielles (règles de base 25.03) */
const LSZ={inc:{n:"Incursion",pts:1000,dp:2,enh:2,unit:2},sf:{n:"Strike Force",pts:2000,dp:3,enh:4,unit:3}};
const lckSize=L=>{const c=L.chk&&L.chk.size;if(c&&LSZ[c])return c;const lim=(L.bld&&+L.bld.limit)||(+L.ovP)||0;if(lim&&lim<=1000)return"inc";if(lim)return"sf";const tot=+L.total||0;return tot&&tot<=1000?"inc":"sf"};
const lckLim=(L,k)=>{const lim=(L.bld&&+L.bld.limit)||0;return lim||LSZ[k].pts};
const lckLib=u=>{if(!u)return null;const c=u.cfg;if(c&&c.lib&&D.byId[c.lib])return D.byId[c.lib];try{const l=LB().links[u.ref];if(l&&D.byId[l.id])return D.byId[l.id]}catch(_){}return null};
const lckKw=u=>new Set(((u&&u.kw)||[]).map(k=>nk(k)));
const lckRole=u=>u?roleOf(u):"Autre";
const lckIsEpic=u=>lckRole(u)==="Héros épiques";
const lckIsChar=u=>/Personnage|Héros/.test(lckRole(u));
const lckIsSup=u=>!!u&&(u.kw||[]).some(k=>/^support$/i.test(k));
const lckName=u=>{try{return tName(u.n).t}catch(_){return u.n}};
const lckPts=n=>n==null?"?":fmt(n);
/* ----- analyse des options d'équipement (texte officiel de la fiche) ----- */
function lckAlts(t){t=String(t||"").replace(/\*\*/g,"");const b=t.split(/\n\s*[•■]\s*/).slice(1);const src=b.length?b:[t];const alts=[];
 src.forEach(x=>{x=x.replace(/\(.*?\)/g,"").replace(/\.$/,"").trim();const a=[];x.split(/\s+and\s+/i).forEach(y=>{y=y.replace(/^\d+\s*[x×]?\s*/i,"").replace(/^(?:one|an?)\s+/i,"").trim();if(y)a.push(y)});if(a.length)alts.push(a)});return alts}
const lckItems=t=>lckAlts(t).flat();
function lckParseOpts(lib){const o=((lib&&lib.wp&&lib.wp.opt)||[]),rules=[],unk=[];
 const num=x=>{x=String(x||"").toLowerCase();const m={one:1,two:2,three:3,four:4}[x];return m||(/^\d+$/.test(x)?+x:null)};
 o.forEach(s=>{s=String(s||"").trim();if(!s)return;const first=s.split("\n")[0].replace(/\*\*/g,""),rest=s.slice(first.length);let m,t;
  const inl=first.indexOf(":")>=0?first.slice(first.indexOf(":")+1).trim():"";
  const altsFrom=tail=>{const x=(tail&&tail.trim())||"";if(x&&!/following/i.test(x)){return /\bor\b|,/.test(x)&&!/\band\b/.test(x)?lckAlts("\n• "+x.replace(/,\s*(?:or\s+)?|\s+or\s+/g,"\n• ")):lckAlts(x)}if(inl)return lckAlts(inl.replace(/,\s*(?:and\s+|or\s+)?/g,"\n• ").replace(/^/,"\n• "));return lckAlts(rest)};
  const mk=(kind,k,per,from,tail,extra)=>{const alts=altsFrom(tail),to=alts.flat();if(!to.length){unk.push(s);return}rules.push(Object.assign({kind,k,per,from:String(from||"").replace(/^\d+\s*/,"").trim(),to,alts,txt:first},extra||{}))};
  if(/^None\.?$/i.test(first)||/^A model can only take/i.test(first)||/^\*+\s*A model can only/i.test(first))return;
  if(m=/^(?:Any number of|All) (?:(.+?) )?models?(?: in this unit)? can each have (?:their|its) (.+?) replaced with (.+?)(?:\.|:)?$/i.exec(first))mk("any",null,null,m[2],m[3]);
  else if(m=/^For every (\d+) models? in this unit, (?:up to )?(\d+|one|two|three|four) (.+?) models? can (?:each )?have (?:their|its) (.+?) replaced with (.+?)(?:\.|:)?$/i.exec(first))mk("per",num(m[2])||1,+m[1],m[4],m[5]);
  else if(m=/^For every (\d+) models? in this unit, (?:up to )?(\d+|one|two|three|four) (.+?) models? can (?:each )?take (.+?)(?:\.|:)?$/i.exec(first))mk("per",num(m[2])||1,+m[1],"",m[4]);
  else if(m=/^(?:The|This|That) (.+?) (?:can|may) have (?:their|its|his|her) (.+?) replaced with (.+?)(?:\.|:)?$/i.exec(first))mk("fix",1,null,m[2],m[3]);
  else if(m=/^This model(?:’|')s (.+?) can be replaced with (.+?)(?:\.|:)?$/i.exec(first))mk("fix",1,null,m[1],m[2]);
  else if((m=/^(?:The|That) [^.]*?(?:’|')s (.+?) can be replaced with (.+?)(?:\.|:)?$/i.exec(first))&&!/\bor\b.*\breplace/i.test(first))mk("fix",1,null,m[1],m[2]);
  else if(m=/^(?:Up to )?(\d+|One|Two|Three|Four) (.+?) models? can (?:each )?have (?:their|its) (.+?) replaced with (.+?)(?:\.|:)?$/i.exec(first))mk("fix",num(m[1])||1,null,m[3],m[4]);
  else if(m=/^Any number of models? can each be equipped with (.+?)(?:\.|:)?$/i.exec(first))mk("any",null,null,"",m[1],{add:1});
  else if((t=/^(?:This model|That model|The [^.]*? model|One model|1 model|Up to (?:\d+|one|two|three) models?) can (?:also )?be equipped with (.+?)(?:\.|:)?$/i.exec(first))&&!/\bor can\b|\bor\b.*replace/i.test(first)){
   const body=t[1];const grp=/of the following/i.test(body);let cap=1;const u=/^up to (\d+|one|two|three|four)\b/i.exec(body);if(u)cap=num(u[1])||1;else if(/^(\d+|one|two|three|four)\b/i.test(body)&&!grp)cap=num(/^(\w+)/.exec(body)[1])||1;
   if(grp&&/two of the following/i.test(body))cap=2;
   const tail=grp?"following":body.replace(/^(?:up to )?(?:\d+|one|two|three|four|an?)\s+/i,"");const alts=grp?lckAlts(rest):lckAlts(tail),to=alts.flat();
   if(!to.length)unk.push(s);else rules.push({kind:"add",k:cap,per:null,from:"",to,alts,txt:first,add:1,grp})}
  else unk.push(s)});
 return{rules,unk}}
/* ----- noms d'armes dans les deux langues -----
   Index « nom (anglais, français officiel, proposé, glossaire, ancien nom, nom saisi par l'utilisateur) → nom anglais canonique ».
   Une arme est ainsi reconnue qu'elle soit écrite en anglais ou en français, dans la liste comme dans le texte des options. */
const lckRaw=n=>nk(String(n||"").replace(/^➤\s*/,"").replace(/\(.*?\)/g,"").split(/\s+[-–]\s+/)[0]);
const lckStem=b=>b.split(" ").map(w=>w.length>3&&/[sx]$/.test(w)?w.slice(0,-1):w).filter(w=>!/^(?:de|du|des|la|le|les|d|l|a|au|aux|et|the|of)$/.test(w)).join(" ");
let LCKI=null,LCKV="";
function lckIdx(){let n=0;try{n=Object.keys(LB().tr||{}).length}catch(_){}const ver=((D.man&&D.man.version)||"")+"|"+n+"|"+((D.units||[]).length);if(LCKI&&LCKV===ver)return LCKI;const m=new Map(),bad=new Set();
 const put=(v,c)=>{v=lckStem(lckRaw(v));if(!v||!c)return;if(m.has(v)&&m.get(v)!==c)bad.add(v);else m.set(v,c)};
 const seen=new Set();let LBt=null;try{LBt=LB().tr||{}}catch(_){LBt={}}
 (D.units||[]).forEach(u=>[...(u.rw||[]),...(u.mw||[])].forEach(w=>{const en=String(w.n||"").replace(/^➤\s*/,"").replace(/\(.*?\)/g,"").split(/\s+[-–]\s+/)[0].trim();if(!en||seen.has(en))return;seen.add(en);
  const c=lckStem(lckRaw(en));if(!c)return;put(en,c);
  try{put(frName(en),c)}catch(_){}
  try{const r=tName(en);put(r.t,c);if(r.prop)put(r.prop,c)}catch(_){}
  try{const ov=D.fr[hh(en)];if(ov){if(ov.fr)put(ov.fr,c);(Array.isArray(ov.alt)?ov.alt:ov.alt?[ov.alt]:[]).forEach(a=>put(typeof a==="string"?a:a&&a.fr,c))}}catch(_){}
  try{const t=LBt["n:"+nk(en)];if(t&&t.fr)put(t.fr,c)}catch(_){}
  try{const g=typeof WN!=="undefined"&&WN[en.toLowerCase()];if(g)put(g,c)}catch(_){}}));
 bad.forEach(v=>m.delete(v));LCKI=m;LCKV=ver;return m}
const lckBase=n=>{const b=lckStem(lckRaw(n));const x=lckIdx().get(b);return x||b};
function lckWkeys(en){return new Set([lckBase(en)])}
function lckEquip(u,lib){/* effectifs d'armes choisis, profils d'une même arme regroupés (maximum, pas somme) */
 const c=u.cfg||{},raw={};let src="txt";
 if(c.wq){src="cfg";Object.keys(c.wq).forEach(k=>{if(c.wq[k]>0)raw[k]=c.wq[k]})}
 else String(u.equip||"").split(/[;\n]+/).forEach(x=>{const m=/^\s*(\d+)\s*[x×]\s*(.+?)(?:\s+[—–-]\s+.*)?$/.exec(x);if(m)raw[m[2].trim()]=(raw[m[2].trim()]||0)+(+m[1])});
 const g={};Object.keys(raw).forEach(k=>{const b=lckBase(k);if(!g[b])g[b]={name:k,n:0};g[b].n=Math.max(g[b].n,raw[k])});return{src,g}}
function lckEquipCheck(u,lib,size,out){
 const {rules,unk}=lckParseOpts(lib),eq=lckEquip(u,lib),nm=lckName(lib);
 const pc=pcOf(lib),paid=((pc&&pc.wg)||[]);
 /* équipements payants */
 const wg=(u.cfg&&u.cfg.wg)||{};Object.keys(wg).forEach(k=>{const q=wg[k];if(!q)return;const p=paid.find(x=>nk(x.n)===nk(k)||lckBase(x.n)===lckBase(k));
  if(!p)out.push({lv:"bad",t:nm+" : « "+k+" » n'est pas un équipement payant de cette fiche"});
  else if(q>size)out.push({lv:"bad",t:nm+" : "+q+" × "+k+" pour "+size+" figurine"+(size>1?"s":"")+" (trop)"});
  else out.push({lv:"ok",t:nm+" : "+q+" × "+k+" (+"+(q*p.pts)+" pts) — équipement payant autorisé"})});
 const sel=Object.keys(eq.g);
 if(!sel.length){if(rules.length||unk.length)out.push({lv:"info",nodet:nm});return}
 const known=new Set();[...(lib.rw||[]),...(lib.mw||[])].forEach(w=>lckWkeys(w.n).forEach(x=>known.add(x)));
 const loadout=nk(String((lib.wp&&lib.wp.loadout)||""));
 /* règles → composantes connexes (règles partageant une arme de remplacement) : capacité = somme des plafonds */
 const nl=t=>!(loadout&&loadout.includes(nk(t)));
 const R=[];rules.forEach(r=>{const alts=(r.alts||r.to.map(t=>[t])).map(a=>a.filter(nl).map(lckBase)).filter(a=>a.length);if(!alts.length)return;
  const lim=r.kind==="per"?Math.floor(size/r.per)*r.k:(r.kind==="fix"||r.kind==="add")?r.k:size;R.push({r,alts,own:new Set(alts.flat()),lim})});
 const comp=[];R.forEach(x=>{const hit=comp.filter(c=>[...x.own].some(w=>c.w.has(w)));const m={w:new Set(x.own),lim:x.lim,rs:[x],alts:[...x.alts]};hit.forEach(c=>{c.w.forEach(w=>m.w.add(w));m.lim+=c.lim;m.rs.push(...c.rs);m.alts.push(...c.alts);comp.splice(comp.indexOf(c),1)});comp.push(m)});
 let issues=0;
 comp.forEach(c=>{/* un remplacement peut donner plusieurs armes à la fois (« 1 X et 1 Y ») : on compte des figurines, pas des armes.
   Minorant du nombre de figurines concernées : somme, par groupe d'alternatives partageant une arme, du plus grand effectif d'une arme du groupe */
  const grp=[];c.alts.forEach(a=>{const hit=grp.filter(g=>a.some(w=>g.has(w)));const m=new Set(a);hit.forEach(g=>{g.forEach(w=>m.add(w));grp.splice(grp.indexOf(g),1)});grp.push(m)});
  const cnt=w=>{let n=0;sel.forEach(k=>{if(lckBase(k)===w)n=Math.max(n,eq.g[k].n)});return n};
  let n=0;grp.forEach(g=>{let m=0;g.forEach(w=>{m=Math.max(m,cnt(w))});n+=m});
  const used=[];sel.forEach(k=>{if(c.w.has(lckBase(k)))used.push(eq.g[k].n+" × "+eq.g[k].name)});
  const cite=unk.some(x=>{const z=nk(x);return [...c.w].some(w=>w&&z.includes(w))});
  if(n>c.lim){issues++;out.push({lv:cite?"warn":"bad",t:nm+" : au moins "+n+" figurine"+(n>1?"s":"")+" avec une arme de remplacement ("+used.join(", ")+") alors que les options analysées de la fiche n'en autorisent que "+c.lim+" pour "+size+" figurine"+(size>1?"s":"")+(cite?" (une option non analysée automatiquement mentionne cette arme : relis la fiche)":""),d:c.rs.map(x=>"Fiche : "+x.r.txt).join(" · ")})}});
 /* armes dont le nom n'est reconnu ni dans la fiche ni dans ses options : information seulement (nom personnalisé ou traduit autrement) */
 const inR=new Set();R.forEach(x=>x.own.forEach(w=>inR.add(w)));rules.forEach(r=>r.to.forEach(t=>inR.add(lckBase(t))));
 /* arme de la fiche, mais ni dans l'équipement de base ni dans une option : impossible si toutes les options ont été analysées */
 const loadStem=lckStem(loadout);
 const GEN=new Set(["weapon","weapons","heavy","light","master","crafted","special","issue","twin","combat","close","model","models","each","every","with","equipped"]);
 const toks=t=>nk(t).split(" ").filter(w=>w.length>=4&&!GEN.has(w));
 const pool=nk(String((lib.wp&&lib.wp.loadout)||"")+" "+((lib.wp&&lib.wp.opt)||[]).join(" "));
 const poolT=pool.split(" ");
 const near=w=>toks(w).some(t=>poolT.some(p=>p.length>=4&&(p.includes(t)||t.includes(p))));
 if(!unk.length)sel.forEach(k=>{const b=lckBase(k);if(known.has(b)&&!inR.has(b)&&!(loadout&&(loadout.includes(b)||loadStem.includes(b)))&&!near(k)&&!near(b)){out.push({lv:"warn",t:nm+" : « "+eq.g[k].name+" » n'apparaît ni dans l'équipement de base ni dans les options de cette fiche (à vérifier : certaines fiches omettent des armes)",d:"Équipement de base : "+String((lib.wp&&lib.wp.loadout)||"").replace(/\*\*/g,"").replace(/\n+/g," ")})}});
 const unr=sel.filter(k=>{const b=lckBase(k);return !(known.has(b)||inR.has(b)||(loadout&&loadout.includes(b)))}).map(k=>eq.g[k].name);
 if(unr.length)out.push({lv:"info",t:nm+" : arme"+(unr.length>1?"s":"")+" non reconnue"+(unr.length>1?"s":"")+" dans la fiche officielle (nom personnalisé ?) : "+unr.join(", ")});
 if(!issues)out.push({lv:"ok",t:nm+" : équipement conforme aux options de la fiche"+(unk.length?" ("+unk.length+" option"+(unk.length>1?"s":"")+" non analysée"+(unk.length>1?"s":"")+" automatiquement)":"")});
 else if(unk.length)out.push({lv:"info",t:nm+" : "+unk.length+" option"+(unk.length>1?"s":"")+" non analysée"+(unk.length>1?"s":"")+" automatiquement : relis la fiche"})}
/* ----- restrictions d'une optimisation (texte : « X model only ») ----- */
function lckEnhRestrict(e,bearer){const m=/^\s*([^.:]+?)\s+(?:model|unit)s?\s+only\b/i.exec(String(e.d||"").replace(/\*\*/g,""));if(!m)return null;
 const alts=m[1].split(/\s*(?:\/|,|\bor\b)\s*/i).map(x=>nk(x)).filter(Boolean);if(!alts.length)return null;
 const kw=lckKw(bearer),words=new Set([...kw].flatMap(k=>k.split(" ")));
 const ok=alts.some(a=>kw.has(a)||a.split(" ").every(w=>words.has(w)));return{ok,txt:m[1]}}
/* ----- contrôle complet ----- */
function lckRun(L){const out=[],sec=[];const size=lckSize(L),S0=LSZ[size],lim=lckLim(L,size),b=L.bld||{};
 const units=(L.units||[]),R=(()=>{try{return calc(L)}catch(_){return{lines:[],total:0,unk:0}}})();
 const add=(sc,it)=>sc.push(it);
 /* entrées : chaque unité + ses meneurs/appuis */
 const ent=[];units.forEach((u,i)=>{ent.push({u,i,j:null,lib:lckLib(u),top:true,host:u});(u.subs||[]).forEach((s,j)=>ent.push({u:s,i,j,lib:lckLib(s),top:false,host:u,label:s.label||"Meneur"}))});
 /* 1. points */
 const P=[];const total=R.total;
 if(R.unk)P.push({lv:"warn",t:R.unk+" coût"+(R.unk>1?"s":"")+" non déterminé"+(R.unk>1?"s":"")+" : le total n'est pas exact"});
 if(total>lim)P.push({lv:"bad",t:"Limite dépassée : "+fmt(total)+" / "+fmt(lim)+" pts (+"+fmt(total-lim)+")"});
 else P.push({lv:"ok",t:"Total "+fmt(total)+" / "+fmt(lim)+" pts"+(lim-total>0?" ("+fmt(lim-total)+" pts restants)":" (limite exacte)")});
 if(!units.length)P.push({lv:"info",t:"La liste est vide"});
 /* détail des points + comparaison au barème */
 const rows=[];const copyCt={};
 units.forEach((u,i)=>{const lib=lckLib(u),c=u.cfg;const size_=(c&&c.size)||+u.size||(lib&&sizesOf(lib,1)[0]&&sizesOf(lib,1)[0].n)||1;
  const ln=R.lines.filter(l=>l.i===i&&l.j==null);const base=ln.find(l=>l.k==="u");const eqp=ln.filter(l=>l.k==="w").reduce((a,l)=>a+(l.pts||0),0),en=ln.filter(l=>l.k==="e").reduce((a,l)=>a+(l.pts||0),0);
  const subs=R.lines.filter(l=>l.i===i&&l.j!=null).reduce((a,l)=>a+(l.pts||0),0);
  let ref=null;if(lib){copyCt[lib.id]=(copyCt[lib.id]||0)+1;const cs=costOf(lib,size_,copyCt[lib.id]);ref=cs.pts;
   if(ref!=null&&!u.cfg&&+u.pts!==ref&&!(+u.pts===0))P.push({lv:"warn",t:u.name+" : "+lckPts(+u.pts)+" pts saisis, le barème officiel donne "+ref+" pts pour "+size_+" figurine"+(size_>1?"s":"")+(cs.tier?" (exemplaire "+cs.tier+")":"")});
   else if(ref!=null&&u.cfg&&u.pm&&+u.pts!==ref+eqp+en)P.push({lv:"warn",t:u.name+" : coût modifié à la main ("+lckPts(+u.pts)+" pts) différent du barème ("+(ref+eqp+en)+" pts)"});
   if(ref==null&&cs.note)P.push({lv:"warn",t:u.name+" : "+cs.note})}
  else P.push({lv:"info",t:u.name+" : non liée à la bibliothèque, coût "+lckPts(+u.pts)+" pts non vérifiable"});
  (u.subs||[]).forEach(s=>{const sl=lckLib(s);if(sl)copyCt[sl.id]=(copyCt[sl.id]||0)+1});
  rows.push({n:u.name,sz:size_,base:base&&base.pts!=null?base.pts:(+u.pts||0),ref,eq:eqp,en,sub:subs,tot:(base&&base.pts!=null?base.pts:(+u.pts||0))+eqp+en+subs})});
 sec.push({id:"pts",t:"💰 Points",items:P,table:rows});
 /* 2. composition (règles de base 25.03–25.04) */
 const C=[];
 C.push({lv:"info",t:"Format : "+S0.n+" — "+fmt(S0.pts)+" pts, "+S0.dp+" points de détachement, "+S0.enh+" optimisations, "+S0.unit+" exemplaires d'une même fiche (×2 pour Ligne et Transport assigné, 1 pour un Héros épique)"});
 const ds=detsOf(L);const dpMx=S0.dp,dp=dpUsed(L);
 if(!ds.length)C.push({lv:"warn",t:"Aucun détachement choisi"});
 else{const lone3=size==="inc"&&ds.length===1&&dp===3;
  if(dp>dpMx&&!lone3)C.push({lv:"bad",t:"Points de détachement dépassés : "+dp+" / "+dpMx});else C.push({lv:"ok",t:"Points de détachement : "+dp+" / "+dpMx+(lone3?" (un détachement à 3 DP seul est permis en Incursion)":"")});
  const ids=ds.map(d=>d.id);if(new Set(ids).size!==ids.length)C.push({lv:"bad",t:"Le même détachement est choisi plusieurs fois"});
  ds.forEach(d=>{if(d.dp==null)C.push({lv:"info",t:"Détachement « "+d.name+" » : coût en points de détachement inconnu"})})}
 /* exemplaires */
 const cnt=new Map();ent.forEach(e=>{if(!e.lib)return;cnt.set(e.lib.id,{lib:e.lib,n:((cnt.get(e.lib.id)||{}).n||0)+1})});
 let dupBad=false;cnt.forEach(({lib,n})=>{const role=lckRole(lib);let max=S0.unit;if(role==="Ligne"||role==="Transports assignés")max=S0.unit*2;if(lckIsEpic(lib))max=1;
  if(n>max){dupBad=true;C.push({lv:"bad",t:lckName(lib)+" : "+n+" exemplaires, maximum "+max+(lckIsEpic(lib)?" (Héros épique : un seul)":role==="Ligne"||role==="Transports assignés"?" (Ligne / Transport assigné : double)":"")})}});
 if(cnt.size&&!dupBad)C.push({lv:"ok",t:"Limite d'exemplaires respectée"});
 /* optimisations */
 const enhs=[];ent.forEach(e=>{const c=e.u.cfg;if(c&&c.enh&&c.enh.id){const x=D.enh.find(z=>z.id===c.enh.id);enhs.push({e,x,id:c.enh.id,name:c.enh.name||(x&&x.n)||"?"})}});
 if(enhs.length>S0.enh)C.push({lv:"bad",t:enhs.length+" optimisations, maximum "+S0.enh+" en "+S0.n});else C.push({lv:enhs.length?"ok":"info",t:enhs.length+" / "+S0.enh+" optimisation"+(S0.enh>1?"s":"")});
 const seen={};enhs.forEach(h=>seen[h.id]=(seen[h.id]||0)+1);Object.keys(seen).forEach(k=>{if(seen[k]>1){const h=enhs.find(z=>z.id===k);C.push({lv:"bad",t:"« "+tName(h.name).t+" » est prise "+seen[k]+" fois (une seule fois par armée)"})}});
 const dets=detsOf(L);
 enhs.forEach(h=>{const lib=h.e.lib,who=h.e.u.name,nm=tName(h.name).t;
  if(!h.x){C.push({lv:"warn",t:"Optimisation « "+nm+" » introuvable dans la bibliothèque"});return}
  if(lib&&lckIsEpic(lib))C.push({lv:"bad",t:"« "+nm+" » sur "+who+" : un Héros épique ne peut pas recevoir d'optimisation"});
  else if(lib&&!lckIsChar(lib)&&!/\bUpgrade\b/i.test(String(h.x.d||"")))C.push({lv:"bad",t:"« "+nm+" » sur "+who+" : seules les unités PERSONNAGE peuvent recevoir une optimisation"});
  else if(!lib)C.push({lv:"info",t:"« "+nm+" » sur "+who+" : unité non liée à la bibliothèque, éligibilité non vérifiable"});
  else C.push({lv:"ok",t:"« "+nm+" » sur "+who+" : porteur valide"});
  if(dets.length&&!dets.some(d=>nk(h.x.det||"")===nk(d.en||d.name)))C.push({lv:"bad",t:"« "+nm+" » appartient au détachement « "+(h.x.det||"?")+" », qui n'est pas choisi dans cette liste"});
  if(lib){const r=lckEnhRestrict(h.x,lib);if(r&&!r.ok)C.push({lv:"warn",t:"« "+nm+" » : réservée aux « "+r.txt+" », ce que "+who+" ne semble pas être"})}
  if(h.x.pts==null)C.push({lv:"warn",t:"« "+nm+" » : coût en points non renseigné"})});
 /* une seule optimisation par unité (y compris unité rattachée) */
 units.forEach((u,i)=>{const n=enhs.filter(h=>h.e.i===i).length;if(n>1)C.push({lv:"bad",t:u.name+" : "+n+" optimisations dans la même unité (une seule permise, rattachés compris)"})});
 /* faction */
 const fac=b.facN||(L.facN)||"";if(fac){const bad=ent.filter(e=>e.lib&&Array.isArray(e.lib.f)&&e.lib.f.length&&!e.lib.f.some(f=>nk(f)===nk(fac)));
  if(bad.length)C.push({lv:"warn",t:bad.length+" unité"+(bad.length>1?"s":"")+" hors de la faction « "+fac+" » : "+bad.slice(0,4).map(e=>e.u.name).join(", ")+(bad.length>4?"…":"")+" (alliés : vérifie qu'ils sont permis)"});else if(ent.some(e=>e.lib))C.push({lv:"ok",t:"Toutes les unités appartiennent à la faction « "+fac+" »"})}
 /* effectifs et rattachements */
 units.forEach((u,i)=>{const lib=lckLib(u);if(!lib)return;const c=u.cfg,sz=sizesOf(lib,1);const n=(c&&c.size)||+u.size;
  if(n&&sz.length&&!sz.some(s=>n>=s.n&&n<=s.m))C.push({lv:"bad",t:u.name+" : effectif "+n+" non prévu (autorisé : "+sz.map(s=>s.n===s.m?s.n:s.n+"–"+s.m).join(", ")+")"});
  if(lckIsSup(lib))C.push({lv:"bad",t:u.name+" : unité d'appui seule dans la liste : un appui doit être rattaché à une unité de protection"});
  (u.subs||[]).forEach(s=>{const sl=lckLib(s);if(!sl)return;const cm=compat(lib,sl,s.label);
   if(cm.s!=="ok")C.push({lv:"warn",t:(s.label||"Meneur")+" « "+s.name+" » avec "+u.name+" : association non confirmée par les fiches"});else C.push({lv:"ok",t:(s.label||"Meneur")+" « "+s.name+" » peut rejoindre "+u.name})})});
 /* seigneur de guerre */
 const chars=ent.filter(e=>e.lib&&lckIsChar(e.lib));const wl=L.chk&&L.chk.warlord!=null?L.chk.warlord:null;
 if(!chars.length)C.push({lv:"bad",t:"Aucune unité PERSONNAGE : impossible de désigner un seigneur de guerre"});
 else if(wl==null||!chars.some(e=>e.i+"."+(e.j==null?"":e.j)===wl))C.push({lv:"warn",t:"Seigneur de guerre non désigné (choisis-le ci-dessous : un PERSONNAGE de ta faction)",wl:1});
 else{const e=chars.find(z=>z.i+"."+(z.j==null?"":z.j)===wl);C.push({lv:"ok",t:"Seigneur de guerre : "+e.u.name,wl:1})}
 C.push({lv:"info",t:"Réserves : au plus la moitié des unités ET la moitié des points peuvent commencer en réserve (Chapter Approved)"});
 sec.push({id:"comp",t:"📋 Composition (règles V11)",items:C,warlord:chars.map(e=>({v:e.i+"."+(e.j==null?"":e.j),n:e.u.name,sel:wl===e.i+"."+(e.j==null?"":e.j)}))});
 /* 3. équipements */
 const Q=[];ent.forEach(e=>{if(!e.lib)return;const n=(e.u.cfg&&e.u.cfg.size)||+e.u.size||1;try{lckEquipCheck(e.u,e.lib,n,Q)}catch(x){}});
 {const nd=[...new Set(Q.filter(x=>x.nodet).map(x=>x.nodet))];for(let k=Q.length-1;k>=0;k--)if(Q[k].nodet)Q.splice(k,1);if(nd.length)Q.push({lv:"info",t:nd.length+" unité"+(nd.length>1?"s":"")+" sans équipement détaillé (options non vérifiables) : "+nd.slice(0,6).join(", ")+(nd.length>6?"…":"")+". Choisis leurs armes dans le constructeur pour les contrôler."})}
 if(!Q.length)Q.push({lv:"info",t:"Aucun équipement détaillé à vérifier (utilise le constructeur pour choisir les armes de chaque unité)"});
 sec.push({id:"eq",t:"🔧 Équipements et options",items:Q});
 /* 4. préparation tournoi */
 const T=[];
 T.push({lv:size==="sf"&&lim===2000?"ok":"warn",t:size==="sf"&&lim===2000?"Format standard de tournoi : Strike Force, 2 000 points":"Les tournois officiels se jouent en général en Strike Force à 2 000 points (le Chapter Approved Tournament Companion suppose ce format)"});
 let paint=null;try{const H=window.__hob&&window.__hob.hob();if(H){const refs=units.map(u=>u.ref).filter(Boolean);if(refs.length){const done=refs.filter(r=>(H.sch[r]||{}).st==="fini").length;paint={done,all:refs.length}}}}catch(_){}
 if(paint)T.push({lv:paint.done===paint.all?"ok":"info",t:"Peinture : "+paint.done+" / "+paint.all+" unités marquées « terminées » dans ton suivi. Armée « Battle Ready » (entièrement peinte, socles soignés) = 10 PV bonus en mission Chapter Approved"});
 else T.push({lv:"info",t:"Peinture : une armée entièrement peinte « Battle Ready » rapporte 10 PV en mission Chapter Approved"});
 T.push({lv:"info",t:"Liste de l'armée : à présenter à l'adversaire avant la bataille (règle de base 25.01) ; pour un tournoi, à envoyer à l'organisateur avant la date limite"});
 T.push({lv:"info",t:"Rattachements (meneur / appui + unité de protection) : à noter par écrit avant la bataille, ils sont figés ensuite"});
 T.push({lv:"info",t:"Équipement des figurines conforme à la liste (WYSIWYG) : exigé par la plupart des événements (ex. WTC 2026 : armées entièrement peintes et WYSIWYG, 2 000 pts, unités Légendes interdites, Forge World permis)"});
 T.push({lv:"info",t:"Vérifie le pack de ton événement : certains imposent la liste en anglais, une limite de Forge World, ou des restrictions d'alliés en plus des règles de base"});
 sec.push({id:"tour",t:"🏆 Préparation tournoi",items:T});
 sec.forEach(s=>{const m=new Map();s.items.forEach(i=>{const k=i.lv+"|"+i.t;if(m.has(k))m.get(k).n++;else m.set(k,Object.assign({n:1},i))});s.items=[...m.values()].map(i=>{if(i.n>1)i.t+=" (×"+i.n+")";return i})});
 const cnts={bad:0,warn:0,ok:0,info:0};sec.forEach(s=>s.items.forEach(i=>cnts[i.lv]=(cnts[i.lv]||0)+1));
 return{sec,counts:cnts,size,lim,total}}
/* ----- liste au format « soumission » ----- */
function lckText(L){const r=lckRun(L),S0=LSZ[r.size],b=L.bld||{},R=calc(L),ds=detsOf(L);const o=[];
 o.push(L.name);o.push("Faction : "+(b.facN||"—"));o.push("Format : "+S0.n+" ("+fmt(r.lim)+" pts) — Total : "+fmt(R.total)+" pts");
 if(ds.length)o.push("Détachement"+(ds.length>1?"s":"")+" : "+ds.map(d=>(d.name||"")+(d.dp!=null?" ("+d.dp+" DP)":"")).join(" + "));
 const wl=L.chk&&L.chk.warlord;let wn="";if(wl!=null){const [i,j]=String(wl).split(".");const u=L.units[+i];if(u)wn=j!==""&&j!=null?((u.subs||[])[+j]||{}).name:u.name}
 if(wn)o.push("Seigneur de guerre : "+wn);o.push("");
 (L.units||[]).forEach((u,i)=>{const lib=lckLib(u),ln=R.lines.filter(l=>l.i===i&&l.j==null),pts=ln.filter(l=>l.pts!=null).reduce((a,l)=>a+l.pts,0)||(+u.pts||0),sz=(u.cfg&&u.cfg.size)||u.size;
  o.push((lib?lib.n:u.name)+(sz>1?" ("+sz+" models)":"")+" — "+pts+" pts");
  const c=u.cfg||{};Object.keys(c.wq||{}).forEach(k=>{if(c.wq[k]>0)o.push("   • "+c.wq[k]+" × "+k)});
  ln.filter(l=>l.k==="w").forEach(l=>o.push("   • "+l.name+" ("+l.pts+" pts)"));
  ln.filter(l=>l.k==="e").forEach(l=>o.push("   • "+l.name.replace(/^Optimisation :/,"Enhancement :")+" ("+l.pts+" pts)"));
  (u.subs||[]).forEach((s,j)=>{const sl=R.lines.filter(l=>l.i===i&&l.j===j),sp=sl.filter(l=>l.pts!=null).reduce((a,l)=>a+l.pts,0);o.push("   + "+(s.label==="Appui"?"Support":"Leader")+" : "+((lckLib(s)||{}).n||s.name)+" — "+sp+" pts")});
  o.push("")});
 return o.join("\n")}
/* ----- interface ----- */
function lckCss(){if(document.getElementById("lckcss"))return;const s=document.createElement("style");s.id="lckcss";s.textContent=`#lchk{position:fixed;inset:0;z-index:92;background:rgba(5,6,5,.9);display:flex;align-items:flex-end;justify-content:center}
#lchk .pp{background:var(--card);color:var(--tx);width:min(640px,100%);max-height:96vh;overflow:auto;border-radius:16px 16px 0 0;padding:14px;padding-bottom:calc(20px + env(safe-area-inset-bottom,0px))}
#lchk h3{margin:0}#lchk .sm{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}#lchk .sm span{border-radius:999px;padding:5px 12px;font-weight:700;border:1px solid var(--bd)}
#lchk .sm .bad{background:#5a2323;color:#ffd0d0}#lchk .sm .warn{background:#5a4416;color:#ffe3a6}#lchk .sm .ok{background:#17402c;color:#b9f1d2}
#lchk details{border:1px solid var(--bd);border-radius:12px;margin:8px 0;padding:4px 10px;background:var(--bg)}#lchk summary{cursor:pointer;font-weight:700;padding:8px 0;list-style:none;display:flex;gap:8px;align-items:center}#lchk summary::-webkit-details-marker{display:none}
#lchk .it{display:flex;gap:8px;padding:6px 0;border-top:1px solid var(--bd);font-size:14px;line-height:1.35}#lchk .it i{font-style:normal;flex:none;width:20px}
#lchk .it.bad{color:#ff9d9d}#lchk .it.warn{color:#ffd37a}#lchk .it.ok{color:#9be6bd}#lchk .it.info{color:var(--mu)}#lchk .it small{display:block;color:var(--mu)}
#lchk table{width:100%;border-collapse:collapse;font-size:12.5px;margin:8px 0}#lchk td,#lchk th{padding:4px 3px;border-bottom:1px solid var(--bd);text-align:right}#lchk td:first-child,#lchk th:first-child{text-align:left}
#lchk .ct{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}#lchk select{width:100%;margin:4px 0}#lchk .src{font-size:12px;color:var(--mu);margin-top:8px}#lchk .src a{color:var(--ac)}`;document.head.appendChild(s)}
const lckIc={bad:"❌",warn:"⚠️",ok:"✅",info:"ℹ️"};
function lckHtml(L){const r=lckRun(L);const S0=LSZ[r.size];
 let h=`<div class="pp"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3>✅ Vérifier la liste</h3><button class="b" data-lck="close" aria-label="Fermer">✕</button></div>
 <div class="mu" style="margin-top:4px"><b>${E(L.name)}</b></div>
 <div class="ct">${Object.keys(LSZ).map(k=>`<button class="b${r.size===k?" p":""}" data-lck="size" data-v="${k}">${LSZ[k].n} · ${fmt(LSZ[k].pts)} pts</button>`).join("")}</div>
 <div class="sm"><span class="${r.counts.bad?"bad":"ok"}">❌ ${r.counts.bad} erreur${r.counts.bad>1?"s":""}</span><span class="${r.counts.warn?"warn":"ok"}">⚠️ ${r.counts.warn} à vérifier</span><span class="ok">✅ ${r.counts.ok} conforme${r.counts.ok>1?"s":""}</span></div>
 <p class="mu" style="margin:0 0 6px">${r.counts.bad?"La liste n'est pas valide pour un tournoi tant qu'il reste des erreurs.":r.counts.warn?"Aucune erreur certaine, mais des points sont à confirmer.":"Aucune erreur détectée par les règles vérifiables automatiquement."}</p>`;
 r.sec.forEach(s=>{const bad=s.items.some(x=>x.lv==="bad"),warn=s.items.some(x=>x.lv==="warn");
  h+=`<details ${bad||warn?"open":""}><summary>${s.t} <span class="mu">${bad?"❌":warn?"⚠️":"✅"}</span></summary>`;
  if(s.warlord&&s.warlord.length)h+=`<label class="mu">Seigneur de guerre<select data-lck="wl"><option value="">— à choisir —</option>${s.warlord.map(w=>`<option value="${E(w.v)}"${w.sel?" selected":""}>${E(w.n)}</option>`).join("")}</select></label>`;
  s.items.forEach(x=>{h+=`<div class="it ${x.lv}"><i>${lckIc[x.lv]||""}</i><span>${E(x.t)}${x.d?`<small>${E(x.d)}</small>`:""}</span></div>`});
  if(s.table&&s.table.length)h+=`<div class="w"><table><tr><th>Unité</th><th>Fig.</th><th>Base</th><th>Barème</th><th>Équip.</th><th>Optim.</th><th>Meneur</th><th>Total</th></tr>${s.table.map(t=>`<tr><td>${E(t.n)}</td><td>${t.sz}</td><td>${t.base}</td><td>${t.ref==null?"—":t.ref}</td><td>${t.eq||"·"}</td><td>${t.en||"·"}</td><td>${t.sub||"·"}</td><td><b>${t.tot}</b></td></tr>`).join("")}<tr><td colspan="7"><b>Total</b></td><td><b>${fmt(r.total)}</b></td></tr></table></div>`;
  h+=`</details>`});
 h+=`<div class="ct"><button class="b p" data-lck="copy">📋 Copier la liste (format tournoi)</button></div>
 <div class="src">Sources : <a href="https://wahapedia.ru/wh40k11ed/the-rules/core-rules/" target="_blank" rel="noopener">règles de base 11e, « Muster Armies »</a> · <a href="https://wahapedia.ru/wh40k11ed/the-rules/chapter-approved-2025-26/" target="_blank" rel="noopener">Chapter Approved Tournament Companion</a>. Les règles propres à un événement (peinture, WYSIWYG, Forge World, alliés, langue) varient : vérifie le pack de ton tournoi.</div></div>`;
 return h}
function lckDraw(){const L=(S.lists||[]).find(l=>l.id===LCK.id);const o=document.getElementById("lchk");if(!L||!o)return;const sc=o.querySelector(".pp");const y=sc?sc.scrollTop:0;const op=[...o.querySelectorAll("details")].map(d=>d.open);o.innerHTML=lckHtml(L);
 const ds=[...o.querySelectorAll("details")];if(op.length===ds.length)ds.forEach((d,i)=>d.open=op[i]);const n=o.querySelector(".pp");if(n)n.scrollTop=y}
function lckOpen(id){const L=(S.lists||[]).find(l=>l.id===id);if(!L)return;lckCss();LCK.id=id;let o=document.getElementById("lchk");if(!o){o=document.createElement("div");o.id="lchk";document.body.appendChild(o)}o.innerHTML=lckHtml(L)}
function lckClose(){const o=document.getElementById("lchk");if(o)o.remove();LCK.id=null}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("[data-chk],[data-lck]");if(!t)return;e.preventDefault();e.stopPropagation();
 if(t.dataset.chk){lckOpen(t.dataset.chk);return}
 const a=t.dataset.lck,L=(S.lists||[]).find(l=>l.id===LCK.id);
 if(a==="close"){lckClose();return}if(!L)return;
 if(a==="size"){L.chk=L.chk||{};L.chk.size=t.dataset.v;save();lckDraw()}
 else if(a==="copy"){const tx=lckText(L);const done=()=>{try{toast("Liste copiée ✓")}catch(_){}};try{navigator.clipboard.writeText(tx).then(done,()=>{window.prompt("Copie la liste :",tx)})}catch(_){window.prompt("Copie la liste :",tx)}}},true);
document.addEventListener("change",e=>{const t=e.target;if(!t||t.dataset.lck!=="wl")return;const L=(S.lists||[]).find(l=>l.id===LCK.id);if(!L)return;L.chk=L.chk||{};L.chk.warlord=t.value===""?null:t.value;save();lckDraw()},true);
/* ----- contrôle d'une configuration d'unité dans le constructeur : blocage d'une option invalide, confirmation à l'ajout ----- */
const lckNorm=t=>String(t).replace(/\s*\(×\d+\)\s*$/,"");
function lckTmpUnit(e,cfg){return{name:e.name,ref:(e.coll&&e.coll.ref)||"t"+(e.lib?e.lib.id.slice(0,6):"x"),size:cfg.size,pts:0,subs:JSON.parse(JSON.stringify(cfg.subs||[])),cfg:{lib:e.lib?e.lib.id:null,size:cfg.size,wq:cfg.wq||{},wn:cfg.wn||{},wg:cfg.wg||{},enh:cfg.enh||null,manual:+cfg.manual||0}}}
function lckBadOf(L,units){const L2=Object.assign({},L,{units});const r=lckRun(L2);const o=[];r.sec.forEach(s=>s.items.forEach(i=>{if(i.lv==="bad")o.push({t:lckNorm(i.t),d:i.d})}));return o}
/* erreurs apportées par cette unité : liste sans elle ↔ liste avec elle */
function lckCfgProblems(L,c,e){if(!L||!c||!e||!e.lib)return[];
 const others=(L.units||[]).filter((u,i)=>i!==c.idx);const before=new Set(lckBadOf(L,others).map(x=>x.t));
 return lckBadOf(L,[...others,lckTmpUnit(e,c)]).filter(x=>!before.has(x.t))}
/* un changement de configuration crée-t-il de nouvelles erreurs ? */
function lckCfgTry(L,c,e,patch){if(!L||!c||!e||!e.lib)return[];
 const others=(L.units||[]).filter((u,i)=>i!==c.idx);const c2=JSON.parse(JSON.stringify(c));Object.keys(patch).forEach(k=>{c2[k]=Object.assign({},c2[k],patch[k]);Object.keys(c2[k]).forEach(x=>{if(!c2[k][x])delete c2[k][x]})});
 const before=new Set(lckBadOf(L,[...others,lckTmpUnit(e,c)]).map(x=>x.t));
 return lckBadOf(L,[...others,lckTmpUnit(e,c2)]).filter(x=>!before.has(x.t))}
function lckPop(o){lckCss();let p=document.getElementById("lckpop");if(p)p.remove();p=document.createElement("div");p.id="lckpop";
 p.innerHTML=`<div class="pk"><h3>${E(o.t)}</h3>${o.p?`<p class="mu" style="margin:6px 0">${E(o.p)}</p>`:""}<ul>${(o.items||[]).map(x=>`<li>${E(x.t||x)}${x.d?`<small>${E(x.d)}</small>`:""}</li>`).join("")}</ul><div class="ct">${(o.buttons||[]).map(b=>`<button class="b${b.cls?" "+b.cls:""}" data-lckp="${b.k}">${E(b.l)}</button>`).join("")}</div></div>`;
 document.body.appendChild(p);p.addEventListener("click",ev=>{const b=ev.target.closest("[data-lckp]");if(!b)return;ev.preventDefault();ev.stopPropagation();p.remove();if(o.cb)o.cb(b.dataset.lckp)},true)}
(function(){const c=document.createElement("style");c.id="lckpopcss";c.textContent=`#lckpop{position:fixed;inset:0;z-index:130;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:16px}#lckpop .pk{background:var(--card);color:var(--tx);border:1px solid var(--bd);border-radius:16px;padding:16px;width:min(420px,100%);max-height:86vh;overflow:auto}#lckpop h3{margin:0}#lckpop ul{padding-left:18px;margin:8px 0}#lckpop li{margin:6px 0;line-height:1.35}#lckpop small{display:block;color:var(--mu)}#lckpop .ct{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}#lckpop .ct .b{flex:1;min-height:44px}`;document.head.appendChild(c)})();
window.BIBLCK={run:lckRun,text:lckText,open:lckOpen,parseOpts:lckParseOpts,cfgProblems:lckCfgProblems,cfgTry:lckCfgTry,pop:lckPop};
