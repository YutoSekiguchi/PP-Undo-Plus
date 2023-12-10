package main

import (
	"github.com/YutoSekiguchi/ppundo-plus/router"
	"github.com/YutoSekiguchi/ppundo-plus/util"
)

func main() {
	db := util.InitDb()
	router.InitRouter(db)
}