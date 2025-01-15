package jwt

import (
	"crypto/rsa"
	"errors"
	"github.com/golang-jwt/jwt/v5"
)

type ResourceAccess struct {
	Roles []string `json:"roles"`
}

type UserClaims struct {
	//Email          string                    `json:"email"`
	//Username       string                    `json:"preferred_username"`
	//EmailVerified  bool                      `json:"email_verified"`
	//FirstName      string                    `json:"given_name"`
	//LastName       string                    `json:"family_name"`
	//ResourceAccess map[string]ResourceAccess `json:"resource_access"`
	jwt.RegisteredClaims
}

const (
	PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----\n"
	PUBLIC_KEY_FOOTER = "\n-----END PUBLIC KEY-----"
)

func ValidateToken(tokenString string, key *rsa.PublicKey) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return key, nil
	}, jwt.WithoutClaimsValidation())
	if err != nil || token == nil {
		return nil, err
	}
	switch {
	case token.Valid:
		return token, nil
	case errors.Is(err, jwt.ErrTokenMalformed):
		return nil, errors.New("not a token: " + err.Error())
	case errors.Is(err, jwt.ErrTokenSignatureInvalid):
		return nil, errors.New("invalid signature: " + err.Error())
	case errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenNotValidYet):
		return nil, errors.New("token expired: " + err.Error())
	default:
		return nil, errors.New("couldn't handle this token")
	}
}

func ValidatePublicKey(key string) (*rsa.PublicKey, error) {
	parsedKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(PUBLIC_KEY_HEADER + key + PUBLIC_KEY_FOOTER))
	if err != nil {
		return nil, err
	}
	return parsedKey, nil
}
