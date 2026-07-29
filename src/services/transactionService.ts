import { UserRepository } from "../repositories/userRepository";
import { TransactionRepository } from "../repositories/transactionRepository";
import { Transaction } from "../types/transaction";

export class TransactionService {

    private userRepository = new UserRepository();
    private transactionRepository = new TransactionRepository();

    async save(chatId: number, transaction: Transaction) {

        // Dono da conta (Telegram)
        const owner = await this.userRepository.findByTelegramChatId(chatId);

        if (!owner) {
            throw new Error(`Usuário com chat_id ${chatId} não encontrado.`);
        }

        const normalizedTransaction =
            this.normalizeTransaction(transaction);

        // Por padrão, quem realizou a despesa é o próprio dono da conta
        let personId = owner.id;

        // Se a IA identificou outra pessoa (Pamela, por exemplo),
        // buscamos o ID correspondente na tabela users.
        if (normalizedTransaction.pessoa) {

            const person =
                await this.userRepository.findByName(
                    normalizedTransaction.pessoa
                );

            if (!person) {
                throw new Error(
                    `Pessoa '${normalizedTransaction.pessoa}' não encontrada.`
                );
            }

            personId = person.id;
        }

        console.log("================================");
        console.log("Pessoa recebida:", normalizedTransaction.pessoa);
        console.log("Owner:", owner.id);
        console.log("Person:", personId);
        console.log("================================");

        return this.transactionRepository.save(
            owner.id,
            personId,
            normalizedTransaction
        );
    }

    private normalizeTransaction(transaction: Transaction): Transaction {

        return {
            ...transaction,
            descricao: this.normalizeDescription(transaction),
            pessoa: this.normalizePerson(transaction.pessoa),
            formaPagamento: this.normalizePaymentMethod(transaction.formaPagamento),
            data: this.normalizeDate(transaction.data)
        };

    }

    private normalizeDate(data?: string): string | undefined {

        if (!data) {
            return undefined;
        }

        const hoje = new Date();

        switch (data.toLowerCase()) {

            case "hoje":
                return this.formatDate(hoje);

            case "ontem":
                hoje.setDate(hoje.getDate() - 1);
                return this.formatDate(hoje);

            case "anteontem":
                hoje.setDate(hoje.getDate() - 2);
                return this.formatDate(hoje);

            default:
                return data;

        }

    }

    private normalizeDescription(transaction: Transaction): string {

        if (transaction.descricao?.trim()) {
            return transaction.descricao.trim();
        }

        if (transaction.estabelecimento?.trim()) {
            return transaction.estabelecimento.trim();
        }

        return transaction.categoria;

    }

    private normalizePerson(pessoa?: string): string {

        if (!pessoa) {
            return "";
        }

        const nome = pessoa.trim().toLowerCase();

        switch (nome) {

            case "evandro":
                return "Evandro";

            case "pamela":
            case "pâmela":
                return "Pamela";

            default:
                return pessoa.trim();

        }

    }

    private normalizePaymentMethod(
        formaPagamento?: string
    ): string | undefined {

        if (!formaPagamento) {
            return undefined;
        }

        const pagamento = formaPagamento
            .trim()
            .toLowerCase();

        switch (pagamento) {

            case "pix":
                return "PIX";

            case "credito":
            case "crédito":
            case "cartao de credito":
            case "cartão de crédito":
            case "cartao crédito":
            case "cartão crédito":
                return "Cartão de Crédito";

            case "debito":
            case "débito":
            case "cartao de debito":
            case "cartão de débito":
            case "cartao débito":
            case "cartão débito":
                return "Cartão de Débito";

            case "dinheiro":
                return "Dinheiro";

            case "boleto":
                return "Boleto";

            case "transferencia":
            case "transferência":
                return "Transferência";

            default:
                return formaPagamento.trim();

        }

    }

    private formatDate(date: Date): string {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

}