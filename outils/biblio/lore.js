/* ===== LORE : espace d'histoire du jeu (Histoire → Dragons du Dernier Feu, Personnages, Organisations, Couleurs et Héraldique) ===== */
/*__LOREIMG__*/
const LORE={v:"home",prev:"home",edit:null};
const LTOP=[
 {id:"hist",t:"Histoire",d:"L'histoire de l'univers, des chapitres et des événements majeurs.",img:"hist"},
 {id:"pers",t:"Personnages",d:"Héros, primarques, maîtres de chapitre et personnages emblématiques.",img:"pers"},
 {id:"orga",t:"Organisations",d:"Chapitres, légions, ordres, régiments et divisions des différentes factions.",img:"orga"},
 {id:"coul",t:"Couleurs et Héraldique",d:"Schémas de peinture, couleurs, symboles et marquages des armées.",img:"coul"}];
const LHIST=[
 {id:"orig",t:"Origines du Chapitre",d:"La fondation des Dragons du Dernier Feu et leur héritage des Salamanders.",img:"orig",f:["Les Dragons du Dernier Feu sont un chapitre successeur des Salamanders.","Leur maître de chapitre est Vulkan Heshzeke."]},
 {id:"miss",t:"La Mission",d:"Retenir ce qu'il reste d'humanité et préserver l'âme des Astartes.",img:"miss",f:["La mission du chapitre : retenir ce qu'il reste d'humanité et préserver l'âme des Astartes."]},
 {id:"epre",t:"L'Épreuve de la Flamme",d:"Le rituel de la Braise de Vulkan qui décide du destin des frères.",img:"epre",f:["L'Épreuve de la Flamme est le rituel de la Braise de Vulkan, qui décide du destin des frères."]},
 {id:"comp",t:"Les Compagnies",d:"Organisation, rôles et spécialisations des différentes formations du Chapitre.",img:"comp",f:["Le chapitre est organisé en compagnies, chacune avec ses spécialisations.","Les Sauveurs Éternels ont plusieurs branches."]},
 {id:"camp",t:"Les Grandes Campagnes",d:"Les batailles et les guerres marquantes des Dragons du Dernier Feu.",img:"camp",f:[]},
 {id:"hero",t:"Héros et Figures",d:"Les maîtres, champions et frères remarquables du Chapitre.",img:"hero",f:["Maître de chapitre : Vulkan Heshzeke."]},
 {id:"chro",t:"Chronologie",d:"Les dates et événements importants de l'histoire du Chapitre.",img:"chro",f:[]}];
