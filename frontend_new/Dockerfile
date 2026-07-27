FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
ENV BACKEND_URL=http://backend:3000
RUN npm run build

# Next.js defaults to port 3000, but we can set it to 3001 for clarity in Docker
ENV PORT 3001
EXPOSE 3001

CMD ["npm", "start"]
