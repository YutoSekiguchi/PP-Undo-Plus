package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type TagService struct {}

// GET
// /tags/:id
// Get a tag
func (s TagService) GetTagByID(db *gorm.DB, c echo.Context) (*Tag, error) {
	var t Tag

	id := c.Param("id")

	if err := db.First(&t, id).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

// /tags
// Get all tags
func (s TagService) GetAllTags(db *gorm.DB) ([]Tag, error) {
	var t []Tag

	if err := db.Find(&t).Error; err != nil {
		return nil, err
	}
	return t, nil
}

// `POST
// /tags
// Create a tag
func (s TagService) CreateTag(db *gorm.DB, c echo.Context) (*Tag, error) {
	var t Tag

	if err := c.Bind(&t); err != nil {
		return nil, err
	}
	if err := db.Create(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

// PUT
// /tags/:id
// Update a tag
func (s TagService) UpdateTag(db *gorm.DB, c echo.Context) (*Tag, error) {
	var t Tag

	id := c.Param("id")

	if err := db.First(&t, id).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&t); err != nil {
		return nil, err
	}
	if err := db.Save(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

// DELETE
// /tags/:id
// Delete a tag
func (s TagService) DeleteTag(db *gorm.DB, c echo.Context) error {
	var t Tag

	id := c.Param("id")

	if err := db.First(&t, id).Error; err != nil {
		return err
	}
	if err := db.Delete(&t).Error; err != nil {
		return err
	}
	return nil
}
