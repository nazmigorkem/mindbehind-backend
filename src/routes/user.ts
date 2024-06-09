import { getUserWithEmail, getUserWithID, insertUser } from 'database/operations/user';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { UserPostBodySchema } from 'types/user';
import { validateData } from 'util/validate';

const UsersRouter = Router();

UsersRouter.get('/:id', async (req, res) => {
	const user = await getUserWithID(req.params.id);
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

	await insertUser(req.body);
	ResponseFactory.createOKResponse(res, 'User created successfully!');
});

export default UsersRouter;
