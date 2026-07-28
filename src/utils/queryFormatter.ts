export function formatQueryResult(result: any): string {

    switch (result.metrica) {

        case "sum":
            return `💰 Total: R$ ${Number(result.total).toFixed(2)}`;

        case "list":

            if (!result.items?.length) {
                return "Nenhum lançamento encontrado.";
            }

            return result.items
                .map((item: any) => {

                    const linhas = [
                        `📅 ${item.data}`,
                        `📂 ${item.categoria}`,
                        item.estabelecimento && `🏪 ${item.estabelecimento}`,
                        item.veiculo && `🚗 ${item.veiculo}`,
                        `💰 R$ ${Number(item.valor).toFixed(2)}`
                    ];

                    return linhas
                        .filter(Boolean)
                        .join("\n");

                })
                .join("\n\n");

        default:
            return JSON.stringify(result, null, 2);
    }

}