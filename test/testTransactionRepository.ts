import dotenv from "dotenv";
dotenv.config();

import { TransactionRepository } from "../src/repositories/transactionRepository";

async function main() {

    const repository = new TransactionRepository();

    const transaction = await repository.save(
        "c9b64abc-70b5-40cc-809d-21d263d6fa6a", // id do Evandro
        {
            tipo: "saida",
            pessoa: "Evandro",
            categoria: "Combustível",
            subcategoria: null,
            descricao: "Abastecimento teste",
            estabelecimento: "Posto Shell",
            valor: 100,
            formaPagamento: "PIX",
            veiculo: "Territory",
            data: "2026-07-28",
            observacoes: null
        }
    );

    console.log(transaction);

}

main().catch(console.error);