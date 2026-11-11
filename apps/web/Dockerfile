FROM node:22-alpine AS build
WORKDIR /repo
COPY package*.json ./
COPY apps/web/package.json apps/web/
RUN npm install -w apps/web --include=dev
COPY apps/web apps/web
WORKDIR /repo/apps/web
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
