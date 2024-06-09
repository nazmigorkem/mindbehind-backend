import { MySQLConnection } from 'database/mysql';
import { Users } from 'database/schemas/user.schema';
import { eq } from 'drizzle-orm';

export async function getUserWithID(id: string) {
	return await (
		await MySQLConnection.getInstance()
	).query.Users.findFirst({
		where: eq(Users.id, id),
	});
}

export async function getUserWithEmail(email: string) {
	return await (
		await MySQLConnection.getInstance()
	).query.Users.findFirst({
		where: eq(Users.email, email),
	});
}

export async function insertUser(data: typeof Users.$inferInsert) {
	return await (await MySQLConnection.getInstance()).insert(Users).values(data);
}

export async function updateUser(id: string, data: Omit<typeof Users.$inferSelect, 'id'>) {
	return await (await MySQLConnection.getInstance()).update(Users).set(data).where(eq(Users.id, id));
}

export async function deleteUser(id: string) {
	return await (await MySQLConnection.getInstance()).delete(Users).where(eq(Users.id, id));
}