/* ===== HAMMER · Bloc-notes (post-it) : un pense-bête par armée, + un pour la partie en cours ===== */
(()=>{
if(typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const GAME=["play","pst","bat"],LISTT=["units","dets","strats","opti"];
let open=false,sub="l",key="",sv=null;
const css=`<style id="nbcss">
#nbub{touch-action:none;user-select:none;-webkit-user-select:none;position:fixed;right:12px;bottom:calc(128px + env(safe-area-inset-bottom,0px));z-index:16;width:44px;height:44px;border-radius:50%;border:1px solid color-mix(in srgb,var(--ac) 45%,var(--bd));background:linear-gradient(145deg,color-mix(in srgb,#caa13a 22%,var(--card)),var(--card));color:var(--tx);font-size:21px;line-height:1;display:grid;place-items:center;cursor:pointer;padding:0;box-shadow:0 4px 14px rgba(0,0,0,.45)}
#nbub:active{transform:scale(.94)}#nbub i{position:absolute;top:5px;right:5px;width:10px;height:10px;border-radius:50%;background:#e0a030;border:2px solid var(--card);display:none}#nbub.has i{display:block}
#npad{position:fixed;right:10px;bottom:calc(184px + env(safe-area-inset-bottom,0px));z-index:30;width:min(340px,calc(100vw - 20px));display:none;flex-direction:column;border-radius:6px 6px 14px 6px;background:color-mix(in srgb,#2b2410 76%,var(--card));border:1px solid color-mix(in srgb,#caa13a 40%,var(--bd));box-shadow:0 14px 40px rgba(0,0,0,.6);transform:rotate(-.6deg);color:var(--tx)}
#npad.on{display:flex}
#npad .nh{display:flex;align-items:center;gap:8px;padding:8px 10px;background:color-mix(in srgb,#caa13a 24%,transparent);border-radius:6px 6px 0 0;border-bottom:1px solid color-mix(in srgb,#caa13a 35%,transparent)}
#npad .nh b{flex:1;min-width:0;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#npad .nx{min-width:36px;min-height:36px;border-radius:50%;border:0;background:rgba(0,0,0,.28);color:var(--tx);font-size:15px;cursor:pointer}
#npad .nt{display:flex;gap:4px;padding:6px 10px 0}#npad .nt button{flex:1;min-height:34px;border-radius:9px;border:1px solid color-mix(in srgb,#caa13a 35%,transparent);background:transparent;color:var(--mu);font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}#npad .nt button.on{background:color-mix(in srgb,#caa13a 28%,transparent);color:var(--tx)}
#npad textarea{margin:8px 10px 4px;min-height:190px;max-height:46vh;resize:vertical;border:0;border-radius:6px;padding:8px 10px;font:inherit;font-size:16px;line-height:26px;color:var(--tx);background:repeating-linear-gradient(transparent,transparent 25px,rgba(202,161,58,.16) 25px,rgba(202,161,58,.16) 26px);background-attachment:local;outline:none}
#npad .nf{padding:2px 12px 9px;font-size:11.5px;color:var(--mu);display:flex;justify-content:space-between;gap:8px}
</style>`;
function ctx(){const t=typeof tab==="undefined"?"":tab,game=GAME.includes(t);
 const id=game?(S.pm||S.cur):(LISTT.includes(t)?S.cur:null);const L=id&&(S.lists||[]).find(l=>l.id===id);return L?{L,game}:null}
const getTxt=c=>sub==="p"&&c.game?((S.bat&&S.bat.note)||""):(c.L.note||"");
function setTxt(c,v){if(sub==="p"&&c.game){if(S.bat&&typeof S.bat==="object")S.bat.note=v}else c.L.note=v;clearTimeout(sv);sv=setTimeout(()=>{try{save()}catch(_){}const f=document.getElementById("nbs");if(f)f.textContent="Enregistré ✓"},350);const f=document.getElementById("nbs");if(f)f.textContent="…"}
const has=c=>!!(c.L.note&&c.L.note.trim())||!!(c.game&&S.bat&&S.bat.note&&String(S.bat.note).trim());
function build(c){const p=document.getElementById("npad");const k=[c.L.id,c.game,sub].join("|");if(p.dataset.k===k)return;p.dataset.k=k;
 p.innerHTML=`<div class="nh"><span>📝</span><b>Bloc-notes · ${E(c.L.name||"Armée")}</b><button class="nx" data-nb="x" aria-label="Fermer">✕</button></div>
 ${c.game?`<div class="nt"><button class="${sub==="l"?"on":""}" data-nb="sl">📋 Armée</button><button class="${sub==="p"?"on":""}" data-nb="sp">🎲 Cette partie</button></div>`:""}
 <textarea id="nbt" placeholder="${sub==="p"&&c.game?"Remarques sur cette partie…":"Pense-bête sur cette armée…"}" aria-label="Notes">${E(getTxt(c))}</textarea><div class="nf"><span>${sub==="p"&&c.game?"Propre à la partie en cours":"Rattaché à cette armée"}</span><span id="nbs">Enregistré automatiquement</span></div>`}
function update(){try{const c=ctx();if(!document.getElementById("nbcss"))document.head.insertAdjacentHTML("beforeend",css);
 let b=document.getElementById("nbub"),p=document.getElementById("npad");
 if(!b){b=document.createElement("button");b.id="nbub";b.type="button";b.title="Bloc-notes";b.setAttribute("aria-label","Bloc-notes");b.innerHTML="📝<i></i>";document.body.appendChild(b);p=document.createElement("div");p.id="npad";document.body.appendChild(p);applyPos()}
 if(!c){b.style.display="none";p.className="";open=false;return}
 b.style.display="";b.classList.toggle("has",has(c));
 if(!c.game&&sub==="p")sub="l";
 if(open){p.className="on";build(c);placePad()}else p.className=""}catch(e){}}
const PK="a40k_nb_pos";let moved=0;
const clampPos=(x,y,w,h)=>[Math.max(6,Math.min(innerWidth-w-6,x)),Math.max(70,Math.min(innerHeight-h-70,y))];
function applyPos(){const b=document.getElementById("nbub");if(!b)return;let p=null;try{p=JSON.parse(localStorage.getItem(PK)||"null")}catch(_){}
 if(p&&typeof p.x==="number"){const r=b.getBoundingClientRect(),w=r.width||44,h=r.height||44,c=clampPos(p.x*innerWidth,p.y*innerHeight,w,h);b.style.left=c[0]+"px";b.style.top=c[1]+"px";b.style.right="auto";b.style.bottom="auto"}
 placePad()}
function placePad(){const b=document.getElementById("nbub"),d=document.getElementById("npad");if(!b||!d||b.style.display==="none")return;const r=b.getBoundingClientRect(),w=Math.min(340,innerWidth-20);
 const x=Math.max(10,Math.min(innerWidth-w-10,r.right-w));d.style.left=x+"px";d.style.right="auto";
 if(r.top>innerHeight/2){d.style.top="auto";d.style.bottom=(innerHeight-r.top+8)+"px"}else{d.style.bottom="auto";d.style.top=(r.bottom+8)+"px"}}
(()=>{let st=null;document.addEventListener("pointerdown",e=>{const b=e.target&&e.target.closest&&e.target.closest("#nbub");if(!b)return;const r=b.getBoundingClientRect();st={id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:r.left,oy:r.top,w:r.width,h:r.height,d:false}},true);
 document.addEventListener("pointermove",e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.sx,dy=e.clientY-st.sy;if(!st.d&&Math.hypot(dx,dy)<8)return;st.d=true;const b=document.getElementById("nbub");if(!b)return;try{b.setPointerCapture(e.pointerId)}catch(_){}
  const c=clampPos(st.ox+dx,st.oy+dy,st.w,st.h);b.style.left=c[0]+"px";b.style.top=c[1]+"px";b.style.right="auto";b.style.bottom="auto";placePad();e.preventDefault()},true);
 const end=e=>{if(!st||e.pointerId!==st.id)return;if(st.d){moved=Date.now();const b=document.getElementById("nbub"),r=b.getBoundingClientRect();try{localStorage.setItem(PK,JSON.stringify({x:r.left/innerWidth,y:r.top/innerHeight}))}catch(_){}placePad()}st=null};
 document.addEventListener("pointerup",end,true);document.addEventListener("pointercancel",end,true)})();
window.addEventListener("resize",()=>{applyPos()});
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;
 if(t.closest("#nbub")){if(Date.now()-moved<350){e.preventDefault();return}const c=ctx();if(!c)return;open=!open;if(open){sub="l";const p=document.getElementById("npad");if(p)p.dataset.k=""}update();if(open){const x=document.getElementById("nbt");if(x)x.focus({preventScroll:true})}e.preventDefault();return}
 const a=t.closest("[data-nb]");if(!a)return;const c=ctx();const k=a.dataset.nb;
 if(k==="x"){open=false;update()}
 if(c&&(k==="sl"||k==="sp")){sub=k==="sp"?"p":"l";update()}},true);
document.addEventListener("input",e=>{if(e.target&&e.target.id==="nbt"){const c=ctx();if(c){setTxt(c,e.target.value);const b=document.getElementById("nbub");if(b)b.classList.toggle("has",has(c))}}},true);
let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(update,80)}).observe(document.body,{childList:true,subtree:true});
update();window.NOTESUI={update,open:()=>{open=true;update()}};
})();
