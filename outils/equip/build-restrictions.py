#!/usr/bin/env python3
"""Lit les Packs de Faction officiels (Warhammer Community, PDF français) déjà convertis en texte
(pdftotext -layout) et produit des restrictions d'équipement structurées (JSON), hors ligne ensuite.
Aucune IA : uniquement des règles de lecture déterministes. Rien n'est stocké mot pour mot."""
import re,sys,json,os,glob,unicodedata
def nk(s):
    s=unicodedata.normalize('NFD',str(s or ''))
    s=''.join(c for c in s if unicodedata.category(c)!='Mn').lower()
    return re.sub(r'[^a-z0-9]+',' ',s).strip()
NUM={'un':1,'une':1,'deux':2,'trois':3,'quatre':4,'cinq':5,'six':6,'sept':7,'huit':8,'neuf':9,'dix':10}
def num(s):
    s=s.lower()
    return NUM.get(s) if s in NUM else (int(s) if s.isdigit() else None)
HDR=re.compile(r"^[A-ZÉÈÊÀÂÎÔÛÙÇŒ’'\- :()0-9\.,«»]{4,}$")
def pages_of(txt):
    return txt.split('\f')
def datasheets(pagetxt,pageno):
    L=pagetxt.split('\n');out=[]
    for i,l in enumerate(L):
        m=re.search(r"COMPOSITION D’UNITÉ",l)
        if not m:continue
        col=m.start()
        # nom : dernière ligne en majuscules avant, qui précède un en-tête de caractéristiques
        name=''
        for k in range(i-1,max(-1,i-60),-1):
            t=L[k].strip()
            if t and HDR.match(t) and len(t)>=6 and not re.match(r'^(M\s+E\s+SV|ARMES|PORTÉE|APTITUDES)',t) and 'MOTS-CLÉS' not in t:
                name=t;break
        left=[];right=[]
        for l2 in L[i:i+40]:
            if re.search(r'MOTS-CLÉS',l2):break
            if l2.strip()=='' and (left or right) and False:pass
            left.append(l2[:col].rstrip());right.append(l2[col:].strip())
        out.append((name,left,right))
    return out
def join_bullets(lines):
    items=[];cur=None
    for l in lines:
        t=l.strip()
        if not t:continue
        if t.startswith('■'):
            if cur:items.append(cur)
            cur=t.lstrip('■ ').strip()
        elif cur is not None:cur+=' '+t
        else:
            cur=t
    if cur:items.append(cur)
    return items
def clean_w(s):
    s=s.replace('■',' ').replace('  ',' ')
    s=re.sub(r'^(?:\d+|un|une|deux|trois)\s+','',s.strip(),flags=re.I)
    s=re.sub(r'^(?:son|sa|ses|leur|leurs|le|la|les|l’|l\'|du|de la|des|d’|d\')\s*','',s,flags=re.I)
    return s.strip(' .;')
def split_items(s):
    s=s.strip().rstrip('.')
    parts=re.split(r'\s*;\s*|\s+et\s+(?=\d+\s)|\s+et\s+(?=un |une )',s)
    return [clean_w(p) for p in parts if clean_w(p)]
def tos(s):
    s=s.strip().rstrip('.').strip()
    s=re.sub(r'^\d+\s+des choix suivants\s*:?\s*','',s,flags=re.I)
    parts=re.split(r'\s+\|\s+|\s*;\s*|\s+et\s+(?=\d+\s)|\s+et\s+(?=(?:un|une)\s)|\s+ou\s+(?=\d+\s)|\s+ou\s+(?=(?:un|une)\s)',s)
    return [clean_w(p) for p in parts if clean_w(p)]
