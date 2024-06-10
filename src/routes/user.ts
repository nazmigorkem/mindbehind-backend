import { getUserWithEmail, getUserWithID, insertUser } from 'database/operations/user';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { UserPostBodySchema } from 'types/user';
import { validateData } from 'util/validate';

const UsersRouter = Router();

UsersRouter.get('/:userID', async (req, res) => {
	const user = await getUserWithID(req.params.userID);
	if (!user) {
		ErrorFactory.createNotFoundError(res, 'User not found!');
		return;
	}

	ResponseFactory.createOKResponse(res, user);
});

UsersRouter.post('/', validateData(UserPostBodySchema), async (req, res) => {
	const user = await getUserWithEmail(req.body.email);
	if (user) {
		ErrorFactory.createConflictError(res, 'User already exists with the same email address!');
		return;
	}

	// todo: hash password

	const userID = await insertUser(req.body);
	ResponseFactory.createOKResponse(res, { userID });
});

export default UsersRouter;
