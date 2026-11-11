#!/usr/bin/env python3
"""Compare les documents Warhammer 40,000 (en français) publiés sur Warhammer Community
avec l'état enregistré dans outils/wc-documents.json.

Usage : python3 outils/verifier-wc.py [--enregistrer]
Code de sortie : 0 = nouveautés trouvées (liste affichée), 3 = rien de nouveau, 1 = erreur.
Avec --enregistrer, l'état actuel du site remplace l'état enregistré.
"""
import json, os, sys, urllib.request

API = "https://www.warhammer-community.com/api/search/downloads/"
ASSETS = "https://assets.warhammer-community.com/"
ETAT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wc-documents.json")


def documents():
    corps = json.dumps({"index": "downloads_v2", "searchTerm": "", "gameSystem": "warhammer-40000",
                        "language": "french"}).encode()
    req = urllib.request.Request(API, data=corps, method="POST",
                                 headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        hits = json.load(r)["hits"]
    out = {}
    for h in hits:
        d = h["id"]
        cats = [c.get("slug") for c in (d.get("download_categories") or []) if isinstance(c, dict)]
        out[d["slug"]] = {"titre": d["title"], "maj": d.get("last_updated"), "fichier": d.get("file"),
                          "categories": cats}
    return out


def main():
    try:
        site = documents()
    except Exception as e:  # réseau, format…
        print("erreur :", e)
        return 1
    avant = {}
    if os.path.exists(ETAT):
        avant = json.load(open(ETAT, encoding="utf8"))
    changes = []
    for slug, d in sorted(site.items(), key=lambda x: x[1]["titre"]):
        a = avant.get(slug)
        if not a:
            changes.append(("NOUVEAU", d))
        elif a.get("fichier") != d["fichier"] or a.get("maj") != d["maj"]:
            changes.append(("MODIFIÉ", d))
    for slug, a in avant.items():
        if slug not in site:
            changes.append(("RETIRÉ", a))
    for etat, d in changes:
        print(f"{etat} | {d['maj']} | {d['titre']} | {','.join(d.get('categories') or [])} | {ASSETS}{d['fichier']}")
    if "--enregistrer" in sys.argv:
        json.dump(site, open(ETAT, "w", encoding="utf8"), ensure_ascii=False, indent=1, sort_keys=True)
        print("état enregistré :", len(site), "documents")
    return 0 if changes else 3


if __name__ == "__main__":
    sys.exit(main())
