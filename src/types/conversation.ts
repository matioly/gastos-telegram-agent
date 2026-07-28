import type { Transaction } from "./transaction";

export interface PendingConversation {

    transaction: Transaction;

    missingFields: string[];

    awaitingConfirmation: boolean;

}