import dotenv from "dotenv";
dotenv.config();

console.log("SUPABASE_URL dentro do supabase.ts =", process.env.SUPABASE_URL);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error("SUPABASE_URL não encontrada.");
}

if (!supabaseKey) {
    throw new Error("SUPABASE_ANON_KEY não encontrada.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);