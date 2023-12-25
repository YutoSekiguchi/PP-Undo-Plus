# PP-Undo+（日本語版）
[English](./README.md) | [日本語](./README.ja.md)

**概要**

- 自信度や重要度に応じて筆圧に強弱をつけることによって重要度や自信度に応じたUndo/Redoを行えるシステムの実現
  - 他にも筆圧ベースの消しゴム，グルーピング機能などがある

**システム構成**

- 開発環境
  - Docker
    - Docker上でNext.js + TypeScript，Go，MySQL，PHPMyAdminを動かしてる
- フロントエンド
  - [Next.js](https://nextjs.org/)
    - version: ^14.0.3
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- バックエンド
  - [Go](https://golang.org/)
    - フレームワーク：[Echo](https://echo.labstack.com/)
- データベース
  - MySQL

### 設定ファイル
- `./.env`
  - ```
    MYSQL_USER=ppundo-plus
    MYSQL_PASSWORD=ppundo-plus++1234 // 本番環境ではここを変更
    MYSQL_ROOT_PASSWORD=ppundo-plus++1234 // 本番環境ではここを変更
    MYSQL_HOST=tcp(mysql:3306)
    MYSQL_DATABASE=ppundo_plus_db
    PMA_HOST=mysql
    PMA_USER=ppundo-plus // 本番環境ではこの行を書かない
    PMA_PASSWORD=ppundo-plus++1234 // 本番環境ではこの行を書かない
    ```

- `./client/.env`
  - ```
    API_URL_DEV=http://localhost:7171 // 開発環境のAPIのURL
    API_URL_PROD=https://xxx.com/api // 本番環境のAPIのURL
    GOOGLE_CLIENT_ID=xxx.yyy.zzz.com
    GOOGLE_CLIENT_SECRET=XXX-YYY-ZZZ
    NEXTAUTH_SECRET=xxxxxxxxxxxxxxxxxx
    VERSION=1.0.0
    ```

### 開発で使用するポート一覧

|     | port | 説明                           | docker container 名         |
| :-: | ---- | :----------------------------- | --------------------------- |
|     | 7170 | クライアント, Next.js          | ppundo-plus--frontend       |
|     | 7171 | API, Go                        | ppundo-plus--backend        |
|     | 7172 | データベース，   MySQL         | ppundo-plus--mysql          |
|     | 7173 | データベースの操作, PHPMyAdmin | ppundo-plus--phpmyadmin     |