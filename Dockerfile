FROM node:22-alpine AS build
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci
COPY server ./server
RUN cd server && npm run build
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server/dist ./server/dist
COPY client/dist ./client/dist
EXPOSE 5000
CMD ["node", "server/dist/server.js"]
