/* ==========================================================
   Barre de recherche : VENTE / LOCATION / COLOCATION / VACANCES
   Filtres visuels + « Plus de filtres » propres à chaque mode
   ========================================================== */
const MODES = ['vente','location','colocation','vacances'];

const VISUAL = {
  vente:['loc','type','rooms','price'],
  location:['loc','type','rooms','duration','price'],
  colocation:['loc','type','rooms','duration','price'],
  vacances:['loc','type','rooms','priceNight']
};
const MORE = {
  vente:['surface','year','furn','park','heat','lift','cond','nego','pmr'],
  location:['surface','year','furn','park','heat','lift','cond','nego','pmr'],
  colocation:['coloc','sdb','common','furn','surface','park','lift','pmr'],
  vacances:['dates','guests','furn','park','lift','pmr','wifi','kitchen']
};
const TRI = {furn:'f.furnished',park:'f.parking',lift:'f.elevator',nego:'f.negotiable',pmr:'f.access',common:'f.common',wifi:'f.internet',kitchen:'f.kitchen'};
const PRESETS = {vente:[10e6,20e6,40e6,80e6],location:[30000,50000,100000,200000],colocation:[10000,15000,20000,30000],vacances:[5000,10000,20000,40000]};
const KEYS = ['mode','loc','type','rooms','dur','pmin','pmax','smin','smax','year','furn','park','heat','lift','cond','nego','pmr','coloc','sdb','common','arr','dep','guests','wifi','kitchen'];

