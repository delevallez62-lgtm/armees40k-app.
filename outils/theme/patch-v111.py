import sys
src,mod,out=sys.argv[1:4]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:80]);s=s.replace(a,b)
# catégories de mission accessibles
rep('setDw:p=>{dw=p}','cats:()=>W.missions,setDw:p=>{dw=p}')
# encyclopédie : API pour l'import
rep('window.encGo=goEnc','''window.encGo=goEnc
window.encApi={find(name){const z=x=>nk(x).split(" ").map(w=>w.replace(/[sx]$/,"")).join(""),k=z(name);for(const r of Object.values(rules().all)){if(z(r.n)===k||(r.al||[]).some(a=>z(a)===k))return{id:r.id,n:r.n,def:r.def}}return null},addRule,setRule,commit}''')
# missions : ajout d'éléments dans un dossier (créé si besoin)
rep('window.__mxFolders=()=>','''window.__mxAdd=(kind,item,folderName,img)=>{if(!OR)snap();const F=folders();let f=F.find(x=>x.k===kind&&x.nm===folderName&&!x.hid);if(!f){f={id:uid("f-"),nm:folderName,k:kind,c:(KIND[kind]||KIND.free)[1],own:1};F.push(f)}
 const m=mx(),id=uid(kind==="sec"?"csx-":kind==="pri"?"cms-":"cly-");const it=Object.assign({id,fid:f.id},item);
 if(kind==="sec")m.csx.push(it);else if(kind==="pri"){if(!it.cat){const c=cats()[0];it.cat=c?c.id:""}m.cms.push(it)}else{it.cu=1;m.cly.push(it)}
 if(img){S.mimg=S.mimg||{};S.mimg[id]=img}try{applyMx()}catch(e){}return id};
window.__mxFolders=()=>''')
# lecteur PDF : copie locale d'abord (hors ligne dans l'appli Android)
rep('for(const b of["https://cdnjs.cloudflare.com/ajax/libs/pdf.js/"+PDFV+"/"','for(const b of["lib/pdfjs/","https://cdnjs.cloudflare.com/ajax/libs/pdf.js/"+PDFV+"/"')
m=open(mod,encoding='utf8').read()
k=s.rindex('</body>')
s=s[:k]+m+'\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
