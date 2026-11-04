"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const rest = read("rest2/config/rho.example.json");
const db = read("rest2/config/programming.mariadb.example.json");
db.Pool.host = process.env.DB_HOST || "127.0.0.1";
db.Pool.port = Number(process.env.DB_PORT || 3306);
db.Pool.database = process.env.DB_NAME || "samplerestrho";
db.Pool.user = process.env.DB_USER || "ptgenai";
db.Pool.password = process.env.DB_PASSWORD || "";
rest.Chats.OpenAI.ApiKey = process.env.OPENAI_API_KEY || "not-configured";
rest.LLMs.Programming.Config.model = process.env.OPENAI_MODEL || "gpt-5.1";
for (const [file, data] of [["rest2/rest/rho.json",rest],["rest2/db/programming.mariadb.json",db]]) {
 const output = path.join(root,file);
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(data,null,2));
}
fs.mkdirSync(path.join(root,"rest2/templates/_users_"),{recursive:true});
console.log("Local configuration generated. Database credentials and API keys remain in ignored files.");
if (!process.env.OPENAI_API_KEY) console.log("OPENAI_API_KEY is not set; model-based editing will require a valid key.");
