# TextVault

TextVault is a secure and convenient service for storing and sharing text snippets. It allows users to create, edit, and
share texts with options for setting expiration dates and password protection. The project is developed in Go and
utilizes modern technologies to ensure high performance and security.

## Preparing the environment

### Backend

1. Install swag

in the root directory of the project run:

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

### Frontend

in the root directory of the project run:

1. Install dependencies

```bash
npm i
```

2. Run the development server

```bash
npm run dev
```