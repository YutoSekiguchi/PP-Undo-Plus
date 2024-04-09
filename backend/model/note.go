package model

import "time"

type Note struct {
	ID                int       `gorm:"primary_key;not null;autoIncrement:true"`
	NoteCollectionID  int       `gorm:"not null;column:note_collection_id"`
	UserID            int       `gorm:"not null;column:user_id"`
	Title             string    `gorm:"not null;column:title"`
	SvgPath           string    `gorm:"not null;column:svg_path"`
	Snapshot          string    `gorm:"not null;column:snapshot"`
	PressureInfo      string    `gorm:"not null;column:pressure_info"`
	StrokeTimeInfo    string    `gorm:"not null;column:stroke_time_info"`
	OperationJsonPath string    `gorm:"not null;column:operation_json_path"`
	WPressure         float64   `gorm:"not null;column:w_pressure"`
	WTime             float64   `gorm:"not null;column:w_time"`
	WDistance         float64   `gorm:"not null;column:w_distance"`
	boundaryValue		  float64   `gorm:"not null;column:boundary_value"`
	CreatedAt         time.Time `gorm:"not null;column:created_at"`
	UpdatedAt         time.Time `gorm:"not null;column:updated_at"`
}
