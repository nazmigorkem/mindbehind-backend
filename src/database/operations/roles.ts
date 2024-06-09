import { MySQLConnection } from 'database/mysql';
import { Roles } from 'database/schemas/roles.schema';
import { eq } from 'drizzle-orm';

export async function getRoleWithRoleID(id: string) {
	return await MySQLConnection.getInstance().query.Roles.findFirst({
		where: eq(Roles.id, id),
	});
}

export async function getRoleWithName(name: string) {
	return await MySQLConnection.getInstance().query.Roles.findFirst({
		where: eq(Roles.name, name),
	});
}

export async function insertRole(data: typeof Roles.$inferInsert) {
	return await MySQLConnection.getInstance().insert(Roles).values(data);
}

export async function updateRole(id: string, data: Omit<typeof Roles.$inferSelect, 'id'>) {
	return await MySQLConnection.getInstance().update(Roles).set(data).where(eq(Roles.id, id));
}

export async function deleteRole(id: string) {
	return await MySQLConnection.getInstance().delete(Roles).where(eq(Roles.id, id));
}
