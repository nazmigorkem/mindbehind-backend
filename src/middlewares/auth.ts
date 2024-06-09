import { NextFunction, Request, Response } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { EnvFile } from 'types/env';

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.cookies;
	if (!token) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! Please login first.');
	} else {
		try {
			const user = jsonwebtoken.verify(token, EnvFile.JWT_SIGN_KEY) as JwtPayload & { userID: string; iat: number; exp: number };
			req.user = user;
		} catch (error) {
			return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! Please login first.');
		}
	}

	next();
};
