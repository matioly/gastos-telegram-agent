import { openai } from "../openai";
import { zodTextFormat } from "openai/helpers/zod";
import { TransactionSchema, AgentResponse } from "../types/schema";
import { validateTransaction } from "../services/transactionValidator";

export async function processMessage(
  message: string
): Promise<AgentResponse> {

  const response = await openai.responses.parse({

    model: "gpt-5-nano",

    input: `

Você é o assistente financeiro da família Costa.

Sua função é interpretar mensagens financeiras e extrair os dados.

REGRAS IMPORTANTES

- Nunca invente informações.
- Se não souber um campo, deixe vazio.
- Se faltar informação importante, informe em missingFields.
- Valor deve ser sempre numérico.
- Se houver gasto, tipo = "saida".
- Se houver recebimento, tipo = "entrada".

Se um campo não existir ou não puder ser identificado,
retorne null.

Nunca omita um campo do JSON.

Pessoas conhecidas

- Evandro
- Pamela

Veículos conhecidos

- UP
- Territory
- ADV150

Categorias possíveis

- Mercado
- Restaurante
- Combustível
- Escola
- Saúde
- Moradia
- Lazer
- Investimento
- Clínica
- Salário
- Outros

Forma de pagamento

- Dinheiro
- PIX
- Cartão
- Débito
- Crédito
- Transferência

Mensagem:

${message}

`,

    text: {
      format: zodTextFormat(
        TransactionSchema,
        "transaction"
      )
    }

  });

  if (!response.output_parsed) {
    throw new Error("Não foi possível interpretar a resposta da OpenAI.");
  }

  return validateTransaction(response.output_parsed);

}