import type { AgentResponse } from "../types/transaction";

export function formatTransaction(resposta: AgentResponse): string {
    const t = resposta.transaction;

    let texto = "✅ Entendi este lançamento\n\n";

    texto += `💰 Valor: R$ ${t.valor.toFixed(2)}\n`;
    texto += `📂 Categoria: ${t.categoria}\n`;

    if (t.estabelecimento)
        texto += `📍 Local: ${t.estabelecimento}\n`;

    if (t.veiculo)
        texto += `🚗 Veículo: ${t.veiculo}\n`;

    if (t.formaPagamento)
        texto += `💳 Pagamento: ${t.formaPagamento}\n`;

    texto += `👤 Pessoa: ${t.pessoa}\n`;

    if (resposta.missingFields.length > 0) {
        texto += "\nAinda preciso saber:\n";

        resposta.missingFields.forEach(campo => {
            texto += `• ${campo}\n`;
        });

        return texto;
    }

    texto += "\n✅ Tudo certo.\nDeseja salvar?";

    return texto;
}