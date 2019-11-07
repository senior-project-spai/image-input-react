FROM tiangolo/node-frontend:10 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.15

COPY --from=builder /app/build/ /usr/share/nginx/html
COPY --from=builder /nginx.conf /etc/nginx/conf.d/default.conf


