---
title: '프론트엔드(frontend) 마스터를 위한 디자인 패턴 적용 가이드와 예제'
date: 2023-08-26 14:45:00
category: javascript
tags: 
  - javascript
  - front-end
  - design-pattern
---
## 디자인 패턴의 프론트엔드 적용 사례

디자인 패턴은 반복적으로 나타나는 프로그래밍 문제를 해결하기 위한 `재사용 가능한 해결책`입니다. 이번 글에서는 대표적인 디자인 패턴을 프론트엔드에 어떻게 적용할 수 있는지, 간단한 예제 코드와 함께 살펴봅니다.

## 모듈 패턴 (Module Pattern)

`모듈 패턴`을 사용하면 변수나 함수의 범위를 제한하여 외부와 격리시킬 수 있습니다.

```javascript
const myModule = (() => {
    const privateVariable = 'Hello, World';

    const privateFunction = () => {
        console.log(privateVariable);
    };

    return {
        publicFunction: privateFunction
    };
})();

myModule.publicFunction();  // 출력: Hello, World
```

## 옵저버 패턴 (Observer Pattern)

`상태 변경을 알림` 받을 수 있는 옵저버를 등록하는 패턴입니다.

```javascript
class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    update(data) {
        console.log(`Updated with data: ${data}`);
    }
}

const subject = new Subject();
const observer = new Observer();
subject.addObserver(observer);
subject.notify('Hello!');  // 출력: Updated with data: Hello!
```

### 싱글턴 패턴 (Singleton Pattern)

클래스의 `인스턴스가 하나만 존재하도록 보장`하는 패턴입니다.

```javascript
class Singleton {
    static instance;

    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }
}

const obj1 = new Singleton();
const obj2 = new Singleton();
console.log(obj1 === obj2);  // 출력: true
```

### 팩토리 패턴 (Factory Pattern)

`객체 생성을 담당`하는 팩토리 클래스를 통해 객체를 생성하는 패턴입니다.

```javascript
class Car {
    constructor(model) {
        this.model = model;
    }
}

class CarFactory {
    createCar(model) {
        return new Car(model);
    }
}

const factory = new CarFactory();
const myCar = factory.createCar('Tesla');
console.log(myCar.model);  // 출력: Tesla
```

### 전략 패턴 (Strategy Pattern)

알고리즘을 정의하고 각각을 `캡슐화`하여 교환해서 사용할 수 있도록 만드는 패턴입니다.

```javascript
class Strategy1 {
    execute() {
        return 'Executing strategy 1';
    }
}

class Strategy2 {
    execute() {
        return 'Executing strategy 2';
    }
}

class Context {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    executeStrategy() {
        return this.strategy.execute();
    }
}

const context = new Context(new Strategy1());
console.log(context.executeStrategy());  // 출력: Executing strategy 1

context.setStrategy(new Strategy2());
console.log(context.executeStrategy());  // 출력: Executing strategy 2
```

### 데코레이터 패턴 (Decorator Pattern)

기존 객체에 새로운 기능이나 책임을 동적으로 추가하는 패턴입니다.

```javascript
class Coffee {
    cost() {
        return 5;
    }
}

const withMilk = coffee => {
    const cost = coffee.cost();
    coffee.cost = () => cost + 2;
};

const coffee = new Coffee();
withMilk(coffee);
console.log(coffee.cost());  // 출력: 7
```

### 마치며

프론트엔드 개발에서 디자인 패턴은 코드의 유지보수성, 확장성, 재사용성을 향상시키는 데 큰 역할을 합니다. 각 패턴의 특징을 잘 이해하고 적절한 상황에 적용하면 더욱 효율적인 코드를 작성할 수 있습니다.

감사합니다!