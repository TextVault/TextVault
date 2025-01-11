package jwt

import (
	"github.com/golang-jwt/jwt/v5"
)

type ResourceAccess struct {
	Roles []string `json:"roles"`
}

type UserClaims struct {
	Email          string                    `json:"email"`
	Username       string                    `json:"preferred_username"`
	EmailVerified  bool                      `json:"email_verified"`
	FirstName      string                    `json:"given_name"`
	LastName       string                    `json:"family_name"`
	ResourceAccess map[string]ResourceAccess `json:"resource_access"`
	jwt.RegisteredClaims
	UserID string `json:"sub"`
}

func ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenString, UserClaims{}, func(token *jwt.Token) (interface{}, error) { return nil, nil })
}
