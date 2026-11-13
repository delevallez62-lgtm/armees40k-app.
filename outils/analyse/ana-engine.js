/* ===== HAMMER · Analyse & Simulation — moteur de calcul local (V11) =====
   Aucune dépendance, aucun accès réseau, indépendant de l'interface.
   Règles appliquées : Règles de Base V11 (séquence d'attaque 05, aptitudes d'arme 24, couvert 13.08).
   Principe : une donnée absente n'est jamais inventée ; elle est signalée dans `missing` / `notes`. */
(function(root){
"use strict";
const nk=s=>String(s==null?"":s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g,"'").replace(/[^a-z0-9'+\- ]+/g," ").replace(/\s+/g," ").trim();

/* ---------- 1. dés ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* "3", "D6", "D3", "2D6+3", "D6+2" ; renvoie null si la valeur est absente ou illisible */
function parseDice(s){if(s==null)return null;const t=String(s).replace(/\s+/g,"").toUpperCase();if(!t||t==="-"||t==="—")return null;
 let m=/^(\d+)$/.exec(t);if(m){const v=+m[1];return{raw:t,n:0,sides:0,add:v,min:v,max:v,avg:v}}
 m=/^(\d*)D(3|6)([+-]\d+)?$/.exec(t);if(!m)return null;const n=m[1]?+m[1]:1,sd=+m[2],add=m[3]?+m[3]:0,mean=sd===6?3.5:2;
 return{raw:t,n,sides:sd,add,min:n+add,max:n*sd+add,avg:n*mean+add}}
function rollDie(sd,rng){const r=Math.floor(rng()*6)+1;return sd===3?Math.ceil(r/2):r}
function rollDice(d,rng){let v=d.add;for(let i=0;i<d.n;i++)v+=rollDie(d.sides,rng);return v}
const parseTarget=s=>{const m=/(\d)\s*\+/.exec(String(s==null?"":s));return m?+m[1]:null};

/* ---------- 2. aptitudes d'arme (Règles de Base V11, section 24) ---------- */
const ABIL=[
 ["TOUCHES_FATALES",/^touches fatales/],["TOUCHES_SOUTENUES",/^touches soutenues/],["BLESSURES_DEVASTATRICES",/^blessures devastatrices/],
 ["ANTI",/^anti[- ]/],["DEFLAGRATION",/^deflagration/],["TIR_RAPIDE",/^tir rapide/],["LOURD",/^lourd/],["LANCE",/^lance/],["JUMELE",/^jumele/],
 ["TORRENT",/^torrent/],["FUSION",/^fusion/],["ABATTAGE",/^abattage/],["IGNORE_COUVERT",/^ignore le couvert/],["PRECISION",/^precision/],
 ["ATTAQUES_BONUS",/^attaques bonus/],["PISTOLET",/^pistolet/],["COMBAT_RAPPROCHE",/^combat rapproche/],["ASSAUT",/^assaut/],
 ["TIR_INDIRECT",/^tir indirect/],["TIR_UNIQUE",/^tir unique/],["A_RISQUE",/^a risque/],["PSYCHIQUE",/^psychique/]];
const SUPPORTED=new Set(["TOUCHES_FATALES","TOUCHES_SOUTENUES","BLESSURES_DEVASTATRICES","ANTI","DEFLAGRATION","TIR_RAPIDE","LOURD","LANCE","JUMELE","TORRENT","FUSION","ABATTAGE","IGNORE_COUVERT","PRECISION","ATTAQUES_BONUS","PISTOLET","COMBAT_RAPPROCHE","ASSAUT","TIR_INDIRECT","TIR_UNIQUE","A_RISQUE","PSYCHIQUE"]);
/* effet purement informatif (n'altère pas les dégâts moyens du modèle) */
const INFO_ONLY=new Set(["PRECISION","PISTOLET","COMBAT_RAPPROCHE","ASSAUT","TIR_INDIRECT","TIR_UNIQUE","A_RISQUE","PSYCHIQUE"]);
function splitCaps(c){const o=[];let d=0,cur="";for(const ch of String(c||"")){if(ch==="("||ch==="[")d++;if(ch===")"||ch==="]")d=Math.max(0,d-1);if(ch===","&&!d){o.push(cur);cur=""}else cur+=ch}o.push(cur);return o.map(x=>x.replace(/^[\s\[]+|[\s\]]+$/g,"")).filter(Boolean)}
const nkc=s=>String(s==null?"":s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"'").replace(/[^a-z0-9'+\-:\/ ]+/g," ").replace(/\s+/g," ").trim();
function parseCaps(caps){const out={list:[],unknown:[]};
 splitCaps(caps).forEach(raw=>{let t=nkc(raw),kw=[];const ci=t.indexOf(":");if(ci>0){kw=t.slice(ci+1).split("/").map(x=>x.trim()).filter(Boolean);t=t.slice(0,ci).trim()}
  const hit=ABIL.find(a=>a[1].test(t));if(!hit){out.unknown.push(raw);return}
  const id=hit[0],o={id,raw,kw,x:null,y:null};
  if(id==="ANTI"){const m=/^anti[- ]\s*(.+?)\s+(\d)\+?$/.exec(t);if(m){o.kwTarget=m[1].trim();o.y=+m[2]}else{out.unknown.push(raw);return}}
  else{const m=/(\d+)\s*$/.exec(t);if(m)o.x=+m[1]}
  out.list.push(o)});return out}

/* ---------- 3. lecture d'une fiche d'unité importée ---------- */
function parseSave(sv){const s=String(sv==null?"":sv),arm=/(?:^|[^\d])(\d)\+(?!\+)/.exec(s),inv=/(\d)\+\+/.exec(s);return{sv:arm?+arm[1]:null,inv:inv?+inv[1]:null}}
function parseStats(st){const o={missing:[]};st=st||{};
 const E=parseInt(st.E,10),PV=parseInt(st.PV,10),sv=parseSave(st.SV),CO=st.CO==null||st.CO===""?null:(String(st.CO).trim()==="-"?0:parseInt(st.CO,10)),M=parseInt(st.M,10);
 o.E=Number.isFinite(E)?E:null;o.PV=Number.isFinite(PV)?PV:null;o.sv=sv.sv;o.inv=sv.inv;o.CO=Number.isFinite(CO)?CO:null;o.M=Number.isFinite(M)?M:null;o.CD=parseTarget(st.CD);
 if(o.E==null)o.missing.push("Endurance");if(o.PV==null)o.missing.push("Points de vie");if(o.sv==null&&o.inv==null)o.missing.push("Sauvegarde");return o}
const fnpOf=u=>{const m=/insensible a la douleur\s*(\d)\+/.exec(nk(u.apt||""));return m?+m[1]:null};
function weaponCounts(u){const map={};String(u.equip||"").split(",").forEach(p=>{const m=/^(.*?)(?:\s*\((\d+)\))?\s*$/.exec(p.trim());if(m&&m[1])map[nk(m[1])]=m[2]?+m[2]:null});return map}
function parseWeapon(w){const miss=[],melee=/m[eê]l[eé]e|corps/i.test(String(w.range||"")),a=parseDice(w.a),d=parseDice(w.d),hit=parseTarget(w.hit),f=parseInt(w.f,10),pa=parseInt(String(w.pa).replace("−","-"),10),caps=parseCaps(w.caps);
 const torrent=caps.list.some(c=>c.id==="TORRENT");
 if(!a)miss.push("Attaques (A)");if(!d)miss.push("Dégâts (D)");if(hit==null&&!torrent)miss.push(melee?"CC":"CT");if(!Number.isFinite(f))miss.push("Force (F)");if(!Number.isFinite(pa))miss.push("PA");
 const range=melee?0:parseInt(w.range,10);
 return{name:String(w.name||"?"),melee,range:Number.isFinite(range)?range:null,a,d,hit,f:Number.isFinite(f)?f:null,pa:Number.isFinite(pa)?pa:null,caps:caps.list,unknownCaps:caps.unknown,bonus:caps.list.some(c=>c.id==="ATTAQUES_BONUS"),torrent,missing:miss,alt:String(w.name||"").includes(" - ")?nk(String(w.name).split(" - ")[0]):null}}
/* unité → profil de simulation. models : liste de groupes {n,stats,weapons,isLeader,isChar} */
function toProfile(u,opts){opts=opts||{};const notes=[],missing=[];
 const kw=new Set([...String(u.kw||"").split(","),...String(u.fkw||"").split(",")].map(x=>nk(x)).filter(Boolean));
 const base=parseStats(u.stats),subs=(u.subs||[]).map(s=>({label:s.label,name:s.name,stats:parseStats(s.stats),weapons:s.weapons||[]}));
 let size=parseInt(u.size,10);if(!Number.isFinite(size))size=Math.max(1,parseInt(u.qty,10)||1);
 const nBase=Math.max(0,size-subs.length);
 const cnt=weaponCounts(u),fnp=fnpOf(u),isChar=kw.has("personnage"),groups=[];
 const mkW=(arr,n,exact)=>arr.map(w=>{const pw=parseWeapon(w);const c=exact?null:cnt[nk(w.name)];
  let k;if(exact)k=n;else if(c===undefined)k=n===1?1:null;else if(c===null)k=n===1?1:null;else k=Math.min(c,n);
  if(k==null){k=1;notes.push("Nombre d'armes « "+w.name+" » non indiqué : 1 retenu")}
  pw.count=k;return pw});
 if(nBase>0)groups.push({n:nBase,stats:base,weapons:mkW(u.weapons||[],nBase,false),isLeader:false,isChar,label:u.name});
 subs.forEach(s=>groups.push({n:1,stats:s.stats,weapons:mkW(s.weapons,1,true),isLeader:true,isChar:true,label:s.name||s.label}));
 if(!groups.length)groups.push({n:1,stats:base,weapons:[],isLeader:false,isChar,label:u.name});
 groups.forEach(g=>{g.stats.missing.forEach(m=>missing.push(m));g.weapons.forEach(w=>w.missing.forEach(m=>missing.push(w.name+" : "+m)))});
 const uniq=a=>[...new Set(a)];
 const IGN=new Set(["PRECISION","A_RISQUE","TIR_UNIQUE","PSYCHIQUE","TIR_INDIRECT"]);
 groups.forEach(g=>g.weapons.forEach(w=>w.caps.forEach(c=>{if(IGN.has(c.id))notes.push("Aptitude d'arme sans effet sur le calcul : "+c.raw+" ("+w.name+")")})));
 const apts=String(u.apt||"").split(",").map(x=>x.trim()).filter(x=>x&&!/insensible a la douleur/.test(nk(x)));
 if(apts.length)notes.push("Aptitudes de l'unité non prises en compte dans le calcul : "+apts.join(", "));
 const unknownCaps=uniq(groups.flatMap(g=>g.weapons.flatMap(w=>w.unknownCaps)));
 return{name:String(u.name||"?"),ref:u.ref||"",pts:Number.isFinite(parseInt(u.pts,10))&&parseInt(u.pts,10)>0?parseInt(u.pts,10):null,models:groups.reduce((a,g)=>a+g.n,0),groups,kw,fnp,
  missing:uniq(missing),notes:uniq(notes),unknownCaps,apt:String(u.apt||""),fkw:String(u.fkw||"")}}
const totalWounds=p=>p.groups.reduce((a,g)=>a+g.n*(g.stats.PV||0),0);

/* ---------- 4. séquence d'attaque V11 ---------- */
/* seuil de blessure (05.02) : force vs endurance */
function woundNeeded(F,E){if(F>=2*E)return 2;if(F>E)return 3;if(F===E)return 4;if(F*2<=E)return 6;return 5}
const hasKw=(set,k)=>!!k&&(set.has(k)||set.has(k+"s")||set.has(k.replace(/s$/,"")));
function capActive(c,tgtKw){if(!c.kw||!c.kw.length)return true;return c.kw.some(k=>hasKw(tgtKw,k))}
/* contexte : {half:boolean mi-portée, cover:boolean, charged:boolean, still:boolean, tgtModels:int} */
function weaponDice(w,tgtModels,ctx,kwT){/* nombre moyen / max / tirage de dés d'attaque */
 const has=id=>w.caps.find(c=>c.id===id&&capActive(c,kwT));let add=0,addMax=0;
 const def=has("DEFLAGRATION");if(def)add+=(def.x||1)*Math.floor(tgtModels/5);
 const ab=has("ABATTAGE");if(ab)add+=(ab.x||1)*Math.floor(tgtModels/5);
 const tr=has("TIR_RAPIDE");if(tr&&ctx.half)add+=tr.x||0;
 return add}
function weaponParams(w,tgtGroup,kwT,ctx){/* paramètres effectifs contre un groupe de cibles */
 const has=id=>w.caps.find(c=>c.id===id&&capActive(c,kwT));
 let ct=w.hit;if(ct!=null&&!w.melee&&ctx.cover&&!has("IGNORE_COUVERT"))ct=ct+1; // couvert : CT dégradée de 1 (13.08)
 const hitMod=(has("LOURD")&&!w.melee&&ctx.still?1:0);
 const woundMod=(has("LANCE")&&w.melee&&ctx.charged?1:0);
 let D=w.d,fusion=has("FUSION");const dAdd=fusion&&ctx.half?(fusion.x||0):0;
 const anti=w.caps.find(c=>c.id==="ANTI"&&hasKw(kwT,c.kwTarget));
 return{ct,hitMod,woundMod,dAdd,anti:anti?anti.y:null,
  sustained:(has("TOUCHES_SOUTENUES")||{}).x||0,fatal:!!has("TOUCHES_FATALES"),deva:!!has("BLESSURES_DEVASTATRICES"),torrent:w.torrent,reroll:!!has("JUMELE")}}
/* probabilités d'un jet de touche : {pc: touche critique, pn: touche normale} */
function hitProbs(P){if(P.torrent)return{pc:0,pn:1};let pn=0;for(let r=2;r<=5;r++)if(P.ct!=null&&r+P.hitMod>=P.ct)pn++;return{pc:1/6,pn:pn/6}}
function woundProbs(P,F,E){const need=woundNeeded(F,E);let pn=0,pc=0;
 for(let r=2;r<=6;r++){const crit=r===6||(P.anti!=null&&r>=P.anti);if(crit)pc++;else if(r+P.woundMod>=need)pn++}
 pc/=6;pn/=6;if(P.reroll){const q=1-pc-pn;pc+=q*pc;pn+=q*pn}return{pc,pn}}
function saveFailProb(sv,inv,pa){let ok=0;for(let r=2;r<=6;r++){const byInv=inv!=null&&r>=inv,byArm=sv!=null&&r+pa>=sv;if(byInv||byArm)ok++}return 1-ok/6}

/* touches fatales : blesser automatiquement interdit la blessure critique (24.23) ; on retient l'option la plus avantageuse */
function fatalAuto(P,wd,w,st,tgtProf){if(!P.fatal)return false;if(!P.deva)return true;
 const wp=woundProbs(P,w.f,st.E),pf=saveFailProb(st.sv,st.inv,w.pa),fk=tgtProf.fnp?(1-(7-tgtProf.fnp)/6):1,d=Math.max(0,w.d.avg+P.dAdd);
 const auto=pf*d*fk,roll=wp.pc*Math.min(d,st.PV||d)*fk+wp.pn*pf*d*fk;return auto>=roll}
/* dégâts effectifs d'une attaque non sauvegardée sur une figurine de PV donnés (aucun dépassement sur la figurine suivante) */
function binomPmf(n,k,p){let c=1;for(let i=0;i<k;i++)c=c*(n-i)/(i+1);return c*Math.pow(p,k)*Math.pow(1-p,n-k)}
function effPerAttack(dd,dAdd,PV,keepP){const outs=[];if(dd.sides===0)outs.push(Math.max(0,dd.add+dAdd));else{const sd=dd.sides;let arr=[dd.add+dAdd];for(let i=0;i<dd.n;i++){const nx=[];arr.forEach(v=>{for(let f=1;f<=6;f++)nx.push(v+(sd===3?Math.ceil(f/2):f))});arr=nx}arr.forEach(v=>outs.push(Math.max(0,v)))}
 let tot=0;outs.forEach(d=>{let e=0;for(let k=0;k<=d;k++)e+=Math.min(k,PV)*binomPmf(d,k,keepP);tot+=e});return tot/outs.length}
/* espérance exacte (théorique) pour 1 arme × count contre 1 groupe cible — sans perte par excès de dégâts */
function expectedWeapon(w,tgtGroup,tgtProf,ctx){const kwT=tgtProf.kw,P=weaponParams(w,tgtGroup,kwT,ctx),st=tgtGroup.stats;
 const out={attacks:0,hits:0,wounds:0,unsaved:0,damage:0,mortal:0,ok:true};
 if(w.missing.length||st.E==null){out.ok=false;return out}
 const add=weaponDice(w,tgtProf.models,ctx,kwT),A=(w.a?w.a.avg:0)+add,att=A*w.count;out.attacks=att;
 const hp=hitProbs(P),wp=woundProbs(P,w.f,st.E),pf=saveFailProb(st.sv,st.inv,w.pa),dAvg=Math.max(0,w.d.avg+P.dAdd);

 const fnpK=tgtProf.fnp?(1-(7-tgtProf.fnp)/6):1,effA=effPerAttack(w.d,P.dAdd,st.PV||1,fnpK);out.eff=0;
 const critHits=att*hp.pc,normHits=att*hp.pn+att*hp.pc*P.sustained;out.hits=critHits+normHits;
 const auto=fatalAuto(P,null,w,st,tgtProf);let wN,wC;
 if(auto){wN=normHits*wp.pn+critHits;wC=normHits*wp.pc}else{wN=(normHits+critHits)*wp.pn;wC=(normHits+critHits)*wp.pc}
 out.wounds=wN+wC;
 if(P.deva){out.mortal=wC*effA;out.unsaved=wN*pf;out.damage=out.unsaved*dAvg*fnpK+wC*dAvg*fnpK;out.eff=out.unsaved*effA+out.mortal}
 else{out.unsaved=(wN+wC)*pf;out.damage=out.unsaved*dAvg*fnpK;out.eff=out.unsaved*effA}
 return out}

/* ---------- 5. simulation de dés virtuels (allocation figurine par figurine) ---------- */
function makeTarget(p){/* instances individuelles, groupes ordonnés : non-personnages d'abord, puis personnages (05.03) */
 const gs=p.groups.map((g,i)=>({g,i,models:Array.from({length:g.n},()=>({pv:g.stats.PV||1}))}));
 gs.sort((a,b)=>(a.g.isChar?1:0)-(b.g.isChar?1:0));return gs}
function pickModel(gs){/* groupe courant : un groupe contenant une figurine blessée d'abord (hors personnages), sinon l'ordre */
 for(const grp of gs){const alive=grp.models.filter(m=>m.pv>0);if(!alive.length)continue;if(!grp.g.isChar&&alive.some(m=>m.pv<grp.g.stats.PV))return{grp,m:alive.find(m=>m.pv<grp.g.stats.PV)}}
 for(const grp of gs){const alive=grp.models.filter(m=>m.pv>0);if(!alive.length)continue;const w=alive.find(m=>m.pv<grp.g.stats.PV);return{grp,m:w||alive[0]}}
 return null}
function loseWounds(m,n,fnp,rng){let lost=0;for(let i=0;i<n&&m.pv>0;i++){if(fnp&&Math.floor(rng()*6)+1>=fnp)continue;m.pv--;lost++}return lost}
function simulateOnce(att,tgt,sel,ctx,rng){
 const kwT=tgt.kw,gs=makeTarget(tgt),startM=tgt.models;let dmg=0;const mortalQueue=[],saves=[];
 const aliveCount=()=>gs.reduce((a,g)=>a+g.models.filter(m=>m.pv>0).length,0);
 sel.forEach(({w})=>{const P0=weaponParams(w,null,kwT,ctx),add=weaponDice(w,startM,ctx,kwT);
  let diceN=0;for(let k=0;k<w.count;k++)diceN+=rollDice(w.a,rng)+add;
  const pend=[];
  for(let i=0;i<diceN;i++){let isHit=false,isCrit=false;
   if(P0.torrent)isHit=true;else{const r=Math.floor(rng()*6)+1;if(r===6){isHit=true;isCrit=true}else if(r!==1&&r+P0.hitMod>=P0.ct)isHit=true}
   if(isHit){pend.push({crit:isCrit});if(isCrit)for(let s=0;s<P0.sustained;s++)pend.push({crit:false})}}
  /* endurance : celle du groupe majoritaire encore en vie (limite documentée) */
  const mainG=gs.reduce((b,g)=>{const n=g.models.filter(m=>m.pv>0).length;return!b||n>b.n?{g,n}:b},null);if(!mainG||!mainG.n)return;
  const st=mainG.g.g.stats,need=woundNeeded(w.f,st.E),auto=fatalAuto(P0,null,w,st,tgt);
  const roll=()=>{const r=Math.floor(rng()*6)+1;if(r===6)return{wd:true,c:true};if(r===1)return{wd:false,c:false};if(P0.anti!=null&&r>=P0.anti)return{wd:true,c:true};return{wd:r+P0.woundMod>=need,c:false}};
  pend.forEach(h=>{let wd,c=false;
   if(h.crit&&auto){wd=true}else{let x=roll();if(!x.wd&&P0.reroll)x=roll();wd=x.wd;c=x.c}
   if(!wd)return;
   if(c&&P0.deva)mortalQueue.push({d:Math.max(0,rollDice(w.d,rng)+P0.dAdd)});
   else saves.push({roll:Math.floor(rng()*6)+1,w,P0})})});
 saves.sort((a,b)=>a.roll-b.roll);
 for(const s of saves){const pm=pickModel(gs);if(!pm)break;const st=pm.grp.g.stats;
  let ok=false;if(s.roll!==1){if(st.inv!=null&&s.roll>=st.inv)ok=true;else if(st.sv!=null&&s.roll+s.w.pa>=st.sv)ok=true}
  if(ok)continue;const D=Math.max(0,rollDice(s.w.d,rng)+s.P0.dAdd);dmg+=loseWounds(pm.m,D,tgt.fnp,rng)}
 for(const mq of mortalQueue){const pm=pickModel(gs);if(!pm)break;dmg+=loseWounds(pm.m,mq.d,tgt.fnp,rng)}
 const alive=aliveCount();return{dmg,killed:startM-alive,wiped:alive===0}}
function chooseWeapons(att,mode,tgt,ctx,opt){/* sélection des armes utilisées (règles : Attaques Bonus + une arme de mêlée ; profils alternatifs exclusifs) */
 const sel=[];const kwT=tgt.kw;
 att.groups.forEach(g=>{let ws=g.weapons.filter(w=>(mode==="melee")===w.melee&&w.count>0&&!w.missing.length);
  if(opt&&opt.only&&opt.only.length)ws=ws.filter(w=>opt.only.includes(w.name));
  /* profils alternatifs (« Arme - profil ») : un seul utilisable, le meilleur */
  const byAlt={};ws.forEach(w=>{const k=w.alt||("_"+w.name);(byAlt[k]=byAlt[k]||[]).push(w)});
  const tg=tgt.groups[0];let chosen=[];
  Object.values(byAlt).forEach(arr=>{if(arr.length===1){chosen.push(arr[0]);return}
   let best=arr[0],bv=-1;arr.forEach(w=>{const e=expectedWeapon(w,tg,tgt,ctx).damage;if(e>bv){bv=e;best=w}});chosen.push(best)});
  /* mêlée : une seule arme hors [ATTAQUES BONUS] pour une figurine unique */
  if(mode==="melee"&&g.n===1&&!(opt&&opt.only&&opt.only.length)){const bonus=chosen.filter(w=>w.bonus),other=chosen.filter(w=>!w.bonus);if(other.length>1){let best=other[0],bv=-1;other.forEach(w=>{const e=expectedWeapon(w,tg,tgt,ctx).damage;if(e>bv){bv=e;best=w}});chosen=[...bonus,best]}}
  chosen.forEach(w=>sel.push({w,tg:g}))});
 return sel}
/* simulation de n tirages */
function simulate(att,tgt,mode,ctx,n,seed,opt){const rng=mulberry32(seed==null?12345:seed),sel=chooseWeapons(att,mode,tgt,ctx,opt);
 const dm=[],kills=[];let wiped=0,sumD=0,sumK=0;const hist={};
 for(let i=0;i<n;i++){const r=simulateOnce(att,tgt,sel,ctx,rng);dm.push(r.dmg);kills.push(r.killed);sumD+=r.dmg;sumK+=r.killed;if(r.wiped)wiped++;hist[r.killed]=(hist[r.killed]||0)+1}
 dm.sort((a,b)=>a-b);const q=p=>dm[Math.min(dm.length-1,Math.floor(p*dm.length))];
 return{n,mean:sumD/n,median:q(.5),p10:q(.1),p90:q(.9),min:dm[0],max:dm[dm.length-1],killsMean:sumK/n,wipeProb:wiped/n,hist,weapons:sel.map(s=>s.w.name)}}
/* moyenne théorique + maximum théorique pour le même scénario */
function theory(att,tgt,mode,ctx,opt){const sel=chooseWeapons(att,mode,tgt,ctx,opt);let avg=0,eff=0,max=0,att_=0,hits=0,wounds=0,mortal=0;const per=[];
 sel.forEach(({w})=>{const mainG=tgt.groups.reduce((b,g)=>g.n>b.n?g:b,tgt.groups[0]);const e=expectedWeapon(w,mainG,tgt,ctx);avg+=e.damage;eff+=e.eff;att_+=e.attacks;hits+=e.hits;wounds+=e.wounds;mortal+=e.mortal;
  /* maximum : dés d'attaque maximaux, toutes touches (critiques) et blessures réussies, aucune sauvegarde */
  const P=weaponParams(w,mainG,tgt.kw,ctx),addD=weaponDice(w,tgt.models,ctx,tgt.kw),Amax=((w.a?w.a.max:0)+addD)*w.count,hmax=Amax*(1+P.sustained);
  max+=hmax*Math.max(0,(w.d?w.d.max:0)+P.dAdd);per.push({name:w.name,count:w.count,dmg:e.damage,eff:e.eff,attacks:e.attacks})});
 const wounds0=totalWounds(tgt),wm=tgt.groups.reduce((a,g)=>a+g.n,0);
 const mainG=tgt.groups.reduce((b,g)=>g.n>b.n?g:b,tgt.groups[0]),pvM=Math.max(1,mainG.stats.PV||1);
 return{avg,eff,max,maxCapped:Math.min(max,wounds0),totalWounds:wounds0,attacks:att_,hits,wounds,mortal,killsApprox:Math.min(wm,eff/pvM),per,sel:sel.map(s=>s.w.name)}}

/* ---------- 6. comparaison de deux armées ---------- */
const DEFCTX={half:false,cover:false,charged:false,still:false};
function ptsOf(p){return p.pts==null?0:p.pts}
function armyProfiles(units){return units.map(u=>toProfile(u))}
/* fraction de l'unité cible détruite (espérance, plafonnée à 1) */
function fracKilled(dmg,tgt){const w=totalWounds(tgt);return w>0?Math.min(1,dmg/w):0}
function pairMatrix(A,B,ctx){ctx=ctx||DEFCTX;const m=[];
 A.forEach((a,i)=>{m[i]=[];B.forEach((b,j)=>{const sh=theory(a,b,"shoot",ctx),me=theory(a,b,"melee",ctx);m[i][j]={shoot:sh.eff,melee:me.eff,rawS:sh.avg,rawM:me.avg,fs:fracKilled(sh.eff,b),fm:fracKilled(me.eff,b),killS:sh.killsApprox,killM:me.killsApprox}})});return m}
function armyStats(P,Q,mat){/* P : armée analysée ; Q : adversaire ; mat[i][j] : P_i contre Q_j */
 const sum=(a,f)=>a.reduce((x,y)=>x+f(y),0),models=sum(P,p=>p.models),pts=sum(P,p=>ptsOf(p));
 const o={units:P.length,models,pts,wounds:sum(P,p=>totalWounds(p)),missingPts:P.filter(p=>p.pts==null).length};
 const useW=Q.every(q=>ptsOf(q)>0),WQ=q=>useW?ptsOf(q):1;o.weighting=useW?"points":"égale";
 const wavg=(i,key)=>{let v=0,w=0;Q.forEach((q,j)=>{const pj=WQ(q);v+=mat[i][j][key]*pj;w+=pj});return w>0?v/w:0};
 o.shootPts=sum(P.map((_,i)=>i),i=>wavg(i,"fs"));o.meleePts=sum(P.map((_,i)=>i),i=>wavg(i,"fm"));
 o.shootDmg=sum(P.map((_,i)=>i),i=>Q.length?Q.reduce((a,q,j)=>a+mat[i][j].shoot,0)/Q.length:0);
 o.meleeDmg=sum(P.map((_,i)=>i),i=>Q.length?Q.reduce((a,q,j)=>a+mat[i][j].melee,0)/Q.length:0);
 o.oc=sum(P,p=>p.groups.reduce((a,g)=>a+g.n*(g.stats.CO||0),0));o.ocUnits=P.filter(p=>p.groups.some(g=>(g.stats.CO||0)>0)).length;
 const ms=P.flatMap(p=>p.groups.filter(g=>g.stats.M!=null).map(g=>[g.stats.M,g.n])),mn=ms.reduce((a,x)=>a+x[1],0);o.moveAvg=mn?ms.reduce((a,x)=>a+x[0]*x[1],0)/mn:null;
 const hasK=(p,k)=>hasKw(p.kw,k)||nk(p.apt).includes(k);
 o.fly=P.filter(p=>hasK(p,"vol")).length;o.deep=P.filter(p=>/frappe en profondeur|infiltrateurs|eclaireurs/.test(nk(p.apt))).length;
 const rng=P.flatMap(p=>p.groups.flatMap(g=>g.weapons.filter(w=>!w.melee&&w.range!=null).map(w=>w.range)));o.maxRange=rng.length?Math.max(...rng):null;o.avgRange=rng.length?rng.reduce((a,b)=>a+b,0)/rng.length:null;
 const isH=q=>hasKw(q.kw,"vehicule")||hasKw(q.kw,"monstre"),isI=q=>hasKw(q.kw,"infanterie");
 const vs=pred=>{const idx=Q.map((q,j)=>pred(q)?j:-1).filter(j=>j>=0);if(!idx.length)return null;let s=0,m=0,w=0;idx.forEach(j=>{const pj=WQ(Q[j]);w+=pj;P.forEach((_,i)=>{s+=mat[i][j].fs*pj;m+=mat[i][j].fm*pj})});return{n:idx.length,shoot:w?s/w:0,melee:w?m/w:0}};
 o.vsHeavy=vs(isH);o.vsInf=vs(isI);
 o.auras=P.flatMap(p=>String(p.apt).split(",").map(s=>s.trim()).filter(s=>/\(aura\)/i.test(s)).map(s=>({u:p.name,a:s})));
 o.leaders=P.filter(p=>hasKw(p.kw,"personnage")).length;return o}
/* danger / vulnérabilité par unité */
function unitRanking(P,Q,matPQ,matQP){
 const uQ=Q.every(q=>ptsOf(q)>0),uP=P.every(p=>ptsOf(p)>0),WQ=q=>uQ?ptsOf(q):1;
 const danger=P.map((p,i)=>{let best=null;Q.forEach((q,j)=>{const m=matPQ[i][j],v=Math.max(m.fs,m.fm)*WQ(q);if(!best||v>best.v)best={j,v,type:m.fs>=m.fm?"tir":"mêlée",f:Math.max(m.fs,m.fm)}});
  return{i,name:p.name,pts:p.pts,best,perPoint:p.pts?(best?best.v/p.pts:0):null}});
 const vuln=P.map((p,i)=>{let f=0;Q.forEach((q,j)=>{f+=Math.max(matQP[j][i].fs,matQP[j][i].fm)});return{i,name:p.name,pts:p.pts,focus:Math.min(1,f)}});
 return{danger:danger.sort((a,b)=>(b.best?b.best.v:0)-(a.best?a.best.v:0)),vuln:vuln.sort((a,b)=>b.focus-a.focus)}}

/* ---------- 7. estimation théorique de victoire ---------- */
const WEIGHTS={firepower:0.45,objectives:0.25,durability:0.20,mobility:0.10};
function ratioLog(a,b){a=Math.max(a,1e-6);b=Math.max(b,1e-6);return Math.log(a/b)}
function winEstimate(sA,sB){/* sA/sB : armyStats de chaque camp contre l'autre */
 const f=[];const fpA=sA.shootPts+sA.meleePts,fpB=sB.shootPts+sB.meleePts;
 f.push({k:"Puissance de feu et de mêlée",w:WEIGHTS.firepower,a:fpA,b:fpB,s:ratioLog(fpA+0.02,fpB+0.02),txt:"part des points adverses détruite en un tour (tir + mêlée)"});
 f.push({k:"Contrôle d'objectifs",w:WEIGHTS.objectives,a:sA.oc,b:sB.oc,s:ratioLog(sA.oc+1,sB.oc+1),txt:"somme des caractéristiques de CO"});
 const durA=sA.wounds/Math.max(1e-6,sB.shootPts+sB.meleePts+0.02),durB=sB.wounds/Math.max(1e-6,sA.shootPts+sA.meleePts+0.02);
 f.push({k:"Résistance",w:WEIGHTS.durability,a:sA.wounds,b:sB.wounds,s:ratioLog(durA,durB),txt:"points de vie totaux rapportés aux dégâts reçus"});
 const mA=sA.moveAvg,mB=sB.moveAvg;f.push({k:"Mobilité",w:WEIGHTS.mobility,a:mA,b:mB,s:mA&&mB?ratioLog(mA,mB):0,txt:"mouvement moyen",missing:!(mA&&mB)});
 let z=0,wt=0;f.forEach(x=>{if(!x.missing){z+=x.w*x.s;wt+=x.w}});z=wt?z/wt:0;
 let pA=1/(1+Math.exp(-2.2*z));pA=Math.min(.85,Math.max(.15,pA));
 return{pA,pB:1-pA,factors:f.map(x=>({...x,contrib:x.missing?0:x.w*x.s/(wt||1)})),z}}

/* ---------- 8. historique des parties ---------- */
function resultOf(s1,s2){return s1>s2?"V":s1<s2?"D":"E"}
function histStats(games){const g=(games||[]).filter(x=>x&&Number.isFinite(+x.s1)&&Number.isFinite(+x.s2));const n=g.length;
 const c={V:0,D:0,E:0};g.forEach(x=>c[x.res||resultOf(+x.s1,+x.s2)]++);
 const pc=v=>n?v/n*100:null,avg=f=>n?g.reduce((a,x)=>a+(+x[f]),0)/n:null;
 const by=(key)=>{const m={};g.forEach(x=>{const k=(key(x)||"Non renseigné");const o=m[k]=m[k]||{n:0,V:0,D:0,E:0,s1:0,s2:0};o.n++;o[x.res||resultOf(+x.s1,+x.s2)]++;o.s1+=+x.s1;o.s2+=+x.s2});
  return Object.entries(m).map(([k,o])=>({k,n:o.n,V:o.V,D:o.D,E:o.E,win:o.V/o.n*100,loss:o.D/o.n*100,draw:o.E/o.n*100,avg1:o.s1/o.n,avg2:o.s2/o.n})).sort((a,b)=>b.n-a.n)};
 return{n,V:c.V,D:c.D,E:c.E,win:pc(c.V),loss:pc(c.D),draw:pc(c.E),avg1:avg("s1"),avg2:avg("s2"),
  byFaction:by(x=>x.f1),byDetachment:by(x=>x.d1),byOpponent:by(x=>x.f2),byFirst:by(x=>x.first===1?"J1 commence":x.first===2?"J2 commence":"Non renseigné")}}


/* ---------- 9. analyse complète de deux armées (structure + textes justifiés par les chiffres) ---------- */
const pct=x=>Math.round(x*100)+" %",f1=x=>(Math.round(x*10)/10).toString().replace(".",",");
function analyseArmies(unitsA,unitsB,ctx,names){ctx=ctx||DEFCTX;names=names||["Armée 1","Armée 2"];
 const PA=armyProfiles(unitsA),PB=armyProfiles(unitsB);
 const mAB=pairMatrix(PA,PB,ctx),mBA=pairMatrix(PB,PA,ctx),sA=armyStats(PA,PB,mAB),sB=armyStats(PB,PA,mBA),win=winEstimate(sA,sB);
 const rA=unitRanking(PA,PB,mAB,mBA),rB=unitRanking(PB,PA,mBA,mAB);
 const missing=[];[[PA,names[0]],[PB,names[1]]].forEach(([P,n])=>P.forEach(p=>{if(p.missing.length)missing.push({army:n,unit:p.name,what:p.missing.join(", ")});if(p.pts==null)missing.push({army:n,unit:p.name,what:"Points non renseignés (valeurs en points sous-estimées)"});p.unknownCaps.forEach(c=>missing.push({army:n,unit:p.name,what:"Aptitude d'arme non modélisée : "+c}));p.notes.filter(c=>!/^Aptitudes de l.unité/.test(c)).forEach(c=>missing.push({army:n,unit:p.name,what:c}))}));
 const useA=PA.every(p=>p.pts>0),useB=PB.every(p=>p.pts>0),VA=p=>useA?p.pts:1,VB=p=>useB?p.pts:1;
 const out=(m,i,j)=>Math.max(m[i][j].fs,m[i][j].fm),outType=(m,i,j)=>m[i][j].fs>=m[i][j].fm?"tir":"mêlée";
 /* attributions : quelle unité contre quelle unité (meilleure valeur en points, sinon meilleur pourcentage) */
 const assign=PA.map((a,i)=>{let best=null;PB.forEach((b,j)=>{const f=out(mAB,i,j),v=f*VB(b),back=out(mBA,j,i);const key=v>0?v:f*0.001;if(!best||key>best.key)best={j,f,v,key,type:outType(mAB,i,j),back,backType:outType(mBA,j,i),dmg:Math.max(mAB[i][j].shoot,mAB[i][j].melee)}});return{i,name:a.name,pts:a.pts,best}});
 const threats=PB.map((b,j)=>{let toA=0,top=[];PA.forEach((a,i)=>{const f=out(mBA,j,i);toA=Math.max(toA,f*VA(a));top.push({i,f:out(mAB,i,j)})});top.sort((x,y)=>y.f-x.f);
  return{j,name:b.name,pts:b.pts,threat:toA,bestHit:(()=>{let bi=null;PA.forEach((a,i)=>{const f=out(mBA,j,i),v=f*VA(a);if(!bi||v>bi.v)bi={i,f,v,type:outType(mBA,j,i)}});return bi})(),killers:top.slice(0,3).map(t=>({i:t.i,name:PA[t.i].name,f:t.f}))}}).sort((x,y)=>y.threat-x.threat);
 const preserve=PA.map((a,i)=>{let focus=0;PB.forEach((b,j)=>{focus+=out(mBA,j,i)});focus=Math.min(1,focus);let outBest=0;PB.forEach((b,j)=>{outBest=Math.max(outBest,out(mAB,i,j)*VB(b))});return{i,name:a.name,pts:a.pts,focus,value:outBest,score:focus*VA(a)+outBest*0.5}}).sort((x,y)=>y.score-x.score);
 const eff=PA.map((a,i)=>{let bv=0,bj=-1,bf=0;PB.forEach((b,j)=>{const f=out(mAB,i,j),v=f*VB(b);if(v>bv||bj<0&&f>bf){bv=v;bj=j;bf=f}});return{i,name:a.name,pts:a.pts,v:bv,per:useA&&useB&&a.pts?bv/a.pts:null,j:bj,f:bf}}).sort((x,y)=>(y.per==null?-1:y.per)-(x.per==null?-1:x.per));
 const pairs=[];PA.forEach((a,i)=>PB.forEach((b,j)=>{const o=out(mAB,i,j),r=out(mBA,j,i),ov=o*VB(b),rv=r*VA(a);pairs.push({i,j,a:a.name,b:b.name,out:o,back:r,outV:ov,backV:rv,ratio:(rv>0?ov/rv:(ov>0?99:1)),typeOut:outType(mAB,i,j),typeBack:outType(mBA,j,i)})}));
 const rel=pairs.filter(x=>x.out>0.01||x.back>0.01);
 const favorable=[...rel].filter(x=>x.ratio>=1.5&&x.out>=0.15).sort((x,y)=>y.ratio*y.out-x.ratio*x.out).slice(0,6);
 const unfavorable=[...rel].filter(x=>x.ratio<=0.67&&x.back>=0.15).sort((x,y)=>x.ratio/Math.max(.01,x.back)-y.ratio/Math.max(.01,y.back)).slice(0,6);
 const avoid=[...rel].filter(x=>x.typeBack==="mêlée"&&x.back>=0.5&&x.back>x.out*1.5).sort((x,y)=>y.back-x.back).slice(0,6);
 /* avantages / faiblesses (comparaison chiffrée) */
 const adv={A:[],B:[]},weak={A:[],B:[]};
 const cmpM=(label,a,b,fmt,hi=1.2,lo=1/1.2)=>{if(a==null||b==null)return;const r=(a+1e-9)/(b+1e-9);const t=`${label} : ${fmt(a)} contre ${fmt(b)}`;if(r>=hi){adv.A.push(t);weak.B.push(t)}else if(r<=lo){adv.B.push(t);weak.A.push(t)}};
 const fpA=sA.shootPts+sA.meleePts,fpB=sB.shootPts+sB.meleePts;
 cmpM("Puissance totale (équivalent en % des points adverses, un tour)",fpA,fpB,x=>pct(x));
 cmpM("Puissance de tir",sA.shootPts,sB.shootPts,x=>pct(x));cmpM("Puissance de mêlée",sA.meleePts,sB.meleePts,x=>pct(x));
 cmpM("Points de vie totaux",sA.wounds,sB.wounds,x=>String(Math.round(x)));
 cmpM("Contrôle d'objectifs (somme des CO)",sA.oc,sB.oc,x=>String(x));
 cmpM("Mouvement moyen",sA.moveAvg,sB.moveAvg,x=>f1(x)+"\"");cmpM("Portée maximale",sA.maxRange,sB.maxRange,x=>x+"\"");
 cmpM("Figurines",sA.models,sB.models,x=>String(x));
 if(sA.vsHeavy&&sA.vsHeavy.n){const h=sA.vsHeavy.shoot+sA.vsHeavy.melee,i=sA.vsInf?sA.vsInf.shoot+sA.vsInf.melee:null;if(i!=null&&h<i*0.6)weak.A.push(`Capacité antichar limitée : ${pct(h)} des points de véhicules/monstres adverses contre ${pct(i)} d'infanterie`);if(i!=null&&h>i*1.4)adv.A.push(`Bonne capacité antichar : ${pct(h)} des points de véhicules/monstres adverses contre ${pct(i)} d'infanterie`)}
 if(sB.vsHeavy&&sB.vsHeavy.n){const h=sB.vsHeavy.shoot+sB.vsHeavy.melee,i=sB.vsInf?sB.vsInf.shoot+sB.vsInf.melee:null;if(i!=null&&h<i*0.6)weak.B.push(`Capacité antichar limitée : ${pct(h)} contre ${pct(i)} d'infanterie`);if(i!=null&&h>i*1.4)adv.B.push(`Bonne capacité antichar : ${pct(h)} contre ${pct(i)} d'infanterie`)}
 if(sA.deep>sB.deep)adv.A.push(`Arrivées par frappe en profondeur / infiltration : ${sA.deep} unités contre ${sB.deep}`);else if(sB.deep>sA.deep)adv.B.push(`Arrivées par frappe en profondeur / infiltration : ${sB.deep} unités contre ${sA.deep}`);
 if(sA.fly!==sB.fly)(sA.fly>sB.fly?adv.A:adv.B).push(`Unités capables de voler : ${Math.max(sA.fly,sB.fly)} contre ${Math.min(sA.fly,sB.fly)}`);
 /* stratégies */
 const strat=[];
 const rr=(a,b)=>(a+1e-9)/(b+1e-9);
 if(rr(sA.shootPts,sB.shootPts)>=1.2&&(sA.maxRange||0)>=(sB.maxRange||0))strat.push({t:"Jouer à distance",why:`Tir de ${names[0]} : ${pct(sA.shootPts)} des points adverses par tour contre ${pct(sB.shootPts)} ; portée maximale ${sA.maxRange||"?"}" contre ${sB.maxRange||"?"}".`});
 if(rr(sB.meleePts,sA.meleePts)>=1.3)strat.push({t:"Éviter les engagements en mêlée",why:`La mêlée adverse détruit ${pct(sB.meleePts)} de vos points en un tour contre ${pct(sA.meleePts)} pour la vôtre : bloquez, ciblez les unités de mêlée en premier, restez hors de portée de charge.`});
 else if(rr(sA.meleePts,sB.meleePts)>=1.3)strat.push({t:"Chercher la mêlée",why:`Votre mêlée détruit ${pct(sA.meleePts)} des points adverses contre ${pct(sB.meleePts)} dans l'autre sens.`});
 if(rr(sA.oc,sB.oc)<=0.85)strat.push({t:"Ne pas jouer l'usure sur les objectifs",why:`Contrôle d'objectifs : ${sA.oc} contre ${sB.oc}. Il faut éliminer des unités qui tiennent les objectifs plutôt que de les disputer à nombre égal.`});
 else if(rr(sA.oc,sB.oc)>=1.15)strat.push({t:"Marquer par les objectifs",why:`Contrôle d'objectifs supérieur : ${sA.oc} contre ${sB.oc} (${sA.ocUnits} unités capables de tenir un objectif).`});
 if(threats.length)strat.push({t:"Neutraliser en priorité "+threats.slice(0,2).map(x=>x.name).join(" puis "),why:threats.slice(0,2).map(x=>`${x.name} peut détruire ${pct(x.bestHit?x.bestHit.f:0)} de ${x.bestHit?PA[x.bestHit.i].name:"?"} (${x.bestHit?x.bestHit.type:""})`).join(" ; ")});
 if(sA.deep>0)strat.push({t:"Garder des unités en réserve",why:`${sA.deep} unité(s) peuvent arriver par frappe en profondeur / infiltration : elles permettent de contourner la puissance adverse et de menacer les objectifs.`});
 return{weighting:{A:useA?"points":"égale",B:useB?"points":"égale"},names,PA,PB,mAB,mBA,sA,sB,win,rankA:rA,rankB:rB,assign,threats,preserve,eff,favorable,unfavorable,avoid,adv,weak,strat,missing,ctx}}

const HYPOTHESES=[
 "Règles V11 appliquées : séquence d'attaque (05), aptitudes d'arme [TOUCHES FATALES/SOUTENUES], [BLESSURES DÉVASTATRICES], [ANTI], [DÉFLAGRATION], [ABATTAGE], [TIR RAPIDE], [LOURD], [LANCE], [JUMELÉ], [TORRENT], [FUSION], [IGNORE LE COUVERT] ; couvert (CT −1) ; Insensible à la Douleur.",
 "Les autres aptitudes d'unité, auras, stratagèmes, points de commandement, optimisations et unités attachées ne modifient pas les calculs.",
 "Unité à endurance mixte : l'endurance du groupe le plus nombreux encore en vie est utilisée (règle V11 non vérifiée pour ce cas).",
 "Toutes les armes de tir (ou de mêlée) de l'unité sont utilisées ; pour les profils alternatifs (« Arme - profil »), le meilleur est retenu ; en mêlée, une figurine seule garde [ATTAQUES BONUS] + sa meilleure arme.",
 "Distances, déplacements, ligne de vue et terrain ne sont pas simulés : tu choisis le scénario (mi-portée, couvert, charge, immobile).",
 "Nombre d'armes absent de la liste : 1 retenu, et signalé."];
root.ANA={HYPOTHESES,analyseArmies,nk,mulberry32,parseDice,rollDice,parseCaps,parseSave,parseStats,parseWeapon,toProfile,totalWounds,woundNeeded,saveFailProb,hitProbs,woundProbs,weaponParams,weaponDice,
 expectedWeapon,simulate,simulateOnce,theory,chooseWeapons,pairMatrix,armyStats,unitRanking,winEstimate,histStats,resultOf,fracKilled,DEFCTX,WEIGHTS,SUPPORTED,INFO_ONLY};
if(typeof module!=="undefined")module.exports=root.ANA;
})(typeof window!=="undefined"?window:globalThis);
