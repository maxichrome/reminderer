import { Client as DiscordClient } from "discord.js";

const client = new DiscordClient({
	intents: ["DIRECT_MESSAGES"],
});
