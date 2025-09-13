# Use Node.js LTS
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only dependency files first
COPY package.json package-lock.json ./

# Install dependencies (omit dev deps)
RUN npm install --omit=dev

# Copy the rest of the app
COPY . .

# Build (if your app needs a build step like Next.js or TypeScript)
RUN npm run build || echo "no build step"

# --- Runtime image ---
FROM node:18-alpine

WORKDIR /app

# Copy production deps from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Expose port (update if your app uses a different one)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
