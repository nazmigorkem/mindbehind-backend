import { NextFunction, Request, Response } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import z, { ZodError, ZodIssue } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors.map((issue: ZodIssue) => {
					return `${issue.path.join('.')}: ${issue.message.toLowerCase()}`;
				});
				ErrorFactory.createBadRequestError(res, errorMessages);
			} else {
				res.status(503).json({ error: 'Internal Server Error' });
			}
		}
	};
}
