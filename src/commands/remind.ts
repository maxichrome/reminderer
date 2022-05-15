import {
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandUserOption,
} from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { exec } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";
import RRule from "rrule";
import type { CommandExecutor } from ".";
import { setReminder } from "../reminders";
import { formatDate } from "../utils/formatDate";

const execAsync = promisify(exec);

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

// TODO: modularize this
export const execute: CommandExecutor = async (
	interaction: CommandInteraction
): Promise<void> => {
	const content = interaction.options.getString("reminder", true);
	const timeInput = interaction.options.getString("when", true);
	const user = interaction.options.getUser("user", false) || interaction.user;

	const reply = interaction.reply({
		content: "⏳ Setting reminder...",
		ephemeral: true,
	});

	let time: Date,
		repeatRule: RRule | null = null,
		friendly: string | null = null;

	try {
		const { stdout, stderr } = await execAsync(
			`python3 ${resolve(__dirname, "../../nlp/process.py")} ${timeInput}`
		);

		const output: {
			parameterised: string | null;
			friendly: string | null;
		} = JSON.parse(stdout);

		if (output.parameterised?.startsWith("RRULE")) {
			repeatRule = RRule.fromString(output.parameterised);
			time = repeatRule.after(new Date());
		} else if (output.parameterised) {
			time = new Date(output.parameterised);
		} else {
			throw new Error(JSON.parse(stderr));
		}

		friendly = output.friendly;
	} catch (err) {
		await reply;
		interaction.editReply({
			content: `⚠️ Sorry, I couldn't understand the time **${timeInput}**.`,
		});
	}

	const reminder = await setReminder({
		userId: user.id,
		content,
		time: time!,
		repeatRule: repeatRule?.toString(),
	});

	await reply;
	interaction.editReply({
		content: `✅ Reminder set!`,
		embeds: [
			new MessageEmbed()
				.setTitle(reminder.content)
				.setDescription(
					`Reminder set for ${friendly || formatDate(reminder.time)}`
				),
		],
	});
};
