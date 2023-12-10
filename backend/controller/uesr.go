package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// All User Controller
func (ctrl Controller) HandleGetAllUsers(c echo.Context) error {
	var s service.UserService
	u, err := s.GetAllUsers(ctrl.Db)

	return Res(c, u, err)
}

// Get a user by id
func (ctrl Controller) HandleGetUserByID(c echo.Context) error {
	var s service.UserService
	u, err := s.GetUserByID(ctrl.Db, c)

	return Res(c, u, err)
}

// Get a user by email
func (ctrl Controller) HandleGetUserByEmail(c echo.Context) error {
	var s service.UserService
	u, err := s.GetUserByEmail(ctrl.Db, c)

	return Res(c, u, err)
}

// Create a user
func (ctrl Controller) HandleCreateUser(c echo.Context) error {
	var s service.UserService
	u, err := s.CreateUser(ctrl.Db, c)

	return Res(c, u, err)
}

// Update a user
func (ctrl Controller) HandleUpdateUser(c echo.Context) error {
	var s service.UserService
	u, err := s.UpdateUser(ctrl.Db, c)

	return Res(c, u, err)
}
