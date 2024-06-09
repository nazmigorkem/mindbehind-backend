import { decimal, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const Branches = mysqlTable('branches', {
	id: varchar('id', {
		length: 36,
	})
		.$defaultFn(() => crypto.randomUUID())
		.primaryKey(),
	name: varchar('name', {
		length: 30,
	}),
	fullAddress: varchar('full_address', {
		length: 100,
	}),
	latitude: decimal('latitude', {
		precision: 10,
		scale: 8,
	}),
	longitude: decimal('longitude', {
		precision: 11,
		scale: 8,
	}),
	phone: varchar('phone', {
		length: 10,
	}),
});
