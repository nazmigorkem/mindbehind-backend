import { deleteUser, getUserWithEmail, getUserWithID, insertUser, updateUser } from 'database/operations/user';
import { deleteRoleFromUser, doesUserHaveRoleWithID, getUserRolesWithUserID, insertRoleToUser } from 'database/operations/user-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { systemAdminAuth, userAuth } from 'middlewares/auth';
import { UserPostBodySchema, UserPutBodySchema } from 'types/user';
import { validateData } from 'util/validate';
import UserRolesRouter from './roles';

const UsersRouter = Router();

UsersRouter.use('/roles', systemAdminAuth, UserRolesRouter);

UsersRouter.post('/', systemAdminAuth, validateData(UserPostBodySchema), async (req, res) => {
	const user = await getUserWithEmail(req.body.email);
	if (user) {
		return ErrorFactory.createConflictError(res, 'User already exists with the same email address!');
	}

	// todo: hash password

	const userID = await insertUser(req.body);
	ResponseFactory.createOKResponse(res, { userID });
});

UsersRouter.get('/:userID', userAuth, async (req, res) => {
	const user = await getUserWithID(req.params.userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	ResponseFactory.createOKResponse(res, user);
});

UsersRouter.get('/me/profile', userAuth, async (req, res) => {
	const user = await getUserWithID(req.user!.userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	ResponseFactory.createOKResponse(res, user);
});

UsersRouter.put('/me/profile', userAuth, validateData(UserPutBodySchema), async (req, res) => {
	const sessionUserID = req.user!.userID;

	const user = await getUserWithID(sessionUserID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	if (Object.keys(req.body).length === 0) {
		return ErrorFactory.createBadRequestError(res, 'No data to update!');
	}

	const existingUser = await getUserWithEmail(req.body.email);
	if (existingUser && existingUser.id !== sessionUserID && existingUser.email !== user.email) {
		return ErrorFactory.createConflictError(res, 'User already exists with the same email address!');
	}

	if (user.email === req.body.email) {
		return ErrorFactory.createConflictError(
			res,
			'You cannot update your email address with the same one. Please provide a different email address.'
		);
	}

	await updateUser(sessionUserID, req.body);
	ResponseFactory.createOKResponse(res, 'User updated successfully!');
});

UsersRouter.delete('/:userID', systemAdminAuth, async (req, res) => {
	const user = await getUserWithID(req.params.userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	await deleteUser(req.params.userID);
	ResponseFactory.createOKResponse(res, 'User deleted successfully!');
});

UsersRouter.get('/:userID/roles', systemAdminAuth, async (req, res) => {
	const user = await getUserWithID(req.params.userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	const roles = await getUserRolesWithUserID(user.id);
	ResponseFactory.createOKResponse(res, { roles });
});

UsersRouter.post('/:userID/roles/:roleID', systemAdminAuth, async (req, res) => {
	const userID = req.params.userID;
	const roleID = req.params.roleID;
	const doesUserHaveRole = await doesUserHaveRoleWithID(userID, roleID);
	if (doesUserHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'User already has role.');
	}

	await insertRoleToUser({
		userID,
		roleID,
	});

	return ResponseFactory.createOKResponse(res, 'Role added to user successfully!');
});

UsersRouter.delete('/:userID/roles/:roleID', systemAdminAuth, async (req, res) => {
	const userID = req.params.userID;
	const roleID = req.params.roleID;
	const doesUserHaveRole = await doesUserHaveRoleWithID(userID, roleID);
	if (!doesUserHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	await deleteRoleFromUser(userID, roleID);

	return ResponseFactory.createOKResponse(res, 'Role removed from user successfully!');
});
export default UsersRouter;
