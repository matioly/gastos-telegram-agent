import dotenv from "dotenv";
dotenv.config();

import { UserRepository } from "../src/repositories/userRepository";

async function main() {

    const repository = new UserRepository();

    const user = await repository.findByTelegramChatId(123456);

    console.log(user);

}

main().catch(console.error);