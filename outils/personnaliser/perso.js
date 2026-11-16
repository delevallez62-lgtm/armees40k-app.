/* Mascotte (logo d'accueil) personnalisable — 100 % local */
(function(){
"use strict";
function pick(file,cb){
 if(!file)return;
 const r=new FileReader();
 r.onload=function(){
  const im=new Image();
  im.onload=function(){
   const k=Math.min(1,320/Math.max(im.width,im.height)),c=document.createElement("canvas");
   c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));
   c.getContext("2d").drawImage(im,0,0,c.width,c.height);
   cb(c.toDataURL("image/png"));
  };
  im.onerror=function(){try{toast("Image illisible")}catch(_){}};
  im.src=r.result;
 };
 r.readAsDataURL(file);
}
function reopen(){const b=document.createElement("button");b.dataset.gx="iclist";document.body.appendChild(b);b.click();b.remove()}
document.addEventListener("change",function(e){
 if(!e.target||e.target.id!=="gxlogo")return;
 pick(e.target.files&&e.target.files[0],function(d){
  S.logo=d;try{GX.commit()}catch(_){try{save();draw()}catch(__){}}
  reopen();
  try{toast("Mascotte changée ✓")}catch(_){}
 });
});
document.addEventListener("click",function(e){
 const b=e.target.closest&&e.target.closest('[data-gx="logodef"]');
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 delete S.logo;try{GX.commit()}catch(_){try{save();draw()}catch(__){}}
 reopen();
 try{toast("Mascotte d'origine rétablie")}catch(_){}
},true);
document.addEventListener("click",function(e){
 const b=e.target.closest&&e.target.closest('[data-gx="welsave"],[data-gx="welreset"]');
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(b.dataset.gx==="welreset"){delete S.hwel;delete S.pseudo;delete S.hsub}
 else{
  const v=function(id){const i=document.getElementById(id);return i?i.value.trim():null};
  const g=v("gxw1"),n=v("gxw2"),t=v("gxw3");
  if(g!==null)S.hwel=g;
  if(n!==null){if(n)S.pseudo=n;else delete S.pseudo}
  if(t!==null)S.hsub=t;
 }
 try{GX.commit()}catch(_){try{save();draw()}catch(__){}}
 reopen();
 try{toast(b.dataset.gx==="welreset"?"Texte d'origine rétabli":"Texte enregistré ✓")}catch(_){}
},true);
})();
