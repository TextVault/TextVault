package main

import (
	"TextVault/internal/config"
	"TextVault/pkg/log/sl"
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
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

	if *up && *down {
		panic("cannot run both --up and --down migrations")
	}

	pool, err := pgxpool.New(context.Background(), cfg.Postgres.DSN())
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}
	defer pool.Close()

	db := stdlib.OpenDBFromPool(pool)
	if err := goose.SetDialect("postgres"); err != nil {
		panic("failed to set dialect: " + err.Error())
	}

	migrationsPath := "./migrations"
	goose.SetLogger(&Logger{log})

	var migrateErr error
	switch {
	case *up:
		migrateErr = goose.Up(db, migrationsPath)
	case *down:
		migrateErr = goose.Down(db, migrationsPath)
	}

	if migrateErr != nil {
		log.Error("Migration failed: %v", sl.Err(migrateErr))
	}

	log.Info("Migrations applied successfully")
}
