import { supabase } from "../../services/supabase";
import { QueryIntent } from "./types";

export async function queryExecutor(intent: QueryIntent) {
    switch (intent.metrica) {
        case "sum":
            return executeSum(intent);

        case "count":
            return executeCount(intent);

        case "list":
            return executeList(intent);

        default:
            throw new Error(`Métrica não suportada: ${intent.metrica}`);
    }
}

function getPeriodRange(periodo: QueryIntent["periodo"]) {

    const today = new Date();

    // zerar horário
    today.setHours(0, 0, 0, 0);

    switch (periodo.tipo) {

        case "all":
            return null;

        case "today":
            return {
                start: today,
                end: today
            };

        case "yesterday": {

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            return {
                start: yesterday,
                end: yesterday
            };
        }

        case "current_week": {

            const start = new Date(today);

            // segunda-feira como início da semana
            const day = start.getDay(); // 0=domingo
            const diff = day === 0 ? 6 : day - 1;

            start.setDate(start.getDate() - diff);

            return {
                start,
                end: today
            };
        }

        case "last_week": {

            const end = new Date(today);

            const day = end.getDay();
            const diff = day === 0 ? 6 : day - 1;

            // domingo da semana passada
            end.setDate(end.getDate() - diff - 1);

            const start = new Date(end);
            start.setDate(end.getDate() - 6);

            return {
                start,
                end
            };
        }

        case "current_month":

            return {
                start: new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                ),
                end: today
            };

        case "last_month": {

            const start = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );

            const end = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

            return {
                start,
                end
            };
        }

        case "current_year":

            return {
                start: new Date(today.getFullYear(), 0, 1),
                end: today
            };

        case "last_year":

            return {

                start: new Date(
                    today.getFullYear() - 1,
                    0,
                    1
                ),

                end: new Date(
                    today.getFullYear() - 1,
                    11,
                    31
                )
            };

        case "relative": {

            const start = new Date(today);

            switch (periodo.unidade) {

                case "day":
                    start.setDate(start.getDate() - (periodo.valor ?? 0));
                    break;

                case "week":
                    start.setDate(start.getDate() - ((periodo.valor ?? 0) * 7));
                    break;

                case "month":
                    start.setMonth(start.getMonth() - (periodo.valor ?? 0));
                    break;

                case "year":
                    start.setFullYear(start.getFullYear() - (periodo.valor ?? 0));
                    break;
            }

            return {
                start,
                end: today
            };
        }

        case "custom":

            if (!periodo.inicio || !periodo.fim) {
                return null;
            }

            return {
                start: new Date(periodo.inicio),
                end: new Date(periodo.fim)
            };

        default:
            return null;
    }

}

function formatDate(date: Date): string {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

async function resolvePersonId(name: string): Promise<string | null> {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .ilike("nome", name)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data?.id ?? null;
}

async function executeSum(intent: QueryIntent) {
    const query = supabase
        .from("transactions")
        .select("valor");

    if (intent.filtros.categoria) {
        query.eq("categoria", intent.filtros.categoria);
    }

    if (intent.filtros.subcategoria) {
        query.ilike("subcategoria", intent.filtros.subcategoria);
    }

    if (intent.filtros.estabelecimento) {
        query.ilike("estabelecimento", intent.filtros.estabelecimento);
    }

    if (intent.filtros.formaPagamento) {
        query.ilike("forma_pagamento", intent.filtros.formaPagamento);
    }

    console.log("Agora:", new Date().toString());
    console.log("ISO:", new Date().toISOString());

    const range = getPeriodRange(intent.periodo);

    if (range) {
        query
            .gte("data", formatDate(range.start))
            .lte("data", formatDate(range.end));
    }

    if (intent.filtros.veiculo) {
        query.ilike("veiculo", intent.filtros.veiculo);
    }

    if (intent.filtros.pessoa) {
        const personId = await resolvePersonId(intent.filtros.pessoa);

        if (personId) {
            query.eq("person_id", personId);
        }
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    const total = (data ?? []).reduce(
        (sum, row) => sum + Number(row.valor),
        0
    );

    return {
        metrica: "sum",
        total
    };
}

async function executeCount(intent: QueryIntent) {
    console.log("COUNT", intent);

    return {
        metrica: "count",
        total: 0
    };
}

async function executeList(intent: QueryIntent) {

    let query = supabase
        .from("transactions")
        .select("*");

    // Categoria
    if (intent.filtros.categoria) {
        query = query.eq("categoria", intent.filtros.categoria);
    }

    // Subcategoria
    if (intent.filtros.subcategoria) {
        query = query.ilike("subcategoria", intent.filtros.subcategoria);
    }

    // Estabelecimento
    if (intent.filtros.estabelecimento) {
        query = query.ilike(
            "estabelecimento",
            intent.filtros.estabelecimento
        );
    }

    // Forma de pagamento
    if (intent.filtros.formaPagamento) {
        query = query.ilike(
            "forma_pagamento",
            intent.filtros.formaPagamento
        );
    }

    // Período
    const range = getPeriodRange(intent.periodo);

    if (range) {
        query = query
            .gte("data", formatDate(range.start))
            .lte("data", formatDate(range.end));
    }

    // Veículo
    if (intent.filtros.veiculo) {
        query = query.ilike("veiculo", intent.filtros.veiculo);
    }

    // Pessoa

    if (intent.filtros.pessoa) {

        const personId = await resolvePersonId(intent.filtros.pessoa);

        if (personId) {
            query = query.eq("person_id", personId);
        }
    }

    // Ordenação
    query = query.order("data", {
        ascending: false
    });

    // Limite
    if (intent.limite) {
        query = query.limit(intent.limite);
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return {
        metrica: "list",
        items: data ?? []
    };
}