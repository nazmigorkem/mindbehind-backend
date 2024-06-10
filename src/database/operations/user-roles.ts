import { MySQLConnection } from '#database/mysql.js';
import { UserRoles } from '#database/schemas/user-roles.schema.js';
import { UserToRoles } from '#database/schemas/user-to-roles.schema.js';
import { and, eq } from 'drizzle-orm';

export async function getUserRoles() {
	return await MySQLConnection.getInstance().query.UserRoles.findMany();
}

export async function getUserRolesWithUserID(userID: string) {
	return (
		await MySQLConnection.getInstance().query.UserToRoles.findMany({
			where: eq(UserToRoles.userID, userID),
			columns: {
				roleID: true,
			},
		})
	).map((role) => role.roleID);
}

export async function insertUserRole(data: typeof UserRoles.$inferInsert) {
	const roleID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(UserRoles)
		.values({ ...data, id: roleID });
	return roleID;
}

export async function updateUserRole(roleID: string, data: Omit<typeof UserRoles.$inferInsert, 'id'>) {
	await MySQLConnection.getInstance().update(UserRoles).set(data).where(eq(UserRoles.id, roleID));
	return roleID;
}

export async function deleteUserRole(roleID: string) {
	return await MySQLConnection.getInstance().delete(UserRoles).where(eq(UserRoles.id, roleID));
}

export async function getUserRoleWithRoleID(roleID: string) {
	return await MySQLConnection.getInstance().query.UserRoles.findFirst({
		where: eq(UserRoles.id, roleID),
	});
}

export async function getUserRoleWithName(roleName: string) {
	return await MySQLConnection.getInstance().query.UserRoles.findFirst({
		where: eq(UserRoles.name, roleName),
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
