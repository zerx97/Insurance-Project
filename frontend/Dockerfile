# ---- Stage 1: build the static assets ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# ---- Stage 2: serve with nginx ----
# This IS the nginx reverse proxy from the tool list, in the role it actually plays here:
# serving the static React build efficiently, with a small config forwarding /api/*
# to the backend services in local docker-compose. In real AWS prod, CloudFront + S3
# usually replaces this entirely for a pure static SPA — nginx here is for local/simple
# container-based hosting.
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
