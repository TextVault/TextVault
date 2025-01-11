package pastes

import (
	"TextVault/internal/storage/postgres"
	"context"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

type PasteGateway interface {
	GetUserPastes(ctx context.Context, params postgres.GetUserPastesParams) ([]postgres.Paste, error)
	UpdatePaste(ctx context.Context, paste postgres.UpdatePasteParams) error
	DeletePaste(ctx context.Context, params postgres.DeletePasteParams) error
	SavePaste(ctx context.Context, paste postgres.SavePasteParams) (*postgres.Paste, error)
	GetPaste(ctx context.Context, id pgtype.UUID) (postgres.Paste, error)
}

type PasteS3Gateway interface {
	UploadPaste(ctx context.Context, objectKey string, content []byte) error
	GetPasteContent(ctx context.Context, objectKey string) ([]byte, error)
	DeletePaste(ctx context.Context, objectKey string) error
}

type Router struct {
	pasteGateway   PasteGateway
	pasteS3Gateway PasteS3Gateway

	log *slog.Logger
}

func NewPastes(log *slog.Logger,
	pasteGateway PasteGateway,
	pasteS3Gateway PasteS3Gateway,
) *Router {
	return &Router{
		pasteGateway:   pasteGateway,
		pasteS3Gateway: pasteS3Gateway,
		log:            log,
	}
}
