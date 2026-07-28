import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";

import { processMessage } from "./ai/financeAgent";
import { formatTransaction } from "./utils/messageFormatter";
import { ConversationManager } from "./conversation/ConversationManager";

dotenv.config();

const conversationManager = new ConversationManager();

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

        // Existe uma conversa em andamento?
        if (conversationManager.has(chatId)) {

            const conversa = conversationManager.update(
                chatId,
                ctx.message.text
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

        // Primeira mensagem
        const resposta = await processMessage(ctx.message.text);

        console.log("Resposta IA:", resposta);

        if (resposta.missingFields.length > 0) {

            conversationManager.start(chatId, {
                transaction: resposta.transaction,
                missingFields: [...resposta.missingFields],
                awaitingConfirmation: false
            });

            await ctx.reply(
                formatTransaction(resposta)
            );

            await ctx.reply(
                conversationManager.nextQuestion(chatId)!
            );

            return;
        }

        await ctx.reply(
            formatTransaction(resposta)
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

    // Aqui futuramente salvaremos no Supabase
    console.log("SALVANDO:");
    console.log(conversa.transaction);

    conversationManager.finish(chatId);

    await ctx.editMessageReplyMarkup(undefined);

    await ctx.reply("✅ Lançamento salvo com sucesso!");

    await ctx.answerCbQuery();

});

bot.action("cancel_transaction", async (ctx) => {

    const chatId = ctx.chat!.id;

    conversationManager.finish(chatId);

    await ctx.editMessageReplyMarkup(undefined);

    await ctx.reply("❌ Lançamento cancelado.");

    await ctx.answerCbQuery();

});

bot.launch();

console.log("🤖 Bot iniciado");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));