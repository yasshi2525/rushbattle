# RushBattle

ニコニコゲームアツマール・新市場コンテンツ - 【バトル】出勤のお時間です！

![build](https://github.com/yasshi2525/rushbattle/workflows/build/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/e398020d853112ecbadc/maintainability)](https://codeclimate.com/github/yasshi2525/rushbattle/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/e398020d853112ecbadc/test_coverage)](https://codeclimate.com/github/yasshi2525/rushbattle/test_coverage)

## 開発環境

- node.js v.14
- Visual Studio Code と以下の拡張機能

  - ESLint
  - Jest
  - GitHub Pull Requests and Issues (任意)

- コード品質・カバレッジ確認 [URL](https://codeclimate.com/github/yasshi2525/rushbattle)

## コマンド一覧

- インストール

  ```
  npm install
  ```

- アセット情報更新 (画像追加、更新時必須)

  ```
  npm run update
  ```

- Lint (commit 時必須)

  ```
  npm run lint
  ```

- ビルド (実行、エクスポート時必須、**ファイルを追加削除した際必須**)

  ```
  npm run build
  ```

- ローカル実行
  http://localhost:3300 で動作確認

  ```
  npm start
  ```

- エクスポート
  上位ディレクトリに出力される `rushbattle-latest.zip` がアツマール投稿用ファイル

  ```
  npm run export
  ```

- テスト
  ```
  npm test
  ```

## Licence

MIT Licence

## Developer

yasshi2525 [Twitter](https://twitter.com/yasshi2525)
