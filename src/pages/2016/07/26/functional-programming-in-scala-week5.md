---
title: 'Functional Programming in Scala week 5'
category: programming
date: 2016-07-26 23:28:50
tags:
  - scala
  - coursera
---

## 5.1 More Functions on Lists

이번 챕터에서는 스칼라 List 의 다른 메서드 들을 알아본다.
xs 는 list 의 object 를 뜻한다.

### Sublists and element access

- xs.length xs 의 길이
- xs.last xs 의 마지막 item return, xs 가 비어있으면 exception 발생
- xs.init 마지막 item 을 제외한 list reutnr, xs 가 비어있으면 exception 발생
- xs take n 처음부터 n 개의 element 의 list 리턴, n 이 xs 의 length 보다 크면 n 개만 리턴
- xs drop n n 개를 제외한 나머지 리스트 리턴
- xs(n) n 번째 item 리턴

### Creating new lists

- xs ++ ys 두 list 더하기, :::와 같은 기능을 함
- xs.reverse 역순의 리스트 생성
- xs updated (n, x) n 번째 item 만 x 로 바뀐 list 생성

### Finding elements

- xs indexOf x x 와 같은 첫번째 element 의 index 값 리턴, 없으면 -1
- xs contains x indexOf x >= 0 과 같음

last 가 과연 필요한지 모르겠지만(tail 을 recursive 하게 반복하면 찾을 수 있음), 유용하게 쓰일 수 있다면 last 의 복잡도는 어떻게 될까?

```scala
def last[T](xs: List[T]): T = xs match {
  case List() => throw new Error("last of empty list")
  case List(x) => x
  case y :: ys => lsat(ys)
}
```

위와 같이 list 의 길이와 같으므로, 복잡도는 O(n)이 되겠다.
init 메서드는 어떨까?

```scala
def init[T](xs: List[T]): List[T] = xs match {
  case List() => throw new Error("init of empty list")
  case List(x) => List()
  case y :: ys => y :: init(ys)
}
```

마찬가지로 O(n)
그다음은 concat(Same as :::)

```scala
def concat[T](xs: List[T], ys: List[T]) = xs match {
  case List() => ys
  case z :: zs => z :: concat(zs, ys)
}
```

복잡도는 |xs|, 즉 xs 의 길이가 된다.
다음은 reverse

```scala
def reverse[T](xs: List[T]): List[T] = xs match {
  case List() => xs
  case y :: ys => reverse(ys) ++ List(y)
}
```

reverse(ys) :: y 가 아니라 reverse(ys) ++ List(y)인 이유는 ::의 마지막엔 Nil 이 와야하니깐 y 가 Nil 이 아니기 때문이 아닐까 생각한다.
복잡도는 각 요소마다 concatenating 을 해주고 list 의 length 만큼 reverse 를 해야하므로 O(n2)이 되겠다. reverse 는 다소 실망스러운 성능을 보여주는데, 앞으로 더 개선해보도록 하겠다.

마지막으로 removeAt

```scala
def removeAt[T](n: Int, xs: List[T]) = (xs take n) ::: (xs drop n+1)
```

## 5.2 Paires and Tuples

앞서 살펴보앗던 insertion sort 보다 더 개선된 merge sort 알고리즘에 대해서 살펴보자. 기본적인 개념은 zero or one element 리스트는 이미 sorted 하다는 것.

```scala
def msort(xs: List[Int]): List[Int] = {
  val n = xs.length/2
  if (n == 0) xs
  else {
    // merge 메서드는 앞으로 더 개선해 나갈 예정임
    def merge(xs: List[Int], ys: List[Int]) =
      xs mathch {
        case Nil => ys
        case x :: xs1 =>
          ys match {
            case Nil => xs
            case y :: ys1 =>
              if (x < y) x :: merge(xs1, ys)
              else y :: merge(xs, ys1)
          }
      }

    val (fst, snd) = xs splitAt n
    merge(msort(fst), msort(snd))
  }
}
```

