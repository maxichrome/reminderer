import { Client as DiscordClient } from "discord.js";

export const client = new DiscordClient({
	intents: ["GUILDS", "GUILD_MESSAGES"],
});
