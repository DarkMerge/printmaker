// Template for src/app/core/telegram.config.ts, which is gitignored because
// it holds a real secret (unlike Firebase's public web config): anyone who
// extracts the bot token from the bundled JS can send messages as this bot
// and read its message history via getUpdates. Blast radius is limited
// (this bot does nothing but relay order notifications to one private
// chat), but if it's ever abused, revoke and reissue the token via
// @BotFather's /revoke command.
//
// For local dev: copy this file to telegram.config.ts and fill in real
// values. In CI, telegram.config.ts is generated from the
// TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID repository secrets — see
// .github/workflows/deploy.yml.
export const telegramConfig = {
  botToken: 'REPLACE_ME',
  chatId: 'REPLACE_ME',
};
