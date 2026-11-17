/* 홈페이지 비주얼 편집기. 인증/저장은 Supabase RLS로 서버에서 보호됩니다. */
'use strict';
const $ = (selector) => document.querySelector(selector);
const frame=$('#sitePreview');
const cfg=window.CHURCH_SUPABASE||{};
const configured=Boolean(/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(cfg.url||'')&&(cfg.publishableKey||'').length>20);
const presets={
  forest:{primary:'#234a42',secondary:'#f1ece2',paper:'#fbfaf7'},
  navy:{primary:'#243e59',secondary:'#e9edf3',paper:'#f7f9fc'},
  warm:{primary:'#79523d',secondary:'#f5e8db',paper:'#fcf9f5'}
};
const builtinFields={
  hero:[['eyebrow','위쪽 작은 문구','text'],['title','메인 제목','textarea'],['description','소개 문장','textarea'],['image','배경 사진 주소','image']],
  welcome:[['title','환영 제목','text'],['description','소개 문장','textarea'],['visionTitle','비전 제목','text'],['visionText','비전 설명','textarea']],
  worship:[['title','예배 안내 제목','textarea'],['description','안내 문장','textarea'],['sunday','주일예배 시간','text'],['wednesday','수요예배 시간','text'],['children','교육부서 예배 시간','text']],
  sermons:[['title','설교 영역 제목','text']],
  news:[['title','소식 영역 제목','text']],
  nextgen:[['title','다음세대 제목','textarea'],['description','소개 문장','textarea']],
  visit:[['title','방문 안내 제목','text'],['description','안내 문장','textarea']],
  shortcuts:[]
};
const customFields={
  common:[['eyebrow','작은 영문/소개 문구','text'],['title','큰 제목','textarea'],['description','본문 설명','textarea'],['buttonLabel','버튼 이름','text'],['buttonUrl','버튼 연결 주소','text'],['background','배경 색상','color']],
  image:[['image','사진 주소','image']],
  cards:[['card1Title','첫 번째 카드 제목','text'],['card1Text','첫 번째 카드 설명','textarea'],['card2Title','두 번째 카드 제목','text'],['card2Text','두 번째 카드 설명','textarea'],['card3Title','세 번째 카드 제목','text'],['card3Text','세 번째 카드 설명','textarea']]
};
let page=null, selected='hero', client=null, adminUser=null, cloud=false, ready=false, changed=false, noticeTimer=null, dragging=null;
function show(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>toast.classList.remove('show'),2800);}
function setStatus(message){$('#saveStatus').textContent=message;}
function setMode(active){
  cloud=Boolean(active);
  $('#connectionStatus').textContent=cloud?'관리자 연결됨':configured?'체험 모드 · 로그인 필요':'체험 모드';
  $('#connectionStatus').classList.toggle('connected',cloud);
  $('#publishBtn').disabled=!cloud;
  $('#publishBtn').title=cloud?'변경된 디자인을 홈페이지에 공개합니다':'관리자 인증 후 사용 가능합니다';
  $('#draftBtn').textContent=cloud?'임시 저장':'브라우저에 저장';
  $('#loginBtn').textContent=cloud?'로그아웃':'관리자 로그인';
}
function clone(x){return JSON.parse(JSON.stringify(x));}
function sendPreview(){
  if(!ready||!page)return;
  frame.contentWindow?.postMessage({type:'church-editor:apply',page:clone(page),selected},location.origin);
}
function markChanged(){changed=true;setStatus(cloud?'저장되지 않은 변경사항이 있습니다':'체험 중 · 방문자에게 반영되지 않음');sendPreview();}
function current(){return page?.sections?.find(s=>s.id===selected)||null;}
function labelOf(s){return s.label||(s.fields?.title||'새로운 영역').replace(/\s+/g,' ').slice(0,20);}
function button(txt,cls,action,aria){const e=document.createElement('button');e.type='button';e.textContent=txt;e.className=cls||'';if(action)e.addEventListener('click',action);if(aria)e.setAttribute('aria-label',aria);return e;}
function select(id,scroll=true){if(!page?.sections?.some(s=>s.id===id))return;selected=id;renderList();renderInspector();sendPreview();if(scroll)frame.contentWindow?.postMessage({type:'church-editor:focus',id},location.origin);}
function move(id,step){const i=page.sections.findIndex(s=>s.id===id);const j=i+step;if(i<0||j<0||j>=page.sections.length)return;const [item]=page.sections.splice(i,1);page.sections.splice(j,0,item);renderList();markChanged();}
function renderList(){
  const box=$('#sectionList');box.replaceChildren();
  page.sections.forEach((s,index)=>{
    const row=document.createElement('div');row.className='section-row'+(selected===s.id?' selected':'')+(s.enabled===false?' dim':'');row.draggable=true;row.dataset.id=s.id;
    const handle=document.createElement('span');handle.className='handle';handle.title='드래그하여 순서 이동';handle.textContent='⠿';row.append(handle);
    const choose=button('','section-select',()=>select(s.id));
    const text=document.createElement('span');text.style.minWidth='0';const title=document.createElement('span');title.className='section-title';title.textContent=labelOf(s);
    const type=document.createElement('span');type.className='section-type';type.textContent=s.type==='native'?'기본 영역':'추가한 영역';text.append(title,type);choose.append(text);row.append(choose);
    row.append(button('↑','move-btn',()=>move(s.id,-1),'위로 이동'),button('↓','move-btn',()=>move(s.id,1),'아래로 이동'));
    row.addEventListener('dragstart',e=>{dragging=s.id;row.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',s.id);});
    row.addEventListener('dragend',()=>{dragging=null;row.classList.remove('dragging');});
    row.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';});
    row.addEventListener('drop',e=>{e.preventDefault();const a=page.sections.findIndex(x=>x.id===dragging),b=page.sections.findIndex(x=>x.id===s.id);if(a<0||b<0||a===b)return;const [item]=page.sections.splice(a,1);page.sections.splice(b,0,item);dragging=null;renderList();markChanged();});
    box.append(row);
  });
}
function fieldInput(s,field){
  const [key,label,kind]=field;
  const wrapper=document.createElement('div');wrapper.className='field';
  const lbl=document.createElement('label');lbl.textContent=label;lbl.htmlFor='edit-'+key;wrapper.append(lbl);
  let input;
  if(kind==='textarea'){input=document.createElement('textarea');input.rows=3;}
  else {input=document.createElement('input');input.type=kind==='color'?'color':'text';}
  input.id='edit-'+key; input.value=(s.fields?.[key]??(kind==='color'?'#ffffff':''));
  if(kind==='color'&&!/^#[0-9a-fA-F]{6}$/.test(input.value))input.value='#ffffff';
  input.addEventListener('input',()=>{s.fields[key]=input.value;markChanged();});
  wrapper.append(input);
  if(kind==='image'){
    const caption=document.createElement('p');caption.className='field-note';caption.textContent='https:// 이미지 주소를 입력하거나 아래에서 파일을 업로드하세요.';
    const uploadRow=document.createElement('div');uploadRow.className='upload-row';
    const uploader=document.createElement('input');uploader.type='file';uploader.accept='image/jpeg,image/png,image/webp';
    uploader.setAttribute('aria-label',label+' 파일 선택');
    uploader.addEventListener('change',async()=>{
      const file=uploader.files?.[0];if(!file)return;
      if(!cloud||!client){show('이미지 업로드는 관리자 로그인 후 가능합니다.');return;}
      if(file.size>8*1024*1024){show('이미지는 8MB 이하만 업로드해 주세요.');return;}
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)){show('JPG·PNG·WebP 이미지만 업로드할 수 있습니다.');return;}
      const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';
      const path=`homepage/${crypto.randomUUID()}.${ext}`;
      const btn=uploadRow.querySelector('button');btn.disabled=true;btn.textContent='업로드 중';
      try{
        const {error}=await client.storage.from('church-media').upload(path,file,{contentType:file.type,upsert:false});
        if(error)throw error;
        const {data}=client.storage.from('church-media').getPublicUrl(path);
        s.fields[key]=data.publicUrl;input.value=data.publicUrl;markChanged();show('이미지가 업로드됐습니다. 게시해야 방문자에게 보입니다.');
      }catch(e){show('업로드 실패: '+(e.message||e));}
      finally{btn.disabled=false;btn.textContent='사진 업로드';uploader.value='';}
    });
    const pick=button('사진 업로드','upload-button',()=>uploader.click());
    uploadRow.append(pick,uploader);wrapper.append(caption,uploadRow);
  }else if(key==='buttonUrl'){
    const info=document.createElement('p');info.className='field-note';info.textContent='예: /about/ 또는 https://example.com (http/https만 허용)';wrapper.append(info);
  }
  return wrapper;
}
function renderInspector(){
  const s=current(),root=$('#inspectorFields'),actions=$('#inspectorActions');root.replaceChildren();actions.replaceChildren();
  if(!s){$('#inspectorTitle').textContent='영역 설정';$('#inspectorDescription').textContent='편집할 영역을 선택해 주세요.';return;}
  $('#inspectorTitle').textContent=labelOf(s);
  $('#inspectorDescription').textContent=s.type==='native'?'기존 홈페이지에서 사용하던 영역입니다.':'새로 추가한 영역입니다. 아래에서 자유롭게 수정하세요.';
  const toggle=document.createElement('label');toggle.className='section-toggle';const check=document.createElement('input');check.type='checkbox';check.checked=s.enabled!==false;
  check.addEventListener('change',()=>{s.enabled=check.checked;renderList();markChanged();});toggle.append(check,document.createTextNode('홈페이지에 이 영역 표시'));root.append(toggle);
  const fields=(s.type==='native'?builtinFields[s.id]:[...customFields.common,...(customFields[s.variant]||[])] )||[];
  if(!fields.length){const info=document.createElement('p');info.className='field-note';info.textContent='바로가기 메뉴는 기존 링크를 유지합니다. 표시 여부와 위치를 바꿀 수 있습니다.';root.append(info);}
  for(const field of fields)root.append(fieldInput(s,field));
  actions.append(button('↑ 위로','btn btn-subtle',()=>move(s.id,-1)),button('↓ 아래로','btn btn-subtle',()=>move(s.id,1)));
  if(s.type==='custom')actions.append(button('영역 삭제','btn danger',()=>{
    if(!confirm('추가한 영역을 삭제할까요?'))return;
    page.sections=page.sections.filter(x=>x.id!==s.id);
    selected=page.sections[0]?.id||null;renderList();renderInspector();markChanged();
  }));
}
function renderTheme(){
  $('#themePrimary').value=page.theme.primary||'#234a42';
  $('#themePaper').value=page.theme.paper||'#fbfaf7';
  $('#themeFont').value=page.theme.fontScale||1;
  $('#fontValue').textContent=Math.round(Number(page.theme.fontScale||1)*100)+'%';
  document.querySelectorAll('[data-theme]').forEach(btn=>btn.classList.toggle('active',btn.dataset.theme===page.theme.preset));
}
function render(){renderList();renderInspector();renderTheme();sendPreview();}
function addSection(variant){
  const names={text:'소개 글',image:'사진과 글',cards:'카드 3개',banner:'강조 배너'};
  const s={id:'custom_'+crypto.randomUUID().replaceAll('-','').slice(0,14),type:'custom',variant,label:names[variant],enabled:true,fields:{
    eyebrow:'OUR CHURCH',title:names[variant]+' 제목을 입력하세요',description:'이 영역에 표시할 내용을 입력하세요.',buttonLabel:'',buttonUrl:'',background:variant==='banner'?'#234a42':'#ffffff',
    image:'',card1Title:'첫 번째 소식',card1Text:'내용을 입력하세요.',card2Title:'두 번째 소식',card2Text:'내용을 입력하세요.',card3Title:'세 번째 소식',card3Text:'내용을 입력하세요.'
  }};
  const at=page.sections.findIndex(x=>x.id===selected);page.sections.splice(at+1,0,s);selected=s.id;render();markChanged();
  frame.contentWindow?.postMessage({type:'church-editor:focus',id:s.id},location.origin);
}
function validatePage(obj){return obj&&obj.version===1&&obj.theme&&Array.isArray(obj.sections)&&obj.sections.length<=60&&obj.sections.every(s=>s&&typeof s.id==='string'&&/^([a-z0-9_\-]{2,50})$/.test(s.id)&&['native','custom'].includes(s.type)&&s.fields&&typeof s.fields==='object'&&!Array.isArray(s.fields));}
function downloadBackup(){const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),page},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='church-homepage-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),800);show('현재 디자인을 JSON 파일로 내려받았습니다.');}
async function startCloud(){
  if(!configured){show('Supabase 연결 정보가 없습니다. 설치 안내서를 먼저 확인해 주세요.');return false;}
  if(!client){const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');client=createClient(cfg.url,cfg.publishableKey);}
  const {data:{user},error}=await client.auth.getUser();if(error||!user)return false;
  const {data:role,error:roleErr}=await client.from('church_admins').select('user_id').eq('user_id',user.id).maybeSingle();
  if(roleErr||!role)return false;
  adminUser=user;setMode(true);
  const [{data:draft,error:errDraft},{data:published,error:errPub}]=await Promise.all([
    client.from('church_drafts').select('content').eq('page_key','home').maybeSingle(),
    client.from('church_published').select('content').eq('page_key','home').maybeSingle()
  ]);
  if(errDraft||errPub)throw errDraft||errPub;
  const saved=draft?.content||published?.content;
  if(validatePage(saved)){page=saved;selected=page.sections[0]?.id||null;render();}
  setStatus('관리자로 로그인했습니다. 수정 후 임시저장 또는 게시하세요.');
  return true;
}
async function openLogin(){
  if(cloud){if(!confirm('관리자 계정에서 로그아웃하시겠습니까?'))return;await client?.auth.signOut();adminUser=null;setMode(false);show('로그아웃했습니다.');return;}
  if(!configured){show('site-config.js에 Supabase URL과 Publishable key를 먼저 입력해 주세요.');return;}
  $('#authError').textContent='';$('#authDialog').showModal();
}
async function saveDraft(){
  if(!page)return;
  if(!cloud){localStorage.setItem('church_visual_demo',JSON.stringify(page));changed=false;setStatus('이 브라우저에 체험용 디자인을 저장했습니다 · 실제 사이트는 그대로입니다');show('체험 모드 저장 완료. 공개 홈페이지는 바뀌지 않습니다.');return;}
  try{
    const {error}=await client.from('church_drafts').upsert({page_key:'home',content:page,updated_at:new Date().toISOString()},{onConflict:'page_key'});
    if(error)throw error;changed=false;setStatus('임시저장 완료 · 방문자에게는 반영되지 않았습니다');show('임시저장했습니다.');
  }catch(e){show('임시저장 실패: '+(e.message||e));}
}
async function publish(){
  if(!cloud){show('관리자 로그인 후 게시할 수 있습니다.');return;}
  if(!confirm('현재 디자인을 교회 홈페이지에 공개하시겠습니까?'))return;
  const btn=$('#publishBtn');btn.disabled=true;btn.textContent='게시 중...';
  try{
    const now=new Date().toISOString();
    const {error:ed}=await client.from('church_drafts').upsert({page_key:'home',content:page,updated_at:now},{onConflict:'page_key'});
    if(ed)throw ed;
    const {error:ep}=await client.from('church_published').upsert({page_key:'home',content:page,published_at:now},{onConflict:'page_key'});
    if(ep)throw ep;
    changed=false;setStatus('게시 완료 · 홈페이지 새로고침 후 확인하세요');show('게시 완료! GitHub에 코드를 다시 올릴 필요 없습니다.');
  }catch(e){show('게시 실패: '+(e.message||e));}
  finally{btn.disabled=!cloud;btn.textContent='변경사항 게시';}
}
function wire(){
  document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>addSection(btn.dataset.add)));
  document.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>{
    page.theme={...page.theme,...presets[btn.dataset.theme],preset:btn.dataset.theme};renderTheme();markChanged();
  }));
  $('#themePrimary').addEventListener('input',e=>{page.theme.primary=e.target.value;page.theme.preset='custom';renderTheme();markChanged();});
  $('#themePaper').addEventListener('input',e=>{page.theme.paper=e.target.value;page.theme.preset='custom';renderTheme();markChanged();});
  $('#themeFont').addEventListener('input',e=>{page.theme.fontScale=Number(e.target.value);$('#fontValue').textContent=Math.round(Number(e.target.value)*100)+'%';markChanged();});
  $('#desktopView').addEventListener('click',()=>{ $('#deviceFrame').classList.remove('mobile');$('#desktopView').classList.add('active');$('#mobileView').classList.remove('active');});
  $('#mobileView').addEventListener('click',()=>{ $('#deviceFrame').classList.add('mobile');$('#mobileView').classList.add('active');$('#desktopView').classList.remove('active');});
  $('#loginBtn').addEventListener('click',openLogin);
  $('#closeAuth').addEventListener('click',()=>$('#authDialog').close());
  $('#authForm').addEventListener('submit',async e=>{
    e.preventDefault();$('#authError').textContent='';const btn=$('#authSubmit');btn.disabled=true;btn.textContent='로그인 중...';
    try{
      if(!client){const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');client=createClient(cfg.url,cfg.publishableKey);}
      const {error}=await client.auth.signInWithPassword({email:$('#authEmail').value.trim(),password:$('#authPassword').value});
      if(error)throw error;
      if(!await startCloud()){await client.auth.signOut();throw new Error('관리자 권한이 없습니다. Supabase에서 church_admins 계정을 등록해 주세요.');}
      $('#authDialog').close();$('#authPassword').value='';show('관리자 로그인이 완료됐습니다.');
    }catch(err){$('#authError').textContent=err.message||String(err);}
    finally{btn.disabled=false;btn.textContent='로그인';}
  });
  $('#draftBtn').addEventListener('click',saveDraft);$('#publishBtn').addEventListener('click',publish);
  $('#exportBtn').addEventListener('click',downloadBackup);
  $('#importFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{
      if(file.size>500000)throw new Error('너무 큰 파일입니다.');
      const payload=JSON.parse(await file.text());const next=payload.page||payload;
      if(!validatePage(next))throw new Error('교회 홈페이지의 디자인 백업 파일이 아닙니다.');
      page=next;selected=page.sections[0]?.id||null;render();markChanged();show('백업을 불러왔습니다. 게시하려면 관리자 로그인이 필요합니다.');
    }catch(err){show('백업 불러오기 실패: '+(err.message||err));}
    finally{e.target.value='';}
  });
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data?.type==='church-editor:select')select(e.data.id,false);});
  window.addEventListener('beforeunload',e=>{if(!changed)return;e.preventDefault();e.returnValue='';});
}
let initialized=false;
async function init(){
  if(initialized)return;
  if(!frame.contentWindow?.churchVisual){setTimeout(init,200);return;}
  initialized=true;ready=true;page=frame.contentWindow.churchVisual.defaultPage();
  const cached=localStorage.getItem('church_visual_demo');
  if(cached){try{const x=JSON.parse(cached);if(validatePage(x))page=x;}catch{}}
  setMode(false);wire();render();
  if(configured){
    try{
      const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');client=createClient(cfg.url,cfg.publishableKey);
      if(!await startCloud()){
        const {data,error}=await client.from('church_published').select('content').eq('page_key','home').maybeSingle();
        if(!error&&validatePage(data?.content)&&!cached){page=data.content;selected=page.sections[0]?.id||null;render();}
      }
    }catch(e){console.warn('Supabase 연결 확인 실패',e);show('서버 연결이 확인되지 않아 체험 모드로 시작합니다.');}
  }
}
frame.addEventListener('load',init);
if(frame.contentDocument?.readyState==='complete')init();
