import { MySQLConnection } from 'database/mysql';
import { UserRoles } from 'database/schemas/user-roles.schema';
import { eq } from 'drizzle-orm';

export async function getUserRoleWithRoleID(id: string) {
	return await MySQLConnection.getInstance().query.UserRoles.findFirst({
		where: eq(UserRoles.id, id),
	});
}

export async function getUserRoleWithName(name: string) {
	return await MySQLConnection.getInstance().query.UserRoles.findFirst({
		where: eq(UserRoles.name, name),
	});
}

export async function insertUserRole(data: typeof UserRoles.$inferInsert) {
	const roleID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(UserRoles)
		.values({ ...data, id: roleID });
	return roleID;
}
