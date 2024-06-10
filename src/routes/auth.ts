import { getUserWithEmail } from '#database/operations/user.js';
import { ErrorFactory } from '#factory/error-factory.js';
import { ResponseFactory } from '#factory/response-factory.js';
import { AuthPostBodySchema } from '#types/auth.js';
import { EnvFile } from '#types/env.js';
import { validateData } from '#util/validate.js';
import crypto from 'crypto';
import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';

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
