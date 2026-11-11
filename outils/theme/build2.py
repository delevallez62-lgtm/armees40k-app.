import sys,json
src,out=sys.argv[1],sys.argv[2]
logo=open('../logo.b64').read().strip()
g=open('goth.html',encoding='utf8').read()
g=g[:g.index('<script>')]  # CSS du thème uniquement
mod=g+open('goth-js.html',encoding='utf8').read()+open('x40k.html',encoding='utf8').read()
mod=mod.replace('__LOGO__',logo).replace('__LAYOUTS__',json.dumps(json.load(open('layouts.json')),ensure_ascii=False))
s=open(src,encoding='utf8').read()
def r(a,b):
    global s; assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
r('[["lists","Mes listes"],["coll","Collection"],["gm","Parties"],["enc","📖 Règles"],["imp","Importer"]]','[["home","Accueil"],["lists","Mes armées"],["coll","Collection"],["paint","Peinture & Hobby"],["mis","Missions & Layout"],["gm","Parties"],["enc","Règles V11"],["imp","Importer"]]')
r('else if(tab==="gm")h=gmView();','else if(window.XV&&XV[tab])h=XV[tab]();else if(tab==="gm")h=gmView();')
r(',tab="lists",ed=null',',tab="home",ed=null')
r('alt:"Quitter sans sauvegarder",altcb:()=>{gReset();tab="lists"}','alt:"Quitter sans sauvegarder",altcb:()=>{const gi=S.bat&&S.bat.gid,ix=gi?S.games.findIndex(g=>g.id===gi&&!g.fin):-1;if(ix>=0)S.games.splice(ix,1);gReset();tab="home";save()}')
r('altcb:()=>{gReset();openP(id)}','altcb:()=>{const gi=S.bat&&S.bat.gid,ix=gi?S.games.findIndex(g=>g.id===gi&&!g.fin):-1;if(ix>=0)S.games.splice(ix,1);gReset();openP(id)}')
r('const SXD=[','const SXD=window.__sxd=[')
r('const BY={};','const BY=window.__sxby={};')
r('const SM={','const SM=window.__sxsm={')
r('const GR={e:','const GR=window.__sxgr={e:')
r('const MSD=','const MSD=window.__msd=')
i=s.rindex('</body>',0,s.rindex('</html>'))
s=s[:i]+mod+'\n'+s[i:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
