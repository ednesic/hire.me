# Url Shortener

Node + Redis Url shortener

Para rodar a aplicação será necessário o Redis.

$ brew install redis

Para rodar a aplicação será necessário uma versão de node que funcione com ES6.
Minha versão é a 6.3.1 e a recomendada atualemnte é a 6.9.5

Para rodar os testes

$ npm test

Para subir o servidor

$ node index.js

 ou

$ node cluster.js

Com o cluster, para cada núcleo de processamento da máquina, sobe um servidor slave e o master distribuirá as requisições.
Caso algum dos slaves caia, ele vai tentar subir este slave novamente.
Isso ajuda a resolver o problema do node de rodar com só uma thread

