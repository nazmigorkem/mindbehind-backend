import z from 'zod';

export const UserPostBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().max(30),
	surname: z.string().max(30),
});

export const UserPutBodySchema = UserPostBodySchema.partial();
