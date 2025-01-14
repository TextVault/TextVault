package api

import (
	api2 "TextVault/api/gen"
	"TextVault/api/routes"
	"TextVault/api/security"
	"TextVault/internal/config"
	"TextVault/internal/storage/postgres"
	"TextVault/internal/storage/s3"
	"fmt"
	"github.com/go-chi/cors"
	"log/slog"
	"net/http"
)

type Server struct {
	app http.Handler
	log *slog.Logger
}

func New(api config.APIConfig, postgres *postgres.Storage, s3 *s3.Storage, log *slog.Logger) *Server {

	srv, err := api2.NewServer(routes.NewRouter(log, postgres, s3), security.BearerAuthHandler{
		Log: log,
	})
	if err != nil {
		panic(err)
	}
	app := cors.Handler(
		cors.Options{
			AllowedOrigins:   api.CORSAllowed,
			AllowCredentials: true,
			AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		})(srv)

	return &Server{
		app: app,
		log: log,
	}
}

func (r *Server) MustRun() {
	const prefix = "internal.router.MustRun"
	log := r.log.With(
		slog.String("op", prefix),
	)

	log.Info("Starting router")
	if err := r.run(); err != nil {
		panic(err)
	}
}

func (r *Server) run() error {
	fmt.Println("Server started on port :8080")
	return http.ListenAndServe(":8080", r.app)
}
