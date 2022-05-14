import { config as configEnvironment } from "dotenv";
import * as path from "node:path";

// read .env.local file with environment variables
configEnvironment({
	path: path.join(process.cwd(), ".env.local"),
});
