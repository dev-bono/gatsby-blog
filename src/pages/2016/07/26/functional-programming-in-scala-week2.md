---
title: 'Functional Programming in Scala week 2'
date: 2016-07-26 23:25:50
category: programming
tags:
  - scala
  - coursera
---

## 2.1 Higher-Order Functions

함수형 언어에서는 function 이 first-class value 이다. 이 말은 특정 함수가 다른 함수의 파라미터나 결과로써 return 될 수 있다는 것이다(higher order functions).

```
def sum(f: Int => Int, a: Int, b: Int): Int =
  if (a > b) 0
  else f(a) + sum(f, a+1, b)

def sumInts(a: Int, b: Int)       = sum(id, a, b)
def sumCubes(a: Int, b: Int)      = sum(cube, a, b)
def sumFactorials(a: Int, b: Int) = sum(fact, a, b)

def id(x: Int): Int = x
def cube(x: Int): Int = x * x * x
def fact(x: Int): Int = if (x == 0) 1 else x * fact(x -1)
```

sum() 함수의 첫번째 파라미터로 f 라는 임의의 함수가 들어가 있다.
이는 Int 파라미터를 받아서 Int 타입을 리턴하는 함수라면 이 파라미터 위치에 적합하다라는 뜻이다. 즉, 어떠한 함수가 됐든간에 저 유형만 유지하면 된다. 재사용 가능하다는 말이다. 실제로 sumInts(), sumCubes(), sumFactorials() 함수는 모두 sum()함수를 호출한다. sum()함수의 첫번째 파라미터는 각각 id(), cube(), fact()함수를 호출하게 되는데 세 함수 모두 파라미터와 리턴 타입이 Int 이므로 sum()함수의 파라미터로 적합하다.

### 익명함수

```
(x: Int, y:Int) => x + y
```

익명함수는 보통 함수를 선언하는 방식과는 달리 이름이 없다.
대신 파라미터 타입과 body 만 존재한다.

```
def sumCubes(a: Int, b: Int) = sum(x => x * x * x, a, b)
```

위에서 보았던 sumCubes 의 익명함수 버전이다.
cube() 함수가 재사용되지 않는다고 가정한다면 매우 심플하기 때문에 따로 함수를 선언하기 보다는 sum() 파라미터에 익명함수로 직접 선언할수 있다.

```
// linear recursion, a와 b의 차이가 커지면 stackOverFlow 익셉션이 발생할 수 있다.
def sum(f: Int => Int, a: Int, b: Int): Int =
  if (a > b) 0
  else f(a) + sum(f, a+1, b)

// tail-recursive version
def sum(f: Int => Int, a: Int, b: Int): Int = {
  def loop(a: Int, acc: Int): Int = {
    if(a > b) acc
    else loop(a+1, f(a)+acc)
  }
  loop(a, 0)
}
```

## 2.2 Currying

```
def sumInts(a: Int, b: Int)       = sum(x => x, a, b)
def sumCubes(a: Int, b: Int)      = sum(x => x*x*x, a, b)
def sumFactorials(a: Int, b: Int) = sum(fact, a, b)
```

위의 함수들에서 a, b 파라미터는 sumInts(), sum()에서 반복된다. 이를 제거하여 함수를 더 간소하게 만드는 방법은 무엇일까?
우선 아래의 함수를 살펴보자.

```
def sum(f: Int => Int): (Int, Int) => Int = {
  def sumF(a: Int, b: Int): Int = {
    if (a > b) 0
    else f(a) + sumF(a+1, b)
  }
  sumF
}
```

기존에 봤던 sum() 함수와 조금 다르게 생겼다. 우선 sum() 함수의 파라미터가 f() 하나로 줄었고, sum() 함수는 (Int, Int) => Int 와 같은 타입의 익명함수를 리턴하고 있다.
sumF 를 호출하는 부분이 조금 이해하기 어려운데, 위의 내부함수 sumF()를 자세히 보면 익명함수를 설명했을 때의 형태와 같다는 것을 알 수 있다.

