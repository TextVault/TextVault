package types

type APIError struct {
	Error string `json:"error"`
}
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func NewValidationError(field string, message string) ValidationError {
	return ValidationError{Field: field, Message: message}
}

func (e ValidationError) Error() string {
	return "Validation error: " + e.Message + " in field " + e.Field
}

type InternalServerError struct {
	Message string `json:"message"`
}

func NewInternalServerError(message string) InternalServerError {
	return InternalServerError{Message: message}
}

func (e InternalServerError) Error() string { return "Internal server error: " + e.Message }

type BadRequestError struct {
	Message string `json:"message"`
}

func NewBadRequestError(message string) BadRequestError {
	return BadRequestError{Message: message}
}

func (e BadRequestError) Error() string { return "Bad request: " + e.Message }

type UnauthorizedError struct {
	Message *string `json:"message"`
}

func NewUnauthorizedError(message *string) UnauthorizedError {
	return UnauthorizedError{Message: message}
}

func (e UnauthorizedError) Error() string { return "Unauthorized: " + *e.Message }

type NotFoundError struct {
	Message string `json:"message"`
}

func NewNotFoundError(message string) NotFoundError {
	return NotFoundError{Message: message}
}
func (e NotFoundError) Error() string { return "Not found: " + e.Message }
