package model

import "time"

type Note struct {
	ID               int       `gorm:"primary_key;not null;autoIncrement:true"`
	NoteCollectionID int       `gorm:"not null;column:note_collection_id"`
	UserID           int       `gorm:"not null;column:user_id"`
	Title            string    `gorm:"not null;column:title"`
	SvgPath          string    `gorm:"not null;column:svg_path"`
	Snapshot         string    `gorm:"not null;column:snapshot"`
	CreatedAt        time.Time `gorm:"not null;column:created_at"`
	UpdatedAt        time.Time `gorm:"not null;column:updated_at"`
}
