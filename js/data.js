/* ==========================================================
   Données fictives — à remplacer par l'API / la base de données
   ========================================================== */
const U = id => `https://images.unsplash.com/photo-${id}?w=1000&q=70`;
const IMG = {
  villa1:U('1613490493576-7fde63acd811'), villa2:U('1512917774080-9991f1c4c750'), villa3:U('1580587771525-78b9dba3b914'),
  house1:U('1564013799919-ab600027ffc6'), house2:U('1570129477492-45c003edd2be'), house3:U('1600585154340-be6161a56a0c'),
  apt1:U('1522708323590-d24dbb6b0267'), apt2:U('1502672260266-1c1ef2d93688'), apt3:U('1545324418-cc1a3fa10c00'),
  liv1:U('1560448204-e02f11c3d0e2'), liv2:U('1493809842364-78817add7ffb'), liv3:U('1586023492125-27b2c045efd7'), liv4:U('1554995207-c18c203602cb'),
  bed1:U('1505691938895-1758d7feb511'), kit1:U('1484154218962-a197022b5858'), modern:U('1600596542815-ffad4c1539a9')
};

const WILAYAS = ['Alger','Oran','Constantine','Annaba','Blida','Tipaza','Béjaïa','Tizi Ouzou','Sétif','Tlemcen','Jijel','Boumerdès','Mostaganem','Batna','Ghardaïa','Skikda'];
const COMMUNES = ['Hydra','Kouba','Chéraga','Bab Ezzouar','Dely Brahim','El Biar','Bir Mourad Raïs','Draria','Ben Aknoun','Saïd Hamdine','Bordj El Kiffan','Aïn Benian','Akid Lotfi','Bir El Djir','Canastel','Ali Mendjeli','Seraïdi','Cherchell','Tichy','Ziama Mansouriah'];

const TYPES = {
  vente:['Appartement','Villa','Niveau de villa','Duplex','Studio','Terrain','Local commercial','Bureau'],
  location:['Appartement','Villa','Niveau de villa','Duplex','Studio','Local commercial','Bureau'],
  colocation:['Appartement','Villa','Chambre'],
  vacances:['Appartement','Villa','Studio','Bungalow','Chalet']
};
const DUREES = ['Courte durée (1 à 6 mois)','6 à 12 mois','1 an et plus'];
const CHAUFFAGES = ['Gaz de ville','Chauffage central','Électrique','Climatiseur réversible','Aucun'];
const ETATS = ['Neuf','Très bon état','Bon état','À rafraîchir','À rénover'];

/* Coordonnées (centre) des wilayas et des communes — pour la carte */
const WILAYA_GEO = {
  'Alger':[36.7538,3.0588],'Oran':[35.6971,-0.6308],'Constantine':[36.365,6.6147],'Annaba':[36.9,7.7667],
  'Blida':[36.47,2.83],'Tipaza':[36.59,2.45],'Béjaïa':[36.75,5.08],'Tizi Ouzou':[36.7169,4.0497],
  'Sétif':[36.19,5.41],'Tlemcen':[34.8783,-1.315],'Jijel':[36.82,5.766],'Boumerdès':[36.766,3.477],
  'Mostaganem':[35.931,0.089],'Batna':[35.555,6.174],'Ghardaïa':[32.49,3.67],'Skikda':[36.876,6.909]
};
const COMMUNE_GEO = {
  'Hydra':[36.742,3.035],'Dely Brahim':[36.756,2.985],'Bab Ezzouar':[36.721,3.183],'El Biar':[36.769,3.033],
  'Ben Aknoun':[36.758,3.012],'Chéraga':[36.766,2.959],'Bir Mourad Raïs':[36.735,3.05],'Kouba':[36.725,3.083],
  'Bir El Djir':[35.72,-0.545],'Canastel':[35.731,-0.585],'Akid Lotfi':[35.715,-0.59],'Ali Mendjeli':[36.258,6.581],
  'Seraïdi':[36.913,7.672],'Cherchell':[36.607,2.19],'Tichy':[36.67,5.16],'Ziama Mansouriah':[36.668,5.48]
};

const OWNERS = [
  {name:'Karim B.',since:2023},{name:'Nadia M.',since:2022},{name:'Yacine H.',since:2024},{name:'Samira K.',since:2021},
  {name:'Rafik A.',since:2025},{name:'Lynda T.',since:2023},{name:'Mourad Z.',since:2022},{name:'Amel S.',since:2024}
];

