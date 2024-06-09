import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { UserRoles } from './user-roles.schema';
import { Users } from './user.schema';

export const UserToRoles = mysqlTable('user_to_roles', {
	userID: varchar('user_id', {
		length: 36,
	})
		.notNull()
		.references(() => Users.id, { onDelete: 'cascade' }),
	roleID: varchar('role_id', {
		length: 36,
	})
		.notNull()
		.references(() => UserRoles.id),
});
