import sys,re
src,mod,out=sys.argv[1:4]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)

# --- dossiers disponibles pour l'assistant (côté Missions & Layout)
rep('window.__mxLay=()=>','window.__mxFolders=()=>folders().filter(f=>!f.hid).map(f=>({id:f.id,nm:f.nm,k:f.k,c:f.c,n:count(f)}));\nwindow.__mxLay=()=>')

# --- assistant : 3 étapes (Joueur 1, Joueur 2, Dossiers)
rep('WZN=["Joueur 1","Joueur 2","Primaires","Secondaires","Layouts"]','WZN=["Joueur 1","Joueur 2","Dossiers"]')
rep('last=wz===5,','last=wz>=3,')
rep('else body=wzBody(wz-2);','else body=wzFolders();')
i=s.index('function wzEnter(){');j=s.index('function wzList(k){')
new='''const WZF={pri:["🎯","Missions primaires","#e0563f","mission"],sec:["⚡","Cartes secondaires","#ff7a45","carte"],lay:["🗺","Layouts de terrain","#4aa3ff","layout"]};
function wzFolds(k){try{return(window.__mxFolders?window.__mxFolders():[]).filter(f=>f.k===k)}catch(e){return[]}}
function wzIds(k){return wzData(k).flatMap(g=>g.it.map(x=>x.id))}
function wzFSel(){const p=P();p.sel=p.sel||{pri:[],sec:[],lay:[]};p.fsel=p.fsel||{};WZK.forEach(k=>{p.sel[k]=p.fsel[k]?wzIds(k):[]})}
function wzEnter(){const p=P();if((p.wz||1)<3)return;if(!p.fsel){p.fsel={};WZK.forEach(k=>{const f=wzFolds(k)[0];if(f)p.fsel[k]=f.id})}wzFSel()}
function wzFolders(){const p=P();wzEnter();const f=p.fsel||{},lp=window.__lay&&window.__lay.LP[window.__lay.key(eff1(),p.m2)]||null;
 const card=(k,fo)=>{const m=WZF[k],on=f[k]===fo.id;return`<button type="button" class="wzf2${on?" on":""}" style="--c:${esc(fo.c||m[2])}" data-gp="wfold" data-k="${k}" data-id="${esc(fo.id)}" aria-pressed="${on}"><span class="ic">${m[0]}</span><span class="tx"><b>${esc(fo.nm)}</b><small>${fo.n} ${m[3]}${fo.n>1?"s":""}</small></span><span class="rd"></span></button>`};
 return`<p class="gnote wzt">Choisis le dossier à utiliser pour chaque catégorie. Un appui le choisit en entier, sans l’ouvrir.</p>`+WZK.map(k=>{const m=WZF[k],fs=wzFolds(k);return`<div class="gps"><div class="gph">${m[1]}</div>${fs.length?fs.map(fo=>card(k,fo)).join(""):`<p class="gnote">Aucun dossier. Crées-en un dans Missions &amp; Layout.</p>`}${k==="lay"&&f.lay?`<p class="gnote">🎲 Un layout est tiré au hasard parmi les 3 qui correspondent à vos missions${lp?" (agencements "+["A","B","C"].filter(l=>lp[l]).join(", ")+")":""}.</p>`:""}</div>`}).join("")+`<p class="gnote">Touche un dossier déjà choisi pour ne rien restreindre.</p>`}
'''
s=s[:i]+new+s[j:]
rep(' else if(a==="wtog"){',' else if(a==="wfold"){const k=b.dataset.k,id=b.dataset.id;p.fsel=p.fsel||{};if(p.fsel[k]===id)delete p.fsel[k];else p.fsel[k]=id;wzFSel();sv();gpDraw()}\n else if(a==="wtog"){')
rep('open=true;p.wz=1;p.sel=null;p.si=null;p.wq="";gpDraw()}','open=true;p.wz=1;p.sel=null;p.si=null;p.fsel=null;p.wq="";gpDraw()}')
rep('p.sel=null;p.si=null;p.wz=1;p.m1="";','p.sel=null;p.si=null;p.fsel=null;p.wz=1;p.m1="";')

# --- module mobile
m=open(mod,encoding='utf8').read()
k=s.rindex('</body>')
s=s[:k]+m+'\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
