# 📚 READ ME

## 📌 프로젝트 개요

---

<br>

👉🏼 **[ DrawSQL ERD ]** https://drawsql.app/teams/1-524/diagrams/-4
<br>

👉🏼 **[ Github ]** https://github.com/boogie-bogie/Tickets_Project
<br>

👉🏼 **[ Swaagger API 명세서 ]**

<br>

- 웹 프레임워크/데이터베이스 : TypeScript, Nest.js, PostgreSQL, TypeORM

<br><br>

### 🔧 개발 기간

- 2024.03.10 - 2024.03.14

<br><br>

### 📁 Directory Structure: 폴더 구조

```bash
.
├── src
│   ├── auth
│   ├── performance
│   ├── points
│   ├── tickets
│   ├── users
│   ├── utils
│   ├── app.module.ts
│   └── main.ts
├── test
│   ├── unit
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── README.md
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── package-lock.json

```

<br><br>

## ❓ 피드백 질문 답변

---

## [고민 거리]

1. TypeORM과 함께 mysql을 설치했는데, mysql2 라는것도 있습니다. 어떤 차이가 있고 우린 어떤걸 사용하는게 좋을지 고민해보세요.

2. migration를 왜 사용하는지에 대해 고민해보면 좋습니다. 스키마를 한번에 반영하지 않고 수정내용을 하나씩 반영하는 이유는 무엇일까요?

3. TypeORM에서 데이터를 넣는 방법은 save와 insert 가 있습니다. 어떤 차이가 있을까요?

## [내용 피드백]

1. synchronize를 true할 경우 테이블락을 잡고 스키마를 변경하는 경우가 다수 존재합니다. 운영에서는 켜고 개발/테스트 환경에서는 끄는 것 보다는 끄고 사용하는것을 생활화하는게 좋습니다.

2. Class로 전환하는 과정에서 클래스만 export할 수 없다. 는 잘못된 내용입니다. Class만 export할 수 있고 import 하는곳에서 인스턴스를 생성해서 사용할 수 있습니다. 인스턴스를 생성해서 export하는것과 import 하는쪽에서 생성하는것의 차이는 무엇이 있고 메모리 관점에서는 어떤 차이가 있을까요?
