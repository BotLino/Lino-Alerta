FROM node:8

WORKDIR /Lino-Alerta

COPY package*.json ./

RUN npm install

RUN npm install googleapis

COPY . .

EXPOSE 5003

CMD ["npm", "start"]
