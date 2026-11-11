FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:22-alpine
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
USER app
COPY apps/api/docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
EXPOSE 3001
CMD ["./entrypoint.sh"]
