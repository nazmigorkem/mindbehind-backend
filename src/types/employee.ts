import z from 'zod';

export const EmployeePostBodySchema = z.object({
	userID: z.string().uuid(),
});

export const EmployeeRolePostBodySchema = z.object({
	roleName: z.string().max(30),
});
