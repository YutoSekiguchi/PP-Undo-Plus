# PP-Undo+
[English](./README.md) | [日本語](./README.ja.md)

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
    GOOGLE_CLIENT_ID=xxx.yyy.zzz.com
    GOOGLE_CLIENT_SECRET=XXX-YYY-ZZZ
    NEXTAUTH_SECRET=xxxxxxxxxxxxxxxxxx
    VERSION=1.0.0
    ```

### List of Ports Used in Development

|     | Port | Description                   | Docker Container Name        |
| :-: | ---- | ----------------------------- | ---------------------------- |
|     | 7170 | Client, Next.js               | ppundo-plus--frontend        |
|     | 7171 | API, Go                       | ppundo-plus--api             |
|     | 7172 | Database, MySQL               | ppundo-plus--mysql           |
|     | 7173 | Database Management, PHPMyAdmin | ppundo-plus--phpmyadmin    |