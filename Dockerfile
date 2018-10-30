FROM node:8

COPY . /Lino-Alerta

WORKDIR /Lino-Alerta

RUN npm install && \
    npm install googleapis

EXPOSE 5014

CMD ["npm", "start"]
