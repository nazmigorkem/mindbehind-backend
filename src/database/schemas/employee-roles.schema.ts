import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const EmployeeRoles = mysqlTable('employee_roles', {
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
