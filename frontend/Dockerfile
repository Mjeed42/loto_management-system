# Multi-stage build for production optimization
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
# Use --legacy-peer-deps to resolve TypeScript version conflicts with i18n packages
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application with environment variables baked in
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]