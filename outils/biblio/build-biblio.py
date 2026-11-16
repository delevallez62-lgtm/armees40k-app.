#!/usr/bin/env python3
"""Construit la bibliothèque V11 (Space Marines + Orks) de HAMMER à partir des données de warhammer-oracle
(elles-mêmes synchronisées chaque jour depuis BSData/wh40k-11e). Ne lance AUCUN code du dépôt source : on lit les fichiers.
Usage : build-biblio.py <dossier src/data d'Oracle> <dossier de sortie> [commit] [date]"""
import sys,os,re,json,hashlib,gzip,base64,collections,datetime
SRC,OUT=sys.argv[1],sys.argv[2]
COMMIT=sys.argv[3] if len(sys.argv)>3 else 'inconnu'
ODATE=sys.argv[4] if len(sys.argv)>4 else ''
def rd(f):return open(os.path.join(SRC,f),encoding='utf8').read()
def jarr(f,name):
    t=rd(f);i=t.index('= [',t.index(name))+2;j=t.rindex(']');return json.loads(t[i:j+1])
def hsh(o,n=12):return hashlib.sha1(json.dumps(o,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:n]
U=jarr('units-11e.ts','UNITS_11E');DT=jarr('detachments-11e.ts','DETACHMENTS_11E');EN=jarr('enhancements-11e.ts','ENHANCEMENTS_11E');SR=jarr('rules-11e.ts','SHARED_RULES_11E')
def grp(f):
    if f=='Orks':return 'orks'
    if re.match(r'Adeptus Astartes',f or ''):return 'space-marines'
    return None
SHORT=lambda f:re.sub(r'^Adeptus Astartes - ','',f)
# ---------- stratagèmes : lecture TypeScript sans l'exécuter ----------
def ts_objects(block):
    out=[];depth=0;cur=[];ins=False;esc=False
    for ch in block:
        if ins:
            cur.append(ch)
            if esc:esc=False
            elif ch=='\\':esc=True
            elif ch=='"':ins=False
            continue
        if ch=='"':ins=True;cur.append(ch);continue
        if ch=='{':
            depth+=1
            if depth==1:cur=[]
        if depth>=1:cur.append(ch)
        if ch=='}':
            depth-=1
            if depth==0:out.append(''.join(cur))
    return out
def ts_to_json(o):
    o=re.sub(r'(?m)^\s*//.*$','',o)
    o=re.sub(r'(?m)^(\s*)([A-Za-z_]\w*):',lambda m:m.group(1)+'"'+m.group(2)+'":',o)
    o=re.sub(r',(\s*[}\]])',r'\1',o)
    return json.loads(o)
st=rd('stratagems.ts');STR=[]
for m in re.finditer(r'(?m)^const ([A-Z_]+)_STRATAGEMS: Stratagem\[\] = \[',st):
    name=m.group(1);start=m.end();end=st.index('\n];',start)
    objs=ts_objects(st[start:end])
    for o in objs:
        try:s=ts_to_json(o)
        except Exception as e:continue
        s['_arr']=name;STR.append(s)
def sgroup(s):
    f=s.get('faction') or ''
    if f=='Orks':return 'orks'
    if f=='Core':return 'common'
    if re.match(r'Space Marines|Adeptus Astartes|Black Templars|Blood Angels|Dark Angels|Space Wolves|Deathwatch|Ultramarines|Imperial Fists|Iron Hands|Raven Guard|Salamanders|White Scars',f):return 'space-marines'
    return None
def num(x):
    m=re.search(r'-?\d+',str(x));return m.group(0) if m else str(x)
def clean(x):return None if x in (None,'N/A') else x
# ---------- unités ----------
def unit_norm(u):
    def w(x,melee):
        d={'n':x['name'],'r':x['range'],'a':x['attacks'],'sk':x.get('weaponSkill' if melee else 'ballisticSkill','-'),'s':x['strength'],'ap':x['armourPenetration'],'d':x['damage'],'kw':x.get('keywords',[])}
        if d['sk'] in ('N/A',None):d['sk']='-'
        return d
    return {'n':u['name'],'kw':u['keywords'],
     'pr':[{'n':p['name'],'M':p['movement'],'E':p['toughness'],'SV':p['save'],'PV':p['wounds'],'CD':p['leadership'],'CO':p['objectiveControl']} for p in u['profiles']],
     'rw':[w(x,False) for x in u['rangedWeapons']],'mw':[w(x,True) for x in u['meleeWeapons']],
     'ab':[{'n':a['name'],'d':a.get('description','')} for a in u['abilities']],
     'pts':u.get('points'),'sz':u.get('unitSize')}
chunks={'space-marines':{'units':{},'detachments':[],'enhancements':[],'stratagems':[]},'orks':{'units':{},'detachments':[],'enhancements':[],'stratagems':[]},'common':{'units':{},'detachments':[],'enhancements':[],'stratagems':[],'rules':[]}}
for u in U:
    g=grp(u['faction'])
    if not g:continue
    nu=unit_norm(u);sig=hsh(nu,16)
    c=chunks[g]['units']
    if sig not in c:c[sig]={**nu,'ids':{},'f':[]}
    c[sig]['ids'][SHORT(u['faction'])]=u['id'];c[sig]['f'].append(SHORT(u['faction']))
units_out={}
for g,c in chunks.items():
    L=[]
    for sig,u in c['units'].items():
        pref='Space Marines' if 'Space Marines' in u['ids'] else sorted(u['ids'])[0]
        u['id']=u['ids'][pref];u['f']=sorted(set(u['f']));u['h']=sig[:10]
        L.append(u)
    # identifiant unique : si deux fiches partagent l'id (impossible en théorie), on suffixe
    seen=collections.Counter()
    for u in L:
        seen[u['id']]+=1
        if seen[u['id']]>1:u['id']+='~'+str(seen[u['id']])
    chunks[g]['units']=sorted(L,key=lambda x:(x['n'].lower(),x['id']))
for d in DT:
    g=grp(d['faction'])
    if g:chunks[g]['detachments'].append({'id':d['id'],'n':d['name'],'f':SHORT(d['faction']),'ab':d.get('ability'),'pts':d.get('detachmentPoints'),'dp':d.get('dispositions',[]),'rt':d.get('restrictionTags',[])})
for e in EN:
    g=grp(e['faction'])
    if g:chunks[g]['enhancements'].append({'id':e['id'],'n':e['name'],'f':SHORT(e['faction']),'det':e.get('detachment'),'d':e.get('description',''),'pts':e.get('points')})
for s in STR:
    g=sgroup(s)
    if not g:continue
    ident=hsh([s.get('faction'),s.get('detachment'),s['name']],12)
    chunks[g]['stratagems'].append({'id':'s-'+ident,'n':s['name'],'f':s.get('faction'),'det':s.get('detachment'),'t':s.get('type'),'cp':s.get('cpCost'),'ph':s.get('phase'),'when':s.get('when'),'tg':s.get('target'),'fx':s.get('effect'),'rs':s.get('restrictions')})
chunks['common']['rules']=[{'n':r['name'],'d':r.get('description','')} for r in SR]
for g in chunks:
    for k in ('detachments','enhancements','stratagems'):chunks[g][k].sort(key=lambda x:(str(x.get('f')),str(x.get('det')),x['n']))
# ---------- sortie ----------
os.makedirs(OUT,exist_ok=True)
today=datetime.date.today().isoformat()
version='11e-%s-%s'%(ODATE or today,COMMIT)
manifest={'schema':1,'game':'wh40k-11e','rules':'V11','version':version,'generated':today,
 'source':{'units':'BSData/wh40k-11e (communauté), via gregario/warhammer-oracle (MIT)','detachments':'BSData/wh40k-11e via warhammer-oracle','stratagems':'warhammer-oracle (saisie manuelle d\'après les Faction Packs)','oracle':{'repo':'gregario/warhammer-oracle','commit':COMMIT,'date':ODATE}},
 'notice':'Données communautaires non officielles. Warhammer 40,000 et ses règles sont la propriété de Games Workshop.','chunks':[]}
for g,c in chunks.items():
    body={'schema':1,'id':g,'version':version,**c}
    raw=json.dumps(body,ensure_ascii=False,separators=(',',':'))
    fn='%s.json'%g
    open(os.path.join(OUT,fn),'w',encoding='utf8').write(raw)
    manifest['chunks'].append({'id':g,'file':fn,'sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{k:len(v) for k,v in c.items()}})
open(os.path.join(OUT,'manifest.json'),'w',encoding='utf8').write(json.dumps(manifest,ensure_ascii=False,indent=1))
print(json.dumps(manifest['chunks'],ensure_ascii=False,indent=1))
