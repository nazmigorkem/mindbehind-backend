import { z } from 'zod';

export const EnvFileSchema = z.object({
	JWT_SIGN_KEY: z.string(),
	MYSQL_URL: z.string(),
	MODE: z.enum(['DEV', 'PROD', 'TEST']),
});

export const EnvFile = EnvFileSchema.readonly().parse(process.env);
