const FONT = [[0,0,0,0,0,0,0,0],[24,60,60,24,24,0,24,0],[54,54,0,0,0,0,0,0],[54,54,127,54,127,54,54,0],[12,62,3,30,48,31,12,0],[0,99,51,24,12,102,99,0],[28,54,28,110,59,51,110,0],[6,6,3,0,0,0,0,0],[24,12,6,6,6,12,24,0],[6,12,24,24,24,12,6,0],[0,102,60,255,60,102,0,0],[0,12,12,63,12,12,0,0],[0,0,0,0,0,12,12,6],[0,0,0,63,0,0,0,0],[0,0,0,0,0,12,12,0],[96,48,24,12,6,3,1,0],[62,99,115,123,111,103,62,0],[12,14,12,12,12,12,63,0],[30,51,48,28,6,51,63,0],[30,51,48,28,48,51,30,0],[56,60,54,51,127,48,120,0],[63,3,31,48,48,51,30,0],[28,6,3,31,51,51,30,0],[63,51,48,24,12,12,12,0],[30,51,51,30,51,51,30,0],[30,51,51,62,48,24,14,0],[0,12,12,0,0,12,12,0],[0,12,12,0,0,12,12,6],[24,12,6,3,6,12,24,0],[0,0,63,0,0,63,0,0],[6,12,24,48,24,12,6,0],[30,51,48,24,12,0,12,0],[62,99,123,123,123,3,30,0],[12,30,51,51,63,51,51,0],[63,102,102,62,102,102,63,0],[60,102,3,3,3,102,60,0],[31,54,102,102,102,54,31,0],[127,70,22,30,22,70,127,0],[127,70,22,30,22,6,15,0],[60,102,3,3,115,102,124,0],[51,51,51,63,51,51,51,0],[30,12,12,12,12,12,30,0],[120,48,48,48,51,51,30,0],[103,102,54,30,54,102,103,0],[15,6,6,6,70,102,127,0],[99,119,127,127,107,99,99,0],[99,103,111,123,115,99,99,0],[28,54,99,99,99,54,28,0],[63,102,102,62,6,6,15,0],[30,51,51,51,59,30,56,0],[63,102,102,62,54,102,103,0],[30,51,7,14,56,51,30,0],[63,45,12,12,12,12,30,0],[51,51,51,51,51,51,63,0],[51,51,51,51,51,30,12,0],[99,99,99,107,127,119,99,0],[99,99,54,28,28,54,99,0],[51,51,51,30,12,12,30,0],[127,99,49,24,76,102,127,0],[30,6,6,6,6,6,30,0],[3,6,12,24,48,96,64,0],[30,24,24,24,24,24,30,0],[8,28,54,99,0,0,0,0],[0,0,0,0,0,0,0,255],[12,12,24,0,0,0,0,0],[0,0,30,48,62,51,110,0],[7,6,6,62,102,102,59,0],[0,0,30,51,3,51,30,0],[56,48,48,62,51,51,110,0],[0,0,30,51,63,3,30,0],[28,54,6,15,6,6,15,0],[0,0,110,51,51,62,48,31],[7,6,54,110,102,102,103,0],[12,0,14,12,12,12,30,0],[48,0,48,48,48,51,51,30],[7,6,102,54,30,54,103,0],[14,12,12,12,12,12,30,0],[0,0,51,127,127,107,99,0],[0,0,31,51,51,51,51,0],[0,0,30,51,51,51,30,0],[0,0,59,102,102,62,6,15],[0,0,110,51,51,62,48,120],[0,0,59,110,102,6,15,0],[0,0,62,3,30,48,31,0],[8,12,62,12,12,44,24,0],[0,0,51,51,51,51,110,0],[0,0,51,51,51,30,12,0],[0,0,99,107,127,127,54,0],[0,0,99,54,28,54,99,0],[0,0,51,51,51,62,48,31],[0,0,63,25,12,38,63,0],[56,12,12,7,12,12,56,0],[24,24,24,0,24,24,24,0],[7,12,12,56,12,12,7,0],[110,59,0,0,0,0,0,0]];
const W = 320, H = 240, S = 3;
const cv = document.getElementById("screen");
const vctx = cv.getContext("2d");
const off = document.createElement("canvas");
off.width = W; off.height = H;
const octx = off.getContext("2d");
let img = octx.createImageData(W, H);

let els = [];
let sel = null;
let multi = [];
let idc = 1;
let bg = {r:14,g:32,b:80};
let newColor = {r:51,g:224,b:255};
let drag = null;
let painting = false;
let paintVal = false;
let gridOn = false;
let snapOn = false;
let gridSize = 8;
let history = [];
let histIdx = -1;

const TYPES = {
  box:{label:"Box"},
  disc:{label:"Disc"},
  rectFill:{label:"Fill Rect"},
  rectLine:{label:"Border Rect"},
  line:{label:"Line"},
  circleFill:{label:"Fill Circle"},
  circleLine:{label:"Ring"},
  text:{label:"Text"},
  icon:{label:"Icon"}
};

const PRESETS = ["#33e0ff","#ffcc33","#5fe08c","#ff5a6a","#ffffff","#9fb4e6","#2850c8","#0a1230"];
const EYE_ON='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="21" x2="21" y2="3"/></svg>';
const COPY='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="1"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/></svg>';

let names = {
  clear:"FrameBufferClear",
  fillRect:"FrameBufferFillRect",
  rect:"FrameBufferRect",
  line:"FrameBufferLine",
  fillCircle:"FrameBufferFillCircle",
  circle:"FrameBufferCircle",
  text:"FrameBufferText",
  flush:"FrameBufferFlush",
  color:"RGB",
  icon:"FrameBufferIcon",
  box:"FrameBufferBox",
  disc:"FrameBufferDisc"
};

function hex2rgb(h){
  h = h.replace("#","");
  return {r:parseInt(h.substr(0,2),16), g:parseInt(h.substr(2,2),16), b:parseInt(h.substr(4,2),16)};
}
function rgb2hex(c){
  const p = v => v.toString(16).padStart(2,"0");
  return "#"+p(c.r)+p(c.g)+p(c.b);
}
function clampI(v,lo,hi){ v = Math.round(v); return v<lo?lo:(v>hi?hi:v); }

