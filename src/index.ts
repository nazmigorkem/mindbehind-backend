import { MySQLConnection } from '#database/mysql.js';
import { getUserRoleWithName } from '#database/operations/user-roles.js';
import { UserRoles } from '#database/schemas/user-roles.schema.js';
import { userAuth } from '#middlewares/auth.js';
import AuthRouter from '#routes/auth.js';
import BranchesRouter from '#routes/branch/index.js';
import UsersRouter from '#routes/user/index.js';
import { EnvFile } from '#types/env.js';
import cookieParser from 'cookie-parser';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/branches', userAuth, BranchesRouter);
app.use('/users', UsersRouter);
app.use('/auth', AuthRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send({ data: { message: 'Something went wrong.' }, success: false });
});

app.listen(3000, async () => {
	await MySQLConnection.setConnectionURL(EnvFile.MYSQL_URL);
	console.log('Server is running on port 3000');
	const instance = MySQLConnection.getInstance();
	await migrate(instance, {
		migrationsFolder: './drizzle',
	});

	const ownerRole = await getUserRoleWithName('owner');
	if (!ownerRole) {
		console.log('Creating owner role.');
		await instance.insert(UserRoles).values({ name: 'owner' });
	}

	const employeeRole = await getUserRoleWithName('employee');
	if (!employeeRole) {
		console.log('Creating employee role.');
		await instance.insert(UserRoles).values({ name: 'employee' });
	}
});
