import { numberButtons } from './keyboards.js';

const chats = {};

const startGame = async ctx => {
	const chatId = String(ctx.chat.id);
	await ctx.reply('Сейчас я загадаю цифру от 0 до 9. Ты должен её угадать!');

	const randomNumber = Math.floor(Math.random() * 10);

	chats[chatId] = randomNumber;
	await ctx.reply('Выбери цифру', numberButtons);
};

export { chats, startGame };
