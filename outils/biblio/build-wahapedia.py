#!/usr/bin/env python3
"""Complète la bibliothèque V11 avec l'export de données public de Wahapedia (11e édition) pour Space Marines et Orks :
fiches absentes de BSData, options d'équipement / composition / équipement de base de toutes les fiches, détachements,
stratagèmes et améliorations manquants. Usage : build-wahapedia.py <dossier des CSV> <dossier data/biblio>"""
import sys,os,csv,json,re,html,hashlib,difflib,datetime
CSV,OUT=sys.argv[1],sys.argv[2]
def rd(f):
    p=os.path.join(CSV,f+'.csv')
    if not os.path.exists(p):return []
    txt=open(p,encoding='utf-8-sig',newline='').read().replace('\r\n','\n').split('\n')
    h=txt[0].split('|');n=len(h)-1;rows=[];cur=''
    for ln in txt[1:]:
        cur=(cur+'\n'+ln) if cur else ln
        if cur.count('|')>=n:
            parts=cur.split('|')
            if len(parts)>n+1:parts=parts[:n]+['|'.join(parts[n:])]
            rows.append(dict(zip(h,parts)));cur=''
    return rows
def clean(t):
    t=re.sub(r'<li[^>]*>','\n• ',t or '');t=re.sub(r'</li>|</ul>|</ol>','',t)
    t=html.unescape(re.sub(r'<br\s*/?>','\n',t));t=re.sub(r'</?(b|strong)>','**',t);t=re.sub(r'</?(i|em)>','*',t);t=re.sub(r'<[^>]+>','',t);return re.sub(r'\n{3,}','\n\n',t).strip()
norm=lambda s:re.sub(r'[^a-z0-9]','',re.sub(r'\[.*?\]','',(s or '').lower().replace('’',"'")))
GRP={'ORK':'orks','SM':'space-marines'}
FNAME={'ORK':'Orks','SM':'Space Marines'}
last=(rd('Last_update') or [{'last_update':''}])[0].get('last_update','').strip()
lib={g:json.load(open(os.path.join(OUT,g+'.json'),encoding='utf8')) for g in ('space-marines','orks')}
libnames={g:{norm(u['n']):u for u in lib[g]['units']} for g in lib}
DS={d['id']:d for d in rd('Datasheets') if d['faction_id'] in GRP and not re.match(r'(?i)example',d['name'])}
MODELS={};WG={};AB={};KW={};OPT={};COMP={};LEAD={};LEDBY={}
for m in rd('Datasheets_models'):MODELS.setdefault(m['datasheet_id'],[]).append(m)
for w in rd('Datasheets_wargear'):WG.setdefault(w['datasheet_id'],[]).append(w)
SHARED={a['id']:a for a in rd('Abilities')}
for a in rd('Datasheets_abilities'):AB.setdefault(a['datasheet_id'],[]).append(a)
for k in rd('Datasheets_keywords'):KW.setdefault(k['datasheet_id'],[]).append(k)
for o in rd('Datasheets_options'):OPT.setdefault(o['datasheet_id'],[]).append(o)
for c in rd('Datasheets_unit_composition'):COMP.setdefault(c['datasheet_id'],[]).append(c)
for l in rd('Datasheets_leader'):LEAD.setdefault(l['leader_id'],[]).append(l['attached_id']);LEDBY.setdefault(l['attached_id'],[]).append(l['leader_id'])
def kwsplit(s):
    out=[];cur='';d=0
    for ch in s or '':
        if ch=='[':d+=1
        if ch==']':d-=1
        if ch==',' and d==0:out.append(cur.strip());cur=''
        else:cur+=ch
    if cur.strip():out.append(cur.strip())
    return out
