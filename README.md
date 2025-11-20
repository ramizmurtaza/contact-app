# Contact App (Express + TypeScript + Sequelize)

A structured Express application using TypeScript and Sequelize, with Sequelize CLI configured for migrations and seeders, plus Docker for local MySQL.

## Overview
- TypeScript runtime with ESM (`module: NodeNext`)
- Centralized model registration (`src/database/index.ts`)
- Sequelize CLI configured via `.sequelizerc` to use `src` directories
- Migrations/seeders are plain JavaScript (CommonJS) to work with the CLI
- Docker Compose to run MySQL locally using `.env` values

## Requirements
- Node.js 18+ (tested with Node 22)
- npm
- Docker Desktop (for local MySQL)

## Environment
- Environment files:
  - `.env.development`
  - `.env.uat`
  - `.env.production`
- The app and CLI select the file based on `NODE_ENV`.
- Example `.env.development`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=contact_app_dev
DB_USER=contact_user
DB_PASS=contact_pass
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=1d
```

## Project Structure
```
.
├─ src/
│  ├─ config/
│  │  ├─ package.json            # type: commonjs for CLI config
│  │  └─ sequelize.config.js     # Sequelize CLI environments
│  ├─ database/
│  │  ├─ database.ts             # Sequelize instance + connectDB()
│  │  ├─ index.ts                # registerModels(sequelize)
│  │  ├─ migrations/
│  │  │  ├─ package.json         # type: commonjs for migrations
│  │  │  └─ <timestamp>-*.js     # migration files (CommonJS)
│  │  └─ seeders/
│  │     ├─ package.json         # type: commonjs for seeders
│  │     └─ <timestamp>-*.js     # seeder files (CommonJS)
│  ├─ docs/
│  │  └─ swagger.ts              # Central OpenAPI spec (served at /docs)
│  ├─ modules/
│  │  └─ users/
│  │     ├─ user.model.ts        # User model + initUserModel()
│  │     ├─ user.service.ts      # User data access/business logic
│  │     ├─ user.controller.ts   # HTTP handlers
│  │     └─ user.routes.ts       # Express router
│  ├─ app.ts                     # App composition (middleware + routes)
│  ├─ index.ts                   # boots server via ESM import
│  └─ server.ts                  # DB connect + model registration + listen
├─ .sequelizerc                  # CLI paths for config/models/migrations/seeders
├─ docker-compose.yml            # MySQL service
├─ package.json                  # scripts for dev/build/migrations/seeders
├─ tsconfig.json                 # TypeScript config (NodeNext)
└─ .env                          # environment variables
```

## Development Scripts
- `dev`: `cross-env NODE_ENV=development nodemon --watch "src/**/*.ts" --exec "node --loader ts-node/esm" src/index.ts`
- `build`: `tsc`
- `start` / `production`: `cross-env NODE_ENV=production node dist/index.js`
- `uat:server`: `cross-env NODE_ENV=uat node dist/index.js`
- `start:staging`: `cross-env NODE_ENV=staging node dist/index.js`
- `test`: `jest` (install Jest to use)
- `lint`: `eslint src --ext .ts` (install ESLint to use)
- `format`: `prettier --write "src/**/*.ts"` (install Prettier to use)
- Swagger UI: visit `http://localhost:3000/docs`

## Sequelize CLI
`.sequelizerc` points the CLI to `src` folders:
```
config:        src/config/sequelize.config.js
migrations:    src/database/migrations
seeders:       src/database/seeders
```

### Migrations
- Generate: `npm run migration:generate -- create-users`
- Run all (dev): `npm run migration:run`
- Run all (uat): `npm run migration:run:uat`
- Run all (prod): `npm run migration:run:prod`
- Revert last: `npm run migration:revert`
- Revert all: `npm run migration:revert:all`
- Run to specific: `npm run migration:run:to -- <filename>.js`
- Revert to specific: `npm run migration:revert:to -- <filename>.js`

### Seeders
- Generate: `npm run seed:generate -- init-users`
- Run all (dev): `npm run seed:run`
- Run all (uat): `npm run seed:run:uat`
- Run all (prod): `npm run seed:run:prod`
- Undo last: `npm run seed:undo`
- Undo all: `npm run seed:undo:all`
- Run single: `npm run seed:run:one -- <filename>.js`
- Undo single: `npm run seed:undo:one -- <filename>.js`

## Docker (MySQL)
- Start DB: `docker compose up -d mysql`
- Check status: `docker compose ps`
- Logs: `docker compose logs -f mysql`
- Stop DB: `docker compose stop mysql`
- Remove DB: `docker compose rm -f mysql`

`docker-compose.yml` reads values from `.env` and uses defaults if empty:
- `MYSQL_DATABASE`: `${DB_NAME:-contact_app_dev}`
- `MYSQL_USER`: `${DB_USER:-contact_user}`
- `MYSQL_PASSWORD`: `${DB_PASS:-contact_pass}`
- `MYSQL_ROOT_PASSWORD`: `${DB_PASS:-contact_pass}`

## Model Registration Pattern
- Initialize models in one place:
  - `src/database/index.ts` imports module model initializers and calls them with the active `sequelize`
  - `src/server.ts` calls `registerModels(sequelize)` before `sequelize.sync({ alter: true })`
- Example:
```
// src/database/index.ts
import { initUserModel } from '../modules/users/user.model.js';
export const registerModels = (sequelize) => {
  const User = initUserModel(sequelize);
  return { User };
};
```

## Sequelize Sync
- `sequelize.sync({ alter: true })`: Alters existing tables to match your models without dropping them.
- `sequelize.sync({ force: true })`: Drops tables and recreates them; destructive and typically only for local development resets.
- When to use:
  - Development: `alter: true` is convenient for rapid iteration.
  - UAT/Production: prefer migrations to ensure reproducible, controlled schema changes; avoid `force` and consider disabling `alter`.
- In this project: sync is called after `registerModels(sequelize)` in `src/server.ts`, which lets model changes reflect to the DB during development.

## ESM vs CommonJS Notes
- App code uses ESM TypeScript (`module: NodeNext`), so relative imports require explicit `.js` extension in TS source.
- CLI files (config, migrations, seeders) are CommonJS `.js` by design:
  - Each folder has a `package.json` with `{ "type": "commonjs" }` so Node treats `.js` as CommonJS within those directories.

## Troubleshooting
- `ERR_UNKNOWN_FILE_EXTENSION .ts`: Use `node --loader ts-node/esm` for dev (`npm run dev` already configured).
- `SequelizeConnectionRefusedError`: Ensure Docker MySQL is running and `.env` credentials match. Try `docker compose logs -f mysql`.
- CLI `require()` errors for `.js`: Ensure the folder-scoped `package.json` files exist with `type: commonjs`.

## Typical Workflow
- `docker compose up -d mysql`
- `npm run dev` to start the app (works even if DB is down; sync is skipped)
- `npm run migration:generate -- create-<table>` and edit the generated file under `src/database/migrations`
- `npm run migration:run` to apply schema changes
- `npm run seed:generate -- init-<data>` then `npm run seed:run`