---
title: '[ionic] ionic 개발에 필요한 것들'
date: 2016-11-16 01:14:00
category: javascript
tags:
  - ionic
  - javascript
  - 모바일앱
---

## ionic 개발에 필요한 것들

기본적으로 ionic, nodejs, cordova 등만 있어도 개발은 가능하겠지만, 안드로이드 에뮬레이터 실행을 위해서는 jdk 설치가 필요하겠고, ios 에뮬레이터 실행을 위해서는 xcode 설치도 필수가 되겠다(아래에선 생략한다). 그리고 ionic 과 관련해서 설치해두면 편리하게 사용할 수 있는 모듈들을 몇개 추려봤다.

참고로 아직 ionic 파악이 덜 끝난 상태이므로 해당 리스트는 추가되거나 삭제될 수 있다.

#### JAVA

- http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
- 안드로이드가 자바기반으로 개발되기 때문에 반드시 필요하다.
- JAVA_HOME 경로를 ~/.bash_profile(or ~/.profile)파일에 설정한다.

```
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home
export PATH=$PATH:$JAVA_HOME/bin
```

#### Android SDK

- Android 에뮬레이터 설치, 디버깅 등에 필요하다.
- Ionic 이 Android 앱을 빌드하거나 실행할 때는 Stand-Alone SDK Tools 가 필요하다.
- ANDROID_HOME 경로도 지정해준다.

```
export ANDROID_HOME=/Projects/Libraries/adt-bundle-mac-x86_64/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### Node.js

- 우선 설치부터, https://nodejs.org/en/download/ 사이트에서 원하는 os, version 을 선택하여 설치한다.
- 또는 맥 사용자라면, 아래 명령어로 설치한다.

```
brew install node
```

- NODE_HOME 도 경로설정 해준다.

```
export NODE_HOME=p/Projects/Libraries/node/node-v0.12.7-darwin-x64
export NODE_PATH=$NODE_HOME/lib/node_modules
export PATH=$PATH:$NODE_HOME/bin:$NODE_PATH
```

#### cordova

- npm install -g cordova (-g 옵션은 global, CLI(Command Line Interface) 명령어를 제공하는 경우는 글로벌로 설치)
- ionic 은 내부적으로 cordova 를 이용한다(디바이스 배포용도).

#### gulp

- npm install -g gulp
- ionic 빌드 시스템

#### bower

- npm install -g bower
- ionic 은 필요한 패키지를 bower 를 이용해서 다운 받는다.

#### ios-sim

- npm install -g ios-sim
- 폰갭 프로젝트를 ios 시뮬레이터에서 실행하기 위한 패키지
- 다음 명령어로 타겟을 지정해줄수 있다.

```
# 가능한 device 확인
ios-sim showdevices

# 타겟 지정 실행
ionic emualte ios --target="iPhone-5s"
```

#### ios-deploy

- npm imstall -g ios-deploy
- PhoneGap 프로젝트를 Xcode 없이 iOS 디바이스로 앱을 설치하거나 디버깅하는 패키지
- ios-sim, ios-deploy 패키지를 설치했다면, ios 시뮬레이터를 띄우기 위해서 굳이 xcode 를 실행할 필요는 없다(물론 설치는 되어있어야 함).

#### ionic

- npm install -g ionic
- 드디어 ionic 설치, 이전것들은 ionic 프로젝트를 만들기전 꼭 필요한 패키지 들이니 꼭 설치하고 시작하도록 하자.
- 몇가지 명령어를 살펴보자

```
# sidemenu 형식의 프로젝트 생성
ionic start testApp sidemenu

# ionic 서버 실행
ionic serve

# ionic ios 앱 빌드
ionic build

# ios 에뮬레이터 실행
ionic emulate ios (--target="iPhone-6s")

# ios real 디바이스에서 실행
ionic run ios

# android 추가
ionic platform add android
```

참고자료 : http://blog.saltfactory.net/ionic/start-ionic-edge-book.html
