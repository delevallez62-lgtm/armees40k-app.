/* Traducteur à règles (hors ligne, sans IA) pour les phrases très régulières : équipement de base, composition, options de remplacement.
   Renvoie une PROPOSITION française (à vérifier) ou null si la phrase n'a pas la forme connue. Les noms d'armes passent par tw(). */
const WN={"bolt pistol":"Pistolet bolter","boltgun":"Bolter","bolt rifle":"Fusil bolter","heavy bolter":"Bolter lourd","melta gun":"Fuseur","flamer":"Lance-flammes","heavy flamer":"Lance-flammes lourd","lascannon":"Canon laser","missile launcher":"Lance-missiles","power fist":"Poing énergétique","power sword":"Épée énergétique","power weapon":"Arme énergétique","chainsword":"Épée tronçonneuse","thunder hammer":"Marteau tonnerre","lightning claw":"Griffes éclair","lightning claws":"Griffes éclair","close combat weapon":"Arme de corps à corps","combat knife":"Couteau de combat","plasma pistol":"Pistolet à plasma","hand flamer":"Lance-flammes à main","storm shield":"Bouclier tempête","relic blade":"Lame relique","combi-weapon":"Arme combinée","frag grenade":"Grenade à fragmentation","krak grenade":"Grenade antichar","twin lascannon":"Canon laser jumelé","twin heavy bolter":"Bolter lourd jumelé","assault cannon":"Canon d'assaut","multi-melta":"Multi-fuseur","storm bolter":"Bolter d'assaut"};
const WM={"sergeant":"Sergent","model":"figurine","models":"figurines"};
function ruleTr(en,tw){const T=tw||(x=>x);const s=String(en||"").trim();if(!s)return null;
 const tn=x=>{const k=x.trim().toLowerCase().replace(/^\d+\s+/,""),f=WN[k];return f||T(x.trim())};
 const item=x=>{const m=/^(\d+(?:-\d+)?)\s+(.+?)\.?$/.exec(x.trim());if(!m)return x.trim();const nm=m[2].trim();return m[1]+" "+tn(nm)};
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
 {const m=/^(this model|this unit|1 model|(?:the|1) (.+?)(?: model)?|all models in this unit|any number of models(?: in this unit)?)\s+can\s+be\s+equipped\s+with\s+(.+)$/is.exec(s);
  if(m){const sj=m[1].toLowerCase();let fs=sj==="this model"?"Cette figurine":sj==="this unit"?"Cette unité":sj==="1 model"?"1 figurine":/^all models/.test(sj)?"Toutes les figurines de cette unité":/^any number/.test(sj)?"N'importe quel nombre de figurines":"La figurine « "+(m[2]||"")+" »";
   const verb=/^(all|any)/.test(sj)?"peuvent chacune être équipées de":(sj==="this unit"?"peut être équipée de":"peut être équipée de");
   let tail=m[3].trim();let res;
   if(/^one of the following:?\s*/i.test(tail)){const rest=tail.replace(/^one of the following:?\s*/i,"");res="l'un des éléments suivants : "+list(rest).join(", ")+"."}
   else res=upto(andList(tail.replace(/\.$/,"")))+".";
   return fs+" "+verb+" "+res}}
 // --- options de remplacement ---
 {let m=/^(.*?)\s+can\s+(?:each\s+)?have\s+(?:their|its|his|her)\s+(.+?)\s+replaced\s+with\s+(.+)$/s.exec(s)||null,subj=null,rep=null,old=null;
  if(m){subj=m[1];old=m[2];rep=m[3]}
  else{const m2=/^(.*?)[’']s\s+(.+?)\s+can\s+be\s+replaced\s+with\s+(.+)$/s.exec(s);if(m2){subj=m2[1];old=m2[2];rep=m2[3]}}
  if(subj===null)return null;
  let fs;const sj=subj.trim();let mm;
  if(/^this model$/i.test(sj))fs="Cette figurine peut remplacer son";
  else if(/^all models in this unit$/i.test(sj))fs="Toutes les figurines de cette unité peuvent chacune remplacer leur";
  else if(mm=/^all (.+?) models in this unit$/i.exec(sj))fs="Toutes les figurines "+(WM[mm[1].toLowerCase()]||mm[1])+" de cette unité peuvent chacune remplacer leur";
  else if(mm=/^any number of (?:(.+?)\s+)?models(?: in this unit)?$/i.exec(sj))fs="N'importe quel nombre de figurines"+(mm[1]?" "+(WM[mm[1].toLowerCase()]||mm[1]):"")+" peuvent chacune remplacer leur";
  else if(mm=/^for every (\d+) models in this unit,\s*(up to )?(\d+) (?:(.+?)\s+)?models?$/i.exec(sj))fs="Pour chaque tranche de "+mm[1]+" figurines de cette unité, "+(mm[2]?"jusqu'à ":"")+mm[3]+" figurine"+(mm[3]==="1"?"":"s")+(mm[4]?" "+(WM[mm[4].toLowerCase()]||mm[4]):"")+" peu"+(mm[3]==="1"&&!mm[2]?"t":"vent")+(mm[3]==="1"&&!mm[2]?"":" chacune")+" remplacer "+(mm[3]==="1"&&!mm[2]?"son":"leur");
  else if(mm=/^(\d+) models?$/i.exec(sj))fs=mm[1]+(mm[1]==="1"?" figurine peut remplacer son":" figurines peuvent chacune remplacer leur");
  else if(mm=/^up to (\d+) (?:(.+?)\s+)?models$/i.exec(sj))fs="Jusqu'à "+mm[1]+" figurines"+(mm[2]?" "+(WM[mm[2].toLowerCase()]||mm[2]):"")+" peuvent chacune remplacer leur";
  else if(mm=/^the (.+)$/i.exec(sj))fs="La figurine « "+mm[1]+" » peut remplacer son";
  else return null;
  const o=plain(old.trim());let tail=rep.trim();
  let res;
  if(/^one of the following:?\s*/i.test(tail)){const rest=tail.replace(/^one of the following:?\s*/i,"");
   if(/•/.test(rest)){res="l'un des éléments suivants :\n"+rest.split(/\n?•\s*/).map(x=>x.trim()).filter(Boolean).map(x=>"• "+item(x.replace(/\.$/,""))).join("\n")}
   else res="l'un des éléments suivants : "+list(rest).join(", ")+"."}
  else res=andList(tail.replace(/\.$/,""))+".";
  return fs+" "+o+" par "+res}
 return null}
