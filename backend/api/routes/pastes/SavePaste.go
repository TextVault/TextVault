package pastes

import (
	"TextVault/api/middleware"
	"TextVault/api/types"
	"TextVault/internal/storage/postgres"
	"TextVault/pkg/log/sl"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

type SavePasteSchema struct {
	Title    string `json:"title" validate:"required" description:"Paste title" `
	Language string `json:"language" validate:"required" description:"Paste language" `
	Content  string `json:"content" validate:"required" description:"Paste content" `
}

// SavePaste
// @Tags Paste
// @Accept json
// @Produce json
// @Param paste body SavePasteSchema true "Paste body"
// @Security Bearer
// @Success 200 {object} domain.Paste
// @Failure 401 {object} types.APIError "Unauthorized"
// @Failure 400 {object} types.APIError "Bad request"
// @Failure 500 {object} types.APIError "Internal server error"
// @Router /pastes [post]
func (s *Router) SavePaste(c *fiber.Ctx) error {
	const prefix = "internal.router.services.paste.SavePaste"

	p := new(SavePasteSchema)
	if err := c.BodyParser(p); err != nil {
		s.log.Error("Failed to parse save request", sl.Err(err))

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error_message": "content is required",
			"status":        fiber.StatusBadRequest,
		})
	}
	log := s.log.With(
		slog.String("op", prefix),
		slog.String("title", p.Title),
	)

	log.Info("Attempting to save paste")

	log.Debug("Paste content", slog.String("content", p.Content))

	var AuthorID pgtype.UUID
	user, err := middleware.ExtractUserFromToken(c)
	if err == nil {
		err := AuthorID.Scan(user.UserID)
		if err != nil {
			return types.HandleValidationError(c, err, log)
		}
		log.Info("User ID extracted from token", slog.String("user_id", user.UserID))
	} else {
		log.Warn("Failed to extract user ID from token", sl.Err(err))
	}

	log.Info("Saving paste", slog.String("title", p.Title))

	paste, err := s.pasteGateway.SavePaste(c.Context(), postgres.SavePasteParams{
		Title:    p.Title,
		Language: p.Language,
		AuthorID: AuthorID, // If token is not valid, AuthorID will be nil
	})
	if err != nil {
		log.Error("Failed to save paste", sl.Err(err))

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error_message": "failed to save paste",
			"status":        fiber.StatusBadRequest,
		})
	}

	err = s.pasteS3Gateway.UploadPaste(c.Context(), paste.ID.String(), []byte(p.Content))
	if err != nil {
		log.Error("Failed to upload paste", sl.Err(err))

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error_message": "failed to upload paste",
			"status":        fiber.StatusBadRequest,
		})
	}

	log.Info("Paste saved successfully", slog.String("id", paste.ID.String()))

	return c.Status(fiber.StatusOK).JSON(paste)
}
