import 'dotenv/config';
import { Sequelize } from 'sequelize';

const config = {
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_ADDRESS,
	port: process.env.DB_PORT,
	dialect: 'postgres',
};

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		host: config.host,
		port: config.port,
		dialect: config.dialect,
	}
);

export default sequelize;