function px(x,y,c){
  if(x<0||y<0||x>=W||y>=H){ return; }
  const i = (y*W+x)*4;
  img.data[i]=c.r; img.data[i+1]=c.g; img.data[i+2]=c.b; img.data[i+3]=255;
}
function dFillRect(x,y,w,h,c){
  for(let j=y;j<y+h;j++){
    for(let i=x;i<x+w;i++){
      px(i,j,c);
    }
  }
}
function dHline(x,y,w,c){
  for(let i=x;i<x+w;i++){ px(i,y,c); }
}
function dVline(x,y,h,c){
  for(let j=y;j<y+h;j++){ px(x,j,c); }
}
function dRect(x,y,w,h,c){
  dHline(x,y,w,c); dHline(x,y+h-1,w,c); dVline(x,y,h,c); dVline(x+w-1,y,h,c);
}
function dLine(x0,y0,x1,y1,c){
  let dx=Math.abs(x1-x0), dy=Math.abs(y1-y0);
  let sx=x0<x1?1:-1, sy=y0<y1?1:-1;
  let err=dx-dy;
  while(true){
    px(x0,y0,c);
    if(x0===x1&&y0===y1){ break; }
    let e2=err*2;
    if(e2>-dy){ err-=dy; x0+=sx; }
    if(e2<dx){ err+=dx; y0+=sy; }
  }
}
function dCircle(cx,cy,r,c){
  let x=r,y=0,err=1-r;
  while(x>=y){
    px(cx+x,cy+y,c); px(cx+y,cy+x,c); px(cx-y,cy+x,c); px(cx-x,cy+y,c);
    px(cx-x,cy-y,c); px(cx-y,cy-x,c); px(cx+y,cy-x,c); px(cx+x,cy-y,c);
    y++;
    if(err<0){ err+=2*y+1; }
    else{ x--; err+=2*(y-x)+1; }
  }
}
function dFillCircle(cx,cy,r,c){
  let x=r,y=0,err=1-r;
  while(x>=y){
    dHline(cx-x,cy+y,2*x+1,c); dHline(cx-x,cy-y,2*x+1,c);
    dHline(cx-y,cy+x,2*y+1,c); dHline(cx-y,cy-x,2*y+1,c);
    y++;
    if(err<0){ err+=2*y+1; }
    else{ x--; err+=2*(y-x)+1; }
  }
}
function isqrtJS(v){
  if(v<0){ return 0; }
  let r=0;
  while((r+1)*(r+1)<=v){ r++; }
  return r;
}
function dFillRoundRect(x,y,w,h,r,c){
  if(w<=0||h<=0){ return; }
  if(r<0){ r=0; }
  let m=Math.floor(Math.min(w,h)/2);
  if(r>m){ r=m; }
  for(let row=0;row<h;row++){
    let inset=0;
    if(row<r){
      let dy=r-1-row;
      inset=r-isqrtJS(r*r-dy*dy);
    }else if(row>=h-r){
      let dy=row-(h-r);
      inset=r-isqrtJS(r*r-dy*dy);
    }
    dHline(x+inset,y+row,w-2*inset,c);
  }
}
function dBox(e){
  if(e.border>0){
    dFillRoundRect(e.x,e.y,e.w,e.h,e.radius,e.borderColor);
    let ir=e.radius-e.border;
    if(ir<0){ ir=0; }
    dFillRoundRect(e.x+e.border,e.y+e.border,e.w-2*e.border,e.h-2*e.border,ir,e.color);
  }else{
    dFillRoundRect(e.x,e.y,e.w,e.h,e.radius,e.color);
  }
}
function dDisc(e){
  if(e.border>0){
    dFillCircle(e.cx,e.cy,e.r,e.borderColor);
    let ir=e.r-e.border;
    if(ir>0){ dFillCircle(e.cx,e.cy,ir,e.color); }
  }else{
    dFillCircle(e.cx,e.cy,e.r,e.color);
  }
}
function dChar(x,y,ch,c,scale){
  let code = ch.charCodeAt(0);
  if(code<0x20||code>0x7E){ code = 0x3F; }
  const g = FONT[code-0x20];
  for(let row=0;row<8;row++){
    let bits=g[row];
    for(let col=0;col<8;col++){
      if(bits&(1<<col)){
        if(scale<=1){ px(x+col,y+row,c); }
        else{ dFillRect(x+col*scale,y+row*scale,scale,scale,c); }
      }
    }
  }
}
function dText(x,y,s,c,scale){
  let cx=x;
  for(let i=0;i<s.length;i++){
    dChar(cx,y,s[i],c,scale);
    cx+=8*scale;
  }
}
function textW(s,scale){ return s.length*8*scale; }

function dIcon(e){
  for(let r=0;r<e.h;r++){
    let bits=e.bits[r]>>>0;
    for(let c=0;c<e.w;c++){
      if(bits&(1<<c)){
        if(e.scale<=1){ px(e.x+c,e.y+r,e.color); }
        else{ dFillRect(e.x+c*e.scale,e.y+r*e.scale,e.scale,e.scale,e.color); }
      }
    }
  }
}

function drawEl(e){
  if(e.type==="box"){ dBox(e); }
  else if(e.type==="disc"){ dDisc(e); }
  else if(e.type==="rectFill"){ dFillRect(e.x,e.y,e.w,e.h,e.color); }
  else if(e.type==="rectLine"){ dRect(e.x,e.y,e.w,e.h,e.color); }
  else if(e.type==="line"){ dLine(e.x1,e.y1,e.x2,e.y2,e.color); }
  else if(e.type==="circleFill"){ dFillCircle(e.cx,e.cy,e.r,e.color); }
  else if(e.type==="circleLine"){ dCircle(e.cx,e.cy,e.r,e.color); }
  else if(e.type==="text"){ dText(e.x,e.y,e.text,e.color,e.scale); }
  else if(e.type==="icon"){ dIcon(e); }
}

function bbox(e){
  if(e.type==="line"){
    let x=Math.min(e.x1,e.x2), y=Math.min(e.y1,e.y2);
    return {x, y, w:Math.abs(e.x2-e.x1)+1, h:Math.abs(e.y2-e.y1)+1};
  }
  if(e.type==="circleFill"||e.type==="circleLine"||e.type==="disc"){
    return {x:e.cx-e.r, y:e.cy-e.r, w:e.r*2+1, h:e.r*2+1};
  }
  if(e.type==="text"){
    return {x:e.x, y:e.y, w:textW(e.text,e.scale), h:8*e.scale};
  }
  if(e.type==="icon"){
    return {x:e.x, y:e.y, w:e.w*e.scale, h:e.h*e.scale};
  }
  return {x:e.x, y:e.y, w:e.w, h:e.h};
}
function handles(e){
  if(e.type==="line"){
    return [{n:"p1",x:e.x1,y:e.y1},{n:"p2",x:e.x2,y:e.y2}];
  }
  if(e.type==="circleFill"||e.type==="circleLine"||e.type==="disc"){
    return [{n:"r",x:e.cx+e.r,y:e.cy},{n:"r",x:e.cx,y:e.cy+e.r},{n:"r",x:e.cx-e.r,y:e.cy},{n:"r",x:e.cx,y:e.cy-e.r}];
  }
  if(e.type==="text"){
    return [{n:"scale",x:e.x+textW(e.text,e.scale),y:e.y+8*e.scale}];
  }
  if(e.type==="icon"){
    return [{n:"scale",x:e.x+e.w*e.scale,y:e.y+e.h*e.scale}];
  }
  let L=e.x,R=e.x+e.w,T=e.y,B=e.y+e.h,mx=e.x+e.w/2,my=e.y+e.h/2;
  return [
    {n:"nw",x:L,y:T},{n:"n",x:mx,y:T},{n:"ne",x:R,y:T},
    {n:"e",x:R,y:my},{n:"se",x:R,y:B},{n:"s",x:mx,y:B},
    {n:"sw",x:L,y:B},{n:"w",x:L,y:my}
  ];
}

