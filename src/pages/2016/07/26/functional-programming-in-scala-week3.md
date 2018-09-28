---
title: 'Functional Programming in Scala week 3'
date: 2016-07-26 23:26:50
category: programming
tags:
  - scala
  - coursera
---

## 3.1 Class Hierachies

### abstract class (추상 클래스)

추상 클래스는 abstract 키워드를 class 앞에 붙임으로써 정의할 수 있다. 추상 클래스는 구현체가 없는 추상함수를 1 개 이상 멤버로 가진다. 스칼라의 추상클래스는 자바의 그것과는 달리 new 로 선언할 수가 없다(자바의 추상클래스는 new 할당 가능, 대신 인터페이스는 new 할당이 불가함).

```
abstract class IntSet {
  def incl(x: Int): IntSet
  def contains(x: Int): Boolean
}

class Empty extends IntSet {
  def incl(x: Int): IntSet = new NonEmpty(x, new Empty, new Empty)
  def contains(x: Int): Boolean = false
  override def toString = "."
}

class NonEmpty(elem: Int, left: IntSet, right: IntSet) extends IntSet {
  def incl(x: Int): IntSet =
    if (x < elem) new NonEmpty(elem, left incl x, right)
    else if (x > elem) new NonEmpty(elem, left, right incl x)
    else this

  def contains(x: Int): Boolean =
    if (x < elem) left contains x
    else if (x > elem) right contains x
    else true

  override def toString = "{" + left + elem + right + "}"
}

val t1 = new NonEmpty(3, new Empty, new Empty)
// t1: NonEmpty = {.3.}
val t2 = t1 incl 4
//t1: NonEmpty = {.3.}
```

위에서 IntSet 은 Empty 와 NonEmpty 클래스의 base class 이다. 구현체가 없는 incl 메소드와 contains 메소드는 각각 Empty 와 NonEmpty 클래스에서 구현하게 된다.

```
abstract class Base {
  def foo = 1
  def bar: Int
}

class Sub extends Base {
  override def foo = 2
  def bar = 3
}
```

Base 클래스의 foo 메서드는 구현체가 있고 bar 메서드는 구현체가 없다. 구현체가 없는 bar 메서드 같은 경우에는 Sub 클래스에서 바로 구현해주면 되지만, 구현체가 없는 foo 메서드는 반드시 메서드 앞에 override 키워드를 붙여서 재정의 해야한다.(참고로 bar 메서드 앞에 override 키워드를 붙이는 것은 optional)
자바같은 경우 메소드 오버라이드 할때는 별도의 modifier 를 지정해주지 않는다. scala 에서 이렇게 하는 이유는 override 키워드가 없는 경우에는 실제로 어떤 메서드가 오버라이드되는지 모르기 때문에 잘못된 오버라이드로 인해 Base 클래스의 메서드가 영향을 받을 수도 있기 때문이다.

### object

여러개의 instance 를 만들 필요 없는 클래스 같은 경우에는 간단히 object 를 이용한다. object 정의는 class 정의와 동일하지만 new 키워드로 여러개의 instance 를 만들 수 없고 단지 하나의 object 로 작동한다(singleton object).
오직 Empty 클래스에만 object 를 쓸 수 있는데, 그 이유는 NonEmpty 클래스는 몇개의 파라미터를 가지고 있다. object 는 value 라 했으므로, object 가 정의됨과 동시에 모두 평가되어야하므로 파라미터로 인한 값의 변화를 취할수 없다.
evaluation 측면에서 보자면, 위에서도 얘기 했듯이 object 자체는 이미 value 기 때문에 아래와 같이 Empty 로 바뀐 부분이 별도의 evalutaion 과정이 불필요하다.

### exercise - union 함수 구현

```
abstract class IntSet {
  def incl(x: Int): IntSet
  def contains(x: Int): Boolean
  def union(other: IntSet): IntSet
}

object Empty extends IntSet {
  ...
  def union(other: IntSet) = other
}

class NonEmpty(elem: Int, left: IntSet, right: IntSet) extends IntSet {
  ...
  def union(other: IntSet) =
    ((left union right) union other) incl elem
}
```

으아... 어렵다
대략 짐작해보자면, (left union right) 부분이 실행되면 left 가 현재 node 가 되고 right 가 other 가 된다. 계속해서 깊게 내려가다 보면, 언젠가 leaf node 가 나오게 되는데 leaf node 의 left 와 right 는 모두 Empty 이므로 결국 incl elem 에 의해 자기자신이 리턴된다. 그리고 한칸씩 올라오면서 left 의 elem 을 떼다가 right 트리에 include 를 시도하는 과정을 거친다. 그 과정이 계속되면, 결국은 하나의 binary tree 가 만들어진다.

### 동적 바인딩

메소드를 포함하는 object 타입은 런타임에 메소드가 실행된다.

## 3.2 How Classes Are Organized

### Package

자바의 패키지 지정 방식과 같다.

```
package progfun.examples

object Hello { ... }
```

위와 같은 패키지와 object 가 있다면, progfun.examples.Hello 와 같은 full qualified name 으로 Hello 오브젝트에 접근 가능하다

### import

