#!/usr/bin/env python3
"""Propose (ok:false = « à vérifier ») des noms français d'armes composés à partir d'un glossaire d'éléments connus.
Jamais d'écrasement : une entrée existante (officielle, fournie par l'utilisateur ou déjà proposée) est conservée.
Une arme n'est proposée que si TOUS ses mots sont couverts par le glossaire (sinon elle reste en anglais).
Usage : compose-weapons.py <data/biblio> [--dry]"""
import sys,os,re,json,hashlib,datetime
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
# nom complet (en minuscules) -> français
FULL={"bolt pistol":"Pistolet bolter","boltgun":"Bolter","bolt rifle":"Fusil bolter","heavy bolter":"Bolter lourd","storm bolter":"Bolter d'assaut","combi-bolter":"Bolter combiné","combi-weapon":"Arme combinée","meltagun":"Fuseur","melta gun":"Fuseur","multi-melta":"Multi-fuseur","flamer":"Lance-flammes","heavy flamer":"Lance-flammes lourd","hand flamer":"Lance-flammes à main","incinerator":"Incinérateur","lascannon":"Canon laser","laspistol":"Pistolet laser","lasgun":"Fusil laser","autocannon":"Autocanon","assault cannon":"Canon d'assaut","plasma gun":"Fusil à plasma","plasma pistol":"Pistolet à plasma","plasma cannon":"Canon à plasma","missile launcher":"Lance-missiles","grenade launcher":"Lance-grenades","krak grenade":"Grenade antichar","frag grenade":"Grenade à fragmentation","power fist":"Poing énergétique","power weapon":"Arme énergétique","power sword":"Épée énergétique","power axe":"Hache énergétique","power maul":"Maillet énergétique","power klaw":"Pince énergétique","chainsword":"Épée tronçonneuse","chainfist":"Poing tronçonneur","chain axe":"Hache tronçonneuse","thunder hammer":"Marteau tonnerre","lightning claw":"Griffes éclair","lightning claws":"Griffes éclair","close combat weapon":"Arme de corps à corps","combat knife":"Couteau de combat","force weapon":"Arme de force","relic blade":"Lame relique","storm shield":"Bouclier tempête","heavy stubber":"Mitrailleuse lourde","stubber":"Mitrailleuse","hunter-killer missile":"Missile Hunter-killer","armoured tracks":"Chenilles blindées","armoured hull":"Coque blindée","wraithbone hull":"Coque en os de spectre","titanic feet":"Pieds titanesques","autopistol":"Autopistolet","shuriken pistol":"Pistolet shuriken","shuriken cannon":"Canon shuriken","shuriken catapult":"Catapulte shuriken","scatter laser":"Laser à dispersion","havoc launcher":"Lanceur Havoc","chainfists":"Poings tronçonneurs","bolt carbine":"Carabine bolter","heavy bolt pistol":"Pistolet bolter lourd","accursed weapon":"Arme maudite","slugga":"Slugga","shoota":"Choppa","choppa":"Choppa","big shoota":"Big shoota","kustom mega-blasta":"Kustom mega-blasta","rokkit launcha":"Rokkit launcha"}
for k in ("shoota","slugga","choppa","big shoota","kustom mega-blasta","rokkit launcha"):FULL[k]={"shoota":"Shoota","slugga":"Slugga","choppa":"Choppa","big shoota":"Big shoota","kustom mega-blasta":"Kustom mega-blasta","rokkit launcha":"Rokkit launcha"}[k]  # noms d'Orks : conservés
MODE={"standard":"standard","supercharge":"surcharge","frag":"fragmentation","krak":"antichar","blast":"explosion","sweep":"balayage","strike":"frappe","overcharge":"surcharge","overcharged":"surchargé","single shot":"tir unique","rapid fire":"tir rapide"}
def one(s):
    s=s.strip();l=s.lower()
    if l in FULL:return FULL[l]
    m=re.match(r'^(twin)\s+(.+)$',l)
    if m and m.group(2) in FULL:return None  # géré par phrase() (accord en genre)
    return None
