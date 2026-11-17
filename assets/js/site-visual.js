/* 교회 홈페이지 비주얼 편집기 - 기존 Jekyll 메인 화면에 비파괴적 설정 적용 */
(() => {
  'use strict';
  const main = document.querySelector('main#main');
  if (!main) return;
  const preview = new URLSearchParams(location.search).get('churchPreview') === '1';
  const native = [
    {id:'hero', label:'메인 비주얼', selector:'.hero', fields:[
      ['eyebrow','.hero-kicker'],['title','.hero-copy h1'],['description','.hero-copy > p'],['image','image']
    ]},
    {id:'shortcuts',label:'빠른 메뉴',selector:'.shortcuts',fields:[]},
    {id:'welcome',label:'교회 소개',selector:'.welcome-section',fields:[
      ['title','.welcome-copy h2'],['description','.welcome-copy > p'],['visionTitle','.vision-quote strong'],['visionText','.vision-quote p']
    ]},
    {id:'worship',label:'예배 시간',selector:'.worship-section',fields:[
      ['title','.section-heading h2'],['description','.section-heading > p'],
      ['sunday','.worship-tile:nth-child(1) p'],['wednesday','.worship-tile:nth-child(2) p'],['children','.worship-tile:nth-child(3) p']
    ]},
    {id:'sermons',label:'최근 설교',selector:'.latest-section',fields:[['title','.section-heading h2']]},
    {id:'news',label:'교회 소식',selector:'.news-section',fields:[['title','.section-heading h2']]},
    {id:'nextgen',label:'다음세대',selector:'.nextgen-section',fields:[
      ['title','.nextgen-wrap h2'],['description','.nextgen-wrap > div:first-child > p']
    ]},
    {id:'visit',label:'오시는 길 안내',selector:'.visit-cta',fields:[
      ['title','.visit-inner h2'],['description','.visit-inner p']
    ]}
  ];
  const originalHTML = main.innerHTML;
  const nativeDefaults = native.map(item => {
    const sec=main.querySelector(item.selector);
    const fields={};
    for(const [key,selector] of item.fields){
      if(selector==='image'){fields.image='';continue;}
      const el=sec?.querySelector(selector);
      fields[key]=el ? (el.innerText||el.textContent||'').trim() : '';
    }
    return {id:item.id,type:'native',label:item.label,enabled:true,fields};
  });
  function defaultPage(){return {
    version:1,
    theme:{preset:'forest',primary:'#234a42',secondary:'#f1ece2',paper:'#fbfaf7',fontScale:1},
    sections:JSON.parse(JSON.stringify(nativeDefaults))
  };}
  function safeImage(raw){
    if(typeof raw!=='string'||!raw.trim()) return '';
    try {const u=new URL(raw.trim(), location.href);return (u.protocol==='https:'||(location.protocol==='http:'&&u.protocol==='http:'))?u.href:'';}catch{return '';}
  }
  function safeLink(raw){
    if(typeof raw!=='string'||!raw.trim())return '#';
    try{const u=new URL(raw.trim(),location.href);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}
  }
  function hex(raw, fallback){return /^#[0-9a-fA-F]{6}$/.test(raw||'')?raw:fallback;}
  function txt(parent,selector,value){
    if(typeof value!=='string')return;
    const el=parent.querySelector(selector); if(!el)return;
    if(selector==='.hero-kicker'){
      const line=document.createElement('span'); line.className='kicker-line';
      el.replaceChildren(line,document.createTextNode(value));
    }else{
      el.textContent=value;
      el.style.whiteSpace='pre-line';
    }
  }
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n;}
  function createCustom(s){
    const f=s.fields||{}, section=el('section','builder-custom builder-'+(s.variant||'text'));
    section.dataset.editorSection=s.id;
    section.style.backgroundColor=hex(f.background,'#ffffff');
    const wrap=el('div','shell builder-inner');
    const copy=el('div','builder-copy');
    if(f.eyebrow)copy.append(el('span','eyebrow',f.eyebrow));
    copy.append(el('h2','',f.title||'새로운 영역'));
    if(f.description)copy.append(el('p','',f.description));
    if(f.buttonLabel){const a=el('a','btn btn-primary',f.buttonLabel+' ↗');a.href=safeLink(f.buttonUrl);copy.append(a);}
    if(s.variant==='banner'){
      section.style.backgroundColor=hex(f.background,'#234a42');
      section.classList.add('builder-banner');
      wrap.append(copy);
    }else if(s.variant==='image'){
      const image=el('div','builder-picture');const safe=safeImage(f.image);
      if(safe){const img=el('img');img.src=safe;img.alt=f.title||'교회 사진';img.loading='lazy';image.append(img);}
      else image.append(el('span','builder-image-empty','여기에 교회 사진을 추가할 수 있습니다'));
      wrap.append(image,copy);
    }else if(s.variant==='cards'){
      wrap.append(copy);
      const grid=el('div','builder-cards');
      for(let i=1;i<=3;i++){const c=el('article','builder-card');c.append(el('span','eyebrow',String(i).padStart(2,'0')),
        el('h3','',f['card'+i+'Title']||'제목을 입력하세요'),el('p','',f['card'+i+'Text']||'소개 내용을 입력하세요'));
        grid.append(c);}
      wrap.append(grid);
    }else{
      wrap.append(copy);
    }
    section.append(wrap);
    return section;
  }
  function apply(data,focus){
    if(!data||!Array.isArray(data.sections))return;
    const oldY=window.scrollY;
    main.innerHTML=originalHTML;
    const originalNodes=new Map(native.map(n=>[n.id,main.querySelector(n.selector)]));
    const listed=new Set();
    const frag=document.createDocumentFragment();
    const all=Array.isArray(data.sections)?data.sections:[];
    for(const section of all){
      if(!section||typeof section.id!=='string'||listed.has(section.id)||section.enabled===false)continue;
      listed.add(section.id);
      let node;
      if(section.type==='native'){
        const spec=native.find(n=>n.id===section.id); if(!spec)continue;
        node=originalNodes.get(spec.id);
        if(!node)continue;
        for(const [key,selector] of spec.fields){
          if(key==='image'){
            const src=safeImage(section.fields?.image);
            if(src&&section.id==='hero')node.style.setProperty('--hero-photo',`url("${encodeURI(src).replaceAll('"','%22')}")`);
          }else txt(node,selector,section.fields?.[key]);
        }
      }else if(section.type==='custom')node=createCustom(section);
      if(node){node.dataset.editorSection=section.id;frag.append(node);}
    }
    // 구버전 설정이 없는 기본 영역도 보존하여 의도치 않게 삭제되지 않도록 처리합니다.
    for(const n of native){if(!listed.has(n.id)&&!all.some(s=>s?.id===n.id)){const node=originalNodes.get(n.id);if(node){node.dataset.editorSection=n.id;frag.append(node);}}}
    main.replaceChildren(frag);
    const t=data.theme||{};
    const root=document.documentElement.style;
    root.setProperty('--green',hex(t.primary,'#234a42'));
    root.setProperty('--green-dark',hex(t.primary,'#19372f'));
    root.setProperty('--paper',hex(t.paper,'#fbfaf7'));
    root.setProperty('--cream',hex(t.secondary,'#f1ece2'));
    root.setProperty('--gold',hex(t.secondary,'#cba777'));
    const scale=Math.max(.85,Math.min(1.3,Number(t.fontScale)||1));
    document.body.style.fontSize=(17*scale).toFixed(1)+'px';
    if(Math.abs(scale-1)>.001){
      main.querySelectorAll('h1,h2,h3,p,.shortcut b,.shortcut small,.eyebrow').forEach(node=>{
        const base=parseFloat(getComputedStyle(node).fontSize);
        if(Number.isFinite(base))node.style.fontSize=(base*scale).toFixed(1)+'px';
      });
    }
    if(preview){
      main.classList.add('is-editor-preview');
      if(focus)main.querySelectorAll('[data-editor-section]').forEach(n=>n.classList.toggle('editor-selected',n.dataset.editorSection===focus));
      window.scrollTo(0,oldY);
    }
  }
  if(preview){
    main.addEventListener('click',event=>{
      const selected=event.target.closest('[data-editor-section]');
      if(!selected)return;
      event.preventDefault();
      event.stopPropagation();
      main.querySelectorAll('[data-editor-section]').forEach(n=>n.classList.toggle('editor-selected',n===selected));
      window.parent.postMessage({type:'church-editor:select',id:selected.dataset.editorSection},location.origin);
    },true);
    window.addEventListener('message',event=>{
      if(event.origin!==location.origin||event.source!==window.parent)return;
      if(event.data?.type==='church-editor:apply')apply(event.data.page,event.data.selected);
      if(event.data?.type==='church-editor:focus'){
        main.querySelectorAll('[data-editor-section]').forEach(n=>n.classList.toggle('editor-selected',n.dataset.editorSection===event.data.id));
        main.querySelector(`[data-editor-section="${CSS.escape(event.data.id)}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
  }else{
    const cfg=window.CHURCH_SUPABASE||{};
    if(cfg.url&&cfg.publishableKey){
      (async()=>{
        try{
          const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
          const db=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,autoRefreshToken:false}});
          const {data,error}=await db.from('church_published').select('content').eq('page_key','home').maybeSingle();
          if(!error&&data?.content)apply(data.content);
        }catch(e){console.warn('디자인 설정을 불러오지 못해 기본 화면을 보여줍니다.',e);}
      })();
    }
  }
  window.churchVisual={defaultPage,apply};
})();
