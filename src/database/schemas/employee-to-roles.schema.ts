import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { EmployeeRoles } from './employee-roles.schema.js';
import { Employees } from './employee.schema.js';

export const EmployeeToRoles = mysqlTable('employee_to_roles', {
	employeeID: varchar('employee_id', {
		length: 36,
	})
		.notNull()
		.references(() => Employees.employeeID, { onDelete: 'cascade' }),
	roleID: varchar('role_id', {
		length: 36,
	})
		.notNull()
		.references(() => EmployeeRoles.id),
});
