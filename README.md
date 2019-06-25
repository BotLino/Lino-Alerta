# Lino-Alerta

<a href="https://codeclimate.com/github/BotLino/Lino-Alerta/maintainability"><img src="https://api.codeclimate.com/v1/badges/03f0594d67723cff5c1d/maintainability" /></a>

## Objetivo
Microsserviço feito com o objetivo de recuperar mensagens enviadas para o email do Lino e encaminhá-los para o Core (Lino Bot).

## Como funciona?
Ao ser feita uma requisição HTTP do tipo GET para o endpoint ```newAlert```, o microsserviço se encarrega de buscar a última mensagem do inbox, decodifica-la, verificar a autorização do usuário que a enviou e retornar um JSON para o Lino.
Também é possível cadastrar um novo usuário ou buscar por email um usuário cadastrado na base.

## Como utilizar?

## Ambiente de desenvolvimento

Para subir o ambiente de desenvolvimento, você deve ter o [docker](https://docs.docker.com/install/#supported-platforms) e o [docker-compose](https://docs.docker.com/compose/install/#install-compose) instalados.

Após a instalação de ambos, caso seja a primeira vez que o ambiente é usado ou quando realiza alguma alteração no arquivo ```Dockerfile```, execute:

``` sudo docker-compose -f docker-compose-dev.yml up --build ```

Caso contrário, após ter feito o build anteriormente, mas sem realizar alterações no ```Dockerfile```, use:

``` sudo docker-compose -f docker-compose-dev.yml up ```

Para acessar o container ou do Lino-Alerta ou de seu banco associado, execute:

```sudo docker exec -it <hash_do_container> bash```

O Ambiente está configurado para que a equipe que possua acesso as informações possa alocar o script para popular o banco do Lino-Alerta, além da inserir também o csv disponível com todas as informações dos professores. Caso queira subir o script, entre no container da forma citada anteriormente. Após isso, só executar o arquivo de script.

## Ambiente Local

###  Pré requisitos
Você precisa ter o *npm* e o Node.js instalados.

### Dependências
Dentro do diretório raiz:

* crie um arquivo chamado ```.env``` e inclua suas variáveis de ambiente (keys, paths etc) lá.

* na raiz, crie um diretório chamado ```resources``` e inclua seus arquivos de ```credentials.json``` e ```token.json```.

* execute: ```$ npm install --save```

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

| Saída          | Tipo           | Descrição             |
| :------------: | :------------: | :-------------------: |
| ```response``` | ``` string ``` | No new messages found |

```401```: quando a requisição é feita por um usuário não autenticado

| Saída          | Tipo           | Descrição |
| :------------: | :------------: | :-------: |
| ```response``` | ``` string ``` | Forbidden |

```401```: quando a requisição é feita por um usuário não autenticado

### ```/newUser```
Verbo: ```POST```

| Parâmetros de entrada | Tipo           | Descrição             |
| :-------------------: | :------------: | :-------------------: |
| ```name```            | ``` string ``` | Nome do novo remente  |
| ```email```           | ``` string ``` | Email do novo remente |

### ```/getUser```
Verbo: ```GET```

| Parâmetros de entrada na URL | Tipo           | Descrição        |
| :--------------------------: | :------------: | :--------------: |
| ```email```                  | ``` string ``` | Email do usuário |


Exemplo:

Parâmetro de entrada: ```user@email.com```

URL: localhost:3000/getUser?**email=user@email**.com


| Saída       | Tipo           | Descrição        |
| :---------: | :------------: | :--------------: |
| ```name```  | ``` string ``` | Nome do usuário  |
| ```email``` | ``` string ``` | Email do usuário |


## Executando testes

Na raiz do projeto, execute:

 ```$ node_modules/istanbul/lib/cli.js cover node_modules/mocha/bin/_mocha -- ./test/* --recursive --timeout 30000```

Após a execução, será gerado um *report* que poderá ser visualizado em ```coverage/lcov-report/index.html```
