import {
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandUserOption,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("remind")
	.setDescription("Reminds you or someone else of something in the future.")
	.addStringOption(
		new SlashCommandStringOption()
			.setName("reminder")
			.setDescription("The reminder text.")
			.setRequired(true)
	)
	.addStringOption(
		new SlashCommandStringOption()
			.setName("when")
			.setDescription(
				`When should I send this reminder?` +
					`For example, you can say "tomorrow at 3pm" or "every 5 days".`
			)
			.setRequired(true)
	)
	.addUserOption(
		new SlashCommandUserOption()
			.setName("user")
			.setDescription("The user to remind.")
			.setRequired(false)
	)
	.setDefaultPermission(true);

export const execute = (interaction: CommandInteraction) => {
	interaction.reply({
		content: `Reminder set for "${interaction.options.getString(
			"reminder"
		)}"! Well, not really, but when this is implemented it will have done so. :P`,
		ephemeral: true,
	});
};
