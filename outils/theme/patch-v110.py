import sys,re
src,out=sys.argv[1:3]
s=open(src,encoding='utf8').read()
def rep(a,b,n=None):
    global s
    c=s.count(a);assert c>0 and (n is None or c==n),(c,a[:80]);s=s.replace(a,b)
# les classes du tableau d'armes entraient en collision avec celles de l'ancien assistant (.wzi, .wzs, .wzg, .wzc)
rep('tr.wzc','tr.wtc',14);rep('tr.wzs','tr.wts',2);rep('tr.wzg','tr.wtg',6)
rep('<tr class="wzs g">','<tr class="wts g">',1);rep('<tr class="wzs">','<tr class="wts">',1)
rep('<tr class="wzg ${t}">','<tr class="wtg ${t}">',1);rep('<tr class="wzc ${t}">','<tr class="wtc ${t}">',1)
rep('<span class="wzi">${WI[t]}</span>','<span class="wti">${WI[t]}</span>',2)
rep('.wzi{display:inline-flex','.wti{display:inline-flex',1)
rep('.wzi{color:var(--wc)}','.wti{color:var(--wc)}')
open(out,'w',encoding='utf8').write(s);print('ok')
