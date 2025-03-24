// src/services/UserBot.js
import { Api } from 'telegram';

export class UserBot {
  constructor(telegramClient, botUsername) {
    this.telegramClient = telegramClient;
    this.botUsername = botUsername;
    this.botEntity = null;
    this.clickedButton = false;
  }

  async init() {
    this.botEntity = await this.telegramClient.getEntity(this.botUsername);
  }

  async sendCheckin() {
    console.log('Sending /checkin command...');
    await this.telegramClient.sendMessage(this.botUsername, '/checkin');
  }

  async sendCheckout() {
    console.log('Sending /checkout command...');
    await this.telegramClient.sendMessage(this.botUsername, '/checkout');
  }

  async clickASTUButton(timeout = 10000, interval = 1000) {
    if (this.clickedButton) return;

    console.log('Polling for inline keyboard message...');
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        const messages = await this.telegramClient.getMessages(this.botEntity, { limit: 5 });
        for (const message of messages) {
          if (message.replyMarkup && message.replyMarkup.rows) {
            for (const row of message.replyMarkup.rows) {
              for (const button of row.buttons) {
                if (button.text === 'ASTU In Person') {
                  console.log('Found "ASTU In Person" button in message:', message.id);
                  this.clickedButton = true;
                  try {
                    const result = await this.telegramClient.invoke(new Api.messages.GetBotCallbackAnswer({
                      peer: this.botEntity,
                      msgId: message.id,
                      game: false,
                      data: button.data,
                    }));
                    console.log('Button click result:', result);
                    return result;
                  } catch (error) {
                    if (error.code === 400 && error.errorMessage.includes("BOT_RESPONSE_TIMEOUT")) {
                      console.warn("BOT_RESPONSE_TIMEOUT received. Treating as a successful button click.");
                      this.clickedButton = true;
                      return;
                    } else {
                      throw error;
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error while polling for button:', error);
      }
      await new Promise((res) => setTimeout(res, interval));
    }
    console.log("ASTU In Person button not found within timeout.");
  }
}
