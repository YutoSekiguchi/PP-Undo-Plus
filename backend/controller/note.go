package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// Get a note by id
func (ctrl Controller) HandleGetNoteByID(c echo.Context) error {
	var s service.NoteService
	n, err := s.GetNoteByID(ctrl.Db, c)

	return Res(c, n, err)
}

// Get notes by note collection id
func (ctrl Controller) HandleGetNotesByNoteCollectionID(c echo.Context) error {
	var s service.NoteService
	n, err := s.GetNotesByNoteCollectionID(ctrl.Db, c)

	return Res(c, n, err)
}

// Get notes by user id
func (ctrl Controller) HandleGetNotesByUserID(c echo.Context) error {
	var s service.NoteService
	n, err := s.GetNotesByUserID(ctrl.Db, c)

	return Res(c, n, err)
}

// Create a note
func (ctrl Controller) HandleCreateNote(c echo.Context) error {
	var s service.NoteService
	n, err := s.CreateNote(ctrl.Db, c)

	return Res(c, n, err)
}

// Update a note
func (ctrl Controller) HandleUpdateNote(c echo.Context) error {
	var s service.NoteService
	n, err := s.UpdateNote(ctrl.Db, c)

	return Res(c, n, err)
}

// Delete a note
func (ctrl Controller) HandleDeleteNoteByID(c echo.Context) error {
	var s service.NoteService
	err := s.DeleteNoteByID(ctrl.Db, c)

	return ResForOneResponse(c, err)
}