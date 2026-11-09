#!/usr/bin/env python3
"""Extrait la page « Mes armées 40k » d'un fichier lu sur Claude (enveloppe retirée) -> index.html du dépôt.
Usage : python3 extraire-page.py <fichier-lu-sur-claude.html> <depot>/index.html
Sort avec le code 3 si la page n'a pas changé."""
import sys, os
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding="utf-8").read()
a = s.find("<!DOCTYPE html>")
if a > 0:
    s = s[a:]
    last = s.rfind("</html>"); prev = s.rfind("</html>", 0, last)
    if prev > 0: s = s[:prev + 7]
if "armees40k" not in s or "<script" not in s:
    sys.exit("Ce n'est pas la page Mes armées 40k")
if os.path.exists(dst) and open(dst, encoding="utf-8").read() == s:
    print("inchangée"); sys.exit(3)
open(dst, "w", encoding="utf-8").write(s); print("mise à jour :", len(s), "octets")
