# api
- **言語**：[Go](https://golang.org/)
  - Version 1.21.5
- **フレームワーク**：[Echo](https://echo.labstack.com/)
- **利用ライブラリ**
  - [GORM](https://gorm.io/ja_JP/docs/index.html)：ORM ライブラリ（MySQL の操作をしやすくするために入れた）
  - [Air](https://github.com/cosmtrek/air)：開発時にコードの変更を検知して自動で再起動させてくれる
  - [mysql](https://github.com/go-sql-driver/mysql)：Go からデータベースに接続するため
- **開発時のポート**：7171

# ディレクトリ構成
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