밑에서 나오는 splitAt 함수는 index n 을 기준으로 리스트를 두개로 쪼개서 리턴한다. 여기서 리턴된 val 의 모양을 보자. fst 와 snd 두개의 타입으로 묶여져 있다. 이를 Pair 라고 한다. 예를 들면

```scala
val pair = ("answer", 42) > pair: (String, Int) = (answer,42)

val (label, value) = pare > label: String = answer | value : Int = 42
```

위와 같이 타입으로도 쓰일 수 있고, 패턴으로도 사용될 수 있다. 이때 2 개 이상의 요소를 가지면 Tuples 라 한다. Tuples 는 다양하게 사용될 수 있는데, parameterized type 으로 사용될 경우, function applictaion 으로 사용될 경우, constructor 패턴으로 사용될 경우 각각

```scala
scala.Tuplen[T1, ..., Tn]
scala.Tuplen(e1, ..., en)
scala.Tuplen(p1, ..., pn)
```

과 같이 사용할 수 있다. (여기서 Tuplen 의 n 은 파라미터 개수 ex. Tuple2)
튜플의 각 element 는 \_1, \_2 와 같이 접근할 수 있다.
이제 merge 메소드를 개선해보자.

```scala
def merge(xs: List[Int], ys: List[Int]): List[Int] = (xs, ys) match {
  case (Nil, ys) => ys
  case (xs, Nil) => xs
  case (x :: xs1, y :: ys1) =>
    if (x < y) x :: merge(xs1, ys)
    else y :: merge(xs, ys1)
}
```

훨씬 깔끔해졌다.

## 5.3 Implicit Parameters

이전 장에서 보았던 msort 는 List[Int] 타입으로 지정되어 있는데 parameterize 를 통해서 Int 말고도 다른 타입이 들어올 수 있도록 임의의 타입 T 로 변경해보자

```scala
object mergesort {
  def msort[T](xs: List[T]): List[T] = {
    val n = xs.length/2
    if (n == 0) xs
    else {
      def merge(xs: List[T], ys: List[T]): List[T] = (xs, ys) match {
        case (Nil, ys) => ys
        case (xs, Nil) => xs
        case (x :: xs1, y :: ys1) =>
          if (x < y) x :: merge(xs1, ys)
          else y :: merge(xs, ys1)
      }

      val (fst, snd) = xs splitAt n
      merge(msort(fst), msort(snd))
    }
  }

  val nums = List(2, -4, 5, 7, 1)
  msort(nums)
}
```

x < y 부분에서 에러가 발생한다. 왜냐하면 comparison '<'가 임의의 타입 T 에 정의되어 있지 않기 때문이란다....
그래서 우리는 comparison 함수가 필요하다. 이 때 가장 유연한 방법은 msort 함수에 comparison operation 을 추가적인 파라미터로 붙이는 것이다. 아래처럼

```scala
def msort[T](xs: List[T])(lt: (T, T) => Boolean) = {
  ...
  merge(msort(fst)(lt), msort(snd)(lt))
}
```

그래서 원래 mergesort 에 적용하면 다음과 같다.

```scala
object mergesort {
  def msort[T](xs: List[T])(lt: (T, T) => Boolean): List[T] = {
    val n = xs.length/2
    if (n == 0) xs
    else {
      def merge(xs: List[T], ys: List[T]): List[T] = (xs, ys) match {
        case (Nil, ys) => ys
        case (xs, Nil) => xs
        case (x :: xs1, y :: ys1) =>
          if (lt(x, y)) x :: merge(xs1, ys)
          else y :: merge(xs, ys1)
      }

      val (fst, snd) = xs splitAt n
      merge(msort(fst)(lt), msort(snd)(lt))
    }
  }

  val nums = List(2, -4, 5, 7, 1)
  msort(nums)((x, y) => x < y)

  val fruits = List("apple", "pineapple", "banana", "orange")
  msort(fruits)((x, y) => x.compareTo(y) < 0)
}
```

