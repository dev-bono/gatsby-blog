---
title: '[react] v16.3.0, 무엇이 바뀌었나?'
date: 2018-04-05 01:22:35
category: react
tags:
  - react
  - v16.3.0
---

react v16.3.0 이 릴리즈 되었습니다. 개인적인 생각으로는 가장 큰 변화는 두가지 정도입니다. 첫번째는 몇몇 lifecycle method 가 deprecated 되었습니다. 그리고 새로운 Context API 가 추가되었습니다. 그 외에 몇가지 변화를 요약해보면 아래와 같습니다.

> - 새로운 Context API
> - 새로운 Refs API
> - lifecycle 메서드 변경
> - 새로운 Strict mode

자세한 사항은 [공식사이트 포스트](https://reactjs.org/blog/2018/03/29/react-v-16-3.html)를 참조하세요.

## Context API

간단히 말해서 Context 는 앱 전체에 공통으로 사용할 데이터를 담는 역할을 합니다. 저는 개발하면서 한번도 사용해본적은 없습니다만, react-redux, react-router 등의 react 관련 핵심 라이브러리에서 Context 가 사용되고 있습니다. 리덕스를 사용하고 있다면 아래와 같은 코드 조각을 본적이 있을 것입니다.

```
<Provider store={store}>
  <App />
</Provider>
```

react-router 의 경우에는 브라우저 history 관리등을 위해 Context 를 사용하고 있습니다.

```
this.props.history.push('/list');
```

props 로 하위 컴포넌트에 데이터를 넘기는 전통적인 방식은 간단한 어플리케이션 개발에는 아무런 문제가 없습니다. 하지만 어플리케이션이 복잡해지고 하위 컴포넌트의 단계가 많아질수록 이런식의 상태 관리는 개발난이도가 높아질뿐 아니라 유지보수 측면에서도 문제를 야기할 수 있습니다. 이럴때 Context 는 하나의 대안이 될 수 있습니다.

이전 버전의 react 에도 Context API 가 있었습니다. 다만, 공식적인 API 라기보다는 실험적인 수준이었기 때문에 사용을 권장하지 않았습니다. 이번 v16.3.0 버전에서 공식적으로 `Context API`가 발표되었기 때문에 지금까지 Context 가 어떻게 쓰였고 앞으로 어떤 방식으로 사용 가능할지 알아볼 필요가 있겠습니다.

### 기존 Context API

실험적인 방법이라고하지만, 주요한 라이브러리에는 이미 context 를 사용하고 있습니다.

#### App.jsx

```
export default class App extends Component {
  render() {
    return (
      <OldProvider userId="bono" nickName="보노">
        <OldConsumer />
      </OldProvider>
    );
  }
}
```

#### OldProvider.jsx

`OldProvider`에서 context 데이터를 미리 만들어줍니다.

```
export default class OldProvider extends Component {
  static childContextTypes = {
    userId: PropTypes.string,
    nickName: PropTypes.string
  };
  getChildContext = () => {
    return {
      userId: this.props.userId,
      nickName: this.props.nickName
    };
  };
  render() {
    return <div>{this.props.children}</div>;
  }
}
```

#### OldConsumer.jsx

`Provider`로 감싸진 컴포넌트 어디에서든 `this.context`로 context 데이터에 접근이 가능합니다.

```
export default class OldConsumer extends Component {
  render() {
    const { userId, nickName } = this.context;
    return (
      <div>
        <h1>{userId}</h1>
        <h2>{nickName}</h2>
      </div>
    );
  }
}
```

### new Context API

위의 기능을 새로 발표된 Context API 를 사용하여 구현합니다. 파일 개수가 하나더 증가했습니다. 하지만 생성, 공급, 소비와 같이 관심사가 확실하게 분리되기 때문에 훨씬더 구조적인 모습입니다.

#### App.jsx

```
export default class App extends Component {
  render() {
    return (
      <Provider userId="bono" nickName="보노">
        <Consumer />
      </Provider>
    );
  }
}
```

#### Context.jsx

`Provider`와 `Consumer`에서 공통으로 Context 객체를 사용하기 위해 Context.tsx 를 별도로 생성합니다.

```
export default React.createContext();
```

#### Provider.jsx

Context 객체에 데이터를 넣어주는 역할을 합니다.

```
export default class Provider extends Component {
  render() {
    return (
      <Context.Provider value={this.props}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
```

#### Consumer.jsx

Context 의 데이터를 사용하는 부분입니다. 좀 특이한 것은 `<Context.Consumer>` 컴포넌트 바로 아래가 React Element 를 리턴하는 함수 형태로 되어 있다는 것입니다. 이는 [Render Props](https://reactjs.org/docs/render-props.html)라는 패턴입니다.

```
export default class Consumer extends Component {
  render() {
    return (
      <Context.Consumer>
        {value => (
          <div>
            <h1>{value.userId}</h1>
            <h2>{value.nickName}</h2>
          </div>
        )}
      </Context.Consumer>
    );
  }
}
```

Consumer 에서 context 를 사용할때마다 Render Props 패턴으로 context 의 데이터를 가져와야하는 부분이 거슬리는데, 이는 `HOC`를 이용해 context 의 value 를 prop 으로 가져오도록 구현하면 됩니다(자세한 구현은 생략).

Context API 를 사용한 위 두가지 방법은 각각 아래와 같은 형태로 출력됩니다.

![context](./context.png)

## Refs API

ref 는 reference 의 줄임말로, 특정 컴포넌트를 참조합니다. 컴포넌트를 참조하기 때문에 컴포넌트 내의 변수나 상태, 메서드를 사용할 수 있습니다.

그 동안 Ref 사용시 [몇가지 문제점](https://github.com/facebook/react/issues/1373)이 있었는데, 이를 해결하기위해 새로운 Ref API 가 나왔습니다. 역시 이전의 ref 사용법과 비교해 보겠습니다.

### old Ref

기존의 ref 는 string 형태로 정의합니다(아마 string 형태로 정의하는게 여러 문제를 야기하지 않았을까 추측해봅니다). ref 의 대상이 되는 컴포넌트에 ref 속성을 만들고 텍스트로 이름을 만들어줍니다. 그리고 `this.refs.xxx`와 같이 사용하면 됩니다.

```
export default class OldRef extends Component {
  componentDidMount() {
    this.refs.oldRef.focus();
  }
  render() {
    return (
      <div>
        <span>oldRef: </span>
        <input type="text" ref="oldRef" />
      </div>
    );
  }
}
```

### new Ref

공식문서의 예제와 동일한 형태입니다. 위의 OldRef 와 비교해보면, 우선 ref 가 string 에서 `객체형태`로 바꼈습니다. 그리고 `createRef()` 함수로 ref 를 만든 다음 실제 타겟 컴포넌트의 ref 속성에 해당 객체를 할당합니다. ref 를 사용할때는 생성자함수에서 만들어둔 `this.inputRef`를 그대로 이용합니다.

```
export default class NewRef extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <div>
        <span>newRef: </span>
        <input type="text" ref={this.inputRef} />
      </div>
    );
  }
}
```

새로 만들어진 ref API 에 한가지 한계가 있는데 HOC 로 만들어진 컴포넌트의 속성에 `ref`가 있으면 리턴되는 컴포넌트에서 이 ref 를 가져오지 못합니다. 이 문제를 해결하기 위해서는 HOC 내부에서 `forwardRedRef`를 이용하면 리턴되는 컴포넌트에 무사히 전달할 수 있습니다. 자주 사용할 것 같지 않은 API 이므로(나만 그런가..) 코드설명 없이 넘어가겠습니다.

## lifecycle 메서드

그 동안 `will` 관련 메서드가 deprecated 될것이라는 말이 비공식적으로 여러번 나왔습니다. 새로운 버전에서 드디어 이 말이 현실이 됐습니다. `componentWillUnMount`를 제외한 나머지 will 메서드들이 공식적으로 deprecated 되었으며, 기존 메서드를 사용하기 위해서는 `UNSAFE_` prefix 를 붙여줘야합니다. (ex. UNSAFE_componentWillMount, ㅎㄷㄷ) 쓰지 말라는 얘기죠.

그리고 두가지 새로운 메서드가 나왔습니다.

> - [getDerivedStateFromProps](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
> - [getSnapshotBeforeUpdate](https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)

`getDerivedStateFromProps`는 componentWillReceiveProps 의 대안으로 사용할 수 있는 메서드입니다. 다만 차이가 있다면, 첫째로는 메서드 이름에서 알 수 있듯이 `return` 값이 존재(해야만)한다는 것이고, 또 static 메서드라는 점입니다. 이 메서드를 사용할때는 반드시(should) update 된 state 를 리턴해주어야합니다. 그리고 static 이기 때문에 `this` 키워드를 사용할 수 없습니다. 그래서 componentWillReceiveProps 의 완전한 대체제라고 말하기 어렵습니다. 만약 기존에 사용하던 componentWillReceiveProps 메서드에 `this`가 사용되고 있다면, getDerivedStateFromProps 가 아닌 `componentDidUpdate`를 대신 사용해야할 것입니다.

`getSnapshotBeforeUpdate`는 가장 최근에 렌더링된 결과의 상태를 가져옵니다. 공식사이트에서 예를 든것처럼 새로 렌더링 되기전 scroll 상태를 기억하고 있다가 렌더링 된 후에 다시 이전 scroll 위치로 돌아올때 유용하게 사용될 수 있을것 같습니다.

## 정리

이번 v16.3.0 에서 가장 큰 부분은 Context API 와 lifecycle 메서드의 변화입니다. Context API 는 react 주요 라이브러리에서 많이 사용되고 있었던 만큼 각 라이브러리에 새로운 Context API 가 적용될 것입니다. 그리고 공식적으로 나온 API 이기 때문에 컴포넌트 depth 가 큰 곳에는 적절히 사용할 수도 있을것 같습니다. lifecycle 메서드는 리액트의 앞으로의 방향인 [Async Mode](https://www.youtube.com/watch?v=v6iR3Zk4oDY)에 맞게 재조정된것이라 생각합니다. 여담이지만, react 의 인기가 높은 만큼 변화도 빨라서 지속적인 관심이 없으면 따라가기 벅찰지도 모르겠습니다. 앞으로도 꾸준한 관심이 필요할 것 같습니다.

## 참고자료

- https://reactjs.org/blog/2018/03/29/react-v-16-3.html
- https://www.youtube.com/watch?v=WhWqy-vxKS8&t=204s
- https://velopert.com/3606
- https://www.youtube.com/watch?v=v6iR3Zk4oDY
