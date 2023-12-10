package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NoteService struct {}

// GET
// /notes/:id
// Get a note
func (s NoteService) GetNoteByID(db *gorm.DB, c echo.Context) (*Note, error) {
	var n Note

	id := c.Param("id")

	if err := db.First(&n, id).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

// /notes/collection/:note_collection_id
// Get notes
func (s NoteService) GetNotesByNoteCollectionID(db *gorm.DB, c echo.Context) ([]Note, error) {
	var n []Note

	note_collection_id := c.Param("note_collection_id")

	if err := db.Where("note_collection_id = ?", note_collection_id).Find(&n).Error; err != nil {
		return nil, err
	}
	return n, nil
}

// /notes/user/:user_id
// Get notes
func (s NoteService) GetNotesByUserID(db *gorm.DB, c echo.Context) ([]Note, error) {
	var n []Note

	user_id := c.Param("user_id")

	if err := db.Where("user_id = ?", user_id).Find(&n).Error; err != nil {
		return nil, err
	}
	return n, nil
}

// POST
// /notes
// Create a note
func (s NoteService) CreateNote(db *gorm.DB, c echo.Context) (*Note, error) {
	var n Note

	if err := c.Bind(&n); err != nil {
		return nil, err
	}
	if err := db.Create(&n).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

// PUT
// /notes/:id
// Update a note
func (s NoteService) UpdateNote(db *gorm.DB, c echo.Context) (*Note, error) {
	var n Note

	id := c.Param("id")

	if err := db.First(&n, id).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&n); err != nil {
		return nil, err
	}
	if err := db.Save(&n).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

// DELETE
// /notes/:id
// Delete a note
func (s NoteService) DeleteNoteByID(db *gorm.DB, c echo.Context) error {
	var n Note

	id := c.Param("id")

	if err := db.First(&n, id).Error; err != nil {
		return err
	}
	if err := db.Delete(&n).Error; err != nil {
		return err
	}
	return nil
}