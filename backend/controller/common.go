package controller

import (
	"fmt"
	"net/http"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Controller Struct
type Controller struct {
	Db *gorm.DB
}

func NewController(db *gorm.DB) *Controller {
	return &Controller{
		Db: db,
	}
}

func Res(c echo.Context, p interface{}, err error) error {
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}