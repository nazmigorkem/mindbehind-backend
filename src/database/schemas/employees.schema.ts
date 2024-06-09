import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { Branches } from './branch.schema';
import { Users } from './user.schema';

export const Employees = mysqlTable('employees', {
	employeeID: varchar('employee_id', {
		length: 36,
	})
		.$defaultFn(() => crypto.randomUUID())
		.primaryKey(),
	userID: varchar('user_id', {
		length: 36,
	})
		.notNull()
		.references(() => Users.id, { onDelete: 'cascade' }),
	branchID: varchar('branch_id', {
		length: 36,
	})
		.notNull()
		.references(() => Branches.id, { onDelete: 'cascade' }),
});
