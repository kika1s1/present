// src/index.js
import { config } from './config.js';
import { TelegramClientWrapper } from './services/TelegramClientWrapper.js';
import { UserBot } from './services/UserBot.js';
import { Scheduler } from './scheduler.js';
import express from 'express'

const app = express()
app.get("/present", (req, res) => {
  res.json({
    "message": "i am present"
  });
});

(async () => {
  try {
    // Initialize Telegram client
    const telegramClientWrapper = new TelegramClientWrapper(
      config.telegram.apiId,
      config.telegram.apiHash,
      config.telegram.stringSession
    );
    await telegramClientWrapper.init();

    // Initialize UserBot
    const userBot = new UserBot(telegramClientWrapper, config.telegram.botUsername);
    await userBot.init();

    // Start Scheduler
    const scheduler = new Scheduler(userBot);
    scheduler.start();

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      await telegramClientWrapper.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
})();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});