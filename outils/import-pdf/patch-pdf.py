import sys
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# 1. seule la ligne de total est ignorée (et non toute ligne contenant « figurines »)
rep('.filter(s=>s&&!CATS.test(s)&&!/figurines/.test(s))','.filter((s,i,a)=>s&&(!CATS.test(s)||/(?:^(?:Aptitudes|Equipement|Mots-clés(?: de faction)?)\\s*:|,\\s*$)/.test(a[i-1]||""))&&!/^\\d+\\s*points?\\s*-\\s*\\d+\\s*figurines?\\b/i.test(s)&&!/^\\d+\\s*figurines?$/i.test(s))')
# 2. titres de catégories supplémentaires
rep('|Transports? dédiés?|','|Transports? (?:dédiés?|assignés?)|Transports?|Aéronefs?|Drones?|')
# 3. noms d'armes : « Kombi-karbo - Fling\' » et « Multi-klateur » (le tiret collé n'est recollé qu'avant une minuscule)
rep('const o=f=>n[f].sort((p,q)=>q.y-p.y||p.x-q.x).map(i=>i.s.trim()).join(" ").replace(/\\s+/g," ").replace(/-\\s+(?=[A-ZÀ-Ý])/g,"-");',
    'const o=f=>{const t=n[f].sort((p,q)=>q.y-p.y||p.x-q.x).map(i=>i.s.trim()).join(" ").replace(/\\s+/g," ");return f==="caps"?t.replace(/-\\s+(?=[A-ZÀ-Ý])/g,"-"):t.replace(/(\\S)-\\s+(?=[a-zà-ÿ])/g,"$1-")};')
