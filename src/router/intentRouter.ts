export type IntentType = "registro" | "consulta";

export async function detectIntent(
    message: string
): Promise<IntentType> {

    const text = message.toLowerCase().trim();

    const palavrasConsulta = [
        "quanto",
        "quantos",
        "qual",
        "quais",

        "gastei",
        "gastou",

        "listar",
        "lista",

        "mostrar",
        "mostre",

        "ver",

        "saldo",
        "extrato",
        "relatório",
        "resumo",

        "total",
        "média",
        "media",
        "maior",
        "menor"
    ];

    if (palavrasConsulta.some(p => text.includes(p))) {
        return "consulta";
    }

    return "registro";
}