import sys
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
VIEW=r'''
/* visionneuse plein écran : pincer pour zoomer, glisser pour déplacer, double appui pour agrandir */
(()=>{const st=document.createElement("style");st.textContent="#lyz{position:fixed;inset:0;z-index:95;background:#050607;display:flex;flex-direction:column;color:#eee;touch-action:none}#lyz .lzh{display:flex;align-items:center;gap:8px;padding:8px 10px;padding-top:calc(8px + env(safe-area-inset-top,0px));background:#14161a;border-bottom:1px solid rgba(216,180,94,.4)}#lyz .lzh b{flex:1;min-width:0;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#lyz .lzb{display:flex;gap:6px}#lyz .lzb button{min-width:46px;height:46px;border-radius:12px;border:1px solid rgba(216,180,94,.45);background:#1d2025;color:#f0d58f;font-size:22px;font-weight:700;cursor:pointer;touch-action:manipulation}#lyz .lzs{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}#lyz .lzs img{max-width:100%;max-height:100%;transform-origin:50% 50%;will-change:transform;pointer-events:none;-webkit-user-drag:none}#lyz .lzt{margin:0;padding:6px 10px calc(8px + env(safe-area-inset-bottom,0px));text-align:center;font-size:12px;color:#a89f8b;background:#14161a}";document.head.appendChild(st)})();
window.__zv=(src,alt)=>{const old=document.getElementById("lyz");if(old)old.remove();
 const o=document.createElement("div");o.id="lyz";o.setAttribute("role","dialog");o.setAttribute("aria-label","Layout en grand");
 o.innerHTML='<div class="lzh"><b></b><span class="lzb"><button type="button" data-z="-" aria-label="Dézoomer">−</button><button type="button" data-z="0" aria-label="Réinitialiser">⟲</button><button type="button" data-z="+" aria-label="Zoomer">+</button><button type="button" data-z="x" aria-label="Fermer">✕</button></span></div><div class="lzs"><img alt="" draggable="false"></div><p class="lzt">Pince pour zoomer · glisse pour déplacer · double appui pour agrandir</p>';
 o.querySelector("b").textContent=alt||"Layout";document.body.appendChild(o);
 const stg=o.querySelector(".lzs"),im=stg.querySelector("img");im.src=src;
 let sc=1,tx=0,ty=0;const P=new Map();let pd=0,ps=1,pm=null,lastTap=0;
 const clamp=()=>{sc=Math.max(1,Math.min(8,sc));if(sc===1){tx=ty=0;return}const mx=im.offsetWidth*sc/2,my=im.offsetHeight*sc/2;tx=Math.max(-mx,Math.min(mx,tx));ty=Math.max(-my,Math.min(my,ty))};
 const ap=()=>{clamp();im.style.transform="translate("+tx+"px,"+ty+"px) scale("+sc+")"};
 const zoomAt=(f,cx,cy)=>{const s2=Math.max(1,Math.min(8,sc*f)),k=s2/sc;tx=cx-(cx-tx)*k;ty=cy-(cy-ty)*k;sc=s2;ap()};
 const rel=(x,y)=>{const r=stg.getBoundingClientRect();return[x-r.left-r.width/2,y-r.top-r.height/2]};
 const close=()=>{document.removeEventListener("keydown",key,true);o.remove()};
 const key=e=>{if(e.key==="Escape"){e.stopPropagation();close()}};document.addEventListener("keydown",key,true);
 o.addEventListener("click",e=>{const z=e.target.closest&&e.target.closest("[data-z]");if(!z)return;e.stopPropagation();const v=z.dataset.z;if(v==="x")close();else if(v==="0"){sc=1;ap()}else zoomAt(v==="+"?1.5:1/1.5,0,0)},true);
 stg.addEventListener("pointerdown",e=>{stg.setPointerCapture(e.pointerId);P.set(e.pointerId,[e.clientX,e.clientY]);if(P.size===2){const a=[...P.values()];pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;ps=sc;pm=[(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2]}stg.style.cursor="grabbing"});
 stg.addEventListener("pointermove",e=>{const p=P.get(e.pointerId);if(!p)return;
  if(P.size===1){tx+=e.clientX-p[0];ty+=e.clientY-p[1];P.set(e.pointerId,[e.clientX,e.clientY]);ap()}
  else if(P.size===2){P.set(e.pointerId,[e.clientX,e.clientY]);const a=[...P.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1,m=[(a[0][0]+a[1][0])/2,(a[0][1]+a[1][1])/2],c=rel(m[0],m[1]),k=Math.max(1,Math.min(8,ps*d/pd))/sc;tx=c[0]-(c[0]-tx)*k+(m[0]-pm[0]);ty=c[1]-(c[1]-ty)*k+(m[1]-pm[1]);sc*=k;pm=m;ap()}});
 const up=e=>{const was=P.size===1&&P.has(e.pointerId);P.delete(e.pointerId);stg.style.cursor="grab";
  if(was&&e.type==="pointerup"){const n=Date.now();if(n-lastTap<320){const c=rel(e.clientX,e.clientY);if(sc>1.2){sc=1;ap()}else zoomAt(2.5,c[0],c[1]);lastTap=0}else lastTap=n}};
 stg.addEventListener("pointerup",up);stg.addEventListener("pointercancel",up);
 stg.addEventListener("wheel",e=>{e.preventDefault();const c=rel(e.clientX,e.clientY);zoomAt(e.deltaY<0?1.2:1/1.2,c[0],c[1])},{passive:false});
 ap()};
'''
rep('let tab_,pan;',VIEW+'\nlet tab_,pan;')
rep('if(a==="zoom"){zoom=!zoom;upd();return}','if(a==="zoom"){window.__zv(b.getAttribute("src"),b.getAttribute("alt"));return}')
rep('Touche l\'image pour ${zoom?"réduire":"agrandir"}.','Touche l\'image pour la voir en grand : pince pour zoomer, glisse pour la déplacer.')
open(out,'w',encoding='utf8').write(s);print('ok')