PROPER={x.lower() for x in ['Brutalis', 'Ballistus', 'Balistus', 'Omnissian', 'Arioch', 'Solarite', 'Sentry', 'Talassarian', 'Centurion', 'Encarmine', 'Castellan', 'Navis', 'Exitus', 'Arachnus', 'Cognis', 'Carnodon', 'Tauros', 'Taurox', 'Hades', 'Acastus', 'Absolvor', 'Questoris', 'Armiger', 'Baal', 'Invictor', 'Redemptor', 'Typhoon', 'Hellstrike', 'Scorpion', 'Helbrute', 'Predator', 'Dreadnought', 'Contemptor', 'Kastelan', 'Ironstrider', 'Daedalus', 'Phantom', 'Avenger', 'Griffon', 'Gorgon', 'Hellhammer', 'Hydra', 'Malcador', 'Vendetta', 'Warhound', 'Whirlwind', 'Icarus', 'Earthshaker', 'Baneblade', 'Deathstrike', 'Stormhammer', 'Heldrake', 'Maulerfiend', 'Talos', 'Phoenix', 'Achilles', 'Sagitaur', 'Terrorpulse', 'Caestus', 'Vigilator', 'Vindicare', 'Thunderhawk', 'Skyhammer', 'Tarantula', 'Mortifier', 'Exorcist', 'Repressor', 'Sydonian', 'Lastrum', 'Iliastus', 'Furioso', 'Decimator', 'Tyrant', 'Hekatarii', 'Kroot', 'Mole', 'Warlord', 'Vengor', 'Hunter-slayer']}
# --- composition : [propre] [twin] [heavy|power|...] NOM [mode] ; accords en genre (m/f) ---
NOUN={"claws":("Griffes","fp"),"claw":("Griffe","f"),"talons":("Serres","fp"),"talon":("Serre","f"),"blade":("Lame","f"),"blades":("Lames","fp"),"fists":("Poings","mp"),"fist":("Poing","m"),"axe":("Hache","f"),"sword":("Épée","f"),"spear":("Lance","f"),"lance":("Lance","f"),"staff":("Bâton","m"),"mace":("Masse","f"),"hammer":("Marteau","m"),"knife":("Couteau","m"),"gauntlet":("Gantelet","m"),"gauntlets":("Gantelets","mp"),"carbine":("Carabine","f"),"shotgun":("Fusil à pompe","m"),"mortar":("Mortier","m"),"teeth":("Dents","fp"),"maw":("Gueule","f"),"feet":("Pieds","mp"),"cannon":("Canon","m"),"launcher":("Lanceur","m"),"pistol":("Pistolet","m"),"rifle":("Fusil","m"),"lascannon":("Canon laser","m"),"autocannon":("Autocanon","m"),"flamer":("Lance-flammes","m"),"meltagun":("Fuseur","m"),"boltgun":("Bolter","m"),"bolter":("Bolter","m"),"storm bolter":("Bolter d'assaut","m"),"heavy bolter":("Bolter lourd","m"),"missile launcher":("Lance-missiles","m"),"heavy stubber":("Mitrailleuse lourde","f"),"stubber":("Mitrailleuse","f"),"plasma cannon":("Canon à plasma","m"),"plasma gun":("Fusil à plasma","m"),"plasma pistol":("Pistolet à plasma","m"),"plasma incinerator":("Incinérateur à plasma","m"),"plasma eradicator":("Éradicateur à plasma","m"),"bolt rifle":("Fusil bolter","m"),"bolt pistol":("Pistolet bolter","m"),"bolt carbine":("Carabine bolter","f"),"assault cannon":("Canon d'assaut","m"),"grenade launcher":("Lance-grenades","m"),"chainsword":("Épée tronçonneuse","f"),"lasgun":("Fusil laser","m"),"laspistol":("Pistolet laser","m"),"mortars":("Mortiers","mp"),"swords":("Épées","fp"),"axes":("Haches","fp"),"hammers":("Marteaux","mp"),"missiles":("Missiles","mp"),"missile":("Missile","m"),"grenade":("Grenade","f"),"incinerator":("Incinérateur","m")}
ADJ={"heavy":("lourd","lourde"),"twin":("jumelé","jumelée"),"power":("énergétique","énergétique"),"combi":("combiné","combinée")}
MODE.update({"focused fire":"tir concentré","saturation":"saturation","bolt":"bolt","single shot":"tir unique"})
def agree(g,a):
    f=g[0]=='f';p=g.endswith('p');x=ADJ[a][1] if f else ADJ[a][0]
    return x+('s' if p and not x.endswith('s') else '')
