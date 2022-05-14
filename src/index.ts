// ALWAYS keep this first
import "./configureEnv";

import { client } from "./client";
import { executeCommand } from "./commands";
import { deployCommands } from "./deployCommands";
import { debug } from "./logging/debug";

client.once("ready", (client) => {
	debug("Ready!");

	client.user.setActivity(/* Listening to */ "your brainwaves", {
		type: "LISTENING",
	});
});

client.on("messageCreate", async (message): Promise<void> => {
	console.log("message was created :P", message.content);

	// only read messages from the owner of the bot
	if (message.author.id !== process.env.DISCORD_OWNER_ID) return;

	if (message.content === ":refreshCommands") {
		const reply = message.reply("⏳ Refreshing commands...");

		try {
			await deployCommands();
		} catch (err) {
			(await reply).edit(
				"😵 Failed to refresh commands. Check console for details."
			);

			return;
		}

		(await reply).edit("✅ Refreshed commands!");
	}
});

client.on("interactionCreate", (interaction) => {
	if (interaction.isCommand()) {
		executeCommand(interaction.commandName, interaction);
	}
});

debug(`Logging into Discord...`);
client.login(process.env.DISCORD_TOKEN);
