package model

import "time"

type NoteTag struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	NoteID    int       `gorm:"not null;column:note_id"`
	TagID     int       `gorm:"not null;column:tag_id"`
	CreatedAt time.Time `gorm:"not null;column:created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at"`
}