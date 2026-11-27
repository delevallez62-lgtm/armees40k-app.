/* Traducteur à règles (hors ligne, sans IA) pour les phrases très régulières : équipement de base, composition, options de remplacement.
   Renvoie une PROPOSITION française (à vérifier) ou null si la phrase n'a pas la forme connue. Les noms d'armes passent par tw(). */
const WN={"ranged weapon":"arme de tir","melee weapon":"arme de mêlée","close combat weapon":"arme de corps à corps","bolt pistol":"Pistolet bolter","boltgun":"Bolter","bolt rifle":"Fusil bolter","heavy bolter":"Bolter lourd","melta gun":"Fuseur","flamer":"Lance-flammes","heavy flamer":"Lance-flammes lourd","lascannon":"Canon laser","missile launcher":"Lance-missiles","power fist":"Poing énergétique","power sword":"Épée énergétique","power weapon":"Arme énergétique","chainsword":"Épée tronçonneuse","thunder hammer":"Marteau tonnerre","lightning claw":"Griffes éclair","lightning claws":"Griffes éclair","close combat weapon":"Arme de corps à corps","combat knife":"Couteau de combat","plasma pistol":"Pistolet à plasma","hand flamer":"Lance-flammes à main","storm shield":"Bouclier tempête","relic blade":"Lame relique","combi-weapon":"Arme combinée","frag grenade":"Grenade à fragmentation","krak grenade":"Grenade antichar","twin lascannon":"Canon laser jumelé","twin heavy bolter":"Bolter lourd jumelé","assault cannon":"Canon d'assaut","multi-melta":"Multi-fuseur","storm bolter":"Bolter d'assaut"};
const WM={"sergeant":"Sergent","model":"figurine","models":"figurines"};
/* sujet générique « [Pour chaque tranche de N figurines…,] [1 | N | jusqu'à N | n'importe quel nombre de] NOM » (modèle nommé) */
function subjGen(sj){const m=/^(?:(for every (\d+) models in (?:this|the) unit,)|(if this unit contains (\d+) (?:or fewer )?models,))?\s*(?:(one|\d+|up to \d+|any number of)\s+)?(.+)$/i.exec(String(sj||"").trim());if(!m)return null;
 const name=m[6].trim();if(!name||/\b(?:unit|models?|this|that)\b/i.test(name)||name.length>45||/[:;•]/.test(name))return null;
 const pre=m[2]?"Pour chaque tranche de "+m[2]+" figurines de cette unité, ":m[4]?(/or fewer/i.test(m[3])?"Si l'unité compte "+m[4]+" figurines ou moins, ":"Si l'unité compte "+m[4]+" figurines, "):"";
 const q=(m[5]||"").toLowerCase();let n=1,many=false,txt;
 if(!q)txt="la figurine « "+name+" »";
 else if(q==="one"||q==="1")txt="1 figurine « "+name+" »";
 else if(q==="any number of"){many=true;txt="n'importe quel nombre de figurines « "+name+" »"}
 else if(/^up to/.test(q)){many=true;txt="jusqu'à "+q.replace(/\D+/g,"")+" figurines « "+name+" »"}
 else{many=+q>1;txt=q+" figurine"+(+q>1?"s":"")+" « "+name+" »"}
 const cap=x=>x.charAt(0).toUpperCase()+x.slice(1);
 return{pre,txt:pre?txt:cap(txt),many}}
