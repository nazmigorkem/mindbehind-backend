import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const UserRoles = mysqlTable('user_roles', {
	id: varchar('id', {
		length: 36,
	})
		.$defaultFn(() => crypto.randomUUID())
		.primaryKey(),
	name: varchar('name', {
		length: 30,
	})
		.notNull()
		.unique(),
});
