import { getUserRoleWithName, getUserRoleWithRoleID, insertRoleToUser, insertUserRole } from 'database/operations/user-roles';
import { Router } from 'express';
import { ErrorFactory } from 'factory/error-factory';
import { ResponseFactory } from 'factory/response-factory';
import { systemAdminAuth } from 'middlewares/auth';
import { AddRolePostBodySchema, RolePostBodySchema } from 'types/roles';
import { validateData } from 'util/validate';

const UserRolesRouter = Router();

UserRolesRouter.get('/:roleID', async (req, res) => {
	const role = await getUserRoleWithRoleID(req.params.roleID);
	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	return ResponseFactory.createOKResponse(res, role);
});

UserRolesRouter.post('/', systemAdminAuth, validateData(RolePostBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.name);
	if (role) {
		return ErrorFactory.createConflictError(res, 'Role already exists with the same name!');
	}

	const roleID = await insertUserRole(req.body);

	return ResponseFactory.createOKResponse(res, { roleID });
});

UserRolesRouter.post('/:userID', systemAdminAuth, validateData(AddRolePostBodySchema), async (req, res) => {
	const role = await getUserRoleWithName(req.body.roleName);

	if (!role) {
		return ErrorFactory.createNotFoundError(res, 'Role not found!');
	}

	await insertRoleToUser({
		userID: req.params.userID,
		roleID: role.id,
	});

	return ResponseFactory.createOKResponse(res, { roleID: role.id });
});

export default UserRolesRouter;
