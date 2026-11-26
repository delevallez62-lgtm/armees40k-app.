#!/usr/bin/env python3
"""Applique la table « Armes : traductions FR / ENG » fournie par l'utilisateur (PDF) aux noms d'armes de la bibliothèque.
Usage : apply-weapons-doc.py <data/biblio> <paires.json> [--dry]
paires.json = [[section, sens, a, b], ...] extrait du PDF (tableaux Anglais=>Français et Français=>Anglais).
Règles : on n'écrase jamais une traduction déjà confirmée (officielle ou fournie par l'utilisateur) ; les entrées en désaccord entre les deux sens du tableau,
ou ambiguës (même français pour deux anglais différents), sont écartées ; les fautes de frappe évidentes de la source sont signalées « à vérifier »."""
import sys,os,re,json,hashlib,datetime,importlib.util
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
sp=importlib.util.spec_from_file_location('cw',os.path.join(os.path.dirname(os.path.abspath(__file__)),'compose-weapons.py'));cw=importlib.util.module_from_spec(sp);sp.loader.exec_module(cw)
d,pf=sys.argv[1],sys.argv[2];dry='--dry' in sys.argv
P=json.load(open(pf,encoding='utf8'))
en2fr={};fr2en={}
for sec,mode,a,b in P:
    if mode.startswith('Anglais'):en2fr.setdefault(nk(a),[]).append((a,b))
    else:fr2en.setdefault(nk(a),[]).append((b,a))   # (anglais, français)
skipped=[];DOC={}
for k,v in en2fr.items():
    frs={b for a,b in v}
    if len(frs)>1:skipped.append((v[0][0],'plusieurs français'));continue
    DOC[k]=v[0][1]
# recoupement avec le tableau Français=>Anglais : le français doit pointer vers le même anglais
inv={}
for k,fr in DOC.items():inv.setdefault(nk(fr),[]).append(k)
for frk,ks in inv.items():
    if len(ks)>1:
        for k in ks:skipped.append((k,'même français pour plusieurs anglais : '+DOC[k]));DOC.pop(k,None)
for k in list(DOC):
    back=fr2en.get(nk(DOC[k]))
    if back and not any(nk(e)==k for e,f in back):skipped.append((k,'désaccord entre les deux tableaux'));DOC.pop(k)
TYPO=re.compile(r'Instogator|Deatwatch|Phatasm|maitre|troncçon',re.I)
FEM=re.compile(r'^(Mitrailleuse|Arme|Épée|Hache|Lance(?!-)|Carabine|Lame|Grenade|Pince|Masse|Griffes|Faux|Couleuvrine|Arquebuse|Crosse|Charge|Bombe|Nacelle|Catapulte|Serpentine)',re.I)
MODE=cw.MODE
def tr(name):
    n=re.sub(r'^➤\s*','',name).strip()
    m=re.match(r'^(.*?)\s*(?:\s[–—-]\s+|\()\s*([^()–—]+?)\)?$',n)
    base,md=(m.group(1),m.group(2).strip().lower()) if m else (n,None)
    if md is not None and md not in MODE:return None
    k=nk(base);f=DOC.get(k)
    if f is None:
        m2=re.match(r'^(twin|dual)\s+(.+)$',base,re.I)
        if m2 and nk(m2.group(2)) in DOC:
            g=DOC[nk(m2.group(2))];f=g+(" jumelée" if FEM.match(g) else " jumelé")
    if f is None:
        m2=re.match(r'^master-crafted\s+(.+)$',base,re.I)
        if m2 and nk(m2.group(1)) in DOC:f=DOC[nk(m2.group(1))]+" de maître"
    if f is None:return None
    f=f.replace('troncçonneuse','tronçonneuse')  # faute de frappe évidente de la source (signalée « à vérifier »)
    if md is not None:f+=(" – " if '(' not in n else " (")+MODE[md]+("" if '(' not in n else ")")
    return f
if __name__=='__main__':
    man,ch=load_chunks(d);S=strings(ch);fr=ch['fr'];t=fr['tr'];today=datetime.date.today().isoformat()
    n_ok=n_chk=kept=0;miss=0;ex=[]
    for k,(en,kind,p) in S.items():
        if kind!="nom d'arme":continue
        f=tr(en)
        if not f or nk(f)==nk(en):miss+=1;continue
        cur=t.get(k)
        if cur and ((cur.get('ok') is True and cur.get('src')) or str(cur.get('src','')).startswith('liste fournie')):kept+=1;continue
        ok=not TYPO.search(DOC.get(nk(re.sub(r'^➤\s*','',en).split(' - ')[0].split(' – ')[0].split(' (')[0]),'') or f) and not TYPO.search(f)
        if len(ex)<40:ex.append((en,f,ok))
        if not dry:t[k]={'fr':f,'at':today,'ok':ok,'src':"liste fournie par l'utilisateur (Armes : traductions FR / ENG)"}
        n_ok+=ok;n_chk+=(not ok)
    print('traductions confirmées',n_ok,'| à vérifier (faute de frappe probable dans la source)',n_chk,'| déjà confirmées (conservées)',kept,'| armes sans correspondance',miss,'| entrées du tableau écartées',len(skipped))
    for x in skipped[:30]:print('  écarté :',x)
    for x in ex:print('  ',x)
    if dry:sys.exit()
    fr['count']=len(t);raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
    open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
    man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
    man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(t)}})
    open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
    import subprocess;subprocess.run([sys.executable,os.path.join(os.path.dirname(os.path.abspath(__file__)),'bump-version.py'),d])
