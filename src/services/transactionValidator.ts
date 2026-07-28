import { AgentResponse } from "../types/schema";

export function validateTransaction(
    response: AgentResponse
): AgentResponse {

    const missingFields: string[] = [];

    const t = response.transaction;

    if (!t.pessoa?.trim()) {
        missingFields.push("pessoa");
    }

    if (!t.estabelecimento?.trim()) {
        missingFields.push("estabelecimento");
    }

    if (!t.data?.trim()) {
        missingFields.push("data");
    }

    return {
        ...response,
        success: missingFields.length === 0,
        missingFields
    };
}