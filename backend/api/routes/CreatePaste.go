package routes

import (
	api "TextVault/api/gen"
	"TextVault/api/types"
	"TextVault/internal/storage/postgres"
	"TextVault/pkg/jwt"
	"TextVault/pkg/log/sl"
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

func (r *Router) PasteCreatePaste(ctx context.Context, req *api.PastePasteCreate) (*api.PastePaste, error) {
	const prefix = "internal.router.services.paste.CreatePaste"

	log := r.log.With(
		slog.String("op", prefix),
		slog.String("title", req.Title),
	)

	log.Info("Attempting to save paste")

	log.Debug("Paste content", slog.String("content", req.Content))

	var AuthorID pgtype.UUID
	user_raw := ctx.Value("user")
	if user_raw == nil {
	} else {
		user := user_raw.(*jwt.UserClaims)
		err := AuthorID.Scan(user.Subject)
		if err != nil {
			return nil, types.ValidationError{Field: "author_id", Message: err.Error()}
		}
		log.Info("User ID extracted from token", slog.String("user_id", user.Subject))
	}

	log.Info("Saving paste")
	var ID pgtype.UUID
	err := ID.Scan(uuid.New().String())
	paste, err := r.pasteGateway.SavePaste(ctx, postgres.SavePasteParams{
		ID:       ID,
		Title:    req.Title,
		Language: req.Language,
		AuthorID: AuthorID, // If token is not valid, AuthorID will be nil
	})
	if err != nil {
		log.Error("Failed to save paste", sl.Err(err))

		return nil, types.BadRequestError{Message: "Failed to save paste: " + err.Error()}
	}

	err = r.pasteS3Gateway.UploadPaste(ctx, paste.ID.String(), []byte(req.Content))
	if err != nil {
		log.Error("Failed to upload paste", sl.Err(err))

		return nil, types.BadRequestError{Message: "Failed to upload paste: " + err.Error()}
	}

	log.Info("Paste saved successfully", slog.String("id", paste.ID.String()))

	var authorID api.NilString
	if AuthorID.Valid {
		authorID.SetTo(AuthorID.String())
	}
	return &api.PastePaste{
		ID:        ID.String(),
		Title:     paste.Title,
		Language:  paste.Language,
		AuthorID:  authorID,
		Views:     0,
		CreatedAt: paste.CreatedAt.Time,
		UpdatedAt: paste.UpdatedAt.Time,
	}, nil
}
