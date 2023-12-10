package model

import "time"

type User struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	Name      string    `gorm:"not null;column:name"`
	Email     string    `gorm:"not null;column:email"`
	Password  string    `gorm:"not null;column:password"`
	CreatedAt time.Time `gorm:"not null;column:created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at"`
}