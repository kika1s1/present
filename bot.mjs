// bot.mjs

import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { Api } from 'telegram';
import readline from 'readline';
import cron from 'node-cron';

// Replace these with your own credentials from https://my.telegram.org
const apiId = 27120436;           // e.g., 123456
const apiHash = '575106948338569871151bf10543488f';     // e.g., 'abcdef1234567890abcdef1234567890'
const stringSession = new StringSession('1BAAOMTQ5LjE1NC4xNjcuOTEAUFkKLpO9ftf92jmkclQy0Eaj/iKd/1mgwI7zkEa6ENJPNqyBhzCbZ2p2Gr1dC3kgadwq4SPEYjEyHg81nrDi9qiajPELgyI1N9TuTvl4ujjHSViWhpiuwRUL1fgpkmQJ53E9ttAVHfo29z6nMcrieLPVoPvVmvfpAPAbnULXx4EbTxcm6mOwwcng/Hb9DTV0XYgruI+zZxYtRfhq+GOXQqcDFDX0bJsXagebC5FYmoUyLpT6QQ4Dt0egWwyyd0GwNKtiXwP5p9AGYd3CY+u8+nKYIm1adxgmaykrjDP58iU6WpBUF5Vfil/8l8XDTUjEioik4MOOp/1EQXwo2CERQRU=');

// Replace with your target bot's username (e.g., '@YourBotUsername')
const BOT_USERNAME = 'A2SVBouncerBot';

/**
 * Helper function to prompt input from the console.
 * @param {string} query - The prompt text.
 * @returns {Promise<string>} - User input.
 */
function promptInput(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

/**
 * UserBot encapsulates the login and messaging workflow.
 */
class UserBot {
    constructor(apiId, apiHash, stringSession, botUsername) {
        this.apiId = apiId;
        this.apiHash = apiHash;
        this.stringSession = stringSession;
        this.botUsername = botUsername;
        this.client = null;
        this.botEntity = null; // will hold the proper input entity
        this.clickedButton = false; // flag for button clicked
    }

    /**
     * Initializes and logs in to Telegram.
     */
    async init() {
        this.client = new TelegramClient(this.stringSession, this.apiId, this.apiHash, { connectionRetries: 5 });
        await this.client.start({
            phoneNumber: async () => await promptInput('Please enter your phone number: '),
            password: async () => await promptInput('Please enter your password: '),
            phoneCode: async () => await promptInput('Please enter the code you received: '),
            onError: (err) => console.error(err),
        });
        console.log('Logged in successfully.');
        console.log('Your session string (save this for future logins): ' + this.client.session.save());
        this.botEntity = await this.client.getInputEntity(this.botUsername);
    }

    /**
     * Sends the /checkin command to the bot.
     */
    async sendCheckin() {
        console.log('Sending /checkin command...');
        await this.client.sendMessage(this.botUsername, { message: '/checkin' });
    }

    /**
     * Polls for a message containing the inline keyboard button "ASTU In Person" and clicks it.
     * Once the button is clicked, further polling is skipped.
     */
    async clickASTUButton() {
        if (this.clickedButton) {
            // Already clicked, return immediately.
            return;
        }
        console.log('Polling for inline keyboard message...');
        const timeout = 10000;     // 10 seconds timeout
        const interval = 1000;     // poll every 1 second
        const start = Date.now();

        while (Date.now() - start < timeout) {
            try {
                const messages = await this.client.getMessages(this.botEntity, { limit: 5 });
                for (const message of messages) {
                    if (message.replyMarkup && message.replyMarkup.rows) {
                        for (const row of message.replyMarkup.rows) {
                            for (const button of row.buttons) {
                                if (button.text === 'ASTU In Person') {
                                    console.log('Found "ASTU In Person" button in message:', message.id);
                                    // mark as clicked so no future clicks occur
                                    this.clickedButton = true;
                                    try {
                                        const result = await this.client.invoke(new Api.messages.GetBotCallbackAnswer({
                                            peer: this.botEntity,
                                            msgId: message.id,
                                            game: false,
                                            data: button.data
                                        }));
                                        console.log('Button click result:', result);
                                        return result;
                                    } catch (error) {
                                        if (error.code === 400 && error.errorMessage.includes("BOT_RESPONSE_TIMEOUT")) {
                                            console.warn("BOT_RESPONSE_TIMEOUT received. Treating this as a successful button click.");
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
            await new Promise(res => setTimeout(res, interval));
        }
        console.log("ASTU In Person button not found within timeout - proceeding to checkout.");
    }

    /**
     * Sends the /checkout command to the bot.
     */
    async sendCheckout() {
        console.log('Sending /checkout command...');
        await this.client.sendMessage(this.botEntity, { message: '/checkout' });
    }
}

(async () => {
    const userBot = new UserBot(apiId, apiHash, stringSession, BOT_USERNAME);
    await userBot.init(); // Initialize once at startup

    // Monday to Friday Checkin at 1:00 PM (13:00) and Checkout at 8:00 PM (20:00)
    cron.schedule('0 13 * * 1-5', async () => {
        console.log("Scheduled Monday-Friday checkin at 1:00 PM");
        // Reset the flag for a new checkin cycle.
        userBot.clickedButton = false;
        await userBot.sendCheckin();
        await userBot.clickASTUButton();
    });

    cron.schedule('0 20 * * 1-5', async () => {
        console.log("Scheduled Monday-Friday checkout at 8:00 PM");
        await userBot.sendCheckout();
    });

    // Saturday Checkin at 9:00 AM and Checkout at 12:30 PM (adjust if 12:30 AM was intended)
    cron.schedule('0 9 * * 6', async () => {
        console.log("Scheduled Saturday checkin at 9:00 AM");
        // Reset the flag for a new checkin cycle.
        userBot.clickedButton = false;
        await userBot.sendCheckin();
        await userBot.clickASTUButton();
    });

    cron.schedule('30 12 * * 6', async () => {
        console.log("Scheduled Saturday checkout at 12:30 PM");
        await userBot.sendCheckout();
    });

    console.log("Scheduler initialized. Bot is running.");
})();
