FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
RUN npm install

COPY . .

# Build the app

ENV VITE_API_URL=http://localhost:5500

EXPOSE 3000

# Start Nginx
CMD ["npm", "run", "dev"]