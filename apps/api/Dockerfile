FROM node:22-alpine AS build
WORKDIR /repo
COPY package*.json ./
COPY apps/api/package.json apps/api/
RUN npm install -w apps/api --include=dev
COPY apps/api apps/api
WORKDIR /repo/apps/api
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /repo/apps/api/dist ./dist
COPY apps/api/package.json ./
RUN npm install --omit=dev
COPY apps/api/docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
USER app
EXPOSE 3001
CMD ["./entrypoint.sh"]
