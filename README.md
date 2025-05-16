# Task Management Application

A full-stack task management application built with Next.js 14 and NestJS.

## Features

- User authentication (JWT-based)
- Task list management
- Task management within lists
- Modern UI with Tailwind CSS
- Real-time updates with React Query
- Secure RESTful API
- PostgreSQL database with Prisma ORM

## Project Structure

```
.
├── frontend/          # Next.js 14 frontend application
├── backend/           # NestJS backend application
└── docker             # Docker configuration files
```

## Prerequisites

- Node.js 18+
- Docker and Docker Compose

## Getting Started

### Development

1. Clone the repository:

```bash
git clone <repository-url>
cd libheros
```

2. Start the development environment:

```bash
docker-compose -f docker-compose.dev.yml up or pnpm dev
```

3. Access the applications:

- Frontend: http://localhost:3014
- Backend: http://localhost:4014

### Frontend

- Next.js 14
- React Query
- Tailwind CSS
- JWT Authentication
- TypeScript

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- TypeScript

