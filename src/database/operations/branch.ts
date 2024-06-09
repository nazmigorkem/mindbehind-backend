import { MySQLConnection } from 'database/mysql';
import { Branches } from 'database/schemas/branch.schema';
import { eq } from 'drizzle-orm';

export async function getBranchWithID(id: string) {
	return await (
		await MySQLConnection.getInstance()
	).query.Branches.findFirst({
		where: eq(Branches.id, id),
	});
}

export async function insertBranch(data: typeof Branches.$inferInsert) {
	return await (await MySQLConnection.getInstance()).insert(Branches).values(data);
}

export async function updateBranch(id: string, data: Omit<typeof Branches.$inferSelect, 'id'>) {
	return await (await MySQLConnection.getInstance()).update(Branches).set(data).where(eq(Branches.id, id));
}

export async function deleteBranch(id: string) {
	return await (await MySQLConnection.getInstance()).delete(Branches).where(eq(Branches.id, id));
}
