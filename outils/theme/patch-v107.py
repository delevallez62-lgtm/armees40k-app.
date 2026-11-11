import sys
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# ---- bouton Jeu : position réglable (défaut : dans la barre)
rep('#gbn .gjeu .gcirc{width:56px;height:56px;margin-top:-24px;margin-bottom:3px;','#gbn .gjeu .gcirc{width:42px;height:42px;margin:0 0 3px;')
rep(' #gbn .gjeu .l{color:var(--gold);margin:0}',' #gbn .gjeu .l{color:var(--gold);margin:0}\n #gbn.gv-in .gjeu .gcirc .gi,#gbn.gv-in .gjeu .gcirc .gi svg{width:24px;height:24px}\n #gbn.gv-mid .gjeu .gcirc{width:52px;height:52px;margin-top:-12px}\n #gbn.gv-up .gjeu .gcirc{width:58px;height:58px;margin-top:-26px}')
rep('function upd(){ensure();\n const bar=','function gnav(){const o=NAV.filter(n=>n[0]!=="jeu"),j=NAV.find(n=>n[0]==="jeu"),h=(S&&S.gjh)||"c";o.splice(h==="l"?0:h==="r"?4:2,0,j);return o}\nfunction upd(){ensure();\n const bar=')
rep('document.getElementById("gbn").innerHTML=NAV.map(','document.getElementById("gbn").className="gv-"+((S&&S.gjv)||"in");document.getElementById("gbn").innerHTML=gnav().map(')
rep(' <h4>Icônes et images des menus</h4>',''' <div class="gxl" style="--tc:#d8b45e">${ic("dice")}<b>Bouton Jeu (barre du bas)<br><small class="mu">Hauteur et place du gros bouton rond</small></b></div>
 <div class="gxf" style="justify-content:flex-start;flex-wrap:wrap"><span class="mu" style="align-self:center">Hauteur</span>${[["in","Dans la barre"],["mid","Mi-hauteur"],["up","Surélevé"]].map(([v,n])=>`<button class="b${(S.gjv||"in")===v?" p":""}" data-gx="gjb" data-k="gjv" data-v="${v}">${n}</button>`).join("")}</div>
 <div class="gxf" style="justify-content:flex-start;flex-wrap:wrap"><span class="mu" style="align-self:center">Place</span>${[["l","Gauche"],["c","Centre"],["r","Droite"]].map(([v,n])=>`<button class="b${(S.gjh||"c")===v?" p":""}" data-gx="gjb" data-k="gjh" data-v="${v}">${n}</button>`).join("")}</div>
 <h4>Icônes et images des menus</h4>''')
rep(' if(a==="start"){',' if(a==="gjb"){S[b.dataset.k]=b.dataset.v;try{save()}catch(_){}try{window.tbPost&&window.tbPost()}catch(_){}icList();return}\n if(a==="start"){')
# ---- tiroirs : tous fermés par défaut (seule la recherche déplie)
rep('data-pd="${window.eqDef?1:0}"${(window.eqDef?!pop.has(k):pop.has(k))?" open":""}','data-pd="0"${pop.has(k)?" open":""}')
rep('df=dflt?1:0,','df=0,')
rep('const open=df?!pop.has(k):pop.has(k);','const open=pop.has(k);')
rep('k=pre+n,df=true;','k=pre+n,df=false;')
rep('(x.open==null?true:x.open)','x.open')
rep('let dw=0;','let dw=-1;')
rep('dw=0;msSync()','dw=-1;msSync()')
rep('const dd=(k,df)=>{df=!!df;','const dd=(k,df)=>{df=false;')
rep('mOpen[f.id]=1;if(cur.kd','if(cur.kd')
# ---- sélection stricte : jamais de repli sur les autres dossiers
rep('(window.__mxFolderIds(p.fsel[k]).length?window.__mxFolderIds(p.fsel[k]):["-"])','(window.__mxFolderIds(p.fsel[k]).length?window.__mxFolderIds(p.fsel[k]):["-"])')
rep('p.sel[k]=p.fsel[k]?(window.__mxFolderIds?','p.sel[k]=!p.fsel[k]?["-"]:(window.__mxFolderIds?')
rep('wzIds(k)):[]})','wzIds(k))})')
rep('Touche un dossier déjà choisi pour ne rien restreindre.','Sans dossier choisi, rien n’est proposé pour cette catégorie.')
rep('const autoM=(me,op)=>{const i=ORD.indexOf(op),l=mIn(me);return me&&op&&i>=0&&l[i]?l[i].id:""};','const autoM=(me,op)=>{const i=ORD.indexOf(op),l=mIn(me);if(!(me&&op&&i>=0&&l[i]))return"";const id=l[i].id;return!window.gSel||!window.gSel("pri")||window.gSel("pri").includes(id)?id:""};')
rep('+SXD.filter(d=>d.g===g).map(d=>{\n  const c=cs[d.id],k=pl+":"+d.id,op=catOpenSet.has(k);','+SXD.filter(d=>d.g===g&&(!window.okSx||window.okSx(d.id))).map(d=>{\n  const c=cs[d.id],k=pl+":"+d.id,op=catOpenSet.has(k);')
open(out,'w',encoding='utf8').write(s);print('ok')
