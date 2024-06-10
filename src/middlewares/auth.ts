import { getUserWithID } from 'database/operations/user';
import { doesUserHaveNamedRole } from 'database/operations/user-roles';
import { NextFunction, Request, Response } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { EnvFile } from 'types/env';

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return ErrorFactory.createUnauthorizedError(res, 'Token is missing. Please login first.');
	} else {
		try {
			const userData = jsonwebtoken.verify(authorization, EnvFile.JWT_SIGN_KEY) as JwtPayload & { userID: string; iat: number; exp: number };
			const user = await getUserWithID(userData.userID);
			if (!user) {
				return ErrorFactory.createUnauthorizedError(res, 'Corrupted token! Please login again.');
			}

			req.user = userData;
		} catch (error) {
			return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! Please login first.');
		}
	}

	next();
};

export const employeeAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.user === undefined) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! Please login first.');
	}

	const { userID } = req.user!;

	if (!(await doesUserHaveNamedRole(userID, 'employee')) && !(await doesUserHaveNamedRole(userID, 'owner'))) {
		return ErrorFactory.createForbiddenError(res, 'Forbidden! You are not an employee of this company!');
	}

	next();
};

export const ownerAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.user === undefined) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! Please login first.');
	}

	const { userID } = req.user!;

	if (!(await doesUserHaveNamedRole(userID, 'owner'))) {
		return ErrorFactory.createForbiddenError(res, 'Forbidden! You are not an owner of this company!');
	}

	next();
};

export const systemAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.headers.api_key === undefined) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized!');
	}

	if (req.headers.api_key !== EnvFile.API_KEY) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized!');
	}

	next();
};
