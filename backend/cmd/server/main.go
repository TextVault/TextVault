package main

import (
	"TextVault/api"
	"TextVault/internal/storage/postgres"
	"TextVault/internal/storage/s3"
	"TextVault/pkg/log/sl"
	"context"
	"log/slog"
	"os"

	"TextVault/internal/config"
)

func main() {
	cfg := config.MustLoad()
	log := sl.SetupLogger(cfg.Env)
	ctx := context.Background()

	s3Storage, err := s3.New(log, cfg.S3)
	if err != nil {
		log.Error("Failed to connect to s3 storage", sl.Err(err))
		os.Exit(1)
	}

	log.Info("Connected to s3 storage")

	if err := s3Storage.BucketExists(ctx); err != nil {
		log.Error("Failed to check s3 bucket", sl.Err(err))
		os.Exit(1)
	}

	storage, err := postgres.NewStorage(ctx, log, &cfg.Postgres)
	if err != nil {
		log.Error("Failed to connect to database", sl.Err(err))
		os.Exit(1)
	}

	if err := storage.Ping(ctx); err != nil {
		log.Error("Failed to check database connection", sl.Err(err))
		os.Exit(1)
	}

	log.Info("Connected to database")

	log.Info("Connected to redis")

	r := api.New(cfg.API, storage, s3Storage, log)

	log.Info("Starting server", slog.Any("config", cfg))
	r.MustRun()
}
