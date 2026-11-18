/* ===== LORE : espace narratif personnel (Histoire en tiroirs, Personnages, Organisations, Couleurs et Héraldique) ===== */
/* Données 100 % locales à cette installation : textes dans S.lore (stockage local de l'appli), images dans une base locale séparée (IndexedDB « hammer-lore »). Aucun contenu prérempli. */
/*__LOREIMG__*/
const LK=["hist","pers","orga","coul"];
const LDEF={hist:{t:"Histoire",d:"L'histoire de l'univers, des chapitres et des événements majeurs.",img:"hist"},pers:{t:"Personnages",d:"Héros, primarques, maîtres de chapitre et personnages emblématiques.",img:"pers"},orga:{t:"Organisations",d:"Chapitres, légions, ordres, régiments et divisions des différentes factions.",img:"orga"},coul:{t:"Couleurs et Héraldique",d:"Schémas de peinture, couleurs, symboles et marquages des armées.",img:"coul"}};
const LSCH={pers:[["ti","Titre ou fonction",0],["short","Description courte",1],["bio","Biographie / historique",1]],
 orga:[["ti","Type (chapitre, dynastie, régiment…)",0],["short","Présentation générale",1],["hist","Histoire",1],["struct","Structure et organisation",1],["members","Membres et personnages associés",1]],
 coul:[["short","Description",1],["scheme","Schéma de peinture",1],["symb","Symboles, emblèmes et insignes",1],["marks","Marquages et distinctions",1],["vars","Variantes de couleurs",1]]};
const LNEW={pers:"Nouveau personnage",orga:"Nouvelle organisation",coul:"Nouvelle fiche"};
const LORE={v:"home",prev:"home",mode:"view",open:{},cat:null,id:null};
const LI={};let LIREADY=false;
const luid=()=>"l"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
/* ----- images : base locale séparée ----- */
const LDB=()=>new Promise((res,rej)=>{const r=indexedDB.open("hammer-lore",1);r.onupgradeneeded=()=>r.result.createObjectStore("img");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function liPut(id,v){const db=await LDB();return new Promise((res,rej)=>{const t=db.transaction("img","readwrite");t.objectStore("img").put(v,id);t.oncomplete=()=>res(1);t.onerror=()=>rej(t.error)})}
async function liDel(id){const db=await LDB();return new Promise(res=>{const t=db.transaction("img","readwrite");t.objectStore("img").delete(id);t.oncomplete=()=>res(1);t.onerror=()=>res(0)})}
async function liAll(){const db=await LDB();return new Promise(res=>{const o={},t=db.transaction("img").objectStore("img").openCursor();t.onsuccess=()=>{const c=t.result;if(c){o[c.key]=c.value;c.continue()}else res(o)};t.onerror=()=>res(o)})}
function loreImgIds(){const s=new Set(),w=o=>{if(!o||typeof o!=="object")return;if(Array.isArray(o))return o.forEach(w);Object.keys(o).forEach(k=>{if((k==="img"||k==="id")&&typeof o[k]==="string"&&LI[o[k]]!==undefined)s.add(o[k]);else if(k==="imgs"&&Array.isArray(o[k]))o[k].forEach(x=>s.add(x));else w(o[k])})};w(S.lore);return s}
function loreGc(){try{const used=loreImgIds();Object.keys(LI).forEach(id=>{if(!used.has(id)){delete LI[id];liDel(id)}})}catch(_){}}
function loreFile(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const M=1000,s=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.78))};im.onerror=()=>rej(new Error("Image illisible"));im.src=r.result};r.onerror=()=>rej(r.error);r.readAsDataURL(file)})}
async function loreAddImage(file){const d=await loreFile(file),id=luid();await liPut(id,d);LI[id]=d;return id}
/* ----- données ----- */
function LD(){let l=S.lore;if(!l||typeof l!=="object"||l.v!==2){const old=l&&typeof l==="object"?l:null;l={v:2,cards:{},title:"",sub:"",hist:{drawers:[]},pers:[],orga:[],coul:[]};
  if(old){const ks=Object.keys(old).filter(k=>old[k]&&typeof old[k]==="object"&&old[k].t);if(ks.length){S.loreOld=JSON.parse(JSON.stringify(old));const T={orig:"Origines du Chapitre",miss:"La Mission",epre:"L'Épreuve de la Flamme",comp:"Les Compagnies",camp:"Les Grandes Campagnes",hero:"Héros et Figures",chro:"Chronologie",hist:"Histoire",pers:"Personnages",orga:"Organisations",coul:"Couleurs et Héraldique"};
   l.hist.drawers.push({id:luid(),t:"Notes de l'ancienne version",ch:ks.map(k=>({id:luid(),t:T[k]||k,bl:[{k:"p",x:old[k].t}]}))})}}
  S.lore=l;sv()}
 ["pers","orga","coul"].forEach(k=>{if(!Array.isArray(l[k]))l[k]=[]});l.hist=l.hist||{drawers:[]};l.cards=l.cards||{};return l}