/* m = mode | t = type | c = wilaya | d = commune | r = pièces | s = surface m² | p = prix DA */
const BASE = [
 // ------- VENTE -------
 {m:'vente',t:'Appartement',title:'F4 lumineux avec vue sur la baie',c:'Alger',d:'Hydra',r:4,s:128,p:42000000,y:2015,furn:false,park:true,heat:'Chauffage central',lift:true,cond:'Très bon état',nego:true,pmr:true,img:['apt1','liv1','kit1','bed1']},
 {m:'vente',t:'Villa',title:'Villa R+1 avec jardin et garage',c:'Alger',d:'Dely Brahim',r:6,s:320,p:95000000,y:2008,furn:false,park:true,heat:'Gaz de ville',lift:false,cond:'Bon état',nego:true,pmr:false,img:['villa3','liv2','kit1','bed1']},
 {m:'vente',t:'Appartement',title:'F3 neuf dans résidence sécurisée',c:'Oran',d:'Bir El Djir',r:3,s:92,p:21500000,y:2024,furn:false,park:true,heat:'Gaz de ville',lift:true,cond:'Neuf',nego:false,pmr:true,img:['apt3','liv4','kit1','bed1']},
 {m:'vente',t:'Duplex',title:'Duplex F5 avec terrasse panoramique',c:'Constantine',d:'Ali Mendjeli',r:5,s:165,p:28000000,y:2019,furn:false,park:true,heat:'Chauffage central',lift:true,cond:'Très bon état',nego:true,pmr:false,img:['liv3','apt1','kit1','bed1']},
 {m:'vente',t:'Studio',title:'Studio rénové proche tramway',c:'Alger',d:'Bab Ezzouar',r:1,s:38,p:8900000,y:1985,furn:true,park:false,heat:'Électrique',lift:true,cond:'Bon état',nego:true,pmr:false,img:['apt2','bed1','kit1']},
 {m:'vente',t:'Terrain',title:'Terrain constructible 500 m² acte + livret',c:'Tipaza',d:'Cherchell',r:0,s:500,p:15000000,y:null,furn:false,park:false,heat:'Aucun',lift:false,cond:'Neuf',nego:true,pmr:true,img:['house2']},
 {m:'vente',t:'Niveau de villa',title:'Niveau de villa F4 avec entrée indépendante',c:'Blida',d:'Blida',r:4,s:140,p:19500000,y:2012,furn:false,park:true,heat:'Gaz de ville',lift:false,cond:'Bon état',nego:true,pmr:false,img:['house1','liv2','kit1']},
 {m:'vente',t:'Local commercial',title:'Local 80 m² sur boulevard passant',c:'Sétif',d:'Sétif',r:2,s:80,p:24000000,y:2005,furn:false,park:false,heat:'Climatiseur réversible',lift:false,cond:'À rafraîchir',nego:true,pmr:true,img:['liv4','apt3']},
 {m:'vente',t:'Villa',title:'Villa moderne avec piscine',c:'Oran',d:'Canastel',r:7,s:420,p:140000000,y:2021,furn:true,park:true,heat:'Chauffage central',lift:false,cond:'Neuf',nego:false,pmr:true,img:['villa2','villa1','liv1','kit1']},
 {m:'vente',t:'Appartement',title:'F2 idéal investissement locatif',c:'Annaba',d:'Annaba',r:2,s:62,p:11200000,y:1998,furn:false,park:false,heat:'Gaz de ville',lift:false,cond:'À rafraîchir',nego:true,pmr:false,img:['apt2','liv3','bed1']},
 // ------- LOCATION -------
 {m:'location',t:'Appartement',title:'F3 meublé standing, quartier calme',c:'Alger',d:'El Biar',r:3,s:95,p:85000,y:2016,furn:true,park:true,heat:'Chauffage central',lift:true,cond:'Très bon état',nego:false,pmr:true,dur:'1 an et plus',img:['liv1','apt1','kit1','bed1']},
 {m:'location',t:'Appartement',title:'F2 proche université',c:'Alger',d:'Ben Aknoun',r:2,s:58,p:45000,y:2003,furn:true,park:false,heat:'Électrique',lift:true,cond:'Bon état',nego:true,pmr:false,dur:'6 à 12 mois',img:['apt2','bed1','kit1']},
 {m:'location',t:'Villa',title:'Villa F6 pour famille ou siège social',c:'Alger',d:'Chéraga',r:6,s:300,p:250000,y:2010,furn:false,park:true,heat:'Gaz de ville',lift:false,cond:'Bon état',nego:true,pmr:true,dur:'1 an et plus',img:['villa3','liv2','kit1']},
 {m:'location',t:'Studio',title:'Studio meublé tout équipé',c:'Oran',d:'Akid Lotfi',r:1,s:35,p:32000,y:2018,furn:true,park:false,heat:'Climatiseur réversible',lift:true,cond:'Très bon état',nego:false,pmr:false,dur:'Courte durée (1 à 6 mois)',img:['apt3','bed1']},
 {m:'location',t:'Bureau',title:'Plateau de bureaux 150 m²',c:'Alger',d:'Bir Mourad Raïs',r:5,s:150,p:180000,y:2014,furn:false,park:true,heat:'Climatiseur réversible',lift:true,cond:'Très bon état',nego:true,pmr:true,dur:'1 an et plus',img:['liv4','apt3']},
 {m:'location',t:'Niveau de villa',title:'Rez-de-villa F3 avec cour',c:'Tizi Ouzou',d:'Tizi Ouzou',r:3,s:110,p:40000,y:2009,furn:false,park:true,heat:'Gaz de ville',lift:false,cond:'Bon état',nego:true,pmr:true,dur:'1 an et plus',img:['house1','liv3','kit1']},
 {m:'location',t:'Appartement',title:'F4 familial proche écoles',c:'Constantine',d:'Constantine',r:4,s:115,p:55000,y:2000,furn:false,park:true,heat:'Chauffage central',lift:false,cond:'Bon état',nego:true,pmr:false,dur:'6 à 12 mois',img:['apt1','liv2','bed1']},
 // ------- COLOCATION -------
 {m:'colocation',t:'Chambre',title:'Chambre en colocation étudiante',c:'Alger',d:'Bab Ezzouar',r:4,s:14,p:15000,y:2012,furn:true,park:false,heat:'Électrique',lift:true,cond:'Bon état',nego:false,pmr:false,dur:'6 à 12 mois',coloc:3,bath:1,common:true,img:['bed1','liv3','kit1']},
 {m:'colocation',t:'Appartement',title:'Coloc F4 entre jeunes actifs',c:'Alger',d:'Kouba',r:4,s:105,p:22000,y:2015,furn:true,park:true,heat:'Gaz de ville',lift:true,cond:'Très bon état',nego:true,pmr:false,dur:'1 an et plus',coloc:4,bath:2,common:true,img:['liv1','bed1','kit1']},
 {m:'colocation',t:'Villa',title:'Villa partagée avec jardin',c:'Oran',d:'Bir El Djir',r:5,s:220,p:20000,y:2006,furn:true,park:true,heat:'Gaz de ville',lift:false,cond:'Bon état',nego:true,pmr:true,dur:'Courte durée (1 à 6 mois)',coloc:5,bath:3,common:true,img:['villa1','liv2','bed1']},
 {m:'colocation',t:'Chambre',title:'Chambre privée pour stagiaire',c:'Constantine',d:'Ali Mendjeli',r:3,s:12,p:12000,y:2020,furn:true,park:false,heat:'Chauffage central',lift:true,cond:'Neuf',nego:false,pmr:true,dur:'Courte durée (1 à 6 mois)',coloc:2,bath:1,common:false,img:['bed1','apt2']},
 // ------- VACANCES -------
 {m:'vacances',t:'Villa',title:'Villa pieds dans l\'eau avec piscine',c:'Tipaza',d:'Cherchell',r:5,s:250,p:35000,y:2017,furn:true,park:true,heat:'Climatiseur réversible',lift:false,cond:'Très bon état',nego:false,pmr:true,guests:10,wifi:true,kitchen:true,booked:[5,6,7,12,13],img:['villa2','villa1','liv1','kit1']},
 {m:'vacances',t:'Appartement',title:'F3 vue mer à 50 m de la plage',c:'Béjaïa',d:'Tichy',r:3,s:80,p:12000,y:2014,furn:true,park:true,heat:'Climatiseur réversible',lift:true,cond:'Bon état',nego:true,pmr:false,guests:6,wifi:true,kitchen:true,booked:[1,2,3,20,21],img:['apt1','liv2','bed1']},
 {m:'vacances',t:'Bungalow',title:'Bungalow en forêt, calme absolu',c:'Jijel',d:'Ziama Mansouriah',r:2,s:45,p:8000,y:2019,furn:true,park:true,heat:'Électrique',lift:false,cond:'Très bon état',nego:false,pmr:false,guests:4,wifi:false,kitchen:true,booked:[10,11],img:['house2','bed1','kit1']},
 {m:'vacances',t:'Studio',title:'Studio cosy centre-ville',c:'Oran',d:'Oran',r:1,s:32,p:6000,y:2011,furn:true,park:false,heat:'Climatiseur réversible',lift:true,cond:'Bon état',nego:true,pmr:false,guests:2,wifi:true,kitchen:true,booked:[],img:['apt3','bed1']},
 {m:'vacances',t:'Chalet',title:'Chalet en montagne avec cheminée',c:'Annaba',d:'Seraïdi',r:3,s:90,p:15000,y:2016,furn:true,park:true,heat:'Chauffage central',lift:false,cond:'Très bon état',nego:false,pmr:false,guests:6,wifi:true,kitchen:true,booked:[15,16,17],img:['house3','liv3','kit1']},
 {m:'vacances',t:'Villa',title:'Villa familiale à Ghardaïa',c:'Ghardaïa',d:'Ghardaïa',r:4,s:180,p:18000,y:2005,furn:true,park:true,heat:'Climatiseur réversible',lift:false,cond:'Bon état',nego:true,pmr:true,guests:8,wifi:true,kitchen:true,booked:[],img:['villa3','liv4','bed1']}
];

