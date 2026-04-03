FROM node:20-alpine AS builder

WORKDIR /app

#installing the application dependencies
COPY package*.json ./
# RUN npm install
RUN npm ci --only=production

COPY . .

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

CMD ["node", "server.js"]