이제 Int 타입 뿐만 아니라 String 과 같은 다른 타입도 정렬이 가능해졌다. 이 때 lt 에 들어오는 함수 파라미터에 타입 붙이는 걸 생략해도 되는데, 컴파일러가 앞에 있는 리스트의 타입을 보고 유추할 수 있기 때문이란다. 즉 파라미터 셋의 마지막에 function value 가 들어오게 되면, 컴파일러가 타입 체크를 미뤄버린다.

### scala.math.Ordering[T]

사실 ordering 을 위한 스탠다드 라이브러리 클래스가 있다.

> scala.math.Ordering[T]

그래서 lt 명령어를 parameterizing 하는 대신 Orderging 클래스로 parameterize 할 수 있다.

```scala
def msort[T](xs: List[T])(ord: Ordering) =

  def merge(xs: List[T], ys: List[T]) =
    ... if (ord.lt(x, y)) ...

  ... merge(msort(fst)(ord), msort(snd)(ord)) ...
```

### implicit

대체로 완성된 느낌이 나지만, Ordering 함수가 처음 콜 될때부터 계속 전달되는게 좀 비효율적으로 보인다. 그래서 여기에다가 또하나를 추가해보자.
ord 파라미터에 implicit(절대적인이란 뜻) 키워드를 앞에 붙여보자. 그러면, 함수를 실제로 호출하는 부분에서 실제 파라미터를 넣어줄 필요가 없다.

```scala
def msort[T](xs: List[T])(implicit ord: Ordering) =

  def merge(xs: List[T], ys: List[T]) =
    ... if (ord.lt(x, y)) ...

  ... merge(msort(fst), msort(snd)) ...

val nums = List(2, -4, 5, 7, 1)
msort(nums)
```

더 간결해졌다.

### Rules for Implicit Parameters

타입이 T 인 implicit 파라미터가 있을때, 컴파일러는

> (1) implicit 이 쓰인 파라미터에 (2) T 와 호환되는 타입을 가지고 (3) function call 에서 보이거나 T 와 관련된 companion 오브젝트(클래스와 객체 이름이 같은 오브젝트)에서
> single implicit definition 을 찾는다. 즉, Ordering[Int]가 함수 call 의 파라미터로 존재하지 않지만, implicit 으로 처리되어 어딘가에 존재하게 된다.

## 5.4 Higher-Order List Functions

위에서 보았던 예제들은 종종 비슷한 구조를 보여준다. 요약해보면

- 리스트의 각 element 를 변경하는 것
- 어떤 조건을 만족하는 모든 element 의 리스트를 구하는 것
- 연산자를 사용하여 element 들을 결합하는 것

함수형 언어는 higer-order functinos 패턴을 이용하는 generic function 을 만들 수 있다.

첫번째 예제는 각 요소를 multiply 하는 것이다.

```scala
def scaleList(xs: List[Double], factor: Double): List[Double] = xs match {
  case Nil => xs
  case y :: ys => y * factor :: scaleList(ys, factor)
}
```

### Map

위 예제는 list 의 map 메서드를 이용하여 만들 수 있다.
map 메서드의 구조를 살펴보면 아래와 같다.

```scala
abstract class List[T] { ...
  def map[U](f: T => U): List[U] = this match {
    case Nil => this
    case x :: xs => f(x) :: xs.map(f)
  }
}
```

파라미터로 들어온 함수 f 가 각 element 에 적용되어서 새로운 리스트를 만들어 내는 함수가 바로 map 이다. map 메서드를 이용하면 훨씬 간단하게 작성할 수 있다

```scala
def scaleList(xs: List[Double], factor: Double) =
  xs.map(x => x * factor)
```

또하나의 예제를 살펴보자

