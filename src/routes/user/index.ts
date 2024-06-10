import {
	deleteRoleFromUser,
	doesUserHaveRoleWithID,
	getUserRoleWithRoleID,
	getUserRolesWithUserID,
	insertRoleToUser,
} from '#database/operations/user-roles.js';
import { deleteUser, getUserWithEmail, getUserWithID, insertUser, updateUser } from '#database/operations/user.js';
import { ErrorFactory } from '#factory/error-factory.js';
import { ResponseFactory } from '#factory/response-factory.js';
import { systemAdminAuth, userAuth } from '#middlewares/auth.js';
import { UserPostBodySchema, UserPutBodySchema } from '#types/user.js';
import { validateData } from '#util/validate.js';
import crypto from 'crypto';
import { Router } from 'express';
import UserRolesRouter from './roles/index.js';

const UsersRouter = Router();

UsersRouter.use('/roles', systemAdminAuth, UserRolesRouter);

UsersRouter.post('/', systemAdminAuth, validateData(UserPostBodySchema), async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const user = await getUserWithEmail(email);
	if (user) {
		return ErrorFactory.createConflictError(res, 'User already exists with the same email address!');
	}

	const hashedPassword = crypto.hash('sha256', password, 'hex');

	const userID = await insertUser({
		...req.body,
		password: hashedPassword,
	});
	ResponseFactory.createOKResponse(res, { userID });
});

UsersRouter.get('/:userID', userAuth, async (req, res) => {
	const userID = req.params.userID;

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	ResponseFactory.createOKResponse(res, user);
});

UsersRouter.get('/me/profile', userAuth, async (req, res) => {
	const userID = req.user!.userID;

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	ResponseFactory.createOKResponse(res, user);
});

UsersRouter.put('/me/profile', userAuth, validateData(UserPutBodySchema), async (req, res) => {
	const userID = req.user!.userID;
	const email = req.body.email;

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	if (Object.keys(req.body).length === 0) {
		return ErrorFactory.createBadRequestError(res, 'No data to update!');
	}

	const existingUser = await getUserWithEmail(email);
	if (existingUser && existingUser.id !== userID && existingUser.email !== user.email) {
		return ErrorFactory.createConflictError(res, 'User already exists with the same email address!');
	}

	if (user.email === email) {
		return ErrorFactory.createConflictError(
			res,
			'You cannot update your email address with the same one. Please provide a different email address.'
		);
	}

	await updateUser(userID, req.body);
	ResponseFactory.createOKResponse(res, 'User updated successfully!');
});

UsersRouter.delete('/:userID', systemAdminAuth, async (req, res) => {
	const userID = req.params.userID;

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	await deleteUser(userID);
	ResponseFactory.createOKResponse(res, 'User deleted successfully!');
});

UsersRouter.get('/:userID/roles', systemAdminAuth, async (req, res) => {
	const userID = req.params.userID;

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	const roles = await getUserRolesWithUserID(userID);
	ResponseFactory.createOKResponse(res, { roles });
});

UsersRouter.post('/:userID/roles/:roleID', systemAdminAuth, async (req, res) => {
	const userID = req.params.userID;
	const roleID = req.params.roleID;

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	const role = await getUserRoleWithRoleID(roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	const doesUserHaveRole = await doesUserHaveRoleWithID(userID, roleID);
	if (doesUserHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'User already has this role.');
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

	const user = await getUserWithID(userID);
	if (!user) {
		return ErrorFactory.createNotFoundError(res, 'User not found!');
	}

	const doesUserHaveRole = await doesUserHaveRoleWithID(userID, roleID);
	if (!doesUserHaveRole) {
		return ErrorFactory.createNotFoundError(res, 'User does not have this role!');
	}

	await deleteRoleFromUser(userID, roleID);

	return ResponseFactory.createOKResponse(res, 'Role removed from user successfully!');
});
export default UsersRouter;
