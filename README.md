# 💰 Gastos Telegram Agent

> Um agente financeiro inteligente via **Telegram + OpenAI + Supabase** capaz de registrar receitas e despesas utilizando linguagem natural.

## 📌 Visão Geral

O projeto permite registrar movimentações financeiras conversando com um bot do Telegram.

### Exemplos

```text
Abasteci R$120 no Shell
Recebi R$5000 de salário
Comprei um presente para Laura
```

## 🚀 Tecnologias

### Backend
-   Node.js + TypeScript
-   Telegraf
-   OpenAI SDK
-   Supabase
-   PM2
-   Oracle Cloud Always Free

### IA
- OpenAI Responses API
- GPT-5.5
- Structured Outputs
- JSON Schema

### Bot
- Telegram Bot API
- Telegraf

### Banco
- Supabase
- PostgreSQL

### Versionamento
- Git
- GitHub

## 🏗 Arquitetura

```text
Telegram
   │
   ▼
Telegraf
   │
   ▼
Conversation Manager
   │
   ▼
Finance Agent
   │
   ▼
Transaction Validator
   │
   ▼
Transaction Service
   │
   ├── UserRepository
   └── TransactionRepository
          │
          ▼
      Supabase
```

## 📁 Estrutura

```text
src/
 ├── ai/
 ├── conversation/
 ├── repositories/
 ├── services/
 ├── types/
 ├── utils/
 └── index.ts
```

## ✅ Funcionalidades Implementadas

- Bot do Telegram
- Integração com OpenAI
- Structured Outputs
- Extração automática de transações
- Atualização incremental da conversa
- Validação local dos dados
- Integração com Supabase
- Repositório de usuários
- Repositório de transações
- Testes individuais dos componentes

## 📦 Estrutura da Transaction

- tipo
- categoria
- subcategoria
- descricao
- estabelecimento
- valor
- formaPagamento
- veiculo
- data
- observacoes

## 🗄 Banco de Dados

### users
- id
- nome
- telegram_chat_id
- telegram_username
- role
- ativo

### transactions
- id
- user_id
- tipo
- categoria
- subcategoria
- descricao
- estabelecimento
- valor
- forma_pagamento
- veiculo
- data
- observacoes
- created_at
- updated_at

## ⚙️ Como executar

```bash
npm install
```

Criar `.env`:

```env
OPENAI_API_KEY=
TELEGRAM_TOKEN=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Executar:

## Desenvolvimento

``` bash
npm install
npm start
```

## Deploy

``` bash
pm2 start npm --name gastos-bot -- start
pm2 save
pm2 startup
```

## Atualização

``` bash
cd ~/gastos-telegram-agent
git pull
npm install
pm2 restart gastos-bot
```


## 🧪 Testes

```bash
npx tsx test/testSupabase.ts
npx tsx test/testTransactionRepository.ts
npx tsx test/testUpdateAgent.ts
```

## 🛣 Roadmap

### MVP
- [x] Telegram
- [x] OpenAI
- [x] Conversation Manager
- [x] Validator
- [x] Supabase

### Próximos passos
- [ ] TransactionService
- [ ] Salvar automaticamente no banco
- [ ] Identificação por chat_id
- [ ] Consulta de despesas
- [ ] Consulta de receitas
- [ ] Exclusão
- [ ] Edição

### Futuro
- Dashboard Web
- Aplicativo Mobile
- OCR de comprovantes
- OCR de notas fiscais
- Importação de extratos
- Cartões de crédito
- Parcelamentos
- Metas
- Investimentos
- Patrimônio
- Fluxo de caixa
- Assistente financeiro inteligente

## 💡 Filosofia

A IA interpreta linguagem natural.

Toda a regra de negócio permanece na aplicação, mantendo previsibilidade, facilidade de testes e independência do modelo.

## 📜 Licença

MIT
