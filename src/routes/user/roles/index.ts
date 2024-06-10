import {
	deleteUserRole,
	getUserRoleWithName,
	getUserRoleWithRoleID,
	getUserRoles,
	insertUserRole,
	updateUserRole,
} from '#database/operations/user-roles.js';
import { getUserWithRoleID } from '#database/operations/user.js';
import { ErrorFactory } from '#factory/error-factory.js';
import { ResponseFactory } from '#factory/response-factory.js';
import { RolePostBodySchema, RolePutBodySchema } from '#types/roles.js';
import { validateData } from '#util/validate.js';
import { Router } from 'express';

const UserRolesRouter = Router();

UserRolesRouter.get('/', async (req, res) => {
	const roles = await getUserRoles();
	return ResponseFactory.createOKResponse(res, { roles });
});

UserRolesRouter.post('/', validateData(RolePostBodySchema), async (req, res) => {
	const roleName = req.body.name;

	const role = await getUserRoleWithName(roleName);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertUserRole({
		name: roleName,
	});

	return ResponseFactory.createOKResponse(res, { roleID });
});

UserRolesRouter.get('/:roleID', async (req, res) => {
	const roleID = req.params.roleID;

	const role = await getUserRoleWithRoleID(roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

UserRolesRouter.put('/:roleID', validateData(RolePutBodySchema), async (req, res) => {
	const roleName = req.body.name;
	const roleID = req.params.roleID;

	const role = await getUserRoleWithName(roleName);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	if (Object.keys(req.body).length === 0) {
		return ErrorFactory.createBadRequestError(res, 'No data provided to update!');
	}

	await updateUserRole(roleID, {
		name: roleName,
	});

	return ResponseFactory.createOKResponse(res, 'Role updated successfully!');
});

UserRolesRouter.delete('/:roleID', async (req, res) => {
	const roleID = req.params.roleID;

	const role = await getUserRoleWithRoleID(roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	if (role.name === 'owner' || role.name === 'employee') {
		return ErrorFactory.createForbiddenError(res, 'Owner or employee role cannot be deleted.');
	}

	// No need for role existence check. If user does not have it then it is already deleted or non-existent.
	const userWithRole = await getUserWithRoleID(roleID);
	if (userWithRole) {
		return ErrorFactory.createConflictError(res, 'This role is assigned to a user!');
	}

	await deleteUserRole(roleID);

	return ResponseFactory.createOKResponse(res, 'Role deleted successfully!');
});

export default UserRolesRouter;
