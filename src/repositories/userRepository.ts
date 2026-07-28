import { supabase } from "../services/supabase";

export class UserRepository {

    async findByTelegramChatId(chatId: number) {

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("telegram_chat_id", chatId)
            .single();

        if (error) {
            return null;
        }

        return data;
    }

    async findById(id: string) {

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return null;
        }

        return data;
    }

}