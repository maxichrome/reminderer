// ALWAYS keep this first
import "./configureEnv";

import { discord } from "./client";
import { executeCommand } from "./commands";
import { deployCommands } from "./deployCommands";
import { debug } from "./logging/debug";
import * as md5 from "md5";

discord.once("ready", (client) => {
	const easterEggChance = 1 / 10000;
	const isEasterEgg = Math.random() < easterEggChance;

	debug("Ready!");
	debug("Bot ID", client.user.id);

	console.info(
		`All ready! I'm ${
			isEasterEgg
				? `gongaga  (...ok, really, I'm ${client.user.tag})`
				: client.user.tag
		}`
	);

	client.user.setActivity(/* Listening to */ "your brainwaves", {
		type: "LISTENING",
	});
});

discord.on("messageCreate", async (message): Promise<void> => {
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

discord.on("interactionCreate", (interaction) => {
	if (interaction.isCommand()) {
		executeCommand(interaction.commandName, interaction);
	}
});

const token = process.env.DISCORD_TOKEN!;
debug(`Token (hashed md5): ${md5(token)}`);
debug(`Logging into gateway...`);
discord.login(token);
