package middleware

import (
	"TextVault/pkg/jwt"
	"errors"

	"github.com/gofiber/fiber/v2"
)

var (
	ErrMissingAuthorizationHeader = errors.New("missing authorization header")
	ErrInvalidAuthorizationFormat = errors.New("invalid authorization format")
)

func ExtractUserFromToken(c *fiber.Ctx) (*jwt.UserClaims, error) {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return nil, ErrMissingAuthorizationHeader
	}

	if len(authHeader) <= 7 || authHeader[:7] != "Bearer " {
		return nil, ErrInvalidAuthorizationFormat
	}

	tokenString := authHeader[7:]

	token, err := jwt.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	return token.Claims.(*jwt.UserClaims), nil
}
