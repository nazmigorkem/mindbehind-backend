import { MySQLConnection } from '#database/mysql.js';
import { UserToRoles } from '#database/schemas/user-to-roles.schema.js';
import { Users } from '#database/schemas/user.schema.js';
import { eq } from 'drizzle-orm';

export async function getUserWithID(id: string) {
	return await MySQLConnection.getInstance().query.Users.findFirst({
		where: eq(Users.id, id),
		columns: {
			id: true,
			email: true,
			name: true,
			surname: true,
		},
	});
}

export async function getUserWithRoleID(roleID: string) {
	return await MySQLConnection.getInstance().query.UserToRoles.findFirst({
		where: eq(UserToRoles.roleID, roleID),
	});
}

export async function getUserWithEmail(email: string) {
	return await MySQLConnection.getInstance().query.Users.findFirst({
		where: eq(Users.email, email),
	});
}

export async function insertUser(data: typeof Users.$inferInsert) {
	const userID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(Users)
		.values({ ...data, id: userID });
	return userID;
}

export async function updateUser(id: string, data: Omit<typeof Users.$inferSelect, 'id'>) {
	return await MySQLConnection.getInstance().update(Users).set(data).where(eq(Users.id, id));
}

export async function deleteUser(id: string) {
	return await MySQLConnection.getInstance().delete(Users).where(eq(Users.id, id));
}
