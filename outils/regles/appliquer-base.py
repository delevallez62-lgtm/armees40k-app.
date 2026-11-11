import sys
src, base, out = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf8').read()
nb = open(base, encoding='utf8').read().rstrip()

def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (c, a[:80])
    s = s.replace(a, b)

# 1. base officielle
i = s.index('const ENC_BASE=(()=>')
a = s.index('/* ---------- 1. Règles générales ---------- */', i)
b = s.index('\n]})();', a)
s = s[:a] + nb + s[b:]

# 2. version / date / sources
rep('const ENC_DATE="2026-11-10",ENC_VER="V11 (Core Rules, juin 2026)";',
    'const ENC_DATE="2026-11-11",ENC_VER="V11 (Règles de Base, juin 2026)";')
rep('const ENC_SRC={\n',
    'const ENC_SRC={\n rdb:["Warhammer Community — Règles de Base Warhammer 40,000 (PDF officiel en français, 1er juin 2026)","https://assets.warhammer-community.com/fre_01-06_warhammer40k_new40k_core_rules-ooyuallyp9-s4aczdfbm2.pdf"],\n'
    ' mru:["Warhammer Community — Mises à jour des règles universelles, version 1.1 (26 août 2026)","https://assets.warhammer-community.com/fre_wh40k_core%26key_universal_rules_updates-41x8ngd0xc-skoqigyucy.pdf"],\n')
rep('st : "off" = officielle vérifiée (source officielle consultée) · "verif" = à vérifier',
    'st : "off" = officielle vérifiée (source officielle consultée) · "verif" = à vérifier · "new" = nouveauté officielle à valider par l\'utilisateur')

# 3. statut « nouvelle »
rep('const ST={off:"Officielle vérifiée",verif:"À vérifier"},KIND=',
    'const ST={off:"Officielle vérifiée",verif:"À vérifier",new:"Nouvelle — à valider"},KIND=')
rep('["r","del","as","ex","ack","ign"].forEach(k=>', '["r","del","as","ex","ack","ign","nv"].forEach(k=>')

# 4. mises à jour officielles : appliquées directement si la règle n'a pas été personnalisée
rep('if(!(b.id in e.ack)){e.ack[b.id]=h;ch=true}else if(e.ack[b.id]!==h)UPD[b.id]=h}',
    'if(!(b.id in e.ack)){e.ack[b.id]=h;ch=true}else if(e.ack[b.id]!==h){if(e.r[b.id])UPD[b.id]=h;else{e.ack[b.id]=h;ch=true}}}')

# 5. index : une nouveauté validée devient « Officielle vérifiée »
rep('all[id]=u?Object.assign({},u,{id,kind:"perso"}):Object.assign({},baseShown(id),{kind:"base"})}',
    'all[id]=u?Object.assign({},u,{id,kind:"perso"}):Object.assign({},baseShown(id),{kind:"base"});if(!u&&all[id].st==="new"&&e.nv[id])all[id].st="off"}')

# 6. badge
rep('<span class="encst ${r.st==="off"?"o":"v"}">', '<span class="encst ${r.st==="off"?"o":r.st==="new"?"n":"v"}">')

# 7. styles
rep('.encst.u{background:rgba(220,80,70,.16);color:#e0584b}',
    '.encst.u{background:rgba(220,80,70,.16);color:#e0584b}\n'
    '.encst.n{background:rgba(224,138,44,.2);color:#e08a2c}\n'
    '.encal.n{border-color:rgba(224,138,44,.6);background:color-mix(in srgb,#e08a2c 12%,var(--card))}\n'
    '.encnv{border:1px solid var(--bd);border-left:4px solid #e08a2c;border-radius:12px;padding:10px 12px;margin:10px 0;background:var(--card)}\n'
    '.encnvh{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.encnvh b{font-size:16px}.encnvh small{color:var(--mu);font-size:12px}\n'
    '.encnv p{margin:6px 0}.encnvb{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.encnvb .b{flex:1;min-height:42px}')

# 8. alerte sur l'écran Encyclopédie
rep(' ${up.length?`<button type="button" class="encal u" data-enc2="upds">',
    ' ${nvList().length?`<button type="button" class="encal n" data-enc2="nvv"><b>${nvList().length}</b><span>Nouvelles règles à valider</span></button>`:""}\n ${up.length?`<button type="button" class="encal u" data-enc2="upds">')
