/* ==========================================================
   En-tête, pied de page et utilitaires partagés
   ========================================================== */
const ICON = {
  home:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
  pin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  heart:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#12263f" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  user:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  globe:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
  plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  sliders:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#12263f" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  bed:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="10.5" r="1.5"/></svg>',
  area:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
  people:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6.3"/></svg>',
  check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 12 5 5 9-10"/></svg>',
  fb:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M14 8V6c0-.8.2-1.3 1.4-1.3H17V1.2C16.7 1.1 15.6 1 14.4 1 11.8 1 10 2.6 10 5.5V8H7v3.6h3V23h4V11.6h3l.5-3.6z"/></svg>',
  ig:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="#fff"/></svg>',
  li:'<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg>'
};

const store = {
  get(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} }
};
const currentUser = () => store.get('darek_user', null);

function fmtNum(n){ return Number(n).toLocaleString('fr-FR').replace(/ | /g,' '); }
function fmtPrice(l){
  const dzd = LANG==='ar' ? ' دج' : (LANG==='en' ? ' DZD' : ' DA');
  const suffix = l.mode==='vacances' ? t('card.night') : (l.mode==='location'||l.mode==='colocation') ? t('card.month') : '';
  return `${fmtNum(l.price)}${dzd} ${suffix ? '<small>'+suffix+'</small>' : ''}`;
}
function qs(k){ return new URLSearchParams(location.search).get(k); }
function toast(msg){
  let el = document.querySelector('.toast');
  if(!el){ el = document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(()=>el.classList.remove('show'), 2600);
}
const IMG_FALLBACK = "this.onerror=null;this.style.display='none'";

function cardHTML(l){
  const favs = store.get('darek_favs', []);
  const specs = [];
  if(l.rooms) specs.push(`<span>${ICON.bed} ${l.rooms} ${t('card.rooms')}</span>`);
  if(l.surface) specs.push(`<span>${ICON.area} ${l.surface} m²</span>`);
  if(l.mode==='vacances' && l.guests) specs.push(`<span>${ICON.people} ${l.guests} ${t('card.guests')}</span>`);
  if(l.mode==='colocation' && l.roommates) specs.push(`<span>${ICON.people} ${l.roommates}</span>`);
  return `<a class="card" href="bien.html?id=${l.id}">
    <div class="card-img">
      <img src="${l.images[0]||''}" alt="" loading="lazy" onerror="${IMG_FALLBACK}">
      <span class="badge ${l.mode}">${t('mode.'+l.mode)}</span>
      <button class="fav ${favs.includes(l.id)?'on':''}" data-fav="${l.id}" aria-label="Favori">${ICON.heart}</button>
    </div>
    <div class="card-body">
      <div class="price">${fmtPrice(l)}${l.negotiable?`<span class="tag-nego">${t('card.nego')}</span>`:''}</div>
      <div class="card-title">${tv(l.type)} · ${l.title}</div>
      <div class="card-loc">${ICON.pin} ${l.district}${l.district!==l.city?', '+l.city:''}</div>
      <div class="card-specs">${specs.join('')}</div>
    </div></a>`;
}
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-fav]'); if(!b) return;
  e.preventDefault(); e.stopPropagation();
  const id = b.dataset.fav; let favs = store.get('darek_favs', []);
  if(favs.includes(id)){ favs = favs.filter(x=>x!==id); b.classList.remove('on'); toast(t('misc.unsaved')); }
  else { favs.push(id); b.classList.add('on'); toast(t('misc.saved')); }
  store.set('darek_favs', favs);
});

