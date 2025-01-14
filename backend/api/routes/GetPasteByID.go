package routes

import (
	api "TextVault/api/gen"
	"TextVault/api/types"
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

func (r *Router) PasteGetPasteByID(ctx context.Context, params api.PasteGetPasteByIDParams) (*api.PastePaste, error) {
	const prefix = "internal.router.services.paste.GetPaste"

	log := r.log.With(
		slog.String("op", prefix),
		slog.String("pasteID", params.ID),
	)

	log.Info("Attempting to get paste")

	var pasteUUID pgtype.UUID
	err := pasteUUID.Scan(params.ID)
	if err != nil {
		return nil, types.HandleInternalServerError(err, log)
	}
	paste, err := r.pasteGateway.GetPaste(ctx, pasteUUID)
	if err != nil {
		return nil, types.HandleNotFoundError(ctx, err, log)
	}

	content, err := r.pasteS3Gateway.GetPasteContent(ctx, params.ID)
	if err != nil {
		return nil, types.HandleBadRequestError(err, log)
	}

	log.Info("Paste retrieved successfully", slog.String("id", paste.ID.String()))

	var ID uuid.UUID
	err = ID.Scan(paste.ID.String())
	if err != nil {
		return nil, types.HandleInternalServerError(err, log)
	}
	return &api.PastePaste{
		ID:       ID.String(),
		Title:    paste.Title,
		Language: paste.Language,
		Content:  string(content),
	}, nil
}
