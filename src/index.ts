import { MySQLConnection } from 'database/mysql';
import express from 'express';
import BranchesRouter from 'routes/branch';
import RolesRouter from 'routes/roles';
import UsersRouter from 'routes/user';

const app = express();

app.use(express.json());

app.use('/branches', BranchesRouter);
app.use('/users', UsersRouter);
app.use('/roles', RolesRouter);

app.listen(3000, () => {
	MySQLConnection.setConnectionURL(process.env.MYSQL_URL!);
	console.log('Server is running on port 3000');
	MySQLConnection.getInstance();
});
