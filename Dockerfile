FROM node:20-alpine

# Upgrade npm to version 9 to match lockfileVersion 3
RUN npm install -g npm@9

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Use --omit=dev instead of deprecated --only=production
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Build if needed
RUN npm run build

CMD ["npm", "start"]
