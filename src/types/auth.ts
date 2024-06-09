import z from 'zod';

export const AuthPostBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

declare global {
	namespace Express {
		export interface Request {
			user?: {
				userID: string;
				iat: number;
				exp: number;
			};
		}
	}
}
