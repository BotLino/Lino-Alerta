# Lino-Alerta
## Objetivo
Microsserviço feito com o objetivo de recuperar mensagens enviadas para o email do Lino e encaminhá-los para o Core (Lino Bot).

## Como funciona?
É feito um cronjob da partir do Lino para requisitar novas mensagens, a partir do endpoint ```newAlert```.

Ao ser feita essa requisição, o microsserviço se encarrega de buscar a última mensagem do inbox, decodifica-la, verificar a autorização do usuário que a enviou e retornar um JSON para o Lino.

## Endpoints
### ```newAlert```

Verbo : ```GET```

| Parâmetros de entrada | Descrição |
| :-------------------: | :-------: |
| Nenhum                |


| Saída         | Tipo           | Descrição          |
| :-----------: | :------------: | :----------------: |
| ```date```    | ``` string ``` | Data do envio      |
| ```name```    | ``` string ``` | Nome do remetente  |
| ```email```   | ``` string ``` | Email do remetente |
| ```subject``` | ``` string ``` | Assunto do email   |
| ```message``` | ``` string ``` | Mensagem           |



### ```newPost```
Verbo: ```POST```

| Parâmetros de entrada | Tipo           | Descrição            |
| :-------------------: | :------------: | :------------------: |
| ```name```            | ``` string ``` | Nome do novo remente |
| ```email```           | ``` string ``` | Nome do novo remente |