const LPAGES={};LTOP.forEach(x=>LPAGES[x.id]=Object.assign({},x,{up:"home",f:x.id==="coul"?["Couleurs des Dragons du Dernier Feu : dominante verte, flammes, braises et cendres."]:[]}));LHIST.forEach(x=>LPAGES[x.id]=Object.assign({},x,{up:"hist"}));
const lstore=()=>{S.lore=S.lore&&typeof S.lore==="object"?S.lore:{};return S.lore};
function loreCss(){if(document.getElementById("lorecss"))return;const s=document.createElement("style");s.id="lorecss";s.textContent=`
.lo{margin:-4px -2px;color:#f1e8cf;font-family:Georgia,"Times New Roman",serif}
.lo-top{position:relative;display:flex;align-items:center;gap:10px;margin:0 0 10px}
.lo-back{flex:none;width:46px;height:46px;border-radius:12px;border:1.5px solid #b8902f;background:linear-gradient(#1b1710,#0c0a07);color:#e8c868;font-size:24px;cursor:pointer}
.lo-ttl{flex:1;text-align:center;padding:6px 8px 4px}
.lo-ttl h1{margin:0;font-size:clamp(28px,8vw,46px);letter-spacing:.06em;font-weight:700;color:#e9c66a;text-shadow:0 2px 10px #000,0 0 18px rgba(214,160,40,.35)}
.lo-ttl p{margin:2px 0 0;font-size:clamp(14px,3.8vw,19px);color:#efe6cc}
.lo-ban{position:relative;border:1.5px solid #b8902f;border-radius:14px;overflow:hidden;margin:0 0 12px;min-height:104px;background:#090705}
.lo-ban:before,.lo-ban:after{content:"";position:absolute;top:0;bottom:0;width:44%;background-size:cover;background-position:center}
.lo-ban:before{left:0;background-image:var(--l);-webkit-mask-image:linear-gradient(90deg,#000 55%,transparent);mask-image:linear-gradient(90deg,#000 55%,transparent)}
.lo-ban:after{right:0;background-image:var(--r);-webkit-mask-image:linear-gradient(270deg,#000 55%,transparent);mask-image:linear-gradient(270deg,#000 55%,transparent)}
.lo-ban .lo-ttl{position:relative;z-index:1;padding:14px 8px}
.lo-g{display:grid;gap:12px;grid-template-columns:1fr}
.lo-c{position:relative;display:flex;flex-direction:column;justify-content:flex-end;text-align:left;min-height:150px;padding:14px 46px 14px 14px;border-radius:14px;border:2px solid #b8902f;box-shadow:inset 0 0 0 1px #3a2c0c,0 4px 14px rgba(0,0,0,.55);color:#f1e8cf;font:inherit;cursor:pointer;overflow:hidden;background:#0b0907;transition:transform .18s,box-shadow .18s,border-color .18s}
.lo-c:before{content:"";position:absolute;inset:0;background:var(--i) center/cover no-repeat;transition:transform .35s,filter .25s}
.lo-c:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,5,3,.94) 8%,rgba(6,5,3,.78) 42%,rgba(6,5,3,.12) 100%)}
.lo-c>*{position:relative;z-index:1}
.lo-c:hover,.lo-c:focus-visible{border-color:#f0cf74;box-shadow:inset 0 0 0 1px #5a4614,0 6px 20px rgba(214,160,40,.28);transform:translateY(-2px)}
.lo-c:hover:before{transform:scale(1.05);filter:brightness(1.12)}
.lo-c b{display:block;font-size:clamp(20px,5.4vw,28px);color:#f3d98a;text-shadow:0 2px 6px #000;line-height:1.1;margin-bottom:6px}
.lo-c span{display:block;font-size:clamp(14px,3.6vw,17px);line-height:1.35;color:#efe6cc;text-shadow:0 1px 4px #000;max-width:30em}
.lo-c i{position:absolute;right:14px;bottom:14px;font-style:normal;font-size:28px;color:#e8c868;z-index:1}
@media(min-width:640px){.lo-g{grid-template-columns:repeat(2,1fr)}.lo-c{min-height:190px}.lo-g.h7{grid-template-columns:repeat(6,1fr)}.lo-g.h7 .lo-c{grid-column:span 3}.lo-g.h7 .lo-c:nth-child(n+5){grid-column:span 2;min-height:170px}}
.lo-pg{border:2px solid #b8902f;border-radius:14px;background:#0d0a07;overflow:hidden;box-shadow:inset 0 0 0 1px #3a2c0c}
.lo-hero{height:170px;background:var(--i) center/cover no-repeat;position:relative}
.lo-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#0d0a07,rgba(13,10,7,.1) 60%)}
.lo-body{padding:14px}
.lo-body h2{margin:0 0 4px;color:#f3d98a;font-size:clamp(22px,6vw,30px)}
.lo-body h3{margin:14px 0 6px;color:#e8c868;font-size:17px;letter-spacing:.03em}
.lo-body p,.lo-body li{font-size:16px;line-height:1.5;color:#efe6cc}
.lo-body ul{padding-left:20px;margin:4px 0}
.lo-note{white-space:pre-wrap;border-left:3px solid #b8902f;padding:6px 10px;background:rgba(184,144,47,.08)}
.lo-body textarea{width:100%;min-height:170px;box-sizing:border-box;border-radius:10px;border:1.5px solid #b8902f;background:#0a0806;color:#f1e8cf;padding:10px;font:inherit;font-size:16px}
.lo-btn{min-height:46px;padding:0 18px;border-radius:12px;border:1.5px solid #b8902f;background:linear-gradient(#2a2110,#120e07);color:#f3d98a;font:inherit;font-size:16px;cursor:pointer;margin:8px 8px 0 0}
.lo-btn.p{background:linear-gradient(#c9a227,#8c6a12);color:#17120a;font-weight:700}`;document.head.appendChild(s)}
const loC=(x,go)=>`<button type="button" class="lo-c" data-lore="${go}" data-p="${x.id}" style="--i:url(${LOREIMG[x.img]})"><b>${E(x.t)}</b><span>${E(x.d)}</span><i aria-hidden="true">›</i></button>`;
function loreView(){loreCss();const v=LORE.v;let h="";
 if(v==="home")h=`<div class="lo"><div class="lo-top"><button type="button" class="lo-back" data-lore="back" aria-label="Retour">←</button><div class="lo-ttl"><h1>LORE</h1><p>Warhammer 40 000</p></div><span style="width:46px"></span></div><div class="lo-g">${LTOP.map(x=>loC(x,"go")).join("")}</div></div>`;
 else if(v==="hist")h=`<div class="lo"><div class="lo-ban" style="--l:url(${LOREIMG.hdl});--r:url(${LOREIMG.hdr})"><div class="lo-top" style="margin:0;padding:8px"><button type="button" class="lo-back" data-lore="back" aria-label="Retour au menu Lore">←</button><div class="lo-ttl"><h1>HISTOIRE</h1><p>Les Dragons du Dernier Feu</p></div><span style="width:46px"></span></div></div><div class="lo-g h7">${LHIST.map(x=>loC(x,"go")).join("")}</div></div>`;
 else if(LPAGES[v]){const x=LPAGES[v],st=lstore()[v]||{},ed=LORE.edit===v;
  h=`<div class="lo"><div class="lo-top"><button type="button" class="lo-back" data-lore="back" aria-label="Retour">←</button><div class="lo-ttl"><h1 style="font-size:clamp(22px,6.5vw,34px)">${E(x.t.toUpperCase())}</h1></div><span style="width:46px"></span></div>
  <div class="lo-pg"><div class="lo-hero" style="--i:url(${LOREIMG[x.img]})"></div><div class="lo-body"><h2>${E(x.t)}</h2><p>${E(x.d)}</p>
  <h3>Ce qui est établi</h3>${x.f&&x.f.length?`<ul>${x.f.map(t=>`<li>${E(t)}</li>`).join("")}</ul>`:`<p style="opacity:.75">Rien n'est encore renseigné pour cette fiche : elle est prête à être complétée.</p>`}
  <h3>${v==="hist"?"":"Mes notes"}</h3>${ed?`<textarea id="lotxt" placeholder="Écris ici le texte de cette fiche (lore établi, dates, noms…)">${E(st.t||"")}</textarea><div><button type="button" class="lo-btn p" data-lore="save" data-p="${v}">✔ Enregistrer</button><button type="button" class="lo-btn" data-lore="cancel">Annuler</button></div>`:`${st.t?`<div class="lo-note">${E(st.t)}</div>`:`<p style="opacity:.75">Aucun texte pour l'instant.</p>`}<button type="button" class="lo-btn p" data-lore="edit" data-p="${v}">✎ ${st.t?"Modifier le texte":"Compléter cette fiche"}</button>`}
  </div></div></div>`}
 return h}
window.XV=window.XV||{};XV.lore=function(){try{return loreView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest('[data-tab="lore"]');if(t){if(typeof tab!=="undefined"&&tab!=="lore")LORE.prev=tab;LORE.v="home";LORE.edit=null;return}
 const b=e.target.closest&&e.target.closest("[data-lore]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.lore,go=()=>{try{draw()}catch(_){}try{window.scrollTo(0,0)}catch(_){}};
 if(a==="go"){LORE.v=b.dataset.p;LORE.edit=null;go()}
 else if(a==="back"){LORE.edit=null;if(LORE.v==="home"){tab=LORE.prev&&LORE.prev!=="lore"?LORE.prev:"home";go()}else{LORE.v=(LPAGES[LORE.v]&&LPAGES[LORE.v].up)||"home";go()}}
 else if(a==="edit"){LORE.edit=b.dataset.p;go()}
 else if(a==="cancel"){LORE.edit=null;go()}
 else if(a==="save"){const el=document.getElementById("lotxt"),v=(el?el.value:"").trim(),s=lstore();if(v)s[b.dataset.p]={t:v,at:Date.now()};else delete s[b.dataset.p];sv();LORE.edit=null;try{toast("Texte enregistré ✓")}catch(_){}go()}
},true);
