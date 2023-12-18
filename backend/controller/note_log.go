package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// Get a note_log by id
func (ctrl Controller) HandleGetNoteLogByID(c echo.Context) error {
	var s service.NoteLogService
	nl, err := s.GetNoteLogByID(ctrl.Db, c)

	return Res(c, nl, err)
}

// Get all note_logs by note_id (sorted by created_at)
func (ctrl Controller) HandleGetNoteLogsByNoteID(c echo.Context) error {
	var s service.NoteLogService
	nl, err := s.GetNoteLogsByNoteID(ctrl.Db, c)

	return Res(c, nl, err)
}

// Create a note_log
func (ctrl Controller) HandleCreateNoteLog(c echo.Context) error {
	var s service.NoteLogService
	nl, err := s.CreateNoteLog(ctrl.Db, c)

	return Res(c, nl, err)
}