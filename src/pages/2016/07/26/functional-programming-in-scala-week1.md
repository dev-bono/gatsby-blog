---
title: 'Functional Programming in Scala week 1'
category: programming
date: 2016-07-26 00:43:50
tags:
  - scala
  - coursera
---

## 1.1 Programming Paradigms

세 가지 프로그래밍 언어 패러다임

- Inperative Programming Language (절차지향 프로그래밍 언어)
- Functional Programming Language (함수형 프로그래밍 언어)
- Logical Programming Language (논리형 프로그래밍 언어)

튜터는 OOP 는 세가지 언어에 직교하는 성질을 가지고 있기 때문에 새로운 패러다임이라 할 수 없다고 생각함
절차적 프로그램은 폰 노이만 구조랑 비슷함
절차적 프로그램은 규모가 커졌을 경우 word by word 로 처리되는 문제 때문에 폰 노이만처럼 병목현상이 발생할 수 있다.
그래서 collections, 다항식, strings 등과 같이 고수준의 추상화를 정의하는 진화된 다른 방법(theory)이 필요

### What is Theory?

- one or more data types
- operations on thes types
- laws that describe the relationships between values and operations
  즉, 여러개의 데이터 타입과 연산과 그 관계에 대한 규칙의 정의라 할 수 있다.

절차적 언어는 함수나 특정 코드에 의해 상태값이 바뀔 수 있기 때문에 theory 가 손상될수 있다. 이러한 문제를 해결하기 위해 함수형 언어가 등장하였다. 함수형 언어는 아래와 같은 특징을 가진다.

- concentrate on defining theories for operators expressed as functions
- avoid mutations
- have powerful ways to abstract and compose functions

## 1.2 Elements of Programming

- call by value : 인자가 먼저 평가되는 방식
- call by name : 인자가 나중에 평가 되는 방식

```scala
sumOfSquares(3, 2+2)

sumOfSquares(3, 4) // call by value
sumOfSquares(3, 2+2) // call by name
```

위와 같은 함수가 있을때, 2+2 가 먼저 계산되어 인자가 4 로 evaluation 된 후 reduce 되면 call by value, 2+2 가 이름(name) 그대로 reduce 되면 call by name 이라 할 수 있다. call by value 의 장점은 모든 함수의 인자가 한번만 해석된다는 것이다. 반면에 call by name has the advantage that a function argument is not evaluated if the corresponding parameter is unused in the evaluation of the function body.

다음의 예를 보면 이해가 간다.

```scala
call by name
test(3+4,2*4)
// (3+4) * (3+4)
// 7 * (3+4)
// 7 * 7
// 49

call by value
test(3+4,2*4)
// test(7,2*4)
// test(7,8)
// 7 * 7
// 49
```

## 1.3 Evaluation Strategies and Termination

```scala
def first(x: Int, y: Int) = x
first(1, loop)
```

first 함수를 호출하게 되면 CBN 같은 경우는 인자를 해석하지 않고 바로 1 을 출력하겠지만, CBV 인 경우에는 loop 인자를 해석하기 위해서 무한루프에 빠지게 된다.

- 스칼라는 기본적으로 CBV 를 사용
- 함수 파라미터가 =>로 시작하면 CBN 사용

## 1.4 Conditionals and Value Definitions

```scala
def loop: Boolean = loop
def x = loop
val x = loop // infinite loop
```

def 는 우측의 loop 가 해석되지 않는다. 반면에 val(value)는 우측의 코드를 해석하기 때문에 위와 같은 코드의 경우 무한루프에 빠지게 된다.

```scala
and(x,y) == x && y
def and(x: Boolean, y: Boolean)
  if (x) y else false
// and(x, loop)와 같은 문제가 발생할 수 있으므로, 아래와 같이 변경
def and(x: Boolean, y: => Boolean)
  if (x) y else false
```

> 그런데 왜 y 만 CBN 으로 변경해 줬을까? and(loop, b)하면 어떻게될까?

## 1.5 Example: square roots with Newton's method

뉴튼 메소드를 이용해서 제곱근을 구하는 예제를 작성해본다.

> 한가지 주의할점은 스칼라에서 recursive(재귀) 함수인 경우에는 반드시 return 타입을 정해주어야 한다.

```scala
def abs(x: Double) = if (x < 0) -x else x

def sqrtIter(guess: Double, x: Double): Double =
  if (isGoodEnough(guess, x)) guess
  else sqrtIter(improve(guess, x), x)

def isGoodEnough(guess: Double, x: Double) =
  abs(guess * guess - x) / x < 0.001

def improve(guess: Double, x: Double) =
  (guess + x / guess) / 2

def sqrt(x: Double) = sqrtIter(1.0, x)

sqrt(2) // res1: Double = 1.4142156862745097
```

## 1.6 Bolcks and Lexical Scope

block 을 잘 이용하면 불필요한 인자값을 호출하는 메서드에 넘길 필요가 없다.

```scala
def abs(x: Double) = if (x < 0) -x else x

def sqrt(x: Double) = {
  def sqrtIter(guess: Double): Double =
    if (isGoodEnough(guess)) guess
    else sqrtIter(improve(guess))

  def isGoodEnough(guess: Double) =
    abs(guess * guess - x) / x < 0.001

  def improve(guess: Double) =
    (guess + x / guess) / 2

  sqrtIter(1.0)
}

sqrt(2) // 동일한 결과값
```

위의 예제를 보면, sqrt(x)에서 호출된 이후 내부적으로 sqrIter, isGoodEnough, improve 를 호출하는데 모두 x 파라미터를 인자값으로 전달해준다. x 파라미터는 각 함수에서 불변하는 값이므로 위 세함수를 sqrt 함수의 내부함수로 재작성 한뒤 블록으로 감싸주면 x 파라미터는 블록 범위내에서 동일하게 적용되는 값이 되므로 각 함수에서 파라미터를 제거할 수 있다.

### 세미콜론 문제

스칼라에서 세미콜론은 optional
그래서 아래와 같은 코드가 작성되면 한 줄로 인식되어야 할 코드를 스칼라 인터프리터가 두줄로 인식해버리는 문제가 있다.

```scala
someLongExpression
+ someOtherExpression
```

해결 방법은 두가지가 있는데, 첫째는 괄호로 묶어주는 방법이고 두번째는 '+' 기호를 윗줄의 끝에 기입해주는 방법이다(아직 문장이 안끝났다는 표시).

```scala
// solution 1
(someLongExpression
+ someOtherExpression)

// solution 2
someLongExpression +
someOtherExpression
```

## 1.7 Tail Recursion

```scala
def gcd(x: Int, y: Int): Int =
  if (y == 0) x else gcd(y, x % y)

def factorial(n: Int): Long =
  if (n == 0) 1 else n * factorial(n-1)

// 강의와 조금 다름
def fac_tail_recursive(n: Int): Int = {
  def loop(r: Int, i: Int): Int =
    if (n == i) r*i
    else
      loop(r*i, i+1)
  loop(1, 1)
}
```

gcd 함수의 계산과정을 살펴보면, gcd 함수 자체가 다시 불리는 형태로 진행한다. 반면에 fatorial 함수는 4 _ 3 _ factorial(2)와 같이 계속해서 길어지므로, 저장해야 할 지역변수가 늘어나 stack frame 을 재사용할 수 없다. 그래서 factorial 을 fac_tail_recursive 함수처럼 함수 자신이 마지막으로 호출되는 형태로 변경해줄 필요가있다. 이를 Tail Recursion 이라 부른다.