NS=r"(\d+|un|une|deux|trois|quatre|cinq|six)"
def parse_item(t):
    t=t.replace('*','').strip()
    if re.match(r'^Aucune',t,re.I):return 'none',None
    t=re.sub(r'\s*◦\s*',' | ',t)
    t=re.sub(r"^Si cette unité contient (\d+) figurines?\s*:\s*",'',t,flags=re.I)
    cond=None
    # unité attachée / ordres : informations de règles, pas d'équipement
    t=re.split(r'\s(?:UNITÉ ATTACHÉE|ORDRES|AUTRES OPTIONS)\b',t)[0].strip()
    per=None
    m=re.match(r"^Par tranche de (\d+) figurines?(?: dans l[’']unité| de cette unité)?,\s*(.*)$",t,re.I)
    if m:per=int(m.group(1));t=m.group(2)
    # sujet
    subj=re.match(r"^(?:(?:Jusqu[’']à\s+)?"+NS+r"|Chaque figurine(?: \([^)]*\))?|Toutes? les figurines de cette unité)\s*(?:figurines?)?\s*(?:(?:de|d[’'])\s+[^,]*?)?\s*peu(?:t|vent)(?: chacune)?\s+(.*)$",t,re.I)
    if subj:
        n=num(subj.group(1)) if subj.group(1) else None;rest=subj.group(2);who='any'
        if re.match(r'^(Chaque|Toutes)',t,re.I):who='all'
        return build(rest,who,n,per,None)
    m=re.match(r"^"+NS+r"\s+(.+?)\s+qui n[’']est pas équipée?\s+d(?:e|[’'])\s*(.+?)\s+peut être équipée?\s+de\s+(.+)$",t,re.I)
    if m:
        n=num(m.group(1));return [{'t':'add','who':'any','to':tos(m.group(4)),'n':n,'not':[clean_w(m.group(3))]}],None
    m=re.match(r"^(?:Cette figurine|Le |La |Cet |Cette )\s*(.*?)\s*peut\s+(.*)$",t,re.I)
    if m:return build(m.group(2),'role',1,None,(m.group(1) or '').strip().lower() or 'cette figurine')
    m=re.match(r"^(?:Le |La |Les |L[’'])?(.+?) de cette figurine peut être remplacée? par (.+)$",t,re.I)
    if m:return [{'t':'repl','who':'role','role':'cette figurine','from':[clean_w(m.group(1))],'to':tos(m.group(2)),'n':1}],None
    return None,t
def build(rest,who,n,per,role):
    m=re.match(r"^remplacer (?:leur|leurs|son|sa|ses)?\s*(.+?) par (.+)$",rest,re.I)
    if m:
        fr=[clean_w(x) for x in re.split(r'\s+ou\s+|\s+et\s+(?=(?:leur|son|sa)\s)',m.group(1))]
        return [{'t':'repl','who':who,'role':role,'from':fr,'to':tos(m.group(2)),'n':n,'per':per}],None
    m=re.match(r"^(?:être équipée?s?\s+(?:de|d[’'])|avoir)\s*(.+)$",rest,re.I)
    if m:return [{'t':'add','who':who,'role':role,'to':tos(m.group(1)),'n':n,'per':per}],None
    return None,rest
def parse_options(items,unit):
    rules=[];unk=[];none=False
    for it in items:
        r,u=parse_item(it)
        if r=='none':none=True
        elif r:rules.extend(r)
        else:unk.append(u[:160])
    return rules,unk,none
def parse_comp(lines):
    items=join_bullets(lines[1:])
    comp=[];equip=[]
    for it in items:
        m=re.match(r"^(?:Chaque figurine|Cette figurine|Le |La |Les |L’|L')?\s*(.*?)est équipée? de ?:?\s*(.+)$",it,re.I)
        if re.search(r'est équipée? de',it,re.I):
            m=re.search(r"^(.*?)(?:Chaque figurine|Cette figurine|[Ll]e |[Ll]a |[Ll]es )?(?:[^:]*?)est équipée? de ?:\s*(.+)$",it)
            e=it.split(':',1)[1] if ':' in it else ''
            head=it.split('est équipé')[0]
            who='all' if re.search(r'Chaque figurine|Toutes',head) else 'unit'
            equip.append({'who':who,'role':clean_w(re.sub(r'^(?:Le|La|Les)\s+','',head.strip(),flags=re.I)).lower() if who=='unit' else '','w':[x.strip(' .') for x in re.split(r'\s*;\s*',e.rstrip('.')) if x.strip(' .')]})
            # si la ligne commençait par une composition ("■ 5 X Chaque figurine est équipée…")
            pre=re.match(r"^(\d+(?:\s*[-–]\s*\d+)?)\s+(.+?)\s+(?=Chaque figurine|Cette figurine)",it)
            if pre:
                a=re.match(r'^(\d+)(?:\s*[-–]\s*(\d+))?$',pre.group(1));comp.append({'min':int(a.group(1)),'max':int(a.group(2) or a.group(1)),'name':pre.group(2).strip()})
            continue
        m=re.match(r"^(\d+)(?:\s*[-–]\s*(\d+))?\s+(.+)$",it)
        if m:comp.append({'min':int(m.group(1)),'max':int(m.group(2) or m.group(1)),'name':m.group(3).strip()})
    return comp,equip