function render(){
  img = octx.createImageData(W,H);
  for(let i=0;i<W*H;i++){
    let k=i*4;
    img.data[k]=bg.r; img.data[k+1]=bg.g; img.data[k+2]=bg.b; img.data[k+3]=255;
  }
  for(const e of els){ if(!e.hidden){ drawEl(e); } }
  octx.putImageData(img,0,0);
  vctx.imageSmoothingEnabled=false;
  vctx.clearRect(0,0,W*S,H*S);
  vctx.drawImage(off,0,0,W,H,0,0,W*S,H*S);
  if(gridOn && gridSize>0){
    vctx.strokeStyle="rgba(255,255,255,0.14)";
    vctx.lineWidth=1;
    vctx.beginPath();
    for(let gx=0;gx<=W;gx+=gridSize){ vctx.moveTo(gx*S+0.5,0); vctx.lineTo(gx*S+0.5,H*S); }
    for(let gy=0;gy<=H;gy+=gridSize){ vctx.moveTo(0,gy*S+0.5); vctx.lineTo(W*S,gy*S+0.5); }
    vctx.stroke();
  }
  for(const e of multi){
    if(e===sel){ continue; }
    const mb=bbox(e);
    vctx.strokeStyle="#2f6fb0";
    vctx.lineWidth=1.5;
    vctx.setLineDash([4,4]);
    vctx.strokeRect(mb.x*S+0.5,mb.y*S+0.5,mb.w*S,mb.h*S);
    vctx.setLineDash([]);
  }
  if(sel){
    const b=bbox(sel);
    vctx.strokeStyle="#e08a00";
    vctx.lineWidth=1.5;
    vctx.setLineDash([6,4]);
    vctx.strokeRect(b.x*S+0.5,b.y*S+0.5,b.w*S,b.h*S);
    vctx.setLineDash([]);
    vctx.fillStyle="#e08a00";
    for(const h of handles(sel)){
      vctx.fillRect(h.x*S-4,h.y*S-4,8,8);
    }
  }
}

function logical(evt){
  const r=cv.getBoundingClientRect();
  const cxp = evt.touches ? evt.touches[0].clientX : evt.clientX;
  const cyp = evt.touches ? evt.touches[0].clientY : evt.clientY;
  return {
    x: Math.round((cxp-r.left)/r.width*W),
    y: Math.round((cyp-r.top)/r.height*H)
  };
}
function tol(){
  const r=cv.getBoundingClientRect();
  return 10*W/r.width;
}
function near(p,h){
  const t=tol();
  return Math.abs(p.x-h.x)<t && Math.abs(p.y-h.y)<t;
}
function distSeg(p,e){
  const x1=e.x1,y1=e.y1,x2=e.x2,y2=e.y2;
  const dx=x2-x1,dy=y2-y1;
  const len2=dx*dx+dy*dy;
  let t = len2? ((p.x-x1)*dx+(p.y-y1)*dy)/len2 : 0;
  t=Math.max(0,Math.min(1,t));
  const px2=x1+t*dx, py2=y1+t*dy;
  return Math.hypot(p.x-px2,p.y-py2);
}
function hitEl(e,p){
  if(e.type==="line"){ return distSeg(p,e)<tol(); }
  const b=bbox(e);
  return p.x>=b.x-1 && p.x<=b.x+b.w+1 && p.y>=b.y-1 && p.y<=b.y+b.h+1;
}

function down(evt){
  evt.preventDefault();
  if(document.activeElement && document.activeElement.blur){ document.activeElement.blur(); }
  const p=logical(evt);
  if(sel){
    for(const h of handles(sel)){
      if(near(p,h)){
        drag={mode:"resize",name:h.n,o:JSON.parse(JSON.stringify(sel))};
        return;
      }
    }
  }
  for(let i=els.length-1;i>=0;i--){
    if(!els[i].hidden && hitEl(els[i],p)){
      if(evt.shiftKey){
        toggleSel(els[i]);
        render();
        return;
      }
      if(multi.length>1 && multi.includes(els[i])){
        sel=els[i]; renderProps(); syncList();
        drag={mode:"gmove",start:p,snaps:multi.map(e=>({e,o:JSON.parse(JSON.stringify(e))}))};
        render();
        return;
      }
      select(els[i]);
      drag={mode:"move",start:p,o:JSON.parse(JSON.stringify(els[i]))};
      render();
      return;
    }
  }
  if(!evt.shiftKey){ select(null); }
  render();
}
function move(evt){
  const p=logical(evt);
  document.getElementById("coord").textContent = p.x+","+p.y;
  if(!drag){ return; }
  evt.preventDefault();
  if(drag.mode==="move"||drag.mode==="gmove"){
    if(!drag.active){
      if(Math.abs(p.x-drag.start.x)<3 && Math.abs(p.y-drag.start.y)<3){ return; }
      drag.active=true;
    }
    const dx=p.x-drag.start.x, dy=p.y-drag.start.y;
    if(drag.mode==="move"){ applyMove(sel,drag.o,dx,dy); }
    else{ for(const s of drag.snaps){ applyMove(s.e,s.o,dx,dy); } }
  }
  else{ applyResize(sel,drag.name,p); }
  render(); renderCode(); syncProps(); syncList();
}
function up(){ if(drag){ drag=null; save(); } }

