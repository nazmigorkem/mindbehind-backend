import z from 'zod';

export const RolePostBodySchema = z.object({
	name: z.string().max(30),
});
