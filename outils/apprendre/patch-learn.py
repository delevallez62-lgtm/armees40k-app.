import sys,os
src,out=sys.argv[1:3]
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
rep('ana:["chart","Centre de commandement","#5fd0c0"],','ana:["chart","Centre de commandement","#5fd0c0"],learn:["book","Apprendre à jouer","#f0b429"],')
rep('["ana","Centre de commandement"],["enc","Règles V11"],["imp","Importer"]','["ana","Centre de commandement"],["learn","Apprendre à jouer"],["enc","Règles V11"],["imp","Importer"]')
rep('["tab","ana","ana",SEC.ana[1],"Parties, analyses, simulations et conseils",pk(3)],','["tab","ana","ana",SEC.ana[1],"Parties, analyses, simulations et conseils",pk(3)],["tab","learn","learn",SEC.learn[1],"Les bases pour ta première partie",""],')
rep('["ana","Centre de commandement","ana"],["enc","Règles V11","enc"]','["ana","Centre de commandement","ana"],["learn","Apprendre à jouer","learn"],["enc","Règles V11","enc"]')
J=open(d+'/learn.js',encoding='utf8').read()+'\n'+open(d+'/course.js',encoding='utf8').read();C=open(d+'/learn.css',encoding='utf8').read()
assert '�' not in J+C
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Apprendre à jouer ===== -->\n<style id="lrcss">\n'+C+'</style>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
