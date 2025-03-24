// src/services/TelegramClientWrapper.js
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { Api } from 'telegram';
import readline from 'readline';

export class TelegramClientWrapper {
  constructor(apiId, apiHash, stringSession) {
    this.apiId = apiId;
    this.apiHash = apiHash;
    this.stringSession = new StringSession(stringSession);
    this.client = null;
  }

  async init() {
    this.client = new TelegramClient(this.stringSession, this.apiId, this.apiHash, { connectionRetries: 5 });
    await this.client.start({
      phoneNumber: async () => await this.promptInput('Please enter your phone number: '),
      password: async () => await this.promptInput('Please enter your password: '),
      phoneCode: async () => await this.promptInput('Please enter the code you received: '),
      onError: (err) => console.error(err),
    });
    console.log('Logged in successfully.');
    console.log('Your session string (save this for future logins): ' + this.client.session.save());
    return this.client;
  }

  promptInput(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  async getEntity(username) {
    return await this.client.getInputEntity(username);
  }

  async sendMessage(entity, message) {
    return await this.client.sendMessage(entity, { message });
  }

  async getMessages(entity, options) {
    return await this.client.getMessages(entity, options);
  }

  async invoke(apiMethod) {
    return await this.client.invoke(apiMethod);
  }

  async disconnect() {
    await this.client.disconnect();
  }
}
