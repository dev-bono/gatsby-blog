---
title: "[ReactJs] create-react-app으로 react 시작하기"
date: 2017-06-20 18:40:02
tags:
- React
- js
- create-react-app
---
리액트를 본격적으로 사용하기 시작하면서 각종 라이브러리의 테스트 및 실험을 해볼 필요가 생겼습니다. 몇 가지 boilerplate 프로젝트를 찾아보다가 동료로부터 [create-react-app](https://github.com/facebookincubator/create-react-app)이라는 프로젝트에 대해 듣게 되었습니다(이제서야 알게되다니..). 

대부분의 비공식적인 boilerplate 프로젝트들은 package.json과 같은 모듈 관리 파일에 필요한 모듈을 모두 정의해두고 설치해서 사용합니다. 그러다보니 특정 시점에 boilerplate 프로젝트를 다운받아 사용하다보면 어느새 오래된 프로젝트가 되어버리는 경우가 허다하죠. 워낙에 빠르게 변하는 js 환경이다 보니 일일이 변경되거나 업데이트된 부분을 바꿔주는것도 한계가 있습니다. create-react-app을 이용하면 이 문제는 한번에 해결됩니다. (물론 추가로 설치한 모듈들에 대한 관리는 해줘야 합니다)

설치는 아주 간단합니다.

우선 프로젝트를 받아서(git clone을 하던 zip으로 받던 상관없어요) create-react-app 모듈을 글로벌로 설치해줍니다.

~~~
npm install -g create-react-app
~~~

> node 버전은 v8.1.2를 사용하였습니다 (npm은 v5.0.3)

그리고는 앱을 생성합니다.

~~~
create-react-app react-test
cd react-test
~~~

만들어진 react-test 앱에 들어가보면 아래와 같은 구조로 프로젝트가 만들어져 있습니다.

~~~
react-test/
  README.md
  node_modules/     # 이미 modules가 설치되어 있습니다.
  package.json      # 의존성 패키지는 대부분 node_modules/react-scripts 모듈내에 선언되어 있습니다.
  .gitignore
  public/
    favicon.ico
    index.html
    manifest.json
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js        # 앱이 시작되는 부분입니다.
    logo.svg
    registerServiceWorker.js    # prodution 레벨에서 로컬캐시로부터 리소스를 제공하기 위한 서비스 워커 관련 설정, 
~~~

앱을 실행해봅니다.

~~~
npm start
~~~

제대로 동작하는걸 확인합니다. 끝입니다.

만들어진 앱에 기본적으로 포함하고 있는 모듈은 아래와 같습니다.
이외에 필요한 모듈은 직접 설치하셔서 사용하면 되겠습니다.

* Webpack : minify, uglify 등을 포함한 모듈 번들링 도구
* Babel : ES6, React 등의 문법을 ES5 코드로 변환시켜주는 트랜스파일러
* Autoprefixer : 다양한 벤더(브라우저)들에게 적절한 CSS가 적용될 수 있도록 prefix를 붙여준다.
* ESLint : 자바스크립트 lint, 코드 컨벤션과 오류 등을 잡아준다.
* Jest : 자바스크립트 테스트 도구
* 이외에 여러개

아무런 설정없이 react부터 하나하나씩 설처해보는 것도 큰 도움이 되겠지만, 초기에 webpack 같은 번들링 도구에 대한 이해와 삽질하는데 상당한 시간이 소요됩니다(정말 그렇습니다). 정말 react에만 집중하고 싶다면 이런 프로젝트를 이용해서 개발하는게 react 입문자들에게는 훨씬 도움되는 일이라 생각합니다. 

## 참고자료

> [create-react-app github](https://github.com/facebookincubator/create-react-app)
> [craete-react-app 가이드 문서](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts/template)
