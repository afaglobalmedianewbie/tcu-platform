FROM node:20-alpine
WORKDIR /app

# Required for Prisma on Alpine (Rule #4)
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and generate prisma client
COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
