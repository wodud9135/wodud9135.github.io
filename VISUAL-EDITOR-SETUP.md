# 교회 홈페이지 비주얼 편집기 — 설치 방법

현재 교회 홈페이지를 유지하며 `/admin/`을 추가한 버전입니다. **바로 기존 사이트에 적용해도 기존 게시판 자료는 삭제되지 않으며, 디자인 변경을 게시하기 전에는 기존 메인 화면이 유지됩니다.**

## 0. 새 버전을 먼저 백업하세요

1. 기존 GitHub 저장소 `wodud9135.github.io`의 파일을 컴퓨터에 백업합니다.
2. 이 ZIP의 모든 파일/폴더를 기존 저장소 폴더에 **덮어쓰기**합니다. 기존 파일 삭제는 하지 마세요.
3. GitHub Desktop에서 `Commit to main` → `Push origin`을 진행합니다.
4. `https://wodud9135.github.io/admin/`으로 이동하면 비주얼 편집기가 열립니다.
5. **처음에는 체험 모드**로 실행됩니다. 이 모드는 PC 브라우저에만 저장하고 실제 홈페이지는 바꾸지 않습니다.

## 1. Supabase 프로젝트 만들기 (실제 온라인 저장·게시를 위해 필요)

1. https://supabase.com/dashboard 접속, 가입 후 `New project` 선택.
2. 프로젝트 이름은 예: `church-visual-editor`; Free 플랜, 가까운 지역 선택.
3. 왼쪽 메뉴에서 `SQL Editor`로 이동.
4. 이 ZIP 안의 `supabase/setup.sql` 전체를 붙여넣고 **Run**합니다.
5. 왼쪽 `Authentication` → `Users` → `Add user`에서 관리자 이메일과 안전한 비밀번호를 설정합니다. 이메일 확인이 필요한 설정인지 확인합니다.
6. 다시 `SQL Editor`로 돌아가 다음 SQL을 **관리자 이메일로 바꾸어 별도로 실행**합니다.

```sql
insert into public.church_admins(user_id)
select id from auth.users where lower(email)=lower('관리자이메일@example.com')
on conflict (user_id) do nothing;
```

관리자 외에는 데이터 수정·업로드가 차단되도록 Supabase RLS 정책을 설정했습니다. 관리자 이메일을 실제로 등록하지 않으면 로그인해도 편집 권한이 없습니다.

## 2. 공개 연결 정보 입력하기

1. Supabase Dashboard → `Project Settings` → `API Keys` (화면에 따라 `Connect` 또는 `Project API Keys`)에서 **Project URL** 및 **Publishable key**(`sb_publishable_...`) 혹은 legacy `anon` 키를 확인합니다.
2. 저장소의 `assets/js/site-config.js`를 텍스트 편집기로 엽니다.
3. 다음 두 칸에 실제 값을 입력한 후 저장합니다.

```javascript
window.CHURCH_SUPABASE = {
  url: 'https://PROJECTID.supabase.co',
  publishableKey: 'sb_publishable_...'
};
```

**주의:** `service_role`, `secret`, 데이터베이스 비밀번호는 절대 홈페이지 파일에 입력하지 마세요. 이 프로젝트의 코드는 공개 GitHub 저장소에 올라갑니다. 브라우저에 들어가는 publishable/anon 키는 공개를 전제로 하며, RLS가 서버에서 데이터 수정 권한을 검증합니다.

4. `Commit to main` → `Push origin`으로 배포합니다.
5. `https://wodud9135.github.io/admin/` 새로고침 → `관리자 로그인` 클릭 → Supabase 관리자 이메일과 비밀번호로 로그인합니다.
6. 이제 실제 임시 저장/게시가 가능합니다.

## 3. 디자인을 바꾸는 순서

1. 왼쪽에서 **메인 비주얼**을 선택하거나 가운데 미리보기에서 직접 클릭합니다.
2. 오른쪽에서 제목·설명·배경 사진을 수정합니다.
3. 왼쪽 **디자인 테마**에서 색과 글씨 크기를 변경합니다.
4. 영역을 드래그하거나 ↑↓ 버튼으로 순서를 바꿉니다.
5. **새 영역 추가**에서 소개 글, 사진 + 글, 카드 3개, 배너를 추가합니다.
6. `임시 저장`: 아직 방문자에게 공개되지 않음. `변경사항 게시`: 홈페이지에 실제 반영.
7. 게시한 후 홈페이지를 새로고침하세요. 디자인 설정은 Supabase에서 읽으므로 GitHub에 파일을 다시 올릴 필요가 없습니다.

## 4. 유지되는 기능과 현재 제한

- GitHub Pages의 Jekyll 기존 메뉴, 교회 소개, 예배 안내, 설교, 공지사항, 주보는 유지됩니다.
- 첫 버전에서 디자인 편집은 **메인 페이지에 한정**됩니다. 하위 페이지의 전체 레이아웃을 아임웹처럼 자유롭게 만드는 편집기는 아직 구현되지 않았습니다.
- **비주얼 선택 + 오른쪽 속성 변경 방식**입니다. 사진이나 글자를 화면 어디에나 픽셀 단위로 드래그하는 기능은 지원하지 않습니다.
- 기존 공지사항·주보·설교의 **글쓰기 기능은 현재 Pages CMS**에서 이용합니다. 이 버전의 로그인은 우선 디자인 관리자 기능에만 사용됩니다.
- 사진 업로드는 Supabase Storage 공개 버킷에 저장되므로 개인 정보나 내부 사진을 넣지 마세요.
- Supabase Free 프로젝트가 오래 사용되지 않으면 일시 중지될 수 있습니다. 이 경우 방문자는 기존 GitHub Pages 기본 디자인을 볼 수 있지만, Supabase에 게시한 디자인 변경사항은 프로젝트를 다시 활성화할 때까지 표시되지 않을 수 있습니다. 별도의 JSON 백업을 정기적으로 내려받으세요.
- 무료 Supabase에는 자동 DB 백업 보장이 없습니다. **상단 '백업 내보내기'로 JSON을 보관**하세요.
- 관리자 로그인 계정은 가능하면 MFA(2단계 인증)를 사용하고, 교회 소유 이메일을 이용하세요.

## 5. 이전 버전으로 되돌리기

GitHub Desktop의 History에서 비주얼 편집기 도입 직전 커밋으로 되돌리면 기존 Jekyll 사이트로 복귀할 수 있습니다. 이때 Supabase에 저장한 데이터는 남지만 GitHub Pages에서 더 이상 읽지 않습니다. 홈페이지 데이터는 `백업 내보내기`로 별도 보관할 수 있습니다.

## 6. 예상 운영비

- GitHub Pages: 무료 요건 충족 시 0원
- Supabase: Free 플랜 사용량 한도 내 0원 (자동 일시 중지 가능)
- 교회 도메인: 연장비 별도
- 추가 유료 도구 없음. Supabase 무료 플랜이 중단되거나 사용량이 늘면 별도 비용이 생길 수 있습니다.
