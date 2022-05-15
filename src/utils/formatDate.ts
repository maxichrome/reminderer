export function formatDate(date: Date) {
	return date.toLocaleDateString("en-UK", {
		hour: "numeric",
		hour12: true,
		minute: "numeric",
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
