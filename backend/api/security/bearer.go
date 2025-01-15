package security

import (
	api "TextVault/api/gen"
	"TextVault/pkg/jwt"
	"context"
	"crypto/rsa"
	"log/slog"
)

type BearerAuthHandler struct {
	Log    *slog.Logger
	JWTKey *rsa.PublicKey
}

func (b BearerAuthHandler) HandleBearerAuth(ctx context.Context, operationName api.OperationName, t api.BearerAuth) (context.Context, error) {
	log := b.Log.With(
		slog.String("op", operationName),
	)
	log.Debug("Attempting to validate token")
	if t.Token == "undefined" {
		return ctx, nil
	}
	token, err := jwt.ValidateToken(t.Token, b.JWTKey)
	if err != nil {
		log.Error("Failed to validate token", slog.String("error", err.Error()))
		return nil, err
	}
	claims, ok := token.Claims.(*jwt.UserClaims)
	if !ok {
		log.Error("Failed to validate token", token.Claims)
		return nil, err
	}
	log.Info("User ID extracted from token", slog.String("user_id", claims.Subject))
	return context.WithValue(ctx, "user", claims), nil
}
