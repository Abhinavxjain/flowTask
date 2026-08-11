# Base image — lightweight Node.js version
FROM node:20-alpine

# Working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Port the app listens on
EXPOSE 5000

# Command to run when container starts
CMD ["node", "server.js"]
