import { MySQLConnection } from 'database/mysql';
import express, { NextFunction, Request, Response } from 'express';
import BranchRouter from 'routes/branch';
import UserRouter from 'routes/user';

const app = express();

app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.use('/branches', BranchRouter);
app.use('/users', UserRouter);
app.listen(3000, () => {
	MySQLConnection.setConnectionURL(process.env.MYSQL_URL!);
	console.log('Server is running on port 3000');
	MySQLConnection.getInstance();
});
