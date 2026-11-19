import sys,difflib
live=open(sys.argv[1],encoding='utf8').read().split('\n')
src=open(sys.argv[2],encoding='utf8').read().split('\n')
base=open(sys.argv[3],encoding='utf8').read().split('\n')   # version sur laquelle l'autre session s'est appuyée (124)
out=sys.argv[4]
# 1) lignes modifiées par l'autre session : opérations d'insertion mot-à-mot (contexte avant)
def inserts(a,b):
    r=[]
    for t,x1,x2,y1,y2 in difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes():
        if t=='equal':continue
        assert t=='insert',(t,a[x1:x2][:50])
        r.append((x1,b[y1:y2]))
    return r
def apply(a,ins):
    s=a
    for x,t in sorted(ins,reverse=True):s=s[:x]+t+s[x:]
    return s
# lignes changées
sm=difflib.SequenceMatcher(None,base,live,autojunk=False)
ops=[(i1,i2,j1,j2) for t,i1,i2,j1,j2 in sm.get_opcodes() if t!='equal']
res=list(src)
def find(line):return [k for k,x in enumerate(res) if x==line]
import json
changes=[]
for i1,i2,j1,j2 in ops:
    if i1==i2==0:continue                     # enveloppe de l'artefact
    if i2-i1==1 and j2-j1==1:                  # une ligne modifiée par insertions
        a,b=base[i1],live[j1];ins=inserts(a,b)
        # contexte : texte juste avant chaque insertion
        changes.append(('line',a,[(a[max(0,x-70):x],a[x:x+70],t) for x,t in ins]))
    elif i1==i2:                               # bloc inséré
        changes.append(('block',i1,live[j1:j2]))
    else:raise SystemExit('opération inattendue '+str((i1,i2,j1,j2)))
for ch in changes:
    if ch[0]=='line':
        a=ch[1];ks=[k for k,x in enumerate(res) if x==a]
        if len(ks)!=1:
            # la ligne a été modifiée aussi chez moi : on retrouve la ligne par son début
            ks=[k for k,x in enumerate(res) if x[:120]==a[:120]]
        assert len(ks)==1,('ligne introuvable',a[:80],len(ks))
        k=ks[0];s=res[k]
        for before,after,t in ch[2]:
            pos=s.find(before+after)
            assert pos>=0 and s.count(before+after)==1,('contexte introuvable',before[-40:],after[:30])
            p=pos+len(before);s=s[:p]+t+s[p:]
        res[k]=s
    else:
        i1,blk=ch[1],ch[2]
        # position : juste avant la dernière ligne du fichier source
        assert base[i1-1]==res[-2] or True
        res=res+blk if i1>=len(base) else res[:-1]+blk+res[-1:]
open(out,'w',encoding='utf8').write('\n'.join(res))
print('fusion OK :',len(changes),'changements appliqués')
