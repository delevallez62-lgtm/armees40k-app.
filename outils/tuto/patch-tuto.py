import sys,os
src,out=sys.argv[1:3]
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
J=open(d+'/tuto.js',encoding='utf8').read()
assert '</script>' not in J
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Mode partie tutorielle ===== -->\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
