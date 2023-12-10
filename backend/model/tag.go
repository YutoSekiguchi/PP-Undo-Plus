package model

import "time"

type Tag struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	Name			string    `gorm:"not null;column:name"`
	CreatedAt time.Time `gorm:"not null;column:created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at"`
}