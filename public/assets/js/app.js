// Interaksi beranda: Android, perbandingan foto, peta demo, menu dashboard, slider.
const phone=document.getElementById('phone-content');
const phoneHeader=(title,sub,ic='camera')=>`<div class="phone-screen-head"><div><strong>${title}</strong><small>${sub}</small></div>${icon(ic)}</div>`;
const cameraScreen=phoneHeader('AI Camera','Survei Kayutangan')+`<div class="camera-view"><img src="${window.UrbanLens.assetURL(window.UrbanLens.config.images.androidPreview)}" alt="Contoh overlay segmentasi AI pada kamera"><span class="camera-live">● AI VISION ACTIVE</span><span class="camera-caption">Vegetasi · Jalan · Trotoar</span></div><div class="phone-controls">${icon('layers')}<span class="shutter"><i></i></span>${icon('folder')}</div>`;
const phoneScreens={camera:cameraScreen,segmentation:phoneHeader('Segmentasi','Foto & Video','layers')+`<div class="camera-view"><img src="${window.UrbanLens.assetURL(window.UrbanLens.config.images.androidPreview)}" alt="Contoh segmentasi foto dan video"><span class="camera-live">SEMANTIC SEGMENTATION</span><span class="phone-video-badge">▷ Video</span></div><p class="phone-tiny-note">Overlay elemen visual pada foto dan rekaman.</p><div class="phone-score"><span>Foto</span><span>Video</span><span>AI overlay</span></div>`,projects:phoneHeader('Proyek saya','Dokumentasi dalam satu tempat','folder')+`<div class="phone-folders">${[['Kayutangan','Survei koridor heritage'],['Ijen Boulevard','Dokumentasi ruang jalan'],['Alun-Alun Malang','Kajian ruang publik']].map(x=>`<div class="phone-folder"><span>${icon('folder')}</span><div><strong>${x[0]}</strong><small>${x[1]}</small></div></div>`).join('')}</div><p class="phone-tiny-note">Folder proyek · Foto · Video · Hasil analisis</p>`,heatmap:phoneHeader('Heatmap UVI','Lihat pola di setiap lokasi','map')+`<div class="phone-map"><i></i><i></i><i></i></div><p class="phone-tiny-note">Malang · Ilustrasi sebaran survei</p>`,recommendation:phoneHeader('Rekomendasi AI','Eksplorasi skenario perbaikan','sparkles')+`<div class="phone-recommend"><div class="source-photo after" role="img" aria-label="Contoh visualisasi redesign AI pada koridor Malang"></div><div class="phone-score"><span>Original UVI<strong>5,8</strong></span><span>→</span><span>Predicted UVI<strong>7,2*</strong></span></div><p class="phone-tiny-note">*Nilai prediksi ilustratif pada demo.</p></div>`};
phone.innerHTML=phoneScreens.camera;
document.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-feature]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-expanded',String(active));b.querySelector('.feature-plus').textContent=active?'−':'+';});
 phone.innerHTML=phoneScreens[button.dataset.feature];
}));

const compare=document.getElementById('comparison'),range=document.getElementById('compare-range');
function setCompare(value){range.value=value;compare.style.setProperty('--split',value+'%');range.setAttribute('aria-valuetext',`${value} persen foto asli, ${100-value} persen konsep AI`);}
range.addEventListener('input',()=>setCompare(Number(range.value)));
document.querySelectorAll('[data-compare]').forEach(button=>button.addEventListener('click',()=>setCompare(Number(button.dataset.compare))));
document.querySelectorAll('[data-location]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-location]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.getElementById('map-location').textContent=button.dataset.location;
 document.getElementById('map-location-copy').textContent=button.dataset.locationCopy;
}));
document.querySelectorAll('[data-map-mode]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-map-mode]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.getElementById('city-map').classList.toggle('points-only',button.dataset.mapMode==='points');
}));

const modules = window.URBANLENS_MODULES;

const modulesGrid=document.getElementById('module-grid');
modulesGrid.innerHTML=modules.map((m,i)=>`<button class="module ${i===0?'active':''}" data-module="${i}" aria-pressed="${i===0}"><span class="module-icon">${icon(m.icon)}</span><span class="module-label"><small>${m.group}</small><strong>${m.name}${m.slug==='executive-report'?' · PDF':m.slug==='export-data'?' · CSV':''}</strong></span><span class="module-arrow" aria-hidden="true">↗</span></button>`).join('');
modulesGrid.addEventListener('click',event=>{
 const button=event.target.closest('[data-module]');if(!button)return;const m=modules[Number(button.dataset.module)];
 modulesGrid.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.getElementById('preview-group').textContent=m.group;document.getElementById('preview-name').textContent=m.name;document.getElementById('preview-description').textContent=m.description;document.getElementById('preview-link').href=window.UrbanLens.dashboardURL(m.slug);
 const detail=document.querySelector('.preview-detail');const position=detail.getBoundingClientRect();if(position.top<100||position.bottom>window.innerHeight)detail.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
});
document.querySelectorAll('[data-location]').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));

