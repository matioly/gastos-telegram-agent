# 💰 Gastos Telegram Agent

> Assistente financeiro inteligente para Telegram utilizando OpenAI,
> Supabase e TypeScript.

------------------------------------------------------------------------

# Visão Geral

O **Gastos Telegram Agent** é um agente conversacional que registra
receitas e despesas através do Telegram.

O usuário envia uma mensagem em linguagem natural, a IA interpreta o
conteúdo, extrai os dados estruturados e grava a transação no Supabase.

Exemplo:

> "Abasteci o UP com R\$ 200 no posto Ipiranga no cartão"

↓

``` json
{
  "tipo":"saida",
  "categoria":"Combustível",
  "valor":200,
  "veiculo":"UP"
}
```

------------------------------------------------------------------------

# Arquitetura

``` text
Telegram
   │
   ▼
Telegraf Bot
   │
   ▼
OpenAI
(extração estruturada)
   │
   ▼
Validação
   │
   ▼
Supabase
```

------------------------------------------------------------------------

# Stack

-   Node.js
-   TypeScript
-   Telegraf
-   OpenAI SDK
-   Supabase
-   PM2
-   Oracle Cloud Always Free

------------------------------------------------------------------------

# Estrutura

``` text
src/
│
├── index.ts
├── openai.ts
├── services/
│     └── supabase.ts
├── prompts/
├── utils/
└── ...
```

------------------------------------------------------------------------

# Variáveis de ambiente

Crie um arquivo `.env`.

``` env
TELEGRAM_TOKEN=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Nunca envie esse arquivo ao GitHub.

------------------------------------------------------------------------

# Instalação Local

``` bash
git clone https://github.com/matioly/gastos-telegram-agent.git

cd gastos-telegram-agent

npm install
```

Inicie:

``` bash
npm start
```

------------------------------------------------------------------------

# Deploy Oracle Cloud

## VM

-   Oracle Linux 9
-   VM.Standard.E2.1.Micro

## Dependências

-   Git
-   Node.js
-   PM2

## Primeiro deploy

``` bash
git clone https://github.com/matioly/gastos-telegram-agent.git

cd gastos-telegram-agent

npm install
```

Criar `.env`

``` bash
npm start
```

Depois colocar em produção:

``` bash
pm2 start npm --name gastos-bot -- start

pm2 save

pm2 startup
```

Executar o comando sugerido pelo PM2 e novamente:

``` bash
pm2 save
```

------------------------------------------------------------------------

# Atualização

``` bash
cd ~/gastos-telegram-agent

git pull

npm install

pm2 restart gastos-bot
```

------------------------------------------------------------------------

# Comandos úteis

Status

``` bash
pm2 status
```

Logs

``` bash
pm2 logs gastos-bot
```

Reiniciar

``` bash
pm2 restart gastos-bot
```

Parar

``` bash
pm2 stop gastos-bot
```

Reboot servidor

``` bash
sudo reboot
```

------------------------------------------------------------------------

# Fluxo da IA

1.  Usuário envia mensagem.
2.  OpenAI interpreta.
3.  IA devolve JSON estruturado.
4.  Sistema valida campos obrigatórios.
5.  Caso falte informação, solicita complemento.
6.  Após confirmação, grava no Supabase.

------------------------------------------------------------------------

# Roadmap

## Curto prazo

-   Confirmação de transações
-   Melhorias de prompts
-   Categorias inteligentes

## Médio prazo

-   Parcelamentos
-   Transferências
-   Metas financeiras
-   Dashboard

## Longo prazo

-   Múltiplos usuários
-   Compartilhamento familiar
-   Relatórios mensais por IA
-   Integração bancária

------------------------------------------------------------------------

# Troubleshooting

## Bot não inicia

``` bash
pm2 logs gastos-bot
```

## Atualizar dependências

``` bash
npm install
```

## Reiniciar

``` bash
pm2 restart gastos-bot
```

## Verificar serviço

``` bash
systemctl status pm2-opc
```

------------------------------------------------------------------------

# Segurança

-   Nunca subir `.env`
-   Rotacionar chaves periodicamente
-   Restringir acesso SSH
-   Utilizar chave privada para acesso à VM

------------------------------------------------------------------------

# Licença

Projeto privado.
