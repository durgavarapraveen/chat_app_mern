FROM node:20-alpine AS builder

WORKDIR /app

#install app dependencies
COPY package*.json ./
RUN npm ci

COPY . .

#Build the React APP
RUN npm run build

#Production stage 
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]