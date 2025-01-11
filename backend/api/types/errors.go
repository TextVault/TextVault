package types

import (
	"TextVault/pkg/log/sl"
	"github.com/gofiber/fiber/v2"
	"log/slog"
)

type APIError struct {
	Error string `json:"error"`
}

func HandleValidationError(c *fiber.Ctx, err error, log *slog.Logger) error {
	log.Error("User error", sl.Err(err))
	return c.Status(fiber.StatusUnprocessableEntity).JSON(APIError{
		Error: "User error",
	})
}

func HandleBadRequestError(c *fiber.Ctx, err error, log *slog.Logger) error {
	log.Error("Bad request", sl.Err(err))
	return c.Status(fiber.StatusBadRequest).JSON(APIError{
		Error: "Bad request",
	})
}

func HandleInternalServerError(c *fiber.Ctx, err error, log *slog.Logger) error {
	log.Error("Internal server error", sl.Err(err))

	return c.Status(fiber.StatusInternalServerError).JSON(APIError{
		Error: "Internal server error",
	})
}

func HandleUnauthorizedResponse(c *fiber.Ctx) error {
	return c.Status(fiber.StatusUnauthorized).JSON(APIError{Error: "Unauthorized"})
}
