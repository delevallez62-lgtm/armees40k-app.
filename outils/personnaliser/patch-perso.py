import sys,os
src,out=sys.argv[1:3]
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# mascotte : accueil, pied de page, en-tête
rep('<img src="${LOGO}" alt=""><h2>Bienvenue,','<img src="${S.logo||LOGO}" alt=""><h2>Bienvenue,')
rep('<div class="gfoot"><img src="${LOGO}" alt=""></div>','<div class="gfoot"><img src="${S.logo||LOGO}" alt=""></div>')
rep('h1.insertAdjacentHTML("afterbegin",`<img class="glogo" src="${LOGO}" alt="">`);','h1.insertAdjacentHTML("afterbegin",`<img class="glogo" src="${S.logo||LOGO}" alt="">`);else if(h1){const gl=h1.querySelector(".glogo");if(gl&&gl.getAttribute("src")!==(S.logo||LOGO))gl.src=S.logo||LOGO}')
# ligne dans Personnaliser
rep(' <h4>Icônes et images des menus</h4>',' <div class="gxl" style="--tc:#e8a43c">${ic("image")}<b>Mascotte de l\'accueil<br><small class="mu">${S.logo?"Image personnelle":"Image d\'origine"} · aussi dans l\'en-tête</small></b><span class="gthb"><img src="${S.logo||LOGO}" alt="" style="object-fit:contain"></span><span class="bt"><label class="b p" style="cursor:pointer">Changer<input type="file" id="gxlogo" accept="image/*" hidden></label>${S.logo?`<button class="b" data-gx="logodef">Par défaut</button>`:""}</span></div>\n <h4>Icônes et images des menus</h4>')
J=open(d+'/perso.js',encoding='utf8').read();C=open(d+'/perso.css',encoding='utf8').read()
k=s.rindex('</body>')
s=s[:k]+'<style id="percss">\n'+C+'</style>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
