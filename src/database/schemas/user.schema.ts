import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const Users = mysqlTable('users', {
	id: varchar('id', {
		length: 36,
	})
		.$defaultFn(() => crypto.randomUUID())
		.primaryKey(),
	name: varchar('name', {
		length: 30,
	}),
	surname: varchar('surname', {
		length: 30,
	}),
	email: varchar('email', {
		length: 100,
	}).unique(),
	password: varchar('password', {
		length: 32,
	}),
});