const DESC = {
  vente:'Je vends directement, sans agence. Bien entretenu, papiers en règle (acte notarié). Visites possibles en semaine et le week-end sur rendez-vous. Pas de frais d\'intermédiaire : vous traitez directement avec moi.',
  location:'Je loue directement, sans intermédiaire ni commission. Logement propre et bien entretenu, quartier commerçant. Contrat de location chez le notaire. Paiement mensuel ou trimestriel selon accord.',
  colocation:'Colocation conviviale, ambiance respectueuse. Charges (eau, électricité, gaz, internet) partagées équitablement. Cuisine équipée commune. Idéal pour étudiants ou jeunes actifs.',
  vacances:'Location de vacances proposée par le propriétaire. Linge de maison fourni, ménage inclus en fin de séjour. Arrivée à partir de 14h, départ avant 11h. Accueil personnalisé.'
};

function buildListings(){
  const today = new Date(); today.setHours(0,0,0,0);
  const list = BASE.map((b,i)=>{
    const o = OWNERS[i % OWNERS.length];
    const posted = new Date(today); posted.setDate(today.getDate() - (i*3)%40);
    const g = COMMUNE_GEO[b.d] || WILAYA_GEO[b.c] || [36.75,3.05];
    const lat = g[0] + (((i*37)%11)-5)*0.0016, lng = g[1] + (((i*53)%13)-6)*0.0018; // léger décalage pour ne pas superposer
    const booked = (b.booked||[]).map(n=>{const d=new Date(today);d.setDate(today.getDate()+n);return d.toISOString().slice(0,10)});
    return {
      id:'D'+(1001+i), lat, lng, mode:b.m, type:b.t, title:b.title, city:b.c, district:b.d,
      rooms:b.r, surface:b.s, price:b.p, year:b.y, furnished:b.furn, parking:b.park,
      heating:b.heat, elevator:b.lift, condition:b.cond, negotiable:b.nego, accessible:b.pmr,
      duration:b.dur||null, roommates:b.coloc||null, bathrooms:b.bath||(b.r>3?2:1), commonRoom:b.common??null,
      guests:b.guests||null, internet:b.wifi??(b.m!=='vente'), kitchen:b.kitchen??true, booked,
      images:b.img.map(k=>IMG[k]), description:DESC[b.m],
      owner:{name:o.name,since:o.since,phone:'0'+(5+i%3)+' '+(20+i)+' '+(31+i)+' '+(42+i)+' '+(10+i)},
      posted:posted.toISOString().slice(0,10)
    };
  });
  // annonces publiées depuis le formulaire (stockées localement dans le navigateur)
  try{ const mine = JSON.parse(localStorage.getItem('darek_listings')||'[]'); return mine.concat(list); }catch(e){ return list; }
}
const LISTINGS = buildListings();
const getListing = id => LISTINGS.find(l=>l.id===id);
