(()=>{
 const btn=document.querySelector('.mobile-toggle');
 const nav=document.querySelector('#primary-navigation');
 if(btn&&nav){
   const close=()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','메뉴 열기')};
   btn.addEventListener('click',()=>{const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});
   nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
   document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 }
 const getId=(raw)=>{
   try{
     const u=new URL(raw);
     const host=u.hostname.toLowerCase();
     let id='';
     if(host==='youtu.be'||host==='www.youtu.be')id=u.pathname.split('/')[1]||'';
     else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com','youtube-nocookie.com'].includes(host)){
       if(u.pathname==='/watch')id=u.searchParams.get('v')||'';
       else if(/^\/(shorts|embed|live)\//.test(u.pathname))id=u.pathname.split('/')[2]||'';
     }
     return /^[a-zA-Z0-9_-]{11}$/.test(id)?id:null;
   }catch{return null}
 };
 document.querySelectorAll('[data-youtube-url]').forEach(el=>{
   const id=getId(el.getAttribute('data-youtube-url')||'');
   if(!id){el.textContent='유효한 유튜브 영상 주소를 입력해 주세요.';return}
   const iframe=document.createElement('iframe');
   iframe.src=`https://www.youtube-nocookie.com/embed/${id}`;
   iframe.title='설교 영상';iframe.loading='lazy';
   iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
   iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;
   el.replaceChildren(iframe);
 });
})();
