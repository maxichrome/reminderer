export const debug = (...message: string[]): void => {
	if (process.env.NODE_ENV === "development") {
		console.log("[DBG] ", message.join(" "));
	}
};
