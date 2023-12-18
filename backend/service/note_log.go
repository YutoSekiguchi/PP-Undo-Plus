package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NoteLogService struct {}

// GET
// /note_logs/:id
// Get a note_log
func (s NoteLogService) GetNoteLogByID(db *gorm.DB, c echo.Context) (*NoteLog, error) {
	var nl NoteLog

	id := c.Param("id")

	if err := db.First(&nl, id).Error; err != nil {
		return nil, err
	}
	return &nl, nil
}

// /note_logs/note/:note_id
// Get all note_logs by note_id (sorted by created_at)
func (s NoteLogService) GetNoteLogsByNoteID(db *gorm.DB, c echo.Context) ([]NoteLog, error) {
	var nl []NoteLog

	noteID := c.Param("note_id")

	if err := db.Where("note_id = ?", noteID).Order("created_at desc").Find(&nl).Error; err != nil {
		return nil, err
	}
	return nl, nil
}

// POST
// /note_logs
// Create a note_log
func (s NoteLogService) CreateNoteLog(db *gorm.DB, c echo.Context) (*NoteLog, error) {
	var nl NoteLog

	if err := c.Bind(&nl); err != nil {
		return nil, err
	}
	if err := db.Create(&nl).Error; err != nil {
		return nil, err
	}
	return &nl, nil
}
