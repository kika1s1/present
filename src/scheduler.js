// src/scheduler.js
import cron from 'node-cron';
import { config } from './config.js';

export class Scheduler {
  constructor(userBot) {
    this.userBot = userBot;
  }

  start() {
    // Monday to Friday
    cron.schedule(config.schedule.monFri.checkin, async () => {
      console.log("Scheduled Monday-Friday checkin triggered.");
      this.userBot.clickedButton = false;
      await this.userBot.sendCheckin();
      await this.userBot.clickASTUButton();
    });

    cron.schedule(config.schedule.monFri.checkout, async () => {
      console.log("Scheduled Monday-Friday checkout triggered.");
      await this.userBot.sendCheckout();
    });

    // Saturday
    cron.schedule(config.schedule.saturday.checkin, async () => {
      console.log("Scheduled Saturday checkin triggered.");
      this.userBot.clickedButton = false;
      await this.userBot.sendCheckin();
      await this.userBot.clickASTUButton();
    });

    cron.schedule(config.schedule.saturday.checkout, async () => {
      console.log("Scheduled Saturday checkout triggered.");
      await this.userBot.sendCheckout();
    });

    console.log("Scheduler initialized. Bot is running.");
  }
}
