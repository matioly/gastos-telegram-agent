import type { Transaction } from "./transaction";

export interface UpdateTransactionRequest {
    transaction: Transaction;
    currentQuestion: string;
    userAnswer: string;
}

export interface UpdateTransactionResponse {
    transaction: Transaction;
    missingFields: string[];
}