function applyMove(e,o,dx,dy,fine){
  const sn = v => (snapOn && !fine && gridSize>0) ? Math.round(v/gridSize)*gridSize : v;
  if(e.type==="line"){
    e.x1=clampI(sn(o.x1+dx),0,W-1); e.y1=clampI(sn(o.y1+dy),0,H-1);
    e.x2=clampI(sn(o.x2+dx),0,W-1); e.y2=clampI(sn(o.y2+dy),0,H-1);
  }
  else if(e.type==="circleFill"||e.type==="circleLine"||e.type==="disc"){
    e.cx=clampI(sn(o.cx+dx),0,W); e.cy=clampI(sn(o.cy+dy),0,H);
  }
  else{
    const b=bbox({...o});
    e.x=clampI(sn(o.x+dx),0,Math.max(0,W-b.w));
    e.y=clampI(sn(o.y+dy),0,Math.max(0,H-b.h));
  }
}
function applyResize(e,name,p){
  const sn = v => (snapOn && gridSize>0) ? Math.round(v/gridSize)*gridSize : v;
  if(e.type==="line"){
    if(name==="p1"){ e.x1=clampI(sn(p.x),0,W-1); e.y1=clampI(sn(p.y),0,H-1); }
    else{ e.x2=clampI(sn(p.x),0,W-1); e.y2=clampI(sn(p.y),0,H-1); }
    return;
  }
  if(e.type==="circleFill"||e.type==="circleLine"||e.type==="disc"){
    e.r=Math.max(1,sn(Math.round(Math.hypot(p.x-e.cx,p.y-e.cy))));
    return;
  }
  if(e.type==="text"){
    e.scale=clampI((p.y-e.y)/8,1,16);
    return;
  }
  if(e.type==="icon"){
    e.scale=clampI((p.y-e.y)/e.h,1,16);
    return;
  }
  let L=e.x,R=e.x+e.w,T=e.y,B=e.y+e.h;
  if(name.includes("w")){ L=clampI(sn(p.x),0,R-1); }
  if(name.includes("e")){ R=clampI(sn(p.x),L+1,W); }
  if(name.includes("n")){ T=clampI(sn(p.y),0,B-1); }
  if(name.includes("s")){ B=clampI(sn(p.y),T+1,H); }
  e.x=L; e.y=T; e.w=R-L; e.h=B-T;
}

function defaultEl(type,at){
  const c={...newColor};
  const x=clampI(at?at.x-20:24,0,W-40);
  const y=clampI(at?at.y-12:24,0,H-24);
  if(type==="box"){ return {id:idc++,type,x,y,w:120,h:60,radius:8,border:1,color:c,borderColor:{r:255,g:255,b:255}}; }
  if(type==="disc"){ return {id:idc++,type,cx:clampI(x+30,0,W),cy:clampI(y+30,0,H),r:28,border:2,color:c,borderColor:{r:255,g:255,b:255}}; }
  if(type==="rectFill"||type==="rectLine"){ return {id:idc++,type,x,y,w:100,h:44,color:c}; }
  if(type==="line"){ return {id:idc++,type,x1:x,y1:y,x2:clampI(x+90,0,W-1),y2:clampI(y+40,0,H-1),color:c}; }
  if(type==="circleFill"||type==="circleLine"){ return {id:idc++,type,cx:clampI(x+30,0,W),cy:clampI(y+30,0,H),r:28,color:c}; }
  if(type==="icon"){
    const iw=16,ih=16,bits=[];
    for(let r=0;r<ih;r++){
      let v=0;
      for(let cc=0;cc<iw;cc++){
        if(Math.abs(cc-7.5)+Math.abs(r-7.5)<7.5){ v|=(1<<cc); }
      }
      bits.push(v>>>0);
    }
    return {id:idc++,type,x,y,w:iw,h:ih,scale:2,color:c,bits};
  }
  return {id:idc++,type,x,y,text:"TEXT",scale:2,color:c};
}
function addEl(type,at){
  const e=defaultEl(type,at);
  els.push(e);
  select(e);
  render(); renderCode(); syncList(); save();
}

function select(e){
  sel=e;
  multi = e ? [e] : [];
  renderProps(); syncList();
}
function toggleSel(e){
  const i=multi.indexOf(e);
  if(i>=0){
    multi.splice(i,1);
    sel = multi.length ? multi[multi.length-1] : null;
  }else{
    multi.push(e);
    sel=e;
  }
  renderProps(); syncList();
}

function num(id,v){ return `<input type="number" id="${id}" value="${v}">`; }

