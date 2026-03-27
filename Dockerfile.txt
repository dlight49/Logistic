# 1. Use a lightweight Node.js image
FROM node:20-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy only the compiled code and production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# 4. Copy the compiled backend from your 'dist' folder
COPY dist/ ./dist/

# 5. Copy the Prisma folder (needed for the client to talk to Neon)
COPY prisma/ ./prisma/
RUN npx prisma generate

# 6. Expose the port your Express app uses
EXPOSE 3000

# 7. Start the app
CMD ["node", "dist/index.js"]