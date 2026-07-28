import { queryAgent } from "./queryAgent";
import { executeQuery } from "./queryExecutor";

export async function queryService(message: string) {

    const intent = await queryAgent(message);

    console.log("Intent:", intent);

    const result = await executeQuery(intent);

    return result;
}