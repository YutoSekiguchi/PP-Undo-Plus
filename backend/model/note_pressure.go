package model

import "time"

type NotePressure struct {
	ID            int       `gorm:"primary_key;not null;autoIncrement:true"`
	NoteID        int       `gorm:"not null;column:note_id"`
	ShapeID       int       `gorm:"not null;column:shape_id"`
	GroupID       int       `gorm:"not null;column:group_id"`
	AvgPressure   float64   `gorm:"not null;column:avg_pressure"`
	GroupPressure float64   `gorm:"not null;column:group_pressure"`
	CreatedAt     time.Time `gorm:"not null;column:created_at"`
	UpdatedAt     time.Time `gorm:"not null;column:updated_at"`
}
