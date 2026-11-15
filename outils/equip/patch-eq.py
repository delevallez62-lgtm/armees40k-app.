import sys
src,out=sys.argv[1:3]
d=sys.path[0] if False else __import__('os').path.dirname(__import__('os').path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# 1. la collection n'affiche que les fiches de référence
rep('const items=()=>Object.values(S.coll).map(u=>','const items=()=>Object.values(S.coll).filter(m=>!(m.mrg&&S.coll[m.mrg])).map(u=>')
rep('const aopts=u=>{const a=Object.values(S.coll).filter(m=>m.ref!==u.ref)','const aopts=u=>{const a=Object.values(S.coll).filter(m=>m.ref!==u.ref&&!(m.mrg&&S.coll[m.mrg]))')
# 2. exemplaires : toutes les variantes du groupe
rep('n=S.lists.reduce((s,l)=>s+l.units.filter(x=>x.ref===u.ref).length,0),ph=pimg(u);','n=S.lists.reduce((s,l)=>s+l.units.filter(x=>(window.EQ?EQ.groupRefs(S,u.ref):[u.ref]).includes(x.ref)).length,0),ph=pimg(u);')
# 3. ajout manuel d'une unité : choix de l'équipement
rep('n.subs=[];n.man=1;L.units.push(n);save();$("#pr").innerHTML=pkRes();return}','n.subs=[];n.man=1;L.units.push(n);save();try{window.EQUI&&EQUI.manualAdd(n,m)}catch(_){}$("#pr").innerHTML=pkRes();return}')
# 4. un nouvel import n'ouvre plus de « variante » : regroupement dans la fiche de référence
rep(' if(x.role)m.role=x.role;const f=facFn(p);if(f)m.fac=f;return m}',' if(x.role)m.role=x.role;const f=facFn(p);if(f)m.fac=f;try{window.EQ&&!S.eqoff&&EQ.regroup(S)}catch(_){}return m}')
E=open(d+'/eq-engine.js',encoding='utf8').read();U=open(d+'/eq-ui.js',encoding='utf8').read();C=open(d+'/eq.css',encoding='utf8').read()
for t in (E,U,C):assert '�' not in t
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Équipements, restrictions et validation (100 % local) ===== -->\n<style id="eqcss">\n'+C+'</style>\n<script>\n'+E+'\n</script>\n<script>\n'+U+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
