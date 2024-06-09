import { MySQLConnection } from 'database/mysql';
import { EmployeeToRoles } from 'database/schemas/employee-to-roles.schema';
import { Employees } from 'database/schemas/employee.schema';
import { and, eq } from 'drizzle-orm';
import { getEmployeeRoleWithName } from './employee-roles';

export async function getEmployeeWithEmployeeID(id: string) {
	return await MySQLConnection.getInstance().query.Employees.findFirst({
		where: eq(Employees.employeeID, id),
	});
}

export async function getEmployeeWithUserID(branchID: string, userID: string) {
	return await MySQLConnection.getInstance().query.Employees.findFirst({
		where: and(eq(Employees.userID, userID), eq(Employees.branchID, branchID)),
	});
}

export async function employeeHasNamedRole(employeeID: string, roleName: string) {
	const role = await getEmployeeRoleWithName(roleName);
	if (!role) {
		return false;
	}

	return !!(await MySQLConnection.getInstance().query.EmployeeToRoles.findFirst({
		where: and(eq(EmployeeToRoles.employeeID, employeeID), eq(EmployeeToRoles.roleID, role.id)),
	}));
}

export async function insertEmployee(data: typeof Employees.$inferInsert) {
	const employeeID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(Employees)
		.values({ ...data, employeeID });
	return employeeID;
}

export async function deleteEmployee(id: string) {
	return await MySQLConnection.getInstance().delete(Employees).where(eq(Employees.employeeID, id));
}

export async function updateEmployee(id: string, data: Omit<typeof Employees.$inferSelect, 'employeeID'>) {
	return await MySQLConnection.getInstance().update(Employees).set(data).where(eq(Employees.employeeID, id));
}

export async function addRoleToEmployee(data: typeof EmployeeToRoles.$inferInsert) {
	return await MySQLConnection.getInstance().insert(EmployeeToRoles).values(data);
}
