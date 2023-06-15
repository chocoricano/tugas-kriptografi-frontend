# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx/ssl/nginx.crt /etc/nginx/ssl/nginx.crt
COPY nginx/ssl/nginx.key /etc/nginx/ssl/nginx.key
COPY nginx/ssl/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