```
import week3.Rational           // imports just Rational
import week3.{Rational, Hello}  // imports both Rational and Hello
import week3._                  // import everything in package week3
```

import 하는 방법은 자바와 거의 비슷한데 몇가지 다른점이 있다면, 첫째로는 한줄에 여러개의 class or object 를 호출하기 위해서 중괄호를 사용하는 방법이 있다. 그리고 특정 패키지의 모든 class 와 object 를 가져오기 위해 '\_'를 이용할 수 있다.

스칼라 프로그램에서 자동으로 import 되는 패키지 또는 obejct
All members of package scala
All members of package java.lang
All members of the singleton object scala.Predef

```
require       scala.Predef.require
assert        scala.Predef.assert
```

### Traits

스칼라도 자바처럼 상속을 하나의 클래스에서만 받을 수 있다. 그렇기 때문에 자바와 동일하게 여러개의 슈퍼타입이 필요한 경우 traits 키워드를 이용하여 구현할 수 있다. 참고로 trait 키워드는 abstract class 와 동일하다.

```
trait Planar {
  def height: Int
  def width: Int
  def surface = height  width
}

class Square extends Shape with Planar with Movable ...
```

클래스와 오브젝트 traits 셋다 traits 를 상속받을 수 있다. 그리고 interface 처럼 하나의 클래스가 여러개의 traits 상속이 가능하다. traits 가 자바의 interface 와 비슷해보이지만 field 를 가질 수 있는 점과, 실제 구현 메서드를 가질 수 있는 점에서 더 강력하다 할 수 있다. 자바에도 추상클래스(abstract class)가 있지만, 추상클래스는 말그대로 클래스이기 때문에 인터페이스처럼 여러개를 구현하지는 못한다. 그렇기 때문에 스칼라의 trait 가 좀 더 유연하게 사용될 수 있다. 대신 traits 는 파라미터를 가질 수 없다는 단점이 있다.

### 스칼라 타입 클래스 구조 (Scala's Class Hierarchy)

![스칼라 타입 클래스 구조](http://docs.scala-lang.org/resources/images/classhierarchy.img_assist_custom.png)

출처 : <http://docs.scala-lang.org/tutorials/tour/unified-types.html>

#### Any

- 모든 타입의 가장 상위 타입, '==', '!=',
- 'equals', 'hashCode', 'toString'

#### AnyRef

- Any 클래스를 상속받는다.
- 모든 레퍼런스 타입(ex. List, String)의 기본 타입이다.
- java.lang.Object 의 별칭이다.

#### AnyVal

- Any 클래스를 상속받는다.
- 모든 primitive types(Int, Float, Char 등)의 베이스 타입이다

#### Scala.Nothing

- 모든 다른 AnyVal 타입의 subType 이다.
- 값을 가지지 않는다.
- 함수가 비정상적으로 종료되거나 예외가 발생할 경우 Nothing 을 리턴할 수 있다.
- 비어있는 collection 을 요소 타입으로서 존재 (ex. Set[Nothing])

### Null

The type of null is Null, null 의 타입은 Null 이라는 말
모든 다른 AnyRef 타입의 subType 이다.

```
val x = null          // x: Null
val y: String = null  // y: String
val z: Int = null     // error: type mismatch, 레퍼런스 타입만 적용
```

## 3.3 Polymorphism

아래 두 Cons 클래스는 동일한 표현이다.
클래스 파라미터에 value 를 사용하는 것은, implementaion 해야할 함수를 파라미터에 직접 구현하는 것과 같다.

```
class Cons(val head: Int, val tail: IntList) extends IntList { ... }

// 즉, _head, _tail 은 쓰지 않는 이름
class Cons(_head: Int, _tail: IntList) extends IntList {
  val head = _head
  val tail = _tail
}
```

Cons 클래스와 List trait 를 generic 하게 구현한다

```
trait List[T] {
  def isEmpty: Boolean
  def head: T
  def tail: List[T]
}

class Cons[T](val head: T, val tail: List[T]) extends List[T] {
  def isEmpty = false
}

class Nil[T] extends List[T] {
  def isEmpty: Boolean = true
  def head: Nothing = throw new NoSuchElementException("Nil.head")
  def tail: Nothing = throw new NoSuchElementException("Nil.tail")
}
```

함수도 제네릭하게 구현할 수 있다.

```
def singleton[T](elem: T) = new Cons(elem, new Nil[T])

singleton[Int](1)
singleton[Boolean](true)

// 아래와 같이 호출가능
singleton(1)
singleton(true)
```

마지막 두 줄과 같이 호출 가능한 이유는 스칼라 컴파일러가 함수 call 이 발생하면 해당 함수의 파라미터 타입을 추론할 수 있기 때문이다.

### Polymorphism

> Polymorphism means that a function type comes "in many forms".
> 프로그램 측면에서 보면, 함수의 파라미터가 여러 타입으로 적용할 수 있고, 타입은 다양한 타입의 인스턴스를 가질 수 있다는 말이다.

### 다형성의 두가지 주요개념

- subtyping : instance of a subclass can be passed to a base class
- generics : instances of a function or class are created by type parameterization