function renderHeader(){
  const el = document.getElementById('site-header'); if(!el) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const mode = qs('mode');
  const u = currentUser();
  const a = (href,key,active)=>`<a href="${href}" class="${active?'active':''}" data-i18n="${key}"></a>`;
  el.outerHTML = `<header class="site-header"><div class="container header-inner">
    <a href="index.html" class="logo"><span class="logo-mark">${ICON.home}</span><span>Darek<small data-i18n="brand.tag"></small></span></a>
    <nav class="main-nav" id="mainNav">
      ${a('a-propos.html','nav.about',page==='a-propos.html')}
      ${a('comment-ca-marche.html','nav.how',page==='comment-ca-marche.html')}
      <span class="nav-sep"></span>
      ${['vente','location','colocation','vacances'].map(m=>a('annonces.html?mode='+m,'nav.'+m,page==='annonces.html'&&mode===m)).join('')}
    </nav>
    <div class="header-actions">
      ${u ? `<a class="user-link" href="connexion.html">${ICON.user}<span class="txt">${u.name.split(' ')[0]}</span></a>`
          : `<a class="user-link" href="connexion.html">${ICON.user}<span class="txt" data-i18n="nav.login"></span></a>`}
      <div class="lang-switch">
        <button class="lang-btn" id="langBtn">${ICON.globe} ${LANG.toUpperCase()}</button>
        <div class="lang-menu" id="langMenu">
          <button data-lang="fr" class="${LANG==='fr'?'on':''}">Français</button>
          <button data-lang="ar" class="${LANG==='ar'?'on':''}">العربية</button>
          <button data-lang="en" class="${LANG==='en'?'on':''}">English</button>
        </div>
      </div>
      <a href="publier.html" class="btn btn-publish">${ICON.plus}<span class="txt-long" data-i18n="nav.publish"></span></a>
      <button class="burger" id="burger" aria-label="Menu">${ICON.menu}</button>
    </div>
  </div></header>`;
  document.getElementById('langBtn').onclick = e=>{ e.stopPropagation(); document.getElementById('langMenu').classList.toggle('open'); };
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
  document.getElementById('burger').onclick = ()=>document.getElementById('mainNav').classList.toggle('open');
  document.addEventListener('click',()=>document.getElementById('langMenu')?.classList.remove('open'));
}

function renderFooter(){
  const el = document.getElementById('site-footer'); if(!el) return;
  el.outerHTML = `<footer class="site-footer"><div class="container">
    <div class="footer-grid">
      <div><a href="index.html" class="logo"><span class="logo-mark">${ICON.home}</span>Darek</a>
        <p style="font-size:14px" data-i18n="foot.about"></p>
        <div class="socials"><a href="#">${ICON.fb}</a><a href="#">${ICON.ig}</a><a href="#">${ICON.li}</a></div></div>
      <div><h4 data-i18n="foot.nav"></h4>
        <a href="publier.html" data-i18n="nav.publish"></a><a href="a-propos.html" data-i18n="nav.about"></a>
        <a href="comment-ca-marche.html" data-i18n="nav.how"></a><a href="comment-ca-marche.html#faq" data-i18n="foot.faq"></a><a href="connexion.html" data-i18n="nav.login"></a></div>
      <div><h4 data-i18n="foot.search"></h4>
        ${['vente','location','colocation','vacances'].map(m=>`<a href="annonces.html?mode=${m}" data-i18n="nav.${m}"></a>`).join('')}</div>
      <div><h4 data-i18n="foot.contact"></h4>
        <a href="contact.html" data-i18n="c.title"></a>
        <a href="mailto:contact@darek.dz">contact@darek.dz</a>
        <a href="tel:+213550000000" dir="ltr" style="text-align:start">+213 (0) 550 00 00 00</a>
        <a href="#" data-i18n="foot.addr"></a></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Darek — <span data-i18n="foot.rights"></span></span>
      <span><a href="#" style="display:inline" data-i18n="foot.legal"></a> · <a href="#" style="display:inline" data-i18n="foot.cgu"></a> · <a href="#" style="display:inline" data-i18n="foot.privacy"></a></span></div>
  </div></footer>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderHeader(); renderFooter();
  applyI18n();
  document.dispatchEvent(new Event('darek:ready'));
});
