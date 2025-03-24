import dotenv from "dotenv"
dotenv.config({})
export const config = {
  telegram: {
    apiId: Number(process.env.TELEGRAM_API_ID),
    apiHash: process.env.TELEGRAM_API_HASH,
    stringSession: process.env.TELEGRAM_STRING_SESSION,
    botUsername: process.env.TELEGRAM_BOT_USERNAME,
  },
  schedule: {
    monFri: {
      checkin: process.env.MONFRI_CHECKIN,    // 1:00 PM Monday-Friday
      checkout: process.env.MONFRI_CHECKOUT   // 8:00 PM Monday-Friday
    },
    saturday: {
      checkin: process.env.SATURDAY_CHECKIN,       // 9:00 AM Saturday
      checkout: process.env.SATURDAY_CHECKOUT     // 12:30 PM Saturday
    }
  }
};
