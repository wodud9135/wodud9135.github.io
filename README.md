# 교회 홈페이지 스타터 (GitHub Pages + Pages CMS)

AI와 함께 제작한 교회 홈페이지 **초기 버전**입니다. 정적 웹사이트를 GitHub Pages에 무료로 공개하고, 공지사항·주보 PDF·설교 영상을 Pages CMS 관리 화면에서 등록할 수 있습니다.

> **중요:** 아직 GitHub에 업로드하거나 실제 도메인에 연결하지 않은 코드입니다. 교회 이름·예배 시간·주소·사진·설교·주보는 전부 예시/입력 안내입니다. 실사용 전에 반드시 수정해 주세요. 관리자 편집 화면은 교회 사이트에 내장한 것이 아니라 **외부 Pages CMS**로 연결됩니다.

## 1. 프로젝트 구조

```text
교회홈페이지/
├─ index.html                 메인 화면 (Jekyll 템플릿)
├─ about.html                 교회 소개
├─ worship.html               예배 안내
├─ nextgen.html               다음세대
├─ directions.html            오시는 길
├─ notices/index.html         공지사항 목록
├─ bulletins/index.html       주보 목록
├─ sermons/index.html         설교 목록
├─ admin/index.html           관리 화면 진입 안내 (외부 Pages CMS 연결)
├─ _data/settings.yml         교회 기본 정보
├─ _notices/                  공지 글 (Markdown)
├─ _bulletins/                주보 글 (Markdown + PDF 링크)
├─ _sermons/                  설교 글 (Markdown + 유튜브 링크)
├─ _layouts/                  공통 화면 틀
├─ assets/css/site.css        전체 디자인
├─ assets/js/site.js          모바일 메뉴·설교 영상
├─ assets/images/             기본 일러스트
├─ assets/uploads/            관리 화면에서 업로드할 사진/PDF
├─ _config.yml                GitHub Pages Jekyll 설정
└─ .pages.yml                 Pages CMS 편집 설정
```

## 2. 가장 쉬운 공개 방법: GitHub Desktop 사용 (Windows)

