# Optimized and fix-all monorepo Dockerfile (Node 20)
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace=@meey/shared
RUN npm run build --workspace=@meey/api

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init

# Copy EVERYTHING from builder to ensure all links and modules are preserved
COPY --from=builder --chown=node:node /app ./

# Ensure uploads directory is writable (pre-creating it)
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

EXPOSE 3001
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/api/dist/main.js"]
