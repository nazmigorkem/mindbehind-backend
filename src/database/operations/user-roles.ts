import { MySQLConnection } from 'database/mysql';
import { UserRoles } from 'database/schemas/user-roles.schema';
import { UserToRoles } from 'database/schemas/user-to-roles.schema';
import { and, eq } from 'drizzle-orm';

export async function getUserRoles() {
	return await MySQLConnection.getInstance().query.UserRoles.findMany();
}

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

export async function doesUserHaveRoleWithID(userID: string, roleID: string) {
	return !!(await MySQLConnection.getInstance().query.UserToRoles.findFirst({
		where: and(eq(UserToRoles.userID, userID), eq(UserToRoles.roleID, roleID)),
	}));
}

export async function doesUserHaveNamedRole(employeeID: string, roleName: string) {
	const role = await getUserRoleWithName(roleName);
	if (!role) {
		return false;
	}

	return !!(await MySQLConnection.getInstance().query.UserToRoles.findFirst({
		where: and(eq(UserToRoles.userID, employeeID), eq(UserToRoles.roleID, role.id)),
	}));
}

export async function insertRoleToUser(data: typeof UserToRoles.$inferInsert) {
	return await MySQLConnection.getInstance().insert(UserToRoles).values(data);
}

export async function deleteRoleFromUser(userID: string, roleID: string) {
	return await MySQLConnection.getInstance()
		.delete(UserToRoles)
		.where(and(eq(UserToRoles.userID, userID), eq(UserToRoles.roleID, roleID)));
}

export async function insertUserRole(data: typeof UserRoles.$inferInsert) {
	const roleID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(UserRoles)
		.values({ ...data, id: roleID });
	return roleID;
}
