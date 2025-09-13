# ======================
# Stage 1: Builder
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

# Install bash (optional, useful for dev)
RUN apk add --no-cache bash

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod) for build
RUN npm ci

# Copy source code
COPY . .

# Build Next.js for production
RUN npm run build

# ======================
# Stage 2: Production
# ======================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy build output and necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

EXPOSE 3000

# Default command for production
CMD ["npm", "start"]
