import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const User = sequelize.define('user', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		unique: true,
		autoIncrement: true,
	},
	chatId: {
		type: DataTypes.STRING,
		unique: true,
	},
	correctAnswers: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	incorrectAnswers: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
});

export default User;
