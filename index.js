require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const sequelize = require("./db");
const token = process.env.TG_TOKEN;

const UserModel = require("./models");

const bot = new TelegramBot(token, { polling: true });

const start = async () => {
  try {
    sequelize.authenticate();
    sequelize.sync();
  } catch (e) {
    console.log(e);
  }
};

start();
bot.on("message", async (msg) => {
  try {
    switch (msg.text) {
      case "/start": {
        await UserModel.create({ chatId: msg.chat.id });
        return bot.sendMessage(msg.chat.id, "купи слона");
      }
      case "/info": {
        const user = await UserModel.findOne({ chatId: msg.chat.id });
        return bot.sendMessage(
          msg.chat.id,
          `ти купив ${user.amountElephants ? user.amountElephants : 0} слона`
        );
      }
      default: {
        const user = await UserModel.findOne({ chatId: msg.chat.id });
        user.counter += 1;

        if (user.counter == 2) {
          await bot.sendMessage(
            msg.chat.id,
            `${msg.chat.first_name}, всі кажуть "${msg.text}", а ти купи слона!`
          );
        } else if (user.counter >= 3) {
          user.counter = 0;
          await bot.sendMessage(
            msg.chat.id,
            `ладно, просто купи слона і всьо!`,
            {
              reply_markup: JSON.stringify({
                inline_keyboard: [[{ text: "Купляю", callback_data: "buy" }]],
              }),
            }
          );
        } else {
          await bot.sendMessage(
            msg.chat.id,
            `Всі кажуть "${msg.text}", а ти купи слона!`
          );
        }
        await user.save();
      }
    }
  } catch (e) {
    console.log("something wrong", e);
  }
});

bot.on("callback_query", async (msg) => {
  const user = await UserModel.findOne({ chatId: msg.message.chat.id });
  switch (msg.data) {
    case "buy": {
      user.counter = 0;
      await bot.sendMessage(msg.message.chat.id, "ти купив слона");
      user.amountElephants += 1;
      await user.save();
    }
    default:
      return;
  }
});
