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

func (r *Router) PasteGetUserPastes(ctx context.Context, params api.PasteGetUserPastesParams) (*api.PastePastes, error) {
	const prefix = "internal.router.services.account.GetUserPastes"

	user := ctx.Value("user").(*jwt.UserClaims)
	if user == nil {
		return nil, types.HandleUnauthorizedResponse()
	}

	log := r.log.With(
		slog.String("op", prefix),
		slog.String("user_id", user.UserID),
	)

	log.Info("Attempting to get pastes by user")

	var userUUID pgtype.UUID
	err := userUUID.Scan(user.UserID)
	if err != nil {
		return nil, types.HandleValidationError(err, log)
	}
	pastes, err := r.pasteGateway.GetUserPastes(ctx, postgres.GetUserPastesParams{AuthorID: userUUID,
		Limit: params.Limit, Offset: params.Offset})
	if err != nil {
		return nil, types.HandleInternalServerError(err, log)
	}

	r.log.Info("Successfully got pastes by user", slog.Int("count", len(pastes)), slog.String("user_id", user.UserID))

	pastesRes := make([]api.PastePaste, len(pastes))
	for i, paste := range pastes {
		var authorID api.NilString
		if !paste.AuthorID.Valid {
			authorID.SetTo(paste.AuthorID.String())
		}
		pastesRes[i] = api.PastePaste{
			ID:        paste.ID.String(),
			Title:     paste.Title,
			Language:  paste.Language,
			AuthorID:  authorID,
			Views:     0,
			CreatedAt: paste.CreatedAt.Time,
			UpdatedAt: paste.UpdatedAt.Time,
		}
	}
	return &api.PastePastes{Pastes: pastesRes}, nil
}
