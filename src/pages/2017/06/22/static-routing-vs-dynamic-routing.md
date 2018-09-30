---
title: '[react] react-router(리액트 라우터) v3 VS v4'
date: 2017-06-22 22:55:43
category: react
tags:
  - react
  - routing
  - react-router
  - react-router v4
---

react-router v4 가 릴리즈 되면서 라우팅 적용 방식이 바뀌었습니다.
이전버전(v3)까지는 일반적으로 사용하는 정적 라우팅(Static Routing)이였다면, 동적 라우팅(Dynamic Routing)이 적용되었는데요.
여기서 말하는 정적 라우팅이란 일반적으로 최상위 페이지에 라우팅 정보를 모두 기입해 두고, 특정 패스가 브라우저에 입력되었을 때 해당되는 컴포넌트를 그려주는 방식을 말합니다. 모든 라우팅 정보가 한곳에 위치하기 때문에 관리하기 쉽다는 장점이 있겠지만, 정적이라는 특징 때문에 확장성과 재사용성은 떨어질 수 있습니다. 반면에 동적 라우팅의 경우에는 라우팅 정보를 한곳에 모아둘 필요가 없습니다. 라우팅이 필요한 컴포넌트에 직접 붙여 사용할 수 있기 때문에 동적으로 컴포넌트를 구성하는데 더 효율적이라 할 수 있습니다.

이외에도 몇가지 바뀐점이 꽤 있다보니 이전버전과 어떤 점이 달라졌나 비교해볼까 합니다.

[공식 홈페이지 바로가기](https://reacttraining.com/react-router/)

## 설치

설치하는 모듈을 선택할 수 있는데요. 이전 버전까지는 `react-router` 하나만 사용 할 수 있었는데,
이번에 버전업 되면서 몇가지 늘었습니다. react-router 는 코어 모듈이구요.
이밖에도 `react-router-dom`, `react-router-native` 등이 추가되었습니다.
react-router-dom 은 react-router 모듈에 dom 이 바인딩 되어 있다고 보시면 됩니다. 즉, 웹 개발자들을 위한 모듈이죠.
그리고 react-router-native 는 이름에서도 알 수 있듯이 react-native 를 개발할 때 사용하는 모듈입니다.
저는 웹개발자이기 때문에 당연히 react-router-dom 을 사용하도록 하겠습니다.

```
# v3
yarn add react-router
npm install react-router

# v4
yarn add react-router-dom
npm install react-router-dom
```

## v3 VS v4

v3 와 v4 의 차이점을 간략히 비교해 보았습니다.

|                | v3                                                     | v4                                                                  |
| :------------: | :----------------------------------------------------- | :------------------------------------------------------------------ |
|     라우팅     | 정적(static) 라우팅                                    | 동적(dynamic) 라우팅                                                |
| Route 컴포넌트 | 라우트 정보를 프로젝트 최상단에 모두 정의              | 코드 어디에나 사용 가능                                             |
|    계층구조    | 라우트 정보를 계층구조로 표현                          | 계층구조 대신 렌더링 되는 컴포넌트에 직접 구현 (계층구조 표현 안됨) |
|    히스토리    | browserHistory 에 저장하여 Router 객체에 props 로 삽입 | BrowserRouter 객체에 내장                                           |

## v3 의 라우팅 코드

프로젝트 구조를 자세히 설명하지는 않겠습니다.
간단히 구조만 살펴볼 것이기 때문에 최소한의 파일만으로 구성하였습니다.

react-router v3 는 정적 라우팅을 사용하기 때문에 미리 라우팅 정보를 탑 레벨에서 모두 정해두고 시작합니다.
react-router 는 계층구조로 설정할 수가 있는데, 최상위에 `Router` 컴포넌트를 만들고 `Route`(실제 패스에 따라 컴포넌트를 교체해주는 역할) 컴포넌트를 아래에 만듭니다. 그리고 또 그 아래에 `IndexRoute`가 있고 여러개의 `Route` 컴포넌트가 존재합니다.
어떤 url 이 브라우저에 입력되면(또는 앵커 태그가 클릭되면), 각 라우터에 해당하는 컴포넌트가 렌더링 되는 구조입니다.

예를 들어 `http://localhost:3000/second` url 이 브라우저에 입력되면 path 가 `/`인 라우트를 먼저 찾고 렌더링 합니다. 그리고 뒤에 해당되는 `second`를 찾아서 해당되는 컴포넌트를 렌더링 합니다.

App.js 파일의 App 클래스를 보면, Header 컴포넌트 아래에 `{this.props.childern}`이 있는데, 이 부분이 바로 path 가 `/`인 라우트 아래의 IndexRoute, first, second, third 인 부분이 렌더링 되는곳 입니다.

마지막으로 라우터의 히스토리는 browserHistory 에 저장해 둡니다. 그래야 브라우저에서 `뒤로가기`를 했을때 이전 페이지를 불러올 수 있기 때문이죠.

#### index.js

앱이 처음 시작하는 부분인 index.js 입니다.
index 에서 직접 라우팅을 구현하였습니다.
third 뒤의 `:id` 부분은 컴포넌트의 `this.props.params.id` 형태로 전달되어 컴포넌트 내에서 사용할 수 있습니다.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App, { Home, First, Second, Third, Item } from './App.js'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="first" component={First} />
      <Route path="second" component={Second} />
      <Route path="third/" component={Third}>
        <Route path=":id" component={Item} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
)
```

#### Header.js

헤더의 메뉴 부분입니다.
버튼에 클릭했을때 라우터의 정보에 따라 컴포넌트를 바꿔줍니다.

```jsx
import React, { Component } from 'react'
import { Link } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={'/'}>홈</Link>
          </li>
          <li>
            <Link to={'/first'}>첫번째</Link>
          </li>
          <li>
            <Link to={'/second'}>두번째</Link>
          </li>
          <li>
            <Link to={'/third'}>세번째</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default Header
