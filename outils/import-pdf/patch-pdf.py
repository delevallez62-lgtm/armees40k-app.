import sys
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
# 1. seule la ligne de total est ignorée (et non toute ligne contenant « figurines »)
rep('.filter(s=>s&&!CATS.test(s)&&!/figurines/.test(s))','.filter(s=>s&&!CATS.test(s)&&!/^\\d+\\s*points?\\s*-\\s*\\d+\\s*figurines?\\b/i.test(s)&&!/^\\d+\\s*figurines?$/i.test(s))')
# 2. titres de catégories supplémentaires
rep('|Transports? dédiés?|','|Transports? (?:dédiés?|assignés?)|Transports?|Aéronefs?|Drones?|')
# 3. noms d'armes : « Kombi-karbo - Fling\' » et « Multi-klateur » (le tiret collé n'est recollé qu'avant une minuscule)
rep('const o=f=>n[f].sort((p,q)=>q.y-p.y||p.x-q.x).map(i=>i.s.trim()).join(" ").replace(/\\s+/g," ").replace(/-\\s+(?=[A-ZÀ-Ý])/g,"-");',
    'const o=f=>{const t=n[f].sort((p,q)=>q.y-p.y||p.x-q.x).map(i=>i.s.trim()).join(" ").replace(/\\s+/g," ");return f==="caps"?t.replace(/-\\s+(?=[A-ZÀ-Ý])/g,"-"):t.replace(/(\\S)-\\s+(?=[a-zà-ÿ])/g,"$1-")};')
# 4. première entrée d'une section : colonne du texte repérée sur les lignes suivantes
rep(';let bodyIt=[];if(lbl){if(cbx&&',';if(lbl&&!cbx){let mn=null;for(let q=k+1;q<Math.min(rows.length,k+7);q++){const x0=rows[q].it[0].x;if(x0>f.x+60&&rows[q].it.every(i=>i.x>f.x+60)&&(mn===null||x0<mn))mn=x0}if(mn!==null)cbx=mn}let bodyIt=[];if(lbl){if(cbx&&')
rep('rule:lines.slice(d,end).join(" ").replace(','rule:lines.slice(d,end).join(" ").replace(/^Disposition\\s*:\\s*/,"").replace(')
# 5. nom d'aptitude contenant une virgule (« Makai, Lèv' c'te Bannière ! ») : gardé en un seul nom
rep(' if(o.apt){const sn=new Set();',' if(o.apt){const pa=o.apt.split(",").map(x=>x.trim()).filter(Boolean),LK=(o.text||[]).map(x=>abK(x)),mo=[];for(let i=0;i<pa.length;i++){let b=null;for(let n=Math.min(3,pa.length-i);n>=2;n--){const j=pa.slice(i,i+n).join(", "),k=abK(j);if(k&&LK.some(l=>l===k||l.startsWith(k+" "))){b=[n,j];break}}if(b){mo.push(b[1].replace(/,/g,"\u201a"));i+=b[0]-1}else mo.push(pa[i])}o.apt=mo.join(", ")}\n if(o.apt){const sn=new Set();')
rep('function findH(t,n,pos,strict){let j=pos,first=-1;','function findH(t,n,pos,strict){n=String(n).replace(/\u201a/g,",");let j=pos,first=-1;')
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
