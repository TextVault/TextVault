package pastes

import (
	"TextVault/api/types"
	"TextVault/internal/domain"
	"TextVault/pkg/log/sl"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

// GetPaste
//
// @Tags Paste
// @Accept json
// @Produce json
// @Param pasteId path string true "Paste ID"
// @Security Bearer
// @Success 200 {object} domain.Paste
// @Failure 401 {object} types.APIError "Unauthorized"
// @Failure 404 {object} types.APIError "Paste not found"
// @Failure 500 {object} types.APIError "Internal server error"
// @Router /pastes/{pasteId} [get]
func (s *Router) GetPaste(c *fiber.Ctx) error {
	const prefix = "internal.router.services.paste.GetPaste"
	pasteID := c.Params("pasteId")

	log := s.log.With(
		slog.String("op", prefix),
		slog.String("hash", pasteID),
	)

	log.Info("Attempting to get paste")

	var pasteUUID pgtype.UUID
	err := pasteUUID.Scan(pasteID)
	if err != nil {
		return types.HandleInternalServerError(c, err, log)
	}
	paste, err := s.pasteGateway.GetPaste(c.Context(), pasteUUID)
	if err != nil {
		s.log.Warn("Failed to find paste")

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error_message": "paste not found",
			"status":        fiber.StatusNotFound,
		})
	}

	content, err := s.pasteS3Gateway.GetPasteContent(c.Context(), pasteID)
	if err != nil {
		log.Error("Failed to get paste content", sl.Err(err))

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error_message": "failed to get paste",
			"status":        fiber.StatusBadRequest,
		})
	}

	log.Info("Paste retrieved successfully", slog.String("id", paste.ID.String()))

	pasteResponse := domain.Paste{
		Title:    paste.Title,
		Language: paste.Language,
		Content:  string(content),
	}

	return c.Status(fiber.StatusOK).JSON(pasteResponse)
}
