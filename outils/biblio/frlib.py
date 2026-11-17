"""Outils communs de traduction : même empreinte de texte que l'application (biblio.js : hh)."""
import re,json,os,hashlib,unicodedata
def nk(s):
    s=unicodedata.normalize('NFD',s or '');s=''.join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r'[^a-z0-9+]+',' ',s).strip()
def strip_md(t):
    t=re.sub(r'\*\*(.+?)\*\*',r'\1',t or '');t=re.sub(r'\*(.+?)\*',r'\1',t);return t.replace('■','•')
def hh(t):return hashlib.sha1(nk(strip_md(t)).encode()).hexdigest()[:12]
def load_chunks(d):
    man=json.load(open(os.path.join(d,'manifest.json'),encoding='utf8'));ch={}
    for c in man['chunks']:ch[c['id']]=json.load(open(os.path.join(d,c['file']),encoding='utf8'))
    return man,ch
def strings(ch):
    """(clé, texte anglais, genre, priorité) pour tout ce qui s'affiche dans la bibliothèque"""
    out={}
    def add(t,kind,pri):
        t=(t or '').strip()
        if len(t)<2 or not re.search(r'[A-Za-z]',t):return
        k=hh(t)
        if k not in out or pri<out[k][2]:out[k]=(t,kind,pri)
    for cid,c in ch.items():
        if cid=='fr':continue
        for u in c.get('units',[]):
            add(u['n'],'nom d\'unité',1)
            for a in u['ab']:add(a['n'],'nom de capacité',3);add(a['d'],'texte de capacité',6)
            for w in u['rw']+u['mw']:add(w['n'],'nom d\'arme',2)
        for e in c.get('ext',{}).values():
            add(e.get('loadout'),'équipement de base',7)
            for t in e.get('opt',[]):add(t,'option d\'équipement',7)
            for t in e.get('comp',[]):add(t,'composition',7)
        for d in c.get('detachments',[]):
            add(d['n'],'nom de détachement',1)
            if d.get('ab'):add(d['ab']['name'],'nom de capacité',3);add(d['ab']['description'],'règle de détachement',5)
            for x in d.get('abx',[]):add(x['name'],'nom de capacité',3);add(x['description'],'règle de détachement',5)
        for e in c.get('enhancements',[]):add(e['n'],'nom d\'amélioration',2);add(e['d'],'texte d\'amélioration',5)
        for s in c.get('stratagems',[]):
            add(s['n'],'nom de stratagème',2)
            for k in ('when','tg','fx','rs'):add(s.get(k),'stratagème : '+{'when':'quand','tg':'cible','fx':'effet','rs':'restrictions'}[k],5)
        for r in c.get('rules',[]):add(r['n'],'nom de règle',2);add(r['d'],'règle',6)
        for r in c.get('frules',[]):add(r['n'],'nom de règle de faction',2);add(r['d'],'règle de faction',4)
    return out
