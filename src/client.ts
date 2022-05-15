import { Client as DiscordClient } from "discord.js";

export const discord = new DiscordClient({
	intents: ["GUILDS", "GUILD_MESSAGES"],
});
