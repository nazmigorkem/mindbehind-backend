import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { UserRoles } from './user-roles.schema.js';
import { Users } from './user.schema.js';

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
