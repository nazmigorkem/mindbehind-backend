import authRouter from 'auth';
import { MySQLConnection } from 'database/mysql';
import express from 'express';

const app = express();

app.use(authRouter);

app.listen(3000, () => {
	MySQLConnection.setConnectionURL(process.env.MYSQL_URL!);
	console.log('Server is running on port 3000');
	MySQLConnection.getInstance();
});
