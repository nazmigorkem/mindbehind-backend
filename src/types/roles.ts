import z from 'zod';

export const RolePostBodySchema = z.object({
	name: z.string().max(30),
});

export const AddRolePostBodySchema = z.object({
	roleName: z.string().max(30),
});
