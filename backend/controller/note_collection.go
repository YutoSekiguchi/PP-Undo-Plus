package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// Get a note collection by id
func (ctrl Controller) HandleGetNoteCollectionByID(c echo.Context) error {
	var s service.NoteCollectionService
	nc, err := s.GetNoteCollectionByID(ctrl.Db, c)

	return Res(c, nc, err)
}

// Get note collections by user id
func (ctrl Controller) HandleGetNoteCollectionsByUserID(c echo.Context) error {
	var s service.NoteCollectionService
	nc, err := s.GetNoteCollectionsByUserID(ctrl.Db, c)

	return Res(c, nc, err)
}

// Create a note collection
func (ctrl Controller) HandleCreateNoteCollection(c echo.Context) error {
	var s service.NoteCollectionService
	nc, err := s.CreateNoteCollection(ctrl.Db, c)

	return Res(c, nc, err)
}

// Update a note collection
func (ctrl Controller) HandleUpdateNoteCollection(c echo.Context) error {
	var s service.NoteCollectionService
	nc, err := s.UpdateNoteCollection(ctrl.Db, c)

	return Res(c, nc, err)
}