```

#### App.js

헤더를 제외한 모든 컴포넌트가 들어있는 App.js 파일입니다.

App 컴포넌트는 최상위 패스인 `/`에서 렌더링 되는 부분인데요. `Header`와 같이 공통으로 사용하는 컴포넌트를 여기에 붙여줍니다.
그러면, 어떤 url 로 이동하더라도 Header 는 계속 노출되겠지요.

Third 부분이 v4 와 다른부분인데요. 컴포넌트 내에서 직접 라우팅 정보를 지정할 수 없기 때문에,
우회하는 방법으로 `this.props.children` 컴포넌트가 있는지 여부에 따라서 어떻게 렌더링할지를 결정합니다.

```jsx
import React, { Component } from 'react'
import Header from './Header.js'
import { Link } from 'react-router'

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>홈 페이지</h1>
      </div>
    )
  }
}

export class First extends Component {
  render() {
    return (
      <div>
        <h2>1, 첫번째 페이지</h2>
      </div>
    )
  }
}

export class Second extends Component {
  render() {
    return (
      <div>
        <h3>2, 두번째 페이지</h3>
      </div>
    )
  }
}

export class Third extends Component {
  render() {
    console.dir(this.props)
    return (
      <div>
        <Link to={'/third/1'} style={{ marginRight: '5px' }}>
          1번
        </Link>
        <Link to={'/third/2'}>2번</Link>
        {this.props.children ? (
          this.props.children
        ) : (
          <div>
            <h3>id를 선택해 주세요.</h3>
          </div>
        )}
      </div>
    )
  }
}

export class Item extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.params.id}</h3>
      </div>
    )
  }
}

export default App
```

결과 화면입니다.

![result](./result.png)

## v4 의 라우팅 코드

비교를 위해서 v3 와 동일한 화면으로 만들어 보겠습니다.

#### index.js

Router(BrowserRouter) 컴포넌트에 히스토리가 내장되어 있는걸로 보입니다.
v3 에서는 history 객체를 별도로 가져와 Router 의 프로퍼티로 넣어줘야 했습니다만, v4 에서는 어떤 설정도 해줄 필요가 없습니다.
또한, 라우터 컴포넌트 아래로 DOM 코드를 직접 넣어줄 수 있게 되었습니다.
이게 의미하는게 뭐냐면, 어떤 코드에서든 `Route` 컴포넌트를 넣을 수 있다는 뜻입니다.
즉, 라우트는 필요할때마다 동적으로 생성 가능하다는 것이죠.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home, First, Second, Third } from './App.js'
import Header from './Header.js'

ReactDOM.render(
  <Router>
    <div>
      <Header />
      <Route exact path="/" component={Home} />
      <Route path="/first" component={First} />
      <Route path="/first" component={First} />
      <Route path="/second" component={Second} />
      <Route path="/third" component={Third} />
    </div>
  </Router>,
  document.getElementById('root')
)
```

#### Header.js

v3 와 거의 같습니다.

```jsx
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to={'/'}>홈</Link>
          </li>
          <li>
            <Link to={'/first'}>첫번째</Link>
          </li>
          <li>
            <Link to={'/second'}>두번째</Link>
          </li>
          <li>
            <Link to={'/third'}>세번째</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default Header
```

#### App.js

App 컴포넌트를 아예 만들지 않습니다. v3 에서 App 컴포넌트의 역할은 공통으로 사용하는 컴포넌트를 붙여주기 위함이었는데요.
v4 에서는 라우트 컴포넌트 내에 직접 다른 컴포넌트를 붙여주면 되기 때문에 App 컴포넌트는 더이상 필요하지 않습니다.

그리고 `Third` 컴포넌트는 위에서 동적라우팅 설명할때 잠깐 언급했던 것처럼
컴포넌트 내에서 라우트 정보를 직접 넣어줄 수 있기 때문에 훨씬 명확한 코드를 작성할 수 있는것 같습니다.

```jsx
import React, { Component } from 'react'
import Header from './Header.js'
import { Route, Link } from 'react-router-dom'

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>홈 페이지</h1>
      </div>
    )
  }
}

export class First extends Component {
  render() {
    return (
      <div>
        <h2>1, 첫번째 페이지</h2>
      </div>
    )
  }
}

export class Second extends Component {
  render() {
    return (
      <div>
        <h3>2, 두번째 페이지</h3>
      </div>
    )
  }
}

export class Third extends Component {
  render() {
    return (
      <div>
        <Link to={`${this.props.match.url}/1`} style={{ marginRight: '5px' }}>
          1번
        </Link>
        <Link to={`${this.props.match.url}/2`}>2번</Link>
        <Route
          exact
          path={this.props.match.url}
          render={() => (
            <div>
              <h3>id를 선택해 주세요.</h3>
            </div>
          )}
        />
        <Route path={`${this.props.match.url}/:id`} component={Item} />
      </div>
    )
  }
}

class Item extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.match.params.id}</h3>
      </div>
    )
  }
}
```

결과 화면입니다. 똑같습니다.

![result](./result.png)

### 결론

> 아직 깊이 살펴보지 못해서 어떤 장점이 더 있는지는 모르겠습니다만,
> 어떻게 보면 v4 가 v3 에 비해서 산만해 보일수도 있습니다.
> 한곳에서 모든 라우팅 정보를 볼 수 있는게 좋다고 생각할 수도 있으니까요.
> 하지만, 리액트의 철학과 어울리는 라우팅 방식은 v4 의 동적 라우팅이 아닐까 생각이 듭니다.
