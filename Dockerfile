FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY scripts ./scripts
COPY assets ./assets
COPY *.html ./
RUN npm ci --silent || true
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
CMD ["npm", "run", "serve"]
