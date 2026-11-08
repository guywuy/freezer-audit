#!/bin/sh -ex

# Run migrations against the mounted SQLite volume
# (call the Prisma CLI directly rather than via npx to shave time off cold starts)
node node_modules/prisma/build/index.js migrate deploy

# Start the application
npm run start
