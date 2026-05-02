FROM node:18-alpine

WORKDIR /app

COPY nuxt-app/package*.json ./

RUN npm install

COPY nuxt-app/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]