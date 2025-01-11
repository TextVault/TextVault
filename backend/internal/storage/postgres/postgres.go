package postgres

import (
	"TextVault/internal/config"
	"context"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Storage struct {
	conn    *pgxpool.Pool
	queries *Queries
	timeout time.Duration
}

func NewStorage(ctx context.Context, log *slog.Logger, cfg *config.PostgresConfig) (*Storage, error) {
	const timeout = 5 * time.Second

	log.Debug("Connecting to database")
	poolConfig, err := pgxpool.ParseConfig(cfg.DSN())
	if err != nil {
		return nil, err
	}

	conn, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, err
	}

	return &Storage{
		conn:    conn,
		queries: New(conn),
		timeout: timeout,
	}, nil
}

func (s *Storage) Close() {
	s.conn.Close()
}

func (s *Storage) Ping(ctx context.Context) error {
	return s.conn.Ping(ctx)
}