# 4. première entrée d'une section : colonne du texte repérée sur les lignes suivantes
rep(';let bodyIt=[];if(lbl){if(cbx&&',';if(lbl&&!cbx){let mn=null;for(let q=k+1;q<Math.min(rows.length,k+7);q++){const x0=rows[q].it[0].x;if(x0>f.x+60&&rows[q].it.every(i=>i.x>f.x+60)&&(mn===null||x0<mn))mn=x0}if(mn!==null)cbx=mn}let bodyIt=[];if(lbl){if(cbx&&')
rep('rule:lines.slice(d,end).join(" ").replace(','rule:lines.slice(d,end).join(" ").replace(/^Disposition\\s*:\\s*/,"").replace(')
# 5. nom d'aptitude contenant une virgule (« Makai, Lèv' c'te Bannière ! ») : gardé en un seul nom
rep(' if(o.apt){const sn=new Set();',' if(o.apt){const pa=o.apt.split(",").map(x=>x.trim()).filter(Boolean),LK=(o.text||[]).map(x=>abK(x)),mo=[];for(let i=0;i<pa.length;i++){let b=null;for(let n=Math.min(3,pa.length-i);n>=2;n--){const j=pa.slice(i,i+n).join(", "),k=abK(j);if(k&&LK.some(l=>l===k||l.startsWith(k+" "))){b=[n,j];break}}if(b){mo.push(b[1].replace(/,/g,"\u201a"));i+=b[0]-1}else mo.push(pa[i])}o.apt=mo.join(", ")}\n if(o.apt){const sn=new Set();')
rep('function findH(t,n,pos,strict){let j=pos,first=-1;','function findH(t,n,pos,strict){n=String(n).replace(/\u201a/g,",");let j=pos,first=-1;')
# 6. unités à plusieurs profils de caractéristiques (ex. Boyz / Boss Nob) : profils gardés
rep(' let cur=null;const map={"Equipement":"equip"',' {const pf=[],SR=/^[\\d"+\\/\\-]+$/;for(let q=1;q<(wh<0?Math.min(seg.length,4):wh);q++){const t=(seg[q]||"").trim().split(/\\s+/);if(t.length>=6&&t.slice(0,6).every(x=>SR.test(x)))pf.push({n:t.slice(6).join(" "),st:Object.fromEntries(K.map((k,i)=>[k,t[i]]))})}o._pf=pf.length>1?pf:null}\n let cur=null;const map={"Equipement":"equip"')
rep(' if(o.apt){const pa=o.apt.split',' if(o._pf){const mdl=o.mdl||[],ky=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"");o._pf.forEach((p,i)=>{const m=mdl.find(x=>ky(x.n)===ky(p.n));if(m)m.st=p.st;else if(p.n)mdl.splice(Math.min(i,mdl.length),0,{n:p.n,eq:i===0?o.equip:"",st:p.st})});o.mdl=mdl}delete o._pf\n if(o.apt){const pa=o.apt.split')
rep('const prof=p=>`<div class="encu" data-encr="${esc(p.ref||"")}" data-encn="${esc(p.name||"")}">`+stx(p.stats)+','const pstx=p=>{const ms=(p.mdl||[]).filter(m=>m.st);if(ms.length<2)return stx(stxp(p));return`<div class="mpf"><b class="mpn">${esc(ms[0].n)}</b></div>`+stx(stxp(p))+ms.slice(1).map(m=>`<div class="mpf"><b class="mpn">${esc(m.n)}</b></div>`+stx(m.st)).join("")};\nconst prof=p=>`<div class="encu" data-encr="${esc(p.ref||"")}" data-encn="${esc(p.name||"")}">`+pstx(p)+')
# 7. un mot du libellé n'est « collé » au précédent que si l'écart est faible ; noms d'aptitudes avec virgule connus
rep('while(q<r.it.length&&r.it[q].x-e<=12){','while(q<r.it.length&&r.it[q].x-e<=6){')
rep('known=[...acc.split(","),...eqN,...optN]','known=[...acc.split(","),...(()=>{const pz=acc.split(",").map(x=>x.trim()),o=[];for(let i=0;i<pz.length;i++)for(let n=2;n<=3&&i+n<=pz.length;n++)o.push(pz.slice(i,i+n).join(", "));return o})(),...eqN,...optN]')
# 8. un libellé ne continue sur la ligne suivante que si le mot suivant ne tenait plus dans la colonne
rep('const base=blk&&blk.body.length>0','const lit=r.it.filter(i=>!bodyIt.includes(i)),lq=lit.length?lit[lit.length-1].x+lit[lit.length-1].w:null,fw=(()=>{const i0=lit[0];if(!i0)return 0;const t0=i0.s.trim();return i0.w*(t0.split(/\\s+/)[0].length/Math.max(1,t0.length))})(),cont=!!(blk&&blk.lr!=null&&cbx&&blk.lr+3.5+fw>cbx-9);\n    const base=blk&&blk.body.length>0')
rep('const open=pref||base&&!isKnown(lab)','const open=pref||cont&&base&&!isKnown(lab)&&!/\\(\\d+\\s*points?\\)/i.test(lab)&&!(bt&&/^\\d+\\s*PC$/i.test(bt))||base&&!isKnown(lab)')
rep('if(open){blk.lab.push(lt);blk.lastLbl=k;blk.lastY=r.y;if(bt)blk.body.push(bt)}else{close();blk={lab:[lt],body:bt?[bt]:[],lastLbl:k,lastY:r.y}}','if(open){blk.lab.push(lt);blk.lastLbl=k;blk.lastY=r.y;blk.lr=lq;if(bt)blk.body.push(bt)}else{close();blk={lab:[lt],body:bt?[bt]:[],lastLbl:k,lastY:r.y,lr:lq}}')
# 9. tableau d'armes : noms et capacités répartis par BLOCS centrés sur la ligne de chiffres (et non ligne par ligne)
a=s.index('const doTable=(tr,xP,xD)=>{');b=s.index('\n  const grab=',a)
NEW="""const doTable=(tr,xP,xD)=>{const isNum=r2=>r2.it.some(i=>i.x>=xP&&i.x<xD);const nr=tr.filter(isNum).map(r2=>({y:r2.y,name:[],caps:[],nums:r2.it.filter(i=>i.x>=xP&&i.x<xD)}));
   if(nr.length)["name","caps"].forEach(f=>{const its=[];tr.forEach(r2=>r2.it.forEach(i=>{if(f==="name"?i.x<xP:i.x>=xD)its.push(i)}));its.sort((p,q)=>q.y-p.y||p.x-q.x);const bl=[];its.forEach(i=>{const bk=bl[bl.length-1];if(bk&&bk[bk.length-1].y-i.y<=1.6*(i.h||11.4))bk.push(i);else bl.push([i])});
    bl.forEach(bk=>{const cy=bk.reduce((t,i)=>t+i.y,0)/bk.length,nn2=nr.reduce((p,q)=>Math.abs(q.y-cy)<Math.abs(p.y-cy)?q:p);nn2[f].push(...bk)})});
   nr.forEach(n=>{const o=f=>{const t=n[f].sort((p,q)=>q.y-p.y||p.x-q.x).map(i=>i.s.trim()).join(" ").replace(/\\s+/g," ");return f==="caps"?t.replace(/-\\s+(?=[A-ZÀ-Ý])/g,"-"):t.replace(/(\\S)-\\s+(?=[a-zà-ÿ])/g,"$1-")};emit([o("name"),n.nums.map(i=>i.s.trim()).join(" "),o("caps")].filter(Boolean).join(" "))})};"""
