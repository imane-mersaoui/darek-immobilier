/* ==========================================================
   Recherche par carte (Leaflet + OpenStreetMap)
   - zoom éloigné : une bulle par wilaya (nombre d'annonces) → clic = biens de la wilaya
   - zoom proche  : un marqueur prix par annonce → clic = aperçu de l'annonce
   ========================================================== */
const _nrm = x => (x||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
/* ---------- Fonds de carte ----------
   Aucun n'exige de clé. Si un fournisseur ne répond pas, on passe automatiquement au suivant.
   Pour utiliser MapTiler (clé gratuite sur https://cloud.maptiler.com), collez votre clé ci-dessous. */
const MAP_CONFIG = { maptilerKey: '' };
const TILE_PROVIDERS = [
  ...(MAP_CONFIG.maptilerKey ? [{url:`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAP_CONFIG.maptilerKey}`, opt:{attribution:'&copy; MapTiler &copy; OpenStreetMap', tileSize:512, zoomOffset:-1}}] : []),
  {url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', opt:{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}},
  {url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', opt:{attribution:'Tiles &copy; Esri'}}
];
let TILE_INDEX = 0; // mémorisé pour les autres cartes de la page
function addTiles(map, el){
  let layer, loaded = 0, errors = 0;
  const use = i=>{
    if(layer) map.removeLayer(layer);
    if(i >= TILE_PROVIDERS.length){ showMapError(el); return; }
    TILE_INDEX = i; loaded = 0; errors = 0;
    const p = TILE_PROVIDERS[i];
    layer = L.tileLayer(p.url, {maxZoom:19, ...p.opt}).addTo(map);
    layer.on('tileload', ()=>{ loaded++; });
    layer.on('tileerror', ()=>{ errors++; if(!loaded && errors>=4){ console.warn('Fond de carte indisponible, essai suivant :', i+1); use(i+1); } });
  };
  use(TILE_INDEX);
}
function showMapError(el){
  if(el.querySelector('.map-error')) return;
  const d = document.createElement('div'); d.className = 'map-error';
  d.innerHTML = `<b>Le fond de carte ne se charge pas</b><br>Vérifiez la connexion internet, puis ouvrez le site avec <code>lancer-site.bat</code> (et non en double-cliquant sur index.html).`;
  el.appendChild(d);
}

const ALGERIA_CENTER = [35.2, 3.0];
const DETAIL_ZOOM = 9;

function makeBaseMap(el, opts={}){
  const map = L.map(el, {zoomControl:true, scrollWheelZoom:opts.scroll!==false, minZoom:5, maxZoom:18,
    maxBounds:[[14,-16],[43,17]], maxBoundsViscosity:.6}).setView(opts.center||ALGERIA_CENTER, opts.zoom||6);
  addTiles(map, el);
  return map;
}
const geoOf = l => (l.lat!=null && l.lng!=null) ? [l.lat,l.lng] : (WILAYA_GEO[l.city] || ALGERIA_CENTER);
function shortDA(n){ return n>=1e6 ? (Math.round(n/1e5)/10).toString().replace('.',',')+' M' : n>=1e3 ? Math.round(n/1e3)+' k' : n; }

function DarekMap(el, opts={}){
  const map = makeBaseMap(el, opts);
  const layer = L.layerGroup().addTo(map);
  let items = [], selected = opts.selected || '', markers = {};

  function bubbles(){
    const counts = {};
    items.forEach(l=>{ counts[l.city] = (counts[l.city]||0)+1; });
    // regroupe les wilayas trop proches à l'écran (ex. Alger / Blida / Tipaza en zoom national)
    const pts = Object.entries(counts).filter(([w])=>WILAYA_GEO[w]).sort((a,b)=>b[1]-a[1])
      .map(([w,n])=>({w,n,g:WILAYA_GEO[w],p:map.latLngToLayerPoint(WILAYA_GEO[w])}));
    const groups = [];
    pts.forEach(pt=>{
      const grp = groups.find(gr=>gr[0].p.distanceTo(pt.p) < (map.getZoom()>=DETAIL_ZOOM-1 ? 30 : 58));
      grp ? grp.push(pt) : groups.push([pt]);
    });
    groups.forEach(grp=>{
      const lead = grp[0], total = grp.reduce((s,x)=>s+x.n,0), single = grp.length===1;
      const size = Math.min(76, 46 + total*3);
      const label = single ? lead.w : `${lead.w} +${grp.length-1}`;
      const on = grp.some(x=>_nrm(x.w)===_nrm(selected));
      const icon = L.divIcon({className:'', iconSize:[size,size], iconAnchor:[size/2,size/2],
        html:`<div class="wbubble ${on?'on':''} ${single?'':'multi'}" style="width:${size}px;height:${size}px" title="${grp.map(x=>x.w+' ('+x.n+')').join(', ')}"><b>${total}</b><span>${label}</span></div>`});
      L.marker(lead.g,{icon, riseOnHover:true, zIndexOffset:total*10}).on('click',()=>{
        if(single){ selected = lead.w; opts.onWilaya && opts.onWilaya(lead.w); map.flyTo(lead.g, 11, {duration:.8}); }
        else openPanel(lead.g, size, grp);
      }).addTo(layer);
    });
  }
  function pins(){
    markers = {};
    items.forEach(l=>{
      const icon = L.divIcon({className:'', iconSize:null, iconAnchor:[0,0],
        html:`<div class="ppin ${l.mode}">${shortDA(l.price)}</div>`});
      const m = L.marker(geoOf(l),{icon, riseOnHover:true}).addTo(layer);
      m.bindPopup(`<a class="mpop" href="bien.html?id=${l.id}">
          <div class="mpop-img" style="background-image:url('${l.images[0]||''}')"></div>
          <div class="mpop-b"><b>${fmtPrice(l)}</b><div>${tv(l.type)} · ${l.title}</div><small>${l.district}, ${l.city}</small>
          <span class="mpop-link">${t('map.see')} →</span></div></a>`, {maxWidth:260, minWidth:240});
      markers[l.id] = m;
    });
  }
  function draw(){
    layer.clearLayers();
    map.getZoom() < DETAIL_ZOOM ? bubbles() : pins();
  }
  // panneau de choix quand plusieurs wilayas sont regroupées (s'ouvre sous la bulle)
  let panel = null;
  function closePanel(){ if(panel){ panel.remove(); panel=null; } }
  function openPanel(g, size, grp){
    closePanel();
    const pt = map.latLngToContainerPoint(g);
    panel = document.createElement('div'); panel.className = 'wpanel';
    panel.innerHTML = `<div class="wlist">${grp.map(x=>`<button type="button" data-w="${x.w}"><span>📍 ${x.w}</span><b>${x.n}</b></button>`).join('')}
      <button type="button" class="wzoom" data-zoom="${grp.map(x=>x.w).join('|')}">🔍 Zoom</button></div>`;
    el.appendChild(panel);
    const w = panel.offsetWidth, W = el.clientWidth;
    panel.style.left = Math.max(8, Math.min(W-w-8, pt.x - w/2)) + 'px';
    panel.style.top = (pt.y + size/2 + 8) + 'px';
    L.DomEvent.disableClickPropagation(panel); L.DomEvent.disableScrollPropagation(panel);
  }
  map.on('movestart zoomstart click', closePanel);
  map.on('zoomend', draw);
  el.addEventListener('click', e=>{
    const b = e.target.closest('[data-w]'), z = e.target.closest('[data-zoom]');
    if(b){ const w=b.dataset.w; closePanel(); selected=w; opts.onWilaya && opts.onWilaya(w); map.flyTo(WILAYA_GEO[w], 11, {duration:.8}); }
    if(z){ closePanel(); map.flyToBounds(L.latLngBounds(z.dataset.zoom.split('|').map(w=>WILAYA_GEO[w])).pad(.15), {duration:.8, maxZoom:DETAIL_ZOOM-1}); }
  });
  map.on('moveend', ()=>opts.onMove && opts.onMove(map.getBounds()));

  return {
    map,
    setItems(list, sel){ items = list; if(sel!==undefined) selected = sel; draw(); },
    focusWilaya(w){
      const wk = Object.keys(WILAYA_GEO).find(k=>_nrm(k)===_nrm(w));
      const ck = Object.keys(COMMUNE_GEO).find(k=>_nrm(k)===_nrm(w));
      if(wk) map.setView(WILAYA_GEO[wk], 11); else if(ck) map.setView(COMMUNE_GEO[ck], 13);
      return !!(wk||ck);
    },
    reset(){ // cadre sur les wilayas qui ont des annonces (sinon toute l'Algérie)
      const pts = [...new Set(items.map(l=>l.city))].map(w=>WILAYA_GEO[w]).filter(Boolean);
      pts.length ? map.fitBounds(L.latLngBounds(pts).pad(.35), {maxZoom:7}) : map.setView(ALGERIA_CENTER, 6);
    },
    highlight(id, on){ const m = markers[id]; if(m && m._icon) m._icon.firstChild.classList.toggle('hl', on); },
    inBounds(l){ return map.getBounds().contains(geoOf(l)); },
    invalidate(){ setTimeout(()=>map.invalidateSize(), 60); }
  };
}
