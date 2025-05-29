FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install yarn
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# Build the Next.js application
RUN pnpm build

# Expose port 
EXPOSE 3000

# Start command for Next.js production server
CMD ["pnpm", "start"]