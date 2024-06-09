import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise.js';
import * as BranchSchema from './schema/branch.schema';
import * as RoleSchema from './schema/roles.schema';
import * as UserSchema from './schema/user.schema';

const Schemas = {
	...BranchSchema,
	...UserSchema,
	...RoleSchema,
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
