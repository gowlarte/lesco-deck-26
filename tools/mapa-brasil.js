'use strict';
/* Gera window.BR_MAPA a partir de um GeoJSON de estados do Brasil.
   Projeção Albers equal-area cônica, simplificação Douglas-Peucker
   iterativa (o anel é fechado, então a distância ponto-segmento
   degenerada é tratada como distância ponto-ponto). */
const fs=require('fs');
const src=process.argv[2], out=process.argv[3];
const W=1000, H=1000, PAD=6;

const g=JSON.parse(fs.readFileSync(src,'utf8'));

const R=Math.PI/180, p1=-2*R, p2=-28*R, p0=-15*R, l0=-54*R;
const n=(Math.sin(p1)+Math.sin(p2))/2;
const C=Math.cos(p1)**2+2*n*Math.sin(p1);
const rho0=Math.sqrt(C-2*n*Math.sin(p0))/n;
function proj(lon,lat){
  const phi=lat*R, lam=lon*R;
  const rho=Math.sqrt(C-2*n*Math.sin(phi))/n;
  const th=n*(lam-l0);
  return [rho*Math.sin(th), rho0-rho*Math.cos(th)];
}

/* Douglas-Peucker iterativo, marcando quais pontos ficam. */
function dp(pts,eps){
  const nP=pts.length;
  if(nP<4) return pts.slice();
  const keep=new Uint8Array(nP); keep[0]=1; keep[nP-1]=1;
  const stack=[[0,nP-1]];
  while(stack.length){
    const [a,b]=stack.pop();
    if(b-a<2) continue;
    const ax=pts[a][0], ay=pts[a][1], bx=pts[b][0], by=pts[b][1];
    const dx=bx-ax, dy=by-ay, len=Math.hypot(dx,dy);
    let dmax=-1, idx=-1;
    for(let i=a+1;i<b;i++){
      const d = len>1e-12
        ? Math.abs((pts[i][0]-ax)*dy-(pts[i][1]-ay)*dx)/len      /* ponto→reta  */
        : Math.hypot(pts[i][0]-ax, pts[i][1]-ay);                /* anel fechado */
      if(d>dmax){dmax=d; idx=i;}
    }
    if(dmax>eps && idx>0){ keep[idx]=1; stack.push([a,idx],[idx,b]); }
  }
  const res=[];
  for(let i=0;i<nP;i++) if(keep[i]) res.push(pts[i]);
  return res;
}

function ringArea(r){
  let a=0;
  for(let i=0,j=r.length-1;i<r.length;j=i++) a+=(r[j][0]*r[i][1]-r[i][0]*r[j][1]);
  return Math.abs(a/2);
}

const feats=g.features.map(f=>{
  const polys = f.geometry.type==='Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return { uf:f.id, nome:f.properties.Estado, macro:f.properties.FK_macro,
           polys: polys.map(p=>p.map(ring=>ring.map(c=>proj(c[0],c[1])))) };
});

let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
feats.forEach(f=>f.polys.forEach(p=>p.forEach(r=>r.forEach(([x,y])=>{
  if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y;
}))));
const s=Math.min((W-2*PAD)/(maxx-minx), (H-2*PAD)/(maxy-miny));
const offx=PAD+((W-2*PAD)-(maxx-minx)*s)/2, offy=PAD+((H-2*PAD)-(maxy-miny)*s)/2;
/* y da projeção cresce para o norte; no SVG cresce para baixo — daí maxy-y. */
const to=([x,y])=>[ (x-minx)*s+offx, (maxy-y)*s+offy ];

const EPS=1.0, MIN_AREA=8;
const estados={}; let totalPts=0;

feats.forEach(f=>{
  let d='', best=null, bestA=0;
  f.polys.forEach(poly=>{
    const outer=poly[0].map(to);
    if(ringArea(outer)<MIN_AREA) return;
    const simp=dp(outer,EPS);
    if(simp.length<4) return;
    const a=ringArea(simp);
    if(a>bestA){bestA=a; best=simp;}
    totalPts+=simp.length;
    d+='M'+simp.map(([x,y])=>x.toFixed(1)+','+y.toFixed(1)).join('L')+'Z';
  });
  let cx=0,cy=0;
  if(best){
    let a=0,x=0,y=0;
    for(let i=0,j=best.length-1;i<best.length;j=i++){
      const cr=best[j][0]*best[i][1]-best[i][0]*best[j][1];
      a+=cr; x+=(best[j][0]+best[i][0])*cr; y+=(best[j][1]+best[i][1])*cr;
    }
    a*=0.5; cx=x/(6*a); cy=y/(6*a);
  }
  estados[f.uf]={ nome:f.nome, macro:f.macro, cx:+cx.toFixed(1), cy:+cy.toFixed(1), d };
});

const js='/* ---------------------------------------------------------------------------\n'+
'   Mapa do Brasil por estado.\n\n'+
'   Gerado a partir do GeoJSON do IBGE (geodata-br-states), reprojetado em\n'+
'   Albers equal-area cônica (paralelos padrão -2° e -28°, meridiano -54°) e\n'+
'   simplificado por Douglas-Peucker. Cada estado é um path fechado dentro do\n'+
'   viewBox 0 0 '+W+' '+H+'; cx/cy é o centróide, usado para ancorar rótulo e bolha.\n\n'+
'   Para refazer: node tools/mapa-brasil.js <geojson> <saida.js>\n'+
'   --------------------------------------------------------------------------- */\n\n'+
'window.BR_MAPA = {\n  viewBox: \''+'0 0 '+W+' '+H+'\',\n  estados: {\n' +
Object.keys(estados).sort().map(uf=>'    '+uf+': '+JSON.stringify(estados[uf])).join(',\n') +
'\n  }\n};\n';
fs.writeFileSync(out,js);
console.log('pontos:',totalPts,'| KB:',(js.length/1024).toFixed(1),'| estados:',Object.keys(estados).length);
Object.keys(estados).forEach(u=>{ if(!estados[u].d) console.log('VAZIO:',u); });
