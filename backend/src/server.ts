import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function start() {
  await connectDB();

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });
}

start();
