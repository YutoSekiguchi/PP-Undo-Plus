FROM node:20:10

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the application's source code
COPY . .

# Start the development server
CMD ["pnpm", "run", "dev"]
