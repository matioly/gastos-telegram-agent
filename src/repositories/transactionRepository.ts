import { supabase } from "../services/supabase";
import { Transaction } from "../types/transaction";

export class TransactionRepository {

    async save(userId: string, transaction: Transaction) {

        const { data, error } = await supabase
            .from("transactions")
            .insert({
                user_id: userId,
                tipo: transaction.tipo,
                categoria: transaction.categoria,
                subcategoria: transaction.subcategoria,
                descricao: transaction.descricao,
                estabelecimento: transaction.estabelecimento,
                valor: transaction.valor,
                forma_pagamento: transaction.formaPagamento,
                veiculo: transaction.veiculo,
                data: transaction.data,
                observacoes: transaction.observacoes
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

}