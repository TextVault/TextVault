package pastes

import (
	"TextVault/api/middleware"
	"TextVault/api/types"
	"TextVault/internal/storage/postgres"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

// DeletePaste
//
// @Tags Paste
// @Accept json
// @Produce json
// @Param pasteId path string true "Paste ID"
// @Security Bearer
// @Success 200
// @Failure 401 {object} types.APIError "Unauthorized"
// @Failure 404 {object} types.APIError "Paste not found"
// @Failure 500 {object} types.APIError "Internal server error"
// @Router /pastes/{pasteId} [delete]
func (s *Router) DeletePaste(c *fiber.Ctx) error {
	const prefix = "internal.router.services.paste.DeletePaste"
	pasteID := c.Params("pasteId")

	claims, err := middleware.ExtractUserFromToken(c)
	if err != nil {
		return types.HandleUnauthorizedResponse(c)
	}

	log := s.log.With(
		slog.String("op", prefix),
		slog.String("pasteID", pasteID),
		slog.String("mail", claims.Email),
	)

	log.Info("Attempting to delete paste")

	// @NOTE: Delete paste from db
	var pasteUUID pgtype.UUID
	err = pasteUUID.Scan(pasteID)
	if err != nil {
		return types.HandleValidationError(c, err, log)
	}
	err = s.pasteGateway.DeletePaste(c.Context(), postgres.DeletePasteParams{ID: pasteUUID})
	if err != nil {
		return types.HandleBadRequestError(c, err, log)
	}

	// @NOTE: Delete paste from s3
	err = s.pasteS3Gateway.DeletePaste(c.Context(), pasteID)
	if err != nil {
		return types.HandleBadRequestError(c, err, log)
	}

	return c.SendStatus(fiber.StatusOK)
}
