# ==============================
# STAGE 1: Build the Vite Project
# ==============================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files separately for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Vite project
RUN npm run build

# ==============================
# STAGE 2: Serve with Nginx
# ==============================
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure the correct permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
