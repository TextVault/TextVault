package account

import (
	"log/slog"
)

type APIError struct {
	Error string `json:"error"`
}

type Router struct {
	log *slog.Logger
}

func NewAccount(log *slog.Logger) *Router {
	return &Router{
		log: log,
	}
}
