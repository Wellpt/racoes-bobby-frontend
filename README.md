# Rações Bobby — Frontend

Interface web do MVP comercial da Rações Bobby. O projeto consome o contrato
da API do backend para autenticação por sessão, registro de vendas e consulta
dos resultados atuais da loja.

## Funcionalidades

- login e restauração de sessão por cookie `HttpOnly`;
- visão geral com totais do dia, da semana e do mês;
- registro de vendas com um ou mais itens;
- venda anônima ou com nome do cliente;
- itens vendidos por quilograma ou unidade;
- pagamento em dinheiro, Pix ou cartão;
- histórico do dia, da semana e do mês atual;
- busca local no histórico por cliente, item ou número da venda;
- layout responsivo para desktop, tablet e celular.

O MVP não possui cadastro de clientes ou produtos, estoque, descontos, edição
ou cancelamento de vendas porque essas operações não fazem parte do contrato
atual da API.

## Execução local

Requisitos: Node.js compatível com o Vite 8 e a API disponível na porta `8081`.

```bash
npm ci
npm run dev
```

Por padrão, o Vite encaminha chamadas feitas em `/api` para
`http://localhost:8081`. A aplicação fica disponível em
`http://localhost:5173`.

## Configuração

Copie `.env.example` para `.env.local` se precisar alterar a configuração:

```env
VITE_API_BASE_URL=/api
VITE_BASE_PATH=/
VITE_APP_NAME=Rações Bobby
VITE_APP_INITIALS=RB
```

- `VITE_API_BASE_URL`: URL pública da API ou o caminho do proxy local;
- `VITE_BASE_PATH`: caminho-base usado na publicação;
- `VITE_APP_NAME`: nome exibido na interface;
- `VITE_APP_INITIALS`: iniciais de fallback da marca.

Todas as chamadas usam `credentials: "include"`. Em acesso direto à API, o
endereço do frontend também deve estar presente em `FRONTEND_ORIGINS` no
backend.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # checagem TypeScript e bundle de produção
npm run lint     # análise estática
npm run preview  # prévia local do bundle
```
