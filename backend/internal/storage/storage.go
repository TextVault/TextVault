package storage

import "errors"

var (
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrPasteNotFound      = errors.New("paste not found")
	ErrUserNotFound       = errors.New("user not found")
	ErrIncorrectPass      = errors.New("incorrect password")
	ErrUserDontHavePastes = errors.New("user dont have pastes")
)