function renderProps(){
  const host=document.getElementById("props");
  if(!sel){ host.innerHTML='<div class="empty">No block selected.</div>'; return; }
  const e=sel;
  let f="";
  let hasBorder=false;
  if(e.type==="line"){
    f=`<div class="grid2">
        <label class="fld">X1 ${num("f_x1",e.x1)}</label>
        <label class="fld">Y1 ${num("f_y1",e.y1)}</label>
        <label class="fld">X2 ${num("f_x2",e.x2)}</label>
        <label class="fld">Y2 ${num("f_y2",e.y2)}</label>
       </div>`;
  }
  else if(e.type==="disc"){
    hasBorder=true;
    f=`<div class="grid2">
        <label class="fld">CX ${num("f_cx",e.cx)}</label>
        <label class="fld">CY ${num("f_cy",e.cy)}</label>
        <label class="fld">R ${num("f_r",e.r)}</label>
        <label class="fld">Border ${num("f_border",e.border)}</label>
       </div>
       <label class="fld" style="margin-top:8px">Border color <input type="color" id="f_bcolor" value="${rgb2hex(e.borderColor)}"></label>`;
  }
  else if(e.type==="circleFill"||e.type==="circleLine"){
    f=`<div class="grid2">
        <label class="fld">CX ${num("f_cx",e.cx)}</label>
        <label class="fld">CY ${num("f_cy",e.cy)}</label>
        <label class="fld">R ${num("f_r",e.r)}</label>
       </div>`;
  }
  else if(e.type==="box"){
    hasBorder=true;
    f=`<div class="grid2">
        <label class="fld">X ${num("f_x",e.x)}</label>
        <label class="fld">Y ${num("f_y",e.y)}</label>
        <label class="fld">W ${num("f_w",e.w)}</label>
        <label class="fld">H ${num("f_h",e.h)}</label>
        <label class="fld">Radius ${num("f_radius",e.radius)}</label>
        <label class="fld">Border ${num("f_border",e.border)}</label>
       </div>
       <label class="fld" style="margin-top:8px">Border color <input type="color" id="f_bcolor" value="${rgb2hex(e.borderColor)}"></label>`;
  }
  else if(e.type==="text"){
    f=`<label class="fld">Text <input type="text" id="f_text" value="${e.text.replace(/"/g,"&quot;")}"></label>
       <div class="grid2" style="margin-top:8px">
        <label class="fld">X ${num("f_x",e.x)}</label>
        <label class="fld">Y ${num("f_y",e.y)}</label>
        <label class="fld">Scale ${num("f_scale",e.scale)}</label>
       </div>`;
  }
  else if(e.type==="icon"){
    f=`<div class="grid2">
        <label class="fld">X ${num("f_x",e.x)}</label>
        <label class="fld">Y ${num("f_y",e.y)}</label>
        <label class="fld">W ${num("f_w",e.w)}</label>
        <label class="fld">H ${num("f_h",e.h)}</label>
        <label class="fld">Scale ${num("f_scale",e.scale)}</label>
       </div>
       <div id="pgrid" class="pgrid"></div>
       <label class="fld" style="margin-top:10px;flex-direction:column;align-items:stretch;gap:3px">Import C array<textarea id="f_import" rows="3" placeholder="{ 0x00, 0x1F, 0x3E, ... }"></textarea></label>
       <button class="btn" id="f_importbtn" style="margin-top:6px">Load into icon</button>
       <button class="btn danger" id="f_clearart" style="margin-top:6px;margin-left:6px">Clear art</button>`;
  }
  else{
    f=`<div class="grid2">
        <label class="fld">X ${num("f_x",e.x)}</label>
        <label class="fld">Y ${num("f_y",e.y)}</label>
        <label class="fld">W ${num("f_w",e.w)}</label>
        <label class="fld">H ${num("f_h",e.h)}</label>
       </div>`;
  }
  host.innerHTML=`
    <div class="row" style="justify-content:space-between;margin-bottom:10px">
      <span style="color:var(--accent);font-size:12px;letter-spacing:1px">${TYPES[e.type].label}</span>
      <div class="row">
        <input type="color" id="f_color" value="${rgb2hex(e.color)}">
        <button class="btn danger" id="f_del">Del</button>
      </div>
    </div>
    ${f}`;
  host.querySelectorAll("input[type=number],input[type=text]").forEach(inp=>{
    inp.addEventListener("input",onProp);
  });
  document.getElementById("f_color").addEventListener("input",ev=>{
    e.color=hex2rgb(ev.target.value); render(); renderCode(); syncList(); save();
  });
  document.getElementById("f_del").addEventListener("click",()=>delEl(e));
  if(hasBorder){
    const bc=document.getElementById("f_bcolor");
    if(bc){ bc.addEventListener("input",ev=>{ e.borderColor=hex2rgb(ev.target.value); render(); renderCode(); syncList(); save(); }); }
  }
  if(e.type==="icon"){
    buildIconGrid(e);
    const ib=document.getElementById("f_importbtn");
    if(ib){ ib.addEventListener("click",()=>importIcon(e)); }
    const cb=document.getElementById("f_clearart");
    if(cb){ cb.addEventListener("click",()=>clearIcon(e)); }
  }
}
function clearIcon(e){
  e.bits=e.bits.map(()=>0);
  render(); renderCode(); save(); renderProps();
}
function parseIconArray(txt){
  const b0=txt.indexOf("{"), b1=txt.lastIndexOf("}");
  const body=(b0>=0&&b1>b0)?txt.slice(b0+1,b1):txt;
  const out=[];
  const re=/0x[0-9a-fA-F]+|0b[01]+|\d+/g;
  let m;
  while((m=re.exec(body))){
    let t=m[0], v;
    if(t[1]==="x"||t[1]==="X"){ v=parseInt(t,16); }
    else if(t[1]==="b"||t[1]==="B"){ v=parseInt(t.slice(2),2); }
    else{ v=parseInt(t,10); }
    out.push((v>>>0));
  }
  return out;
}
function importIcon(e){
  const ta=document.getElementById("f_import");
  if(!ta){ return; }
  const nums=parseIconArray(ta.value);
  if(!nums.length){ return; }
  let hi=0;
  for(const v of nums){
    for(let b=0;b<32;b++){
      if(v&(1<<b)){ hi=Math.max(hi,b+1); }
    }
  }
  e.h=clampI(nums.length,1,64);
  e.w=clampI(Math.max(e.w,hi),1,32);
  const mask=e.w>=32?0xFFFFFFFF:((1<<e.w)-1);
  e.bits=[];
  for(let r=0;r<e.h;r++){
    e.bits.push(((r<nums.length?nums[r]:0)&mask)>>>0);
  }
  render(); renderCode(); syncList(); save(); renderProps();
}
function buildIconGrid(e){
  const g=document.getElementById("pgrid");
  if(!g){ return; }
  const cell=Math.max(6,Math.min(14,Math.floor(230/e.w)));
  g.style.gridTemplateColumns=`repeat(${e.w}, ${cell}px)`;
  g.innerHTML="";
  for(let r=0;r<e.h;r++){
    for(let c=0;c<e.w;c++){
      const d=document.createElement("div");
      d.className="pcell"+(((e.bits[r]>>>0)&(1<<c))?" on":"");
      d.style.width=cell+"px"; d.style.height=cell+"px";
      d.dataset.r=r; d.dataset.c=c;
      d.addEventListener("mousedown",ev=>{ ev.preventDefault(); painting=true; paintCell(e,r,c,d); });
      d.addEventListener("mouseenter",()=>{ if(painting){ paintEnter(e,r,c,d); } });
      g.appendChild(d);
    }
  }
}
function paintCell(e,r,c,d){
  e.bits[r]=(e.bits[r]>>>0)^(1<<c);
  const on=((e.bits[r]>>>0)&(1<<c))!==0;
  d.classList.toggle("on",on);
  paintVal=on;
  render(); renderCode(); save();
}
function paintEnter(e,r,c,d){
  const cur=((e.bits[r]>>>0)&(1<<c))!==0;
  if(cur!==paintVal){
    e.bits[r]=(e.bits[r]>>>0)^(1<<c);
    d.classList.toggle("on",paintVal);
    render(); renderCode(); save();
  }
}
function resizeIconBits(e,nw,nh){
  const old=e.bits;
  const mask=nw>=32?0xFFFFFFFF:((1<<nw)-1);
  const nb=[];
  for(let r=0;r<nh;r++){
    let v=r<old.length?(old[r]>>>0):0;
    nb.push((v&mask)>>>0);
  }
  e.bits=nb; e.w=nw; e.h=nh;
}
function onProp(){
  const e=sel; if(!e){ return; }
  const g=id=>document.getElementById(id);
  const gv=id=> g(id)?parseInt(g(id).value||"0",10):0;
  if(e.type==="line"){
    e.x1=clampI(gv("f_x1"),0,W-1); e.y1=clampI(gv("f_y1"),0,H-1);
    e.x2=clampI(gv("f_x2"),0,W-1); e.y2=clampI(gv("f_y2"),0,H-1);
  }
  else if(e.type==="disc"){
    e.cx=clampI(gv("f_cx"),0,W); e.cy=clampI(gv("f_cy"),0,H); e.r=Math.max(1,gv("f_r")); e.border=Math.max(0,gv("f_border"));
  }
  else if(e.type==="circleFill"||e.type==="circleLine"){
    e.cx=clampI(gv("f_cx"),0,W); e.cy=clampI(gv("f_cy"),0,H); e.r=Math.max(1,gv("f_r"));
  }
  else if(e.type==="box"){
    e.x=clampI(gv("f_x"),0,W); e.y=clampI(gv("f_y"),0,H); e.w=Math.max(1,gv("f_w")); e.h=Math.max(1,gv("f_h"));
    e.radius=Math.max(0,gv("f_radius")); e.border=Math.max(0,gv("f_border"));
  }
  else if(e.type==="text"){
    e.text=g("f_text").value; e.x=clampI(gv("f_x"),0,W); e.y=clampI(gv("f_y"),0,H); e.scale=clampI(gv("f_scale"),1,16);
  }
  else if(e.type==="icon"){
    e.x=clampI(gv("f_x"),0,W); e.y=clampI(gv("f_y"),0,H); e.scale=clampI(gv("f_scale"),1,16);
    const nw=clampI(gv("f_w"),1,32), nh=clampI(gv("f_h"),1,64);
    if(nw!==e.w||nh!==e.h){ resizeIconBits(e,nw,nh); render(); renderCode(); syncList(); save(); renderProps(); return; }
  }
  else{
    e.x=clampI(gv("f_x"),0,W); e.y=clampI(gv("f_y"),0,H); e.w=Math.max(1,gv("f_w")); e.h=Math.max(1,gv("f_h"));
  }
  render(); renderCode(); syncList(); save();
}
function syncProps(){
  if(!sel){ return; }
  const set=(id,v)=>{ const el=document.getElementById(id); if(el && document.activeElement!==el){ el.value=v; } };
  const e=sel;
  if(e.type==="line"){ set("f_x1",e.x1);set("f_y1",e.y1);set("f_x2",e.x2);set("f_y2",e.y2); }
  else if(e.type==="disc"){ set("f_cx",e.cx);set("f_cy",e.cy);set("f_r",e.r);set("f_border",e.border); }
  else if(e.type==="circleFill"||e.type==="circleLine"){ set("f_cx",e.cx);set("f_cy",e.cy);set("f_r",e.r); }
  else if(e.type==="box"){ set("f_x",e.x);set("f_y",e.y);set("f_w",e.w);set("f_h",e.h);set("f_radius",e.radius);set("f_border",e.border); }
  else if(e.type==="text"){ set("f_x",e.x);set("f_y",e.y);set("f_scale",e.scale); }
  else if(e.type==="icon"){ set("f_x",e.x);set("f_y",e.y);set("f_scale",e.scale); }
  else{ set("f_x",e.x);set("f_y",e.y);set("f_w",e.w);set("f_h",e.h); }
}

