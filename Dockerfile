FROM mcr.microsoft.com/playwright:v1.50.1-noble

WORKDIR /app

# Instalar dependencias
COPY package*.json tsconfig.json ./
RUN npm ci && npx playwright install chromium

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript a JavaScript en dist/
RUN npm run build

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV CRON_SCHEDULE="0 6 * * *"
ENV TARGET_KEYWORD="MEDICO"

# Ejecutar el Autonomous Worker Daemon en segundo plano
CMD ["node", "dist/scheduler/autonomous_worker.js"]
