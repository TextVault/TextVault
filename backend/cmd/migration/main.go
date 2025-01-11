package main

import (
	"TextVault/internal/config"
	"TextVault/pkg/log/sl"
	"context"
	"flag"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
	"log/slog"
	"os"
)

type Logger struct {
	*slog.Logger
}

func (l *Logger) Fatalf(format string, v ...interface{}) {
	l.Logger.Error(fmt.Sprintf(format, v...))
	os.Exit(1)
}

func (l *Logger) Printf(format string, v ...interface{}) {
	l.Logger.Info(fmt.Sprintf(format, v...))
}

func main() {
	up := flag.Bool("up", false, "Run migrations up")
	down := flag.Bool("down", false, "Run migrations down")
	cfg := config.MustLoad() // Already calls flag.Parse() internally
	log := sl.SetupLogger(cfg.Env)

	pool, err := pgxpool.New(context.Background(), cfg.Postgres.DSN())
	if err != nil {
		log.Error("Unable to connect to database", sl.Err(err))
		os.Exit(1)
	}
	defer pool.Close()

	db := stdlib.OpenDBFromPool(pool)
	if err := goose.SetDialect("postgres"); err != nil {
		log.Error("Failed to set dialect", sl.Err(err))
		os.Exit(1)
	}

	migrationsPath := "./migrations"
	goose.SetLogger(&Logger{log})
	if *up {
		if err := goose.Up(db, migrationsPath); err != nil {
			log.Error("Failed to run migrations", sl.Err(err))
			os.Exit(1)
		}
	}

	if *down {
		if err := goose.Down(db, migrationsPath); err != nil {
			log.Error("Failed to run migrations", sl.Err(err))
			os.Exit(1)
		}
	}

	log.Info("Migrations applied successfully")
}
