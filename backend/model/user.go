package model

import "time"

type User struct {
	ID          int       `gorm:"primary_key;not null;autoIncrement:true"`
	Name        string    `gorm:"not null;column:name"`
	Email       string    `gorm:"not null;column:email"`
	Password    string    `gorm:"not null;column:password"`
	DisplayName string    `gorm:"not null;column:display_name"`
	Image       string    `gorm:"not null;column:image"`
	CreatedAt   time.Time `gorm:"not null;column:created_at"`
	UpdatedAt   time.Time `gorm:"not null;column:updated_at"`
}
