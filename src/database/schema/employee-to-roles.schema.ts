import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { Employees } from './employees.schema';
import { Roles } from './roles.schema';

export const EmployeeToRoles = mysqlTable('employee_to_roles', {
	employeeID: varchar('employee_id', {
		length: 36,
	})
		.notNull()
		.references(() => Employees.employeeID),
	roleID: varchar('role_id', {
		length: 36,
	})
		.notNull()
		.references(() => Roles.id),
});
