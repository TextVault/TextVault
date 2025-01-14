package types

import (
	api "TextVault/api/gen"
	"TextVault/pkg/log/sl"
	"context"
	"log/slog"
)

type APIError struct {
	Error string `json:"error"`
}

func HandleValidationError(err error, log *slog.Logger) *api.ErrRespStatusCode {
	log.Error("User error", sl.Err(err))
	return &api.ErrRespStatusCode{
		StatusCode: 400,
		Response:   "User error",
	}
}

func HandleBadRequestError(err error, log *slog.Logger) *api.ErrRespStatusCode {
	log.Error("Bad request", sl.Err(err))
	return &api.ErrRespStatusCode{
		StatusCode: 400,
		Response:   "Bad request",
	}
}

func HandleInternalServerError(err error, log *slog.Logger) *api.ErrRespStatusCode {
	log.Error("Internal server error", sl.Err(err))

	return &api.ErrRespStatusCode{
		StatusCode: 500,
		Response:   "Internal server error",
	}
}

func HandleUnauthorizedResponse() *api.ErrRespStatusCode {
	return &api.ErrRespStatusCode{
		StatusCode: 401,
		Response:   "Unauthorized",
	}
}

func HandleNotFoundError(c context.Context, err error, log *slog.Logger) *api.ErrRespStatusCode {
	log.Error("Not found", sl.Err(err))
	return &api.ErrRespStatusCode{
		StatusCode: 404,
		Response:   "Not found",
	}
}
