export type IntentType = "registro" | "consulta";

export async function detectIntent(
  message: string
): Promise<IntentType> {
  const text = normalizarTexto(message);

  const registroScore = scoreRegistro(text);
  const consultaScore = scoreConsulta(text);

  console.log({
    text,
    registroScore,
    consultaScore,
  });

  return consultaScore > registroScore
    ? "consulta"
    : "registro";
}

function scoreRegistro(text: string): number {
  let score = 0;

  // Valor
  if (/\b\d+(?:[.,]\d{1,2})?\b/.test(text)) {
    score += 5;
  }

  // Forma de pagamento
  const pagamentos = [
    "pix",
    "credito",
    "crédito",
    "debito",
    "débito",
    "cartao",
    "cartão",
    "dinheiro"
  ];

  if (pagamentos.some(p => text.includes(p))) {
    score += 3;
  }

  // Categorias mais comuns
  const categorias = [
    "mercado",
    "farmacia",
    "farmácia",
    "gasolina",
    "combustivel",
    "combustível",
    "ifood",
    "restaurante",
    "lanche",
    "escola",
    "saude",
    "saúde"
  ];

  if (categorias.some(c => text.includes(c))) {
    score += 2;
  }

  return score;
}

function scoreConsulta(text: string): number {
  let score = 0;

  const keywords = [
    "quanto",
    "qual",
    "quais",
    "gastei",
    "gastou",
    "gastos",
    "listar",
    "lista",
    "mostrar",
    "mostra",
    "mostre",
    "ver",
    "saldo",
    "extrato",
    "resumo",
    "total",
    "media",
    "média",
    "ultimos",
    "últimos",
    "ultimas",
    "últimas",
    "teve",
    "tem"
  ];

  keywords.forEach(k => {
    if (text.includes(k)) {
      score += 2;
    }
  });

  if (text.includes("?")) {
    score += 2;
  }

  return score;
}

function normalizarTexto(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}