```
(x: Int, y: Int): Int => x * y
// 이 익명함수는 아래와 같이 표현가능하다.
def f(x: Int): Int = x * y; f
```

위에서 썼던 sumInts(), sumCubes(), sumFactorials() 함수들을 가져오자. 조금 다르다. sum() 함수의 파라미터가 f 하나로 줄면서 아래의 각 함수들도 sum() 호출부의 인자가 익명함수 하나만 남았다.

```
def sumInts(a: Int, b: Int) = sum(x => x)
def sumCubes(a: Int, b: Int) = sum(x => x*x*x)
def sumFactorials(a: Int, b: Int) = sum(fact)
```

이제 sum() 함수는 함수를 리턴하고 있으므로, sumCubes(1, 10)를 호출하면

```
sumCubes(1, 10)
// res0: (Int, Int) => Int = <function2>
```

이는 또한 이렇게 바꿔 쓸수 있다.

```
sum (cube) (1, 10) // multiple parameters
(sum (cube)) (1, 10)
```

위의 multiple parameters 를 적용하면 sum() 함수를 더 짧게 작성할 수 있다.

```
def sum(f: Int => Int)(a: Int, b: Int): Int =
  if (a > b) 0 else f(a) + sum(f)(a+1, b)
```

여러개의 파라미터 list 를 가진 함수 f 에서 파라미터 list 의 개수가 1 보다 큰 경우 마지막 파라미터 list 를 f 함수에서 제거하면 이 마지막 파라미터 list 를 파라미터로 가지는 또다른 함수 g 를 만들 수 있다. 물론 이 g 함수는 f 함수의 리턴함수가 된다. 식으로 나타내면 다음과 같다. 참고로 각각의 식은 모두 동일하다

```
def f(arg1)(arg2)(arg3)(arg4) = E
def f(arg1)(arg2)(arg3) = {def g(arg4) = E;g} // arg4를 이용해 g함수 생성
def f(arg1)(arg2)(arg3) = (arg4 => E) // g를 익명함수로 변경
def f = (arg1 => (arg2 => (arg3 => (arg4 => E)))) // 파라미터를 하나씩 우측으로 전달함
```

이와같은 형태의 함수정의를 curring 이라 부른다.

### Excercise

_Write a product function that calculates the product of the values of a function for the points on a given interval_

```
def product(f: Int => Int)(a: Int, b: Int): Int = {
  if (a > b) 1 else f(a) * product (f)(a+1, b)
}
product(x => x*x)(3,4)
```

_Write factorial in terms of product._

```
def fact(n: Int): Int = product(x => x)(1, n)
fact(4)
```

_Can you write a more general funciton, which generalizes both sum and product?_

```
def mapReduce(f: Int => Int, combine: (Int, Int) => Int, zero: Int)(a: Int, b: Int): Int = {
  if (a > b) zero
  else combine(f(a), mapReduce(f, combine, zero)(a+1, b))
}

def productForMapReduce(f: Int => Int)(a: Int, b: Int): Int = mapReduce(f, (x, y) => x*y, 1)(a, b)
productForMapReduce(x => x*x)(3, 4)
```

## 2.3 Example: Finding Fixed Point

부동점 구하기, Fixed Point 라 함은 어떤 함수에서 고정적인 값을 갖는 point 를 말한다. 다음의 함수에서 2 는 부동점(고정점)이다.
기하학적으로(?) 함수 f 의 부동점은 y = x 와 주어진 함수와의 교점이다. 즉, x 와 f(x) 값이 동일한 값을 뜻한다.

```
f(x) = x^2 -3x + 4
// 2 = 4 - 6 + 4
// 2 = 2, 부동점
```

어떤 함수에 대해서 부동점을 구하는 함수 fixedPoint 는 아래와 같다.

```
object ex {
  val tolerance = 0.0001
  def isCloseEnough(x: Double, y: Double) =
    abs((x - y) / x) / x < tolerance

  def fixedPoint(f: Double => Double)(firstGuess: Double) = {
    def iterate(guess: Double): Double = {
      println("guess = " + guess)
      val next = f(guess)
      if (isCloseEnough(guess, next)) next
      else iterate(next)
    }
    iterate(firstGuess)
  }
  fixedPoint(x => 1 + x/2)(1)

  def sqrt(x: Double) = fixedPoint(y => x / y)(1)
  sqrt(2)
}
```

