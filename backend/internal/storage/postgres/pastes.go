package postgres

import (
	"TextVault/internal/storage"
	"context"
	"errors"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jackc/pgx/v5"
)

func (s *Storage) GetPaste(ctx context.Context, id pgtype.UUID) (Paste, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	paste, err := s.queries.GetPaste(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Paste{}, storage.ErrPasteNotFound
		}

		return Paste{}, err
	}

	return paste, nil
}

func (s *Storage) SavePaste(ctx context.Context, paste SavePasteParams) (*Paste, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	tx, err := s.conn.Begin(ctx)
	if err != nil {
		return nil, err
	}

	pasteResult, err := s.queries.WithTx(tx).SavePaste(ctx, paste)
	if err != nil {
		return nil, err
	}

	return &pasteResult, nil
}

func (s *Storage) DeletePaste(ctx context.Context, params DeletePasteParams) error {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	tx, err := s.conn.Begin(ctx)
	if err != nil {
		return err
	}
	deleted, err := s.queries.WithTx(tx).DeletePaste(ctx, params)
	if err != nil {
		return err
	}
	if deleted == 0 {
		return storage.ErrPasteNotFound
	}

	return nil
}

func (s *Storage) GetUserPastes(ctx context.Context, params GetUserPastesParams) ([]Paste, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	pastes, err := s.queries.GetUserPastes(ctx, params)

	if err != nil {
		return nil, err
	}

	return pastes, nil
}

func (s *Storage) UpdatePaste(ctx context.Context, paste UpdatePasteParams) error {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	_, err := s.queries.UpdatePaste(ctx, paste)

	if err != nil {
		return err
	}

	return nil
}
