FROM node:20-alpine

# 1. Install necessary library for Prisma/Node on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 2. Copy package files and install ALL dependencies
COPY package*.json ./
RUN npm install

# 3. Copy your entire project (including server.ts and prisma folder)
COPY . .

# 4. Generate the Prisma client for your Neon database
RUN npx prisma generate

# 5. Expose the port
EXPOSE 3000

# 6. Use 'npm start' which triggers 'tsx server.ts'
CMD ["npm", "start"]