def phrase(t):
    t=t.strip();toks=t.split()
    if not toks:return None
    pre=[];
    low=[x.lower() for x in toks]
    # mots propres initiaux (majuscule, hors glossaire)
    i=0
    while i<len(toks)-1 and low[i] in PROPER and low[i] not in NOUN and low[i] not in ADJ and not any(low[i]==x.split()[0] for x in NOUN):i+=1
    prop=toks[:i];rest=low[i:]
    adj=[]
    while rest and rest[0] in ADJ and len(rest)>1:adj.append(rest.pop(0))
    key=" ".join(rest)
    if key in NOUN:fr,g=NOUN[key]
    elif key in FULL:fr,g=FULL[key],'m'
    else:return None
    if adj and ('heavy '+key in NOUN or 'heavy '+key in FULL) and adj==['heavy']:return (NOUN.get('heavy '+key) or (FULL['heavy '+key],'m'))[0]+(" "+" ".join(prop) if prop else "")
    out=fr
    if key in FULL and key not in NOUN and re.match(r'^(Mitrailleuse|Arme|Épée|Hache|Lance(?!-)|Carabine|Lame|Grenade|Pince|Masse)',fr):g='f'
    if key in FULL and key not in NOUN and re.match(r'^(Griffes|Épées|Haches|Lames)',fr):g='fp'
    adj.sort(key=lambda a:{'heavy':0,'power':1,'combi':1,'twin':2}[a])
    for a in adj:
        if a=='combi':return None
        out+=" "+agree(g,a)
    if prop:
        if any(c.isdigit() for c in " ".join(prop)):return None
        out+=" "+" ".join(prop)
    return out
def compose(name):
    n=re.sub(r'^➤\s*','',name).strip()
    m=re.match(r'^(.*?)\s*(?:\s[–—-]\s+|\()\s*([^()–—]+?)\)?$',n)
    if m:
        b=phrase(m.group(1)) or one(m.group(1));md=MODE.get(m.group(2).strip().lower())
        if b and md and md!=m.group(2).strip().lower() or (b and md):
            return b+(" – "+md if '(' not in n else " ("+md+")")
        return None
    return phrase(n) or one(n)
if __name__=='__main__':
    d=sys.argv[1];man,ch=load_chunks(d);S=strings(ch);fr=ch['fr'];t=fr['tr']
    add=0;unc={}
    for k,(en,kind,p) in S.items():
        if kind!="nom d'arme":continue
        e=t.get(k)
        if e and (nk(e['fr'])!=nk(en) or e.get('src') or 'ok' in e):continue  # existant utile : conservé
        c=compose(en)
        if c and nk(c)!=nk(en):
            add+=1
            if '--dry' not in sys.argv:t[k]={'fr':c,'at':datetime.date.today().isoformat(),'ok':False,'src':'composé depuis le glossaire de termes GW (à vérifier)'}
        else:unc[en]=unc.get(en,0)+1
    print('propositions ajoutées',add,'| armes restant en anglais',len(unc))
    if '--dry' in sys.argv:
        print(list(unc)[:80]);sys.exit()
    fr['count']=len(t);raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
    open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
    man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
    man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(t)}})
    open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
    import subprocess;subprocess.run([sys.executable,os.path.join(os.path.dirname(os.path.abspath(__file__)),'bump-version.py'),d])
