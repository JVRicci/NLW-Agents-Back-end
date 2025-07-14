Rodar container docker do projeto

```bash
    docker compose up -d
```

Para execução

```bash
    docker compose stop
```

# Libs da ORM a instalar 

```bash
    npm i drizzle-orm
    npm i drizzle-kit -D
    npm i drizzle-seed -D
```

# Comandos da ORM

Gerar migrations com base nos schemas criados

```bash
    npx drizzle-kit generate
```

Rodar efetivamente migrations

```bash
npx drizzle-kit migrate
```

Para ver o CLI do Drizzle

```bash
    npx drizzle-kit studio
```