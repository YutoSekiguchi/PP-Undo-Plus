package controller

import (
	"github.com/labstack/echo/v4"
	"github.com/YutoSekiguchi/ppundo-plus/service"
)

// Get all tags
func (ctrl Controller) HandleGetAllTags(c echo.Context) error {
	var s service.TagService
	t, err := s.GetAllTags(ctrl.Db)

	return Res(c, t, err)
}

// Get a tag by id
func (ctrl Controller) HandleGetTagByID(c echo.Context) error {
	var s service.TagService
	t, err := s.GetTagByID(ctrl.Db, c)

	return Res(c, t, err)
}

// Create a tag
func (ctrl Controller) HandleCreateTag(c echo.Context) error {
	var s service.TagService
	t, err := s.CreateTag(ctrl.Db, c)

	return Res(c, t, err)
}

// Update a tag
func (ctrl Controller) HandleUpdateTag(c echo.Context) error {
	var s service.TagService
	t, err := s.UpdateTag(ctrl.Db, c)

	return Res(c, t, err)
}

// Delete a tag
func (ctrl Controller) HandleDeleteTag(c echo.Context) error {
	var s service.TagService
	err := s.DeleteTag(ctrl.Db, c)

	return ResForOneResponse(c, err)
}