package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// Get a note pressure by id
func (ctrl Controller) HandleGetNotePressureByID(c echo.Context) error {
	var s service.NotePressureService
	np, err := s.GetNotePressureByID(ctrl.Db, c)

	return Res(c, np, err)
}

// Get note pressures by note id
func (ctrl Controller) HandleGetNotePressuresByNoteID(c echo.Context) error {
	var s service.NotePressureService
	np, err := s.GetNotePressuresByNoteID(ctrl.Db, c)

	return Res(c, np, err)
}

// Get a note pressure by shape id
func (ctrl Controller) HandleGetNotePressureByShapeID(c echo.Context) error {
	var s service.NotePressureService
	np, err := s.GetNotePressureByShapeID(ctrl.Db, c)

	return Res(c, np, err)
}

// Create a note pressure
func (ctrl Controller) HandleCreateNotePressure(c echo.Context) error {
	var s service.NotePressureService
	np, err := s.CreateNotePressure(ctrl.Db, c)

	return Res(c, np, err)
}

// Update a note pressure
func (ctrl Controller) HandleUpdateNotePressure(c echo.Context) error {
	var s service.NotePressureService
	np, err := s.UpdateNotePressure(ctrl.Db, c)

	return Res(c, np, err)
}

// Delete a note pressure
func (ctrl Controller) HandleDeleteNotePressureByID(c echo.Context) error {
	var s service.NotePressureService
	err := s.DeleteNotePressureByID(ctrl.Db, c)

	return ResForOneResponse(c, err)
}

// Delete a note pressure by id
func (ctrl Controller) HandleDeleteNotePressuresByID(c echo.Context) error {
	var s service.NotePressureService
	err := s.DeleteNotePressureByID(ctrl.Db, c)

	return ResForOneResponse(c, err)
}

// Delete note pressures by note id
func (ctrl Controller) HandleDeleteNotePressuresByNoteID(c echo.Context) error {
	var s service.NotePressureService
	err := s.DeleteNotePressuresByNoteID(ctrl.Db, c)

	return ResForOneResponse(c, err)
}