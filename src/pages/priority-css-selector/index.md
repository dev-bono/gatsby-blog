---
title: '[CSS] styled-jsx 버그 보고 경험기 (사실은 stylis js 버그)'
date: 2018-03-25 12:09:41
category: css
tags:
  - css
  - css selector
  - github
  - styled-jsx
  - stylis
---

CSS 는 일련의 가중치에 따라서 어떤 속성을 우선적으로 적용할 것인지 결정합니다. 우선순위에 대한 정보는 조금만 검색해보면 나오므로 간단히 [링크](https://gist.github.com/mjj2000/5873872)로 대체합니다.

현재 회사에서는 [nextjs]((https://github.com/zeit/next.js/)를 사용한 프로젝트를 진행하고 있습니다. nextjs 는 서버사이드렌더링(SSR)을 지원하는 리액트 전용 프레임워크입니다. [create-react-app](https://github.com/facebook/create-react-app)처럼 `non-configuration`을 지향하며 create-react-app 과는 다르게 일부 설정을 수정할 수 있습니다. nextjs 는 내부적으로 다양한 라이브러리들이 사용되고 있는데, react 컴포넌트(jsx)에서 CSS 코드를 작성하기 위해서 [styled-jsx](https://github.com/zeit/styled-jsx)를 사용합니다.

styled-jsx 는 서버와 클라이언트에서 모두 사용가능하고, 컴포넌트별 scope 를 지원합니다. 컴포넌트 scope 를 지원하기 위한 방법으로 `.jsx-xxxxxxxx`과 같은 클래스를 css 정의 요소에 붙여주는데요. 덕분에 대체로 아주 편리하게 사용하고 있었지만, 최근 한 가지 문제점을 발견했습니다.

```
<div>
  <div>
    <span className="title">빨간색으로 나와야 할텐데..</span>
  </div>
</div>
<style jsx>{`
  div > div > span {
    color: blue;
  }
  .title {
    color: red;
  }
`}</style>
```

`<span>`의 텍스트에 색상을 입히는 스타일이 두가지가 있습니다. 위쪽은 `div > div > span`처럼 element 의 cascade 형태로 정의하고, 아래쪽은 class 이름으로 정의합니다. class 가 10 점이라고 하면 element 는 개당 1 점이므로 `.title`의 가중치가 높아 `red` 색상의 텍스트가 출력되어야 합니다. 하지만, 결과는 아래와 같았습니다.

<span style="color:blue">빨간색으로 나와야 할텐데..</span>

우리가 익히 알고 있는 css 선택자는 `class`가 `element` 보다 명시도(가중치 또는 우선순위)가 높습니다. 위에서 언급한것처럼 element 가 1 점이라면 class 는 10 점으로 평가되기 때문입니다. 위의 CSS 코드에 점수를 매겨보면, 첫번째 스타일은 3 점이고 두번째 스타일은 10 점이 됩니다.

|     css      | specificity(명시도) |
| :----------: | :-----------------: |
| div>div>span |       0 0 0 3       |
|    .title    |       0 0 1 0       |

그런데 styled-jsx(`v2.2.x` 사용)를 통해서 컴파일이 완료되면 실제 명시도는 아래처럼 변경됩니다.

|                   css                   | specificity(명시도) |
| :-------------------------------------: | :-----------------: |
| div.jsx-1234>div.jsx-1234>span.jsx-1234 |       0 0 3 3       |
|             .title.jsx-1234             |       0 0 2 0       |

첫번째 스타일이 두번째 스타일보다 명시도가 높게 변했습니다. 원래 기대했던 것과는 전혀 다른 결과가 나왔네요. 사용법에 문제가 있었던 것인지, 아니면 이미 보고된 버그인지 확인하기 위해 styled-jsx github 페이지의 이슈를 검색해보았지만, 마땅한 버그를 찾을 수 없었습니다. 그래서 제가 [버그](https://github.com/zeit/styled-jsx/issues/424) 보고했습니다.

하루가 지나니 짜잔!!
`bug`로 등록되었습니다!!!

![bug](./bug.png)

쓰레드에 달린 글을 보니 styled-jsx 에서 사용하는 `stylis`가 문제였습니다. stylis 는 컴포넌트별 scope 를 만들기 위해 id, class, element 에 특정 해시(styled-jsx 의 경우 `jsx-1234`)class 를 붙여주는데, 가중치에 상관없이 모든 요소(id, class, element)에 class 를 붙여주다보니 결과적으로 원하지 않는 결과가 나온 것입니다. 이 문제에 대해서 곰곰히 생각해보았더니, 지금처럼 모든 요소에 해시 class 를 붙여줄것이 아니라 각 CSS 선택자마다 하나의 class 만 붙여주면 해결될것 같은 느낌이 들었습니다.

첫 element 에만 class 를 붙이거나,

|          css          | specificity(명시도) |
| :-------------------: | :-----------------: |
| div.jsx-1234>div>span |       0 0 1 3       |
|    .title.jsx-1234    |       0 0 2 0       |

마지막 element 에 class 를 붙이는식으로 처리하는 것입니다.

|          css          | specificity(명시도) |
| :-------------------: | :-----------------: |
| div>div>span.jsx-1234 |       0 0 1 3       |
|    .title.jsx-1234    |       0 0 2 0       |

모든 케이스를 고려해 보지 않았지만, 이런 방식으로 처리하면 문제가 해결될 것이라고 생각되어, 제가 보고했던 버그 스레드에 [댓글](https://github.com/zeit/styled-jsx/issues/424#issuecomment-375518440)을 달았습니다. 그랬더니, 와!!

![answer](./answer.png)

이후로 `stylis` [이슈](https://github.com/thysultan/stylis.js/issues/101) 에서 해결방안이 활발히 논의되고 있습니다(맨 앞 요소와 맨 뒤 요소에 `jsx-1234 를 붙여주는걸로 가닥을 잡은 것 같습니다). 제가 직접 코드를 기여하지 않았습니다만, 제 의견이 반영되니 묘한 기분이 들더군요. 지금껏 오픈소스에 기여한적이 없었기 때문에 그랬는지도 모르겠습니다. 다들 이 맛에 오픈소스 하는구나라는 생각이 드는 경험이었습니다.

#### 참고자료

- https://gist.github.com/mjj2000/5873872
- https://developer.mozilla.org/ko/docs/Web/CSS/Specificity
