import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise.js';
import { getRoleWithName } from './operations/roles';
import * as BranchSchema from './schemas/branch.schema';
import * as EmployeeToRoles from './schemas/employee-to-roles.schema';
import * as EmployeeSchema from './schemas/employees.schema';
import * as RoleSchema from './schemas/roles.schema';
import * as UserSchema from './schemas/user.schema';

const Schemas = {
	...BranchSchema,
	...UserSchema,
	...RoleSchema,
	...EmployeeSchema,
	...EmployeeToRoles,
};

export class MySQLConnection {
	private static instance: ReturnType<typeof drizzle<typeof Schemas>>;
	private static queryClient: Awaited<ReturnType<typeof mysql.createConnection>>;
	private static connectionURL: string;
	private constructor() {}

	public static setConnectionURL(url: string) {
		if (this.instance) {
			console.log(`Already connected to MySQL. Cannot change connection URL.`);
			return;
		}
		MySQLConnection.connectionURL = url;
	}

	public static async getInstance() {
		if (!MySQLConnection.instance) {
			if (!MySQLConnection.connectionURL) {
				throw new Error('Connection URL is not set.');
			}

			MySQLConnection.queryClient = await mysql.createConnection(MySQLConnection.connectionURL);
			MySQLConnection.instance = drizzle(MySQLConnection.queryClient, {
				schema: Schemas,
				mode: 'default',
			});

			await migrate(MySQLConnection.instance, {
				migrationsFolder: './drizzle',
			});

			const owwnerRole = await getRoleWithName('owner');
			if (!owwnerRole) {
				console.log('Creating owner role.');
				await MySQLConnection.instance.insert(RoleSchema.Roles).values({ name: 'owner' });
			}

			const employeeRole = await getRoleWithName('employee');
			if (!employeeRole) {
				console.log('Creating employee role.');
				await MySQLConnection.instance.insert(RoleSchema.Roles).values({ name: 'employee' });
			}

			console.log('Connected to MySQL.');
		}
		return MySQLConnection.instance;
	}

	public static async destroyInstance() {
		if (!MySQLConnection.instance) {
			return;
		}
		console.log('Disconnected from MySQL.');
		await MySQLConnection.queryClient.end();
		MySQLConnection.queryClient = null as any;
		MySQLConnection.instance = null as any;
	}
}
