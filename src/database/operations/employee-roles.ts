import { MySQLConnection } from 'database/mysql';
import { EmployeeRoles } from 'database/schemas/employee-roles.schema';
import { EmployeeToRoles } from 'database/schemas/employee-to-roles.schema';
import { and, eq } from 'drizzle-orm';

export async function getEmployeeRoles() {
	return await MySQLConnection.getInstance().query.EmployeeRoles.findMany();
}

export async function getEmployeeRoleWithRoleID(roleID: string) {
	return await MySQLConnection.getInstance().query.EmployeeRoles.findFirst({
		where: eq(EmployeeRoles.id, roleID),
	});
}

export async function insertEmployeeRole(data: typeof EmployeeRoles.$inferInsert) {
	const roleID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(EmployeeRoles)
		.values({ ...data, id: roleID });
	return roleID;
}

export async function updateEmployeeRole(roleID: string, data: Omit<typeof EmployeeRoles.$inferInsert, 'id'>) {
	await MySQLConnection.getInstance().update(EmployeeRoles).set(data).where(eq(EmployeeRoles.id, roleID));
	return roleID;
}

export async function deleteEmployeeRole(roleID: string) {
	return await MySQLConnection.getInstance().delete(EmployeeRoles).where(eq(EmployeeRoles.id, roleID));
}

export async function deleteRoleFromEmployee(employeeID: string, roleID: string) {
	return await MySQLConnection.getInstance()
		.delete(EmployeeToRoles)
		.where(and(eq(EmployeeToRoles.employeeID, employeeID), eq(EmployeeToRoles.roleID, roleID)));
}

export async function getEmployeeRoleWithName(roleName: string) {
	return await MySQLConnection.getInstance().query.EmployeeRoles.findFirst({
		where: eq(EmployeeRoles.name, roleName),
	});
}

export async function doesEmployeeHaveRoleWithID(employeeID: string, roleID: string) {
	return !!(await MySQLConnection.getInstance().query.EmployeeToRoles.findFirst({
		where: and(eq(EmployeeToRoles.employeeID, employeeID), eq(EmployeeToRoles.roleID, roleID)),
	}));
}

export async function doesEmployeeHaveNamedRole(employeeID: string, roleName: string) {
	const role = await getEmployeeRoleWithName(roleName);
	if (!role) {
		return false;
	}

	return !!(await MySQLConnection.getInstance().query.EmployeeToRoles.findFirst({
		where: and(eq(EmployeeToRoles.employeeID, employeeID), eq(EmployeeToRoles.roleID, role.id)),
	}));
}

export async function insertRoleToEmployee(data: typeof EmployeeToRoles.$inferInsert) {
	return await MySQLConnection.getInstance().insert(EmployeeToRoles).values(data);
}
