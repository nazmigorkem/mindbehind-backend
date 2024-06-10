import { getUserWithRoleID } from 'database/operations/user';
import {
	deleteUserRole,
	getUserRoleWithName,
	getUserRoleWithRoleID,
	getUserRoles,
	insertUserRole,
	updateUserRole,
} from 'database/operations/user-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { RolePostBodySchema, RolePutBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const UserRolesRouter = Router();

UserRolesRouter.get('/', async (req, res) => {
	const roles = await getUserRoles();
	return ResponseFactory.createOKResponse(res, { roles });
});

UserRolesRouter.post('/', validateData(RolePostBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertUserRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

UserRolesRouter.get('/:roleID', async (req, res) => {
	const role = await getUserRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

UserRolesRouter.put('/:roleID', validateData(RolePutBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	if (Object.keys(req.body).length === 0) {
		return ErrorFactory.createBadRequestError(res, 'No data provided to update!');
	}

	const roleID = await updateUserRole(req.params.roleID, req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
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

	const userWithRole = await getUserWithRoleID(roleID);
	if (userWithRole) {
		return ErrorFactory.createConflictError(res, 'Role is assigned to a user!');
	}

	await deleteUserRole(roleID);

	return ResponseFactory.createOKResponse(res, 'Role deleted successfully!');
});

export default UserRolesRouter;