s=s[:a]+NEW+s[b:]
# 10. un libellé ou un corps coupé par un saut de page est recollé (nom d'aptitude connu ou corps sans libellé)
a=s.index('  const close=()=>{if(!blk)return;');b=s.index('blk=null};',a)+len('blk=null};')
oldclose=s[a:b]
body=oldclose[oldclose.index('const lab=blk.lab'):oldclose.rindex('blk=null};')].replace('blk.lab','b.lab').replace('bd=blk.body','bd=b.body').replace('emit(','E0(').replace('forEach(emit)','forEach(E0)')
s=s[:a]+'  const close=()=>{if(!blk)return;closeB(blk);blk=null};'+s[b:]
rep('function alnLines(pages){const out=[];','function alnLines(pages){const out=[],E0=l=>{if(l)out.push(l)};let carry=null;const closeB=b=>{'+body+'};')
rep('if(/©\\s*\\d{4}/.test(txt)){close();emit(txt);k++;continue}','if(/©\\s*\\d{4}/.test(txt)){if(blk){carry=blk;blk=null}emit(txt);k++;continue}')
rep('  const close=()=>{if(!blk)return;closeB','  if(carry&&k<rows.length){const r0=rows[k],f0=r0.it[0],bo=f0.x>lx+60&&r0.it.every(i=>i.x>lx+60),c2=cbx?r0.it.filter(i=>i.x<cbx-4):[f0],t0=c2.length?lineOf(c2):"",l0=carry.lab.join(" ");blk=carry;carry=null;if(bo){blk.lastLbl=k-1;blk.lastY=r0.y}else if(Math.abs(f0.x-lx)<15&&t0&&!isKnown(l0)&&isPref(l0+" "+t0)){const bi=r0.it.filter(i=>cbx&&i.x>=cbx-4);blk.lab.push(t0);if(bi.length)blk.body.push(lineOf(bi));blk.lastLbl=k;blk.lastY=r0.y;blk.lr=c2[c2.length-1].x+c2[c2.length-1].w;k++}else{blk=blk;closeB(blk);blk=null}}\n  const close=()=>{if(!blk)return;closeB')
rep('  close();LX=lx;CBX=cbx;EQN=eqN;OPTN=optN}\n return out}','  if(blk&&!carry){close()}LX=lx;CBX=cbx;EQN=eqN;OPTN=optN}\n if(carry)closeB(carry);\n return out}')
# 11. une ligne très courte (« 4+ ») qui complète un nom d'aptitude connu n'est pas une ligne de caractéristiques
rep('stats=r.it.every(i=>i.s.trim().length<=4);','stats=r.it.every(i=>i.s.trim().length<=4)&&!(blk&&blk.body.length&&isPref(blk.lab.join(" ")+" "+lineOf(r.it.filter(i=>!cbx||i.x<cbx-4))));')
# 12. nom de la liste : lu dans l'en-tête du PDF (« Zektail : [Orks] Test »), sinon le nom du fichier
rep('if(nm&&!nm.value.trim())nm.value=f.name.replace(/\\.pdf$/i,"");','if(nm&&!nm.value.trim()){const h0=(txt.split("\\n")[0]||"").trim(),hd=h0.replace(/\\s*\\[[^\\]]*\\]\\s*/g," ").replace(/\\s+/g," ").trim();nm.value=/^[^:]{1,40}:\\s*\\[/.test(h0)&&hd.length<=60?hd:f.name.replace(/\\.pdf$/i,"")}')
# 13. contrôle d'import : le nom d'aptitude à virgule est comparé tel qu'écrit dans le texte
rep('.forEach(n=>{if(t.indexOf(n)>=0||xs.includes(n))return;','.forEach(n=>{n=n.replace(/\\u201a/g,",");if(t.indexOf(n)>=0||xs.includes(n))return;')
# 14. figurine supplémentaire à l'équipement différent : bloc séparé (nom, caractéristiques, SES armes)
rep('const pstx=p=>{','''const eqIt=s=>String(s||"").split(",").map(x=>x.replace(/\\s*\\(\\d+\\)\\s*$/,"").trim()).filter(Boolean),wnk=s=>String(s||"").toLowerCase().replace(/\\s+/g," ").trim(),wIn=(its,w)=>{const n=wnk(w.name);return its.some(i=>{const k=wnk(i);return n===k||n.startsWith(k+" - ")||n.startsWith(k+" -")})};
function msplit(p){const ex=(p.mdl||[]).filter(m=>m.eq&&wnk(m.eq)!==wnk(p.equip));if(!ex.length)return null;const A=p.weapons||[],B=A.filter(w=>wIn(eqIt(p.equip),w));if(!B.length)return null;
 const ws=ex.map(m=>({m,w:A.filter(w=>wIn(eqIt(m.eq),w))}));if(ws.some(x=>!x.w.length))return null;
 const sg=a=>a.map(w=>wnk(w.name)).sort().join("|");if(ws.every(x=>sg(x.w)===sg(B)))return null;
 const used=new Set([...B,...ws.flatMap(x=>x.w)]);return{B:B.concat(A.filter(w=>!used.has(w))),ws,ex}}
function mblk(p){const sp=msplit(p);if(!sp)return pstx(p)+wtbl(p.weapons,p.name,p);
 const sep=n=>`<div class="msep"><span>⚔ Armes du ${esc(n)}</span></div>`;
 return pstx(p)+wtbl(sp.B,p.name,Object.assign({},p,{mdl:[]}))
  +sp.ws.map(x=>sep(x.m.n)+wtbl(x.w,p.name+" ("+x.m.n+")",{name:x.m.n,size:1,equip:x.m.eq,mdl:[],weapons:x.w})).join("")}
const pstx=p=>{''')
rep('+pstx(p)+wtbl(p.weapons,p.name,p)+abWarn(p)+((p.mdl||[]).length?','+mblk(p)+abWarn(p)+((p.mdl||[]).length&&!msplit(p)?')
# 15. sauvegarde invulnérable écrite dans une aptitude (« Cette figurine a une SvIn de 5+. ») : repérée et affichée dans SV
rep('const eqIt=s=>','''const invOf=p=>{const t=[...(p.text||[]),...(p.xab||[]).map(x=>x&&(x.t||x.d||x.b)||"")].join(" ").replace(/\\s+/g," "),re=/(?:Cette figurine|Cette unité|Les figurines de cette unité)\\s+(?:a|ont)\\s+(?:une?\\s+)?(?:SvIn|sauvegarde invulnérable)\\s*(?:de\\s*)?(\\d)\\s*\\+(?!\\+)([^.!]*)[.!]/gi;let m,best=null;while(m=re.exec(t)){if(/tant que|\\bsi\\b|quand|lorsque|contre|pendant|phase|jusqu|une fois/i.test(m[2]))continue;const v=+m[1];if(best==null||v<best)best=v}return best};
const fnpOf=p=>{const ns=[...String(p.apt||"").split(","),...(p.xab||[]).map(x=>x&&x.n||"")].join(" , "),re=/Insensible\\s+à\\s+la\\s+Douleur\\s*(\\d)\\s*\\+/gi;let m,best=null;while(m=re.exec(ns)){const v=+m[1];if(best==null||v<best)best=v}return best};
const stxp=p=>{const s=Object.assign({},p.stats),i=invOf(p),f=fnpOf(p);if(i&&!/\\+\\+/.test(String(s.SV||"")))s._inv=i;if(f)s._fnp=f;return s};
const eqIt=s=>''')
# 16. boucliers « INV n+ » et « FAP n+ » sous la sauvegarde, hors des cases de caractéristiques
a=s.index('const stx=s=>`<div class="sg">');b=s.index(';\n',a)+2
NEWSTX="""const shd=(t,n,c)=>`<svg class="shd ${c}" viewBox="0 0 46 54" role="img" aria-label="${t} ${n}+"><defs><linearGradient id="g${c}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".34"/><stop offset="1" stop-color="currentColor" stop-opacity=".08"/></linearGradient></defs><path d="M23 2.5c7.5 3.8 14.5 5 19.5 5v18.5c0 13-9 21.5-19.5 25.5C12.5 47.500 3.500 39 3.500 26V7.500c5 0 12-1.200 19.500-5z" fill="url(#g${c})" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M23 7c5.500 2.800 11 4 15.500 4.300V26c0 10.500-7 17.500-15.500 21C14.500 43.500 7.500 36.500 7.500 26V11.300C12 11 17.500 9.800 23 7z" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1"/><text x="23" y="21" text-anchor="middle" font-size="8.500" font-weight="700" letter-spacing=".8" fill="currentColor" opacity=".85">${t}</text><text x="23" y="38" text-anchor="middle" font-size="19" font-weight="800" fill="currentColor">${n}+</text></svg>`;
const stx=s=>{const m=/^\\s*(\\S+?)\\s*\\/\\s*(\\d)\\s*\\+\\+\\s*$/.exec(String(s.SV||"")),sv=m?m[1]:(s.SV||""),inv=m?+m[2]:(s._inv||0),fnp=s._fnp||0,dz=String(s.SV||"")+(!m&&s._inv?"/"+s._inv+"++":""),sh=[inv?shd("INV",inv,"inv"):"",fnp?shd("FAP",fnp,"fnp"):""].filter(Boolean);
 return`<div class="sg">${K.map(k=>k==="SV"?`<div class="sx svb" data-dzsv="${esc(dz)}" role="button" tabindex="0" title="Lancer les sauvegardes"><i>SV 🎲</i><b>${esc(sv)||"–"}</b></div>`:`<div class="sx"><i>${k}</i><b>${esc(s[k])||"–"}</b></div>`).join("")}</div>`+(sh.length?`<div class="shr">${sh.join("")}</div>`:"")};
"""
s=s[:a]+NEWSTX+s[b:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
