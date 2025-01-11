package domain

import "github.com/google/uuid"

type Paste struct {
	ID       uuid.UUID  `json:"id"`
	Title    string     `json:"title"`
	Language string     `json:"language"`
	Content  string     `json:"content"` // Позже это уедет в BFF и вообще не будет существовать в домене
	AuthorID *uuid.UUID `json:"authorID"`
}
