package routes

import (
	api "TextVault/api/gen"
	"TextVault/api/types"
	"TextVault/internal/storage/postgres"
	"TextVault/pkg/jwt"
	"context"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

func (r *Router) PasteDeletePaste(ctx context.Context, params api.PasteDeletePasteParams) error {
	const prefix = "internal.router.services.paste.DeletePaste"
	user := ctx.Value("user").(*jwt.UserClaims)
	if user == nil {
		return types.HandleUnauthorizedResponse()
	}

	log := r.log.With(
		slog.String("op", prefix),
		slog.String("pasteID", params.ID),
		slog.String("mail", user.Email),
	)

	log.Info("Attempting to delete paste")

	// @NOTE: Delete paste from db
	var pasteUUID pgtype.UUID
	err := pasteUUID.Scan(params.ID)
	if err != nil {
		return types.HandleValidationError(err, log)
	}
	err = r.pasteGateway.DeletePaste(ctx, postgres.DeletePasteParams{ID: pasteUUID})
	if err != nil {
		return types.HandleBadRequestError(err, log)
	}

	// @NOTE: Delete paste from s3
	err = r.pasteS3Gateway.DeletePaste(ctx, params.ID)
	if err != nil {
		return types.HandleBadRequestError(err, log)
	}

	log.Info("Paste deleted successfully")
	return nil
}