1. [GitHub](https://github.com/)에서 무료 계정을 만듭니다. 가능하면 교회에서 인수인계할 수 있는 관리 계정을 사용하세요. **2단계 인증을 켜 주세요.**
2. [GitHub Desktop](https://desktop.github.com/)을 설치하고 GitHub 계정으로 로그인합니다.
3. GitHub 웹사이트의 `New repository`에서 저장소를 **`GITHUB아이디.github.io`**로 만듭니다. 예: ID가 `mychurch`라면 `mychurch.github.io`. `Public`으로 설정하고 생성합니다.
4. GitHub Desktop의 `File → Clone repository`에서 새 저장소를 컴퓨터에 내려받습니다.
5. 이 ZIP을 **압축 해제**해서 나온 파일과 폴더를 **모두** 복제한 저장소 폴더에 복사합니다. `index.html`, `.pages.yml`, `_config.yml` 등이 저장소의 **최상위 폴더**에 있어야 합니다. ZIP 파일 자체를 올리면 안 됩니다.
6. GitHub Desktop에서 변경 사항을 확인해 `Commit to main`을 누른 다음 `Push origin`을 누릅니다.
7. GitHub 웹사이트에서 저장소 → `Settings → Pages` → `Build and deployment` → `Source: Deploy from a branch` → `Branch: main` / `/(root)` 선택 → `Save`.
8. Jekyll 빌드가 정상 처리되면 `https://GITHUB아이디.github.io/`에서 홈페이지를 볼 수 있습니다. 첫 공개 후 `Actions` 또는 Pages 화면에서 배포 상태를 확인하세요.

**주의:** 저장소 이름이 `아이디.github.io`가 아니라면 `/_config.yml`의 `baseurl`을 `"/저장소이름"`으로 바꾸어야 합니다. 이 시작판은 **사용자/단체 홈페이지 저장소 + 자체 도메인**을 기준으로 구성했기 때문에 위 이름을 권장합니다.

## 3. 관리자 화면 연결: Pages CMS (무료)

1. 사이트가 GitHub에 올라가고 `.pages.yml` 파일이 저장소 최상위에 있는지 확인합니다.
2. [https://app.pagescms.org](https://app.pagescms.org)에 접속합니다.
3. `Sign in with GitHub`를 누르고 GitHub 계정으로 로그인합니다.
4. 필요하면 **Pages CMS GitHub App**을 설치하여 이 홈페이지 저장소에 접근 권한을 부여합니다. 가능하면 **선택한 저장소만** 접근하도록 설정합니다.
5. 홈페이지 저장소를 선택하면 다음 메뉴가 나타납니다.
   - `공지사항`: 제목·게시 날짜·본문을 쓰는 편집 화면
   - `주보 등록`: 제목·날짜·PDF 파일 첨부 화면
   - `설교 영상`: 제목·성경 본문·설교자·유튜브 주소 등록 화면
   - `교회 기본 정보`: 교회 이름, 예배 시간, 주소, 배경 사진 수정
6. `새 글`(New)로 작성하고 저장합니다. Pages CMS가 GitHub 저장소 파일을 수정하고, GitHub Pages 빌드가 완료되면 홈페이지에 반영됩니다.

홈페이지 하단의 **관리자** 링크는 `app.pagescms.org`로 안내하는 진입 페이지입니다. 교회 사이트 내부에서 직접 로그인하는 구조는 아닙니다. 글을 쓸 수 있는 사람은 GitHub/Pages CMS에서 접근 권한이 허용된 사람뿐입니다.

> Pages CMS 공식 문서: https://pagescms.org/docs/quick-start/

## 4. 매주 운영하는 방법

### 공지사항 등록
`Pages CMS → 공지사항 → New/새 글` → 제목·날짜·본문 → 저장. 메인 페이지에는 최신 공지 최대 4건이 표시됩니다.

### 주보 PDF 등록
`Pages CMS → 주보 등록 → New/새 글` → 주보 제목·날짜 → **PDF 파일 선택/업로드** → 저장. PDF는 `assets/uploads/documents` 폴더에 저장되며, 주보 상세 화면에 PDF 버튼이 표시됩니다. 주보는 스캔 이미지보다 텍스트가 검색되는 PDF로 만드는 것을 권장합니다.

### 설교 유튜브 등록
`Pages CMS → 설교 영상 → New/새 글` → 제목·날짜·본문·설교자·유튜브 주소 → 저장. `https://www.youtube.com/watch?v=영상ID`, `https://youtu.be/영상ID`, `https://www.youtube.com/live/영상ID` 등을 지원합니다. 유효한 주소면 상세 화면에 영상이 표시됩니다.

### 예배 시간, 연락처 및 교회 이름 수정
`Pages CMS → 교회 기본 정보`에서 수정합니다. **교회 이름, 예배 시간, 전화번호, 지도 링크, 메인 사진** 등을 바꿀 수 있습니다.

### 메인 배경 사진 교체
`교회 기본 정보 → 메인 배경 사진`에서 실제 교회 사진을 업로드합니다. 업로드하지 않으면 제작자가 직접 그린 *예시 교회 일러스트*가 표시됩니다. 인터넷에서 찾은 타 교회의 사진은 허가 없이 사용하지 않는 것이 좋습니다.

## 5. 자체 도메인 연결 (선택)

처음에는 `https://GITHUB아이디.github.io/` 무료 주소로 시험해 본 뒤 실제 도메인을 연결하는 것이 안전합니다.

1. 교회에서 사용할 도메인(예: `www.example-church.kr`)을 등록 업체에서 구입합니다.
2. GitHub 저장소 → `Settings → Pages → Custom domain`에 **실제 사용할 도메인**을 입력하고 저장합니다.
3. `www` 하위 도메인은 도메인 등록 업체의 DNS 설정에서 다음 값을 사용합니다.
   - 유형: `CNAME`
   - 이름: `www`
   - 값: `GITHUB아이디.github.io` (**https:// 없이**)
4. 최상위 도메인(`example-church.kr`)도 쓰려면 GitHub 공식 문서에 따라 `A` 레코드를 추가합니다. 정확한 값과 보안 주의사항은 공식 문서를 확인하세요.
5. GitHub Pages에서 `Enforce HTTPS`를 활성화합니다. DNS 적용과 인증서 발급에는 시간이 걸릴 수 있습니다.

공식 문서: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

**보안:** 도메인을 GitHub 설정에 먼저 연결하고, 도메인 소유 검증을 권장합니다. `CNAME` 파일은 GitHub의 도메인 설정으로 자동 관리되므로 미리 만들지 않았습니다.

## 6. 무료 운영의 조건 및 주의사항

- GitHub Free에서 Pages 호스팅은 일반적으로 **공개 저장소**를 이용합니다. `.pages.yml`과 사이트 코드, 공개 게시글 및 공개 PDF도 모두 공개될 수 있으므로 **비밀 정보, 개인정보, 내부 자료를 올리지 마세요.**
- 교인 전화번호, 어린이 사진 등 개인정보는 동의 및 게시 기준을 확인하고 올리세요.
- Pages CMS는 무료 외부 서비스이며 장기적으로 가격·제공 조건이 바뀔 수 있습니다.
- 회원가입, 개인별 접근 제한, 기도제목 비공개 게시판, 실시간 댓글/결제 등은 이 시작판에 포함되지 않습니다. 별도 백엔드가 필요합니다.
- Jekyll 빌드 및 GitHub Pages 게시에는 약간의 반영 지연이 생길 수 있습니다. `Actions` 또는 Pages 배포 상태를 확인하세요.
- 인터넷이 안 되는 환경에서는 웹폰트가 시스템 글꼴로 대체됩니다. 사이트 본체 및 예시 일러스트는 외부 파일 없이 동작합니다.

## 7. 배포 전 점검 목록

- [ ] `_data/settings.yml`의 교회 이름·주소·연락처·예배 시간 입력
- [ ] 메인 배경 일러스트를 실제 교회 사진으로 변경 (원하는 경우)
- [ ] `_notices`, `_bulletins`, `_sermons`에 들어 있는 `(예시)` 글을 실제 게시글로 교체/삭제
- [ ] 유튜브 링크 및 지도 링크 연결
- [ ] 휴대전화와 PC에서 메뉴와 글씨 크기 확인
- [ ] 관리자 계정 2단계 인증 및 담당자 권한 점검
- [ ] 자체 도메인 등록 및 HTTPS 확인

## 8. 비용

- GitHub Pages: 일반적인 사용 범위에서 무료
- Pages CMS 호스팅 서비스: 현재 무료
- 자체 도메인: 등록/갱신 비용 발생 (도메인 종류와 업체별 차이)
- 외부 유료 서비스 및 교회용 이메일은 별도

---

**기술 기반:** HTML + CSS + JavaScript + Jekyll (GitHub Pages 기본 정적 사이트 생성기) + Pages CMS (GitHub 저장소 파일 편집 UI).

## 비주얼 홈페이지 편집기 (추가 기능)

- 주소: `/admin/` — 기본 디자인 유지, 메인 페이지를 화면 보면서 수정 가능
- 초기: Supabase 연동 전에는 체험 모드에서 로컬 미리보기 및 JSON 백업 가능
- Supabase와 연결하면 관리자 이메일/비밀번호 로그인, 서버에 임시저장, 변경사항 게시, 사진 업로드 지원
- 실제 연결 방법: [`VISUAL-EDITOR-SETUP.md`](VISUAL-EDITOR-SETUP.md)
- SQL 정책: [`supabase/setup.sql`](supabase/setup.sql)
- 연결 파일: `assets/js/site-config.js` (공개 키만 입력, secret/service_role 금지)
- 주보·공지·설교의 기존 Pages CMS 기능은 그대로 유지됩니다.
