# Use Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Install bash (optional, useful for dev)
RUN apk add --no-cache bash

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
