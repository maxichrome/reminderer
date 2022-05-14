// custom processEnv type
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly DISCORD_TOKEN: string;
			readonly DISCORD_OWNER_ID: string;
			readonly NODE_ENV: "development" | "production";
		}
	}
}

export {};
