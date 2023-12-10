package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// Get notetags with note and tag by tag id
func (ctrl Controller) HandleGetNoteTagsWithNoteAndTagByTagID(c echo.Context) error {
	var s service.NoteTagService
	nt, err := s.GetNoteTagsWithNoteAndTagByTagID(ctrl.Db, c)

	return Res(c, nt, err)
}

// Get notetags with note and tag by note id
func (ctrl Controller) HandleGetNoteTagsWithNoteAndTagByNoteID(c echo.Context) error {
	var s service.NoteTagService
	nt, err := s.GetNoteTagsWithNoteAndTagByNoteID(ctrl.Db, c)

	return Res(c, nt, err)
}

// Create a notetag
func (ctrl Controller) HandleCreateNoteTag(c echo.Context) error {
	var s service.NoteTagService
	nt, err := s.CreateNoteTag(ctrl.Db, c)

	return Res(c, nt, err)
}

// Delete a notetag
func (ctrl Controller) HandleDeleteNoteTag(c echo.Context) error {
	var s service.NoteTagService
	err := s.DeleteNoteTag(ctrl.Db, c)

	return ResForOneResponse(c, err)
}