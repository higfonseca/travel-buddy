# **Travel Buddy**

```
Encontre a opção de conexão mais barata para voar entre 2 aeroportos.
```
---

> ## Requirements
* Node v12.0


> ## Principles
* SOLID
* Small Commits
* Conventional Commits


> ## Design Patterns
* Clean Architecture
* Modular Design


> ## Toolings
* NPM
* Typescript
* Jest

---

## **Comentários Gerais:**

Por oferecer um desacoplamento maior entre componentes (controllers separados de regras de negócio, separadas dos repositórios), o design adotado foi o Clean Architecture.

Sobre o Typescript, acredito que não há muito o que explicar: códigos "type safe" são muito menos passivos de bugs. Por esse motivo foi a única lib que usei no projeto (fora o Jest).

Para encontrar a melhor rota entre os aeroportos recorri ao Algoritmo de Dijkstra, muito utilizado nos GPSs para sugestão de menor rota entre 2 endereços.

Como nossa persistência é feita em um arquivo CSV, interpretei que tudo que lidasse com os dados da planilha (busca, escrita) deveria ficar na camada de repositório. Por isso a classe FlightRepository possui métodos com find/map.

Geralmente para tratar erros, especialmente os HTTP 4xx, é "jogada" uma excessão que é tratada pelo middleware.
Como foi solicitado evitar o uso de frameworks e lib, os erros estão sendo retornados para a controller
e tratados nela, para exibição pela interface.

O script responsável pela interface CLI (index.ts) funciona como uma espécie de controller: recebe inputs
do usuário e retorna respostas. Por isso não foi criado um teste de unidade para ele.

---

## **ATENÇÃO:**
O arquivo de rotas (input-file.csv) deve ser colocado no diretório raiz do projeto antes da execução de qualquer interface (CLI ou Rest).

Os comandos abaixo devem ser executados no diretório raiz do projeto.


### **Initial Setup**
```shell
$ npm run build
```

### **CLI Interface**
```shell
$ npm run cli input-file.csv
```

### **Rest Interface**
```shell
$ npm run start:prod
```


### **Unit Tests**
Testes de Unidade
```shell
$ npm run test
```

Cobertura de testes
```shell
$ npm run test:coverage
```

---

## **API Endpoints:**


### **Healthcheck**
```
[GET] http://localhost:3000/healthcheck
```


### **Melhor Rota**
```
[GET] http://localhost:3000/routes/best?from=GRU&to=CDG
```


### **Adicionar Rota**
```
[POST] http://localhost:3000/routes/add
```

Headers
```
"Content-Type": "application/json"
```


Body
```json
{
  "from": "GRU",
  "to": "UDI",
  "cost": 5
}
```

---

## **Estrutura de Arquivos:**
```
app
 |-modules
   |-core
     |-helpers
     |-input
       |-controllers
     |-utils
   |-flight
     |-domain
       |-interfaces
     |-infra
       |-entities
       |-repositories
     |-input
       |-controllers
       |-requests
       |-responses
     |-usecases
node_modules
```
