# 초보자를 위한 초간단 시작 안내

**현재 상태:** 홈페이지 소스 코드와 관리 편집 설정이 준비된 초기 버전입니다. 실제 GitHub 연결/도메인 공개는 직접 진행해야 합니다.

## 최초 1회만 하는 설정

1. GitHub 가입 → `내아이디.github.io` 공개 저장소 생성
2. GitHub Desktop으로 저장소 복제
3. 이 압축파일 안의 **모든 파일과 폴더** 복사 → Commit → Push
4. GitHub → Settings → Pages → main / (root) 설정
5. 무료 홈페이지 확인: `https://내아이디.github.io/`
6. `https://app.pagescms.org` → GitHub 로그인 → Pages CMS 앱 승인 → 저장소 선택
7. 메뉴에서 새 공지/새 주보/새 설교 작성
8. 기본 정보 수정 후 `(예시)` 글을 교체
9. 필요하다면 도메인 구입 후 GitHub Pages에 연결

## 홈페이지 주요 파일

- 배경·예배 시간·주소: CMS의 **교회 기본 정보**에서 편집
- 새 공지: CMS의 **공지사항**에서 편집
- 주보 PDF: CMS의 **주보 등록**에서 편집
- 설교 영상: CMS의 **설교 영상**에서 편집
- 전체 디자인 색상·글씨 크기: `assets/css/site.css` 수정
- 메뉴와 페이지 구조: `_layouts/default.html`, 각 `*.html` 수정

*GitHub 저장소 안에 비밀번호, 주민등록번호, 교인 명단 등의 개인정보를 올리지 마세요.*
