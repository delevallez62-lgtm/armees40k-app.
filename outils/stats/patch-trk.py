import sys
src,eng,ui,css,out=sys.argv[1:6]
s=open(src,encoding='utf8').read()
E=open(eng,encoding='utf8').read();U=open(ui,encoding='utf8').read();C=open(css,encoding='utf8').read()
for t in (E,U,C):assert '�' not in t
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Suivi des dégâts + statistiques de parties (100 % local) ===== -->\n<style id="trkcss">\n'+C+'</style>\n<script>\n'+E+'\n</script>\n<script>\n'+U+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