function delEl(e){
  els=els.filter(x=>x!==e);
  const mi=multi.indexOf(e);
  if(mi>=0){ multi.splice(mi,1); }
  if(sel===e){ sel = multi.length ? multi[multi.length-1] : null; }
  render(); renderCode(); renderProps(); syncList(); save();
}
function raise(e,dir){
  const i=els.indexOf(e);
  const j=i+dir;
  if(j<0||j>=els.length){ return; }
  els.splice(i,1); els.splice(j,0,e);
  render(); renderCode(); syncList(); save();
}

function cloneEl(e){
  const c=JSON.parse(JSON.stringify(e));
  c.id=idc++;
  shiftEl(c,8,8);
  return c;
}
function dupEl(e){
  const i=els.indexOf(e);
  if(i<0){ return null; }
  const c=cloneEl(e);
  els.splice(i+1,0,c);
  select(c);
  render(); renderCode(); syncList(); save();
  return c;
}
function dupSelection(){
  if(!multi.length){ return; }
  const src=[...multi];
  const clones=[];
  for(const e of src){
    const i=els.indexOf(e);
    const c=cloneEl(e);
    els.splice(i+1,0,c);
    clones.push(c);
  }
  multi=clones;
  sel=clones[clones.length-1];
  render(); renderCode(); renderProps(); syncList(); save();
}
function shiftEl(e,dx,dy){
  if(e.type==="line"){
    e.x1+=dx; e.y1+=dy; e.x2+=dx; e.y2+=dy;
  }
  else if(e.type==="circleFill"||e.type==="circleLine"||e.type==="disc"){
    e.cx+=dx; e.cy+=dy;
  }
  else{
    e.x+=dx; e.y+=dy;
  }
}
function alignTargets(){
  const selOnly=document.getElementById("selOnly");
  if(selOnly && selOnly.checked && multi.length){ return multi; }
  return els;
}
function areaOf(b){ return b.w*b.h; }
function parentOf(items){
  let p=items[0], best=areaOf(bbox(items[0]));
  for(const e of items){
    const a=areaOf(bbox(e));
    if(a>best){ best=a; p=e; }
  }
  return p;
}
function centerInParent(axis){
  if(multi.length<2){ return; }
  const parent=parentOf(multi);
  const pb=bbox(parent);
  for(const e of multi){
    if(e===parent){ continue; }
    const b=bbox(e);
    if(axis==="h"){
      const target=Math.round(pb.x + (pb.w-b.w)/2);
      shiftEl(e, target-b.x, 0);
    }else{
      const target=Math.round(pb.y + (pb.h-b.h)/2);
      shiftEl(e, 0, target-b.y);
    }
  }
  render(); renderCode(); syncProps(); syncList(); save();
}
function alignVertical(){
  for(const e of alignTargets()){
    const b=bbox(e);
    const target=Math.round(W/2 - b.w/2);
    shiftEl(e, target - b.x, 0);
  }
  render(); renderCode(); syncProps(); syncList(); save();
}
function alignHorizontal(){
  for(const e of alignTargets()){
    const b=bbox(e);
    const target=Math.round(H/2 - b.h/2);
    shiftEl(e, 0, target - b.y);
  }
  render(); renderCode(); syncProps(); syncList(); save();
}

function syncList(){
  const host=document.getElementById("list");
  if(!els.length){ host.innerHTML='<div class="empty">Empty. Add a block.</div>'; return; }
  host.innerHTML="";
  for(let i=els.length-1;i>=0;i--){
    const e=els[i];
    const row=document.createElement("div");
    row.className="li"+(multi.includes(e)?" sel":"")+(e.hidden?" hidden":"");
    const nm = e.type==="text" ? '"'+e.text+'"' : TYPES[e.type].label;
    row.innerHTML=`<span class="t"><span class="chip" style="background:${rgb2hex(e.color)}"></span>${nm}</span>
      <span class="ord"><button data-eye title="Show/Hide">${e.hidden?EYE_OFF:EYE_ON}</button><button data-dup title="Duplicate">${COPY}</button><button data-u>&uarr;</button><button data-d>&darr;</button><button data-x>&times;</button></span>`;
    row.addEventListener("click",ev=>{ if(ev.shiftKey){ toggleSel(e); } else { select(e); } render(); });
    row.querySelector("[data-eye]").addEventListener("click",ev=>{ ev.stopPropagation(); e.hidden=!e.hidden; render(); renderCode(); syncList(); save(); });
    row.querySelector("[data-dup]").addEventListener("click",ev=>{ ev.stopPropagation(); dupEl(e); });
    row.querySelector("[data-u]").addEventListener("click",ev=>{ ev.stopPropagation(); raise(e,1); });
    row.querySelector("[data-d]").addEventListener("click",ev=>{ ev.stopPropagation(); raise(e,-1); });
    row.querySelector("[data-x]").addEventListener("click",ev=>{ ev.stopPropagation(); delEl(e); });
    host.appendChild(row);
  }
}