```scala
def squareList(xs: List[Int]): List[Int] = xs match {
  case Nil => Nil
  case y :: ys => y * y :: squareList(ys)
}

def squareList(xs: List[Int]): List[Int] =
  xs map (y => y * y)
```

### Filtering

필터링은 어떤 조건에 맞는 element 를 모아 새로운 리스트를 만들어 내는 메서드이다.
0 보다 큰수만 필터링 하는 다음의 함수를 보자

```scala
def posElems(xs: List[Int]): List[Int] = xs match {
  case Nil => xs
  case y :: ys => if (y > 0) y :: posElems(ys) else posElems(ys)
}
```

필터를 이용하면 간단하게 해결할 수 있다. 우선은 filter 메서드가 어떻게 생겼는지부터 살펴보도록 하자.

```scala
abstract class List[T] {
  ...
  def filter(p: T => Boolean): List[T] = this match {
    case Nil => this
    case x :: xs => if (p(x)) x :: xs.filter(p) else xs.filter(p)
  }
}
```

필터는 특정조건함수(p)가 true 이면 :: 연산자를 이용하여 리스트에 붙이고 false 이면 제외하는 방식으로 새로운 리스트를 만들어간다.
그럼 위에서 보았던 posElems 를 filter 를 이용해 재구성해보자

```scala
def posElems(xs: List[Int]): List[Int] =
  xs filter(x => x > 0)
```

그외에 유용한 메서드 목록은 아래와 같다.

- xs filterNot p xs filter (x => !p(x))와 같다.
- xs partition p (xs filter p, xs filterNot) 튜플
- xs takeWhile p p 를 만족하는 요소들의 가장 긴 리스트
- xs dropWhile p p 를 만족하는 요소들의 나머지
- xs span p (xs takeWhile p, xs dropWhile p) 튜플

예를 들어보자

```scala
scala> val nums = List(2, -4, 5, 7, 1)
nums: List[Int] = List(2, -4, 5, 7, 1)

scala> nums filter (x => x > 0)
res0: List[Int] = List(2, 5, 7, 1)

scala> nums filterNot (x => x > 0)
res1: List[Int] = List(-4)

scala> nums partition (x => x > 0)
res2: (List[Int], List[Int]) = (List(2, 5, 7, 1),List(-4))

scala> nums takeWhile (x => x > 0)
res3: List[Int] = List(2)

scala> nums dropWhile (x => x > 0)
res4: List[Int] = List(-4, 5, 7, 1)

scala> nums span (x => x > 0)
res5: (List[Int], List[Int]) = (List(2),List(-4, 5, 7, 1))
```

## 5.5 Reductino of Lists

5.4 절에 이어 higr-order Function 패턴을 이용한 List 메서드에 대해서 계속 알아보도록 하자. 5.4 에서 보았던 세가지 패턴 중에 마지막인 element 를 결합하는 방법들에 대한 내용들이 되겠다.

```scala
sum(List(x1, ..., xn))      = 0 + x1 + ... + xn
product(List(x1, ..., xn))  = 1 * x1 * ... * xn
```

### ReduceLeft

각 요소를 더하거나 곱하는 sum 과 product 메서드가 있다. 이를 ReduceLeft 메서드를 이용하여 구현해보도록하자. ReduceLeft 메서드는 아래와 같은 구조를 가진다.

```scala
List(x1, ..., xn) reduceLeft op = (...(x1 op x2) op ... ) op xn

// 위의 구조를 이용하면 sum과 product는 아래와 같이 구현가능하다.
def sum(xs: List[Int]) = (0 :: xs) reduceLeft ((x, y) => x + y) // or (_ + _)
def product(xs: List[Int]) = (1 :: xs) reduceLeft ((x, y) => x * y) // or (_ * _)
```

### FoldLeft

foldLeft 함수는 reduceLeft 함수에 비해 좀더 일반적인 형태이다. foldLeft 가 reduceLeft 와 비슷하지만, foldLeft 는 하나의 accumulator(z)를 가진다.
구조는 아래와 같다.

