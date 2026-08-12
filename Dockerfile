# base node image
FROM node:26.7-bookworm-slim as base

ENV NODE_ENV production

# Install only runtime essentials in base (Prisma needs openssl)
RUN apt-get update && apt-get install -y \
    openssl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*


# 1. DEPS STAGE: Install build tools HERE ONLY to compile better-sqlite3
# N.b we may not need these installing once better-sqlite3 publishes a node 26 compatible binary
FROM base as deps

WORKDIR /myapp

# Install build tools temporarily
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

ADD package.json package-lock.json .npmrc ./
RUN npm install --include=dev

ADD prisma ./prisma
ADD prisma.config.ts ./
RUN DATABASE_URL="file:./data.db" npx prisma generate


# 2. PRODUCTION DEPS STAGE
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev


# 3. BUILD STAGE
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD prisma ./prisma
RUN npx prisma generate

ADD . .
RUN npm run build


# 4. FINAL RUNTIME STAGE
FROM base

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"

RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

# Copy the COMPILED node_modules over from production-deps
COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/generated/prisma /myapp/generated/prisma
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma

ENTRYPOINT [ "./start.sh" ]
