package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NoteTagService struct {}

// Tag and Note are many to many relationship
type NoteTagWithNoteAndTag struct {
	NoteTag
	Note
	Tag
}

// GET
// /note_tags/:tag_id
// Get note_tag, note and tag
func (s NoteTagService) GetNoteTagsWithNoteAndTagByTagID(db *gorm.DB, c echo.Context) ([]NoteTagWithNoteAndTag, error) {
	var nt []NoteTagWithNoteAndTag

	tag_id := c.Param("tag_id")

	// NoteTagにNoteとTagを結合させて取得
	if err := db.Table("note_tags").Select("note_tags.*, notes.*, tags.*").Joins("left join notes on note_tags.note_id = notes.id").Joins("left join tags on note_tags.tag_id = tags.id").Where("note_tags.tag_id = ?", tag_id).Find(&nt).Error; err != nil {
		return nil, err
	}
	return nt, nil
}

// /note_tags/:note_id
// Get note_tag, note and tag
func (s NoteTagService) GetNoteTagsWithNoteAndTagByNoteID(db *gorm.DB, c echo.Context) ([]NoteTagWithNoteAndTag, error) {
	var nt []NoteTagWithNoteAndTag

	note_id := c.Param("note_id")

	// NoteTagにNoteとTagを結合させて取得
	if err := db.Table("note_tags").Select("note_tags.*, notes.*, tags.*").Joins("left join notes on note_tags.note_id = notes.id").Joins("left join tags on note_tags.tag_id = tags.id").Where("note_tags.note_id = ?", note_id).Find(&nt).Error; err != nil {
		return nil, err
	}
	return nt, nil
}

// POST
// /note_tags
// Create a note_tag
func (s NoteTagService) CreateNoteTag(db *gorm.DB, c echo.Context) (*NoteTag, error) {
	var nt NoteTag

	if err := c.Bind(&nt); err != nil {
		return nil, err
	}
	if err := db.Create(&nt).Error; err != nil {
		return nil, err
	}
	return &nt, nil
}

// DELETE
// /note_tags/:id
// Delete a note_tag
func (s NoteTagService) DeleteNoteTag(db *gorm.DB, c echo.Context) error {
	var nt NoteTag

	id := c.Param("id")

	if err := db.First(&nt, id).Error; err != nil {
		return err
	}
	if err := db.Delete(&nt).Error; err != nil {
		return err
	}
	return nil
}
