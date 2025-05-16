#!/bin/sh

# Wait for postgres to be ready
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Check if migrations exist
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations)" ]; then
  echo "No migrations found. Creating initial migration..."
  pnpm prisma migrate dev --name init --create-only
  pnpm prisma migrate deploy
else
  echo "Migrations found. Applying existing migrations..."
  pnpm prisma migrate deploy
fi 