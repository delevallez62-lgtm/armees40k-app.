import sys
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:100]);s=s.replace(a,b)
def cut(start,end,new):
    global s
    i=s.index(start);j=s.index(end,i);s=s[:i]+new+s[j:]

# ====== modèle : appartenance des éléments aux dossiers ======
rep('window.__mxFolders=()=>folders().filter(f=>!f.hid).map(f=>({id:f.id,nm:f.nm,k:f.k,c:f.c,n:count(f)}));',
'''window.__mxFolders=()=>folders().filter(f=>!f.hid).map(f=>({id:f.id,nm:f.nm,k:f.k,c:f.c,n:count(f)}));
window.__mxFolderIds=fid=>{const f=folders().find(x=>x.id===fid);return f&&f.k!=="free"?memberIds(f):[]};''')

rep('function offList(',r'''const layId=l=>"lay-"+l.p;
const DEF={sec:"f-sec",pri:"f-pri",lay:"f-lay"};
const KW={pri:{one:"mission primaire",pl:"missions primaires",new:"Nouvelle mission primaire",dn:"dossier de primaires",ph:"ex. Primaire 2027",empty:"Ce dossier est vide : ajoute une mission primaire.",add:"🔗 Ajouter une mission existante"},
 sec:{one:"carte secondaire",pl:"cartes secondaires",new:"Nouvelle carte secondaire",dn:"dossier de secondaires",ph:"ex. Secondaire 2027",empty:"Ce dossier est vide : ajoute une carte secondaire.",add:"🔗 Ajouter une carte existante"},
 lay:{one:"layout",pl:"layouts",new:"Nouveau layout",dn:"dossier de layouts",ph:"ex. Layout 2027",empty:"Ce dossier est vide : ajoute un layout.",add:"🔗 Ajouter un layout existant"}};
let CF="";
const cOf=(k,id)=>{const m=mx();return(k==="sec"?m.csx:k==="pri"?m.cms:m.cly).find(x=>x.id===id)};
const homeOf=(k,id)=>{const c=cOf(k,id);return(c&&c.fid)||DEF[k]};
function itemIds(k){const m=mx();
 if(k==="sec")return[...OR.sx.map(o=>o.id).filter(id=>!(m.sx[id]&&m.sx[id].off)),...m.csx.filter(c=>!c.off).map(c=>c.id)];
 if(k==="pri")return[...OR.ms.map(o=>o.id).filter(id=>!(m.ms[id]&&m.ms[id].off)),...m.cms.filter(c=>!c.off).map(c=>c.id)];
 return layAll().filter(l=>!l.off).map(l=>l.id)}
function memberIds(f){if(!OR)snap();if(!OR)return[];const refs=(S.mfm&&S.mfm[f.id])||[];return itemIds(f.k).filter(id=>homeOf(f.k,id)===f.id||refs.includes(id))}
const isLinked=(f,id)=>!!f&&homeOf(f.k,id)!==f.id&&((S.mfm&&S.mfm[f.id])||[]).includes(id);
function itemName(k,id){if(k==="sec")return(by()[id]||{}).nm||id;if(k==="pri"){const m=msd().find(x=>x.id===id);return m?m.nm:id}const l=layAll().find(x=>x.id===id);return l?((l.nm||("Agencement "+l.L))+(l.a?" — "+l.a+" vs "+l.b:"")):id}
function offList(''')

