-- name: GetUserPastes :many
SELECT *
FROM Pastes
WHERE author_id = $1 LIMIT $2
OFFSET $3;

-- name: GetPaste :one
SELECT *
FROM Pastes
WHERE id = $1;

-- name: SavePaste :one
INSERT INTO Pastes (id, title, language, author_id)
VALUES ($1, $2, $3, $4) RETURNING *;

-- name: DeletePaste :execrows
DELETE
FROM Pastes
WHERE id = $1
  and author_id = $2;

-- name: UpdatePaste :one
UPDATE Pastes
SET title      = $2,
    language   = $3,
    updated_at = now()
WHERE id = $1
  and author_id = $4 RETURNING id;