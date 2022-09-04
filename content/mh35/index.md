---
title: "GitLab CI/CDを用いた、Vivliostyle組版事始め"
author: "MH35"
---

# GitLab CI/CDを用いた、Vivliostyle組版事始め

GitLab CI/CDを用いて、Vivliostyleでの製本を行うことにした。

## 前提条件

今回、以下の条件で行うものとする。

* RunnerはDockerベースである
* 必要なレポジトリは自前で準備する

## 手順

大まかな手順としては、以下の通りである。

1. ビルド用のDockerイメージを、GitLabサーバに作成する
2. 本のプロジェクトを作成する
3. CIの設定ファイルを作成する
4. 執筆する

では、それぞれの手順を見ていこう。

## Dockerイメージの作成

Dockerイメージの作成には、専用のプロジェクトを作成する。まずはDockerfile本体。

```docker
FROM node:18
RUN apt-get update && apt-get install -y fonts-noto fonts-ipafont fonts-mona \
chromium chromium-driver chromium-l10n && \
apt-get clean && rm -rf /var/lib/apt/lists/*
RUN npm install -g @vivliostyle/cli
```

次に、.gitlab-ci.yml

```yaml
stages:
  - build
build_image:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:latest
  only:
    - main
```

これらを作成し、プロジェクトにpushすることにより、ビルダーのイメージが生成される。

## 本のプロジェクトを作成する

まずは、GitLab上でプロジェクトを作成する。その後、そのプロジェクトをcloneする。

そこまで行ったら、レポジトリを空にして、`npm create book .`でプロジェクトの中身を作成する(空レポジトリをcloneしたなら何もしない)。

そうしたら、package.jsonのbuildのスクリプトに`--no-sandbox`のオプションをつける。Dockerコンテナはroot権限で動くため、このオプションをつけないと動作しない。

その後、.gitlab-ci.ymlを、以下の内容で作成する

```yaml
stages:
  - build
build_doc:
  stage: build
  image: container-reg.local-gitlab.mh35.info/books/vivliostyle-image:latest
  before_script:
    - npm install
  script:
    - npm run build
  artifacts:
    paths:
      - '*.pdf'
    expire_in: '1 day'
```

あとは`git add .`して、`git commit`して、`git push`する。ここまできたら、あとは執筆していくだけである。
