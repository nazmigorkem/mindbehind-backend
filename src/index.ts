import { MySQLConnection } from 'database/mysql';
import express from 'express';
import BranchRouter from 'routes/branch';

const app = express();

app.use(express.json());

app.use('/branches', BranchRouter);

app.listen(3000, () => {
	MySQLConnection.setConnectionURL(process.env.MYSQL_URL!);
	console.log('Server is running on port 3000');
	MySQLConnection.getInstance();
});
