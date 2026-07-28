import { PendingConversation } from "../types/conversation";

export class ConversationManager {

    private conversations = new Map<number, PendingConversation>();

    private questions: Record<string, string> = {
        pessoa: "👤 Quem pagou?",
        estabelecimento: "📍 Onde foi?",
        data: "📅 Quando aconteceu?",
        observacoes: "📝 Alguma observação?",
        subcategoria: "📂 Qual a subcategoria?"
    };

    start(chatId: number, conversation: PendingConversation) {
        this.conversations.set(chatId, conversation);
    }

    has(chatId: number): boolean {
        return this.conversations.has(chatId);
    }

    get(chatId: number): PendingConversation | undefined {
        return this.conversations.get(chatId);
    }

    update(chatId: number, value: string): PendingConversation | undefined {

        const conversation = this.conversations.get(chatId);

        if (!conversation) {
            return undefined;
        }

        const field = conversation.missingFields.shift();

        if (!field) {
            return conversation;
        }

        (conversation.transaction as any)[field] = value;

        return conversation;
    }

    nextQuestion(chatId: number): string | null {

        const conversation = this.conversations.get(chatId);

        if (!conversation) {
            return null;
        }

        if (conversation.missingFields.length === 0) {
            return null;
        }

        const field = conversation.missingFields[0];

        return this.questions[field] ?? `Informe: ${field}`;
    }

    save(chatId: number, conversation: PendingConversation) {
        this.conversations.set(chatId, conversation);
    }

    setAwaitingConfirmation(chatId: number) {
        const conversation = this.conversations.get(chatId);

        if (!conversation) {
            return;
        }

        conversation.awaitingConfirmation = true;
    }

    isAwaitingConfirmation(chatId: number): boolean {
        const conversation = this.conversations.get(chatId);

        return conversation?.awaitingConfirmation ?? false;
    }

    finish(chatId: number) {
        this.conversations.delete(chatId);
    }

}