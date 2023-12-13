# Dockerfile for production
# Build stage
FROM node:20.10 as builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the application's source code
COPY . .

# Build
RUN pnpm run build

# Production stage
FROM node:20.10

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the built files and the necessary dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
RUN pnpm install --production

# Start the production server
CMD ["pnpm", "start"]