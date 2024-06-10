import { MySQLConnection } from 'database/mysql';
import { EmployeeRoles } from 'database/schemas/employee-roles.schema';
import { EmployeeToRoles } from 'database/schemas/employee-to-roles.schema';
import { and, eq } from 'drizzle-orm';

export async function getEmployeeRoleWithRoleID(id: string) {
	return await MySQLConnection.getInstance().query.EmployeeRoles.findFirst({
		where: eq(EmployeeRoles.id, id),
	});
}

export async function getEmployeeRoleWithName(name: string) {
	return await MySQLConnection.getInstance().query.EmployeeRoles.findFirst({
		where: eq(EmployeeRoles.name, name),
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

export async function insertRoleToEmployee(data: typeof EmployeeToRoles.$inferInsert) {
	return await MySQLConnection.getInstance().insert(EmployeeToRoles).values(data);
}

export async function insertEmployeeRole(data: typeof EmployeeRoles.$inferInsert) {
	const roleID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(EmployeeRoles)
		.values({ ...data, id: roleID });
	return roleID;
}
