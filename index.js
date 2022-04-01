require("dotenv").config();
const { Telegraf } = require('telegraf')
const fs = require('fs');
const bot = new Telegraf(process.env.BOT_TOKEN)
const fetch = require('node-fetch');
const translate = require('friendly-node-cron');
const cron = require('node-cron');

const dataBuffer = fs.readFileSync('/Users/apofeouz/Documents/iMacros/Macros/answers.json');
const dataJSON = dataBuffer.toString()
let answers = JSON.parse(dataJSON);


fetch('https://api.weather.yandex.ru/v2/informers?lat=47.23135001&lon=39.7232800', {
  method: "GET",
  headers: {
    "X-Yandex-API-Key": process.env.Yandex_API,
    "Content-Type": "application/json; charset=utf-8",
  },
}).then(res => res.json())
  .then(json => {

   cron.schedule(translate('at 21:23:25'), () => {
      bot.telegram.sendMessage(-418036609, `В Ростове-на-Дону температура: ${json.fact.temp}` + "\n" + `Ощущается как: ${json.fact.feels_like}`)
    })
  })

  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
  .then(res => res.json())
  .then(json => {
  cron.schedule(translate('at 20:24:20'), () => {
      bot.telegram.sendMessage(-418036609, '$ бакс сейчас стоит ' + json.Valute.USD.Value.toFixed(2) + ' и он ' + (json.Valute.USD.Value < json.Valute.USD.Previous ? ' падает' : ' растёт'))
})
  });
//$('#usd').html((data.Valute.USD.Value<data.Valute.USD.Previous?'<i class="fas fa-long-arrow-alt-down"></i>':'<i class="fas fa-long-arrow-alt-up"></i>')+'<i class="fas fa-dollar-sign"></i>'+data.Valute.USD.Value.toFixed(2)+' <i class="fas fa-ruble-sign"></i>');

bot.hears('Привет', async ctx => {
  await ctx.reply(`Привет, ${ctx.message.from.first_name}`);
});



cron.schedule(translate('at 20:23:20'), () => {
  bot.telegram.sendMessage(-418036609, 'Срочная новость!!')
})

bot.on('sticker', ctx => {
  ctx.reply('Прикольный стикер')
})
bot.on('edited_message', ctx => {
  ctx.reply('Вы успешно изменили сообщение')
})
bot.command('time', ctx => {
  ctx.reply(String(new Date()))
})

bot.on("text", async (ctx) => {
  let question = ctx.message.text.replace(/[^A-Za-z 0-9а-яА-Я \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/gi, '').trim();
  for (var key in answers) {
    //Совпадение вопроса
    if (answers[key].question == question) {
      //Поиск ответа
      //Найдено совпадение
      return ctx.reply('Следующий вопрос', ctx.replyWithHTML(answers[key].answer))
    }
  }
});





// // повторюшка
// bot.on("text", (ctx) => {
//   if (ctx.message.text === 'Вася') {
//     return ctx.reply(ctx.replyWithHTML('<b>Привет!</b>'))
//   } // works!



// });





bot.launch()



// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))