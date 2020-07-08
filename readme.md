# **Travel Buddy**

```
Encontre a opção de conexão mais barata entre 2 aeroportos.
```
---

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

Geralmente para tratar erros, especialmente os HTTP 4xx, é "jogada" uma excessão que é tratada pelo middleware.
Como foi solicitado evitar o uso de frameworks e lib, os erros estão sendo retornados para a controller
e tratados nela, para exibição pela interface.

O script responsável pela interface CLI (index.ts) funciona como uma espécie de controller: recebe inputs
do usuário e retorna respostas. Por isso não foi criado um teste de unidade para ele.

## **Atenção:**
O arquivo de rotas (input-file.csv) deve ser colocado no diretório raiz da aplicação antes da execução de qualquer interface (CLI ou Rest).
Os comandos abaixo devem ser executados no diretório da aplicação.

### **Initial Setup**
```bash
$ npm install
```

### **CLI Interface**
Inserir o arquivo de rotas no diretório da aplicação.

```bash
$ node travelbuddy input-file.csv
```
