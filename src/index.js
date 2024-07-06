import 'dotenv/config';
import { Telegraf } from 'telegraf';
import sequelize from './db/db.js';
import User from './db/userModel.js';
import { playAgainButton } from './helpers/keyboards.js';
import { chats, startGame } from './helpers/startGame.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async ctx => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
	} catch (error) {
		console.error('Нет подключения к базе данных', error);
		throw error;
	}

	const chatId = String(ctx.message.chat.id);

	if (await User.findOne({ chatId })) {
		await ctx.replyWithSticker(
			'https://cdn.tlgrm.ru/stickers/b25/0e1/b250e11d-2b46-44fc-beb7-c9b98657c4fc/192/1.webp'
		);
		ctx.reply('Привет! Ты уже в игре. Введи команду /game');
	} else {
		await User.create({ chatId });

		await ctx.replyWithSticker(
			'https://cdn.tlgrm.ru/stickers/b25/0e1/b250e11d-2b46-44fc-beb7-c9b98657c4fc/192/1.webp'
		);
		ctx.reply(
			'Привет! Я бот для генерации случайных чисел. Напиши /game, чтобы начать игру.'
		);
	}
});

bot.command('game', async ctx => {
	startGame(ctx);
});

bot.command('profile', async ctx => {
	const chatId = String(ctx.message.chat.id);
	const user = await User.findOne({ chatId });
	console.log(user);

	if (!user) {
		ctx.reply(`Профиль пока пуст. Напиши /start, чтобы начать игру.`);
		throw new Error(`Пользователь с chatId ${chatId} не найден`);
	}

	return ctx.reply(
		`Вот твой профиль, ${ctx.from.first_name} ${ctx.from.last_name}\n\nПравильных ответов: ${user.correctAnswers}\nНеправильных ответов: ${user.incorrectAnswers}`
	);
});

bot.action('play_again', async ctx => {
	startGame(ctx);
});

bot.on('callback_query', async ctx => {
	const userNumber = ctx.update.callback_query.data;
	const chatId = String(ctx.update.callback_query.from.id);

	const user = await User.findOne({ chatId });

	if (!user) {
		throw new Error(`Юзер с Chat ID ${chatId} не найден`);
	}

	if (Number(userNumber) === chats[chatId]) {
		user.correctAnswers += 1;
		await ctx.reply(
			`Ты угадал! Эта была цифра ${chats[chatId]}`,
			playAgainButton
		);
	} else {
		user.incorrectAnswers += 1;
		await ctx.reply(
			`Неверно, эта была цифра ${chats[chatId]}. Попробуй ещё раз.`,
			playAgainButton
		);
	}

	await user.save();
});

bot.catch(error => {
	console.error('Бот упал с ошибкой', error);
});

bot.launch();
