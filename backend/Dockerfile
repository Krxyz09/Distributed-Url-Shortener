# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./
RUN npm install --production

# Copy the rest of your application code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]