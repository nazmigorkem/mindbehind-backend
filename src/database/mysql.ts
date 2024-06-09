import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise.js';
import * as BranchSchema from './schemas/branch.schema';
import * as EmployeeRolesSchema from './schemas/employee-roles.schema';
import * as EmployeeToRolesSchema from './schemas/employee-to-roles.schema';
import * as EmployeeSchema from './schemas/employee.schema';
import * as UserRolesSchema from './schemas/user-roles.schema';
import * as UserSchema from './schemas/user.schema';

const Schemas = {
	...BranchSchema,
	...UserSchema,
	...EmployeeRolesSchema,
	...UserRolesSchema,
	...EmployeeSchema,
	...EmployeeToRolesSchema,
};

export class MySQLConnection {
	private static instance: ReturnType<typeof drizzle<typeof Schemas>>;
	private static queryClient: Awaited<ReturnType<typeof mysql.createConnection>>;
	private static connectionURL: string;
	private constructor() {}

	public static async setConnectionURL(url: string) {
		if (this.instance) {
			console.log(`Already connected to MySQL. Cannot change connection URL.`);
			return;
		}
		MySQLConnection.connectionURL = url;
		MySQLConnection.queryClient = await mysql.createConnection(MySQLConnection.connectionURL);
	}

	public static getInstance() {
		if (!MySQLConnection.instance) {
			if (!MySQLConnection.connectionURL) {
				throw new Error('Connection URL is not set.');
			}

			MySQLConnection.instance = drizzle(MySQLConnection.queryClient, {
				schema: Schemas,
				mode: 'default',
			});

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