def srt(rows,k='line'):return sorted(rows,key=lambda r:(int(r.get(k) or 0)))
def stat(v):return (v or '').strip()
def unit_of(d):
    mods=srt(MODELS.get(d['id'],[]))
    pr=[]
    for m in mods:
        sv=stat(m['Sv']);inv=stat(m.get('inv_sv'))
        pr.append({'n':m['name'],'M':stat(m['M']),'E':stat(m['T']),'SV':sv,'PV':stat(m['W']),'CD':stat(m['Ld']),'CO':stat(m['OC']),**({'inv':inv} if inv and inv!='-' else {})})
    rw=[];mw=[]
    for w in srt(WG.get(d['id'],[])):
        melee=(w['type'] or '').lower().startswith('melee')
        rng='Melee' if melee else stat(w['range'])
        x={'n':w['name'],'r':rng if rng!='Melee' else 'Melee','a':stat(w['A']),'sk':stat(w['BS_WS']) or '-','s':stat(w['S']),'ap':stat(w['AP']),'d':stat(w['D']),'kw':kwsplit(clean(w['description']))}
        if not melee and x['r'] and not x['r'].endswith('"'):x['r']+='"'
        (mw if melee else rw).append(x)
    ab=[]
    for a in srt(AB.get(d['id'],[])):
        txt=clean(a['description'])
        if not txt and a.get('ability_id') in SHARED:txt=clean(SHARED[a['ability_id']]['description'])
        nm=(a['name'] or (SHARED.get(a.get('ability_id'),{}).get('name','')))+((' '+a['parameter']) if a.get('parameter') and a['parameter'] not in (a['name'] or '') else '')
        if nm:ab.append({'n':nm.strip(),'d':txt,**({'model':a['model']} if a.get('model') else {}),**({'ty':a['type']} if a.get('type') else {})})
    kw=[k['keyword'] for k in KW.get(d['id'],[]) if not k['is_faction_keyword'] in ('true','True','1')]
    fk=[k['keyword'] for k in KW.get(d['id'],[]) if k['is_faction_keyword'] in ('true','True','1')]
    ext={'id':'w-'+d['id'],'role':d['role'],'loadout':clean(d['loadout']),'comp':[clean(c['description']) for c in srt(COMP.get(d['id'],[]))],'opt':[clean(o['description']) for o in srt(OPT.get(d['id'],[]))],
         'transport':clean(d['transport']),'link':d['link']}
    return {'n':d['name'],'kw':kw+fk,'pr':pr,'rw':rw,'mw':mw,'ab':ab,'pts':None,'sz':None},ext
