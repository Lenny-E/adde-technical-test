FROM node:18
WORKDIR /app
COPY api/package*.json ./api/
RUN cd api && npm install
COPY api ./api
WORKDIR /app/api
RUN npx nx build api
EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]
