import sys,os
src,out=sys.argv[1:3]
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# 1. import d'une fiche du même nom : les armes s'ajoutent à la fiche existante
rep('''let m=same.find(x=>wsig(x)===wsig(u));
 if(m){u.ref=m.ref;SH.forEach(f=>m[f]=clone(u[f]));m.pts=u.pts}
 else{u.ref=rid();m=S.coll[u.ref]={ref:u.ref,pts:u.pts,nb:0};SH.forEach(f=>m[f]=clone(u[f]));if(same.length){const b=same.find(x=>!x.var)||same[0],bs=new Set(b.weapons.map(w=>w.name.toLowerCase().trim()));m.var=1;m.vd=u.weapons.filter(w=>!bs.has(w.name.toLowerCase().trim())).map(w=>w.name).join(", ")}}''',
'''let m=same[0];
 if(m){u.ref=m.ref;SH.forEach(f=>{if(f!=="weapons")m[f]=clone(u[f])});mergeW(m,u);m.pts=u.pts}
 else{u.ref=rid();m=S.coll[u.ref]={ref:u.ref,pts:u.pts,nb:0};SH.forEach(f=>m[f]=clone(u[f]))}''')
rep('''let m=same.find(y=>wsig(y)===wsig(p));
 if(m&&x.keep&&x.keep.has(p)){SH.forEach(f=>p[f]=clone(m[f]));p.ref=m.ref;return m}
 if(m){if(!(p.text&&p.text.length)&&m.text&&m.text.length)p.text=clone(m.text);if(!p.xab&&m.xab)p.xab=clone(m.xab);p.ref=m.ref;SH.forEach(f=>m[f]=clone(p[f]));if(x.pts!=null)m.pts=x.pts}
 else{p.ref=rid();m=S.coll[p.ref]={ref:p.ref,pts:x.pts||0,nb:x.nb||0,subs:[]};SH.forEach(f=>m[f]=clone(p[f]));if(same.length){const b=same.find(y=>!y.var)||same[0],bs=new Set(b.weapons.map(w=>w.name.toLowerCase().trim()));m.var=1;m.vd=p.weapons.filter(w=>!bs.has(w.name.toLowerCase().trim())).map(w=>w.name).join(", ")}}''',
'''let m=same[0];
 if(m&&x.keep&&x.keep.has(p)){SH.forEach(f=>{if(f!=="weapons")p[f]=clone(m[f])});addMissingW(m,p);p.ref=m.ref;return m}
 if(m){if(!(p.text&&p.text.length)&&m.text&&m.text.length)p.text=clone(m.text);if(!p.xab&&m.xab)p.xab=clone(m.xab);p.ref=m.ref;SH.forEach(f=>{if(f!=="weapons")m[f]=clone(p[f])});mergeW(m,p);if(x.pts!=null)m.pts=x.pts}
 else{p.ref=rid();m=S.coll[p.ref]={ref:p.ref,pts:x.pts||0,nb:x.nb||0,subs:[]};SH.forEach(f=>m[f]=clone(p[f]))}''')
# 2. plus de « variantes » : migration unique
i=s.index('function refreshVar(){');j=s.index('refreshVar();',i)
rep(s[i:j+len('refreshVar();')],'function refreshVar(){}')
# 3. une modification dans une liste ne réécrit pas les armes choisies des autres unités
rep('function sync(u){let m=S.coll[u.ref];if(!m)m=S.coll[u.ref]={ref:u.ref,pts:u.pts||0};if(m!==u)SH.forEach(k=>m[k]=clone(u[k]));S.lists.forEach(l=>l.units.forEach(o=>{if(o!==u&&o.ref===u.ref)SH.forEach(k=>o[k]=clone(u[k]))}));',
 'function sync(u){let m=S.coll[u.ref],fr=false;if(!m){m=S.coll[u.ref]={ref:u.ref,pts:u.pts||0};fr=true}if(m!==u)SH.forEach(k=>{if(fr||k!=="weapons")m[k]=clone(u[k])});S.lists.forEach(l=>l.units.forEach(o=>{if(o!==u&&o.ref===u.ref){SH.forEach(k=>{if(k!=="weapons")o[k]=clone(u[k])});if(m===u)(o.weapons||[]).forEach((w,i)=>{const n=(u.weapons||[]).find(x=>String(x.name).toLowerCase().trim()===String(w.name).toLowerCase().trim());if(n)o.weapons[i]=clone(n)})}}));')
rep('if(s.ref===ref&&s!==src)SH.forEach(k=>s[k]=clone(src[k]))','if(s.ref===ref&&s!==src)SH.forEach(k=>{if(k!=="weapons")s[k]=clone(src[k])})')
rep('if(c&&c!==s)SH.forEach(k=>{if(k!=="name")c[k]=clone(s[k])})','if(c&&c!==s)SH.forEach(k=>{if(k!=="name"&&k!=="weapons")c[k]=clone(s[k])})')
# 4. ajout depuis la collection : choix des armes
rep(' if(a==="dgno"){dlg=null;dgDraw();return}',' if(a&&a.indexOf("wp")===0&&WPK.act(a,d))return;\n if(a==="dgno"){dlg=null;dgDraw();return}')
rep(' else if(a==="pick"&&pk&&pk.lead){const m=S.coll[d.r];',' else if(a==="pick"&&pk&&pk.lead&&WPK.ask(d.r,true)){}\n else if(a==="pick"&&pk&&pk.lead){const m=S.coll[d.r];')
rep(' else if(a==="pick"){const m=S.coll[d.r],c=',' else if(a==="pick"&&WPK.ask(d.r,false)){return}\n else if(a==="pick"){const m=S.coll[d.r],c=')
J=open(d+'/coll.js',encoding='utf8').read();C=open(d+'/coll.css',encoding='utf8').read()
k=s.rindex('</body>')
s=s[:k]+'<style id="wpcss">\n'+C+'</style>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
