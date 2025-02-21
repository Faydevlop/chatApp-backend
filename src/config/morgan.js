import morgan from "morgan";
import fs from "fs";
import path from "path";

const logsDir = path.join("logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logsDir, "server.log"), { flags: "a" });

const setupMorgan = (app) => {
  app.use(morgan("combined", { stream: logStream }));
  app.use(morgan("dev"));
};

export default setupMorgan;
