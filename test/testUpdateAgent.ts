import { updateTransactionAgent } from "../src/ai/updateTransactionAgent";
import { supabase } from "../src/services/supabase";
console.log("Supabase:", supabase);
async function main() {

    const resposta = await updateTransactionAgent({

        transaction: {

            tipo: "saida",
            pessoa: "",
            categoria: "Combustível",
            subcategoria: null,
            descricao: "Abastecimento",
            estabelecimento: null,
            valor: 100,
            formaPagamento: "PIX",
            veiculo: "Territory",
            data: null,
            observacoes: null

        },

        currentQuestion: "Quem pagou?",

        userAnswer: "Eu abasteci ontem no Posto Shell."

    });

    console.log(JSON.stringify(resposta, null, 2));

}

main();