import cookieParser from 'cookie-parser';
import { MySQLConnection } from 'database/mysql';
import { getRoleWithName } from 'database/operations/roles';
import { Roles } from 'database/schemas/roles.schema';
import { migrate } from 'drizzle-orm/mysql2/migrator';
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

app.listen(3000, async () => {
	await MySQLConnection.setConnectionURL(EnvFile.MYSQL_URL);
	console.log('Server is running on port 3000');
	const instance = MySQLConnection.getInstance();
	await migrate(instance, {
		migrationsFolder: './drizzle',
	});

	const ownerRole = await getRoleWithName('owner');
	if (!ownerRole) {
		console.log('Creating owner role.');
		await instance.insert(Roles).values({ name: 'owner' });
	}

	const employeeRole = await getRoleWithName('employee');
	if (!employeeRole) {
		console.log('Creating employee role.');
		await instance.insert(Roles).values({ name: 'employee' });
	}
});
