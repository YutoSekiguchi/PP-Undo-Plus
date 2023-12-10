package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NoteCollectionService struct {}

// GET
// /note_collections/:id
// Get a note_collection
func (s NoteCollectionService) GetNoteCollectionByID(db *gorm.DB, c echo.Context) (*NoteCollection, error) {
	var nc NoteCollection

	id := c.Param("id")

	if err := db.First(&nc, id).Error; err != nil {
		return nil, err
	}
	return &nc, nil
}

// /note_collections/user/:user_id
// Get a note_collection
func (s NoteCollectionService) GetNoteCollectionsByUserID(db *gorm.DB, c echo.Context) ([]NoteCollection, error) {
	var nc []NoteCollection

	user_id := c.Param("user_id")

	if err := db.Where("user_id = ?", user_id).Find(&nc).Error; err != nil {
		return nil, err
	}
	return nc, nil
}

// POST
// /note_collections
// Create a note_collection
func (s NoteCollectionService) CreateNoteCollection(db *gorm.DB, c echo.Context) (*NoteCollection, error) {
	var nc NoteCollection

	if err := c.Bind(&nc); err != nil {
		return nil, err
	}
	if err := db.Create(&nc).Error; err != nil {
		return nil, err
	}
	return &nc, nil
}

// PUT
// /note_collections/:id
// Update a note_collection
func (s NoteCollectionService) UpdateNoteCollection(db *gorm.DB, c echo.Context) (*NoteCollection, error) {
	var nc NoteCollection

	id := c.Param("id")

	if err := db.First(&nc, id).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&nc); err != nil {
		return nil, err
	}
	if err := db.Save(&nc).Error; err != nil {
		return nil, err
	}
	return &nc, nil
}

// DELETE
// /note_collections/:id
// Delete a note_collection
func (s NoteCollectionService) DeleteNoteCollectionByID(db *gorm.DB, c echo.Context) error {
	var nc NoteCollection

	id := c.Param("id")

	if err := db.First(&nc, id).Error; err != nil {
		return err
	}
	if err := db.Delete(&nc).Error; err != nil {
		return err
	}
	return nil
}

