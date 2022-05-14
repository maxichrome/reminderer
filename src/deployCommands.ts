import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { commands } from "./commands";
import { client } from "./client";
import { debug } from "./logging/debug";

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

const commandList = commands.map((c) => c.data.toJSON());

export async function deployCommands() {
	try {
		const res = await rest.put(
			Routes.applicationCommands(client.application.id),
			{
				body: commandList,
			}
		);

		debug("Command redeploy API response:", res as string);
		console.info("[INF] Successfully registered application commands.");
	} catch (err) {
		console.error("[ERR] Failed to update commands:", err);
		throw err;
	}
}
