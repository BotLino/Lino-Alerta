# Lino-Alerta
## Objetivo
Microsserviço feito com o objetivo de recuperar mensagens enviadas para o email do Lino e encaminhá-los para o Core (Lino Bot).

## Como funciona?
Ao ser feita uma requisição HTTP do tipo GET para o endpoint ```newAlert```, o microsserviço se encarrega de buscar a última mensagem do inbox, decodifica-la, verificar a autorização do usuário que a enviou e retornar um JSON para o Lino.
Também é possível cadastrar um novo usuário ou buscar por email um usuário cadastrado na base.

## Como utilizar?

###  Pré requisitos
Você precisa ter o *npm* e o Node.js instalados.

### Dependências
Dentro do diretório raiz:

* crie um arquivo chamado ```.env``` e inclua suas variáveis de ambiente (keys, tokens etc) lá.

* execute: ```$ npm install```

* finalmente, para iniciar o servidor:  ```$ npm start```

O servidor estará ouvindo na porta  ```http:localhost:3000```

## Endpoints
### ```/newAlert```

Objetivo: verificar se existe uma nova mensagem.

Verbo: ```GET```

| Parâmetros de entrada | Descrição |
| :-------------------: | :-------: |
| Nenhum                |


```200```: quando a requisição é feita com sucesso

| Saída         | Tipo           | Descrição          |
| :-----------: | :------------: | :----------------: |
| ```date```    | ``` string ``` | Data do envio      |
| ```name```    | ``` string ``` | Nome do remetente  |
| ```email```   | ``` string ``` | Email do remetente |
| ```subject``` | ``` string ``` | Assunto do email   |
| ```message``` | ``` string ``` | Mensagem           |

```404```: quando não é encontrada uma mensagem nova

| Saída         | Tipo           | Descrição          |
| :-----------: | :------------: | :----------------: |
| ```response```    | ``` string ``` | No new messages found      |

```401```: quando a requisição é feita por um usuário não autenticado

| Saída         | Tipo           | Descrição          |
| :-----------: | :------------: | :----------------: |
| ```response```    | ``` string ``` | Forbidden      |


### ```/newUser```
Verbo: ```POST```

| Parâmetros de entrada | Tipo           | Descrição            |
| :-------------------: | :------------: | :------------------: |
| ```name```            | ``` string ``` | Nome do novo remente |
| ```email```           | ``` string ``` | Email do novo remente |

### ```/getUser```
Verbo: ```GET```

| Parâmetros de entrada | Tipo           | Descrição            |
| :-------------------: | :------------: | :------------------: |
| ```email```           | ``` string ``` | Email do usuário |


| Saída | Tipo           | Descrição            |
| :-------------------: | :------------: | :------------------: |
| ```name```            | ``` string ``` | Nome do usuário |
| ```email```           | ``` string ``` | Email do usuário |
