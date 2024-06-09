import { MySQLConnection } from 'database/mysql';
import { Branches } from 'database/schemas/branch.schema';
import { eq } from 'drizzle-orm';

export async function getBranchWithID(id: string) {
	return await MySQLConnection.getInstance().query.Branches.findFirst({
		where: eq(Branches.id, id),
	});
}

export async function insertBranch(data: typeof Branches.$inferInsert) {
	const branchID = crypto.randomUUID();
	await MySQLConnection.getInstance()
		.insert(Branches)
		.values({ ...data, id: branchID });
	return branchID;
}

export async function updateBranch(id: string, data: Omit<typeof Branches.$inferSelect, 'id'>) {
	return await MySQLConnection.getInstance().update(Branches).set(data).where(eq(Branches.id, id));
}

export async function deleteBranch(id: string) {
	return await MySQLConnection.getInstance().delete(Branches).where(eq(Branches.id, id));
}
