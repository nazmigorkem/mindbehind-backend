import { MySQLConnection } from 'database/mysql';
import { EmployeeRoles } from 'database/schemas/employee-roles.schema';
import { eq } from 'drizzle-orm';

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

export async function insertEmployeeRole(data: typeof EmployeeRoles.$inferInsert) {
	const roleID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(EmployeeRoles)
		.values({ ...data, id: roleID });
	return roleID;
}
