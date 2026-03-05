# Note Saver

A full-stack e-commerce note-taking application built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- 📝 Create, read, update, and delete notes
- 🏷️ Categorize notes: Product, Supplier, Order, Inventory, Pricing, General
- 🚦 Priority levels: High, Medium, Low (color-coded)
- 🔍 Real-time search by title and content
- 🔖 Tag support for flexible organization
- 📱 Responsive design for all screen sizes
- 💾 SQLite database with TypeORM

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create the data directory
mkdir -p data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/notes.db` | Path to the SQLite database file |
| `NEXT_PUBLIC_APP_NAME` | `Note Saver` | Application display name |
| `PORT` | `3000` | Server port |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/notes` | List all notes (supports `?search=`, `?category=`, `?priority=`) |
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes/:id` | Get a note by ID |
| PUT | `/api/notes/:id` | Update a note by ID |
| DELETE | `/api/notes/:id` | Delete a note by ID |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite via better-sqlite3
- **ORM**: TypeORM
- **Styling**: Custom CSS (globals.css)
- **Deployment**: Docker / Coolify compatible
