package model

import "time"

type NoteCollection struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	UserID    int       `gorm:"not null;column:user_id"`
	Title     string    `gorm:"not null;column:title"`
	CreatedAt time.Time `gorm:"not null;column:created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at"`
}