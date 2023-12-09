# PP-Undo+

**Overview**

- A system that implements Undo/Redo functions based on the level of confidence and importance by varying pen pressure.
  - Includes additional features like pressure-based eraser, grouping functions, etc.

**System Configuration**

- Development Environment
  - Docker
    - Running Next.js + TypeScript, Go, MySQL, PHPMyAdmin on Docker
- Frontend
  - [Next.js](https://nextjs.org/)
    - Version: ^14.0.3
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- Backend
  - [Go](https://golang.org/)
    - Framework: [Echo](https://echo.labstack.com/)
- Database
  - MySQL

### Configuration Files
- `./.env`
  - ```
    MYSQL_USER=ppundo-plus
    MYSQL_PASSWORD=ppundo-plus++1234 // Change this for the production environment
    MYSQL_ROOT_PASSWORD=ppundo-plus++1234 // Change this for the production environment
    MYSQL_HOST=tcp(mysql:3306)
    MYSQL_DATABASE=ppundo_plus_db
    PMA_HOST=mysql
    PMA_USER=ppundo-plus // Do not write this line in the production environment
    PMA_PASSWORD=ppundo-plus++1234 // Do not write this line in the production environment
    ```

- `./client/.env`
  - ```
    API_URL_DEV=http://localhost:7171 // API URL for the development environment
    API_URL_PROD=https://xxx.com/api // API URL for the production environment
    ```

### List of Ports Used in Development

|     | Port | Description                   | Docker Container Name        |
| :-: | ---- | ----------------------------- | ---------------------------- |
|     | 7170 | Client, Next.js               | ppundo-plus-client           |
|     | 7171 | API, Go                       | ppundo-plus--api             |
|     | 7172 | Database, MySQL               | ppundo-plus--mysql           |
|     | 7173 | Database Management, PHPMyAdmin | ppundo-plus--phpmyadmin    |


# 日本語版

# PP-Undo+

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
    ```

### 開発で使用するポート一覧

|     | port | 説明                           | docker container 名         |
| :-: | ---- | :----------------------------- | --------------------------- |
|     | 7170 | クライアント, Next.js          | ppundo-plus-client          |
|     | 7171 | API, Go                        | ppundo-plus--api            |
|     | 7172 | データベース，   MySQL         | ppundo-plus--mysql          |
|     | 7173 | データベースの操作, PHPMyAdmin | ppundo-plus--phpmyadmin     |