fixedPoint 를 응용해보면, 첫번째 인자인 f 함수에 어떤 수식을 넣어 반복적으로 적용하면서 고정값을 찾아 가는 과정에 맞게 넣을 수 있겠다.
마지막에 있는 것은 sqrt 를 구하는 함수는 바로 위에서 말한 반복을 통한 고정값 추론에 적합하다.
sqrt y 를 구하려면 y \* y = x 가 되기 때문에 함수 y = x / y 를 fixedPoint 함수에 반복적으로 적용하다보면 고정값 sqrt 의 근사치를 구할 수 있다.
하지만, 실제로 위와같이 y => x / y 를 fixedPoint 의 함수 인자로 넣게 되면, 원하는 값을 얻지 못한다.
왜냐하면, guess 값이 너무 심하게 변하기 때문에 발생하는 문제다. fixedPoint 의 내부함수 iterate 는 guess 와 next 가 교차하는 구조인데, 처음 sqrt(2)에서 2 는 x 이다.
그리고 y 는 firstGuess 인 1 이되는데, 이 두 값이 f(x) = x / y 에 대입되면, f(x)는 2 가 된다. 다시 y 가 2 가 되고 x 가 2 이므로 iterate 함수를 한번 돌면 y 는 1 이된다.
즉, 1,2,1,2 반복하기 때문에 무한루프에 빠지게 된다.
이를 해결하기 위해서는 연속하는 두개의 값 즉 1 과 2 의 평균값(1.5)를 구함으로써 해결할 수 있다.

```
y => x / y
// 아래와 같이 바꿔 쓴다.
y => (y + x/y) / 2

// 코드에 적용해보면
def sqrt(x: Double) = fixedPoint(y => (y + x / y) / 2)
```

위와 같이 평균을 내어서 안정화 시키는 기법을 AverageDamp 라고 한다.

## 2.4 Scala Syntax Summary

강의 참고

## 2.5 Functions and Data

유리수의 여러가지 연산을 바탕으로 함수를 만드는 방법과 데이터를 캡슐화하기 위해 클래스를 사용하는 방법을 알아 본다.

```
// class
class Rational(x: Int, y: Int) {
  def numer = x
  def denom = y

  def add(that: Rational) =
    new Rational(
      numer * that.denom + that.numer * denom,
      denom * that.denom)
}

// object
val x = new Rational(1, 2)
x.numer  // 1
y.denom  // 2
```

위에서 Rational 클래스를 정의하였다. 클래스를 정의하면 두가지 요소가 정의되는데, 첫번째는 Rational 이라는 type 이 만들어진다는 것이고, 두번째는 x 와 y 를 인자로 가지는 Rational 이라는 생성자가 만들어진다는 것이다.
object 를 만드는 법은 Java 의 object 만드는 법과 동일하게 new 키워드를 사용해서 만들 수 있다.

### Method

스칼라에서 함수(funciton)과 메소드(method)는 다른 의미로 사용되는데, 일반적으로 함수는 독립적인 객체로서 클래스처럼 인스턴스화 가능한 형태로 동작하는 반면, 메소드는 클래스내에 속하는 멤버로써 클래스 내의 데이터를 연산하는 역할을 한다. 실제 컴파일 해보면 차이를 알 수 있는데, 함수같은 경우에는 클래스로 변경되어 있지만(내부 함수인 경우에는 내부 클래스로 컴파일), 메소드는 컴파일 내에 멤버로만 존재하기 때문에 별도의 class 로 컴파일 되지 않는다.

### Exerxise

1. In your worksheet, add a method neg to class Rational that is used like this: x.neg

2. Add a method sub to subtract two rational numbers.

3. With the values of x, y, z as given in the previous slide, what is the result of x - y - z

