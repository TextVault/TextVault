package security

import (
	api "TextVault/api/gen"
	"TextVault/pkg/jwt"
	"context"
	"log/slog"
)

type BearerAuthHandler struct {
	Log *slog.Logger
}

func (b BearerAuthHandler) HandleBearerAuth(ctx context.Context, operationName api.OperationName, t api.BearerAuth) (context.Context, error) {
	log := b.Log.With(
		slog.String("op", operationName),
	)
	token, err := jwt.ValidateToken(t.Token)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*jwt.UserClaims)
	if !ok {
		return nil, err
	}
	log.Info("User ID extracted from token", slog.String("user_id", claims.UserID))
	return context.WithValue(ctx, "user", claims), nil
}
