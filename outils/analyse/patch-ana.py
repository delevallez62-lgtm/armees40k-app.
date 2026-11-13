import sys
src,eng,ui,out=sys.argv[1:5]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:80]);s=s.replace(a,b)
# icône + rubrique
rep("trash:'<path d=\"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13\"/>'};","trash:'<path d=\"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13\"/>',chart:'<path d=\"M4 20V9M10 20V4M16 20v-8M22 20H2\"/><circle cx=\"4\" cy=\"6\" r=\"1.6\"/><circle cx=\"16\" cy=\"8\" r=\"1.6\"/>'};")
rep('mis:["map","Missions & Layout","#4aa3ff"],','mis:["map","Missions & Layout","#4aa3ff"],ana:["chart","Analyse & Simulation","#5fd0c0"],')
# navigation bureau
rep('["mis","Missions & Layout"],["gm","Parties"]','["mis","Missions & Layout"],["ana","Analyse & Simulation"],["gm","Parties"]')
# tuile d'accueil
rep('["tab","mis","mis",SEC.mis[1],"Secondaires, primaires et layouts",""],','["tab","mis","mis",SEC.mis[1],"Secondaires, primaires et layouts",""],["tab","ana","ana",SEC.ana[1],"Comparer, simuler, estimer tes chances",""],')
# feuille « Plus » du téléphone
rep('["enc","Règles V11","enc"],["imp","Importer","imp"]]','["ana","Analyse & Simulation","ana"],["enc","Règles V11","enc"],["imp","Importer","imp"]]')
E=open(eng,encoding='utf8').read();U=open(ui,encoding='utf8').read()
for t in (E,U):
    assert '�' not in t
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Analyse & Simulation (moteur + interface), 100 % local ===== -->\n<script>\n'+E+'\n</script>\n<script>\n'+U+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
