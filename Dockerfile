FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod) for build
RUN npm ci

# Copy app source
COPY . .

# Build Next.js app
RUN npm run build

# Optional: remove devDependencies after build to reduce image size
RUN npm prune --production

# Start the app
CMD ["npm", "start"]