rep(' if(a==="upds"){', ' if(a==="nvv"){nvView();return}\n if(a==="upds"){')

# 9. actions du pop-up
rep(' if(a==="ovclose"){ovClose();return}\n',
    ' if(a==="ovclose"){ovClose();return}\n'
    ' if(a==="nvok"||a==="nvall"){const e2=E(),l=a==="nvall"?nvList():[b.dataset.id];l.forEach(id=>{e2.nv[id]=1;hist("maj",id,null,Object.assign({},BASE[id],{kind:"base",st:"off"}))});dirty();save();draw();if(nvList().length)nvView();else{ovClose();toast(l.length>1?"Nouveautés validées":"Règle validée")}return}\n'
    ' if(a==="nved"){const id=b.dataset.id;E().nv[id]=1;dirty();save();ovClose();editor(id);return}\n'
    ' if(a==="nvdel"){const id=b.dataset.id;E().nv[id]="x";delRule(id);dirty();save();draw();if(nvList().length)nvView();else{ovClose();toast("Règle supprimée (récupérable dans l\'historique)")}return}\n')

# 10. liste + pop-up, ouvert au démarrage s'il y a des nouveautés
rep('\nencInit();\n',
    '\n/* ----- nouveautés officielles : pop-up Valider / Modifier / Supprimer ----- */\n'
    'function nvList(){const e=E();return BASE0.filter(b=>b.st==="new"&&!e.nv[b.id]&&!e.del[b.id]&&!e.r[b.id]).map(b=>b.id)}\n'
    'function nvView(){const l=nvList();if(!l.length){if(ovKind==="nv")ovClose();return}\n'
    ' ovOpen("nv",`<div class="ench"><h2>Nouveautés officielles</h2><button type="button" class="encx" data-enc="ovclose" aria-label="Fermer">✕</button></div>\n'
    ' <p class="mu">${l.length} nouvelle${l.length>1?"s":""} règle${l.length>1?"s":""} ajoutée${l.length>1?"s":""} depuis Warhammer Community, résumée${l.length>1?"s":""} en français. Valide, modifie ou supprime chacune.</p>\n'
    ' ${l.map(id=>{const r=R(id)||BASE[id];return`<div class="encnv"><div class="encnvh"><span>${CATI[r.cat]||""}</span><b>${esc(r.n)}</b><small>${esc(CATN[r.cat]||"")}</small></div><p>${esc(r.def)}</p>${r.how?`<p class="mu">${esc(r.how)}</p>`:""}${r.rest?`<p class="mu">${esc(r.rest)}</p>`:""}<div class="encnvb"><button type="button" class="b p" data-enc="nvok" data-id="${id}">✓ Valider</button><button type="button" class="b" data-enc="nved" data-id="${id}">✎ Modifier</button><button type="button" class="b x" data-enc="nvdel" data-id="${id}">🗑 Supprimer</button></div></div>`}).join("")}\n'
    ' <div class="encft"><button type="button" class="b" data-enc="ovclose">Plus tard</button><button type="button" class="b p" data-enc="nvall">Tout valider</button></div>`)}\n'
    'encInit();\n'
    'setTimeout(()=>{try{if(nvList().length&&ov.hidden&&!document.querySelector("#md .ov"))nvView()}catch(_){}},900);\n')

# 11. textes de l'écran
rep('<small>Warhammer 40 000 V11 · ${n} entrées</small>', '<small>Warhammer 40 000 V11 · ${n} entrées · vérifiées le 11/11/2026</small>')
rep('« À vérifier » : source secondaire ou non confirmée. Le PDF officiel des Core Rules fait foi.',
    '« Officielle vérifiée » : comparée aux PDF de Warhammer Community (Règles de Base, mises à jour universelles). « À vérifier » : règle de Codex non publiée sur le site. Le PDF officiel fait foi.')
rep('window.__enc={rules,R,res,usage,missing,ambig,dups,bk,E,UPD:()=>UPD,setRule,addRule,delRule,restoreH};',
    'window.__enc={rules,R,res,usage,missing,ambig,dups,bk,E,UPD:()=>UPD,setRule,addRule,delRule,restoreH,nvList,nvView};')

open(out, 'w', encoding='utf8').write(s)
print("ok", len(s))
