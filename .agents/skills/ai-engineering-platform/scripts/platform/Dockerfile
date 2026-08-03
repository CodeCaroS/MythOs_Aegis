FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY policy.json ./policy.json
EXPOSE 8797
CMD ["node", "src/cli.mjs", "serve"]