const lcard=k=>Object.assign({},LDEF[k],(LD().cards[k]||{}));
const limg=id=>id?(LI[id]||(LOREIMG[id])||""):"";
const lcimg=k=>{const c=LD().cards[k];return c&&c.img&&LI[c.img]?LI[c.img]:LOREIMG[LDEF[k].img]};
const lnl=t=>E(t).replace(/\n/g,"<br>");
const lmove=(a,i,d)=>{const j=i+d;if(i<0||j<0||j>=a.length)return;const x=a.splice(i,1)[0];a.splice(j,0,x)};
const ledit=()=>LORE.mode==="edit";
/* ----- CSS ----- */
function loreCss(){if(document.getElementById("lorecss"))return;const s=document.createElement("style");s.id="lorecss";s.textContent=`
.lo{margin:-4px -2px;color:#f1e8cf;font-family:Georgia,"Times New Roman",serif}
.lo-top{display:flex;align-items:center;gap:8px;margin:0 0 10px}
.lo-btn,.lo-back{min-height:44px;min-width:44px;padding:0 14px;border-radius:12px;border:1.5px solid #b8902f;background:linear-gradient(#2a2110,#120e07);color:#f3d98a;font:inherit;font-size:16px;cursor:pointer}
.lo-back{flex:none;padding:0;font-size:24px}.lo-btn.p{background:linear-gradient(#c9a227,#8c6a12);color:#17120a;font-weight:700}.lo-btn.x{color:#ff8a7a;border-color:#8a3a2c}.lo-btn.s{min-height:36px;min-width:36px;padding:0 9px;font-size:15px}
.lo-btn.on{background:linear-gradient(#c9a227,#8c6a12);color:#17120a;font-weight:700}
.lo-ttl{flex:1;text-align:center;padding:4px 6px;min-width:0}
.lo-ttl h1{margin:0;font-size:clamp(26px,7.5vw,44px);letter-spacing:.05em;font-weight:700;color:#e9c66a;text-shadow:0 2px 10px #000,0 0 18px rgba(214,160,40,.35);overflow-wrap:anywhere}
.lo-ttl p{margin:2px 0 0;font-size:clamp(14px,3.8vw,19px);color:#efe6cc}
.lo-ban{position:relative;border:1.5px solid #b8902f;border-radius:14px;overflow:hidden;margin:0 0 12px;min-height:96px;background:#090705}
.lo-ban:before{content:"";position:absolute;left:0;top:0;bottom:0;width:60%;background:var(--l) center/cover;-webkit-mask-image:linear-gradient(90deg,#000 45%,transparent);mask-image:linear-gradient(90deg,#000 45%,transparent);opacity:.8}
.lo-ban>.lo-top{position:relative;margin:0;padding:8px}
.lo-g{display:grid;gap:12px;grid-template-columns:1fr}
.lo-c{position:relative;display:flex;flex-direction:column;justify-content:flex-end;text-align:left;min-height:150px;padding:14px 46px 14px 14px;border-radius:14px;border:2px solid #b8902f;box-shadow:inset 0 0 0 1px #3a2c0c,0 4px 14px rgba(0,0,0,.55);color:#f1e8cf;font:inherit;cursor:pointer;overflow:hidden;background:#0b0907;transition:transform .18s,box-shadow .18s,border-color .18s;width:100%}
.lo-c:before{content:"";position:absolute;inset:0;background:var(--i) center/cover no-repeat;transition:transform .35s,filter .25s}
.lo-c:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,5,3,.94) 8%,rgba(6,5,3,.78) 42%,rgba(6,5,3,.12) 100%)}
.lo-c>*{position:relative;z-index:1}.lo-c:hover,.lo-c:focus-visible{border-color:#f0cf74;box-shadow:inset 0 0 0 1px #5a4614,0 6px 20px rgba(214,160,40,.28);transform:translateY(-2px)}.lo-c:hover:before{transform:scale(1.05);filter:brightness(1.12)}
.lo-c b{display:block;font-size:clamp(20px,5.4vw,28px);color:#f3d98a;text-shadow:0 2px 6px #000;line-height:1.1;margin-bottom:6px;overflow-wrap:anywhere}
.lo-c span{display:block;font-size:clamp(14px,3.6vw,17px);line-height:1.35;color:#efe6cc;text-shadow:0 1px 4px #000;max-width:30em}
.lo-c i{position:absolute;right:14px;bottom:14px;font-style:normal;font-size:28px;color:#e8c868;z-index:1}
.lo-w{position:relative}.lo-tools{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
@media(min-width:640px){.lo-g{grid-template-columns:repeat(2,1fr)}.lo-c{min-height:190px}.lo-g.t{grid-template-columns:repeat(3,1fr)}}
.lo-dr{border:2px solid #b8902f;border-radius:14px;background:#0d0a07;margin:0 0 10px;box-shadow:inset 0 0 0 1px #3a2c0c;overflow:hidden}
.lo-dr>summary{list-style:none;cursor:pointer;padding:14px 44px 14px 14px;font-size:clamp(18px,5vw,23px);color:#f3d98a;font-weight:700;position:relative;min-height:48px;overflow-wrap:anywhere}
.lo-dr>summary::-webkit-details-marker{display:none}.lo-dr>summary:after{content:"›";position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:28px;color:#e8c868;transition:transform .2s}.lo-dr[open]>summary:after{transform:translateY(-50%) rotate(90deg)}
.lo-dr .lo-in{padding:4px 14px 14px;border-top:1px solid #3a2c0c}
.lo-bk{margin:4px 0 10px}textarea.lo-pgt{display:block;width:100%;box-sizing:border-box;min-height:46vh;resize:vertical;padding:16px 14px;border-radius:6px;border:1px solid #6b5420;background:linear-gradient(#f3e6c4,#e8d7a8)!important;color:#2b1d08!important;font:17px/1.65 Georgia,"Times New Roman",serif!important;box-shadow:inset 0 0 22px rgba(90,60,10,.35)}.lo-pgt:focus{outline:2px solid #e8c868}.lo-bkb{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.lo-ch{margin:12px 0}.lo-ch>h3{margin:0 0 6px;color:#e8c868;font-size:clamp(17px,4.6vw,21px);border-bottom:1px solid #3a2c0c;padding-bottom:4px;overflow-wrap:anywhere}
.lo-p{margin:8px 0;font-size:16px;line-height:1.6;color:#efe6cc;white-space:pre-wrap;overflow-wrap:anywhere}.lo-h{margin:14px 0 4px;font-size:20px;color:#f3d98a;overflow-wrap:anywhere}.lo-s{margin:10px 0 2px;font-size:17px;color:#e8c868;font-style:italic;overflow-wrap:anywhere}
.lo-im{margin:10px 0;text-align:center}.lo-im img{max-width:100%;border-radius:10px;border:1.5px solid #b8902f;display:block;margin:0 auto}.lo-im small{display:block;margin-top:4px;color:#cdbf98;font-size:13px}
.lo-b{border:1px dashed #6d5517;border-radius:10px;padding:8px;margin:8px 0;background:rgba(184,144,47,.05)}.lo-b .lo-tools{margin:0 0 4px}
.lo-e{opacity:.8;font-size:14px;margin:10px 0}.lo-add{width:100%;margin:6px 0}
.lo-pg{border:2px solid #b8902f;border-radius:14px;background:#0d0a07;overflow:hidden;box-shadow:inset 0 0 0 1px #3a2c0c}
.lo-hero{height:190px;background:var(--i) center/cover no-repeat;position:relative;display:flex;align-items:flex-end}
.lo-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#0d0a07,rgba(13,10,7,.1) 65%)}
.lo-hero.n{height:70px;background:linear-gradient(135deg,#1b1710,#0b0907)}
.lo-body{padding:14px}.lo-body h2{margin:0 0 2px;color:#f3d98a;font-size:clamp(22px,6vw,30px);overflow-wrap:anywhere}.lo-body h3{margin:16px 0 4px;color:#e8c868;font-size:17px}.lo-body .ti{color:#cdbf98;font-style:italic;margin-bottom:8px}
.lo-tile{position:relative;border:2px solid #b8902f;border-radius:14px;overflow:hidden;background:#0b0907;cursor:pointer;text-align:left;color:#f1e8cf;font:inherit;display:flex;flex-direction:column;min-height:150px;padding:0;width:100%}
.lo-tile .ph{height:110px;background:var(--i) center/cover no-repeat,linear-gradient(135deg,#241b0b,#0b0907)}
.lo-tile .tx{padding:8px 10px}.lo-tile b{display:block;color:#f3d98a;font-size:17px;overflow-wrap:anywhere}.lo-tile small{color:#cdbf98;font-size:13px;display:block;overflow-wrap:anywhere}
.lo-tile:hover{border-color:#f0cf74}
.lo-sw{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}.lo-sw div{display:flex;align-items:center;gap:8px;border:1px solid #6d5517;border-radius:10px;padding:5px 9px 5px 5px;background:rgba(0,0,0,.3)}.lo-sw i{display:block;width:34px;height:34px;border-radius:8px;border:1.5px solid #e8c868}
.lo-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin:6px 0}.lo-gal div{position:relative}.lo-gal img{width:100%;height:110px;object-fit:cover;border-radius:10px;border:1.5px solid #b8902f;display:block}
.lo-x{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0;align-items:baseline}.lo-x b{color:#e8c868}.lo-x span{overflow-wrap:anywhere}
#lormd .lo-ov{position:fixed;inset:0;z-index:90;background:rgba(5,4,2,.78);display:flex;align-items:flex-end;justify-content:center}
#lormd .lo-pn{background:#0d0a07;border:2px solid #b8902f;border-radius:16px 16px 0 0;width:min(640px,100%);max-height:92vh;overflow:auto;padding:16px;color:#f1e8cf;font-family:Georgia,serif;padding-bottom:calc(20px + env(safe-area-inset-bottom,0px))}
#lormd h3{margin:0 0 8px;color:#f3d98a}#lormd label{display:block;margin-top:10px;color:#e8c868;font-size:14px}
#lormd input[type=text],#lormd textarea{width:100%;box-sizing:border-box;border-radius:10px;border:1.5px solid #b8902f;background:#0a0806;color:#f1e8cf;padding:10px;font:inherit;font-size:16px;margin-top:4px}#lormd textarea{min-height:140px}#lormd textarea.big{min-height:260px}
#lormd input[type=color]{width:60px;height:44px;border:1.5px solid #b8902f;border-radius:10px;background:#0a0806;margin-top:4px}
#lormd .pv{margin-top:6px}#lormd .pv img{max-width:100%;max-height:200px;border-radius:10px;border:1.5px solid #b8902f}`;document.head.appendChild(s)}
/* ----- fenêtre de saisie ----- */
function lmodal(title,fields,onSave,extraBtn){loreCss();const o=document.getElementById("lormd")||(()=>{const d=document.createElement("div");d.id="lormd";document.body.appendChild(d);return d})();const st={};fields.forEach(f=>st[f.k]=f.v==null?"":f.v);
 const draw=()=>{o.innerHTML=`<div class="lo-ov"><div class="lo-pn"><h3>${E(title)}</h3>${fields.map(f=>f.t==="img"?`<label>${E(f.l)}<div class="pv">${st[f.k]&&limg(st[f.k])?`<img src="${limg(st[f.k])}" alt="">`:`<span style="opacity:.7">Aucune image</span>`}</div><div class="lo-tools"><label class="lo-btn" style="margin:0;display:inline-flex;align-items:center;cursor:pointer">📷 ${st[f.k]?"Remplacer":"Choisir"}…<input type="file" accept="image/*" data-lf="${f.k}" style="display:none"></label>${st[f.k]?`<button type="button" class="lo-btn x" data-lm="rm" data-k="${f.k}">Retirer</button>`:""}${f.dflt?`<button type="button" class="lo-btn" data-lm="dflt" data-k="${f.k}">Image par défaut</button>`:""}</div></label>`:f.t==="color"?`<label>${E(f.l)}<br><input type="color" data-lf="${f.k}" value="${E(st[f.k]||"#888888")}"></label>`:f.t==="area"?`<label>${E(f.l)}<textarea data-lf="${f.k}" class="${f.big?"big":""}" placeholder="${E(f.p||"")}">${E(st[f.k])}</textarea></label>`:`<label>${E(f.l)}<input type="text" data-lf="${f.k}" value="${E(st[f.k])}" placeholder="${E(f.p||"")}"></label>`).join("")}
  <div class="lo-tools" style="margin-top:14px"><button type="button" class="lo-btn p" data-lm="ok">✔ Enregistrer</button><button type="button" class="lo-btn" data-lm="cancel">Annuler</button>${extraBtn||""}</div></div></div>`};
 draw();
 o.onclick=e=>{const b=e.target.closest("[data-lm]");if(!b)return;const a=b.dataset.lm;if(a==="cancel"){o.innerHTML="";loreGc();return}
  if(a==="rm"){st[b.dataset.k]="";draw();return}if(a==="dflt"){st[b.dataset.k]="";draw();return}
  if(a==="ok"){o.querySelectorAll("[data-lf]").forEach(i=>{if(i.type!=="file")st[i.dataset.lf]=i.value});o.innerHTML="";onSave(st);sv();loreGc();loreDraw()}};
 o.onchange=async e=>{const i=e.target;if(i.type==="file"&&i.files&&i.files[0]){o.querySelectorAll("[data-lf]").forEach(x=>{if(x.type!=="file")st[x.dataset.lf]=x.value});try{st[i.dataset.lf]=await loreAddImage(i.files[0])}catch(err){try{toast("⚠ "+err.message)}catch(_){}}draw()}}}
const loreDraw=()=>{try{draw()}catch(_){}};
/* ----- vues ----- */
function shell(title,sub,inner,opt){opt=opt||{};loreCss();const L=LD();
 const top=`<div class="lo-top"><button type="button" class="lo-back" data-lo="back" aria-label="Retour">←</button><div class="lo-ttl"><h1>${E(title)}</h1>${sub?`<p>${E(sub)}</p>`:""}</div><button type="button" class="lo-btn ${ledit()?"on":""}" data-lo="mode">${ledit()?"✔ Terminer":"✎ Modifier"}</button></div>`;
 return`<div class="lo">${opt.ban?`<div class="lo-ban" style="--l:url(${LOREIMG.hdl})">${top}</div>`:top}${ledit()&&opt.tt?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="ttl" data-w="${opt.tt}">✎ Titre et sous-titre</button></div>`:""}${inner}</div>`}
function homeV(){const L=LD(),ed=ledit();
 return shell(L.title||"LORE",L.sub==null||L.sub===""?"Warhammer 40 000":L.sub,`<div class="lo-g">${LK.map(k=>{const c=lcard(k);return`<div class="lo-w"><button type="button" class="lo-c" data-lo="go" data-c="${k}" style="--i:url(${lcimg(k)})"><b>${E(c.t)}</b><span>${E(c.d)}</span><i aria-hidden="true">›</i></button>${ed?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="card" data-c="${k}">✎ Modifier cette rubrique</button></div>`:""}</div>`}).join("")}</div>${ed?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="ttl" data-w="home">✎ Titre et sous-titre de la page</button></div>`:""}`,{})}
function blkV(b,ci,di,bi,ed){let h="";if(b.k==="p")h=`<div class="lo-p">${E(b.x)}</div>`;else if(b.k==="h")h=`<h3 class="lo-h">${E(b.x)}</h3>`;else if(b.k==="s")h=`<h4 class="lo-s">${E(b.x)}</h4>`;else if(b.k==="i")h=`<div class="lo-im">${limg(b.id)?`<img src="${limg(b.id)}" alt="${E(b.cap||"")}">`:`<span class="lo-e">Image indisponible</span>`}${b.cap?`<small>${E(b.cap)}</small>`:""}</div>`;
 return ed?`<div class="lo-b"><div class="lo-tools"><button type="button" class="lo-btn s" data-lo="bed" data-d="${di}" data-h="${ci}" data-b="${bi}">✎</button><button type="button" class="lo-btn s" data-lo="bup" data-d="${di}" data-h="${ci}" data-b="${bi}">↑</button><button type="button" class="lo-btn s" data-lo="bdn" data-d="${di}" data-h="${ci}" data-b="${bi}">↓</button><button type="button" class="lo-btn s x" data-lo="bdel" data-d="${di}" data-h="${ci}" data-b="${bi}">🗑</button></div>${h}</div>`:h}
function histV(){const L=LD(),H=L.hist.drawers,ed=ledit(),c=lcard("hist");
 const dr=H.map(d=>`<details class="lo-dr" data-did="${d.id}" ${LORE.open[d.id]?"open":""}><summary>${E(d.t||"Sans titre")}</summary><div class="lo-in">
  <div class="lo-bk"><textarea class="lo-pgt" data-lopg="${d.id}" placeholder="Écris ici… (rien n'est perdu : touche « Enregistrer » quand tu as fini)" rows="9">${E(d.txt||"")}</textarea><div class="lo-bkb"><button type="button" class="lo-btn p" data-lo="dsave" data-d="${d.id}">💾 Enregistrer</button><button type="button" class="lo-btn s" data-lo="dren" data-d="${d.id}">✎ Renommer</button><button type="button" class="lo-btn s x" data-lo="ddel" data-d="${d.id}">🗑 Supprimer</button></div></div>
  ${ed?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="ddup" data-d="${d.id}">⧉ Dupliquer</button><button type="button" class="lo-btn s" data-lo="dup" data-d="${d.id}">↑</button><button type="button" class="lo-btn s" data-lo="ddn" data-d="${d.id}">↓</button></div>`:""}
  ${(d.ch||[]).map(ch=>`<div class="lo-ch"><h3>${E(ch.t||"Chapitre sans titre")}</h3>${ed?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="cren" data-d="${d.id}" data-h="${ch.id}">✎ Titre</button><button type="button" class="lo-btn s" data-lo="cdup" data-d="${d.id}" data-h="${ch.id}">⧉</button><button type="button" class="lo-btn s" data-lo="cup" data-d="${d.id}" data-h="${ch.id}">↑</button><button type="button" class="lo-btn s" data-lo="cdn" data-d="${d.id}" data-h="${ch.id}">↓</button><button type="button" class="lo-btn s x" data-lo="cdel" data-d="${d.id}" data-h="${ch.id}">🗑</button></div>`:""}
   ${(ch.bl||[]).map((b,bi)=>blkV(b,ch.id,d.id,bi,ed)).join("")}${ed?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="badd" data-k="p" data-d="${d.id}" data-h="${ch.id}">＋ Paragraphe</button><button type="button" class="lo-btn s" data-lo="badd" data-k="h" data-d="${d.id}" data-h="${ch.id}">＋ Titre</button><button type="button" class="lo-btn s" data-lo="badd" data-k="s" data-d="${d.id}" data-h="${ch.id}">＋ Sous-titre</button><button type="button" class="lo-btn s" data-lo="badd" data-k="i" data-d="${d.id}" data-h="${ch.id}">＋ Image</button></div>`:((ch.bl||[]).length?"":`<p class="lo-e">Chapitre vide.</p>`)}</div>`).join("")}
  ${ed?`<button type="button" class="lo-btn lo-add" data-lo="cadd" data-d="${d.id}">＋ Ajouter un chapitre</button>`:""}</div></details>`).join("");
 return shell(c.t,L.hist.sub||"",`${dr||`<p class="lo-e">Aucun tiroir pour l'instant. Crée le premier avec le bouton ci-dessous.</p>`}<button type="button" class="lo-btn p lo-add" data-lo="dadd">＋ Nouveau tiroir</button>`,{ban:1,tt:"hist"})}
function listV(k){const L=LD(),A=L[k],ed=ledit(),c=lcard(k);
 const tiles=A.map((x,i)=>`<div class="lo-w"><button type="button" class="lo-tile" data-lo="open" data-c="${k}" data-i="${x.id}"><div class="ph" style="${limg(x.img)?`--i:url(${limg(x.img)})`:""}"></div><div class="tx"><b>${E(x.n||"Sans nom")}</b><small>${E((x.f&&(x.f.ti||x.f.short))||"")}</small></div></button>${ed?`<div class="lo-tools"><button type="button" class="lo-btn s" data-lo="iup" data-c="${k}" data-i="${x.id}">↑</button><button type="button" class="lo-btn s" data-lo="idn" data-c="${k}" data-i="${x.id}">↓</button><button type="button" class="lo-btn s" data-lo="idup" data-c="${k}" data-i="${x.id}">⧉</button><button type="button" class="lo-btn s x" data-lo="idel" data-c="${k}" data-i="${x.id}">🗑</button></div>`:""}</div>`).join("");
 return shell(c.t,(L.pg&&L.pg[k])||"",`${tiles?`<div class="lo-g t">${tiles}</div>`:`<p class="lo-e">${ed?"Aucune fiche : ajoute la première ci-dessous.":"Rien n'a encore été créé ici. Touche « ✎ Modifier » pour ajouter une fiche."}</p>`}${ed?`<button type="button" class="lo-btn p lo-add" data-lo="iadd" data-c="${k}">＋ ${E(LNEW[k])}</button>`:""}`,{tt:k})}
function itemV(k,id){const L=LD(),x=L[k].find(y=>y.id===id);if(!x){LORE.v=k;return listV(k)}const ed=ledit(),f=x.f||{};
 const secs=LSCH[k].filter(s=>s[0]!=="ti"&&s[0]!=="short"||true).map(([key,lab,ar])=>key==="ti"?"":(f[key]?`<h3>${E(lab)}</h3><div class="lo-p">${E(f[key])}</div>`:"")).join("");
 const sw=k==="coul"?`<h3>Couleurs</h3>${(x.sw||[]).length?`<div class="lo-sw">${x.sw.map((s,i)=>`<div><i style="background:${E(s.c)}"></i><span>${E(s.n||s.c)}<br><small style="opacity:.7">${E(s.c)}</small></span>${ed?`<button type="button" class="lo-btn s" data-lo="swed" data-c="${k}" data-i="${id}" data-x="${i}">✎</button><button type="button" class="lo-btn s x" data-lo="swdel" data-c="${k}" data-i="${id}" data-x="${i}">🗑</button>`:""}</div>`).join("")}</div>`:`<p class="lo-e">Aucune couleur.</p>`}${ed?`<button type="button" class="lo-btn s" data-lo="swadd" data-c="${k}" data-i="${id}">＋ Ajouter une couleur</button>`:""}`:"";
 const ex=`<h3>Informations complémentaires</h3>${(x.extra||[]).length?(x.extra||[]).map((e,i)=>`<div class="lo-x"><b>${E(e.l)} :</b><span>${E(e.v)}</span>${ed?`<button type="button" class="lo-btn s" data-lo="exed" data-c="${k}" data-i="${id}" data-x="${i}">✎</button><button type="button" class="lo-btn s x" data-lo="exdel" data-c="${k}" data-i="${id}" data-x="${i}">🗑</button>`:""}</div>`).join(""):`<p class="lo-e">Aucune information.</p>`}${ed?`<button type="button" class="lo-btn s" data-lo="exadd" data-c="${k}" data-i="${id}">＋ Ajouter une information</button>`:""}`;
 const gal=`<h3>Images</h3>${(x.imgs||[]).length?`<div class="lo-gal">${x.imgs.map((g,i)=>`<div><img src="${limg(g)}" alt="">${ed?`<div class="lo-tools" style="margin:4px 0 0"><button type="button" class="lo-btn s x" data-lo="gdel" data-c="${k}" data-i="${id}" data-x="${i}">🗑</button></div>`:""}</div>`).join("")}</div>`:`<p class="lo-e">Aucune image supplémentaire.</p>`}${ed?`<label class="lo-btn s" style="display:inline-flex;align-items:center;cursor:pointer">＋ Ajouter une image<input type="file" accept="image/*" multiple data-lo-file="${k}|${id}" style="display:none"></label>`:""}`;
 return shell(x.n||"Sans nom","",`<div class="lo-pg"><div class="lo-hero ${limg(x.img)?"":"n"}" style="${limg(x.img)?`--i:url(${limg(x.img)})`:""}"></div><div class="lo-body"><h2>${E(x.n||"Sans nom")}</h2>${f.ti?`<div class="ti">${E(f.ti)}</div>`:""}${secs}${sw}${ex}${gal}${ed?`<div class="lo-tools" style="margin-top:14px"><button type="button" class="lo-btn p" data-lo="iedit" data-c="${k}" data-i="${id}">✎ Modifier la fiche</button></div>`:""}</div></div>`,{})}
function loreView(){loreCss();const v=LORE.v;if(v==="home")return homeV();if(v==="hist")return histV();if(LSCH[v]){return LORE.id?itemV(v,LORE.id):listV(v)}return homeV()}
window.XV=window.XV||{};XV.lore=function(){try{return loreView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
/* ----- actions ----- */
function Dr(id){return LD().hist.drawers.find(d=>d.id===id)}
function Ch(di,hi){const d=Dr(di);return d&&(d.ch||[]).find(c=>c.id===hi)}
const lsave=()=>{sv();loreDraw()};
document.addEventListener("input",e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.lopg)return;const d=Dr(t.dataset.lopg);if(d){d.txt=t.value;clearTimeout(window.__lopgT);window.__lopgT=setTimeout(()=>{try{sv()}catch(_){}},800)}});
document.addEventListener("click",e=>{const tl=e.target.closest&&e.target.closest('[data-tab="lore"]');if(tl){if(typeof tab!=="undefined"&&tab!=="lore")LORE.prev=tab;LORE.v="home";LORE.mode="view";LORE.id=null;LORE.open={};return}
 const sm=e.target.closest&&e.target.closest('details.lo-dr>summary');if(sm){const d=sm.parentElement;setTimeout(()=>{LORE.open[d.dataset.did]=d.open},0);return}
 const b=e.target.closest&&e.target.closest("[data-lo]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.lo,L=LD(),ds=b.dataset,k=ds.c,go=()=>{try{draw()}catch(_){}try{window.scrollTo(0,0)}catch(_){}};
 const ask2=(t,p,cb)=>{try{ask({t,p,ok:"Supprimer",dg:1},cb)}catch(_){cb()}};
 if(a==="go"){LORE.v=k;LORE.id=null;LORE.open={};go()}
 else if(a==="back"){if(LORE.v==="home"){tab=LORE.prev&&LORE.prev!=="lore"?LORE.prev:"home";LORE.mode="view";go()}else if(LORE.id){LORE.id=null;go()}else{LORE.v="home";go()}}
 else if(a==="mode"){LORE.mode=ledit()?"view":"edit";loreDraw()}
 else if(a==="open"){LORE.id=ds.i;go()}
 else if(a==="ttl"){const w=ds.w;if(w==="home")lmodal("Titre et sous-titre",[{k:"t",l:"Titre",v:L.title||"LORE"},{k:"s",l:"Sous-titre",v:L.sub==null||L.sub===""?"Warhammer 40 000":L.sub}],s=>{L.title=s.t.trim();L.sub=s.s.trim()});else lmodal("Sous-titre de la page",[{k:"s",l:"Sous-titre",v:w==="hist"?L.hist.sub||"":(L.pg&&L.pg[w])||""}],s=>{if(w==="hist")L.hist.sub=s.s.trim();else{L.pg=L.pg||{};L.pg[w]=s.s.trim()}})}
 else if(a==="card"){const c=lcard(k),cu=L.cards[k]||{};lmodal("Modifier la rubrique",[{k:"t",l:"Nom de la rubrique",v:c.t},{k:"d",l:"Description",t:"area",v:c.d},{k:"img",l:"Illustration",t:"img",v:cu.img||"",dflt:1}],s=>{L.cards[k]={t:s.t.trim()||LDEF[k].t,d:s.d.trim()||LDEF[k].d,img:s.img||""}})}
 /* histoire : tiroirs */
 else if(a==="dadd")lmodal("Nouveau tiroir",[{k:"t",l:"Nom du tiroir",p:"ex. Origines, Guerres, Archives…"}],s=>{const id=luid();L.hist.drawers.push({id,t:s.t.trim()||"Nouveau tiroir",ch:[],txt:""});LORE.open={};LORE.open[id]=true});
 else if(a==="dsave"){const d=Dr(ds.d),t=document.querySelector('textarea[data-lopg="'+ds.d+'"]');if(d&&t){d.txt=t.value;sv();try{toast("Enregistré ✓")}catch(_){}}}
 else if(a==="dren"){const d=Dr(ds.d);lmodal("Renommer le tiroir",[{k:"t",l:"Nom",v:d.t}],s=>{d.t=s.t.trim()||d.t})}
 else if(a==="ddup"){const d=Dr(ds.d),n=JSON.parse(JSON.stringify(d));n.id=luid();n.t=d.t+" (copie)";(n.ch||[]).forEach(c=>c.id=luid());L.hist.drawers.splice(L.hist.drawers.indexOf(d)+1,0,n);lsave()}
 else if(a==="dup"||a==="ddn"){const A=L.hist.drawers,i=A.indexOf(Dr(ds.d));lmove(A,i,a==="dup"?-1:1);lsave()}
 else if(a==="ddel"){const d=Dr(ds.d);ask2("Supprimer ce tiroir ?","Le tiroir « "+d.t+" », ses chapitres, textes et images seront supprimés.",()=>{L.hist.drawers=L.hist.drawers.filter(x=>x!==d);lsave();loreGc()})}
 else if(a==="cadd"){const d=Dr(ds.d);lmodal("Nouveau chapitre",[{k:"t",l:"Titre du chapitre"}],s=>{d.ch=d.ch||[];d.ch.push({id:luid(),t:s.t.trim()||"Nouveau chapitre",bl:[]});LORE.open[d.id]=true})}
 else if(a==="cren"){const c=Ch(ds.d,ds.h);lmodal("Titre du chapitre",[{k:"t",l:"Titre",v:c.t}],s=>{c.t=s.t.trim()||c.t})}
 else if(a==="cdup"){const d=Dr(ds.d),c=Ch(ds.d,ds.h),n=JSON.parse(JSON.stringify(c));n.id=luid();n.t=c.t+" (copie)";d.ch.splice(d.ch.indexOf(c)+1,0,n);lsave()}
 else if(a==="cup"||a==="cdn"){const d=Dr(ds.d);lmove(d.ch,d.ch.indexOf(Ch(ds.d,ds.h)),a==="cup"?-1:1);lsave()}
 else if(a==="cdel"){const d=Dr(ds.d),c=Ch(ds.d,ds.h);ask2("Supprimer ce chapitre ?","Le chapitre « "+c.t+" » et son contenu seront supprimés.",()=>{d.ch=d.ch.filter(x=>x!==c);lsave();loreGc()})}
 else if(a==="badd"){const c=Ch(ds.d,ds.h),kk=ds.k,lab={p:"Nouveau paragraphe",h:"Nouveau titre",s:"Nouveau sous-titre",i:"Nouvelle image"}[kk];
  if(kk==="i")lmodal(lab,[{k:"id",l:"Image",t:"img"},{k:"cap",l:"Légende (facultative)"}],s=>{if(s.id)c.bl.push({k:"i",id:s.id,cap:s.cap.trim()})});
  else lmodal(lab,[{k:"x",l:kk==="p"?"Texte":"Texte du "+(kk==="h"?"titre":"sous-titre"),t:kk==="p"?"area":"text",big:kk==="p"}],s=>{if(s.x.trim())c.bl.push({k:kk,x:s.x.replace(/\s+$/,"")})})}
 else if(a==="bed"){const c=Ch(ds.d,ds.h),bl=c.bl[+ds.b];if(bl.k==="i")lmodal("Modifier l'image",[{k:"id",l:"Image",t:"img",v:bl.id},{k:"cap",l:"Légende",v:bl.cap||""}],s=>{if(s.id){bl.id=s.id;bl.cap=s.cap.trim()}});else lmodal("Modifier",[{k:"x",l:"Texte",t:bl.k==="p"?"area":"text",big:bl.k==="p",v:bl.x}],s=>{bl.x=s.x.replace(/\s+$/,"")})}
 else if(a==="bup"||a==="bdn"){const c=Ch(ds.d,ds.h);lmove(c.bl,+ds.b,a==="bup"?-1:1);lsave()}
 else if(a==="bdel"){const c=Ch(ds.d,ds.h);c.bl.splice(+ds.b,1);lsave();loreGc()}
 /* fiches */
 else if(a==="iadd"){const sch=LSCH[k],fl=[{k:"n",l:"Nom"},{k:"img",l:"Illustration principale",t:"img"}].concat(sch.map(([kk,l,ar])=>({k:kk,l,t:ar?"area":"text"})));lmodal(LNEW[k],fl,s=>{const f={};sch.forEach(([kk])=>f[kk]=(s[kk]||"").trim());const it={id:luid(),n:s.n.trim()||"Sans nom",img:s.img||"",f,imgs:[],extra:[]};if(k==="coul")it.sw=[];L[k].push(it)})}
 else if(a==="iedit"){const x=L[k].find(y=>y.id===ds.i),sch=LSCH[k],fl=[{k:"n",l:"Nom",v:x.n},{k:"img",l:"Illustration principale",t:"img",v:x.img}].concat(sch.map(([kk,l,ar])=>({k:kk,l,t:ar?"area":"text",big:kk==="bio",v:(x.f||{})[kk]||""})));lmodal("Modifier la fiche",fl,s=>{x.n=s.n.trim()||"Sans nom";x.img=s.img||"";x.f=x.f||{};sch.forEach(([kk])=>x.f[kk]=(s[kk]||"").trim())})}
 else if(a==="iup"||a==="idn"){const A=L[k];lmove(A,A.findIndex(y=>y.id===ds.i),a==="iup"?-1:1);lsave()}
 else if(a==="idup"){const A=L[k],i=A.findIndex(y=>y.id===ds.i),n=JSON.parse(JSON.stringify(A[i]));n.id=luid();n.n=(A[i].n||"")+" (copie)";A.splice(i+1,0,n);lsave()}
 else if(a==="idel"){const x=L[k].find(y=>y.id===ds.i);ask2("Supprimer cette fiche ?","« "+(x.n||"Sans nom")+" » sera supprimée.",()=>{L[k]=L[k].filter(y=>y!==x);LORE.id=null;lsave();loreGc()})}
 else if(a==="exadd"||a==="exed"){const x=L[k].find(y=>y.id===ds.i),cur=a==="exed"?x.extra[+ds.x]:null;lmodal(cur?"Modifier l'information":"Nouvelle information",[{k:"l",l:"Intitulé",v:cur?cur.l:"",p:"ex. Planète d'origine, Devise…"},{k:"v",l:"Valeur",t:"area",v:cur?cur.v:""}],s=>{if(!s.l.trim())return;x.extra=x.extra||[];if(cur){cur.l=s.l.trim();cur.v=s.v.trim()}else x.extra.push({l:s.l.trim(),v:s.v.trim()})})}
 else if(a==="exdel"){const x=L[k].find(y=>y.id===ds.i);x.extra.splice(+ds.x,1);lsave()}
 else if(a==="swadd"||a==="swed"){const x=L[k].find(y=>y.id===ds.i),cur=a==="swed"?x.sw[+ds.x]:null;lmodal(cur?"Modifier la couleur":"Nouvelle couleur",[{k:"n",l:"Nom de la couleur",v:cur?cur.n:"",p:"ex. Vert armure"},{k:"c",l:"Couleur",t:"color",v:cur?cur.c:"#2e7d4f"}],s=>{x.sw=x.sw||[];if(cur){cur.n=s.n.trim();cur.c=s.c}else x.sw.push({n:s.n.trim(),c:s.c})})}
 else if(a==="swdel"){const x=L[k].find(y=>y.id===ds.i);x.sw.splice(+ds.x,1);lsave()}
 else if(a==="gdel"){const x=L[k].find(y=>y.id===ds.i);x.imgs.splice(+ds.x,1);lsave();loreGc()}
},true);
document.addEventListener("change",async e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.loFile)return;const[k,id]=i.dataset.loFile.split("|"),x=LD()[k].find(y=>y.id===id);if(!x||!i.files)return;for(const f of i.files){try{x.imgs=x.imgs||[];x.imgs.push(await loreAddImage(f))}catch(err){try{toast("⚠ "+err.message)}catch(_){}}}sv();loreDraw()},true);
liAll().then(o=>{Object.assign(LI,o);LIREADY=true;if(typeof tab!=="undefined"&&tab==="lore")loreDraw()}).catch(()=>{LIREADY=true});
window.BIBLORE={LD,LI,loreAddImage};
