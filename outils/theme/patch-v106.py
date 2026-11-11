import sys
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# bouton Jeu : centré, label aligné avec les autres
rep(' #gbn .gjeu{flex:1.2}',' #gbn button{flex:1 1 0!important}#gbn .gjeu{flex:1 1 0!important;justify-content:flex-start;padding-top:0;gap:0}')
rep('#gbn .gjeu .gcirc{width:58px;height:58px;margin-top:-28px;','#gbn .gjeu .gcirc{width:56px;height:56px;margin-top:-24px;margin-bottom:3px;')
rep(' #gbn .gjeu .l{color:var(--gold);margin-top:-2px}',' #gbn .gjeu .l{color:var(--gold);margin:0}')
# sélection stricte : uniquement le dossier choisi
rep('const o=l.filter(x=>s.includes(f(x)));return o.length?o:l};','return l.filter(x=>s.includes(f(x)))};')
# dossier choisi mais vide : rien d'autre n'est proposé
rep('p.sel[k]=p.fsel[k]?(window.__mxFolderIds?window.__mxFolderIds(p.fsel[k]):wzIds(k)):[]','p.sel[k]=p.fsel[k]?(window.__mxFolderIds?(window.__mxFolderIds(p.fsel[k]).length?window.__mxFolderIds(p.fsel[k]):["-"]):wzIds(k)):[]')
open(out,'w',encoding='utf8').write(s);print('ok')
