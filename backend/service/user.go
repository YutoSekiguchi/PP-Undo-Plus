package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type UserService struct {}

// GET
// /users
// Get all users
func (s UserService) GetAllUsers(db *gorm.DB) ([]User, error) {
	var u []User

	if err := db.Find(&u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

// /users/:id
// Get a user
func (s UserService) GetUserByID(db *gorm.DB, c echo.Context) (*User, error) {
	var u User

	id := c.Param("id")

	if err := db.First(&u, id).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// /users/me?email=:email
// Get a user
func (s UserService) GetUserByEmail(db *gorm.DB, c echo.Context) (*User, error) {
	var u User

	email := c.QueryParam("email")

	if err := db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// POST
// /users
// Create a user
func (s UserService) CreateUser(db *gorm.DB, c echo.Context) (*User, error) {
	var u User

	if err := c.Bind(&u); err != nil {
		return nil, err
	}
	if err := db.Create(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// PUT
// /users/:id
// Update a user
func (s UserService) UpdateUser(db *gorm.DB, c echo.Context) (*User, error) {
	var u User

	id := c.Param("id")

	if err := db.First(&u, id).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&u); err != nil {
		return nil, err
	}
	if err := db.Save(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}
