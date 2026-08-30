# 1. lightweight base image
FROM node:18-alpine

# 2. set working directory
WORKDIR /app

# 3. copy only dependency files first (for caching)
COPY package*.json ./

# 4. install dependencies
RUN npm install

# 5. copy rest of the code
COPY . .

# 6. expose port
EXPOSE 5000

# 7. run app
CMD ["node", "server.js"]