```
class Rational(x: Int, y: Int) {
  def numer = x
  def denom = y

  def add(that: Rational) =
    new Rational(
      numer * that.denom + denom * that.numer,
      denom * that.denom)

  def neg: Rational = new Rational(numer * -1, denom)
  def sub(that: Rational): Rational = add(that.neg)
  override def toString = numer + "/" + denom
}

val x = new Rational(1, 3)
val y = new Rational(5, 7)
val z = new Rational(3, 2)

x.sub(y).sub(z) // res0: Rational = -79/42
```

## 2.6 More Fun With Rationals

2.5 에서 구현한 Rational 클래스는 분모와 분자를 나누어진 형태로 출력하지 않는 문제가 있다. 그래서 이전에 사용했었던 최대 공약수를 구하는 함수인 gcd 를 메서드 형태로 Rational 클래스에 추가해준다.
그리고 클래스의 인수인 x 와 y 에 두 변수의 gcd 값을 나누어준다.

```
class Rational(x: Int, y: Int) {
  private def gcd(a: Int, b: Int): Int = if (b == 0) a else gcd(b, a % b)

  // ex 1) g를 재사용하는 방법
  private val g = gcd(x, y)
  def numer = x / g
  def denom = y / g

  // ex 2) numer와 denom이 자주 호출되지 않을때는 gcd를 직접 넣어줌
  def numer = x / gcd(x, y)
  def denom = y / gcd(x, y)

  // ex3) 이 두 변수는 한번만 연산하도록 하기 위해 메서드를 value로 변경, numer와 denom이 자주 call 되는 경우에 적합
  val numer = x / gcd(x, y)
  val denom = y / gcd(x, y)

  ...
}
```

### this

this 키워드는 java 와 동일하게 사용된다. this 는 현재 메소드가 실행되고있는 object 를 말한다. second 생성자를 만들때에도

```
def this(x: Int) = this(x, 1)
```

과 같이 사용한다.

### require 키워드

require 키워드를 사용하면 클래스의 인자값 등에 대한 제약을 만들 수 있다. 아래의 클래스가 있는 상태에서 만약에 new Rational(1, 0)과 같은 instance 를 생성하게 되면 예외가 발생하게 된다. require 와 같이 객체가 생성될때 강제로 호출하는 역할을 하는 함수를 predefined funciton 이라고 한다.

```
class Rational(x: Int, y: Int) {
  require(y != 0, " denominator must be positive")
  ...
}
```

## 2.7 Evaluation and Operators

클래스와 메소드의 evalutaion 과정

```
class C(x1, ..., xm) {... def f(y1, ..., yn) = b ...}
new C(v1, ..., vm).f(w1, ..., wn)

// substitution
[w1/y1, ... wn/yn][v1/x1, ..., vm/xm][new C(v1, ..., vm)/this]b
```

과정을 간단히 요약하면

1. f 메서드의 formal parameters(y1, ..., yn)이 arguments(w1, ..., wn)으로 치환
2. 클래스의 formal parameters(x1, ..., xm)이 arguments(v1, ..., vm)으로 치환
3. self reference this 가 new C(v1, ..., vm)으로 치환

만약 f 함수 내부에서 this 가 사용된다고 가정한다면, 이 this 는 이미 new C(v1, ..., vm)으로 치환된 value 이므로, 해당 object 자체를 참조하는 값이 된다.

### Operators

일반적인 언어에서는 r.add(s)와 같은 함수가 호출될때 자연수인 경우에는 r + s 와 같이 바꿔 쓸 수 있지만, 유리수의 경우에는 불가하다.
하지만 스칼라에서는 오퍼레이터 기호를 함수 이름으로 사용가능하다.

- step 1 : r.add(s) ==> r add s
- step 2 : def + (that: Rational) = { ... }

하지만 위와 같이 함수 이름을 오퍼레이터로 사용하게 되면, 우선순위 문제가 발생할 수 있다.
그래서 스칼라에서는 precedence rules 을 별도로 만들어 두었다.
우선순위는 아래가 제일 높고 위로 갈수록 낮아진다.

```
(all letters)
|
^
&
< >
= !
:
+ -
* / %
(all other special characters)
```