function ruleTr(en,tw){const T=tw||(x=>x);const s=String(en||"").trim();if(!s)return null;
 {let m=/^(\*+)\s*You cannot select the same (weapon|option) more than once per unit unless it contains (\d+) models, in which case you cannot select the same (?:weapon|option) more than twice per unit\.?$/i.exec(s);
  if(m)return m[1]+" Une même "+(/weapon/i.test(m[2])?"arme":"option")+" ne peut être choisie qu'une seule fois par unité, sauf si l'unité compte "+m[3]+" figurines : elle peut alors l'être deux fois.";
  if(m=/^(\*+)\s*A model can only take one of these options\.?$/i.exec(s))return m[1]+" Une figurine ne peut prendre qu'une seule de ces options.";
  if(m=/^(\*+)\s*(This|Each) model cannot have duplicates of these pieces of wargear\.?$/i.exec(s))return m[1]+" "+(/this/i.test(m[2])?"Cette":"Chaque")+" figurine ne peut pas avoir de doublons de ces équipements."}
 const tn=x=>{const m=/^(\d+)\s+(.+)$/.exec(x.trim()),r=m?m[2].trim():x.trim(),f=WN[r.toLowerCase()]||T(r);return m?m[1]+" "+f:f};
 const tr=x=>{const w=tn(x);if(!/\sand\s/i.test(x)||String(w).toLowerCase()!==String(x).trim().toLowerCase())return w;return x.split(/\s+and\s+/i).map(p=>tn(p)).join(" et ")};
 const item=x=>{const m=/^(\d+(?:-\d+)?)\s+(.+?)\.?$/.exec(x.trim());if(!m){const y=x.trim().replace(/\.$/,"");return y&&!/^(?:\(|\*)/.test(y)?tr(y):y}const nm=m[2].trim();return m[1]+" "+tr(nm)};
 const list=x=>x.split(/\s*;\s*|\s*,\s*(?=\d)/).map(i=>item(i.replace(/\.$/,""))).filter(Boolean);
 const andList=x=>x.split(/\s+and\s+/).map(i=>item(/^\d/.test(i.trim())?i:"1 "+i)).join(" et ");
 const upto=x=>x.replace(/^up to (\d+)\s+/i,"jusqu'à $1 ");
 const plain=x=>x.split(/\s+and\s+/).map(i=>tn(i)).join(" et ");
 // --- équipement de base ---
 if(/\bis equipped with:\*\*|\bare equipped with:\*\*/.test(s)){
  const blocks=s.split(/\n\s*\n/),out=[];
  for(const b of blocks){const m=/^\*\*(.+?)\s+(?:is|are)\s+equipped with:\*\*\s*(.*)$/s.exec(b.trim());if(!m)return null;
   const sub=m[1].trim();let fr;
   if(/^this model$/i.test(sub))fr="Cette figurine est équipée de";else if(/^every model$/i.test(sub)||/^each model$/i.test(sub))fr="Chaque figurine est équipée de";
   else if(/^(?:every|each)\s+(.+)$/i.test(sub)){const w=/^(?:every|each)\s+(.+)$/i.exec(sub)[1];fr="Chaque "+(WM[w.toLowerCase()]||w)+" est équipé de"}
   else if(/^the\s+(.+)$/i.test(sub)){const w=/^the\s+(.+)$/i.exec(sub)[1];fr="Le "+(WM[w.toLowerCase()]||w)+" est équipé de"}
   else fr=sub+" est équipé de";
   const items=list(m[2]);if(!items.length)return null;out.push("**"+fr+" :** "+items.join(" ; ")+".")}
  return out.join("\n\n")}
 // --- composition ---
 {const m=/^(\d+(?:-\d+)?)\s+(.+?)\s+models?$/i.exec(s);if(m)return m[1]+" figurine"+(m[1]==="1"?"":"s")+" "+(WM[m[2].toLowerCase()]||m[2])}
 // --- ajouts d'équipement ---
 {const m=/^(this model|this unit|1 model|(?:the|1) (.+?)(?: model)?|all models in this unit|any number of models(?: in this unit)?)\s+can\s+(?:each\s+)?be\s+equipped\s+with\s+(.+)$/is.exec(s);
  if(m){const sj=m[1].toLowerCase();let fs=sj==="this model"?"Cette figurine":sj==="this unit"?"Cette unité":sj==="1 model"?"1 figurine":/^all models/.test(sj)?"Toutes les figurines de cette unité":/^any number/.test(sj)?"N'importe quel nombre de figurines":"La figurine « "+(m[2]||"")+" »";
   const verb=/^(all|any)/.test(sj)?"peuvent chacune être équipées de":(sj==="this unit"?"peut être équipée de":"peut être équipée de");
   let tail=m[3].trim();let res;
   if(/^one of the following:?\s*/i.test(tail)){const rest=tail.replace(/^one of the following:?\s*/i,"");res=/•/.test(rest)?"l'un des éléments suivants :\n"+rest.split(/\n?•\s*/).map(x=>x.trim()).filter(Boolean).map(x=>"• "+item(x.replace(/\.$/,""))).join("\n"):"l'un des éléments suivants : "+list(rest).join(", ")+"."}
   else res=upto(andList(tail.replace(/\.$/,"")))+".";
   return fs+" "+verb+" "+res}}
 // --- options de remplacement ---
 {let m=/^(.*?)\s+can\s+(?:each\s+)?have\s+(?:their|its|his|her)\s+(.+?)\s+replaced\s+with\s+(.+)$/s.exec(s)||null,subj=null,rep=null,old=null;
  if(m){subj=m[1];old=m[2];rep=m[3]}
  else{const m2=/^(.*?)[’']s\s+(.+?)\s+can\s+be\s+replaced\s+with\s+(.+)$/s.exec(s)||/^(.*?)\s+can\s+(?:each\s+)?replace\s+(?:their|its|his|her)\s+(.+?)\s+with:?\s+(.+)$/s.exec(s);if(m2){subj=m2[1];old=m2[2];rep=m2[3]}}
  if(subj===null)return null;
  let fs;const sj=subj.trim();let mm;
  if(/^this model$/i.test(sj))fs="Cette figurine peut remplacer son";
  else if(/^all models in this unit$/i.test(sj))fs="Toutes les figurines de cette unité peuvent chacune remplacer leur";
  else if(mm=/^all (.+?) models in this unit$/i.exec(sj))fs="Toutes les figurines "+(WM[mm[1].toLowerCase()]||mm[1])+" de cette unité peuvent chacune remplacer leur";
  else if(mm=/^any number of (?:(.+?)\s+)?models(?: in this unit)?$/i.exec(sj))fs="N'importe quel nombre de figurines"+(mm[1]?" "+(WM[mm[1].toLowerCase()]||mm[1]):"")+" peuvent chacune remplacer leur";
  else if(mm=/^for every (\d+) models in (?:this|the) unit,\s*(up to )?(\d+) (?:(.+?)\s+)?models?$/i.exec(sj))fs="Pour chaque tranche de "+mm[1]+" figurines de cette unité, "+(mm[2]?"jusqu'à ":"")+mm[3]+" figurine"+(mm[3]==="1"?"":"s")+(mm[4]?" "+(WM[mm[4].toLowerCase()]||mm[4]):"")+" peu"+(mm[3]==="1"&&!mm[2]?"t":"vent")+(mm[3]==="1"&&!mm[2]?"":" chacune")+" remplacer "+(mm[3]==="1"&&!mm[2]?"son":"leur");
  else if(mm=/^(\d+) models?$/i.exec(sj))fs=mm[1]+(mm[1]==="1"?" figurine peut remplacer son":" figurines peuvent chacune remplacer leur");
  else if(mm=/^up to (\d+) (?:(.+?)\s+)?models$/i.exec(sj))fs="Jusqu'à "+mm[1]+" figurines"+(mm[2]?" "+(WM[mm[2].toLowerCase()]||mm[2]):"")+" peuvent chacune remplacer leur";
  else if(mm=/^the (.+)$/i.exec(sj))fs="La figurine « "+mm[1]+" » peut remplacer son";
  else if(mm=subjGen(sj))fs=mm.pre+mm.txt+(mm.many?" peuvent chacune remplacer leur":" peut remplacer son");
  else return null;
  const o=plain(old.trim());let tail=rep.trim();
  let res;
  if(/^one of the following:?\s*/i.test(tail)){const rest=tail.replace(/^one of the following:?\s*/i,"");
   if(/•/.test(rest)){res="l'un des éléments suivants :\n"+rest.split(/\n?•\s*/).map(x=>x.trim()).filter(Boolean).map(x=>"• "+item(x.replace(/\.$/,""))).join("\n")}
   else res="l'un des éléments suivants : "+list(rest).join(", ")+"."}
  else res=andList(tail.replace(/\.$/,""))+".";
  return (/^\d/.test(o)?fs.replace(/ son$/," ses").replace(/ leur$/," leurs"):fs)+" "+o+" par "+res}
 return null}

/* Versions structurées pour un affichage clair (cartes) : renvoient une structure ou null */
function ruleOpt(en,tw){const T=tw||(x=>x);const s=String(en||"").trim();if(!s)return null;
 const tn=x=>{const m=/^(\d+)\s+(.+)$/.exec(x.trim()),r=m?m[2].trim():x.trim(),f=WN[r.toLowerCase()]||T(r);return m?m[1]+" "+f:f};
 const tr=x=>{const w=tn(x);if(!/\sand\s/i.test(x)||String(w).toLowerCase()!==String(x).trim().toLowerCase())return w;return x.split(/\s+and\s+/i).map(p=>tn(p)).join(" et ")};
 const item=x=>{const m=/^(\d+(?:-\d+)?)\s+(.+?)\.?$/.exec(x.trim());return m?{n:m[1],name:tr(m[2].trim())}:{n:"",name:tr(x.trim().replace(/\.$/,""))}};
 const list=x=>x.split(/\s*;\s*|\s*,\s*(?=\d)/).map(i=>item(i.replace(/\.$/,""))).filter(i=>i.name);
 const andItems=x=>x.split(/\s+and\s+/).map(i=>item(/^\d/.test(i.trim())||/^up to/i.test(i.trim())?i.replace(/^up to (\d+)\s+/i,"$1 "):"1 "+i));
 let mode,subj,old=null,tail;
 let m=/^(.*?)\s+can\s+(?:each\s+)?have\s+(?:their|its|his|her)\s+(.+?)\s+replaced\s+with\s+(.+)$/s.exec(s);
 if(m){mode="replace";subj=m[1];old=m[2];tail=m[3]}
 else if(m=/^(.*?)[’']s\s+(.+?)\s+can\s+be\s+replaced\s+with\s+(.+)$/s.exec(s)){mode="replace";subj=m[1];old=m[2];tail=m[3]}
 else if(m=/^(.*?)\s+can\s+(?:each\s+)?replace\s+(?:their|its|his|her)\s+(.+?)\s+with:?\s+(.+)$/s.exec(s)){mode="replace";subj=m[1];old=m[2];tail=m[3]}
 else if(m=/^(this model|this unit|1 model|all models in this unit|any number of models(?: in this unit)?|the .+?)\s+can\s+(?:each\s+)?be\s+equipped\s+with\s+(.+)$/is.exec(s)){mode="add";subj=m[1];tail=m[2]}
 else return null;
 let who;const sj=subj.trim();let mm;
 if(/^this model$/i.test(sj))who="Cette figurine";else if(/^this unit$/i.test(sj))who="Cette unité";
 else if(/^all models in this unit$/i.test(sj))who="Toutes les figurines de cette unité";
 else if(mm=/^all (.+?) models in this unit$/i.exec(sj))who="Toutes les figurines "+(WM[mm[1].toLowerCase()]||mm[1])+" de cette unité";
 else if(mm=/^any number of (?:(.+?)\s+)?models(?: in this unit)?$/i.exec(sj))who="N'importe quel nombre de figurines"+(mm[1]?" "+(WM[mm[1].toLowerCase()]||mm[1]):"")+" (chacune)";
 else if(mm=/^for every (\d+) models in (?:this|the) unit,\s*(up to )?(\d+) (?:(.+?)\s+)?models?$/i.exec(sj))who="Pour chaque tranche de "+mm[1]+" figurines de cette unité : "+(mm[2]?"jusqu'à ":"")+mm[3]+" figurine"+(mm[3]==="1"?"":"s")+(mm[4]?" "+(WM[mm[4].toLowerCase()]||mm[4]):"");
 else if(mm=/^(\d+) models?$/i.exec(sj))who=mm[1]+" figurine"+(mm[1]==="1"?"":"s");
 else if(mm=/^up to (\d+) (?:(.+?)\s+)?models$/i.exec(sj))who="Jusqu'à "+mm[1]+" figurines"+(mm[2]?" "+(WM[mm[2].toLowerCase()]||mm[2]):"")+" (chacune)";
 else if(mm=/^the (.+)$/i.exec(sj))who="La figurine « "+mm[1]+" »";
 else if(mm=subjGen(sj))who=mm.pre+mm.txt+(mm.many?" (chacune)":"");
 else return null;
 let choices,oneOf=false;tail=tail.trim();
 if(/^one of the following:?\s*/i.test(tail)){oneOf=true;const rest=tail.replace(/^one of the following:?\s*/i,"");choices=/•/.test(rest)?rest.split(/\n?•\s*/).map(x=>x.trim()).filter(Boolean).map(x=>item(x.replace(/\.$/,""))):list(rest)}
 else choices=andItems(tail.replace(/\.$/,""));
 return{mode,who,old:old?old.split(/\s+and\s+/).map(x=>tn(x)):[],choices,oneOf}}
function ruleLoad(en,tw){const T=tw||(x=>x);const s=String(en||"").trim();if(!/equipped with/.test(s))return null;
 const tn=x=>{const m=/^(\d+)\s+(.+)$/.exec(x.trim()),r=m?m[2].trim():x.trim(),f=WN[r.toLowerCase()]||T(r);return m?m[1]+" "+f:f};
 const tr=x=>{const w=tn(x);if(!/\sand\s/i.test(x)||String(w).toLowerCase()!==String(x).trim().toLowerCase())return w;return x.split(/\s+and\s+/i).map(p=>tn(p)).join(" et ")};
 const out=[];for(const b of s.split(/\n\s*\n/)){const m=/^\*\*(.+?)\s+(?:is|are)\s+equipped with:\*\*\s*(.*)$/s.exec(b.trim());if(!m)return null;const sub=m[1].trim();let who;
  if(/^this model$/i.test(sub))who="Cette figurine";else if(/^(?:every|each) model$/i.test(sub))who="Chaque figurine";else if(/^(?:every|each)\s+(.+)$/i.test(sub))who="Chaque "+(WM[/^(?:every|each)\s+(.+)$/i.exec(sub)[1].toLowerCase()]||/^(?:every|each)\s+(.+)$/i.exec(sub)[1]);else if(/^the\s+(.+)$/i.test(sub))who=(WM[/^the\s+(.+)$/i.exec(sub)[1].toLowerCase()]||"La figurine « "+/^the\s+(.+)$/i.exec(sub)[1]+" »");else who=sub;
  const items=m[2].split(/\s*;\s*/).map(i=>i.replace(/\.$/,"").trim()).filter(Boolean).map(i=>{const mm=/^(\d+(?:-\d+)?)\s+(.+)$/.exec(i);return mm?{n:mm[1],name:tn(mm[2])}:{n:"",name:tn(i)}});out.push({who,items})}
 return out}