```scala
(List(x1, ..., xn) foldLeft z)(op) = (...(z op x1) op ...) op xn
```

foldLeft 로 sum 과 product 를 구현해보자

```scala
def sum(xs: List[Int]) = (xs foldLeft 0) (_ + _)
def product(xs: List[Int]) = (xs foldLeft 1) (_ * _)
```

foldLeft 와 reduceLeft 는 List class 에서 다음과 같이 구현된다.

```scala
abstract class List[T] { ...
  def reduceLeft(op: (T, T) => T): T = this match {
    case Nil => throw new Error("Nil.reduceLeft")
    case x :: xs => (xs foldLeft x)(op)
  }
  def foldLeft[U](z: U)(op: (U, T) => U): U = this match {
    case Nil => z
    case x :: xs => (xs foldLeft op(z, x))(op)
  }
}
```

reduceLeft 도 내부적으로는 foldLeft 메서드를 이용한다.
그리고 reduceRight 와 foldRight 도 위의 두 메서드와 비슷한 구조로 동작한다. 대신 좌측이 아닌 우측(뒤)부터 reduce 한다.

### Difference between FoldLeft and FoldRight

foldLeft 와 foldRight 는 무엇이 다를까? 기본적으로 sum 을 가지고 생각했을때, 왼쪽부터 더하는 것이나 오른쪽부터 더하는 것이나 결과는 동일하다. 하지만 어떤 경우에는 둘 중 하나만 적절할 때도 있다. 아래의 예제를 보자

```scala
def concat[T](xs: List[T], ys: List[T]): List[T] = (xs foldRight ys) (_ :: _)
```

위의 함수에서 foldRight 를 foldLeft 로 변경하면, 타입에러가 발생한다.
1 :: List(2)는 가능하지만 List(1) :: 2 는 불가능한 연산이기 때문이다.

## 5.6 Reasoning About Concat

이번 챕터에서는 어떤 연산자(or 함수)가 정확히 참임을 증명할 수 있는지에 대해 알아보도록 한다.
일반적으로 natural induction(자연 귀납?)에 의해 증명하는 방법의 예는 다음과 같다.

- P(n)이 모든 n >= b 에대해서
- P(b)가 참이다. (base case)
- 이때, 모든 n >= b 에 대해서 P(n)이 참이면, P(n + 1)도 참이다.

### Referential Transparency (참조 투명성)

순수한 함수형 프로그램에서는 사이드 이펙트가 없기 때문에, reduction steps 가 어떤 부분에 대해서도 동일하게 적용된다. 이를 Referential Transparency(참조 투명성)이라 한다.

structural induction 은 natural induction 과 비슷하다.
structural induction 은 다음과 같이 동작한다.

- P(xs)이 모든 리스트 xs 에 대해서
- P(Nil)이 hold 된다면
- 리스트 xs 와 어떤 element x 에 대해서 P(xs)가 hold 되다면, P(x :: xs) 또한 hold 된다.

이제 concat 함수를 다시 살펴보자

```scala
def concat[T](xs: List[T], ys: List[T]) = xs match {
  case List() => ys
  case x :: xs1 => x :: concat(xs1, ys)
}
```

그리고 다음의 수식을 structural induction 으로 증명해보자

```scala
(xs ++ ys) ++ zs = xs ++ (ys ++ zs)
// ++(concat) 연산자의 두가지 정리를 참고한다
// Nil ++ ys = ys
// (x :: xs1) ++ ys = x :: (xs1 ++ ys)
```

우선 xs 에 Nil 이 들어갈 때인 P(Nil)을 살펴보자

```scala
// left
(Nil ++ ys) ++ zs
= ys ++ zs      // by 1st clause of ++

// right
Nil ++ (ys ++ zs)
= ys ++ zs      // by 1st clause of ++
```

다음은 xs 대신에 induction step 인 'x :: xs'를 넣어보자

