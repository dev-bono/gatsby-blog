---
title: 'hexo에서 gatsby로 블로그 이전하기 (feat. tistory)'
date: 2018-10-07 01:09:30
category: gatsby
tags:
  - blog
  - hexo
  - gatsby
  - tistory
  - javascript
  - react
---

한동안 hexo 로 운영하던 github page 블로그에 글을 올리지 않았다. 최근 하나 올렸지만 거의 5 개월만이었다. 그 사이, 개발과는 무관한 블로그를 새로 시작했다. 예전부터 사용하던 블로그 플랫폼인 `tistory`에 둥지를 틀었고, 6 월부터 대략 세달동안 40 여개의 글을 포스팅했다. 일기도 쓰고 책 리뷰도 올렸다. 그런데, 쓰다보니 tistory 가 영 불안한다. 업데이트도 없고, 관리도 안하는 느낌이다. tistory 측 실수로 잘 운영하던 블로그를 폐쇄해야할 위기에 쳐했다는 분의 트윗을 보고나니 더더욱 불안해졌다. 안되겠다 싶어 고심한 끝에 개발 블로그랑 일반(?) 블로그를 합치자로 했다.

### Gatsby 란

[Gatsby](https://www.gatsbyjs.org/)는 [jekyll](https://jekyllrb.com/)이나 [hexo](https://hexo.io/ko/index.html)와 같은 정적 페이지 제너레이터(generator)다. jekyll 이 내부적으로 ruby(ruby on rails)를 사용하고 hexo 가 node.js 를 사용한다면, gatsby 는 웹 개발의 대세인 `react`를 사용한다. 사실, 몇 년 전까지만 해도 jekyll 이 대세였다. github page 로 블로그 만든다는 사람들은 거의 jekyll 을 사용했다. 하지만, 최근에는 hexo 나 gatsby 로 많이 넘어왔다(github star 개수를 보면 jekyll 이 가장 많지만 hexo 나 gatsby 도 꽤 많다). 아마도 hexo 나 gatsby 가 근래에 가장 많이 사용되는 언어인 javascript 로 만들어 졌기 때문일 것이다([The State of the Octoverse 2017](https://octoverse.github.com/), 여기서 `오픈된 pr 숫자`를 보라.). 사실, 블로그나 정적 페이지 웹사이트를 만들려는 사용자 입장에서는 어떤 도구를 사용해도 무방하다. 하지만, 사람들이 많이 쓰는 언어와 프레임웍을 기반으로 만들어진 도구가 더 빠르고 완성도 있게 발전한다.

### Gatsby 블로그 만들기

gatsby 를 만들때 하나부터 열까지 직접 구성해도 되지만, 초심자를 위해 `starter-kit`을 여러개 만들어 두었다.

> - [기본 starter-kit](https://github.com/gatsbyjs/gatsby-starter-default)
> - [블로그 starter-kit](https://github.com/gatsbyjs/gatsby-starter-blog)
> - [문서 starter-kit](https://github.com/gatsbyjs/gatsby-starter-documentation)

각각의 starter-kit 을 이용하면 각 목적에 맞게 설정파일(gatsby-config.js)이 만들어지고, 필요한 모듈 및 플러그인이 설치된다. 나는 블로그를 만들것이기 때문에 `gatsby-starter-blog` 를 설치했다.

1. 설치에 앞서, 몇가지 확인이 필요하다. 당연히 `node.js`와 `npm`이 설치되어 있어야한다. 호스팅할 곳에 따라 다르긴한데, [github page](https://pages.github.com/)를 이용할 것이라면 `git`도 설치해야 한다. 세가지가 갖춰졌으면 `gatsby CLI`를 global 로 설치하자.

```
npm install -g gatsby-cli
```

gatsby-cli 는 gatsby 명령을 커맨드라인에서 사용할 수 있게 해준다.

2. 사이트를 만든다. 프로젝트를 저장할 디렉토리에서 아래 명령을 실행한다(`gatsby-blog` 부분은 원하는 이름으로 정한다).

```
gatsby new gatsby-blog https://github.com/gatsbyjs/gatsby-starter-default
cd gatsby-blog
gatsby develop
```

3. 웹브라우저를 켜서 `localhost:8000`를 입력한다. 그러면, 블로그 형태의 gatsby 첫 화면이 나타난다. 이제, 글 쓰고 스타일 꾸미고 각종 플러그인을 추가해서 원하는 기능을 구현하면 된다.

### tistory 백업하기

tistory 가 가장 큰 걸림돌이었다. 예전에는 백업 기능을 지원했기 때문에 다른 블로그로 이전이 쉬웠다. 그런데, 무슨 이유인지 몰라도 그 기능을 삭제해버렸다. 아마 `다른 블로그로의 이전을 사전 차단함으로써 tistory 플랫폼에 머물도록 유도`하기 위한 것이라 생각된다. 만약 정말 그런거라면 한심하기 짝이 없는 구시대적 발상이다. 아무튼 이 난제를 해결하기 위해 먼저 리서치를 해보았다. 그나마 다행인건 tistory 가 제공하는 [오픈 API](https://www.tistory.com/guide/api/post)가 있어 직접 스크립트를 만들 수 있을것 같았다. 직접 만들어도 상관없지만, 귀찮아서 계속 찾아보았다. 그랬더니 누군가 만들어놓은 [python 스크립트](https://github.com/johnjkjung/backup-blogpost)가 있었다. 이를 이용해 글을 옮기기로 했다.

이 스크립트는 post 에 사용한 이미지를 추출해주고 본문을 마크다운(.md)로 변경해준다. 일단 스크립트를 실행해보았다. 다행히 글 추출을 잘 되었다. 하지만, 페이지의 foramt 이 github page 에 적합한 형태가 아니었다. 그래서 스크립트 일부를 수정했다. 글의 메타정보 부분이 제대로 나오도록 고치고 태그 추출이 제대로 되도록 수정했다. 다시 스크립트를 실행해보았다. 다행히 원하는대로 잘 추출되었다. 이제 글 형태는 어느정도 gastby 에 적합한 형태로 만들어졌다. 하지만, 문제가 하나 있었다. 추출된 파일 각각을 적절한(?) 폴더에 옮겨야한다는 것이다!!

gatsby 는 `src/page`라는 폴더에 모든 page 가 저장된다. 그리고 page 내부 폴더와 파일명이 곧 url 의 directory 가 된다(다른 정적 페이지 제너레이터도 비슷하다). 그래서 내가 원하는 형태의 url 을 만들기 위해 글마다 url 에 맞게 배치해줘야 한다(이게 진짜 문제다). 좋은 방법이 없을까 고민해보았다. 검색도 해보았다. 하지만, 별다른 수를 찾지 못했다. 어쩔수 없이 하나씩 직접 옮기기로 했다. 그나마 tistory 에 글이 40 개 밖에 없어서 다행이었다. 만약 tistory 에 수백개나 천개가 넘어가는 글이 있었다면 어떻게 했을까? 상상도 하기 싫다.

### hexo 에서 gatsby 로 글 이전하기

tistory 이전이 끝났으니 hexo 에 있는 글을 gatsby 로 이전 할 차례다(끝이라기 보다는 시작이다...). 우선 gatsby 블로그 소스를 관리하기 위해 github 저장소를 만들었다. 그리고 github 저장소에 위에서 만든 `gatsby-blog` 를 연동했다. hexo 에서 gatsby 로 글을 옮기는 작업은 간단했다. hexo 에 글이 저장된 폴더에서 gatsby 에 글이 저장될 폴더로 이동하면 된다. tistory 에 비하면 정말 간단했다.

hexo 에 글이 저장되는 위치는 아래와 같다.

```
source/_posts/
```

gatsby 에 글이 저장되는 위치는 아래와 같다.

```
src/pages/
```

참고로, 반드시 src/pages 를 사용할 필요는 없다. `gatsby-config.js`파일의 `plugins`에서 아래부분을 수정하면 root 폴더를 변경할 수 있다.

```
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/src/pages`, // 이부분을 변경하면 된다
    name: 'pages',
  },
},
```

hexo 에서 사용하던 메타데이터(gatsby 에서는 `frontmatter`라 한다)를 그대로 사용해도 되지만, 옮기는 김에 tistory 에서 옮겨온 글과 통일하기 위해 일부를 수정했다. 각각의 글에서 불필요한 요소를 지우고 태그 내용도 수정했다. 모든 글(대략 60 개)을 수정하다보니 꽤 시간이 걸렸다. 그래도 tistory 글 옮길때보단 금방했다. 참고로 gatsby 의 frontmatter 구조는 대략 아래와 같다.

```
---
title: '제목을 쓰자'
date: 2018-10-07 00:00:00
category: javascript
tags:
  - javascript
  - ES6
  - var
  - const
  - let
---
```

frontmatter 에 딱히 항목이 정해져 있는건 아니다. 코드내에서 가져다 쓸때 `frontmatter.property`로 접근해서 값을 가져오면 된다.

### 각종 플러그인

gatsby 에 기능을 붙일때는 대부분 플러그인을 사용한다. 플러그인 설치는 아래와 같은 과정으로 이뤄진다.

> 1. 필요한 기능이 있다면, 먼저 [플러그인을 검색](https://www.gatsbyjs.org/plugins/)한다.
> 2. 플러그인을 찾으면 `npm install -S [플러그인이름]`으로 모듈을 설치한다.
> 3. `gatsby-config.js` 파일에 `plugins` 속성을 찾고, 그 하위에 해당 플러그인을 추가한다.
> 4. 플러그인 기능이 필요한 부분에 `import [별명] from [플러그인이름]`으로 플러그인을 불러와 사용한다.

예를들어 코드 블럭을 이쁘게 보이도록 하려면 [gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/)를 사용하면 된다. 그 밖에 react 에서 document 의 head 태그에 코드를 추가하고 싶을때는 [gatsby-plugin-react-helmet](https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet)을 사용한다.

### 댓글 붙이기

이전에는 댓글 시스템으로 [disqus](https://disqus.com/)를 사용해왔다. disqus 를 사용하려다가 이번에는 좀 더 간결한 모듈인 [utterances](https://github.com/utterance/utterances)를 사용해보기로 했다. utterances 는 github 의 댓글 시스템을 그대로 이용한다. 하나의 글에 누군가 댓글을 남기면 github 저장소에 글 url 로 issue 가 생성된다. 누가 만든지 몰라도 참 기발하다. 이거다 싶어, 바로 적용해보았다. 보이는 모습도 github 의 댓글과 같아서 나쁘지 않았다. 그런데, 문제가 하나 있었다. 댓글을 쓰려면 깃헙 로그인을 해야하는 것이다. 개발 블로그라면 별 문제없다. 그런데 지금 tistory 와 hexo 블로그를 합쳤으니 더이상 개발블로그가 아니다. 개발과 상관없는 글도 많다. 이런 글에 누군가 댓글을 쓰려 하는데, github 에 로그인 해야한다면 어떻겠는가? 만약 개발자가 아니라면?? 나라면 그냥 댓글 안달고 말겠다. 그래서 어쩔수 없이 소셜 로그인이 가능한 disqus 로 다시 바꿔 달았다.

### 앞으로 해야할 일

> - footer 만들기
> - tag 페이지 만들기 (현재는 `태그`메뉴를 클릭하면 메인페이지로 간다)
> - Typescript 적용
> - ts-lint 적용
> - prettier 마크다운 최적화 (사용하다보니 조금씩 문제가 있다)

### 참고자료

> - [개츠비 공식 사이트](https://www.gatsbyjs.org/)
> - [github pages](https://pages.github.com/)
> - [The State of the Octoverse 2017](https://octoverse.github.com/)
> - [나의 gatsby-blog 저장소](https://github.com/blueshw/gatsby-blog)
> - [@adhrinae 님의 "Gatsby 를 활용한 블로그 재구성"](https://adhrinae.github.io/posts/creating-new-blog-with-gatsby)
