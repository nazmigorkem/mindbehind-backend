import z from 'zod';

export const BranchPostBodySchema = z.object({
	name: z.string().max(30),
	fullAddress: z.string().max(100),
	latitude: z.number().max(90).min(-90),
	longitude: z.number().max(180).min(-180),
	phone: z.string().max(10),
});

export const BranchPutBodySchema = BranchPostBodySchema.partial();
