import { MySQLConnection } from '#database/mysql.js';
import { EmployeeToRoles } from '#database/schemas/employee-to-roles.schema.js';
import { Employees } from '#database/schemas/employee.schema.js';
import { and, eq } from 'drizzle-orm';

export async function getEmployeeWithEmployeeID(employeeID: string) {
	return await MySQLConnection.getInstance().query.Employees.findFirst({
		where: eq(Employees.employeeID, employeeID),
	});
}

export async function getEmployeeWithUserID(branchID: string, userID: string) {
	return await MySQLConnection.getInstance().query.Employees.findFirst({
		where: and(eq(Employees.userID, userID), eq(Employees.branchID, branchID)),
	});
}

export async function getEmployeeWithRoleID(roleID: string) {
	return await MySQLConnection.getInstance().query.EmployeeToRoles.findFirst({
		where: eq(EmployeeToRoles.roleID, roleID),
	});
}

export async function insertEmployee(data: typeof Employees.$inferInsert) {
	const employeeID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(Employees)
		.values({ ...data, employeeID });
	return employeeID;
}

export async function updateEmployee(employeeID: string, data: Omit<typeof Employees.$inferSelect, 'employeeID'>) {
	return await MySQLConnection.getInstance().update(Employees).set(data).where(eq(Employees.employeeID, employeeID));
}

export async function deleteEmployee(employeeID: string) {
	return await MySQLConnection.getInstance().delete(Employees).where(eq(Employees.employeeID, employeeID));
}

export async function addRoleToEmployee(data: typeof EmployeeToRoles.$inferInsert) {
	return await MySQLConnection.getInstance().insert(EmployeeToRoles).values(data);
}
