import { EmbedBuilder } from "@discordjs/builders";
import { CronJob } from "cron";
import {
	DiscordAPIError,
	GuildTextBasedChannel,
	ThreadChannel,
} from "discord.js";
import RRule from "rrule";
import { discord } from "../client";
import { prisma, Prisma, Reminder } from "../database";
import { debug } from "../logging/debug";
import { formatDate } from "../utils/formatDate";

export async function setReminder(
	input: Prisma.ReminderCreateInput & Partial<Reminder>
): Promise<Reminder> {
	if (input.id) delete input.id;

	const reminder = await prisma.reminder.create({
		data: input,
	});

	const job = new CronJob(reminder.time, () => executeReminder(reminder));
	job.start();

	return reminder;
}

export async function executeReminder(id: Reminder["id"]): Promise<void>;
export async function executeReminder(reminder: Reminder): Promise<void>;
export async function executeReminder(
	input: Reminder | Reminder["id"]
): Promise<void> {
	// if input is id, fetch reminder then execute reminder
	if (typeof input === "number") {
		debug(`Searching for reminder ${input}`);

		const reminder = await prisma.reminder.findUnique({
			where: {
				id: input,
			},
			rejectOnNotFound: true,
		});

		return executeReminder(reminder);
	}

	debug(`Executing reminder ${input.id}`);

	const embed = new EmbedBuilder().setTitle(input.content);

	if (input.repeatRule) {
		const nextTime = RRule.fromString(input.repeatRule).after(new Date());

		embed.addFields({
			name: "Next reminder",
			value: formatDate(nextTime),
		});

		setReminder({
			...input,
			time: nextTime,
		});
	}

	try {
		await discord.users.send(input.userId, {
			content: "You asked me to remind you:",
			embeds: [embed.toJSON()],
		});
	} catch (err) {
		if (err instanceof DiscordAPIError) {
			debug("API error while messaging user", err.message);

			if (err.code === 50007) {
				debug("No permission to DM this user");
				// cannot message this user

				const user = await discord.users.fetch(input.userId);

				if (!user) {
					console.error(
						`User ${input.userId} isn't available!\n  Reminder: ${input.content}`
					);
					return;
				}

				// find a mutual guild
				const mutualGuild = discord.guilds.cache.find((g) =>
					g.members.cache.has(user.id)
				);

				const channel = mutualGuild?.channels.cache.find(
					(c) =>
						(c.type === "GUILD_PRIVATE_THREAD" &&
							c.name.startsWith("Reminder") &&
							c.sendable) ||
						c.type === "GUILD_TEXT"
				) as GuildTextBasedChannel | ThreadChannel;

				if (!channel) {
					console.error(
						`Couldn't find a channel to send reminder to user ${user.id}!\n  Reminder: ${input.content}`
					);
					return;
				}

				channel.send({
					content: `Hey, ${user}! I couldn't DM you, I've sent this reminder instead:`,
					embeds: [embed.toJSON()],
				});
			}

			return;
		}
	} finally {
		prisma.reminder.delete({
			where: {
				id: input.id,
			},
		});
	}
}