# ====== listes : seulement le contenu du dossier ======
cut('function secItems(f,q){','const layId=l=>"lay-"+l.p;'.replace('const layId','function priItems(f,q){') if False else 'function priItems(f,q){',
r'''function secItems(f,q){const m=mx(),B=by(),GR=gr(),out=[],mem=memberIds(f),refs=(S.mfm&&S.mfm[f.id])||[];
 const offs=[...OR.sx.map(o=>o.id).filter(id=>m.sx[id]&&m.sx[id].off),...m.csx.filter(c=>c.off).map(c=>c.id)].filter(id=>homeOf("sec",id)===f.id);
 ["e","c","a"].forEach(g=>{const ids=mem.filter(id=>B[id]&&B[id].g===g&&(!q||nk(B[id].nm+" "+B[id].d).includes(q)));if(!ids.length)return;const G=GR[g]||{nm:g,ic:"",c:"#d8b45e"};
  out.push(`<div class="ggh" style="--gc:${G.c}">${G.ic} ${e2(G.nm)}<span>${ids.length}</span></div>`+ids.map(id=>{const c=B[id],cu=m.csx.some(x=>x.id===id),pe=!!m.sx[id],lk=refs.includes(id)&&homeOf("sec",id)!==f.id;return`<button class="gmi" style="--gc:${G.c}" data-x="sxed" data-f="${f.id}" data-id="${id}">${thumb(id)}<span class="tx"><b>${e2(c.nm)}${cu?'<span class="gbd n">Créée</span>':pe?'<span class="gbd p">Modifiée</span>':""}${lk?'<span class="gbd u">Lié</span>':""}</b><small>${e2(smTxt(smap()[id])||c.d)}</small></span></button>`}).join(""))});
 return(out.length?out.join(""):`<p class="mu">${KW.sec.empty}</p>`)+offList("sec"+f.id,offs.map(id=>[id,(B[id]||{}).nm]),"sec")+`<div class="gadd2"><button class="b p" data-x="sxnew" data-f="${f.id}">+ ${KW.sec.new}</button><button class="b" data-x="fadd" data-f="${f.id}">${KW.sec.add}</button></div>`}
''')
cut('function priItems(f,q){','const layId=l=>"lay-"+l.p;' if False else 'function layAll(){',
r'''function priItems(f,q){const m=mx(),out=[],mem=new Set(memberIds(f)),refs=(S.mfm&&S.mfm[f.id])||[],all=[...OR.ms.map(o=>OR.mso[o.id]),...m.cms.map(buildMs)].filter(c=>mem.has(c.id));
 const offs=[...OR.ms.map(o=>o.id).filter(id=>m.ms[id]&&m.ms[id].off),...m.cms.filter(c=>c.off).map(c=>c.id)].filter(id=>homeOf("pri",id)===f.id);
 cats().forEach(ct=>{const a=all.filter(c=>c.cat===ct.id&&(!q||nk(c.nm+" "+c.d).includes(q)));if(!a.length)return;
  out.push(`<div class="ggh" style="--gc:#e0563f">${ct.ic} ${e2(ct.fr)}<span>${a.length}</span></div>`+a.map(c=>{const cu=m.cms.some(x=>x.id===c.id),pe=!!m.ms[c.id],lk=refs.includes(c.id)&&homeOf("pri",c.id)!==f.id;return`<button class="gmi" style="--gc:#e0563f" data-x="msed" data-f="${f.id}" data-id="${c.id}">${thumb(c.id)}<span class="tx"><b>${e2(c.nm)}${cu?'<span class="gbd n">Créée</span>':pe?'<span class="gbd p">Modifiée</span>':""}${lk?'<span class="gbd u">Lié</span>':""}</b><small>${e2(lineSum(c))}${c.d?" — "+e2(c.d.slice(0,90))+(c.d.length>90?"…":""):""}</small></span></button>`}).join(""))});
 const nm=id=>{const o=OR.mso[id]||(m.cms.find(c=>c.id===id)?buildMs(m.cms.find(c=>c.id===id)):null);return o?o.nm:id};
 return(out.length?out.join(""):`<p class="mu">${KW.pri.empty}</p>`)+offList("pri"+f.id,offs.map(id=>[id,nm(id)]),"pri")+`<div class="gadd2"><button class="b p" data-x="msnew" data-f="${f.id}">+ ${KW.pri.new}</button><button class="b" data-x="fadd" data-f="${f.id}">${KW.pri.add}</button></div>`}
''')
cut('function layItems(f,q){','function freeItems(f,q){',
r'''function layItems(f,q){const m=mx(),mem=new Set(memberIds(f)),refs=(S.mfm&&S.mfm[f.id])||[],all=layAll(),offs=all.filter(l=>l.off&&homeOf("lay",l.id)===f.id),out=[],grp={};
 all.filter(l=>!l.off&&mem.has(l.id)&&(!q||nk([l.nm,l.a,l.b,l.ma,l.mb,"agencement "+l.L].join(" ")).includes(q))).forEach(l=>{const g=l.a?`${l.a} vs ${l.b}`:"Mes layouts";(grp[g]=grp[g]||[]).push(l)});
 for(const g in grp)out.push(`<div class="ggh" style="--gc:#4aa3ff">🗺 ${e2(g)}<span>${grp[g].length}</span></div>`+grp[g].map(l=>`<button class="gmi" style="--gc:#4aa3ff" data-x="lyed" data-f="${f.id}" data-id="${l.id}">${thumb(l.id)}<span class="tx"><b>${e2(l.nm||("Agencement "+l.L))}${l.u?'<span class="gbd u">Mis à jour</span>':""}${l.cu?'<span class="gbd n">Créé</span>':""}${refs.includes(l.id)&&homeOf("lay",l.id)!==f.id?'<span class="gbd u">Lié</span>':""}</b><small>${l.ma?`Missions : ${e2(l.ma)} / ${e2(l.mb)} · page ${l.p}`:e2(l.note||"")}</small></span></button>`).join(""));
 return(out.length?out.join(""):`<p class="mu">${KW.lay.empty}</p>`)+offList("lay"+f.id,offs.map(l=>[l.id,l.nm||(l.a?l.a+" vs "+l.b+" — "+l.L:"Layout")]),"lay")+`<div class="gadd2"><button class="b p" data-x="lynew" data-f="${f.id}">+ ${KW.lay.new}</button><button class="b" data-x="fadd" data-f="${f.id}">${KW.lay.add}</button>${f.id===DEF.lay?`<button class="b" data-x="pdfimp">📄 Importer le PDF officiel</button><button class="b" data-x="pdfall">🖼 Préparer toutes les images</button>`:""}</div>`}
''')
cut('function offList(k,a){','function count(f){',
r'''function offList(tk,a,kind){if(!a.length)return"";return`<div class="gadd2"><button class="b" data-x="offtog" data-k="${tk}">${mShowOff[tk]?"Masquer":"Voir"} les éléments supprimés (${a.length})</button></div>`+(mShowOff[tk]?a.map(([id,n])=>`<div class="gxl"><b>${e2(n||id)}</b><button class="b" data-x="restore" data-k="${kind||tk}" data-id="${id}">Restaurer</button></div>`).join(""):"")}
''')
cut('function count(f){','function folderHtml(f){',
'''function count(f){if(f.k==="free")return(S.mfi[f.id]||[]).length;return memberIds(f).length}
''')