// Hero gallery: six supplied segmentation results, with matching source metrics.
(()=>{
 const carousel=document.getElementById('hero-carousel');
 if(!carousel)return;
 const slides=[...carousel.querySelectorAll('[data-hero-slide]')];
 const dots=[...carousel.querySelectorAll('[data-hero-dot]')];
 const title=document.getElementById('hero-slide-title');
 const counter=document.getElementById('hero-slide-counter');
 const announcement=document.getElementById('hero-slide-announcement');
 const autoButton=document.getElementById('hero-autoplay');
 const imageFrame=document.getElementById('hero-gallery-slides');
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,autoRequested=!reducedMotion.matches,photoHovered=false,heroVisible=true,timer=null,pointerStart=null;
 const numberFormat=new Intl.NumberFormat('id-ID',{minimumFractionDigits:1,maximumFractionDigits:1});

 function syncPlayback(){
  if(timer!==null){window.clearInterval(timer);timer=null;}
  const focusPaused=carousel.contains(document.activeElement)&&document.activeElement!==autoButton;
  const playing=autoRequested&&!photoHovered&&!focusPaused&&heroVisible&&!document.hidden;
  carousel.dataset.playing=String(playing);
  autoButton.setAttribute('aria-pressed',String(!autoRequested));
  const autoLabel=autoRequested?'Jeda pergantian otomatis':'Putar slide otomatis';
  if(autoButton.getAttribute('aria-label')!==autoLabel){
   autoButton.setAttribute('aria-label',autoLabel);
   autoButton.querySelector('span').innerHTML=autoRequested?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5 19 12 8 19Z"/></svg>';
  }
  if(playing)timer=window.setInterval(()=>showSlide(active+1,false),Math.max(1000,Number(window.UrbanLens.config.hero.intervalMs)||5000));
 }
 function showSlide(index,manual){
  active=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>{
   slide.classList.toggle('is-active',i===active);
   slide.setAttribute('aria-hidden',String(i!==active));
  });
  dots.forEach((dot,i)=>{
   dot.classList.toggle('is-active',i===active);
   if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');
  });
  const current=slides[active];
  title.textContent=current.dataset.title;
  counter.textContent=String(active+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  current.dataset.values.split(',').forEach((value,i)=>{
   carousel.querySelector(`[data-hero-value="${i}"]`).textContent=numberFormat.format(Number(value));
  });
  if(manual){announcement.textContent=`Gambar ${active+1} dari ${slides.length}: ${current.dataset.title}`;syncPlayback();}
 }
 document.getElementById('hero-prev').addEventListener('click',()=>showSlide(active-1,true));
 document.getElementById('hero-next').addEventListener('click',()=>showSlide(active+1,true));
 dots.forEach(dot=>dot.addEventListener('click',()=>showSlide(Number(dot.dataset.heroDot),true)));
 autoButton.addEventListener('click',()=>{autoRequested=!autoRequested;syncPlayback();});
 imageFrame.addEventListener('mouseenter',()=>{photoHovered=true;syncPlayback();});
 imageFrame.addEventListener('mouseleave',()=>{photoHovered=false;syncPlayback();});
 carousel.addEventListener('focusin',syncPlayback);
 carousel.addEventListener('focusout',()=>queueMicrotask(syncPlayback));
 carousel.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();showSlide(active+(event.key==='ArrowRight'?1:-1),true);
  }
 });
 imageFrame.addEventListener('pointerdown',event=>{
  if(event.pointerType==='touch')pointerStart={x:event.clientX,y:event.clientY};
 });
 imageFrame.addEventListener('pointerup',event=>{
  if(!pointerStart)return;
  const dx=event.clientX-pointerStart.x,dy=event.clientY-pointerStart.y;pointerStart=null;
  if(Math.abs(dx)>45&&Math.abs(dy)<75)showSlide(active+(dx<0?1:-1),true);
 });
 imageFrame.addEventListener('pointercancel',()=>{pointerStart=null;});
 document.addEventListener('visibilitychange',syncPlayback);
 reducedMotion.addEventListener('change',()=>{autoRequested=!reducedMotion.matches;syncPlayback();});
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncPlayback();},{threshold:0.15});
  observer.observe(carousel);
 }
 showSlide(0,false);syncPlayback();
})();
