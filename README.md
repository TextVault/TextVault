# TextVault
TextVault is a secure and convenient service for storing and sharing text snippets. It allows users to create, edit, and share texts with options for setting expiration dates and password protection. The project is developed in Go and utilizes modern technologies to ensure high performance and security.

## Preparing the environment

### Backend

1. Install swag
```bash
make swagger
```

2. Install sqlc
```bash
make sql-gen
```

3. Migrate
```bash
make migrate
```