# UserBot

UserBot is a Telegram client bot that automatically performs scheduled check-in and checkout operations. It supports custom schedules for Monday–Friday and Saturday, and is built using Telegram’s API, Node.js, and node‑cron for scheduling.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- Automatic check-in and checkout on a scheduled basis.
- Custom scheduling for weekdays and Saturday.
- Inline keyboard interaction using Telegram’s API.
- Clean code architecture with separation of concerns:
  - Business logic and Telegram operations are encapsulated in the `UserBot` class.
  - Scheduling is handled separately using node‑cron.
  - Environment configuration via dotenv.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- npm (Node Package Manager)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/userbot.git
   cd userbot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

## Configuration

UserBot uses environment variables for configuration. Create a `.env` file in the root directory and set the following variables:

```properties
# Telegram API credentials (get these from https://my.telegram.org)
TELEGRAM_API_ID=27120436
TELEGRAM_API_HASH=575106948338569871151bf10543488f
TELEGRAM_STRING_SESSION=your_string_session

# Bot username
TELEGRAM_BOT_USERNAME=A2SVBouncerBot

# Schedules (cron expressions)
# Monday-Friday: Checkin at 1:00 PM and Checkout at 8:00 PM
MONFRI_CHECKIN="0 13 * * 1-5"
MONFRI_CHECKOUT="0 20 * * 1-5"

# Saturday: Checkin at 9:00 AM and Checkout at 12:30 PM
SATURDAY_CHECKIN="0 9 * * 6"
SATURDAY_CHECKOUT="30 12 * * 6"

# Optional test schedules
TEST_CHECKIN_AFTER_10="10 * * * * *"
TEST_CHECKOUT_AFTER_10="20 * * * * *"
```

*Note*: Remove surrounding quotes if they cause issues with cron validation. The `config.js` file in the `src` directory uses these environment variables. Make sure to restart the application after changing the `.env` file.

---

## Usage

After configuring the environment variables, start the bot using:

```bash
node src/index.js
```

The bot will initialize, log in to Telegram, and schedule tasks based on your defined cron expressions:
- **Monday-Friday**:  
  - Checkin at 1:00 PM  
  - Checkout at 8:00 PM
- **Saturday**:  
  - Checkin at 9:00 AM  
  - Checkout at 12:30 PM

For testing purposes, you can use the test cron expressions provided in the `.env` file.

---

## Project Structure

```plaintext
userbot/
├── .env                   # Environment configuration
├── package.json           # Project metadata and dependency list
├── README.md              # Project documentation
└── src/
    ├── config.js          # Application configuration (loads environment variables)
    ├── index.js           # App entry point (initializes the bot and scheduler)
    ├── scheduler.js       # Scheduling logic using node‑cron
    └── UserBot.js         # Core bot operations (Telegram client operations)
```

---

## Troubleshooting

- **Timeouts and API errors**  
  If you encounter errors like `TIMEOUT` while processing updates or inline button actions, ensure that:
  - Your network connection is stable.
  - The bot’s API endpoints are reachable.
  - The scheduled cron jobs are properly configured.

- **Environment Variables**  
  Verify that all credentials and schedule values in your `.env` file are correct. Check that no extra quotes or spaces exist.

- **Type Conversion**  
  Ensure numerical values like `TELEGRAM_API_ID` are converted (e.g., using `Number(process.env.TELEGRAM_API_ID)`) before use.

For additional help, please refer to the [Telegram API documentation](https://core.telegram.org/api) and [node-cron documentation](https://www.npmjs.com/package/node-cron).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Happy coding!
