import z from 'zod';

export const EmployeePostBodySchema = z.object({
	userID: z.string().uuid(),
});