```scala
// left
((x :: xs) ++ ys) + zs
= (x :: (xs ++ ys)) ++ zs      // by 2st clause of ++
= x :: ((xs ++ ys) ++ zs)      // by 2st clause of ++
= x :: (xs ++ (ys ++ zs))    // by induction hypothesis
// right
(x :: xs) ++ (ys ++ zs)
= x :: (xs ++ (ys ++ zs))    // by 2st clause of ++
```

좌변과 우변이 같으므로 함수 P 는 증명됨

## 5.7 A Larger Equational Proof on Lists

좀더 까다로운 function 인 reverse 에 대해서 알아보자
다음의 두가지 amenable 한 사실을 가지고 그 아래의 식을 증명해보자

```scala
(1) Nil.reverse = Nil               // 1st clause
(2) (x :: xs).reverse = xs.reverse ++ List(x)   // 2nd clause

// 다음을 증명
xs.reverse.reverse = xs
```

base case 는 단순하다

```scala
Nil.reverse.reverse
= Nil.reverse
= Nil
```

이번엔 reduction step 이다.

```scala
// left
(x :: xs).reverse.reverse
= (xs.reverse ++ List(x)).reverse     // by 2nd clause of reverse

// right
x :: xs
= x :: xs.reverse.reverse       // by induction hypothesis (가설에 의해)
```

두 개를 합쳐보면,

```scala
(xs.reverse ++ List(x)).reverse = x :: xs.reverse.reverse
```

직접적으로 induction 이 불가하므로, 동일한 연산을 일반화 시켜보자
여기서는 xs.reverse 를 ys 로 치환하도록 하자. 그럼 수식이 아래와 같이 바뀐다.

```scala
(ys ++ List(x)).reverse = x :: ys.reverse
```

그럼 이제 두번째 induction 인 ys 를 증명하면 동일함을 입증할 수 있겠다.
우선 base case 부터 살펴보자

```scala
// left
(Nil ++ List(x)).reverse
= List(x).reverse       // by 1st clause of ++
= (x :: Nil).reverse    // by definition of List
= Nil.reverse ++ List(x)
= Nil ++ (x :: Nil)     // by 2nd clause of reverse
= x :: Nil          // by 1st clause of ++
= x :: Nil.reverse      // by 1st clause of reverse
```

결과는 우변의 ys 에 Nil 을 집어넣었을 때와 동일한 결과과 도출되었으므로 base case 를 증명되었다. 이제 reduction step 으로 가보자

```scala
// left
((y :: ys) ++ List(x)).reverse
= (y :: (ys ++ List(x))).reverse    // by 2nd clause of ++
= (ys ++ List(x)).reverse ++ List(y)  // by 2nd clause reverse
= (x :: ys.reverse) ++ List(y)      // by the induction hypothesis
= x :: (ys.reverse ++ List(y))      // by 1st clause of ++
= x :: (y :: ys).reverse        // by 2nd clause of reverse

// right
x :: (y :: ys).reverse
```

좌변과 우변이 동일하므로 증명되었다.

### Exercise

```scala
(xs ++ ys) map f = (xs map f) ++ (ys map f)

Nil map f = Nil
(x :: xs) map f = f(x) :: (xs map f)
```

base case..

```scala
// left
(Nil ++ ys) map f
= ys map f

// right
(Nil map f) ++ (ys map f)
= Nil ++ (ys map f)
= ys map f
```

reduction step

```scala
// left
((x :: xs) ++ ys) map f
= (x :: (xs ++ ys)) map f
= f(x) :: ((xs ++ ys) map f)
= f(x) :: ((xs map f) ++ (ys map f))

// right
((x :: xs) map f) ++ (ys map f)
= (f(x) :: (xs map f)) ++ (ys map f)
= f(x) :: ((xs map f) ++ (ys map f))
```

base case, reduction step 모두 좌변과 우변이 같으므로 같음이 증명되었다.
