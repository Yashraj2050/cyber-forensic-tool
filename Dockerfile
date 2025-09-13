# -----------------------
# 1. Build Stage
# -----------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# -----------------------
# 2. Runtime Stage
# -----------------------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
