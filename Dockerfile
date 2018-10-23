FROM node:8

RUN apt-get -y upgrade && \
    apt-get -y update && \
    apt-get -y install python3 && \
    apt-get -y install python3-pip && \
    pip3 install pymongo

RUN npm install && \
    npm install googleapis

COPY package*.json ./

COPY . /Lino-Alerta

WORKDIR /Lino-Alerta

EXPOSE 5003

CMD ["npm", "start"]