# ====== barre d'outils : un seul bouton « nouveau dossier » adapté à la section ======
i=s.index('${({pri:["msnew","+ Ajouter une primaire"]');j=s.index('</div><div id="gxmb">',i)
s=s[:i]+'${mTab==="oth"?`<button class="b p" data-x="fnew" data-k="free">+ Dossier</button>`:`<button class="b p" data-x="fnew" data-k="${mTab}">+ ${(KW[mTab].dn).replace(/^./,c=>c.toUpperCase())}</button>`}'+s[j:]

# ====== fenêtre de dossier ======
cut('function fEdit(id){','const fv=k=>',
r'''function fEdit(id,kind){const ex=folders().find(x=>x.id===id),k=ex?ex.k:(kind||"free"),W=KW[k],f=ex||{id:uid("f-"),nm:"",k,c:(KIND[k]||KIND.free)[1],own:1};cur={k:"f",id:f.id,kd:k,isNew:!ex};
 GX.open(`<div class="gxh">${ic("folder")}<h2>${cur.isNew?"Nouveau "+(W?W.dn:"dossier"):"Dossier"}</h2><button class="b" data-gx="close">✕</button></div><label>Nom du dossier<input data-f="nm" value="${e2(f.nm)}" placeholder="${W?W.ph:"ex. Mes notes"}" autofocus></label><label>Couleur<input type="color" data-f="c" value="${e2(f.c||"#d8b45e")}"></label>${W&&cur.isNew?`<p class="mu">Tu pourras ensuite y créer des ${W.pl}, en reprendre depuis un autre dossier, ou en retirer.</p>`:""}<div class="gxf"><button class="b p" data-x="fsave">Enregistrer</button></div>`)}
function addFromOther(fid){const f=folders().find(x=>x.id===fid);if(!f)return;const k=f.k,W=KW[k],have=new Set(memberIds(f));
 const groups=folders().filter(x=>x.k===k&&x.id!==fid&&!x.hid).map(x=>({f:x,ids:memberIds(x).filter(id=>!have.has(id))})).filter(g=>g.ids.length);
 GX.open(`<div class="gxh">${ic("folder")}<h2>Ajouter à « ${e2(f.nm)} »</h2><button class="b" data-gx="close">✕</button></div><p class="mu">Coche les ${W.pl} à reprendre d'un autre dossier. Ils restent aussi dans leur dossier d'origine.</p>
 ${groups.length?`<input type="search" id="gxfaq" placeholder="Chercher…" autocomplete="off">`+groups.map(g=>`<h4>${e2(g.f.nm)}</h4>`+g.ids.map(id=>`<label class="gfa"><input type="checkbox" data-fa="${e2(id)}"><span>${e2(itemName(k,id))}</span></label>`).join("")).join(""):`<p class="mu">Aucun autre élément disponible : crée d'abord un autre dossier ou de nouveaux éléments.</p>`}
 <div class="gxf"><button class="b p" data-x="fadd2" data-f="${fid}">Ajouter la sélection</button></div>`)}
''')
rep('if(a==="fnew"){fEdit(null);return}','if(a==="fnew"){fEdit(null,b.dataset.k);return}\n if(a==="fadd"){addFromOther(b.dataset.f);return}\n if(a==="fadd2"){const fid=b.dataset.f,ids=fvs("[data-fa]").filter(x=>x.checked).map(x=>x.dataset.fa);if(!ids.length){say("Coche au moins un élément");return}S.mfm=S.mfm&&typeof S.mfm==="object"?S.mfm:{};const L=S.mfm[fid]=S.mfm[fid]||[];ids.forEach(id=>{if(!L.includes(id))L.push(id)});done(ids.length+" ajouté"+(ids.length>1?"s":"")+" au dossier");return}\n if(a==="funlink"){const fid=cur.f,id=cur.id;if(S.mfm&&S.mfm[fid])S.mfm[fid]=S.mfm[fid].filter(x=>x!==id);done("Retiré du dossier");return}')
rep('if(!f){f={id:cur.id,k:"free"};F.push(f);mOpen[f.id]=1}f.nm=nm;f.c=fv("c");done("Dossier enregistré");',
    'if(!f){f={id:cur.id,k:cur.kd||"free",own:1};F.push(f);mOpen[f.id]=1;if(cur.kd&&cur.kd!=="free")mTab=cur.kd}f.nm=nm;f.c=fv("c");done("Dossier enregistré");')
