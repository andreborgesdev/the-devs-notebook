FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy app source
COPY . .

# Build the Next.js application
RUN yarn build

# Expose port 
EXPOSE 3000

# Start command for Next.js production server
CMD ["yarn", "start"]