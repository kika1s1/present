// src/config.js
export const config = {
    telegram: {
      apiId: process.env.TELEGRAM_API_ID || 27120436,
      apiHash: process.env.TELEGRAM_API_HASH || '575106948338569871151bf10543488f',
      stringSession: process.env.TELEGRAM_STRING_SESSION || '1BAAOMTQ5LjE1NC4xNjcuOTEAUFkKLpO9ftf92jmkclQy0Eaj/iKd/1mgwI7zkEa6ENJPNqyBhzCbZ2p2Gr1dC3kgadwq4SPEYjEyHg81nrDi9qiajPELgyI1N9TuTvl4ujjHSViWhpiuwRUL1fgpkmQJ53E9ttAVHfo29z6nMcrieLPVoPvVmvfpAPAbnULXx4EbTxcm6mOwwcng/Hb9DTV0XYgruI+zZxYtRfhq+GOXQqcDFDX0bJsXagebC5FYmoUyLpT6QQ4Dt0egWwyyd0GwNKtiXwP5p9AGYd3CY+u8+nKYIm1adxgmaykrjDP58iU6WpBUF5Vfil/8l8XDTUjEioik4MOOp/1EQXwo2CERQRU=',
      botUsername: process.env.TELEGRAM_BOT_USERNAME || 'A2SVBouncerBot'
    },
    schedule: {
      monFri: {
        checkin: '0 13 * * 1-5',    // 1:00 PM Monday-Friday
        checkout: '0 20 * * 1-5'    // 8:00 PM Monday-Friday
      },
      saturday: {
        checkin: '0 9 * * 6',       // 9:00 AM Saturday
        checkout: '30 12 * * 6'     // 12:30 PM Saturday
      }
    }
  };
  