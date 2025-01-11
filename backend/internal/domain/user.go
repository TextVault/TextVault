package domain

import "github.com/google/uuid"

type User struct {
	ID        uuid.UUID
	Username  string
	Email     string
	FirstName string
	LastName  string
	Groups    []string
}
