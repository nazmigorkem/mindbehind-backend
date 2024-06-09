import cookieParser from 'cookie-parser';
import { MySQLConnection } from 'database/mysql';
import express from 'express';
import { userAuth } from 'middlewares/auth';
import AuthRouter from 'routes/auth';
import BranchesRouter from 'routes/branch';
import RolesRouter from 'routes/roles';
import UsersRouter from 'routes/user';
import { EnvFile } from 'types/env';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/branches', userAuth, BranchesRouter);
app.use('/users', UsersRouter);
app.use('/roles', RolesRouter);
app.use('/auth', AuthRouter);

app.listen(3000, () => {
	MySQLConnection.setConnectionURL(EnvFile.MYSQL_URL);
	console.log('Server is running on port 3000');
	MySQLConnection.getInstance();
});
