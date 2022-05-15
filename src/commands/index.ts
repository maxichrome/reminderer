import { CommandInteraction } from "discord.js";
import * as RemindCommand from "./remind";

export const commands = [RemindCommand];

export const executeCommand = async (
	commandName: string,
	interaction: CommandInteraction
): Promise<void> => {
	const command = commands.find((c) => c.data.name === commandName);

	if (!command)
		return void interaction.reply({
			content: `Command \`${commandName}\` not found.`,
			ephemeral: true,
		});

	return command.execute(interaction);
};

export type CommandExecutor = (
	interaction: CommandInteraction
) => Promise<void>;