# suppression d'un dossier créé : ses éléments créés partent avec lui
i=s.index(' if(a==="fdel"){');j=s.index('\n',i)
s=s[:i]+''' if(a==="fdel"){const f=folders().find(x=>x.id===id);if(!f)return;const own=!!f.own||f.k==="free",n=f.k==="free"?0:memberIds(f).filter(x=>homeOf(f.k,x)===f.id).length;
  conf("Supprimer le dossier « "+f.nm+" » ?",own?(f.k==="free"?"Le dossier et son contenu seront supprimés.":"Le dossier sera supprimé avec les "+n+" élément"+(n>1?"s":"")+" que tu y as créés. Les éléments repris d'un autre dossier y restent.") :"Le dossier sera masqué. Son contenu reste utilisé dans l'appli et tu pourras le restaurer.","Supprimer",()=>{
   if(f.k==="free"){S.mf=folders().filter(x=>x.id!==id);delete S.mfi[id]}
   else if(f.own){const mm=mx();[mm.csx,mm.cms,mm.cly].forEach(a=>a.forEach(c=>{if(c.fid===id)c.off=1}));S.mf=folders().filter(x=>x.id!==id);if(S.mfm)delete S.mfm[id];try{applyMx()}catch(e){}}
   else f.hid=1;GX.commit();say("Dossier supprimé")});return}'''+s[j:]

# ====== création / édition d'éléments dans un dossier ======
rep('const c={id:uid("csx-"),nm:"Nouvelle carte",g:"c",d:"",tx:"",k:"chk",pts:5};m.csx.push(c);applyMx();sxEdit(c.id);return}',
    'const c={id:uid("csx-"),nm:"Nouvelle carte",g:"c",d:"",tx:"",k:"chk",pts:5,fid:b.dataset.f||undefined};m.csx.push(c);applyMx();CF=b.dataset.f||"";sxEdit(c.id);return}')
rep('lines:[{tx:"Pour chaque objectif que vous contrôlez.",pts:3,k:"cnt",mo:"cmd"}]};m.cms.push(c);applyMx();msEdit(c.id);return}',
    'lines:[{tx:"Pour chaque objectif que vous contrôlez.",pts:3,k:"cnt",mo:"cmd"}],fid:b.dataset.f||undefined};m.cms.push(c);applyMx();CF=b.dataset.f||"";msEdit(c.id);return}')
rep('const c={id:uid("cly-"),nm:"Mon layout",note:"",cu:1};m.cly.push(c);lyEdit(c.id);return}',
    'const c={id:uid("cly-"),nm:"Mon layout",note:"",cu:1,fid:b.dataset.f||undefined};m.cly.push(c);CF=b.dataset.f||"";lyEdit(c.id);return}')
