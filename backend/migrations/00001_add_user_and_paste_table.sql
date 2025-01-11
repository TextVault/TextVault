-- +goose Up
CREATE
EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE pastes
(
    id        UUID PRIMARY KEY,
    title     VARCHAR(255) NOT NULL,
    language  VARCHAR(50)  NOT NULL,
    author_id UUID DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS pastes;