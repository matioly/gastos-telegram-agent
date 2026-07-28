import { queryAgent } from "./agents/query/queryAgent";
import { queryExecutor } from "./agents/query/queryExecutor";

import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";

import { TransactionService } from "./services/transactionService";
import { processMessage } from "./ai/financeAgent";

import { formatQueryResult } from "./utils/queryFormatter";
import { formatTransaction } from "./utils/messageFormatter";
import { ConversationManager } from "./conversation/ConversationManager";
import { detectIntent } from "./router/intentRouter";

console.log("detectIntent =", detectIntent);

dotenv.config();

const conversationManager = new ConversationManager();
const transactionService = new TransactionService();

const token = process.env.TELEGRAM_TOKEN;

if (!token) {
    throw new Error("TELEGRAM_TOKEN não encontrado");
}

const bot = new Telegraf(token);

bot.start(async (ctx) => {
    await ctx.reply(`👋 Olá!

Sou o assistente financeiro da família.

Pode enviar algo como:

• Mercado 120
• Abasteci 150 no UP
• Recebi 5000 da clínica`);
});

bot.on("text", async (ctx) => {

    try {

        const chatId = ctx.chat.id;
        const message = ctx.message.text;

        /**
         * ====================================================
         * 1 - EXISTE UMA CONVERSA EM ANDAMENTO?
         * ====================================================
         */
        if (conversationManager.has(chatId)) {

            const conversa = conversationManager.update(
                chatId,
                message
            );

            if (!conversa) {
                return;
            }

            // Ainda existem perguntas
            if (conversa.missingFields.length > 0) {

                await ctx.reply(
                    conversationManager.nextQuestion(chatId)!
                );

                return;
            }

            // Todas respondidas
            conversationManager.setAwaitingConfirmation(chatId);

            await ctx.reply(
                formatTransaction({
                    success: true,
                    missingFields: [],
                    transaction: conversa.transaction
                }),
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback(
                            "✅ Salvar",
                            "save_transaction"
                        ),
                        Markup.button.callback(
                            "❌ Cancelar",
                            "cancel_transaction"
                        )
                    ]
                ])
            );

            return;
        }

        /**
         * ====================================================
         * 2 - DESCOBRIR A INTENÇÃO DA MENSAGEM
         * ====================================================
         */
        const intent = await detectIntent(message);

        switch (intent) {

            case "consulta": {

                const intent = await queryAgent(message);

                console.log("=================================");
                console.log("QUERY INTENT");
                console.log(JSON.stringify(intent, null, 2));
                console.log("=================================");

                const result = await queryExecutor(intent);

                console.log("=================================");
                console.log("QUERY RESULT");
                console.log(JSON.stringify(result, null, 2));
                console.log("=================================");

                const text = formatQueryResult(result);

                await ctx.reply(text);

                return;
            }

            case "registro":
                break;

            default:

                await ctx.reply(
                    "Não consegui entender sua mensagem."
                );

                return;
        }

        /**
         * ====================================================
         * 3 - PROCESSAR NOVO LANÇAMENTO
         * ====================================================
         */

        const resposta = await processMessage(message);

        console.log("Resposta IA:", resposta);

        conversationManager.start(chatId, {
            transaction: resposta.transaction,
            missingFields: [...resposta.missingFields],
            awaitingConfirmation: false
        });

        if (resposta.missingFields.length > 0) {

            await ctx.reply(
                formatTransaction(resposta)
            );

            await ctx.reply(
                conversationManager.nextQuestion(chatId)!
            );

            return;
        }

        conversationManager.setAwaitingConfirmation(chatId);

        await ctx.reply(
            formatTransaction({
                success: true,
                missingFields: [],
                transaction: resposta.transaction
            }),
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "✅ Salvar",
                        "save_transaction"
                    ),
                    Markup.button.callback(
                        "❌ Cancelar",
                        "cancel_transaction"
                    )
                ]
            ])
        );

    } catch (err) {

        console.error(err);

        await ctx.reply(
            "😕 Não consegui entender essa mensagem."
        );

    }

});

bot.action("save_transaction", async (ctx) => {

    const chatId = ctx.chat!.id;

    const conversa = conversationManager.get(chatId);

    if (!conversa) {

        await ctx.answerCbQuery("Conversa não encontrada.");

        return;
    }

    try {

        await transactionService.save(
            chatId,
            conversa.transaction
        );

        conversationManager.finish(chatId);

        await ctx.editMessageReplyMarkup(undefined);

        await ctx.reply(
            "✅ Lançamento salvo com sucesso!"
        );

    } catch (error) {

        console.error(error);

        await ctx.reply(
            "❌ Erro ao salvar o lançamento."
        );
    }

    await ctx.answerCbQuery();

});

bot.action("cancel_transaction", async (ctx) => {

    const chatId = ctx.chat!.id;

    conversationManager.finish(chatId);

    await ctx.editMessageReplyMarkup(undefined);

    await ctx.reply(
        "❌ Lançamento cancelado."
    );

    await ctx.answerCbQuery();

});

bot.launch();

console.log("🤖 Bot iniciado");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));