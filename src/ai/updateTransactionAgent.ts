import { openai } from "../openai";
import { zodTextFormat } from "openai/helpers/zod";

import { TransactionSchema, AgentResponse } from "../types/schema";

export async function updateTransactionAgent(
    transaction: AgentResponse["transaction"],
    currentQuestion: string,
    userAnswer: string
): Promise<AgentResponse> {

    const response = await openai.responses.parse({

        model: "gpt-5-nano",

        input: `

Você é o assistente financeiro da família Costa.

Existe uma transação parcialmente preenchida.

Sua missão é ATUALIZAR essa transação.

NUNCA apague informações já existentes.

Complete qualquer campo que conseguir descobrir.

Se a resposta do usuário permitir preencher outros campos além da pergunta atual, preencha também.

Transação atual:

${JSON.stringify(transaction, null, 2)}

Pergunta feita:

${currentQuestion}

Resposta do usuário:

${userAnswer}

Retorne exatamente o mesmo JSON do schema.

`,

        text: {
            format: zodTextFormat(
                TransactionSchema,
                "transaction"
            )
        }

    });

    if (!response.output_parsed) {
        throw new Error("Não foi possível atualizar a transação.");
    }

    return response.output_parsed;

}