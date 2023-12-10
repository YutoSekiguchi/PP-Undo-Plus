
# API
- **Language**: [Go](https://golang.org/)
  - Version 1.21.5
- **Framework**: [Echo](https://echo.labstack.com/)
- **Used Libraries**
  - [GORM](https://gorm.io/ja_JP/docs/index.html): ORM library (used to facilitate operations with MySQL)
  - [Air](https://github.com/cosmtrek/air): Automatically restarts the server on code changes during development
  - [mysql](https://github.com/go-sql-driver/mysql): For connecting to the database from Go
- **Development Port**: 7171

# Directory Structure
```
├── /controller
├── /model
├── /router
├── /service
├── /util
├── .air.toml
├── .gitignore
├── dev.Dockerfile
├── prod.Dockerfile
├── go.mod
├── go.sum
├── main.go
├── README.ja.md
└── README.md
```