function rgbStr(c){ return `${names.color}(${c.r}, ${c.g}, ${c.b})`; }
function escC(s){ return s.replace(/\\/g,"\\\\").replace(/"/g,'\\"'); }
function stmt(e){
  const C=rgbStr(e.color);
  if(e.type==="box"){ return `${names.box}(${e.x}, ${e.y}, ${e.w}, ${e.h}, ${C}, ${e.radius}, ${e.border}, ${rgbStr(e.borderColor)});`; }
  if(e.type==="disc"){ return `${names.disc}(${e.cx}, ${e.cy}, ${e.r}, ${C}, ${e.border}, ${rgbStr(e.borderColor)});`; }
  if(e.type==="rectFill"){ return `${names.fillRect}(${e.x}, ${e.y}, ${e.w}, ${e.h}, ${C});`; }
  if(e.type==="rectLine"){ return `${names.rect}(${e.x}, ${e.y}, ${e.w}, ${e.h}, ${C});`; }
  if(e.type==="line"){ return `${names.line}(${e.x1}, ${e.y1}, ${e.x2}, ${e.y2}, ${C});`; }
  if(e.type==="circleFill"){ return `${names.fillCircle}(${e.cx}, ${e.cy}, ${e.r}, ${C});`; }
  if(e.type==="circleLine"){ return `${names.circle}(${e.cx}, ${e.cy}, ${e.r}, ${C});`; }
  if(e.type==="icon"){ return `${names.icon}(${e.x}, ${e.y}, ic_${e.id}, ${e.w}, ${e.h}, ${C}, ${e.scale});`; }
  return `${names.text}(${e.x}, ${e.y}, "${escC(e.text)}", ${C}, ${e.scale});`;
}
function iconArray(e){
  const digits=Math.ceil(e.w/4);
  const rows=e.bits.map(r=>"    0x"+((r>>>0).toString(16).toUpperCase().padStart(digits,"0"))).join(",\n");
  return `static const uint32_t ic_${e.id}[] = {\n${rows}\n};\n\n`;
}
function genPlain(){
  let out="";
  for(const e of els){ if(!e.hidden && e.type==="icon"){ out+=iconArray(e); } }
  out+="void uiRender(void){\n";
  out+="    "+names.clear+"("+rgbStr(bg)+");\n";
  for(const e of els){ if(e.hidden){ continue; } out+="    "+stmt(e)+"\n"; }
  out+="    "+names.flush+"();\n}";
  return out;
}
function hl(code){
  let s=code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const store=[];
  s=s.replace(/"(?:[^"\\]|\\.)*"/g,m=>{ store.push(m); return "@@S"+(store.length-1)+"@@"; });
  s=s.replace(/\b(void|static|const|uint32_t|uint16_t|uint8_t|int|char)\b/g,'<span class="tok-k">$1</span>');
  s=s.replace(/([A-Za-z_][A-Za-z0-9_]*)(\s*\()/g,'<span class="tok-f">$1</span>$2');
  s=s.replace(/\b0x[0-9A-Fa-f]+\b/g,'<span class="tok-n">$&</span>');
  s=s.replace(/\b\d+\b/g,'<span class="tok-n">$&</span>');
  s=s.replace(/([(){}\[\],;])/g,'<span class="tok-p">$1</span>');
  s=s.replace(/@@S(\d+)@@/g,(_,i)=>'<span class="tok-s">'+store[i]+'</span>');
  return s;
}
function renderCode(){
  document.getElementById("code").innerHTML=hl(genPlain());
}

function writeLS(){
  try{
    localStorage.setItem("syntropyFactory",JSON.stringify({els,bg,idc}));
  }catch(e){}
}
function snapshot(){ return JSON.stringify({els,bg,idc}); }
function pushHistory(){
  const s=snapshot();
  if(histIdx>=0 && history[histIdx]===s){ return; }
  history=history.slice(0,histIdx+1);
  history.push(s);
  if(history.length>200){ history.shift(); }
  histIdx=history.length-1;
}
function applySnapshot(s){
  const d=JSON.parse(s);
  els=d.els||[]; bg=d.bg||bg; idc=d.idc||els.length+1;
  sel=null; multi=[];
  const bgi=document.getElementById("bgColor"); if(bgi){ bgi.value=rgb2hex(bg); }
  render(); renderCode(); renderProps(); syncList(); writeLS();
}
function undo(){ if(histIdx>0){ histIdx--; applySnapshot(history[histIdx]); } }
function redo(){ if(histIdx<history.length-1){ histIdx++; applySnapshot(history[histIdx]); } }
function save(){
  writeLS();
  pushHistory();
}
function load(){
  try{
    const raw=localStorage.getItem("syntropyFactory");
    if(!raw){ return false; }
    const d=JSON.parse(raw);
    els=d.els||[]; bg=d.bg||bg; idc=d.idc||els.length+1;
    return els.length>0;
  }catch(e){ return false; }
}

function syncControls(){
  document.getElementById("bgColor").value=rgb2hex(bg);
  document.getElementById("gridChk").checked=gridOn;
  document.getElementById("snapChk").checked=snapOn;
  document.getElementById("gridStep").value=gridSize;
}
function saveProject(){
  const data=JSON.stringify({els,bg,idc,gridOn,snapOn,gridSize},null,2);
  const blob=new Blob([data],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="syntropy-ui.json";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function loadProjectFile(file){
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const d=JSON.parse(reader.result);
      if(!d||!Array.isArray(d.els)){ return; }
      els=d.els; bg=d.bg||bg; idc=d.idc||els.length+1;
      if(typeof d.gridSize==="number"){ gridSize=clampI(d.gridSize,1,64); }
      if(typeof d.gridOn==="boolean"){ gridOn=d.gridOn; }
      if(typeof d.snapOn==="boolean"){ snapOn=d.snapOn; }
      sel=null; multi=[];
      syncControls();
      render(); renderCode(); renderProps(); syncList(); save();
    }catch(e){}
  };
  reader.readAsText(file);
}

function seed(){
  els=[
    {id:idc++,type:"box",x:0,y:0,w:320,h:30,radius:0,border:2,color:{r:20,g:44,b:120},borderColor:{r:51,g:224,b:255}},
    {id:idc++,type:"text",x:8,y:8,text:"SYNTROPY OS",scale:2,color:{r:255,g:255,b:255}},
    {id:idc++,type:"box",x:90,y:110,w:140,h:50,radius:10,border:2,color:{r:24,g:70,b:52},borderColor:{r:95,g:224,b:140}},
    {id:idc++,type:"text",x:118,y:127,text:"START",scale:2,color:{r:95,g:224,b:140}},
    {id:idc++,type:"disc",cx:280,cy:205,r:22,border:2,color:{r:20,g:32,b:80},borderColor:{r:255,g:204,b:51}}
  ];
}

function buildPalette(){
  const host=document.getElementById("palette");
  const icon={
    box:'<svg width="20" height="16"><rect x="1.5" y="1.5" width="17" height="13" rx="3" fill="#9fb4e6" stroke="#2f6fb0" stroke-width="1.5"/></svg>',
    disc:'<svg width="20" height="16"><circle cx="10" cy="8" r="6.5" fill="#9fb4e6" stroke="#2f6fb0" stroke-width="1.5"/></svg>',
    rectFill:'<svg width="20" height="16"><rect x="1" y="1" width="18" height="14" fill="#2f6fb0"/></svg>',
    rectLine:'<svg width="20" height="16"><rect x="1.5" y="1.5" width="17" height="13" fill="none" stroke="#2f6fb0" stroke-width="1.5"/></svg>',
    line:'<svg width="20" height="16"><line x1="2" y1="14" x2="18" y2="2" stroke="#2f6fb0" stroke-width="2"/></svg>',
    circleFill:'<svg width="20" height="16"><circle cx="10" cy="8" r="7" fill="#2f6fb0"/></svg>',
    circleLine:'<svg width="20" height="16"><circle cx="10" cy="8" r="6.5" fill="none" stroke="#2f6fb0" stroke-width="1.5"/></svg>',
    text:'<svg width="20" height="16"><text x="2" y="13" font-size="13" fill="#2f6fb0" font-family="monospace">A</text></svg>',
    icon:'<svg width="20" height="16"><rect x="2" y="1" width="4" height="4" fill="#2f6fb0"/><rect x="8" y="1" width="4" height="4" fill="#2f6fb0"/><rect x="2" y="7" width="4" height="4" fill="#2f6fb0"/><rect x="14" y="7" width="4" height="4" fill="#2f6fb0"/><rect x="8" y="11" width="4" height="4" fill="#2f6fb0"/></svg>'
  };
  for(const t of Object.keys(TYPES)){
    const b=document.createElement("div");
    b.className="tool";
    b.draggable=true;
    b.innerHTML=icon[t]+"<span>"+TYPES[t].label+"</span>";
    b.addEventListener("click",()=>addEl(t,null));
    b.addEventListener("dragstart",ev=>{ ev.dataTransfer.setData("text/plain",t); });
    host.appendChild(b);
  }
}
function buildSwatches(){
  const host=document.getElementById("swNew");
  for(const hx of PRESETS){
    const s=document.createElement("div");
    s.className="sw"; s.style.background=hx;
    s.addEventListener("click",()=>{
      newColor=hex2rgb(hx);
      document.getElementById("newColor").value=hx;
      document.getElementById("newColorHex").textContent=rgbStr(newColor);
      if(sel){ sel.color={...newColor}; render(); renderCode(); renderProps(); syncList(); save(); }
    });
    host.appendChild(s);
  }
}

cv.addEventListener("mousedown",down);
window.addEventListener("mousemove",move);
window.addEventListener("mouseup",up);
cv.addEventListener("touchstart",down,{passive:false});
cv.addEventListener("touchmove",move,{passive:false});
window.addEventListener("touchend",up);
window.addEventListener("mouseup",()=>{ painting=false; });

cv.addEventListener("dragover",ev=>ev.preventDefault());
cv.addEventListener("drop",ev=>{
  ev.preventDefault();
  const t=ev.dataTransfer.getData("text/plain");
  if(TYPES[t]){ addEl(t,logical(ev)); }
});

document.getElementById("newColor").addEventListener("input",ev=>{
  newColor=hex2rgb(ev.target.value);
  document.getElementById("newColorHex").textContent=rgbStr(newColor);
});
document.getElementById("bgColor").addEventListener("input",ev=>{
  bg=hex2rgb(ev.target.value); render(); renderCode(); save();
});
document.getElementById("clearAll").addEventListener("click",()=>{
  els=[]; sel=null; multi=[]; render(); renderCode(); renderProps(); syncList(); save();
});
document.getElementById("alignV").addEventListener("click",alignVertical);
document.getElementById("alignH").addEventListener("click",alignHorizontal);
document.getElementById("ctrParentH").addEventListener("click",()=>centerInParent("h"));
document.getElementById("ctrParentV").addEventListener("click",()=>centerInParent("v"));
document.getElementById("saveFile").addEventListener("click",saveProject);
document.getElementById("loadFile").addEventListener("click",()=>document.getElementById("fileInput").click());
document.getElementById("fileInput").addEventListener("change",ev=>{
  const f=ev.target.files && ev.target.files[0];
  if(f){ loadProjectFile(f); }
  ev.target.value="";
});
document.getElementById("gridChk").addEventListener("change",ev=>{ gridOn=ev.target.checked; render(); });
document.getElementById("snapChk").addEventListener("change",ev=>{ snapOn=ev.target.checked; });
document.getElementById("gridStep").addEventListener("input",ev=>{ gridSize=clampI(parseInt(ev.target.value||"8",10),1,64); if(gridOn){ render(); } });
document.getElementById("copyBtn").addEventListener("click",()=>{
  const txt=genPlain();
  const btn=document.getElementById("copyBtn");
  const done=()=>{ btn.textContent="Copied"; btn.classList.add("copied"); setTimeout(()=>{ btn.textContent="Copy C"; btn.classList.remove("copied"); },1200); };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done));
  }else{ fallbackCopy(txt,done); }
});
function fallbackCopy(txt,done){
  const ta=document.createElement("textarea");
  ta.value=txt; document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); done(); }catch(e){}
  document.body.removeChild(ta);
}
window.addEventListener("keydown",ev=>{
  const inField = document.activeElement && (document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA");
  if((ev.ctrlKey||ev.metaKey) && !inField){
    const k=ev.key.toLowerCase();
    if(k==="z"){ undo(); ev.preventDefault(); return; }
    if(k==="x"){ redo(); ev.preventDefault(); return; }
    if(k==="d"){ dupSelection(); ev.preventDefault(); return; }
  }
  if(inField){ return; }
  if(!multi.length){ return; }
  let step=1;
  if(ev.key==="Delete"||ev.key==="Backspace"){
    const doomed=[...multi];
    for(const e of doomed){ els=els.filter(x=>x!==e); }
    multi=[]; sel=null;
    render(); renderCode(); renderProps(); syncList(); save();
    ev.preventDefault();
    return;
  }
  let dx=0,dy=0;
  if(ev.key==="ArrowLeft"){ dx=-step; }
  else if(ev.key==="ArrowRight"){ dx=step; }
  else if(ev.key==="ArrowUp"){ dy=-step; }
  else if(ev.key==="ArrowDown"){ dy=step; }
  else{ return; }
  for(const e of multi){
    const o=JSON.parse(JSON.stringify(e));
    applyMove(e,o,dx,dy,true);
  }
  ev.preventDefault();
  render(); renderCode(); syncProps(); save();
});

buildPalette();
buildSwatches();
document.getElementById("newColorHex").textContent=rgbStr(newColor);
if(!load()){ seed(); }
document.getElementById("bgColor").value=rgb2hex(bg);
render(); renderCode(); renderProps(); syncList();
pushHistory();
