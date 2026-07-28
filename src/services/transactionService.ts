import { UserRepository } from "../repositories/userRepository";
import { TransactionRepository } from "../repositories/transactionRepository";
import { Transaction } from "../types/transaction";

export class TransactionService {

    private userRepository = new UserRepository();
    private transactionRepository = new TransactionRepository();

    async save(chatId: number, transaction: Transaction) {

        const user = await this.userRepository.findByTelegramChatId(chatId);

        if (!user) {
            throw new Error(`Usuário com chat_id ${chatId} não encontrado.`);
        }

        const normalizedTransaction =
            this.normalizeTransaction(transaction);

        return this.transactionRepository.save(
            user.id,
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

        return date.toISOString().split("T")[0];

    }

}