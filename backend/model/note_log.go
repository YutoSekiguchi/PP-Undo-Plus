package model

import "time"

type NoteLog struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	NoteID    int       `gorm:"not null;column:note_id"`
	Snapshot  string    `gorm:"not null;column:snapshot"`
	SvgPath   string    `gorm:"not null;column:svg_path"`
	CreatedAt time.Time `gorm:"not null;column:created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at"`
}