def main(txtdir,outp,src):
    data={}
    for f in sorted(glob.glob(txtdir+'/*.txt')):
        base=os.path.basename(f)[:-4]
        meta=src.get(base,{})
        txt=open(f,encoding='utf8',errors='ignore').read()
        txt=re.sub(r'[\x00-\x08\x0b\x0e-\x1f\u00ad]','',txt)
        for pn,pg in enumerate(pages_of(txt),1):
            for name,left,right in datasheets(pg,pn):
                if not name:continue
                opts=join_bullets([l for l in left[1:] if True]) if re.search(r"OPTIONS D’ÉQUIPEMENT",left[0]) else []
                rules,unk,none=parse_options(opts,name)
                comp,equip=parse_comp(right)
                k=nk(name)
                e=data.setdefault(k,{'n':name.title(),'fac':meta.get('fac',''),'src':{'doc':meta.get('doc',''),'file':meta.get('file',''),'date':meta.get('date',''),'ver':'V11','p':pn},'comp':comp,'def':equip,'opt':rules,'raw_unparsed':unk,'has_options':bool(opts),'none':none})
    json.dump(data,open(outp,'w',encoding='utf8'),ensure_ascii=False,indent=1)
    return data

def emit(d,outdir):
    units={};srcs={}
    for k,v in d.items():
        sk=v['src']['file'];srcs[sk]={'doc':v['src']['doc'],'date':v['src']['date'],'file':sk}
        ent={'n':v['n'],'fac':v['fac'],'doc':sk,'p':v['src']['p'],'none':bool(v.get('none')) or not v.get('has_options'),'x':len(v['raw_unparsed']),'opt':v['opt']}
        if v['comp']:ent['comp']=[[c['min'],c['max']] for c in v['comp']][:4]
        de=[]
        for e in v['def']:de+=e['w']
        ent['def']=sorted(set(x.lower() for x in de))
        ws=set(ent['def'])
        for r in v['opt']:
            for x in r.get('from',[])+r.get('to',[]):ws.add(x.lower())
        ent['w']=sorted(ws)
        for r in ent['opt']:
            for key in [k2 for k2,val in r.items() if val is None]:r.pop(key)
        units[k]=ent
    out={'meta':{'ver':'V11','note':"Restrictions lues dans les Packs de Faction officiels (Warhammer Community, PDF français). Lecture automatique, aucun texte officiel recopié.",'sources':list(srcs.values())},'units':units}
    js=json.dumps(out,ensure_ascii=False,separators=(',',':'))
    os.makedirs(outdir,exist_ok=True)
    open(outdir+'/eq-official.json','w',encoding='utf8').write(js)
    open(outdir+'/eq-data.js','w',encoding='utf8').write('window.EQ_DATA='+js+';\n')
    return len(units),len(js)

if __name__=='__main__':
    meta=json.load(open(sys.argv[3])) if len(sys.argv)>3 else {}
    d=main(sys.argv[1],sys.argv[2],meta)
    print('émis :',emit(d,os.path.join(os.path.dirname(os.path.abspath(__file__)),'data')))
    n=len(d);o=sum(1 for v in d.values() if v['has_options']);ok=sum(1 for v in d.values() if v['has_options'] and v['opt']);unk=sum(len(v['raw_unparsed']) for v in d.values())
    print(n,'fiches,',o,'avec options,',ok,'lues,',unk,'phrases non lues')