rep('if(a==="sxed"){sxEdit(id);return}','if(a==="sxed"){CF=b.dataset.f||"";sxEdit(id);return}')
rep('if(a==="msed"){msEdit(id);return}','if(a==="msed"){CF=b.dataset.f||"";msEdit(id);return}')
rep('if(a==="lyed"){lyEdit(id);return}','if(a==="lyed"){CF=b.dataset.f||"";lyEdit(id);return}')
rep('cur={k:"sx",id};','cur={k:"sx",id,f:CF};')
rep('cur={k:"ms",id};','cur={k:"ms",id,f:CF};')
rep('cur={k:"ly",id};','cur={k:"ly",id,f:CF};')
FL='const lk=()=>isLinked(folders().find(x=>x.id===cur.f),cur.id);'
rep('<button class="b x" data-x="sxdel">Supprimer</button>','${isLinked(folders().find(x=>x.id===cur.f),cur.id)?`<button class="b x" data-x="funlink">Retirer du dossier</button>`:`<button class="b x" data-x="sxdel">Supprimer</button>`}')
rep('<button class="b x" data-x="msdel">Supprimer</button>','${isLinked(folders().find(x=>x.id===cur.f),cur.id)?`<button class="b x" data-x="funlink">Retirer du dossier</button>`:`<button class="b x" data-x="msdel">Supprimer</button>`}')
rep('<button class="b x" data-x="lydel">Supprimer</button>','${isLinked(folders().find(x=>x.id===cur.f),cur.id)?`<button class="b x" data-x="funlink">Retirer du dossier</button>`:`<button class="b x" data-x="lydel">Supprimer</button>`}')
# layout créé : combinaison de missions facultative pour le tirage automatique
rep(' ${imgBlock(id)}\n <div class="gxf">${isLinked(folders().find(x=>x.id===cur.f),cur.id)?`<button class="b x" data-x="funlink">Retirer du dossier</button>`:`<button class="b x" data-x="lydel">',
    ' ${cu?`<div class="gln"><p class="mu" style="margin:0 0 4px">Missions concernées (facultatif) : le layout est tiré automatiquement quand les deux joueurs ont ces catégories.</p><div class="r"><label>Catégorie 1<select data-f="ck1"><option value="">—</option>${cats().map(ct=>`<option value="${ct.id}"${(l.ck||"").split("__")[0]===ct.id?" selected":""}>${ct.ic} ${e2(ct.fr)}</option>`).join("")}</select></label><label>Catégorie 2<select data-f="ck2"><option value="">—</option>${cats().map(ct=>`<option value="${ct.id}"${(l.ck||"").split("__")[1]===ct.id?" selected":""}>${ct.ic} ${e2(ct.fr)}</option>`).join("")}</select></label></div></div>`:""}\n ${imgBlock(id)}\n <div class="gxf">${isLinked(folders().find(x=>x.id===cur.f),cur.id)?`<button class="b x" data-x="funlink">Retirer du dossier</button>`:`<button class="b x" data-x="lydel">')
rep('if(cu){cu.nm=fv("nm")||cu.nm;cu.note=fv("note")||""}','if(cu){cu.nm=fv("nm")||cu.nm;cu.note=fv("note")||"";const a1=fv("ck1"),a2=fv("ck2");cu.ck=a1&&a2?[a1,a2].sort().join("__"):""}')
rep('return c?{k:"custom",l:"★",p:0,id}:null}','return c?{k:c.ck||"custom",l:"★",p:0,id}:null}')

# ====== assistant de partie : dossiers (contenu réel du dossier choisi) ======
rep('p.sel[k]=p.fsel[k]?wzIds(k):[]','p.sel[k]=p.fsel[k]?(window.__mxFolderIds?window.__mxFolderIds(p.fsel[k]):wzIds(k)):[]')
rep('const f=wzFolds(k)[0];if(f)p.fsel[k]=f.id','const f=wzFolds(k).find(x=>x.n>0)||wzFolds(k)[0];if(f)p.fsel[k]=f.id')
rep('<small>${fo.n} ${m[3]}${fo.n>1?"s":""}</small>','<small>${fo.n?fo.n+" "+m[3]+(fo.n>1?"s":""):"vide"}</small>')

# CSS
rep('</style>\n<script>\n(()=>{\nconst G=window.G40;if(!G)return;const {ic,col}=G;\nconst NAV','.gfa{display:flex;gap:12px;align-items:center;min-height:46px;padding:6px 8px;border:1px solid var(--bd);border-radius:10px;margin:4px 0;cursor:pointer}.gfa input{width:22px;height:22px;flex:none}.gfa span{flex:1;min-width:0}\n</style>\n<script>\n(()=>{\nconst G=window.G40;if(!G)return;const {ic,col}=G;\nconst NAV')
# recherche dans la fenêtre d'ajout
rep('document.addEventListener("input",e=>{if(e.target.id==="gxmq"){','document.addEventListener("input",e=>{if(e.target.id==="gxfaq"){const q=nk(e.target.value);document.querySelectorAll("#gxo .gfa").forEach(l=>{l.style.display=!q||nk(l.textContent).includes(q)?"":"none"});return}if(e.target.id==="gxmq"){')
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