function stateFromURL(){
  const p = new URLSearchParams(location.search), s = {};
  KEYS.forEach(k=>s[k]=p.get(k)||'');
  if(!MODES.includes(s.mode)) s.mode='vente';
  s.rooms = s.rooms ? s.rooms.split(',') : [];
  s.guests = s.guests ? +s.guests : 0;
  return s;
}
function stateToQuery(s){
  const p = new URLSearchParams();
  KEYS.forEach(k=>{
    let v = s[k];
    if(k==='rooms') v = (v||[]).join(',');
    if(v!=='' && v!=null && v!==0 && !(Array.isArray(v)&&!v.length)) p.set(k,v);
  });
  return p.toString();
}
const norm = x => (x||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
function triOK(want, has){ return !want || (want==='1' ? !!has : !has); }

function filterListings(s){
  return LISTINGS.filter(l=>{
    if(l.mode!==s.mode) return false;
    if(s.loc && !norm(l.city+' '+l.district).includes(norm(s.loc))) return false;
    if(s.type && l.type!==s.type) return false;
    if(s.rooms.length && !s.rooms.some(r=> r==='5' ? l.rooms>=5 : l.rooms===+r)) return false;
    if(s.dur && l.duration && l.duration!==s.dur) return false;
    if(s.pmin && l.price < +s.pmin) return false;
    if(s.pmax && l.price > +s.pmax) return false;
    const more = MORE[s.mode];
    if(more.includes('surface')){ if(s.smin && l.surface < +s.smin) return false; if(s.smax && l.surface > +s.smax) return false; }
    if(more.includes('year') && s.year && (!l.year || l.year < +s.year)) return false;
    if(more.includes('heat') && s.heat && l.heating!==s.heat) return false;
    if(more.includes('cond') && s.cond && l.condition!==s.cond) return false;
    if(more.includes('coloc') && s.coloc && l.roommates > +s.coloc) return false;
    if(more.includes('sdb') && s.sdb && l.bathrooms < +s.sdb) return false;
    if(more.includes('guests') && s.guests && l.guests < s.guests) return false;
    const map = {furn:'furnished',park:'parking',lift:'elevator',nego:'negotiable',pmr:'accessible',common:'commonRoom',wifi:'internet',kitchen:'kitchen'};
    for(const k in map){ if(more.includes(k) && !triOK(s[k], l[map[k]])) return false; }
    if(more.includes('dates') && s.arr && s.dep){
      if(l.booked.some(d=> d>=s.arr && d<s.dep)) return false;
    }
    return true;
  });
}

function nightsBetween(a,b){ return Math.round((new Date(b)-new Date(a))/864e5); }
function fmtDate(iso){ if(!iso) return ''; const d=new Date(iso+'T00:00'); return d.toLocaleDateString(LANG==='ar'?'ar-DZ':LANG==='en'?'en-GB':'fr-FR',{day:'numeric',month:'short'}); }
function shortPrice(n){ n=+n; if(n>=1e6) return (n/1e6).toLocaleString('fr-FR')+' M'; if(n>=1e3) return (n/1e3)+' k'; return n; }

/* ---------- Calendrier (sélection de plage façon Airbnb) ---------- */
function calendarHTML(s, offset, booked=[], months=2){
  const today = new Date(); today.setHours(0,0,0,0);
  const loc = LANG==='ar'?'ar-DZ':LANG==='en'?'en-GB':'fr-FR';
  const dows = LANG==='en' ? ['Mo','Tu','We','Th','Fr','Sa','Su'] : LANG==='ar' ? ['ن','ث','ر','خ','ج','س','ح'] : ['L','M','M','J','V','S','D'];
  let html = `<div class="cal-summary"><div><small>${t('f.arrival')}</small>${s.arr?fmtDate(s.arr):'—'}</div><div><small>${t('f.departure')}</small>${s.dep?fmtDate(s.dep):'—'}</div></div><div class="cal-wrap">`;
  for(let k=0;k<months;k++){
    const first = new Date(today.getFullYear(), today.getMonth()+offset+k, 1);
    const label = first.toLocaleDateString(loc,{month:'long',year:'numeric'});
    html += `<div class="cal"><div class="cal-head">${k===0?`<button type="button" data-cal="-1" ${offset<=0?'disabled style="opacity:.3"':''}>‹</button>`:'<span></span>'}<span>${label}</span>${k===months-1?'<button type="button" data-cal="1">›</button>':'<span></span>'}</div><div class="cal-grid">`;
    html += dows.map(d=>`<div class="dow">${d}</div>`).join('');
    const pad = (first.getDay()+6)%7;
    for(let i=0;i<pad;i++) html+='<div></div>';
    const days = new Date(first.getFullYear(), first.getMonth()+1, 0).getDate();
    for(let d=1; d<=days; d++){
      const dt = new Date(first.getFullYear(), first.getMonth(), d);
      const iso = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let cls = 'd';
      if(dt<today) cls+=' past';
      else if(booked.includes(iso)) cls+=' booked';
      if(iso===s.arr) cls+=' start';
      if(iso===s.dep) cls+=' end';
      if(s.arr && s.dep && iso>s.arr && iso<s.dep) cls+=' in';
      html += `<div class="${cls}" data-day="${iso}">${d}</div>`;
    }
    html += '</div></div>';
  }
  return html+'</div>';
}
function pickDay(s, iso){
  if(!s.arr || (s.arr && s.dep) || iso<=s.arr){ s.arr = iso; s.dep = ''; }
  else s.dep = iso;
}

/* ---------- Composant ---------- */
function SearchBox(container, opts={}){
  const s = opts.state || stateFromURL();
  let moreOpen = !!opts.moreOpen, calOffset = 0;

  const seg = (k)=>`<div class="seg" data-seg="${k}">${[['',t('f.any')],['1',t('f.yes')],['0',t('f.no')]].map(([v,l])=>`<button type="button" data-v="${v}" class="${(s[k]||'')===v?'on':''}">${l}</button>`).join('')}</div>`;
  const sel = (k, list, anyKey='f.any') => `<select data-k="${k}"><option value="">${t(anyKey)}</option>${list.map(v=>`<option value="${v}" ${s[k]==v?'selected':''}>${tv(v)}</option>`).join('')}</select>`;

  function priceSummary(){
    if(!s.pmin && !s.pmax) return `<span class="val placeholder">${t('f.any')}</span>`;
    const a = s.pmin?shortPrice(s.pmin):'0', b = s.pmax?shortPrice(s.pmax):'∞';
    return `<span class="val">${a} – ${b} DA</span>`;
  }
  function roomsSummary(){
    if(!s.rooms.length) return `<span class="val placeholder">${t('f.roomsAny')}</span>`;
    return `<span class="val">${s.rooms.map(r=>r==='5'?'5+':r).join(', ')}</span>`;
  }

  function visualField(f){
    switch(f){
      case 'loc': return `<div class="sfield loc"><label data-i18n="f.loc">${t('f.loc')}</label><input data-k="loc" list="dl-loc" value="${s.loc}" placeholder="${t('f.locPh')}" autocomplete="off"></div>`;
      case 'type': return `<div class="sfield"><label>${t('f.type')}</label>${sel('type',TYPES[s.mode],'f.all')}</div>`;
      case 'duration': return `<div class="sfield"><label>${t('f.duration')}</label>${sel('dur',DUREES)}</div>`;
      case 'rooms': return `<div class="sfield" data-pop="rooms"><span class="lbl">${t('f.rooms')}</span>${roomsSummary()}
        <div class="popover" data-popover="rooms"><h4>${t('f.rooms')}</h4><div class="chips">${['1','2','3','4','5'].map(r=>`<button type="button" class="chip ${s.rooms.includes(r)?'on':''}" data-room="${r}">${r==='5'?'5+':r}</button>`).join('')}</div></div></div>`;
      case 'price': case 'priceNight': return `<div class="sfield" data-pop="price"><span class="lbl">${t(f==='price'?'f.price':'f.priceNight')}</span>${priceSummary()}
        <div class="popover" data-popover="price" style="min-width:300px"><h4>${t(f==='price'?'f.price':'f.priceNight')} (DA)</h4>
          <div class="range2"><input type="number" data-k="pmin" placeholder="${t('f.min')}" value="${s.pmin}"><span>–</span><input type="number" data-k="pmax" placeholder="${t('f.max')}" value="${s.pmax}"></div>
          <div class="presets">${PRESETS[s.mode].map(v=>`<button type="button" data-pmax="${v}">≤ ${shortPrice(v)} DA</button>`).join('')}</div></div></div>`;
    }
  }
  function moreField(f){
    const L = (k)=>`<label class="t">${t(k)}</label>`;
    switch(f){
      case 'surface': return `<div class="mf">${L('f.surface')}<div class="range2"><input type="number" data-k="smin" placeholder="${t('f.min')}" value="${s.smin}"><span>–</span><input type="number" data-k="smax" placeholder="${t('f.max')}" value="${s.smax}"></div></div>`;
      case 'year': return `<div class="mf">${L('f.year')}<select data-k="year"><option value="">${t('f.any')}</option>${[1970,1990,2000,2010,2015,2020].map(y=>`<option value="${y}" ${s.year==y?'selected':''}>${t('f.yearAfter')} ${y}</option>`).join('')}</select></div>`;
      case 'heat': return `<div class="mf">${L('f.heating')}${sel('heat',CHAUFFAGES)}</div>`;
      case 'cond': return `<div class="mf">${L('f.condition')}${sel('cond',ETATS)}</div>`;
      case 'coloc': return `<div class="mf">${L('f.roommates')}<select data-k="coloc"><option value="">${t('f.any')}</option>${[2,3,4,5].map(n=>`<option value="${n}" ${s.coloc==n?'selected':''}>${t('f.maxRoommates')} ${n}${n===5?'+':''}</option>`).join('')}</select></div>`;
      case 'sdb': return `<div class="mf">${L('f.bathrooms')}<div class="chips">${['','1','2','3'].map(v=>`<button type="button" class="chip ${(s.sdb||'')===v?'on':''}" data-sdb="${v}">${v?v+'+':t('f.any')}</button>`).join('')}</div></div>`;
      case 'guests': return `<div class="mf">${L('f.guests')}<div class="stepper"><button type="button" data-guest="-1">−</button><span id="guestVal">${s.guests||0}</span><button type="button" data-guest="1">+</button></div></div>`;
      case 'dates': return `<div class="mf span2" style="grid-column:1/-1">${L('f.dates')}<div id="calBox">${calendarHTML(s,calOffset)}</div></div>`;
      default: return `<div class="mf">${L(TRI[f])}${seg(f)}</div>`;
    }
  }
  function moreCount(){
    return MORE[s.mode].reduce((n,f)=>{
      if(f==='surface') return n + (s.smin||s.smax?1:0);
      if(f==='dates') return n + (s.arr?1:0);
      if(f==='guests') return n + (s.guests?1:0);
      if(f==='cond') return n + (s.cond?1:0);
      if(f==='heat') return n + (s.heat?1:0);
      return n + (s[f]?1:0);
    },0);
  }

  function render(){
    const c = moreCount();
    container.innerHTML = `<div class="search-box">
      <div class="search-tabs">${MODES.map(m=>`<button type="button" class="search-tab ${s.mode===m?'on':''}" data-mode="${m}">${t('mode.'+m)}</button>`).join('')}</div>
      <div class="search-row">${VISUAL[s.mode].map(visualField).join('')}
        <div class="search-actions">
          <button type="button" class="btn-more" data-more>${ICON.sliders}<span>${t(moreOpen?'f.less':'f.more')}</span>${c?`<span class="count">${c}</span>`:''}</button>
          <button type="button" class="btn btn-primary btn-search" data-go>${ICON.search}<span>${t('f.search')}</span></button>
        </div>
      </div>
      <div class="more-panel ${moreOpen?'open':''}">
        <div class="more-grid">${MORE[s.mode].map(moreField).join('')}</div>
        <div class="more-footer"><button type="button" class="link-btn" data-reset>${t('f.reset')}</button><button type="button" class="btn btn-navy" data-go>${t('f.apply')}</button></div>
      </div>
      <datalist id="dl-loc">${WILAYAS.concat(COMMUNES).map(w=>`<option value="${w}">`).join('')}</datalist>
    </div>`;
  }

  function go(){
    if(opts.onSearch) opts.onSearch({...s});
    else location.href = 'annonces.html?' + stateToQuery(s);
  }
  function rerenderKeep(){ render(); }

  container.addEventListener('click', e=>{
    const tgt = e.target;
    const tab = tgt.closest('[data-mode]');
    if(tab){ const keep = s.loc; Object.keys(s).forEach(k=>s[k]= k==='rooms'?[]:k==='guests'?0:''); s.mode=tab.dataset.mode; s.loc=keep; rerenderKeep(); if(opts.onSearch) go(); return; }
    if(tgt.closest('[data-more]')){ moreOpen=!moreOpen; rerenderKeep(); return; }
    if(tgt.closest('[data-go]')){ go(); return; }
    if(tgt.closest('[data-reset]')){ const m=s.mode; Object.keys(s).forEach(k=>s[k]= k==='rooms'?[]:k==='guests'?0:''); s.mode=m; rerenderKeep(); return; }
    const room = tgt.closest('[data-room]');
    if(room){ const r=room.dataset.room; s.rooms = s.rooms.includes(r)? s.rooms.filter(x=>x!==r) : s.rooms.concat(r); room.classList.toggle('on'); container.querySelector('[data-pop="rooms"] .val').outerHTML = roomsSummary(); return; }
    const pm = tgt.closest('[data-pmax]');
    if(pm){ s.pmax = pm.dataset.pmax; s.pmin=''; rerenderKeep(); return; }
    const sg = tgt.closest('.seg button');
    if(sg){ const k = sg.parentElement.dataset.seg; s[k]=sg.dataset.v; sg.parentElement.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===sg)); updateCount(); return; }
    const sd = tgt.closest('[data-sdb]');
    if(sd){ s.sdb=sd.dataset.sdb; sd.parentElement.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b===sd)); updateCount(); return; }
    const gs = tgt.closest('[data-guest]');
    if(gs){ s.guests=Math.max(0,Math.min(16,(s.guests||0)+(+gs.dataset.guest))); container.querySelector('#guestVal').textContent=s.guests; updateCount(); return; }
    const cal = tgt.closest('[data-cal]');
    if(cal){ calOffset=Math.max(0,calOffset+(+cal.dataset.cal)); container.querySelector('#calBox').innerHTML=calendarHTML(s,calOffset); return; }
    const day = tgt.closest('[data-day]');
    if(day && !day.classList.contains('past')){ pickDay(s,day.dataset.day); container.querySelector('#calBox').innerHTML=calendarHTML(s,calOffset); updateCount(); return; }
    // popovers
    if(tgt.closest('.popover')) return;
    const pf = tgt.closest('[data-pop]');
    container.querySelectorAll('.popover').forEach(p=>{ if(!pf || p.dataset.popover!==pf.dataset.pop) p.classList.remove('open'); });
    if(pf) pf.querySelector('.popover').classList.toggle('open');
  });
  container.addEventListener('input', e=>{
    const k = e.target.dataset.k; if(!k) return;
    s[k] = e.target.value;
    if(k==='pmin'||k==='pmax'){ const v = container.querySelector('[data-pop="price"] .val'); if(v) v.outerHTML = priceSummary(); }
    updateCount();
  });
  container.addEventListener('keydown', e=>{ if(e.key==='Enter' && e.target.matches('input')){ e.preventDefault(); go(); } });
  document.addEventListener('click', e=>{ if(!container.contains(e.target)) container.querySelectorAll('.popover').forEach(p=>p.classList.remove('open')); });

  function updateCount(){
    const b = container.querySelector('[data-more]'); if(!b) return;
    const c = moreCount(); let el = b.querySelector('.count');
    if(c){ if(!el){ el=document.createElement('span'); el.className='count'; b.appendChild(el);} el.textContent=c; } else if(el) el.remove();
  }

  render();
  return { state:s };
}
