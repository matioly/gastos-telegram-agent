export interface QueryIntent {

    metrica:
        | "sum"
        | "count"
        | "list"
        | "avg"
        | "max"
        | "min";

    filtros: {

        pessoa?: string;

        categoria?: string;

        subcategoria?: string;

        veiculo?: string;

        estabelecimento?: string;

        formaPagamento?: string;

    };

    periodo: {

        tipo:
            | "today"
            | "yesterday"

            | "current_week"
            | "last_week"

            | "current_month"
            | "last_month"

            | "current_year"
            | "last_year"

            | "all"
            | "relative"
            | "custom";

        unidade?:
            | "day"
            | "week"
            | "month"
            | "year";

        valor?: number;

        inicio?: string;

        fim?: string;

    };

    agruparPor?:
        | "categoria"
        | "pessoa"
        | "veiculo";

    limite?: number;

}