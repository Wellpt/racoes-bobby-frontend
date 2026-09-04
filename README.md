# Starter Kit - Frontend

Base React reutilizavel para sistemas comerciais pequenos e medios.

O projeto inclui:

- login e restauracao de sessao;
- rotas autenticadas;
- layout responsivo com menu lateral;
- cliente HTTP centralizado;
- configuracao para GitHub Pages.

Nao existem regras de clientes, ordens, vendas, estoque ou financeiro. Esses modulos devem ser adicionados pelo projeto derivado.

O Starter Kit nao define perfis nem permissoes. Cada projeto derivado adiciona essas regras apenas se precisar delas.

## Execucao local

```bash
npm install
npm run dev
```

O Vite encaminha `/api` para `http://localhost:8080` durante o desenvolvimento.

## Configuracao

Copie `.env.example` para `.env.local` quando precisar alterar os valores locais:

- `VITE_API_BASE_URL`: URL da API.
- `VITE_BASE_PATH`: caminho-base da publicacao.
- `VITE_APP_NAME`: nome exibido no sistema.
- `VITE_APP_INITIALS`: iniciais exibidas na marca.

Para o GitHub Pages, configure `VITE_API_BASE_URL` em **Settings > Secrets and variables > Actions > Variables**. As demais variaveis sao opcionais.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
