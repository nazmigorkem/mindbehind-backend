import { MySQLConnection } from 'database/mysql';
import { Employees } from 'database/schemas/employees.schema';
import { eq } from 'drizzle-orm';

export async function getEmployeeWithEmployeeID(id: string) {
	return await (
		await MySQLConnection.getInstance()
	).query.Employees.findFirst({
		where: eq(Employees.employeeID, id),
	});
}

export async function getEmployeeWithUserID(id: string) {
	return await (
		await MySQLConnection.getInstance()
	).query.Employees.findFirst({
		where: eq(Employees.userID, id),
	});
}

export async function insertEmployee(data: typeof Employees.$inferInsert) {
	return await (await MySQLConnection.getInstance()).insert(Employees).values(data);
}

export async function updateEmployee(id: string, data: Omit<typeof Employees.$inferSelect, 'employeeID'>) {
	return await (await MySQLConnection.getInstance()).update(Employees).set(data).where(eq(Employees.employeeID, id));
}
