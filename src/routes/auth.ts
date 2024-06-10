import crypto from 'crypto';
import { getUserWithEmail } from 'database/operations/user';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import jsonwebtoken from 'jsonwebtoken';
import { AuthPostBodySchema } from 'types/auth';
import { EnvFile } from 'types/env';
import { validateData } from 'util/validate';

const AuthRouter = Router();

AuthRouter.post('/login', validateData(AuthPostBodySchema), async (req, res) => {
	const user = await getUserWithEmail(req.body.email);

	const hashedPassword = crypto.hash('sha256', req.body.password, 'hex');
	if (!user || user.password !== hashedPassword) {
		return ErrorFactory.createUnauthorizedError(res, 'Invalid email or password!');
	}

	const token = jsonwebtoken.sign({ userID: user.id }, EnvFile.JWT_SIGN_KEY, { expiresIn: '1h' });
	return ResponseFactory.createOKResponse(res, { token });
});

export default AuthRouter;
