#!/bin/sh -ex

# Run migrations against the mounted SQLite volume
npx prisma migrate deploy

# Start the application
npm run start
