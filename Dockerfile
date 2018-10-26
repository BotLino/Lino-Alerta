FROM node:8

COPY . /Lino-Alerta

WORKDIR /Lino-Alerta

RUN npm install && \
    npm install googleapis

EXPOSE 8080

CMD ["node", "api/controllers/alertController.js"]
