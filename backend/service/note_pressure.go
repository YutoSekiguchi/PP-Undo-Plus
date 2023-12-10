package service

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type NotePressureService struct {}

// GET
// /note_pressures/:id
// Get a note_pressure
func (s NotePressureService) GetNotePressureByID(db *gorm.DB, c echo.Context) (*NotePressure, error) {
	var np NotePressure

	id := c.Param("id")

	if err := db.First(&np, id).Error; err != nil {
		return nil, err
	}
	return &np, nil
}

// /note_pressures/note/:note_id
// Get note_pressures
func (s NotePressureService) GetNotePressuresByNoteID(db *gorm.DB, c echo.Context) ([]NotePressure, error) {
	var np []NotePressure

	note_id := c.Param("note_id")

	if err := db.Where("note_id = ?", note_id).Find(&np).Error; err != nil {
		return nil, err
	}
	return np, nil
}

// /note_pressures/shape/:shape_id
// Get a note_pressure
func (s NotePressureService) GetNotePressureByShapeID(db *gorm.DB, c echo.Context) (*NotePressure, error) {
	var np NotePressure

	shape_id := c.Param("shape_id")

	if err := db.Where("shape_id = ?", shape_id).First(&np).Error; err != nil {
		return nil, err
	}
	return &np, nil
}

// POST
// /note_pressures
// Create a note_pressure
func (s NotePressureService) CreateNotePressure(db *gorm.DB, c echo.Context) (*NotePressure, error) {
	var np NotePressure

	if err := c.Bind(&np); err != nil {
		return nil, err
	}
	if err := db.Create(&np).Error; err != nil {
		return nil, err
	}
	return &np, nil
}

// PUT
// /note_pressures/:id
// Update a note_pressure
func (s NotePressureService) UpdateNotePressure(db *gorm.DB, c echo.Context) (*NotePressure, error) {
	var np NotePressure

	id := c.Param("id")

	if err := db.First(&np, id).Error; err != nil {
		return nil, err
	}
	if err := c.Bind(&np); err != nil {
		return nil, err
	}
	if err := db.Save(&np).Error; err != nil {
		return nil, err
	}
	return &np, nil
}

// DELETE
// /note_pressures/:id
func (s NotePressureService) DeleteNotePressureByID(db *gorm.DB, c echo.Context) error {
	var np NotePressure

	id := c.Param("id")

	if err := db.First(&np, id).Error; err != nil {
		return err
	}
	if err := db.Delete(&np).Error; err != nil {
		return err
	}
	return nil
}

// DELETE
// /note_pressures/note/:note_id
func (s NotePressureService) DeleteNotePressuresByNoteID(db *gorm.DB, c echo.Context) error {
	var np []NotePressure

	note_id := c.Param("note_id")

	if err := db.Where("note_id = ?", note_id).Find(&np).Error; err != nil {
		return err
	}
	if err := db.Delete(&np).Error; err != nil {
		return err
	}
	return nil
}
