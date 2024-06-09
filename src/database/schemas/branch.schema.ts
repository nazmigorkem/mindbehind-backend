import { decimal, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const Branches = mysqlTable('branches', {
	id: varchar('id', {
		length: 36,
	})
		.$defaultFn(() => crypto.randomUUID())
		.primaryKey(),
	name: varchar('name', {
		length: 30,
	}).notNull(),
	fullAddress: varchar('full_address', {
		length: 100,
	}).notNull(),
	latitude: decimal('latitude', {
		precision: 10,
		scale: 8,
	}).notNull(),
	longitude: decimal('longitude', {
		precision: 11,
		scale: 8,
	}).notNull(),
	phone: varchar('phone', {
		length: 10,
	}).notNull(),
});
