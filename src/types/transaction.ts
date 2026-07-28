export interface Transaction {

    tipo: "entrada" | "saida";

    pessoa: string;

    categoria: string;

    subcategoria?: string;

    descricao: string;

    estabelecimento?: string;

    valor: number;

    formaPagamento?: string;

    veiculo?: string;

    data?: string;

    observacoes?: string;

}

export interface AgentResponse{

    success:boolean;

    missingFields:string[];

    transaction:Transaction;

}