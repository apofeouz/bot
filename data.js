//////////////////////
////  Запускаем webHook
//////////////////////

// Подключаем модули
let fs = require('fs');
let Telegraf = require('telegraf');

/**
 * Настройки
 * @type token: string - Токен бота
 * @type path: string - относительный путь до директории с сертификатами 
 * @type key: string - приватный ключ 
 * @type cert: string - сертификат сервера
 * @type ca: string - сертификат клиента 
 * @type port: number - порт
 * @type domain: string - домен
 * @type whpath: string - путь
 * @type admin: number - id владельца бота
 */
let config = {
    "token": "YOUR_TOKEN",
    "path": "./certs/",
    "key": "file.key",
    "cert": "file.crt",
    "ca": "file.ca",
    "port": 8443,
    "domain": "domain.com",
    "whpath": "/secret-path",
    "admin": 123456789
};

// Создаем объект Telegraf.js
let bot = new Telegraf(config.token);

// TLS options
let tlsOptions = {
    key: fs.readFileSync(config.path + config.key),
    cert: fs.readFileSync(config.path + config.cert),
    ca: [
        // This is necessary only if the client uses the self-signed certificate.
        fs.readFileSync(config.path + config.ca)
    ]
};

// Установливаем webHook
bot.telegram.setWebhook('https://' + config.domain + ':' + config.port + config.whpath);

// Запускаем https webhook
bot.startWebhook(config.whpath, tlsOptions, config.port);

/**
 * Значения текстовых ответов
 * @type helloAdmin: string - Приветствие для админа
 * @type helloUser: string - Приветствие для пользователя
 * @type replyWrong: string - Если админ написал сам себе, уведомляем его
 */
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser":  "Приветствую, отправьте мне сообщение. Постараюсь ответить в ближайшее время.",
    "replyWrong": "Для ответа пользователю используйте функцию Ответить/Reply."
};

/**
 * Проверяем пользователя на права
 * @param userId {number}
 * @returns {boolean}
 */
let isAdmin = (userId) => {
    return userId == config.admin;
};

/**
 *  Перенаправляем админу от пользователя или уведомляем админа об ошибке
 * @param ctx
 */
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
    }
};

/**
 * Старт бота
 */
bot.start((ctx) => {
    ctx.reply(isAdmin(ctx.message.from.id)
        ? replyText.helloAdmin
        : replyText.helloUser);
});


//////////////////////
////  Основа 1
//////////////////////

/**
 * Текст
 */
bot.on('text', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendMessage(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.text
        );
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * Стикер
 */
bot.on('sticker', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendSticker(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.sticker.file_id
        );
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * 1 фотография - не медиагруппа
 */
bot.on('photo', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        let file = ctx.message.photo.length - 1;
        ctx.telegram.sendPhoto(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.photo[file].file_id,
            {
                'caption': ctx.message.caption
            });
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * Документ
 */
bot.on('document', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendDocument(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.document.file_id,
            {
                'caption': ctx.message.caption
            });
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * Голосовая заметка
 */
bot.on('voice', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendVoice(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.voice.file_id,
            {
                'caption': ctx.message.caption
            });
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * Видео заметка
 */
bot.on('video_note', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendVideoNote(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.video_note.file_id
        );
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * 1 видео ролик - не медиагруппа
 */
bot.on('video', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendVideo(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.video.file_id,
            {
                'caption': ctx.message.caption
            }
        );
    } else {
        forwardToAdmin(ctx);
    }
});

/**
 * Аудио ролик
 */
bot.on('audio', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendAudio(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message.audio.file_id,
            {
                'caption': ctx.message.caption
            });
    } else {
        forwardToAdmin(ctx);
    }
});