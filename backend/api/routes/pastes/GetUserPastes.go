package pastes

import (
	"TextVault/api/middleware"
	"TextVault/api/types"
	"TextVault/internal/storage/postgres"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"log/slog"
)

// GetUserPastes
//
// @Tags Account
// @Accept json
// @Produce json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Security Bearer
// @Success 200 {object} []domain.Paste
// @Failure 401 {object} types.APIError "Unauthorized"
// @Failure 500 {object} types.APIError "Internal server error"
// @Router /account/pastes [get]
func (s *Router) GetUserPastes(c *fiber.Ctx) error {
	const prefix = "internal.router.services.account.GetUserPastes"

	limit, err := c.ParamsInt("limit")
	if err != nil {
		return err
	}
	offset, err := c.ParamsInt("offset")
	if err != nil {
		return err
	}
	user, err := middleware.ExtractUserFromToken(c)
	if err != nil {
		return types.HandleUnauthorizedResponse(c)
	}

	log := s.log.With(
		slog.String("op", prefix),
		slog.String("user_id", user.UserID),
	)

	log.Info("Attempting to get pastes by user")

	var userUUID pgtype.UUID
	err = userUUID.Scan(user.UserID)
	if err != nil {
		return types.HandleValidationError(c, err, log)
	}
	pastes, err := s.pasteGateway.GetUserPastes(c.Context(), postgres.GetUserPastesParams{AuthorID: userUUID,
		Limit: int32(limit), Offset: int32(offset)})
	if err != nil {
		return types.HandleInternalServerError(c, err, log)
	}

	s.log.Info("Successfully got pastes by user", slog.Int("count", len(pastes)), slog.String("user_id", user.UserID))

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"pastes": pastes,
	})
}
