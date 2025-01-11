package api

import (
	"TextVault/api/routes/account"
	"TextVault/api/routes/pastes"
	"TextVault/internal/config"
	"TextVault/internal/storage/postgres"
	"TextVault/internal/storage/s3"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"log/slog"

	_ "TextVault/docs"
)

type Router struct {
	app *fiber.App
	log *slog.Logger

	accountService *account.Router
	pasteService   *pastes.Router
}

//	@title			TextVault API
//
// @description	    API for TextVault service
//
//	@version		1.0 .
//
// @host		127.0.0.1:8080
func New(api config.APIConfig, postgres *postgres.Storage, S3 *s3.Storage, log *slog.Logger) *Router {
	app := fiber.New()
	app.Get("/swagger/*", swagger.HandlerDefault) // default

	app.Get("/swagger/*", swagger.New(swagger.Config{ // custom
		Title: api.Title,
		// Expand ("list") or Collapse ("none") tag groups by default
		DocExpansion: "none",
		// Prefill OAuth ClientId on Authorize popup
		OAuth: &swagger.OAuthConfig{
			AppName:  "Dev Keycloak",
			Realm:    "Dev",
			ClientId: "swag",
		},
		// Ability to change OAuth2 redirect uri location
		OAuth2RedirectUrl: "http://localhost:8080/swagger/oauth2-redirect.html",
	}))
	accountService := account.NewAccount(log)
	pasteService := pastes.NewPastes(log, postgres, S3)

	return &Router{
		app:            app,
		log:            log,
		accountService: accountService,
		pasteService:   pasteService,
	}
}

func (r *Router) setupAccountRoutes(app *fiber.App) {
	accountApi := app.Group("/account")
	accountApi.Get("/pastes", r.pasteService.GetUserPastes)
}

func (r *Router) setupPastesRoutes(app *fiber.App) {
	pasteApi := app.Group("/pastes")
	pasteApi.Post("/", r.pasteService.SavePaste)
	pasteApi.Get("/:pasteId", r.pasteService.GetPaste)
	pasteApi.Delete("/:pasteId", r.pasteService.DeletePaste)
}

func (r *Router) setupRoutes() {
	r.setupAccountRoutes(r.app)
	r.setupPastesRoutes(r.app)
}

func (r *Router) MustRun() {
	const prefix = "internal.router.MustRun"
	log := r.log.With(
		slog.String("op", prefix),
	)

	log.Info("Setting up routes")

	r.setupRoutes()

	log.Info("Starting router")
	if err := r.run(); err != nil {
		panic(err)
	}
}

func (r *Router) run() error {
	fmt.Println("Server started on port 8080")

	return r.app.Listen(":8080")
}