units_new={'orks':[],'space-marines':[]};exts={'orks':{},'space-marines':{}}
byid={}
for d in DS.values():
    g=GRP[d['faction_id']];u,ext=unit_of(d);k=norm(d['name']);byid[d['id']]=(g,d['name'])
    if k in libnames[g]:exts[g][k]={**ext,'n':d['name']}
    else:
        u['id']='w-'+d['id'];u['ids']={FNAME[d['faction_id']]:'w-'+d['id']};u['f']=[FNAME[d['faction_id']]];u['src']='wahapedia';u['wp']=ext
        u['h']=hashlib.sha1(json.dumps(u,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:10];units_new[g].append(u)
for g in exts:
    for k,e in exts[g].items():
        e['leads']=[byid[i][1] for l,i in [(d,i) for d in [next((did for did,(gg,n) in byid.items() if norm(n)==k),None)] for i in LEAD.get(d,[])] if i in byid] if True else []
        e['ledby']=[]
for did,(g,n) in byid.items():
    k=norm(n)
    for lid in LEDBY.get(did,[]):
        if lid in byid and k in exts[g]:exts[g][k].setdefault('ledby',[]).append(byid[lid][1])
# unités nouvelles : qui peuvent-elles mener ?
for g in units_new:
    for u in units_new[g]:
        did=u['id'][2:];u['wp']['leads']=[byid[i][1] for i in LEAD.get(did,[]) if i in byid];u['wp']['ledby']=[byid[i][1] for i in LEDBY.get(did,[]) if i in byid]
# ---------- détachements / stratagèmes / améliorations manquants ----------
def splitdesc(t):
    t=clean(t);o={'when':'','tg':'','fx':'','rs':''}
    m=re.split(r'\*\*(WHEN|TARGET|EFFECT|RESTRICTIONS?):\*\*',t)
    if len(m)>1:
        for i in range(1,len(m)-1,2):
            key={'WHEN':'when','TARGET':'tg','EFFECT':'fx','RESTRICTION':'rs','RESTRICTIONS':'rs'}[m[i]];o[key]=m[i+1].strip()
    else:o['fx']=t
    return o
def similar(a,b):return a==b or difflib.SequenceMatcher(None,a,b).ratio()>=0.86
dets_new={'orks':[],'space-marines':[]};str_new={'orks':[],'space-marines':[]};enh_new={'orks':[],'space-marines':[]}
DET=rd('Detachments');DABI=rd('Detachment_abilities')
for d in DET:
    if d['faction_id'] not in GRP:continue
    g=GRP[d['faction_id']]
    if any(similar(norm(d['name']),norm(x['n'])) for x in lib[g]['detachments']):continue
    abil=[{'name':a['name'],'description':clean(a['description'])} for a in DABI if a['detachment_id']==d['id']]
    dets_new[g].append({'id':'w-'+d['id'],'n':d['name'],'f':FNAME[d['faction_id']],'ab':abil[0] if abil else None,'abx':abil[1:],'pts':int(d['dp']) if (d.get('dp') or '').isdigit() else None,'dp':[x.strip() for x in (d.get('force_disposition') or '').split(',') if x.strip()],'rt':[],'src':'wahapedia'})
for s in rd('Stratagems'):
    if s['faction_id'] not in GRP:continue
    g=GRP[s['faction_id']];dk=norm(s['detachment'])
    if any(norm(x.get('det') or '')==dk and similar(norm(s['name']),norm(x['n'])) for x in lib[g]['stratagems']):continue
    p=splitdesc(s['description'])
    str_new[g].append({'id':'w-'+s['id'],'n':s['name'].title() if s['name'].isupper() else s['name'],'f':FNAME[s['faction_id']],'det':s['detachment'] or None,'t':s['type'],'cp':int(s['cp_cost']) if (s.get('cp_cost') or '').isdigit() else s.get('cp_cost'),'ph':s['phase'],'when':p['when'],'tg':p['tg'],'fx':p['fx'],'rs':p['rs'] or None,'src':'wahapedia'})
for e in rd('Enhancements'):
    if e['faction_id'] not in GRP:continue
    g=GRP[e['faction_id']];dk=norm(e['detachment'])
    if any(norm(x.get('det') or '')==dk and similar(norm(e['name']),norm(x['n'])) for x in lib[g]['enhancements']):continue
    enh_new[g].append({'id':'w-'+e['id'],'n':e['name'],'f':FNAME[e['faction_id']],'det':e['detachment'] or None,'d':clean(e['description']),'pts':int(e['cost']) if (e.get('cost') or '').isdigit() else None,'src':'wahapedia'})
# ---------- écriture ----------
man=json.load(open(os.path.join(OUT,'manifest.json'),encoding='utf8'))
old={c['id']:c['sha1'] for c in man['chunks']}
newchunks=[]
for g in ('space-marines','orks'):
    body={'schema':1,'id':'wp-'+g,'source':'Wahapedia (export de données 11e)','updated':last,'units':sorted(units_new[g],key=lambda x:x['n'].lower()),'ext':exts[g],'detachments':dets_new[g],'enhancements':enh_new[g],'stratagems':str_new[g]}
    raw=json.dumps(body,ensure_ascii=False,separators=(',',':'))
    newchunks.append((body['id'],raw,{k:(len(v) if isinstance(v,(list,dict)) else 0) for k,v in body.items() if k in('units','ext','detachments','enhancements','stratagems')}))
if all(old.get(i)==hashlib.sha1(r.encode()).hexdigest() for i,r,_ in newchunks):
    print('inchangée (Wahapedia)');sys.exit(0)
man['chunks']=[c for c in man['chunks'] if not c['id'].startswith('wp-')]
for i,raw,cnt in newchunks:
    fn=i+'.json';open(os.path.join(OUT,fn),'w',encoding='utf8').write(raw)
    man['chunks'].append({'id':i,'file':fn,'sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':cnt})
base=re.sub(r'\+wp.*$','',man['version']);man['version']=base+'+wp'+(last[:10] or datetime.date.today().isoformat())
man['source']['wahapedia']={'site':'wahapedia.ru (export de données, 11e édition)','last_update':last}
man['generated']=datetime.date.today().isoformat()
open(os.path.join(OUT,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
print('mise à jour Wahapedia',last,json.dumps({i:c for i,_,c in newchunks},ensure_ascii=False))
