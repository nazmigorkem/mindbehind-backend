import { employeeHasNamedRole, getEmployeeWithUserID } from 'database/operations/employees';
import { getUserWithID } from 'database/operations/user';
import { NextFunction, Request, Response } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { EnvFile } from 'types/env';

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.cookies;
	if (!token) {
		return ErrorFactory.createUnauthorizedError(res, 'Token is missing. Please login first.');
	} else {
		try {
			const userData = jsonwebtoken.verify(token, EnvFile.JWT_SIGN_KEY) as JwtPayload & { userID: string; iat: number; exp: number };
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

export const ownerAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.user === undefined) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! Please login first.');
	}

	if (req.params.branchID === undefined) {
		return ErrorFactory.createBadRequestError(res, 'Branch ID is required!');
	}

	const { userID: sessionUserID } = req.user!;
	const sessionEmployee = await getEmployeeWithUserID(req.params.branchID, sessionUserID);
	if (!sessionEmployee) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized! You are not an employee of this branch!');
	}

	const hasOwnerRole = await employeeHasNamedRole(sessionEmployee.employeeID, 'owner');
	if (!hasOwnerRole) {
		return ErrorFactory.createForbiddenError(res, 'Forbidden! You are not the owner of this branch!');
	}

	next();
};

export const systemAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.headers.authorization === undefined) {
		return ErrorFactory.createUnauthorizedError(res, 'Unauthorized!');
	}

	next();
};
