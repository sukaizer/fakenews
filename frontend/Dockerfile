FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# The build artifacts will now be in the /app/build directory
