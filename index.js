require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TG_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const counter = {};

bot.on("message", (msg) => {
  counter[msg.chat.id] = counter[msg.chat.id] ? counter[msg.chat.id] + 1 : 1;

  switch (msg.text) {
    case "/start": {
      counter[msg.chat.id] = 0;
      return bot.sendMessage(msg.chat.id, "купи слона");
    }
    default: {
      if (counter[msg.chat.id] == 2) {
        return bot.sendMessage(
          msg.chat.id,
          `${msg.chat.first_name}, всі кажуть "${msg.text}", а ти купи слона!`
        );
      }
      if (counter[msg.chat.id] >= 3) {
        counter[msg.chat.id] = 0;
        return bot.sendMessage(
          msg.chat.id,
          `ладно, просто купи слона і всьо!`,
          {
            reply_markup: JSON.stringify({
              inline_keyboard: [[{ text: "Купляю", callback_data: "buy" }]],
            }),
          }
        );
      }
      return bot.sendMessage(
        msg.chat.id,
        `Всі кажуть "${msg.text}", а ти купи слона!`
      );
    }
  }
});

bot.on("callback_query", (msg) => {
  switch (msg.data) {
    case "buy": {
      counter[msg.message.chat.id] = 0;
      bot.sendMessage(msg.message.chat.id, "ти купив слона");
    }
    default:
      return;
  }
});
