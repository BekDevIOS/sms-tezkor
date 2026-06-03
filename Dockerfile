# ---- Build stage: compile TypeScript -> dist ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage: prod deps only, non-root ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
# Run as the built-in unprivileged `node` user.
USER node
# Default command runs the API; the scheduler service overrides this in compose.
CMD ["node", "dist/main"]
