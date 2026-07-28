import { z } from "zod";

const nullableString = z.string().nullable();

export const TransactionSchema = z.object({
  success: z.boolean(),

  confidence: z.number().min(0).max(1),

  missingFields: z.array(z.string()),

  transaction: z.object({
    tipo: z.enum(["entrada", "saida"]),

    pessoa: z.string(),

    categoria: z.string(),

    subcategoria: nullableString,

    descricao: z.string(),

    estabelecimento: nullableString,

    valor: z.number(),

    formaPagamento: nullableString,

    veiculo: nullableString,

    data: nullableString,

    observacoes: nullableString
  })
});

export type AgentResponse = z.infer<typeof TransactionSchema>;