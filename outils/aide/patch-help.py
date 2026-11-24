import sys,os
src,out=sys.argv[1:3]
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
J=open(d+'/help.js',encoding='utf8').read()+'\n'+open(d+'/compact.js',encoding='utf8').read()
assert '�' not in J
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Tuto intégré à chaque onglet ===== -->\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
