package router

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"

	"github.com/YutoSekiguchi/ppundo-plus/controller"
)

func InitRouter(db *gorm.DB) {
	e := echo.New()

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri={uri}, status=${status}\n",
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://vps7.nkmr.io", "https://ppundo.nkmr.io", "http://localhost:3000", "http://localhost:7170", "http://vps7.nkmr.io", "http://ppundo.nkmr.io"},
		AllowHeaders: []string{echo.HeaderAuthorization, echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	ctrl := controller.NewController(db)

	// User
	user := e.Group("/users")
	{
		user.GET("", ctrl.HandleGetAllUsers)
		user.GET("/me", ctrl.HandleGetUserByEmail)
		user.GET("/:id", ctrl.HandleGetUserByID)
		user.POST("", ctrl.HandleCreateUser)
		user.PUT("/:id", ctrl.HandleUpdateUser)
	}

	// NoteCollection
	noteCollection := e.Group("/note_collections")
	{
		noteCollection.GET("/:id", ctrl.HandleGetNoteCollectionByID)
		noteCollection.GET("/user/:user_id", ctrl.HandleGetNoteCollectionsByUserID)
		noteCollection.POST("", ctrl.HandleCreateNoteCollection)
		noteCollection.PUT("/:id", ctrl.HandleUpdateNoteCollection)
		noteCollection.DELETE("/:id", ctrl.HandleDeleteNoteCollectionByID)
	}

	// note
	note := e.Group("/notes")
	{
		note.GET("/:id", ctrl.HandleGetNoteByID)
		note.GET("/collection/:note_collection_id", ctrl.HandleGetNotesByNoteCollectionID)
		note.GET("/user/:user_id", ctrl.HandleGetNotesByUserID)
		note.POST("", ctrl.HandleCreateNote)
		note.PUT("/:id", ctrl.HandleUpdateNote)
		note.DELETE("/:id", ctrl.HandleDeleteNoteByID)
	}

	// Routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}